---
name: hash-generate
description: "Generate SHA and MD5 hashes for data integrity verification."
metadata:
  openclaw:
    emoji: "🔐"
---

# Hash Generate

Generate cryptographic hashes for data integrity.

## Generate Hashes

```bash
# SHA-256
echo -n "data to hash" | sha256sum

# SHA-512
echo -n "data to hash" | sha512sum

# MD5 (not for security, only checksums)
echo -n "data to hash" | md5sum

# File hash
sha256sum /data/input/file.bin
```

## Tips for AI Agents

- Use SHA-256 or SHA-512 for security-critical hashing.
- MD5 is only suitable for checksums, not security.
- Use `sha256sum -c` with checksum files to verify integrity.
