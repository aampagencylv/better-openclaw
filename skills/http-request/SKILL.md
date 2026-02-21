---
name: http-request
description: "Make HTTP requests to APIs and web services using curl."
metadata:
  openclaw:
    emoji: "🌐"
---

# HTTP Request

Make HTTP requests using curl within the Docker network.

## GET Request

```bash
curl -X GET "https://api.example.com/data" \
  -H "Authorization: Bearer $TOKEN"
```

## POST Request

```bash
curl -X POST "https://api.example.com/resource" \
  -H "Content-Type: application/json" \
  -d '{"key": "value"}'
```

## File Upload

```bash
curl -X POST "https://api.example.com/upload" \
  -F "file=@/data/input/document.pdf"
```

## Tips for AI Agents

- Use `-i` to include response headers in output.
- Use `-w '%{http_code}'` to capture the HTTP status code.
- Use `-o` to save response body to a file.
- Use `-L` to follow redirects automatically.
