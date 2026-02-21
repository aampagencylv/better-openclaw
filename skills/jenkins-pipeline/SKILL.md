---
name: jenkins-pipeline
description: CI/CD automation with Jenkins
version: 1.0.0
tags: [ci-cd, devops, automation, self-hosted]
---

# Jenkins – CI/CD Automation Server

Jenkins is the most widely-used open-source automation server with
1000+ plugins for building, testing, and deploying software.

- **GitHub**: github.com/jenkinsci/jenkins (24 000+ ⭐)
- **License**: MIT
- **Security**: Linux Foundation project. Well-audited. No malware.

## Environment Variables

| Variable | Description |
|---|---|
| `{{JENKINS_URL}}` | Base URL of the Jenkins server |
| `{{JENKINS_USER}}` | Username |
| `{{JENKINS_API_TOKEN}}` | API token |

## Usage Examples

### List jobs

```bash
curl -s -u "{{JENKINS_USER}}:{{JENKINS_API_TOKEN}}" \
  "{{JENKINS_URL}}/api/json?tree=jobs[name,color]"
```

### Trigger a build

```bash
curl -s -X POST -u "{{JENKINS_USER}}:{{JENKINS_API_TOKEN}}" \
  "{{JENKINS_URL}}/job/my-project/build"
```

## AI Agent Tips

- Pipeline-as-Code via Jenkinsfile (Groovy DSL).
- 1800+ community plugins for every tool in the DevOps chain.
- Supports distributed builds across multiple agents.
- Blue Ocean plugin modernises the UI experience.
