---
name: grafana-dashboard
description: "Create and manage monitoring dashboards using Grafana at {{GRAFANA_HOST}}:{{GRAFANA_PORT}}."
metadata:
  openclaw:
    emoji: "📊"
---

# Grafana Dashboard

Grafana is available at `http://{{GRAFANA_HOST}}:{{GRAFANA_PORT}}` within the Docker network.

## Search Dashboards

```bash
curl -X GET "http://{{GRAFANA_HOST}}:{{GRAFANA_PORT}}/api/search?query=" \
  -H "Authorization: Bearer $GRAFANA_API_KEY"
```

## Create Dashboard

```bash
curl -X POST "http://{{GRAFANA_HOST}}:{{GRAFANA_PORT}}/api/dashboards/db" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $GRAFANA_API_KEY" \
  -d '{"dashboard": {"title": "My Dashboard", "panels": []}, "overwrite": false}'
```

## Tips for AI Agents

- Use Grafana's provisioning to define dashboards as code.
- Connect to Prometheus, Loki, InfluxDB, and 100+ data sources.
- Alerting rules can trigger notifications on metric thresholds.
