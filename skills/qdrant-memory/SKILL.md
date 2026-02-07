---
name: qdrant-memory
description: "Store, search, and manage vector embeddings for semantic memory and similarity search via the Qdrant instance at {{QDRANT_HOST}}:{{QDRANT_PORT}}."
metadata:
  openclaw:
    emoji: "🧠"
---

# Qdrant Memory Skill

Qdrant vector database is available at `http://{{QDRANT_HOST}}:{{QDRANT_PORT}}` within the Docker network.

## Creating a Collection

Before storing vectors, create a collection with the desired vector dimensions:

```bash
curl -X PUT "http://{{QDRANT_HOST}}:{{QDRANT_PORT}}/collections/openclaw_memory" \
  -H "Content-Type: application/json" \
  -d '{
    "vectors": {
      "size": 1536,
      "distance": "Cosine"
    },
    "optimizers_config": {
      "default_segment_number": 2
    }
  }'
```

## Upserting Points

Store vectors with associated metadata payloads:

```bash
curl -X PUT "http://{{QDRANT_HOST}}:{{QDRANT_PORT}}/collections/openclaw_memory/points" \
  -H "Content-Type: application/json" \
  -d '{
    "points": [
      {
        "id": 1,
        "vector": [0.05, 0.61, 0.76, ...],
        "payload": {
          "source": "document.pdf",
          "text": "The quick brown fox jumps over the lazy dog.",
          "created_at": "2025-01-15T10:30:00Z",
          "tags": ["example", "test"]
        }
      }
    ]
  }'
```

## Searching for Similar Vectors

Perform semantic similarity search with optional payload filters:

```bash
curl -X POST "http://{{QDRANT_HOST}}:{{QDRANT_PORT}}/collections/openclaw_memory/points/search" \
  -H "Content-Type: application/json" \
  -d '{
    "vector": [0.2, 0.1, 0.9, ...],
    "limit": 5,
    "with_payload": true,
    "filter": {
      "must": [
        { "key": "tags", "match": { "value": "example" } }
      ]
    }
  }'
```

## Scrolling Through Points

Retrieve points in bulk with pagination:

```bash
curl -X POST "http://{{QDRANT_HOST}}:{{QDRANT_PORT}}/collections/openclaw_memory/points/scroll" \
  -H "Content-Type: application/json" \
  -d '{
    "limit": 100,
    "with_payload": true,
    "with_vector": false
  }'
```

## Deleting Points

Remove specific points by ID or filter:

```bash
curl -X POST "http://{{QDRANT_HOST}}:{{QDRANT_PORT}}/collections/openclaw_memory/points/delete" \
  -H "Content-Type: application/json" \
  -d '{
    "filter": {
      "must": [
        { "key": "source", "match": { "value": "old_document.pdf" } }
      ]
    }
  }'
```

## Listing Collections

```bash
curl "http://{{QDRANT_HOST}}:{{QDRANT_PORT}}/collections"
```

## Collection Patterns

- `openclaw_memory` — long-term agent memory and knowledge base
- `openclaw_documents` — document chunk embeddings for RAG
- `openclaw_conversations` — conversation history embeddings
- `openclaw_code` — code snippet embeddings for search

## Tips for AI Agents

- Match the vector `size` to your embedding model's output dimension (e.g., 1536 for OpenAI `text-embedding-3-small`, 384 for `all-MiniLM-L6-v2`).
- Always include descriptive `payload` fields (source, text, timestamps) so search results are actionable.
- Use payload filters to scope searches and avoid irrelevant results.
- Use `with_vector: false` when scrolling to reduce response size if you only need payloads.
- Create a payload index on frequently filtered fields for faster queries:
  ```bash
  curl -X PUT "http://{{QDRANT_HOST}}:{{QDRANT_PORT}}/collections/openclaw_memory/index" \
    -H "Content-Type: application/json" \
    -d '{ "field_name": "tags", "field_schema": "keyword" }'
  ```
- Check Qdrant health with `curl http://{{QDRANT_HOST}}:{{QDRANT_PORT}}/healthz`.
