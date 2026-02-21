---
name: email-send
description: "Send emails via SMTP using command-line tools."
metadata:
  openclaw:
    emoji: "📧"
---

# Email Send

Send emails using SMTP within the Docker network.

## Send Email

```bash
curl --ssl-reqd \
  --url "smtps://$SMTP_HOST:$SMTP_PORT" \
  --user "$SMTP_USER:$SMTP_PASSWORD" \
  --mail-from "$SMTP_FROM" \
  --mail-rcpt "recipient@example.com" \
  --upload-file - <<EOF
From: OpenClaw <$SMTP_FROM>
To: recipient@example.com
Subject: Notification

This is the email body.
EOF
```

## Tips for AI Agents

- Use environment variables for SMTP credentials — never hardcode.
- Test with local Mailhog/Mailpit before sending to real addresses.
- Include proper From, To, and Subject headers.
