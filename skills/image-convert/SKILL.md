---
name: image-convert
description: "Convert images between formats (PNG, JPG, WebP) using ImageMagick in the shared volume at {{SHARED_VOLUME}}."
metadata:
  openclaw:
    emoji: "🔄"
---

# Image Convert

Convert image formats from the shared volume at `{{SHARED_VOLUME}}`.

## Convert Formats

```bash
convert {{SHARED_VOLUME}}/input/photo.png {{SHARED_VOLUME}}/output/photo.jpg
convert {{SHARED_VOLUME}}/input/photo.jpg -quality 80 {{SHARED_VOLUME}}/output/photo.webp
```

## Batch Convert

```bash
for f in {{SHARED_VOLUME}}/input/*.png; do
  convert "$f" "${f%.png}.webp"
done
```

## Tips for AI Agents

- WebP provides smaller file sizes than JPEG at comparable quality.
- Use `-quality` to control compression (1-100).
- Use `-strip` to remove metadata for smaller file sizes.
