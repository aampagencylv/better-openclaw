---
name: css-alpha-masking
description: "Apply CSS alpha masking with linear-gradient for horizontal or vertical edge fades using mask-image and -webkit-mask-image. Use for fade edges, alpha masks, or CSS mask gradients."
metadata:
  openclaw:
    emoji: "🎭"
    source: "https://github.com/MengTo/Skills"
---

# CSS Alpha Masking Skill

## Horizontal (left/right) fade
```css
mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
-webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
```

## Vertical (top/bottom) fade
```css
mask-image: linear-gradient(to bottom, transparent, black 15%, black 85%, transparent);
-webkit-mask-image: linear-gradient(to bottom, transparent, black 15%, black 85%, transparent);
```

## Usage checklist
- Apply mask styles directly on element or in CSS class
- Always include both `mask-image` and `-webkit-mask-image` for Safari
- Element must have visible content — masks reveal/hide alpha only

## Customization knobs
- **Direction**: `to right`, `to left`, `to bottom`, `to top`
- **Fade depth**: Adjust `15%` and `85%` stops
- **Strength**: Change `transparent` to `rgba(0,0,0,0.2)` for softer fades

## Tips for AI Agents
- Ask which direction the fade should go.
- Confirm if this is for images, text, or container background.
