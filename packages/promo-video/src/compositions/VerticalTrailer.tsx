import type React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { HookScene } from "../scenes/HookScene";
import { ProblemScene } from "../scenes/ProblemScene";
import { SolutionScene } from "../scenes/SolutionScene";
import { FeaturesScene } from "../scenes/FeaturesScene";
import { CTAScene } from "../scenes/CTAScene";
import { VERTICAL_SCENES } from "../utils/timing";
import { COLORS } from "../utils/colors";

/**
 * 9:16 vertical trailer for social media.
 * 30 seconds at 30fps = 900 frames.
 * Condensed version of MainTrailer with tighter timing.
 */
export const VerticalTrailer: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      <Sequence
        from={VERTICAL_SCENES.HOOK.start}
        durationInFrames={VERTICAL_SCENES.HOOK.duration}
      >
        <HookScene />
      </Sequence>

      <Sequence
        from={VERTICAL_SCENES.PROBLEM.start}
        durationInFrames={VERTICAL_SCENES.PROBLEM.duration}
      >
        <ProblemScene />
      </Sequence>

      <Sequence
        from={VERTICAL_SCENES.SOLUTION.start}
        durationInFrames={VERTICAL_SCENES.SOLUTION.duration}
      >
        <SolutionScene />
      </Sequence>

      <Sequence
        from={VERTICAL_SCENES.FEATURES.start}
        durationInFrames={VERTICAL_SCENES.FEATURES.duration}
      >
        <FeaturesScene />
      </Sequence>

      <Sequence
        from={VERTICAL_SCENES.CTA.start}
        durationInFrames={VERTICAL_SCENES.CTA.duration}
      >
        <CTAScene />
      </Sequence>
    </AbsoluteFill>
  );
};
