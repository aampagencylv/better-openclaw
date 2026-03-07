import { useCallback, useEffect, useState } from "react";
import {
	type DeployResult,
	deployStack,
	fetchDeployServers,
	type PaasServer,
	testDeployConnection,
} from "@/lib/api-client";

export const PROVIDERS = [
	{
		id: "dokploy",
		name: "Dokploy",
		description: "Self-hosted PaaS alternative to Heroku/Netlify",
		placeholder: "https://dokploy.example.com",
		docsUrl: "https://docs.dokploy.com/docs/api",
		keyInstructions: "Settings > Profile > API/CLI > Generate Token",
	},
	{
		id: "coolify",
		name: "Coolify",
		description: "Self-hosted PaaS alternative to Vercel",
		placeholder: "https://coolify.example.com",
		docsUrl: "https://coolify.io/docs/api-reference/authorization",
		keyInstructions: "Keys & Tokens > API tokens > Create (permission: *)",
	},
] as const;

export type ProviderId = (typeof PROVIDERS)[number]["id"];
export type DeployPhase = "configure" | "testing" | "select-server" | "deploying" | "result";

const STORAGE_KEY_PREFIX = "openclaw-deploy-";

interface UseDeployProps {
	open: boolean;
	projectName: string;
	composeYaml: string;
	envContent: string;
}

export function useDeploy({ open, projectName, composeYaml, envContent }: UseDeployProps) {
	const [selectedProvider, setSelectedProvider] = useState<string>("dokploy");
	const [instanceUrl, setInstanceUrl] = useState("");
	const [apiKey, setApiKey] = useState("");
	const [phase, setPhase] = useState<DeployPhase>("configure");
	const [testError, setTestError] = useState<string | null>(null);
	const [deployResult, setDeployResult] = useState<DeployResult | null>(null);
	const [showApiKey, setShowApiKey] = useState(false);
	const [servers, setServers] = useState<PaasServer[]>([]);
	const [selectedServerId, setSelectedServerId] = useState<string>("");
	const [loadingServers, setLoadingServers] = useState(false);

	const provider = PROVIDERS.find((p) => p.id === selectedProvider) ?? PROVIDERS[0];

	// Load saved credentials from localStorage
	useEffect(() => {
		if (!open) return;
		const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}${selectedProvider}`);
		if (saved) {
			try {
				const parsed = JSON.parse(saved);
				setInstanceUrl(parsed.instanceUrl ?? "");
				setApiKey(parsed.apiKey ?? "");
			} catch {
				// ignore
			}
		}
	}, [open, selectedProvider]);

	// Reset phase when modal opens
	useEffect(() => {
		if (open) {
			setPhase("configure");
			setTestError(null);
			setDeployResult(null);
		}
	}, [open]);

	const saveCredentials = useCallback(() => {
		localStorage.setItem(
			`${STORAGE_KEY_PREFIX}${selectedProvider}`,
			JSON.stringify({ instanceUrl, apiKey }),
		);
	}, [selectedProvider, instanceUrl, apiKey]);

	const handleTestConnection = useCallback(async () => {
		if (!instanceUrl.trim() || !apiKey.trim()) return;

		setTestError(null);
		setPhase("testing");

		try {
			const testResult = await testDeployConnection({
				provider: selectedProvider,
				instanceUrl: instanceUrl.trim(),
				apiKey: apiKey.trim(),
			});

			if (!testResult.ok) {
				setTestError(testResult.error ?? "Connection failed");
				setPhase("configure");
				return;
			}

			// Save credentials on successful test
			saveCredentials();

			// Fetch available servers
			setLoadingServers(true);
			try {
				const serverList = await fetchDeployServers({
					provider: selectedProvider,
					instanceUrl: instanceUrl.trim(),
					apiKey: apiKey.trim(),
				});
				setServers(serverList);
				setSelectedServerId(serverList.length > 0 ? serverList[0].id : "");
			} catch {
				setServers([]);
				setSelectedServerId("");
			}
			setLoadingServers(false);

			// Show server selection if servers are available, otherwise deploy directly
			setPhase("select-server");
		} catch (err) {
			setTestError(err instanceof Error ? err.message : "Connection test failed");
			setPhase("configure");
		}
	}, [selectedProvider, instanceUrl, apiKey, saveCredentials]);

	const handleDeploy = useCallback(async () => {
		setPhase("deploying");
		try {
			const result = await deployStack({
				provider: selectedProvider,
				instanceUrl: instanceUrl.trim(),
				apiKey: apiKey.trim(),
				projectName,
				composeYaml,
				envContent,
				serverId: selectedServerId || undefined,
			});

			setDeployResult(result);
			setPhase("result");
		} catch (err) {
			setTestError(err instanceof Error ? err.message : "Deployment failed");
			setPhase("configure");
		}
	}, [
		selectedProvider,
		instanceUrl,
		apiKey,
		projectName,
		composeYaml,
		envContent,
		selectedServerId,
	]);

	return {
		selectedProvider,
		setSelectedProvider,
		instanceUrl,
		setInstanceUrl,
		apiKey,
		setApiKey,
		phase,
		setPhase,
		testError,
		deployResult,
		showApiKey,
		setShowApiKey,
		servers,
		selectedServerId,
		setSelectedServerId,
		loadingServers,
		provider,
		handleTestConnection,
		handleDeploy,
	};
}
