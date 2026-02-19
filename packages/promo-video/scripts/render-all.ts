import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs/promises";

const OUTPUT_DIR = path.join(import.meta.dirname, "..", "out");

const compositions = [
  {
    id: "MainTrailer",
    output: "better-openclaw-trailer-16x9.mp4",
    label: "16:9 Landscape",
  },
  {
    id: "VerticalTrailer",
    output: "better-openclaw-trailer-9x16.mp4",
    label: "9:16 Vertical",
  },
];

async function renderAll() {
  console.log("🎬 better-openclaw Promo Video Render Pipeline\n");

  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  // Bundle the Remotion project
  console.log("📦 Bundling project...");
  const entryPoint = path.join(import.meta.dirname, "..", "src", "index.ts");
  const bundleLocation = await bundle({
    entryPoint,
    onProgress: (progress) => {
      if (progress % 25 === 0) {
        process.stdout.write(`  ${progress}%`);
      }
    },
  });
  console.log("\n✓ Bundle complete\n");

  for (const comp of compositions) {
    console.log(`🎥 Rendering ${comp.label} (${comp.id})...`);
    const outputPath = path.join(OUTPUT_DIR, comp.output);

    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: comp.id,
    });

    await renderMedia({
      composition,
      serveUrl: bundleLocation,
      codec: "h264",
      outputLocation: outputPath,
      audioBitrate: "320k",
      videoBitrate: "8M",
      onProgress: ({ progress }) => {
        const pct = Math.round(progress * 100);
        process.stdout.write(`\r  Rendering: ${pct}%`);
      },
    });

    const stat = await fs.stat(outputPath);
    const sizeMB = (stat.size / (1024 * 1024)).toFixed(1);
    console.log(`\n✓ ${comp.label} → ${comp.output} (${sizeMB} MB)\n`);
  }

  console.log("✅ All renders complete!");
  console.log(`\nOutputs in: ${OUTPUT_DIR}`);
  for (const comp of compositions) {
    console.log(`  • ${comp.output}`);
  }
}

renderAll().catch((err) => {
  console.error("Render failed:", err);
  process.exit(1);
});
