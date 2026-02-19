import type React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { AnimatedText } from "../components/AnimatedText";
import { TerminalWindow } from "../components/TerminalWindow";
import { GlowEffect } from "../components/GlowEffect";
import { COLORS, GRADIENTS } from "../utils/colors";
import { SPRING_CONFIGS } from "../utils/animations";
import { FEATURES_SUB } from "../utils/timing";

/**
 * FEATURES scene (20-45s): Rapid showcase of key features.
 * 4 sub-sequences: CLI, Web Builder, Dependencies, Skill Packs.
 */
export const FeaturesScene: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      <Sequence from={FEATURES_SUB.CLI.offset} durationInFrames={FEATURES_SUB.CLI.duration}>
        <CLIShowcase />
      </Sequence>

      <Sequence from={FEATURES_SUB.WEB.offset} durationInFrames={FEATURES_SUB.WEB.duration}>
        <WebBuilderShowcase />
      </Sequence>

      <Sequence from={FEATURES_SUB.DEPS.offset} durationInFrames={FEATURES_SUB.DEPS.duration}>
        <DependencyShowcase />
      </Sequence>

      <Sequence from={FEATURES_SUB.SKILLS.offset} durationInFrames={FEATURES_SUB.SKILLS.duration}>
        <SkillPacksShowcase />
      </Sequence>
    </AbsoluteFill>
  );
};

/** Feature 1: Interactive CLI Wizard */
const CLIShowcase: React.FC = () => {
  const frame = useCurrentFrame();

  const lines = [
    { delay: 0, text: "$ pnpm create better-openclaw@latest", color: COLORS.accent },
    { delay: 25, text: "", color: COLORS.muted },
    { delay: 30, text: "◆ Project name: my-ai-stack", color: COLORS.foreground },
    { delay: 50, text: "◆ Select services:", color: COLORS.foreground },
    { delay: 60, text: "  ✓ PostgreSQL", color: COLORS.accent },
    { delay: 70, text: "  ✓ Redis", color: COLORS.accent },
    { delay: 80, text: "  ✓ n8n", color: COLORS.accent },
    { delay: 90, text: "  ✓ Qdrant", color: COLORS.accent },
    { delay: 100, text: "  ✓ Ollama", color: COLORS.accent },
    { delay: 115, text: "", color: COLORS.muted },
    { delay: 120, text: "◇ Auto-resolved 2 dependencies", color: COLORS.primary },
    { delay: 140, text: "✓ Generated docker-compose.yml (7 services)", color: COLORS.success },
    { delay: 155, text: "✓ Created .env with secure secrets", color: COLORS.success },
    { delay: 165, text: "✓ Installed 4 OpenClaw skills", color: COLORS.success },
  ];

  return (
    <AbsoluteFill style={{ padding: 60 }}>
      {/* Feature label */}
      <FeatureLabel text="Interactive CLI Wizard" icon="⚡" />

      <div style={{ marginTop: 80 }}>
        <TerminalWindow title="bash">
          {lines.map((line, i) => {
            const visible = frame >= line.delay;
            if (!visible) return null;

            return (
              <AnimatedText
                key={i}
                text={line.text}
                typewriter={i === 0}
                charsPerFrame={1}
                delay={line.delay}
                style={{
                  color: line.color,
                  fontSize: 20,
                  lineHeight: 1.5,
                  minHeight: line.text ? "auto" : 12,
                }}
              />
            );
          })}
        </TerminalWindow>
      </div>

      <GlowEffect color="rgba(0,212,170,0.1)" position={{ x: "50%", y: "70%" }} />
    </AbsoluteFill>
  );
};

