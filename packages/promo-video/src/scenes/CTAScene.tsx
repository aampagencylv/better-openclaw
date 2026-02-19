import type React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { ParticleSystem } from "../components/ParticleSystem";
import { GlowEffect } from "../components/GlowEffect";
import { COLORS, GRADIENTS } from "../utils/colors";
import { SPRING_CONFIGS } from "../utils/animations";

/**
 * CTA scene (45-60s): "Build Your Superstack" call to action
 * with animated URL reveal and particle effects.
 */
export const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at center, ${COLORS.surface} 0%, ${COLORS.background} 100%)`,
      }}
    >
      {/* Particle background */}
      <ParticleSystem count={100} speed={0.25} />

      {/* Main headline */}
      <Sequence from={0}>
        <Headline frame={frame} fps={fps} />
      </Sequence>

      {/* Stats row */}
      <Sequence from={45} durationInFrames={405}>
        <StatsRow frame={frame - 45} fps={fps} />
      </Sequence>

      {/* URL reveal */}
      <Sequence from={90} durationInFrames={360}>
        <URLReveal frame={frame - 90} fps={fps} />
      </Sequence>

      {/* Lobster icon in corner */}
      <Sequence from={120}>
        <LobsterBadge frame={frame - 120} fps={fps} />
      </Sequence>

      {/* Glow effects */}
      <GlowEffect color="rgba(0,212,170,0.2)" pulse intensity={45} />
      <GlowEffect color="rgba(255,107,53,0.1)" position={{ x: "70%", y: "30%" }} />
    </AbsoluteFill>
  );
};

const Headline: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const titleSpring = spring({
    frame,
    fps,
    config: SPRING_CONFIGS.bouncy,
  });

  const y = interpolate(titleSpring, [0, 1], [100, 0]);
  const opacity = interpolate(titleSpring, [0, 1], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        transform: `translateY(${y}px)`,
        opacity,
        paddingBottom: 200,
      }}
    >
      <h1
        style={{
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: 96,
          fontWeight: 900,
          color: COLORS.foreground,
          textAlign: "center",
          lineHeight: 1.1,
          margin: 0,
        }}
      >
        Build Your
        <br />
        <span
          style={{
            background: GRADIENTS.brand,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Superstack
        </span>
      </h1>
    </AbsoluteFill>
  );
};

const StatsRow: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const stats = [
    { value: "75+", label: "Services" },
    { value: "1", label: "Command" },
    { value: "< 30s", label: "Setup Time" },
  ];

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 60,
        paddingTop: 60,
      }}
    >
      {stats.map((stat, i) => {
        const statSpring = spring({
          frame: frame - i * 10,
          fps,
          config: SPRING_CONFIGS.snappy,
        });
        const scale = interpolate(statSpring, [0, 1], [0.5, 1]);
        const opacity = interpolate(statSpring, [0, 1], [0, 1]);

        return (
          <div
            key={i}
            style={{
              textAlign: "center",
              transform: `scale(${scale})`,
              opacity,
            }}
          >
            <div
              style={{
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: 56,
                fontWeight: 900,
                color: COLORS.accent,
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 18,
                color: COLORS.muted,
                marginTop: 4,
              }}
            >
              {stat.label}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const URLReveal: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const urlSpring = spring({
    frame,
    fps,
    config: SPRING_CONFIGS.bouncy,
  });

  const scale = interpolate(urlSpring, [0, 1], [0.8, 1]);
  const opacity = interpolate(urlSpring, [0, 1], [0, 1]);

  // Pulsing glow
  const glowIntensity = interpolate(
    Math.sin(frame * 0.08),
    [-1, 1],
    [20, 40],
  );

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",
        paddingBottom: 120,
      }}
    >
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 48,
          fontWeight: 700,
          color: COLORS.accent,
          background: `${COLORS.accent}10`,
          border: `2px solid ${COLORS.accent}`,
          borderRadius: 16,
          padding: "24px 56px",
          transform: `scale(${scale})`,
          opacity,
          boxShadow: `0 0 ${glowIntensity}px ${COLORS.accent}60`,
        }}
      >
        better-openclaw.dev
      </div>
    </AbsoluteFill>
  );
};

const LobsterBadge: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const badgeSpring = spring({
    frame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const opacity = interpolate(badgeSpring, [0, 1], [0, 1]);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 40,
        right: 60,
        opacity,
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      <span style={{ fontSize: 36 }}>🦞</span>
      <span
        style={{
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: 18,
          color: COLORS.muted,
          fontWeight: 600,
        }}
      >
        100% Open Source
      </span>
    </div>
  );
};
