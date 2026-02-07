export { redisDefinition } from "./redis.js";
export { qdrantDefinition } from "./qdrant.js";
export { n8nDefinition } from "./n8n.js";
export { ffmpegDefinition } from "./ffmpeg.js";
export { minioDefinition } from "./minio.js";
export { postgresqlDefinition } from "./postgresql.js";
export { caddyDefinition } from "./caddy.js";
export { traefikDefinition } from "./traefik.js";
export { uptimeKumaDefinition } from "./uptime-kuma.js";
export { grafanaDefinition } from "./grafana.js";
export { prometheusDefinition } from "./prometheus.js";
export { browserlessDefinition } from "./browserless.js";
export { searxngDefinition } from "./searxng.js";
export { meilisearchDefinition } from "./meilisearch.js";
export { ollamaDefinition } from "./ollama.js";
export { whisperDefinition } from "./whisper.js";
export { chromadbDefinition } from "./chromadb.js";
export { weaviateDefinition } from "./weaviate.js";
export { valkeyDefinition } from "./valkey.js";
export { gotifyDefinition } from "./gotify.js";
export { ntfyDefinition } from "./ntfy.js";
export { remotionDefinition } from "./remotion.js";
export { motionCanvasDefinition } from "./motion-canvas.js";
export { temporalDefinition } from "./temporal.js";
export { outlineDefinition } from "./outline.js";
export { docsgptDefinition } from "./docsgpt.js";
export { paperlessNgxDefinition } from "./paperless-ngx.js";
export { nocodbDefinition } from "./nocodb.js";
export { appflowyDefinition } from "./appflowy.js";
export { matrixSynapseDefinition } from "./matrix-synapse.js";
export { rocketchatDefinition } from "./rocketchat.js";
export { mattermostDefinition } from "./mattermost.js";
export { stableDiffusionDefinition } from "./stable-diffusion.js";
export { playwrightServerDefinition } from "./playwright-server.js";
export { openWebuiDefinition } from "./open-webui.js";
export { librechatDefinition } from "./librechat.js";
export { anythingLlmDefinition } from "./anything-llm.js";
export { difyDefinition } from "./dify.js";
export { flowiseDefinition } from "./flowise.js";
export { litellmDefinition } from "./litellm.js";
export { giteaDefinition } from "./gitea.js";
export { codeServerDefinition } from "./code-server.js";
export { portainerDefinition } from "./portainer.js";
export { watchtowerDefinition } from "./watchtower.js";
export { dozzleDefinition } from "./dozzle.js";
export { beszelDefinition } from "./beszel.js";
export { claudeCodeDefinition } from "./claude-code.js";
export { opencodeDefinition } from "./opencode.js";
export { codexDefinition } from "./codex.js";
export { geminiCliDefinition } from "./gemini-cli.js";
export { kimiDefinition } from "./kimi.js";
export { postizDefinition } from "./postiz.js";
export { mixpostDefinition } from "./mixpost.js";
export { matomoDefinition } from "./matomo.js";
export { umamiDefinition } from "./umami.js";
export { openpanelDefinition } from "./openpanel.js";

