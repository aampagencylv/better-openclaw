---
name: image-ocr
description: "Extract text from images using Tesseract OCR in the shared volume at {{SHARED_VOLUME}}."
metadata:
  openclaw:
    emoji: "👁️"
---

# Image OCR

Extract text from images in the shared volume at `{{SHARED_VOLUME}}`.

## Extract Text

```bash
tesseract {{SHARED_VOLUME}}/input/scan.png {{SHARED_VOLUME}}/output/text
# Output will be at {{SHARED_VOLUME}}/output/text.txt
```

## Multi-language

```bash
tesseract {{SHARED_VOLUME}}/input/scan.png {{SHARED_VOLUME}}/output/text -l eng+fra
```

## Tips for AI Agents

- Pre-process images (grayscale, contrast) for better OCR accuracy.
- Use `--psm` flag to control page segmentation mode.
- Tesseract supports 100+ languages with additional language packs.
