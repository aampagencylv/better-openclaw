export const FPS = 30;
export const TOTAL_FRAMES = 1800; // 60 seconds
export const VERTICAL_FRAMES = 900; // 30 seconds

export const SCENES = {
  HOOK: { start: 0, duration: 150 },
  PROBLEM: { start: 150, duration: 210 },
  SOLUTION: { start: 360, duration: 240 },
  FEATURES: { start: 600, duration: 750 },
  CTA: { start: 1350, duration: 450 },
} as const;

export const FEATURES_SUB = {
  CLI: { offset: 0, duration: 180 },
  WEB: { offset: 180, duration: 180 },
  DEPS: { offset: 360, duration: 180 },
  SKILLS: { offset: 540, duration: 210 },
} as const;

// Condensed timing for vertical (30s) version
export const VERTICAL_SCENES = {
  HOOK: { start: 0, duration: 90 },
  PROBLEM: { start: 90, duration: 120 },
  SOLUTION: { start: 210, duration: 150 },
  FEATURES: { start: 360, duration: 360 },
  CTA: { start: 720, duration: 180 },
} as const;
