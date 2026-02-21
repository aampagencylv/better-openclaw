---
name: playwright-automate
description: "Automate cross-browser testing using Playwright Server at {{PLAYWRIGHT_HOST}}:{{PLAYWRIGHT_PORT}}."
metadata:
  openclaw:
    emoji: "🎭"
---

# Playwright Automation

Playwright Server is available at `ws://{{PLAYWRIGHT_HOST}}:{{PLAYWRIGHT_PORT}}` within the Docker network.

## Connect via Playwright

```javascript
const browser = await playwright.chromium.connect("ws://{{PLAYWRIGHT_HOST}}:{{PLAYWRIGHT_PORT}}");
const page = await browser.newPage();
await page.goto("https://example.com");
const title = await page.title();
```

## Tips for AI Agents

- Supports Chromium, Firefox, and WebKit browsers.
- Built-in auto-waiting eliminates flaky test behavior.
- Network interception for mocking API responses.
- Supports mobile device emulation and geolocation.
