---
name: minio-storage
description: "Upload, download, and manage files in S3-compatible object storage via the MinIO server at {{MINIO_HOST}}:{{MINIO_PORT}}."
metadata:
  openclaw:
    emoji: "📦"
---

# MinIO Storage Skill

MinIO S3-compatible object storage is available at `http://{{MINIO_HOST}}:{{MINIO_PORT}}` within the Docker network. The console UI is at `http://{{MINIO_HOST}}:{{MINIO_CONSOLE_PORT}}`.

## mc CLI Setup

Configure the MinIO client to connect to the local instance:

```bash
mc alias set openclaw http://{{MINIO_HOST}}:{{MINIO_PORT}} $MINIO_ACCESS_KEY $MINIO_SECRET_KEY
```

## Bucket Operations

```bash
# Create a new bucket
mc mb openclaw/my-bucket

# List all buckets
mc ls openclaw

# List contents of a bucket
mc ls openclaw/my-bucket

# Remove an empty bucket
mc rb openclaw/my-bucket
```

## Uploading Files

```bash
# Upload a single file
mc cp /data/output/report.pdf openclaw/my-bucket/reports/report.pdf

# Upload a directory recursively
mc cp --recursive /data/output/images/ openclaw/my-bucket/images/

# Upload with metadata
mc cp --attr "Content-Type=application/pdf;x-amz-meta-source=openclaw" \
  /data/output/report.pdf openclaw/my-bucket/reports/report.pdf
```

## Downloading Files

```bash
# Download a single file
mc cp openclaw/my-bucket/reports/report.pdf /data/input/report.pdf

# Download a directory recursively
mc cp --recursive openclaw/my-bucket/images/ /data/input/images/

# Stream file content to stdout
mc cat openclaw/my-bucket/data/config.json
```

## Using curl with S3 API

For direct HTTP access without the mc CLI:

```bash
# Upload a file via PUT
curl -X PUT "http://{{MINIO_HOST}}:{{MINIO_PORT}}/my-bucket/myfile.txt" \
  --user "$MINIO_ACCESS_KEY:$MINIO_SECRET_KEY" \
  -H "Content-Type: text/plain" \
  --data-binary @/data/output/myfile.txt

# Download a file via GET
curl "http://{{MINIO_HOST}}:{{MINIO_PORT}}/my-bucket/myfile.txt" \
  --user "$MINIO_ACCESS_KEY:$MINIO_SECRET_KEY" \
  -o /data/input/myfile.txt
```

## Presigned URLs

Generate temporary shareable URLs:

```bash
# Generate a presigned URL valid for 7 days
mc share download --expire 168h openclaw/my-bucket/reports/report.pdf

# Generate a presigned upload URL
mc share upload --expire 24h openclaw/my-bucket/uploads/
```

## Bucket Policy

```bash
# Set a bucket to public read
mc anonymous set download openclaw/my-bucket

# Remove public access
mc anonymous set none openclaw/my-bucket
```

## Bucket Naming Conventions

- `openclaw-data` — general data storage
- `openclaw-uploads` — user file uploads
- `openclaw-artifacts` — build/generation artifacts
- `openclaw-backups` — scheduled backup snapshots
- `openclaw-media` — media files (images, video, audio)

## Tips for AI Agents

- Always run `mc alias set` before any `mc` commands to ensure the client is configured.
- Use presigned URLs when sharing files with external services or users instead of making buckets public.
- Set appropriate `Content-Type` headers on upload so files are served correctly when downloaded.
- Use `mc mirror` for syncing directories bidirectionally between local storage and MinIO.
- For large files (>100MB), `mc` automatically uses multipart upload.
- Check MinIO health at `http://{{MINIO_HOST}}:{{MINIO_PORT}}/minio/health/live`.
- Store `$MINIO_ACCESS_KEY` and `$MINIO_SECRET_KEY` in the `.env` file, never hard-code them.
