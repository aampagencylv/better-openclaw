import type React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, random } from "remotion";

interface ParticleSystemProps {
  count?: number;
  colors?: string[];
  speed?: number;
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({
  count = 80,
  colors = ["#ff6b35", "#00d4aa"],
  speed = 0.3,
}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      {Array.from({ length: count }).map((_, i) => {
        const seed = i * 1000;
        const x = random(`x-${seed}`) * 100;
        const baseY = random(`y-${seed}`) * 100;
        const size = random(`size-${seed}`) * 4 + 2;
        const color = colors[Math.floor(random(`color-${seed}`) * colors.length)];
        const particleSpeed = (random(`speed-${seed}`) * 0.5 + 0.2) * speed;
        const drift = Math.sin(frame * 0.02 + random(`drift-${seed}`) * 10) * 2;

        const yOffset = (frame * particleSpeed) % 120 - 10;
        const currentY = baseY - yOffset;
        const opacity = interpolate(
          currentY,
          [-10, 10, 80, 100],
          [0, 0.8, 0.8, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x + drift}%`,
              top: `${currentY}%`,
              width: size,
              height: size,
              borderRadius: "50%",
              backgroundColor: color,
              opacity,
              boxShadow: `0 0 ${size * 3}px ${color}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