import { redisDefinition } from "./redis.js";
import { qdrantDefinition } from "./qdrant.js";
import { n8nDefinition } from "./n8n.js";
import { ffmpegDefinition } from "./ffmpeg.js";
import { minioDefinition } from "./minio.js";
import { postgresqlDefinition } from "./postgresql.js";
import { caddyDefinition } from "./caddy.js";
import { traefikDefinition } from "./traefik.js";
import { uptimeKumaDefinition } from "./uptime-kuma.js";
import { grafanaDefinition } from "./grafana.js";
import { prometheusDefinition } from "./prometheus.js";
import { browserlessDefinition } from "./browserless.js";
import { searxngDefinition } from "./searxng.js";
import { meilisearchDefinition } from "./meilisearch.js";
import { ollamaDefinition } from "./ollama.js";
import { whisperDefinition } from "./whisper.js";
import { chromadbDefinition } from "./chromadb.js";
import { weaviateDefinition } from "./weaviate.js";
import { valkeyDefinition } from "./valkey.js";
import { gotifyDefinition } from "./gotify.js";
import { ntfyDefinition } from "./ntfy.js";
import { remotionDefinition } from "./remotion.js";
import { motionCanvasDefinition } from "./motion-canvas.js";
import { temporalDefinition } from "./temporal.js";
import { outlineDefinition } from "./outline.js";
import { docsgptDefinition } from "./docsgpt.js";
import { paperlessNgxDefinition } from "./paperless-ngx.js";
import { nocodbDefinition } from "./nocodb.js";
import { appflowyDefinition } from "./appflowy.js";
import { matrixSynapseDefinition } from "./matrix-synapse.js";
import { rocketchatDefinition } from "./rocketchat.js";
import { mattermostDefinition } from "./mattermost.js";
import { stableDiffusionDefinition } from "./stable-diffusion.js";
import { playwrightServerDefinition } from "./playwright-server.js";
import { openWebuiDefinition } from "./open-webui.js";
import { librechatDefinition } from "./librechat.js";
import { anythingLlmDefinition } from "./anything-llm.js";
import { difyDefinition } from "./dify.js";
import { flowiseDefinition } from "./flowise.js";
import { litellmDefinition } from "./litellm.js";
import { giteaDefinition } from "./gitea.js";
import { codeServerDefinition } from "./code-server.js";
import { portainerDefinition } from "./portainer.js";
import { watchtowerDefinition } from "./watchtower.js";
import { dozzleDefinition } from "./dozzle.js";
import { beszelDefinition } from "./beszel.js";
import { claudeCodeDefinition } from "./claude-code.js";
import { opencodeDefinition } from "./opencode.js";
import { codexDefinition } from "./codex.js";
import { geminiCliDefinition } from "./gemini-cli.js";
import { kimiDefinition } from "./kimi.js";
import { postizDefinition } from "./postiz.js";
import { mixpostDefinition } from "./mixpost.js";
import { matomoDefinition } from "./matomo.js";
import { umamiDefinition } from "./umami.js";
import { openpanelDefinition } from "./openpanel.js";
import type { ServiceDefinition } from "../../types.js";

export const allServiceDefinitions: ServiceDefinition[] = [
	redisDefinition,
	qdrantDefinition,
	n8nDefinition,
	ffmpegDefinition,
	minioDefinition,
	postgresqlDefinition,
	caddyDefinition,
	traefikDefinition,
	uptimeKumaDefinition,
	grafanaDefinition,
	prometheusDefinition,
	browserlessDefinition,
	searxngDefinition,
	meilisearchDefinition,
	ollamaDefinition,
	whisperDefinition,
	chromadbDefinition,
	weaviateDefinition,
	valkeyDefinition,
	gotifyDefinition,
	ntfyDefinition,
	remotionDefinition,
	motionCanvasDefinition,
	temporalDefinition,
	outlineDefinition,
	docsgptDefinition,
	paperlessNgxDefinition,
	nocodbDefinition,
	appflowyDefinition,
	matrixSynapseDefinition,
	rocketchatDefinition,
	mattermostDefinition,
	stableDiffusionDefinition,
	playwrightServerDefinition,
	openWebuiDefinition,
	librechatDefinition,
	anythingLlmDefinition,
	difyDefinition,
	flowiseDefinition,
	litellmDefinition,
	giteaDefinition,
	codeServerDefinition,
	portainerDefinition,
	watchtowerDefinition,
	dozzleDefinition,
	beszelDefinition,
	claudeCodeDefinition,
	opencodeDefinition,
	codexDefinition,
	geminiCliDefinition,
	kimiDefinition,
	postizDefinition,
	mixpostDefinition,
	matomoDefinition,
	umamiDefinition,
	openpanelDefinition,
];
