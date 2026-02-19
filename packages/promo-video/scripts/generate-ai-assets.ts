import fs from "node:fs/promises";
import path from "node:path";

interface AssetConfig {
  name: string;
  filename: string;
  model: "veo" | "kling" | "runway";
  modelName: string;
  prompt: string;
  duration: number;
  aspectRatio: "16:9" | "9:16";
  notes: string;
}

const assets: AssetConfig[] = [
  {
    name: "Claw Reveal",
    filename: "claw-reveal.mp4",
    model: "veo",
    modelName: "Gemini Veo 3.1",
    prompt: `Cinematic extreme close-up of a chrome metallic lobster claw emerging from a dark digital void filled with flowing green matrix code and Docker container symbols. Camera slowly pulls back revealing the full claw in dramatic lighting. Photorealistic, 4K, moody cyberpunk aesthetic with teal (#00d4aa) and orange (#ff6b35) accent lighting. The claw has realistic texture with reflections. Background has depth with bokeh effect. Smooth camera movement.`,
    duration: 5,
    aspectRatio: "16:9",
    notes:
      "Used in HookScene. This is the opening shot — needs to be visually striking. The lobster claw is the project icon.",
  },
  {
    name: "YAML Chaos",
    filename: "yaml-chaos.mp4",
    model: "kling",
    modelName: "Kling 2.6",
    prompt: `Screen recording style shot of a dark-themed code editor showing a Docker Compose YAML file. The file has 200+ lines scrolling rapidly upward. Red error squiggles appear under lines, error messages pop up: "Port already in use", "Invalid syntax", "Dependency not found". Scrolling becomes faster and more chaotic. Terminal at bottom shows stack traces. High energy, tech frustration aesthetic.`,
    duration: 2,
    aspectRatio: "16:9",
    notes:
      "Used in ProblemScene, cut 1. Quick cut showing config frustration.",
  },
  {
    name: "Dependency Chaos",
    filename: "dependency-chaos.mp4",
    model: "kling",
    modelName: "Kling 2.6",
    prompt: `Abstract 3D isometric visualization of network graph nodes (glowing cubes and spheres) connected by lines, labeled "PostgreSQL", "Redis", "n8n". Initially organized, then connections start breaking (red X symbols), nodes shake erratically, tangled lines cross each other. Red warning triangles appear. System looks on verge of collapse. Dark tech aesthetic with red warnings. Fast-paced.`,
    duration: 2,
    aspectRatio: "16:9",
    notes:
      "Used in ProblemScene, cut 2. Shows dependency management pain.",
  },
  {
    name: "Energy Burst",
    filename: "energy-burst.mp4",
    model: "runway",
    modelName: "Runway Gen-4.5",
    prompt: `Explosive energy burst radiating from center of frame. Particles and light rays in teal (#00d4aa) and orange (#ff6b35) scatter in all directions against pitch black background. Energy waves ripple outward. Glowing particles linger and float. Lens flare effects. High-quality VFX like superhero movie energy effect. High contrast.`,
    duration: 4,
    aspectRatio: "16:9",
    notes:
      "Used in SolutionScene behind the logo reveal. Blended with screen mix mode.",
  },
  {
    name: "Dependency Graph",
    filename: "dependency-graph.mp4",
    model: "kling",
    modelName: "Kling 2.6",
    prompt: `Clean 3D isometric network graph on dark background. Starts with one central node labeled "n8n" appearing with glow effect. Then "PostgreSQL" node appears to the left with animated teal (#00d4aa) glowing connection line. Then "Redis" appears to the right with animated connection. Additional nodes for "Caddy", "Prometheus" appear with connections. All nodes glow with teal and orange accents. Smooth, professional tech visualization.`,
    duration: 6,
    aspectRatio: "16:9",
    notes:
      "Optional enhancement for DependencyShowcase in FeaturesScene. The scene has a code-based fallback.",
  },
];

async function main() {
  const promptsDir = path.join(import.meta.dirname, "prompts");
  await fs.mkdir(promptsDir, { recursive: true });

  console.log("🎬 AI Asset Generation Prompts for better-openclaw Promo Video\n");
  console.log("=".repeat(70) + "\n");

  for (const asset of assets) {
    // Save prompt to JSON
    const promptFile = path.join(promptsDir, `${asset.name.toLowerCase().replace(/\s+/g, "-")}.json`);
    await fs.writeFile(promptFile, JSON.stringify(asset, null, 2));

    console.log(`📹 ${asset.name}`);
    console.log(`   Model:    ${asset.modelName}`);
    console.log(`   Duration: ${asset.duration}s`);
    console.log(`   Aspect:   ${asset.aspectRatio}`);
    console.log(`   Output:   src/assets/ai-generated/${asset.filename}`);
    console.log(`   Notes:    ${asset.notes}`);
    console.log("");
    console.log(`   Prompt:`);
    console.log(`   ${asset.prompt}`);
    console.log("");
    console.log("-".repeat(70) + "\n");
  }

  console.log("✅ All prompts saved to scripts/prompts/\n");
  console.log("Next steps:");
  console.log("  1. Generate assets using each model's platform:");
  console.log("     • Gemini Veo:  https://aistudio.google.com");
  console.log("     • Kling:       https://klingai.com");
  console.log("     • Runway:      https://app.runwayml.com");
  console.log("  2. Download each video clip");
  console.log("  3. Place in: packages/promo-video/src/assets/ai-generated/");
  console.log("  4. Set hasVideo = true in the corresponding scene files");
  console.log("  5. Run: pnpm --filter @better-openclaw/promo-video dev");
  console.log("  6. Preview in Remotion Studio\n");
}

main().catch(console.error);
