---
name: tinyfish-cookbook
description: Use the Tinyfish API to navigate, extract, and automate any website directly using natural language goals without manual selectors. Perfect for web scraping, competitive analysis, and automated QA.
---

# Tinyfish Cookbook

Tinyfish is an API for state-of-the-art web agents that treat real websites like programmable surfaces. Instead of wrestling with headless browsers, CSS selectors, proxies, and edge cases, Tinyfish handles navigation, forms, filters, and dynamic content automatically.

You simply send a target URL and a natural language goal.

## Quick Start
You do not need an SDK. Tinyfish is accessed directly via a standard HTTP POST request. You must have a `TINYFISH_API_KEY` configured in your environment.

### Using Fetch / cURL (TypeScript Example)
```typescript
const response = await fetch("https://agent.tinyfish.ai/v1/automation/run-sse", {
  method: "POST",
  headers: {
    "X-API-Key": process.env.TINYFISH_API_KEY,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    url: "https://agentql.com",
    goal: "Find all subscription plans and their prices. Return result in json format",
  }),
});

// The endpoint streams Server-Sent Events (SSE). 
// You must handle the stream to capture the final JSON blocks and action updates.
const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  console.log(decoder.decode(value));
}
```

## Core Capabilities
Tinyfish handles the browser internally, including:
- Rotating proxies and stealth profiles
- Multi-step flows, interactive forms, and calendar selections
- Bypassing captchas (where supported)

## When to Use This Skill
You should use the `tinyfish-cookbook` approach whenever the user asks you to:
- "Scrape pricing data from competitor sites."
- "Extract event listings from this JavaScript-heavy website."
- "Log into this portal and download the reports."
- Build utilities like scholarship finders, logistics tracking, or sports betting odds comparison tools.

## Example Goals
Always instruct the API to return structured data if that's what's needed.
- `url`: `https://airbnb.com/s/Tokyo`
- `goal`: `Extract the names, prices per night, and ratings of the top 10 listings. Return as a JSON array.`

## Gotchas
- **Streaming Response**: The `/v1/automation/run-sse` endpoint streams responses back. Ensure your HTTP client handles stream reading (like `iter_lines()` in Python, or `getReader()` in Node.js/Fetch).
- **Timeouts**: Complex multi-step instructions can take longer because a real agent is navigating a real browser. Ensure HTTP request timeouts are generous (e.g., 60-120 seconds).
- **Authentication**: While Tinyfish can navigate login screens, you must provide the login credentials securely within the `goal` prompt or ensure the target site is publicly accessible.
