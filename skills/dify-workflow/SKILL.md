---
name: dify-workflow
description: "Build and execute AI workflows using Dify's visual builder at {{DIFY_HOST}}:{{DIFY_PORT}}."
metadata:
  openclaw:
    emoji: "🧩"
---

# Dify Workflow Builder

Dify is available at `http://{{DIFY_HOST}}:{{DIFY_PORT}}` within the Docker network.

## Execute a Workflow

```bash
curl -X POST "http://{{DIFY_HOST}}:{{DIFY_PORT}}/v1/workflows/run" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $DIFY_API_KEY" \
  -d '{"inputs": {"query": "Summarize this document"}, "response_mode": "blocking"}'
```

## Chat with an App

```bash
curl -X POST "http://{{DIFY_HOST}}:{{DIFY_PORT}}/v1/chat-messages" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $DIFY_API_KEY" \
  -d '{"inputs": {}, "query": "What is AI?", "response_mode": "streaming", "user": "agent-1"}'
```

## Tips for AI Agents

- Dify supports Chatbot, Agent, and Workflow application types.
- Create RAG-powered apps by uploading documents to knowledge bases.
- Use the streaming response mode for real-time output.
