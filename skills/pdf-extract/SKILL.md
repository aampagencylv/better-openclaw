---
name: pdf-extract
description: "Extract text and tables from PDF files using command-line tools in the shared volume at {{SHARED_VOLUME}}."
metadata:
  openclaw:
    emoji: "📕"
---

# PDF Extract

Process PDF files from the shared volume at `{{SHARED_VOLUME}}`.

## Extract Text

```bash
# Extract all text
pdftotext {{SHARED_VOLUME}}/input/document.pdf {{SHARED_VOLUME}}/output/document.txt

# Extract text from specific pages
pdftotext -f 1 -l 5 {{SHARED_VOLUME}}/input/document.pdf {{SHARED_VOLUME}}/output/pages.txt
```

## Get PDF Info

```bash
pdfinfo {{SHARED_VOLUME}}/input/document.pdf
```

## Tips for AI Agents

- Use `pdftotext` (poppler-utils) for reliable text extraction.
- Use `tabula-java` or `camelot` for structured table extraction.
- OCR-scanned PDFs require `tesseract` for text recognition.
