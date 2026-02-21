---
name: langchain-agent
description: Build AI agents with LangChain framework
version: 1.0.0
tags: [ai, agents, llm, rag, framework]
---

# LangChain – AI Agent Framework

LangChain is the foundational framework for building AI agents with
tool integration, memory, chain-of-thought reasoning, and RAG.

- **GitHub**: github.com/langchain-ai/langchain (112 000+ ⭐)
- **License**: MIT
- **Security**: Sequoia-backed. Active security team. No malware.

## Environment Variables

| Variable | Description |
|---|---|
| `{{LANGSERVE_URL}}` | Base URL of a LangServe deployment |

## Usage Examples

### Invoke a LangServe chain

```bash
curl -s -X POST "{{LANGSERVE_URL}}/invoke" \
  -H "Content-Type: application/json" \
  -d '{"input": {"question": "Summarise this document"}}'
```

### Stream responses

```bash
curl -s -X POST "{{LANGSERVE_URL}}/stream" \
  -H "Content-Type: application/json" \
  -d '{"input": {"question": "Explain quantum computing"}}'
```

## AI Agent Tips

- LangServe exposes LangChain chains as REST APIs.
- Use LangGraph for complex stateful agent orchestration.
- Supports 100+ LLM providers, vector stores, and tool integrations.
- LCEL (LangChain Expression Language) enables composable chain building.
