---
name: css-border-gradient
description: "Create CSS gradient borders using the pseudo-element mask technique (mask-composite), including Tailwind-friendly usage and customization of angle, colors, thickness, and radius."
metadata:
  openclaw:
    emoji: "🌈"
    source: "https://github.com/MengTo/Skills"
---

# CSS Border Gradient Skill

## Baseline snippet
```css
.border-gradient { position: relative; }
.border-gradient::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 10px;
  padding: 1px;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  background: linear-gradient(225deg,
    rgba(255,255,255,0.0) 0%,
    rgba(255,255,255,0.2) 50%,
    rgba(255,255,255,0.0) 100%);
  pointer-events: none;
}
```

## Usage checklist
- Insert snippet in global CSS or page `<head>`
- Add `border-gradient` class to the element
- Remove any existing `border` styles
- Match element radius to pseudo-element radius

## Tailwind example
```html
<div class="border-gradient rounded-lg before:rounded-lg">...</div>
```

## Customization knobs
- **Thickness**: Change `padding` (e.g., `2px`)
- **Radius**: Change `border-radius` or `before:rounded-*` class
- **Angle**: Change `linear-gradient(225deg, ...)` angle
- **Colors**: Adjust `rgba(...)` stops to fit theme

## Common pitfalls
- Mismatched radius between element and pseudo-element
- Leaving an existing border on the element (double border)
- Tailwind purge removing the class

## Tips for AI Agents
- Ask about border radius, thickness, gradient angle, and colors.
- Confirm light/dark theme support needs.
