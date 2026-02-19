import type React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  staticFile,
  OffthreadVideo,
  Img,
} from "remotion";
import { GlowEffect } from "../components/GlowEffect";
import { COLORS } from "../utils/colors";
import { SPRING_CONFIGS } from "../utils/animations";

/**
 * HOOK scene (0-5s): Chrome lobster claw emerging from matrix code.
 *
 * Uses AI-generated video `claw-reveal.mp4` as the background.
 * Falls back to an animated placeholder when the asset is missing.
 */
export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: SPRING_CONFIGS.smooth,
  });

  const scale = interpolate(entrance, [0, 1], [1.3, 1]);
  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Try to use AI-generated video, fallback to placeholder
  const hasVideo = false; // Set to true when claw-reveal.mp4 is available

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      {hasVideo ? (
        <OffthreadVideo
          src={staticFile("ai-generated/claw-reveal.mp4")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <HookPlaceholder frame={frame} />
      )}

      <GlowEffect color="rgba(0,212,170,0.25)" pulse position={{ x: "50%", y: "50%" }} />
      <GlowEffect color="rgba(255,107,53,0.15)" position={{ x: "30%", y: "60%" }} />
    </AbsoluteFill>
  );
};

/** Animated placeholder until AI video is generated */
const HookPlaceholder: React.FC<{ frame: number }> = ({ frame }) => {
  const gridOpacity = interpolate(frame, [0, 60], [0.1, 0.4], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at center, ${COLORS.surface} 0%, ${COLORS.background} 100%)`,
      }}
    >
      {/* Matrix-style grid lines */}
      <AbsoluteFill style={{ opacity: gridOpacity }}>
        {Array.from({ length: 20 }).map((_, i) => {
          const y = (i * 60 + frame * 2) % 1200 - 100;
          return (
            <div
              key={`h-${i}`}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: y,
                height: 1,
                background: `linear-gradient(90deg, transparent, ${COLORS.accent}40, transparent)`,
              }}
            />
          );
        })}
        {Array.from({ length: 30 }).map((_, i) => {
          const x = (i * 70 + frame * 0.5) % 2000 - 100;
          return (
            <div
              key={`v-${i}`}
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: x,
                width: 1,
                background: `linear-gradient(180deg, transparent, ${COLORS.accent}30, transparent)`,
              }}
            />
          );
        })}
      </AbsoluteFill>

      {/* Central lobster emoji */}
      <AbsoluteFill
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontSize: 200,
            filter: `drop-shadow(0 0 60px ${COLORS.accent})`,
            transform: `scale(${interpolate(frame, [0, 90], [0.8, 1.1], { extrapolateRight: "clamp" })})`,
          }}
        >
          🦞
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
