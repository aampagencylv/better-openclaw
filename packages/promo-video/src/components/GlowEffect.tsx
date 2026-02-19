import type React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

interface GlowEffectProps {
  color?: string;
  intensity?: number;
  pulse?: boolean;
  position?: { x: string; y: string };
}

export const GlowEffect: React.FC<GlowEffectProps> = ({
  color = "rgba(0,212,170,0.2)",
  intensity = 60,
  pulse = false,
  position = { x: "50%", y: "50%" },
}) => {
  const frame = useCurrentFrame();

  const size = pulse
    ? interpolate(
        Math.sin(frame * 0.05),
        [-1, 1],
        [intensity - 10, intensity + 10],
      )
    : intensity;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at ${position.x} ${position.y}, ${color} 0%, transparent ${size}%)`,
        mixBlendMode: "screen",
        pointerEvents: "none",
      }}
    />
  );
};
