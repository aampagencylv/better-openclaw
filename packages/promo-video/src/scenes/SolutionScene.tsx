import type React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  staticFile,
  OffthreadVideo,
} from "remotion";
import { GlowEffect } from "../components/GlowEffect";
import { ParticleSystem } from "../components/ParticleSystem";
import { COLORS, GRADIENTS } from "../utils/colors";
import { SPRING_CONFIGS } from "../utils/animations";

/**
 * SOLUTION scene (12-20s): Logo reveal with energy burst.
 * Transition from chaos → order. The "better-openclaw" brand appears.
 */
export const SolutionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // White flash at very start (transition from problem)
  const flashOpacity = interpolate(frame, [0, 5, 20], [1, 0.8, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Energy burst background */}
      <Sequence from={10} durationInFrames={230}>
        <EnergyBurstBg />
      </Sequence>

      {/* Particles */}
      <Sequence from={30}>
        <ParticleSystem count={60} speed={0.2} />
      </Sequence>

      {/* Lobster icon spin-in */}
      <Sequence from={20} durationInFrames={220}>
        <LobsterReveal frame={frame - 20} fps={fps} />
      </Sequence>

      {/* Wordmark */}
      <Sequence from={75} durationInFrames={165}>
        <WordmarkReveal frame={frame - 75} fps={fps} />
      </Sequence>

      {/* Glow effects */}
      <GlowEffect color="rgba(0,212,170,0.3)" pulse intensity={50} />
      <GlowEffect
        color="rgba(255,107,53,0.15)"
        position={{ x: "30%", y: "40%" }}
      />

      {/* Transition flash */}
      <AbsoluteFill
        style={{
          backgroundColor: "#ffffff",
          opacity: flashOpacity,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

const EnergyBurstBg: React.FC = () => {
  const frame = useCurrentFrame();
  const hasVideo = false; // Set to true when energy-burst.mp4 is available

  if (hasVideo) {
    return (
      <OffthreadVideo
        src={staticFile("ai-generated/energy-burst.mp4")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          mixBlendMode: "screen",
        }}
      />
    );
  }

  // Animated placeholder: expanding rings
  const ringCount = 5;
  return (
    <AbsoluteFill>
      {Array.from({ length: ringCount }).map((_, i) => {
        const delay = i * 15;
        const progress = interpolate(frame - delay, [0, 90], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const ringSize = progress * 150;
        const ringOpacity = interpolate(progress, [0, 0.3, 1], [0, 0.6, 0]);
        const color = i % 2 === 0 ? COLORS.accent : COLORS.primary;

        return (
          <AbsoluteFill
            key={i}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: `${ringSize}%`,
                height: `${ringSize}%`,
                borderRadius: "50%",
                border: `2px solid ${color}`,
                opacity: ringOpacity,
                boxShadow: `0 0 40px ${color}60`,
              }}
            />
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};

const LobsterReveal: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const scaleSpring = spring({
    frame,
    fps,
    config: SPRING_CONFIGS.bouncy,
  });

  const scale = interpolate(scaleSpring, [0, 1], [0.3, 1]);
  const opacity = interpolate(scaleSpring, [0, 1], [0, 1]);
  const rotation = interpolate(frame, [0, 60], [0, 360], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          fontSize: 180,
          transform: `scale(${scale}) rotate(${rotation}deg)`,
          opacity,
          filter: `drop-shadow(0 0 40px ${COLORS.accent})`,
        }}
      >
        🦞
      </div>
    </AbsoluteFill>
  );
};

const WordmarkReveal: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const titleSpring = spring({
    frame,
    fps,
    config: SPRING_CONFIGS.bouncy,
  });

  const subtitleSpring = spring({
    frame: frame - 20,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const titleY = interpolate(titleSpring, [0, 1], [60, 0]);
  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1]);

  const subtitleY = interpolate(subtitleSpring, [0, 1], [40, 0]);
  const subtitleOpacity = interpolate(subtitleSpring, [0, 1], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 16,
        paddingTop: 240,
      }}
    >
      <h1
        style={{
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: 80,
          fontWeight: 900,
          background: GRADIENTS.brand,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          transform: `translateY(${titleY}px)`,
          opacity: titleOpacity,
          margin: 0,
        }}
      >
        better-openclaw
      </h1>

      <p
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 28,
          color: COLORS.muted,
          transform: `translateY(${subtitleY}px)`,
          opacity: subtitleOpacity,
          margin: 0,
        }}
      >
        Build your superstack in seconds
      </p>
    </AbsoluteFill>
  );
};
