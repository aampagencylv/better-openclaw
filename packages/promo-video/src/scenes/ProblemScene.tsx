import type React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { AnimatedText } from "../components/AnimatedText";
import { TerminalWindow } from "../components/TerminalWindow";
import { COLORS } from "../utils/colors";
import { shake } from "../utils/animations";

/**
 * PROBLEM scene (5-12s): Quick-cut montage of YAML hell, config chaos,
 * dependency tangles. Shows the pain points that better-openclaw solves.
 */
export const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const shakeX = shake(frame, 3);

  const flashOpacity = interpolate(
    frame % 30,
    [0, 3, 6],
    [0, 0.15, 0],
    { extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
        transform: `translateX(${shakeX}px)`,
      }}
    >
      {/* Cut 1: YAML config scrolling (0-70 frames) */}
      <Sequence from={0} durationInFrames={70}>
        <YamlHellCut />
      </Sequence>

      {/* Cut 2: Dependency chaos (70-140 frames) */}
      <Sequence from={70} durationInFrames={70}>
        <DependencyChaos />
      </Sequence>

      {/* Cut 3: Manual setup pain (140-210 frames) */}
      <Sequence from={140} durationInFrames={70}>
        <ManualPain />
      </Sequence>

      {/* Red flash overlay for urgency */}
      <AbsoluteFill
        style={{
          backgroundColor: COLORS.destructive,
          opacity: flashOpacity,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

const YamlHellCut: React.FC = () => {
  const frame = useCurrentFrame();
  const scrollY = frame * 4;

  const yamlLines = [
    "version: '3.8'",
    "services:",
    "  postgresql:",
    "    image: postgres:16-alpine",
    "    environment:",
    "      POSTGRES_USER: admin",
    "      POSTGRES_PASSWORD: ???",
    "      POSTGRES_DB: myapp",
    "    ports:",
    '      - "5432:5432"',
    "    volumes:",
    "      - pg_data:/var/lib/postgresql/data",
    "    networks:",
    "      - backend",
    "    healthcheck:",
    "      test: pg_isready -U admin",
    "      interval: 10s",
    "      timeout: 5s",
    "      retries: 5",
    "  redis:",
    "    image: redis:7-alpine",
    '    command: redis-server --requirepass "???"',
    "    ports:",
    '      - "6379:6379"',
    "    # ERROR: port conflict with local redis",
    "  n8n:",
    "    image: n8nio/n8n:latest",
    "    environment:",
    "      - DB_TYPE=postgresdb",
    "      - DB_POSTGRESDB_HOST=postgresql",
    "      - DB_POSTGRESDB_PORT=5432",
    "      # FIXME: credentials not matching",
    "    depends_on:",
    "      - postgresql  # circular?",
    "      - redis",
    "    # TODO: fix networking",
    "  qdrant:",
    "    image: qdrant/qdrant:latest",
    "    # ERROR: OOM killed last time",
    "    deploy:",
    "      resources:",
    "        limits:",
    "          memory: 2G  # is this enough?",
  ];

  return (
    <AbsoluteFill style={{ padding: 60 }}>
      <TerminalWindow title="docker-compose.yml">
        <div style={{ transform: `translateY(-${scrollY}px)` }}>
          {yamlLines.map((line, i) => (
            <div
              key={i}
              style={{
                color: line.includes("ERROR") || line.includes("FIXME")
                  ? COLORS.destructive
                  : line.includes("???") || line.includes("TODO")
                    ? COLORS.warning
                    : COLORS.muted,
                fontSize: 18,
                lineHeight: 1.5,
                whiteSpace: "pre",
              }}
            >
              {line}
            </div>
          ))}
        </div>
      </TerminalWindow>

      <AnimatedText
        text="Endless configuration..."
        style={{
          position: "absolute",
          bottom: 80,
          left: 0,
          right: 0,
          textAlign: "center",
          color: COLORS.destructive,
          fontSize: 48,
          fontWeight: 800,
          fontFamily: "Inter, system-ui, sans-serif",
          textShadow: `0 0 30px ${COLORS.destructive}`,
        }}
      />
    </AbsoluteFill>
  );
};

const DependencyChaos: React.FC = () => {
  const frame = useCurrentFrame();

  const nodes = [
    { label: "n8n", x: 50, y: 30 },
    { label: "PostgreSQL", x: 20, y: 60 },
    { label: "Redis", x: 80, y: 55 },
    { label: "Qdrant", x: 35, y: 85 },
    { label: "Caddy", x: 65, y: 15 },
    { label: "Ollama", x: 75, y: 80 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Tangled connection lines */}
      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {nodes.map((from, i) =>
          nodes.map((to, j) => {
            if (i >= j) return null;
            const wobble = Math.sin(frame * 0.1 + i + j) * 2;
            return (
              <line
                key={`${i}-${j}`}
                x1={from.x + wobble}
                y1={from.y}
                x2={to.x - wobble}
                y2={to.y}
                stroke={COLORS.destructive}
                strokeWidth={0.3}
                opacity={0.5}
              />
            );
          }),
        )}
      </svg>

      {/* Nodes */}
      {nodes.map((node, i) => {
        const wobbleX = Math.sin(frame * 0.15 + i) * 8;
        const wobbleY = Math.cos(frame * 0.12 + i * 2) * 5;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${node.x}%`,
              top: `${node.y}%`,
              transform: `translate(-50%, -50%) translate(${wobbleX}px, ${wobbleY}px)`,
              background: `${COLORS.destructive}20`,
              border: `2px solid ${COLORS.destructive}`,
              borderRadius: 8,
              padding: "8px 16px",
              color: COLORS.foreground,
              fontSize: 16,
              fontFamily: "monospace",
              whiteSpace: "nowrap",
            }}
          >
            {node.label}
          </div>
        );
      })}

      <AnimatedText
        text="Dependency hell..."
        style={{
          position: "absolute",
          bottom: 40,
          left: 0,
          right: 0,
          textAlign: "center",
          color: COLORS.destructive,
          fontSize: 48,
          fontWeight: 800,
          fontFamily: "Inter, system-ui, sans-serif",
          textShadow: `0 0 30px ${COLORS.destructive}`,
        }}
      />
    </AbsoluteFill>
  );
};

const ManualPain: React.FC = () => {
  const frame = useCurrentFrame();

  const errorMessages = [
    "Error: Port 5432 already in use",
    "FATAL: password authentication failed",
    "Error response from daemon: network not found",
    "Cannot connect to PostgreSQL: connection refused",
    "OOMKilled: container exceeded memory limit",
    "Error: ENOSPC: no space left on device",
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
        padding: 100,
      }}
    >
      {errorMessages.map((msg, i) => {
        const delay = i * 8;
        const msgOpacity = interpolate(frame - delay, [0, 5], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <div
            key={i}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 22,
              color: COLORS.destructive,
              opacity: msgOpacity,
              textShadow: `0 0 10px ${COLORS.destructive}40`,
            }}
          >
            $ {msg}
          </div>
        );
      })}

      <AnimatedText
        text="Manual setup pain..."
        delay={40}
        style={{
          marginTop: 40,
          color: COLORS.destructive,
          fontSize: 48,
          fontWeight: 800,
          fontFamily: "Inter, system-ui, sans-serif",
          textShadow: `0 0 30px ${COLORS.destructive}`,
        }}
      />
    </AbsoluteFill>
  );
};
