import type React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { typewriterCount } from "../utils/animations";

interface AnimatedTextProps {
  text: string;
  typewriter?: boolean;
  charsPerFrame?: number;
  delay?: number;
  style?: React.CSSProperties;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  typewriter = false,
  charsPerFrame = 0.5,
  delay = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const adjustedFrame = Math.max(0, frame - delay);

  if (typewriter) {
    const chars = typewriterCount(adjustedFrame, text.length, charsPerFrame);
    const showCursor = adjustedFrame % 16 < 10;

    return (
      <div style={style}>
        {text.substring(0, chars)}
        {chars < text.length && showCursor && (
          <span style={{ opacity: 0.8 }}>_</span>
        )}
      </div>
    );
  }

  const opacity = interpolate(adjustedFrame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const y = interpolate(adjustedFrame, [0, 20], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        ...style,
        opacity,
        transform: `translateY(${y}px)`,
      }}
    >
      {text}
    </div>
  );
};
