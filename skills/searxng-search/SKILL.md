---
name: searxng-search
description: "Search the web privately using the SearXNG meta-search engine at {{SEARXNG_HOST}}:{{SEARXNG_PORT}} with aggregated results from multiple search providers."
metadata:
  openclaw:
    emoji: "🔍"
---

# SearXNG Search Skill

SearXNG meta-search engine is available at `http://{{SEARXNG_HOST}}:{{SEARXNG_PORT}}` within the Docker network.

## Basic Search

Perform a web search and get JSON results:

```bash
curl "http://{{SEARXNG_HOST}}:{{SEARXNG_PORT}}/search?q=your+search+query&format=json"
```

## Search with Parameters

Fine-tune results using categories, engines, and language filters:

```bash
# Search specific categories
curl "http://{{SEARXNG_HOST}}:{{SEARXNG_PORT}}/search?q=machine+learning&format=json&categories=science,it"

# Search with specific engines
curl "http://{{SEARXNG_HOST}}:{{SEARXNG_PORT}}/search?q=python+tutorial&format=json&engines=google,duckduckgo,brave"

# Search in a specific language
curl "http://{{SEARXNG_HOST}}:{{SEARXNG_PORT}}/search?q=bonjour&format=json&language=fr"

# Restrict to a time range
curl "http://{{SEARXNG_HOST}}:{{SEARXNG_PORT}}/search?q=latest+news&format=json&time_range=week"
```

## Image Search

```bash
curl "http://{{SEARXNG_HOST}}:{{SEARXNG_PORT}}/search?q=landscape+photography&format=json&categories=images"
```

## News Search

```bash
curl "http://{{SEARXNG_HOST}}:{{SEARXNG_PORT}}/search?q=tech+news&format=json&categories=news&time_range=day"
```

## Paginated Results

```bash
# Get page 2 of results (pageno is 1-indexed)
curl "http://{{SEARXNG_HOST}}:{{SEARXNG_PORT}}/search?q=docker+tutorial&format=json&pageno=2"
```

## Response Structure

Results are returned as JSON with this structure:

```json
{
  "query": "your search query",
  "number_of_results": 12345,
  "results": [
    {
      "url": "https://example.com/article",
      "title": "Article Title",
      "content": "Snippet of the search result content...",
      "engine": "google",
      "category": "general",
      "score": 8.5
    }
  ],
  "suggestions": ["related query 1", "related query 2"],
  "infoboxes": []
}
```

## Available Categories

- `general` — standard web search
- `images` — image search
- `videos` — video search
- `news` — news articles
- `music` — music and audio
- `files` — file downloads
- `it` — IT and tech-specific results
- `science` — academic and scientific content
- `social_media` — social media posts

## Available Time Ranges

- `day` — last 24 hours
- `week` — last 7 days
- `month` — last 30 days
- `year` — last 365 days

## Tips for AI Agents

- Always append `&format=json` to get machine-readable results instead of HTML.
- Combine multiple categories with commas for broader search: `categories=general,it,science`.
- Use `time_range=week` or `time_range=month` when you need recent information.
- Parse the `results` array and use the `score` field to rank relevance.
- For factual queries, cross-reference results from multiple entries in the `results` array.
- Use `suggestions` from the response to refine follow-up searches.
- Check SearXNG health at `http://{{SEARXNG_HOST}}:{{SEARXNG_PORT}}/healthz`.
- Respect rate limits — add a short delay between rapid consecutive searches.
