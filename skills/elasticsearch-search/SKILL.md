---
name: elasticsearch-search
description: Full-text search and analytics with Elasticsearch
version: 1.0.0
tags: [search, analytics, database, observability]
---

# Elasticsearch – Full-Text Search Engine

Elasticsearch is a distributed search and analytics engine
for log analytics, full-text search, and application monitoring.

- **GitHub**: github.com/elastic/elasticsearch (72 000+ ⭐)
- **License**: SSPL / Elastic License 2.0
- **Security**: Elastic-backed. Enterprise-grade security. No malware.

## Environment Variables

| Variable | Description |
|---|---|
| `{{ELASTICSEARCH_URL}}` | Elasticsearch cluster URL |
| `{{ELASTICSEARCH_API_KEY}}` | API key (if security enabled) |

## Usage Examples

### Index a document

```bash
curl -s -X POST "{{ELASTICSEARCH_URL}}/my-index/_doc" \
  -H "Authorization: ApiKey {{ELASTICSEARCH_API_KEY}}" \
  -H "Content-Type: application/json" \
  -d '{"title": "Hello", "content": "World", "timestamp": "2025-01-01"}'
```

### Search documents

```bash
curl -s "{{ELASTICSEARCH_URL}}/my-index/_search" \
  -H "Authorization: ApiKey {{ELASTICSEARCH_API_KEY}}" \
  -H "Content-Type: application/json" \
  -d '{"query": {"match": {"content": "world"}}}'
```

## AI Agent Tips

- Sub-second full-text search across billions of documents.
- Aggregations engine for real-time analytics.
- Kibana provides visual dashboards on top of Elasticsearch.
- Vector search support for semantic/AI-powered queries.
