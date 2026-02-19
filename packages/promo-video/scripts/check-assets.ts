import fs from "node:fs/promises";
import path from "node:path";

const ASSETS_DIR = path.join(import.meta.dirname, "..", "src", "assets");

const requiredAssets = {
  "ai-generated": [
    "claw-reveal.mp4",
    "yaml-chaos.mp4",
    "dependency-chaos.mp4",
    "energy-burst.mp4",
    "dependency-graph.mp4",
  ],
  audio: ["music-track.mp3"],
};

async function checkAssets() {
  console.log("📦 Checking promo video assets...\n");

  let totalMissing = 0;
  let totalFound = 0;

  for (const [dir, files] of Object.entries(requiredAssets)) {
    console.log(`${dir}/`);
    for (const file of files) {
      const filePath = path.join(ASSETS_DIR, dir, file);
      try {
        const stat = await fs.stat(filePath);
        const sizeMB = (stat.size / (1024 * 1024)).toFixed(1);
        console.log(`  ✓ ${file} (${sizeMB} MB)`);
        totalFound++;
      } catch {
        console.log(`  ✗ ${file} — MISSING`);
        totalMissing++;
      }
    }
    console.log("");
  }

  console.log(`Found: ${totalFound}  |  Missing: ${totalMissing}\n`);

  if (totalMissing > 0) {
    console.log("⚠️  Some assets are missing.");
    console.log("Run `pnpm generate:prompts` to see AI generation instructions.");
    console.log(
      "The video will use animated placeholders until assets are provided.\n",
    );
  } else {
    console.log("✅ All assets present! Ready to render.\n");
  }
}

checkAssets().catch(console.error);
