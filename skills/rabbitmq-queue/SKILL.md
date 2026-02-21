---
name: rabbitmq-queue
description: Message broker and queuing with RabbitMQ
version: 1.0.0
tags: [messaging, queue, broker, microservices]
---

# RabbitMQ – Message Broker

RabbitMQ is the most widely deployed open-source message broker
supporting AMQP, MQTT, and STOMP protocols.

- **GitHub**: github.com/rabbitmq/rabbitmq-server (13 000+ ⭐)
- **License**: MPL-2.0
- **Security**: VMware/Broadcom-backed. Enterprise-grade. No malware.

## Environment Variables

| Variable | Description |
|---|---|
| `{{RABBITMQ_URL}}` | Management API URL |
| `{{RABBITMQ_USER}}` | Username |
| `{{RABBITMQ_PASSWORD}}` | Password |

## Usage Examples

### List queues

```bash
curl -s -u "{{RABBITMQ_USER}}:{{RABBITMQ_PASSWORD}}" \
  "{{RABBITMQ_URL}}/api/queues"
```

### Publish a message

```bash
curl -s -X POST -u "{{RABBITMQ_USER}}:{{RABBITMQ_PASSWORD}}" \
  "{{RABBITMQ_URL}}/api/exchanges/%2f/amq.default/publish" \
  -H "Content-Type: application/json" \
  -d '{"properties":{},"routing_key":"my_queue","payload":"Hello","payload_encoding":"string"}'
```

## AI Agent Tips

- Supports multiple protocols: AMQP 0-9-1, MQTT, STOMP.
- Management plugin provides REST API and web dashboard.
- Dead letter queues and retry patterns for reliable processing.
- Clustering and federation for high availability.
