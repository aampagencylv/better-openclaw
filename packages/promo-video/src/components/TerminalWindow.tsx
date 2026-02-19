import type React from "react";
import { COLORS } from "../utils/colors";

interface TerminalWindowProps {
  children: React.ReactNode;
  title?: string;
  style?: React.CSSProperties;
}

export const TerminalWindow: React.FC<TerminalWindowProps> = ({
  children,
  title = "terminal",
  style,
}) => {
  return (
    <div
      style={{
        backgroundColor: COLORS.surface,
        border: `2px solid ${COLORS.border}`,
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        ...style,
      }}
    >
      {/* Title bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "12px 16px",
          borderBottom: `1px solid ${COLORS.border}`,
          backgroundColor: "rgba(15,23,42,0.8)",
        }}
      >
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: COLORS.destructive,
          }}
        />
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: COLORS.warning,
          }}
        />
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: COLORS.success,
          }}
        />
        <span
          style={{
            marginLeft: 12,
            fontFamily: "monospace",
            fontSize: 14,
            color: COLORS.muted,
          }}
        >
          {title}
        </span>
      </div>

      {/* Content */}
      <div
        style={{
          padding: 32,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 20,
          lineHeight: 1.6,
          color: COLORS.foreground,
          minHeight: 300,
        }}
      >
        {children}
      </div>
    </div>
  );
};
