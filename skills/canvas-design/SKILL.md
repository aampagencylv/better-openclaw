---
name: canvas-design
description: "Create original visual design philosophies and express them as meticulously crafted, museum-quality PNG or PDF art with minimal text — generative art, data visualization, and abstract compositions."
metadata:
  openclaw:
    emoji: "🖌️"
    source: "https://github.com/anthropics/skills"
---

# Canvas Design Skill

## When to use
- Creating generative art and abstract compositions
- Designing visual assets with HTML Canvas or SVG
- Building data visualizations as art
- Creating unique brand assets and illustrations

## Canvas setup
```js
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
const dpr = window.devicePixelRatio || 1;
canvas.width = 1200 * dpr;
canvas.height = 800 * dpr;
canvas.style.width = "1200px";
canvas.style.height = "800px";
ctx.scale(dpr, dpr);
```

## Composition patterns

### Grid-based generative
```js
const cols = 12, rows = 8;
const cellW = 1200 / cols, cellH = 800 / rows;
for (let x = 0; x < cols; x++) {
  for (let y = 0; y < rows; y++) {
    ctx.save();
    ctx.translate(x * cellW + cellW / 2, y * cellH + cellH / 2);
    ctx.rotate(Math.random() * Math.PI);
    // Draw shape
    ctx.fillStyle = `hsl(${200 + Math.random() * 60}, 70%, ${50 + Math.random() * 20}%)`;
    ctx.fillRect(-cellW / 4, -cellH / 4, cellW / 2, cellH / 2);
    ctx.restore();
  }
}
```

### Noise-based organic
```js
// Use simplex/perlin noise for organic patterns
for (let x = 0; x < width; x += 2) {
  for (let y = 0; y < height; y += 2) {
    const n = noise(x * 0.005, y * 0.005);
    const hue = 200 + n * 60;
    ctx.fillStyle = `hsl(${hue}, 60%, ${40 + n * 30}%)`;
    ctx.fillRect(x, y, 2, 2);
  }
}
```

## Export
```js
// PNG
canvas.toBlob((blob) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "artwork.png"; a.click();
}, "image/png");

// High-res: use 3x DPR for print-quality output
```

## Design philosophy
- **Constraint breeds creativity**: Limit colors (3-5), shapes, and rules
- **Randomness with structure**: Random parameters within defined bounds
- **Iteration**: Generate many, curate the best
- **Minimal text**: Let the visual speak

## Tips for AI Agents
- Ask about the desired mood, color palette, and output format.
- Generate multiple variations and let the user choose.
- Consider print resolution (300 DPI) for physical outputs.
