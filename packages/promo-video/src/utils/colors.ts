export const COLORS = {
  primary: "#ff6b35",
  accent: "#00d4aa",
  background: "#020617",
  surface: "#0f172a",
  foreground: "#f8fafc",
  muted: "#94a3b8",
  destructive: "#ef4444",
  border: "#1e293b",
  warning: "#f59e0b",
  success: "#10b981",
} as const;

export const GRADIENTS = {
  brand: "linear-gradient(135deg, #ff6b35 0%, #00d4aa 100%)",
  darkOverlay: "linear-gradient(180deg, transparent 0%, rgba(2,6,23,0.8) 100%)",
  redOverlay: "linear-gradient(180deg, transparent 0%, rgba(239,68,68,0.2) 100%)",
  tealGlow: "radial-gradient(circle at 50% 50%, rgba(0,212,170,0.2) 0%, transparent 60%)",
} as const;
