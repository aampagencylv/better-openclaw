---
name: system-info
description: "Monitor system resources including CPU, memory, disk, and network usage."
metadata:
  openclaw:
    emoji: "🖥️"
---

# System Info

Monitor system resources within the Docker container.

## CPU and Memory

```bash
# Overview
top -bn1 | head -20

# Memory usage
free -h

# CPU info
nproc
cat /proc/cpuinfo | grep "model name" | head -1
```

## Disk

```bash
# Disk usage
df -h

# Directory sizes
du -sh /data/*
```

## Network

```bash
# Network interfaces
ip addr show

# Active connections
ss -tuln
```

## Tips for AI Agents

- Use `top -bn1` for non-interactive snapshot of processes.
- Monitor memory with `free -h` for human-readable output.
- Check disk space before large file operations.
