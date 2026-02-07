---
name: remotion-render
description: "Render programmatic videos using Remotion compositions. Define scenes in React, render to MP4/WebM via the Remotion CLI or API."
metadata:
  openclaw:
    emoji: "🎥"
---

# Remotion Render Skill

Remotion enables programmatic video rendering using React components. Compositions are defined as React components and rendered to video files via the Remotion CLI.

## Project Structure

A typical Remotion project layout:

```
remotion/
├── src/
│   ├── Root.tsx           # Composition registry
│   ├── HelloWorld.tsx     # Example composition
│   └── components/        # Reusable video components
├── remotion.config.ts     # Remotion configuration
├── package.json
└── tsconfig.json
```

## Defining a Composition

Create a video composition as a React component:

```tsx
// src/MyVideo.tsx
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

export const MyVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  const scale = spring({ frame, fps, config: { damping: 10 } });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a", justifyContent: "center", alignItems: "center" }}>
      <h1 style={{ color: "white", fontSize: 80, opacity, transform: `scale(${scale})` }}>
        Hello from OpenClaw
      </h1>
    </AbsoluteFill>
  );
};
```

## Registering Compositions

Register all compositions in the Root component:

```tsx
// src/Root.tsx
import { Composition } from "remotion";
import { MyVideo } from "./MyVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyVideo"
        component={MyVideo}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
```

## Rendering via CLI

```bash
# Render to MP4
npx remotion render src/index.ts MyVideo /data/output/my-video.mp4

# Render to WebM
npx remotion render src/index.ts MyVideo /data/output/my-video.webm --codec=vp8

# Render with custom props
npx remotion render src/index.ts MyVideo /data/output/my-video.mp4 \
  --props='{"title":"Custom Title","color":"#ff6600"}'

# Render specific frame range
npx remotion render src/index.ts MyVideo /data/output/my-video.mp4 \
  --frames=0-90

# Render a still frame (thumbnail)
npx remotion still src/index.ts MyVideo /data/output/thumbnail.png \
  --frame=45
```

## Rendering via API (Node.js)

```typescript
import { bundle } from "@remotion/bundler";
import { renderMedia, getCompositions } from "@remotion/renderer";

const bundled = await bundle({ entryPoint: "./src/index.ts" });

const compositions = await getCompositions(bundled);
const composition = compositions.find((c) => c.id === "MyVideo");

await renderMedia({
  composition,
  serveUrl: bundled,
  codec: "h264",
  outputLocation: "/data/output/my-video.mp4",
  inputProps: { title: "Generated Video" },
});
```

## Using Sequences and Timing

Orchestrate multiple scenes with `<Sequence>`:

```tsx
import { AbsoluteFill, Sequence } from "remotion";
import { Intro } from "./Intro";
import { MainContent } from "./MainContent";
import { Outro } from "./Outro";

export const FullVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={90}>
        <Intro />
      </Sequence>
      <Sequence from={90} durationInFrames={300}>
        <MainContent />
      </Sequence>
      <Sequence from={390} durationInFrames={60}>
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
};
```

## Adding Audio

```tsx
import { Audio, staticFile } from "remotion";

export const VideoWithAudio: React.FC = () => {
  return (
    <AbsoluteFill>
      <Audio src={staticFile("background-music.mp3")} volume={0.5} />
      {/* Visual content */}
    </AbsoluteFill>
  );
};
```

## Dynamic Data-Driven Videos

Pass data as input props for dynamic content:

```tsx
// Composition with typed props
type VideoProps = { items: { title: string; value: number }[] };

export const DataVideo: React.FC<VideoProps> = ({ items }) => {
  const frame = useCurrentFrame();
  const currentIndex = Math.floor(frame / 30) % items.length;

  return (
    <AbsoluteFill style={{ backgroundColor: "#1a1a2e", justifyContent: "center", alignItems: "center" }}>
      <h2 style={{ color: "white", fontSize: 60 }}>{items[currentIndex].title}</h2>
      <p style={{ color: "#e94560", fontSize: 120 }}>{items[currentIndex].value}</p>
    </AbsoluteFill>
  );
};
```

## Output Patterns

- `/data/output/videos/` — rendered video files
- `/data/output/thumbnails/` — still frame captures
- `/data/output/gifs/` — animated GIF exports

## Tips for AI Agents

- Always define `durationInFrames`, `fps`, `width`, and `height` on every `<Composition>`.
- Use `useCurrentFrame()` and `interpolate()` for all animations — avoid CSS animations as they're not frame-accurate.
- Use `spring()` for natural-feeling motion with physics-based easing.
- Pass dynamic data via `--props` JSON on the CLI or `inputProps` in the API for data-driven videos.
- Use `<Sequence>` to stitch multiple scenes together with precise frame timing.
- Render stills with `remotion still` for thumbnails and preview frames.
- For long videos, consider rendering in segments and stitching with FFmpeg.
- Use `concurrency` option in `renderMedia` to speed up rendering on multi-core machines.
