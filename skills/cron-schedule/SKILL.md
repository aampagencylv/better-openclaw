---
name: cron-schedule
description: "Schedule and manage recurring tasks using cron."
metadata:
  openclaw:
    emoji: "⏰"
---

# Cron Scheduling

Schedule recurring tasks using cron syntax.

## Cron Syntax

```text
# ┌───────── minute (0-59)
# │ ┌─────── hour (0-23)
# │ │ ┌───── day of month (1-31)
# │ │ │ ┌─── month (1-12)
# │ │ │ │ ┌─ day of week (0-7, 0 and 7 are Sunday)
# * * * * * command
```

## Examples

```bash
# Every 5 minutes
*/5 * * * * /scripts/health-check.sh

# Daily at midnight
0 0 * * * /scripts/backup.sh

# Every Monday at 9 AM
0 9 * * 1 /scripts/weekly-report.sh
```

## Tips for AI Agents

- Use `crontab -l` to list scheduled jobs.
- Use `crontab -e` to edit the crontab.
- Redirect output to log files: `command >> /var/log/cron.log 2>&1`.
