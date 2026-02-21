---
name: postgresql-query
description: "Execute SQL queries, manage schemas, and perform data operations using PostgreSQL at {{POSTGRES_HOST}}:{{POSTGRES_PORT}}."
metadata:
  openclaw:
    emoji: "🐘"
---

# PostgreSQL Query

PostgreSQL is available at `{{POSTGRES_HOST}}:{{POSTGRES_PORT}}` within the Docker network.

## Running SQL Queries

```bash
# Execute a query
PGPASSWORD=$POSTGRES_PASSWORD psql -h {{POSTGRES_HOST}} -p {{POSTGRES_PORT}} -U {{POSTGRES_USER}} -d {{POSTGRES_DB}} \
  -c "SELECT * FROM users LIMIT 10;"

# Execute from a SQL file
PGPASSWORD=$POSTGRES_PASSWORD psql -h {{POSTGRES_HOST}} -p {{POSTGRES_PORT}} -U {{POSTGRES_USER}} -d {{POSTGRES_DB}} \
  -f /data/queries/report.sql
```

## Creating Tables

```bash
PGPASSWORD=$POSTGRES_PASSWORD psql -h {{POSTGRES_HOST}} -p {{POSTGRES_PORT}} -U {{POSTGRES_USER}} -d {{POSTGRES_DB}} -c "
CREATE TABLE IF NOT EXISTS documents (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  embedding vector(384),
  created_at TIMESTAMPTZ DEFAULT NOW()
);"
```

## Importing and Exporting Data

```bash
# Export to CSV
PGPASSWORD=$POSTGRES_PASSWORD psql -h {{POSTGRES_HOST}} -p {{POSTGRES_PORT}} -U {{POSTGRES_USER}} -d {{POSTGRES_DB}} \
  -c "\COPY (SELECT * FROM users) TO '/data/output/users.csv' WITH CSV HEADER"

# Import from CSV
PGPASSWORD=$POSTGRES_PASSWORD psql -h {{POSTGRES_HOST}} -p {{POSTGRES_PORT}} -U {{POSTGRES_USER}} -d {{POSTGRES_DB}} \
  -c "\COPY users FROM '/data/input/users.csv' WITH CSV HEADER"
```

## Tips for AI Agents

- Always use parameterized queries to prevent SQL injection.
- Use `\dt` to list tables, `\d table_name` to describe a table schema.
- Use transactions (`BEGIN; ... COMMIT;`) for multi-step operations.
- Use `EXPLAIN ANALYZE` to understand query performance.
- The pgvector extension enables vector similarity search.
