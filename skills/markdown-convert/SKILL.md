---
name: markdown-convert
description: "Convert between Markdown and HTML formats using pandoc in the shared volume at {{SHARED_VOLUME}}."
metadata:
  openclaw:
    emoji: "📝"
---

# Markdown Convert

Convert files from the shared volume at `{{SHARED_VOLUME}}`.

## Markdown to HTML

```bash
pandoc -f markdown -t html {{SHARED_VOLUME}}/input/document.md -o {{SHARED_VOLUME}}/output/document.html
```

## HTML to Markdown

```bash
pandoc -f html -t markdown {{SHARED_VOLUME}}/input/page.html -o {{SHARED_VOLUME}}/output/page.md
```

## Tips for AI Agents

- `pandoc` supports 40+ input/output formats (docx, pdf, rst, latex, etc.).
- Use `--template` for custom output formatting.
- GitHub-flavored Markdown: `-f gfm`.