/** Feature 2: Visual Web Builder */
const WebBuilderShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const services = [
    { name: "PostgreSQL", icon: "🐘", category: "Database" },
    { name: "Redis", icon: "🔴", category: "Cache" },
    { name: "n8n", icon: "⚡", category: "Automation" },
    { name: "Qdrant", icon: "🔍", category: "Vector DB" },
    { name: "Ollama", icon: "🤖", category: "AI Model" },
    { name: "Caddy", icon: "🔒", category: "Proxy" },
    { name: "Grafana", icon: "📊", category: "Monitoring" },
    { name: "Browserless", icon: "🌐", category: "Browser" },
  ];

  return (
    <AbsoluteFill style={{ padding: 60 }}>
      <FeatureLabel text="Visual Web Builder" icon="🎨" />

      <div
        style={{
          marginTop: 80,
          display: "flex",
          gap: 40,
          height: "calc(100% - 160px)",
        }}
      >
        {/* Service grid (left side) */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            alignContent: "flex-start",
            padding: 24,
            background: `${COLORS.surface}80`,
            borderRadius: 16,
            border: `1px solid ${COLORS.border}`,
          }}
        >
          {services.map((svc, i) => {
            const delay = i * 12;
            const svcSpring = spring({
              frame: frame - delay,
              fps,
              config: SPRING_CONFIGS.snappy,
            });
            const scale = interpolate(svcSpring, [0, 1], [0.5, 1]);
            const opacity = interpolate(svcSpring, [0, 1], [0, 1]);

            return (
              <div
                key={i}
                style={{
                  width: "calc(50% - 8px)",
                  padding: "16px 20px",
                  borderRadius: 12,
                  background: `${COLORS.accent}15`,
                  border: `1px solid ${COLORS.accent}40`,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  transform: `scale(${scale})`,
                  opacity,
                }}
              >
                <span style={{ fontSize: 28 }}>{svc.icon}</span>
                <div>
                  <div
                    style={{
                      color: COLORS.foreground,
                      fontSize: 18,
                      fontWeight: 600,
                      fontFamily: "Inter, system-ui, sans-serif",
                    }}
                  >
                    {svc.name}
                  </div>
                  <div
                    style={{
                      color: COLORS.muted,
                      fontSize: 13,
                      fontFamily: "monospace",
                    }}
                  >
                    {svc.category}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Preview panel (right side) */}
        <div
          style={{
            flex: 1,
            background: `${COLORS.surface}80`,
            borderRadius: 16,
            border: `1px solid ${COLORS.border}`,
            padding: 24,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div
            style={{
              color: COLORS.muted,
              fontSize: 14,
              fontFamily: "monospace",
              textTransform: "uppercase",
              letterSpacing: 2,
            }}
          >
            Live Preview
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: 16 }}>
            {[
              { label: "Services", value: "7" },
              { label: "Skills", value: "4" },
              { label: "Est. RAM", value: "4.2 GB" },
            ].map((stat, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  padding: 16,
                  background: `${COLORS.primary}10`,
                  borderRadius: 8,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    color: COLORS.primary,
                    fontSize: 28,
                    fontWeight: 800,
                    fontFamily: "Inter, system-ui, sans-serif",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    color: COLORS.muted,
                    fontSize: 12,
                    fontFamily: "monospace",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* YAML preview lines */}
          <div
            style={{
              flex: 1,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 14,
              color: COLORS.accent,
              lineHeight: 1.6,
              padding: 16,
              background: COLORS.background,
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <div style={{ color: COLORS.muted }}>services:</div>
            <div>{"  postgresql:"}</div>
            <div style={{ color: COLORS.muted }}>{"    image: postgres:16"}</div>
            <div>{"  redis:"}</div>
            <div style={{ color: COLORS.muted }}>{"    image: redis:7-alpine"}</div>
            <div>{"  n8n:"}</div>
            <div style={{ color: COLORS.muted }}>{"    image: n8nio/n8n"}</div>
            <div>{"  qdrant:"}</div>
            <div style={{ color: COLORS.muted }}>{"    image: qdrant/qdrant"}</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Feature 3: Smart Dependency Resolution */
const DependencyShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const nodes = [
    { id: "n8n", x: 50, y: 25, color: COLORS.primary, delay: 0 },
    { id: "PostgreSQL", x: 25, y: 55, color: COLORS.accent, delay: 30, auto: true },
    { id: "Redis", x: 75, y: 55, color: COLORS.accent, delay: 50, auto: true },
    { id: "Qdrant", x: 15, y: 25, color: COLORS.primary, delay: 70 },
    { id: "Caddy", x: 85, y: 25, color: COLORS.accent, delay: 90, auto: true },
    { id: "Prometheus", x: 50, y: 80, color: COLORS.accent, delay: 110, auto: true },
  ];

  const connections = [
    { from: 0, to: 1, delay: 35 },
    { from: 0, to: 2, delay: 55 },
    { from: 0, to: 4, delay: 95 },
    { from: 3, to: 5, delay: 115 },
  ];

  return (
    <AbsoluteFill style={{ padding: 60 }}>
      <FeatureLabel text="Smart Dependencies" icon="🔗" />

      <AbsoluteFill style={{ top: 100 }}>
        {/* Connection lines */}
        <svg
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
        >
          {connections.map((conn, i) => {
            const from = nodes[conn.from];
            const to = nodes[conn.to];
            const progress = interpolate(frame - conn.delay, [0, 30], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            if (progress <= 0) return null;

            const currentX = from.x + (to.x - from.x) * progress;
            const currentY = from.y + (to.y - from.y) * progress;

            return (
              <g key={i}>
                <line
                  x1={from.x}
                  y1={from.y}
                  x2={currentX}
                  y2={currentY}
                  stroke={COLORS.accent}
                  strokeWidth={0.4}
                  opacity={0.8}
                />
                {/* Animated glow dot traveling along the line */}
                <circle
                  cx={currentX}
                  cy={currentY}
                  r={0.8}
                  fill={COLORS.accent}
                  opacity={progress < 1 ? 1 : 0}
                />
              </g>
            );
          })}
        </svg>

        {/* Nodes */}
        {nodes.map((node, i) => {
          const nodeSpring = spring({
            frame: frame - node.delay,
            fps,
            config: SPRING_CONFIGS.bouncy,
          });
          const scale = interpolate(nodeSpring, [0, 1], [0, 1]);
          const opacity = interpolate(nodeSpring, [0, 1], [0, 1]);

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: `translate(-50%, -50%) scale(${scale})`,
                opacity,
                background: `${node.color}20`,
                border: `2px solid ${node.color}`,
                borderRadius: 12,
                padding: "12px 24px",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span
                style={{
                  color: COLORS.foreground,
                  fontSize: 18,
                  fontWeight: 600,
                  fontFamily: "Inter, system-ui, sans-serif",
                  whiteSpace: "nowrap",
                }}
              >
                {node.id}
              </span>
              {"auto" in node && node.auto && (
                <span
                  style={{
                    fontSize: 11,
                    color: COLORS.accent,
                    fontFamily: "monospace",
                    background: `${COLORS.accent}20`,
                    padding: "2px 6px",
                    borderRadius: 4,
                  }}
                >
                  auto
                </span>
              )}
            </div>
          );
        })}
      </AbsoluteFill>

      <GlowEffect color="rgba(0,212,170,0.1)" position={{ x: "50%", y: "50%" }} />
    </AbsoluteFill>
  );
};

/** Feature 4: Skill Packs */
const SkillPacksShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const skillPacks = [
    { name: "Research Agent", icon: "🔬", services: "SearXNG + Qdrant + Browserless" },
    { name: "Video Creator", icon: "🎬", services: "FFmpeg + Remotion + ComfyUI" },
    { name: "DevOps", icon: "🛠️", services: "Grafana + Prometheus + Portainer" },
    { name: "Knowledge Base", icon: "📚", services: "Qdrant + Docmost + Outline" },
    { name: "AI Playground", icon: "🧠", services: "Ollama + Open WebUI + LiteLLM" },
    { name: "Coding Team", icon: "💻", services: "Claude Code + Codex + Gemini CLI" },
  ];

  return (
    <AbsoluteFill style={{ padding: 60 }}>
      <FeatureLabel text="Skill Packs" icon="📦" />

      <div
        style={{
          marginTop: 80,
          display: "flex",
          flexWrap: "wrap",
          gap: 20,
          justifyContent: "center",
          alignContent: "center",
          height: "calc(100% - 160px)",
        }}
      >
        {skillPacks.map((pack, i) => {
          const delay = i * 15;
          const packSpring = spring({
            frame: frame - delay,
            fps,
            config: SPRING_CONFIGS.bouncy,
          });
          const scale = interpolate(packSpring, [0, 1], [0.5, 1]);
          const opacity = interpolate(packSpring, [0, 1], [0, 1]);

          return (
            <div
              key={i}
              style={{
                width: "calc(33.33% - 14px)",
                padding: 24,
                borderRadius: 16,
                background: `linear-gradient(135deg, ${COLORS.surface} 0%, ${COLORS.background} 100%)`,
                border: `1px solid ${COLORS.border}`,
                transform: `scale(${scale})`,
                opacity,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <span style={{ fontSize: 40 }}>{pack.icon}</span>
              <span
                style={{
                  color: COLORS.foreground,
                  fontSize: 22,
                  fontWeight: 700,
                  fontFamily: "Inter, system-ui, sans-serif",
                }}
              >
                {pack.name}
              </span>
              <span
                style={{
                  color: COLORS.muted,
                  fontSize: 13,
                  fontFamily: "monospace",
                }}
              >
                {pack.services}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** Shared feature label component */
const FeatureLabel: React.FC<{ text: string; icon: string }> = ({
  text,
  icon,
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}
    >
      <span style={{ fontSize: 36 }}>{icon}</span>
      <span
        style={{
          fontSize: 48,
          fontWeight: 800,
          color: COLORS.primary,
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        {text}
      </span>
    </div>
  );
};
