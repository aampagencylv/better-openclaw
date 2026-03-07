import type { ServiceDefinition } from "../../types.js";

export const axolotlDefinition: ServiceDefinition = {
	id: "axolotl",
	name: "Axolotl",
	description:
		"Streamlined LLM fine-tuning framework supporting LoRA, QLoRA, and full fine-tuning with YAML-based configuration.",
	category: "fine-tuning",
	icon: "🎯",

	image: "winglian/axolotl",
	imageTag: "main-latest",
	ports: [],
	volumes: [
		{
			name: "axolotl-models",
			containerPath: "/workspace/models",
			description: "Base models and fine-tuned outputs",
		},
		{
			name: "axolotl-data",
			containerPath: "/workspace/data",
			description: "Training datasets",
		},
		{
			name: "axolotl-configs",
			containerPath: "/workspace/configs",
			description: "Training configuration YAML files",
		},
	],
	environment: [
		{
			key: "WANDB_DISABLED",
			defaultValue: "true",
			secret: false,
			description: "Disable Weights & Biases logging by default",
			required: false,
		},
		{
			key: "HF_TOKEN",
			defaultValue: "${HF_TOKEN}",
			secret: true,
			description: "HuggingFace token for gated model access",
			required: false,
		},
	],
	command: "sleep infinity",
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://github.com/axolotl-ai-cloud/axolotl",
	tags: ["fine-tuning", "llm", "lora", "qlora", "training", "ai"],
	maturity: "beta",

	requires: [],
	recommends: ["ollama", "minio"],
	conflictsWith: [],

	minMemoryMB: 4096,
	gpuRequired: true,
};
