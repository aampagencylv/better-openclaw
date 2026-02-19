import { spring, interpolate, type SpringConfig } from "remotion";

type PartialSpringConfig = Partial<SpringConfig>;

export const SPRING_CONFIGS = {
  snappy: { damping: 200, stiffness: 300 } as PartialSpringConfig,
  bouncy: { damping: 100, stiffness: 200 } as PartialSpringConfig,
  smooth: { damping: 200, stiffness: 100 } as PartialSpringConfig,
  gentle: { damping: 80, stiffness: 80 } as PartialSpringConfig,
};

export function fadeIn(frame: number, startFrame = 0, duration = 20): number {
  return interpolate(frame - startFrame, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

export function slideUp(
  frame: number,
  fps: number,
  delay = 0,
  config: PartialSpringConfig = SPRING_CONFIGS.bouncy,
): { y: number; opacity: number } {
  const progress = spring({ frame: frame - delay, fps, config });
  return {
    y: interpolate(progress, [0, 1], [80, 0]),
    opacity: interpolate(progress, [0, 1], [0, 1]),
  };
}

export function scaleIn(
  frame: number,
  fps: number,
  delay = 0,
  config: PartialSpringConfig = SPRING_CONFIGS.bouncy,
): { scale: number; opacity: number } {
  const progress = spring({ frame: frame - delay, fps, config });
  return {
    scale: interpolate(progress, [0, 1], [0.5, 1]),
    opacity: interpolate(progress, [0, 1], [0, 1]),
  };
}

export function shake(frame: number, intensity = 3): number {
  return Math.sin(frame * 1.5) * intensity;
}

export function typewriterCount(
  frame: number,
  totalChars: number,
  charsPerFrame = 0.5,
): number {
  return Math.min(Math.floor(frame * charsPerFrame), totalChars);
}
