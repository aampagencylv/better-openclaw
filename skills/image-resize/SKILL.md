---
name: image-resize
description: "Resize and crop images using ImageMagick in the shared volume at {{SHARED_VOLUME}}."
metadata:
  openclaw:
    emoji: "🖼️"
---

# Image Resize

Process images from the shared volume at `{{SHARED_VOLUME}}`.

## Resize

```bash
convert {{SHARED_VOLUME}}/input/photo.jpg -resize 800x600 {{SHARED_VOLUME}}/output/resized.jpg
convert {{SHARED_VOLUME}}/input/photo.jpg -resize 50% {{SHARED_VOLUME}}/output/half.jpg
```

## Crop

```bash
convert {{SHARED_VOLUME}}/input/photo.jpg -crop 400x300+100+50 {{SHARED_VOLUME}}/output/cropped.jpg
```

## Tips for AI Agents

- Use `!` after dimensions to force exact size: `-resize 800x600!`.
- Use `-gravity center -extent 800x600` for centered crops with padding.
