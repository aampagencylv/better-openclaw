---
name: aura-asset-images
description: "Source Unsplash-style images via Aura's asset library plus curated picks for avatars, portraits, backgrounds, and wallpapers with correct sizes, aspect ratios, and crops for design and marketing use."
metadata:
  openclaw:
    emoji: "📷"
    source: "https://github.com/MengTo/Skills"
---

# Aura Asset Images Skill

## When to use
- Sourcing high-quality stock images for mockups and designs
- Finding avatars, portraits, backgrounds, and wallpapers
- Selecting images with correct aspect ratios for specific use cases
- Creating realistic design mockups without placeholder images

## Image sources
- **Unsplash**: `https://images.unsplash.com/photo-{ID}?w={width}&h={height}&fit=crop`
- **Aura library**: Built-in asset library with curated collections
- **Pexels**: Alternative free stock photography

## Recommended sizes

### Avatars
- **Small**: 40×40px (lists, comments)
- **Medium**: 80×80px (cards, profiles)
- **Large**: 200×200px (profile pages)
- **Aspect ratio**: 1:1 (square)
- **Crop**: `fit=crop&crop=faces` for face centering

### Hero backgrounds
- **Desktop**: 1920×1080px (16:9)
- **Mobile**: 750×1334px (9:16 portrait)
- **Wide**: 2560×600px (ultra-wide banner)
- **Quality**: 80-90% JPEG, or WebP for smaller files

### Card thumbnails
- **Standard**: 400×300px (4:3)
- **Wide**: 600×340px (16:9)
- **Square**: 300×300px (1:1)

### Backgrounds & wallpapers
- **Subtle textures**: Low contrast, muted colors
- **Gradient overlays**: Dark overlay for text readability
- **Abstract**: Geometric or organic patterns

## Unsplash direct URL pattern
```
https://images.unsplash.com/photo-{ID}?w=800&h=600&fit=crop&crop=center&q=80
```

### URL parameters
- `w`: Width in pixels
- `h`: Height in pixels
- `fit`: `crop`, `clamp`, `fill`, `scale`
- `crop`: `center`, `faces`, `top`, `bottom`
- `q`: Quality (1-100)
- `fm`: Format (`webp`, `jpg`, `png`)

## Tips for AI Agents
- Always specify exact dimensions for consistent layouts.
- Use `crop=faces` for portraits and avatars.
- Prefer WebP format (`fm=webp`) for web performance.
- Add dark overlays when placing text over images.
