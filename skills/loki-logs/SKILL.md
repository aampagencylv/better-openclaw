---
name: loki-logs
description: Log aggregation with Grafana Loki
version: 1.0.0
tags: [monitoring, logs, observability, grafana]
---

# Grafana Loki – Log Aggregation

Loki is a horizontally scalable log aggregation system designed to
be cost-effective and easy to operate — "like Prometheus, but for logs."

- **GitHub**: github.com/grafana/loki (25 000+ ⭐)
- **License**: AGPL-3.0
- **Security**: Grafana Labs-backed. No malware.

## Environment Variables

| Variable | Description |
|---|---|
| `{{LOKI_URL}}` | Base URL of the Loki instance |

## Usage Examples

### Push log entries

```bash
curl -s -X POST "{{LOKI_URL}}/loki/api/v1/push" \
  -H "Content-Type: application/json" \
  -d '{"streams": [{"stream": {"app": "myapp"}, "values": [["'$(date +%s)000000000'", "Log message"]]}]}'
```

### Query logs

```bash
curl -s "{{LOKI_URL}}/loki/api/v1/query_range" \
  --data-urlencode 'query={app="myapp"}' \
  --data-urlencode "start=$(date -d '1 hour ago' +%s)000000000"
```

## AI Agent Tips

- Uses labels for indexing, not full-text — extremely cost-effective.
- LogQL query language is similar to PromQL.
- Native integration with Grafana dashboards.
- Pairs with Promtail, Alloy, or Fluentd for log collection.
