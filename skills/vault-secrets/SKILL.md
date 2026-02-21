---
name: vault-secrets
description: Secrets management with HashiCorp Vault
version: 1.0.0
tags: [security, secrets, encryption, infrastructure]
---

# HashiCorp Vault – Secrets Management

Vault secures, stores, and tightly controls access to tokens,
passwords, certificates, and encryption keys.

- **GitHub**: github.com/hashicorp/vault (32 000+ ⭐)
- **License**: MPL-2.0
- **Security**: Enterprise-grade. SOC 2 / FIPS compliant. No malware.

## Environment Variables

| Variable | Description |
|---|---|
| `{{VAULT_ADDR}}` | Vault server address |
| `{{VAULT_TOKEN}}` | Authentication token |

## Usage Examples

### Write a secret

```bash
curl -s -X POST "{{VAULT_ADDR}}/v1/secret/data/myapp" \
  -H "X-Vault-Token: {{VAULT_TOKEN}}" \
  -H "Content-Type: application/json" \
  -d '{"data": {"db_password": "s3cur3"}}'
```

### Read a secret

```bash
curl -s "{{VAULT_ADDR}}/v1/secret/data/myapp" \
  -H "X-Vault-Token: {{VAULT_TOKEN}}"
```

## AI Agent Tips

- Dynamic secrets for databases, cloud credentials, and PKI.
- Multiple auth methods: tokens, OIDC, AppRole, Kubernetes.
- Secret versioning with automatic rotation support.
- Transit engine enables encryption-as-a-service without storing data.
