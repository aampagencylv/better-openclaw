import React from "react";
import { Composition } from "remotion";
import { MainTrailer } from "./compositions/MainTrailer";
import { VerticalTrailer } from "./compositions/VerticalTrailer";
import { FPS, TOTAL_FRAMES, VERTICAL_FRAMES } from "./utils/timing";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 16:9 Landscape — website embed + YouTube */}
      <Composition
        id="MainTrailer"
        component={MainTrailer}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
      />

      {/* 9:16 Vertical — TikTok, Reels, YouTube Shorts */}
      <Composition
        id="VerticalTrailer"
        component={VerticalTrailer}
        durationInFrames={VERTICAL_FRAMES}
        fps={FPS}
        width={1080}
        height={1920}
      />
    </>
  );
};
