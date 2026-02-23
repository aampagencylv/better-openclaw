---
name: progressive-blur
description: "Create layered progressive blur overlays using stacked backdrop-filter with CSS masks — top or bottom blur, adjustable height, steps, and performance-friendly patterns."
metadata:
  openclaw:
    emoji: "🌫️"
    source: "https://github.com/MengTo/Skills"
---

# Progressive Blur Skill

## When to use
- Smooth blur transitions at top/bottom of sections
- Hero overlays, navigation backgrounds, content fade-outs
- Modern glassmorphism effects

## Usage checklist
- Insert the HTML inside `<body>`
- Keep `.gradient-blur` near the top of the DOM
- Ensure background content exists behind it (backdrop-filter blurs what is behind)
- Adjust `z-index` to sit above content but below modals

## Top blur (from top)
```html
<div class="gradient-blur">
  <div></div><div></div><div></div><div></div><div></div><div></div>
</div>
<style>
  .gradient-blur {
    position: fixed; z-index: 5;
    inset: 0 0 auto 0; height: 12%;
    pointer-events: none;
  }
  .gradient-blur > div, .gradient-blur::before, .gradient-blur::after {
    position: absolute; inset: 0;
  }
  .gradient-blur::before {
    content: ""; z-index: 1; backdrop-filter: blur(0.5px);
    mask: linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 12.5%, rgba(0,0,0,1) 25%, rgba(0,0,0,0) 37.5%);
  }
  /* Additional layers with increasing blur: 1px, 2px, 4px, 8px, 16px, 32px, 64px */
  .gradient-blur::after {
    content: ""; z-index: 8; backdrop-filter: blur(64px);
    mask: linear-gradient(to top, rgba(0,0,0,0) 87.5%, rgba(0,0,0,1) 100%);
  }
</style>
```

## Customization knobs
- **Direction**: Flip `to top` ↔ `to bottom`
- **Height**: Adjust `.gradient-blur` height percentage
- **Strength**: Change blur values (0.5px → 64px)
- **Steps**: Add/remove layers for smoothness control

## Common pitfalls
- `backdrop-filter` needs content behind it — won't blur a flat background
- High blur values are GPU-heavy — reduce steps on low-end devices
- `pointer-events: none` is essential to avoid blocking clicks

## Tips for AI Agents
- Ask whether blur should start from top or bottom.
- Confirm height of blur area.
- Consider performance constraints on mobile devices.
