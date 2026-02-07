---
name: redis-cache
description: "Cache data, manage sessions, and use pub/sub messaging via the Redis server running at {{REDIS_HOST}}:{{REDIS_PORT}} in your Docker network."
metadata:
  openclaw:
    emoji: "🔴"
---

# Redis Cache Skill

Redis is available at `{{REDIS_HOST}}:{{REDIS_PORT}}` within the Docker network.

## Caching

To cache a value, use the Redis CLI or HTTP API through the sandbox shell:

```bash
redis-cli -h {{REDIS_HOST}} -p {{REDIS_PORT}} -a $REDIS_PASSWORD SET mykey "myvalue" EX 3600
redis-cli -h {{REDIS_HOST}} -p {{REDIS_PORT}} -a $REDIS_PASSWORD GET mykey
```

## Pub/Sub

Publish messages to channels for real-time communication between services.

```bash
# Publish a message to a channel
redis-cli -h {{REDIS_HOST}} -p {{REDIS_PORT}} -a $REDIS_PASSWORD PUBLISH openclaw:events '{"type":"task_complete","id":"abc123"}'

# Subscribe to a channel (in a separate process)
redis-cli -h {{REDIS_HOST}} -p {{REDIS_PORT}} -a $REDIS_PASSWORD SUBSCRIBE openclaw:events
```

## Hash Operations

Store structured data efficiently using Redis hashes:

```bash
# Set multiple fields on a hash
redis-cli -h {{REDIS_HOST}} -p {{REDIS_PORT}} -a $REDIS_PASSWORD HSET openclaw:session:user1 name "Alice" role "admin" last_seen "$(date -Iseconds)"

# Get all fields from a hash
redis-cli -h {{REDIS_HOST}} -p {{REDIS_PORT}} -a $REDIS_PASSWORD HGETALL openclaw:session:user1
```

## List-Based Queues

Use Redis lists as lightweight task queues:

```bash
# Push a task onto the queue
redis-cli -h {{REDIS_HOST}} -p {{REDIS_PORT}} -a $REDIS_PASSWORD LPUSH openclaw:queue:tasks '{"action":"process","file":"input.csv"}'

# Pop a task from the queue (blocking)
redis-cli -h {{REDIS_HOST}} -p {{REDIS_PORT}} -a $REDIS_PASSWORD BRPOP openclaw:queue:tasks 30
```

## Key Patterns

- Use `openclaw:cache:*` prefix for cache entries
- Use `openclaw:session:*` for session data
- Use `openclaw:queue:*` for task queues
- Use `openclaw:lock:*` for distributed locks
- Use `openclaw:rate:*` for rate-limiting counters

## Tips for AI Agents

- Always set a TTL (`EX` for seconds, `PX` for milliseconds) on cache keys to avoid memory leaks.
- Use `SETNX` or `SET ... NX` for distributed locking to prevent race conditions.
- Prefer `MGET`/`MSET` for batch operations to reduce round-trips.
- Check connectivity with `redis-cli -h {{REDIS_HOST}} -p {{REDIS_PORT}} -a $REDIS_PASSWORD PING` before running complex operations.
- Use `SCAN` instead of `KEYS` in production to avoid blocking the server.
