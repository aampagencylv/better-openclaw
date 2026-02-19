import type React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { HookScene } from "../scenes/HookScene";
import { ProblemScene } from "../scenes/ProblemScene";
import { SolutionScene } from "../scenes/SolutionScene";
import { FeaturesScene } from "../scenes/FeaturesScene";
import { CTAScene } from "../scenes/CTAScene";
import { SCENES } from "../utils/timing";
import { COLORS } from "../utils/colors";

/**
 * Main 16:9 landscape trailer composition.
 * 60 seconds at 30fps = 1800 frames.
 *
 * Timeline:
 *   0-5s   HOOK       Chrome lobster claw from matrix code
 *   5-12s  PROBLEM    YAML hell, dependency tangles
 *  12-20s  SOLUTION   Logo reveal + energy burst
 *  20-45s  FEATURES   CLI, web builder, deps, skill packs
 *  45-60s  CTA        "Build Your Superstack" + URL
 */
export const MainTrailer: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* TODO: Add <Audio> once music track is sourced */}
      {/* <Audio src={staticFile("audio/music-track.mp3")} volume={0.3} /> */}

      <Sequence from={SCENES.HOOK.start} durationInFrames={SCENES.HOOK.duration}>
        <HookScene />
      </Sequence>

      <Sequence from={SCENES.PROBLEM.start} durationInFrames={SCENES.PROBLEM.duration}>
        <ProblemScene />
      </Sequence>

      <Sequence from={SCENES.SOLUTION.start} durationInFrames={SCENES.SOLUTION.duration}>
        <SolutionScene />
      </Sequence>

      <Sequence from={SCENES.FEATURES.start} durationInFrames={SCENES.FEATURES.duration}>
        <FeaturesScene />
      </Sequence>

      <Sequence from={SCENES.CTA.start} durationInFrames={SCENES.CTA.duration}>
        <CTAScene />
      </Sequence>
    </AbsoluteFill>
  );
};
