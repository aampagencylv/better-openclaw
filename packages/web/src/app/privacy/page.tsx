import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Privacy Policy | Better OpenClaw",
	description: "Privacy Policy for Better OpenClaw self-hosted stacks.",
};

export default function PrivacyPage() {
	return (
		<div className="container max-w-4xl py-12 md:py-24">
			<div className="prose prose-slate dark:prose-invert max-w-none">
				<h1>Privacy Policy</h1>
				<p className="lead">Last updated: {new Date().toLocaleDateString()}</p>

				<h2>1. Self-Hosted & Data Ownership</h2>
				<p>
					Better OpenClaw is a self-hosted infrastructure framework. When you deploy a stack using
					our tools:
				</p>
				<ul>
					<li>
						<strong>You own your data.</strong> All databases, logs, and application data reside on
						your own infrastructure (VPS, bare metal, or cloud of your choice).
					</li>
					<li>
						<strong>We do not have access.</strong> The Better OpenClaw team cannot access your
						deployed services, databases, or AI agent interactions.
					</li>
					<li>
						<strong>Zero Telemetry by Default.</strong> The core CLI and generated stacks do not
						send usage telemetry to us unless explicitly configured otherwise by you.
					</li>
				</ul>

				<h2>2. Information We Collect</h2>
				<p>
					This website (better-openclaw.com) and our documentation may collect anonymous usage
					statistics to help us improve the project:
				</p>
				<ul>
					<li>
						<strong>Website Analytics:</strong> We use privacy-preserving analytics to track page
						views and documentation usage.
					</li>
					<li>
						<strong>CLI Install Stats:</strong> NPM/package registries track download counts
						anonymously.
					</li>
				</ul>

				<h2>3. Third-Party Services</h2>
				<p>
					Your generated stack may include third-party AI services (e.g., OpenAI, Anthropic,
					DeepSeek). When you configure your agents to use these models:
				</p>
				<ul>
					<li>
						Your data is sent directly from <strong>your server</strong> to the AI provider's API.
					</li>
					<li>
						It does <strong>not</strong> pass through Better OpenClaw servers.
					</li>
					<li>You are subject to the privacy policies of those respective AI providers.</li>
				</ul>

				<h2>4. Open Source</h2>
				<p>
					Better OpenClaw is open source software. You can inspect the full source code on{" "}
					<a href="https://github.com/bidewio/better-openclaw">GitHub</a> to verify our data
					practices.
				</p>

				<h2>5. Contact Us</h2>
				<p>
					If you have questions about this privacy policy or the project, please open an issue on
					our GitHub repository.
				</p>
			</div>
		</div>
	);
}
