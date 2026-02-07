"use client";

import { useMemo } from "react";
import type { ResolverOutput } from "@better-openclaw/core";

// ── Types ───────────────────────────────────────────────────────────────────

interface GraphNode {
  id: string;
  name: string;
  icon: string;
  layer: number;
  x: number;
  y: number;
}

interface GraphEdge {
  from: string;
  to: string;
}

interface DependencyGraphProps {
  resolverOutput: ResolverOutput | null;
}

// ── Constants ───────────────────────────────────────────────────────────────

const NODE_WIDTH = 140;
const NODE_HEIGHT = 40;
const LAYER_GAP_Y = 80;
const NODE_GAP_X = 20;
const PADDING = 30;

// ── Component ───────────────────────────────────────────────────────────────

export function DependencyGraph({ resolverOutput }: DependencyGraphProps) {
  const { nodes, edges, svgWidth, svgHeight } = useMemo(() => {
    if (!resolverOutput || resolverOutput.services.length === 0) {
      return { nodes: [], edges: [], svgWidth: 0, svgHeight: 0 };
    }

    const services = resolverOutput.services;
    const serviceMap = new Map(services.map((s) => [s.definition.id, s]));

    // Collect all edges from requires + dependsOn
    const allEdges: GraphEdge[] = [];
    const inDegree = new Map<string, number>();

    for (const s of services) {
      inDegree.set(s.definition.id, 0);
    }

    for (const s of services) {
      const deps = [
        ...s.definition.requires,
        ...s.definition.dependsOn,
      ].filter((id) => serviceMap.has(id));

      for (const depId of deps) {
        allEdges.push({ from: depId, to: s.definition.id });
        inDegree.set(
          s.definition.id,
          (inDegree.get(s.definition.id) ?? 0) + 1
        );
      }
    }

    // Topological sort to assign layers
    const layers: string[][] = [];
    const assigned = new Set<string>();
    const remaining = new Set(services.map((s) => s.definition.id));

    while (remaining.size > 0) {
      // Find nodes with no unresolved deps in the remaining set
      const layer: string[] = [];

      for (const id of remaining) {
        const hasUnresolvedDep = allEdges.some(
          (e) => e.to === id && !assigned.has(e.from)
        );
        if (!hasUnresolvedDep) {
          layer.push(id);
        }
      }

      // Safety: if no nodes can be placed (cycle), dump all remaining into current layer
      if (layer.length === 0) {
        layer.push(...remaining);
      }

      for (const id of layer) {
        remaining.delete(id);
        assigned.add(id);
      }

      layers.push(layer);
    }

    // Position nodes
    const graphNodes: GraphNode[] = [];
    let maxLayerWidth = 0;

    for (let layerIdx = 0; layerIdx < layers.length; layerIdx++) {
      const layer = layers[layerIdx];
      const layerWidth =
        layer.length * NODE_WIDTH + (layer.length - 1) * NODE_GAP_X;
      if (layerWidth > maxLayerWidth) maxLayerWidth = layerWidth;
    }

    const totalWidth = maxLayerWidth + PADDING * 2;

    for (let layerIdx = 0; layerIdx < layers.length; layerIdx++) {
      const layer = layers[layerIdx];
      const layerWidth =
        layer.length * NODE_WIDTH + (layer.length - 1) * NODE_GAP_X;
      const offsetX = (totalWidth - layerWidth) / 2;

      for (let i = 0; i < layer.length; i++) {
        const svc = serviceMap.get(layer[i]);
        if (!svc) continue;
        graphNodes.push({
          id: svc.definition.id,
          name: svc.definition.name,
          icon: svc.definition.icon,
          layer: layerIdx,
          x: offsetX + i * (NODE_WIDTH + NODE_GAP_X),
          y: PADDING + layerIdx * (NODE_HEIGHT + LAYER_GAP_Y),
        });
      }
    }

    const totalHeight =
      PADDING * 2 +
      layers.length * NODE_HEIGHT +
      (layers.length - 1) * LAYER_GAP_Y;

    return {
      nodes: graphNodes,
      edges: allEdges,
      svgWidth: Math.max(totalWidth, 300),
      svgHeight: Math.max(totalHeight, 120),
    };
  }, [resolverOutput]);

  // Placeholder when no data
  if (!resolverOutput || resolverOutput.services.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-border bg-surface/30 p-8">
        <p className="text-sm text-muted-foreground">
          Select services to see the dependency graph...
        </p>
      </div>
    );
  }

  if (nodes.length === 0) {
    return null;
  }

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  return (
    <div className="overflow-auto rounded-xl border border-border bg-[#0D1117] p-2">
      <svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="mx-auto block max-w-full"
        style={{ minWidth: Math.min(svgWidth, 300) }}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="8"
            markerHeight="6"
            refX="8"
            refY="3"
            orient="auto"
          >
            <polygon
              points="0 0, 8 3, 0 6"
              fill="var(--color-accent, #FF6B35)"
            />
          </marker>
        </defs>

        {/* Edges */}
        {edges.map((edge, i) => {
          const fromNode = nodeMap.get(edge.from);
          const toNode = nodeMap.get(edge.to);
          if (!fromNode || !toNode) return null;

          const x1 = fromNode.x + NODE_WIDTH / 2;
          const y1 = fromNode.y + NODE_HEIGHT;
          const x2 = toNode.x + NODE_WIDTH / 2;
          const y2 = toNode.y;

          // Curved path
          const midY = (y1 + y2) / 2;

          return (
            <path
              key={`edge-${i}`}
              d={`M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`}
              fill="none"
              stroke="var(--color-accent, #FF6B35)"
              strokeWidth="1.5"
              strokeOpacity="0.5"
              markerEnd="url(#arrowhead)"
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => (
          <g key={node.id}>
            {/* Node background */}
            <rect
              x={node.x}
              y={node.y}
              width={NODE_WIDTH}
              height={NODE_HEIGHT}
              rx={8}
              ry={8}
              fill="var(--color-surface, #1A1F2E)"
              stroke="var(--color-border, #2A2F3E)"
              strokeWidth="1"
            />
            {/* Icon */}
            <text
              x={node.x + 12}
              y={node.y + NODE_HEIGHT / 2 + 1}
              dominantBaseline="middle"
              textAnchor="start"
              fontSize="14"
            >
              {node.icon}
            </text>
            {/* Name */}
            <text
              x={node.x + 30}
              y={node.y + NODE_HEIGHT / 2 + 1}
              dominantBaseline="middle"
              textAnchor="start"
              fill="var(--color-foreground, #E5E7EB)"
              fontSize="11"
              fontFamily="Inter, system-ui, sans-serif"
              fontWeight="500"
            >
              {node.name.length > 14
                ? node.name.slice(0, 13) + "…"
                : node.name}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
