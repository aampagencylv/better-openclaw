import type { BlogPost } from "../types";

export const post: BlogPost = {
	slug: "ai-powerhouse-self-hosted-manus-alternative",
	title: "AI Powerhouse: The Self-Hosted Alternative to Manus and Perplexity Computer",
	description:
		"Build your own autonomous AI agent infrastructure with OpenClaw and better-openclaw. One command. Your hardware. Your data. Your rules. The complete guide to deploying the AI Powerhouse preset.",
	date: "2026-03-09",
	readTime: "18 min read",
	category: "Tutorials",
	tags: [
		"ai-powerhouse",
		"autonomous-agents",
		"manus",
		"perplexity-computer",
		"self-hosted",
		"n8n",
		"workflow-orchestration",
	],
	content: `
		<p>The AI landscape is shifting. Tools like <strong>Manus</strong> and <strong>Perplexity Computer</strong> have demonstrated what autonomous AI agents can do: deep research, multi-step reasoning, browser automation, and workflow orchestration. They're powerful. They're impressive. And they're completely controlled by their providers.</p>

		<p>But here's the thing: <strong>you don't need to pay $39-200/month and send your data to someone else's cloud to run autonomous AI agents</strong>. You can build the exact same infrastructure yourself, on your own hardware, with complete control over your data and models.</p>

		<p>That's what the <strong>AI Powerhouse</strong> preset for better-openclaw is all about.</p>

		<h2>What You're NOT Building</h2>

		<p>Let's be crystal clear: we're not trying to clone Manus or Perplexly Computer. That would be missing the point entirely.</p>

		<p>Manus and Perplexity Computer are <em>products</em>—polished, opinionated, and designed for a specific use case. What we're building with better-openclaw is something fundamentally different: <strong>the infrastructure</strong> that lets you build your own Manus-like workflows, tailored exactly to your needs.</p>

		<p>Think of it this way:</p>
		<ul>
			<li><strong>Manus/Perplexity Computer:</strong> Pre-built car with a locked hood</li>
			<li><strong>OpenClaw + better-openclaw:</strong> The garage, tools, and parts to build any car you want</li>
		</ul>

		<h2>The Positioning That Writes Itself</h2>

		<p>When you compare the self-hosted approach to commercial alternatives, the value proposition becomes obvious:</p>

<div class="my-10 relative rounded-2xl overflow-hidden border border-border/50 bg-[#0a0a0a] p-8 shadow-2xl">
  <h3 class="mt-0 pt-0 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-500 mb-6">Self-Hosted vs. Cloud AI Agents</h3>

  <div class="overflow-x-auto">
    <table class="w-full text-sm border-collapse">
      <thead>
        <tr class="border-b border-border/50">
          <th class="text-left py-3 px-4 font-semibold text-muted-foreground">Feature</th>
          <th class="text-left py-3 px-4 font-semibold text-amber-500">Manus</th>
          <th class="text-left py-3 px-4 font-semibold text-amber-500">Perplexity Computer</th>
          <th class="text-left py-3 px-4 font-semibold text-primary">OpenClaw + better-openclaw</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-border/30">
        <tr class="hover:bg-secondary/10 transition-colors">
          <td class="py-3 px-4 font-medium">Price</td>
          <td class="py-3 px-4">$39-200/month</td>
          <td class="py-3 px-4">$200/month</td>
          <td class="py-3 px-4 text-green-400 font-semibold">$5-10/month (VPS)</td>
        </tr>
        <tr class="hover:bg-secondary/10 transition-colors">
          <td class="py-3 px-4 font-medium">Data Privacy</td>
          <td class="py-3 px-4 text-orange-400">Their cloud</td>
          <td class="py-3 px-4 text-orange-400">Their cloud</td>
          <td class="py-3 px-4 text-green-400 font-semibold">Your server</td>
        </tr>
        <tr class="hover:bg-secondary/10 transition-colors">
          <td class="py-3 px-4 font-medium">Open Source</td>
          <td class="py-3 px-4">No</td>
          <td class="py-3 px-4">No</td>
          <td class="py-3 px-4 text-green-400 font-semibold">Yes</td>
        </tr>
        <tr class="hover:bg-secondary/10 transition-colors">
          <td class="py-3 px-4 font-medium">Model Choice</td>
          <td class="py-3 px-4">Their pick</td>
          <td class="py-3 px-4">19 models (their pick)</td>
          <td class="py-3 px-4 text-green-400 font-semibold">Any model (your pick)</td>
        </tr>
        <tr class="hover:bg-secondary/10 transition-colors">
          <td class="py-3 px-4 font-medium">Customizable</td>
          <td class="py-3 px-4">No</td>
          <td class="py-3 px-4">No</td>
          <td class="py-3 px-4 text-green-400 font-semibold">Fully</td>
        </tr>
        <tr class="hover:bg-secondary/10 transition-colors">
          <td class="py-3 px-4 font-medium">Setup Time</td>
          <td class="py-3 px-4">Sign up</td>
          <td class="py-3 px-4">Sign up</td>
          <td class="py-3 px-4 text-green-400 font-semibold">5 min with better-openclaw</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

		<h2>What's Inside the AI Powerhouse Stack</h2>

		<p>The AI Powerhouse preset gives you eight core services that work together to create a complete autonomous AI infrastructure:</p>

		<ol>
			<li><strong>Ollama</strong> — Local LLM inference engine. Run Llama 3.3, Qwen, DeepSeek, Mistral, or any other model you choose. Your hardware, your model selection.</li>
			<li><strong>Qdrant</strong> — Vector database for semantic memory and RAG (Retrieval-Augmented Generation). Your AI remembers context across conversations and can search through your documents.</li>
			<li><strong>PostgreSQL</strong> — Relational database for structured data storage, workflow state, and persistent memory.</li>
			<li><strong>Redis</strong> — In-memory cache for session management, queue processing, and real-time data.</li>
			<li><strong>n8n</strong> — The orchestration layer. This is where the magic happens. n8n routes tasks to different models, coordinates multi-step workflows, and connects all your services together.</li>
			<li><strong>Browserless</strong> — Headless Chrome for web scraping, screenshot capture, and browser automation. Essential for research workflows.</li>
			<li><strong>SearXNG</strong> — Privacy-respecting meta search engine. Aggregates results from multiple search engines without tracking you.</li>
			<li><strong>Caddy</strong> — Automatic HTTPS reverse proxy with zero-config SSL. Securely expose your services to the network.</li>
		</ol>

		<h2>The n8n Orchestration Layer: The Secret Sauce</h2>

		<p>Here's what makes this different from just running Ollama locally: <strong>n8n provides the orchestration layer</strong> that Manus and Perplexity Computer have built into their products.</p>

		<p>Instead of building multi-model routing, parallel task execution, and complex workflow logic into OpenClaw itself, we leverage n8n's visual workflow engine. n8n can:</p>

		<ul>
			<li><strong>Route different tasks to different LLM APIs</strong> — Use a fast model for simple tasks, a powerful model for complex reasoning</li>
			<li><strong>Run workflows in parallel</strong> — Research multiple sources simultaneously, aggregate results</li>
			<li><strong>Trigger from OpenClaw webhooks</strong> — Your AI agent can fire off complex workflows and get structured results back</li>
			<li><strong>Return results back to OpenClaw</strong> — Seamless integration between your agent and the orchestration layer</li>
		</ul>

		<p>The architecture looks like this:</p>

<div class="my-10 relative rounded-2xl overflow-hidden border border-border/50 bg-[#0a0a0a] p-8 shadow-2xl">
  <style>
    @keyframes pulse-ring {
      0% { transform: scale(0.9); opacity: 0.5; }
      50% { transform: scale(1.1); opacity: 1; }
      100% { transform: scale(0.9); opacity: 0.5; }
    }
    @keyframes float-y {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    @keyframes dash {
      to { stroke-dashoffset: -20; }
    }
  </style>

  <h3 class="mt-0 pt-0 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-500 mb-6">AI Powerhouse Architecture</h3>

  <svg viewBox="0 0 900 500" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto">
    <defs>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
      </pattern>

      <linearGradient id="glow-panel" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1f1b14" />
        <stop offset="100%" stop-color="#0d0a08" />
      </linearGradient>

      <linearGradient id="primary-glow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#cc8833" />
        <stop offset="100%" stop-color="#885511" />
      </linearGradient>

      <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="8" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    <rect width="100%" height="100%" fill="url(#grid)" />

    <!-- Connection Lines -->
    <path d="M 150 250 L 300 250" stroke="#cc8833" stroke-width="3" fill="none" />
    <path d="M 500 250 L 650 150" stroke="#cc8833" stroke-width="2" fill="none" stroke-dasharray="6,4" style="animation: dash 1s linear infinite;" />
    <path d="M 500 250 L 650 250" stroke="#cc8833" stroke-width="2" fill="none" stroke-dasharray="6,4" style="animation: dash 1s linear infinite;" />
    <path d="M 500 250 L 650 350" stroke="#cc8833" stroke-width="2" fill="none" stroke-dasharray="6,4" style="animation: dash 1s linear infinite;" />

    <!-- OpenClaw -->
    <g style="animation: float-y 6s ease-in-out infinite;">
      <circle cx="100" cy="250" r="50" fill="url(#primary-glow)" stroke="#ffa333" stroke-width="3" filter="url(#neon-glow)" />
      <text x="100" y="245" fill="#fff" font-family="sans-serif" font-size="16" font-weight="bold" text-anchor="middle">OpenClaw</text>
      <text x="100" y="265" fill="#fff" font-family="sans-serif" font-size="11" text-anchor="middle">Agent</text>
    </g>

    <!-- n8n Orchestrator -->
    <g style="animation: float-y 5s ease-in-out infinite 0.5s;">
      <rect x="300" y="180" width="200" height="140" rx="16" fill="url(#glow-panel)" stroke="#cc8833" stroke-width="3" filter="url(#neon-glow)" />
      <text x="400" y="235" fill="#fff" font-family="sans-serif" font-size="20" font-weight="bold" text-anchor="middle">n8n</text>
      <text x="400" y="260" fill="#aaa" font-family="sans-serif" font-size="13" text-anchor="middle">Orchestration Layer</text>
      <text x="400" y="280" fill="#888" font-family="sans-serif" font-size="11" text-anchor="middle">Routes • Coordinates • Manages</text>
    </g>

    <!-- Top Service: Ollama -->
    <g style="animation: float-y 5.5s ease-in-out infinite 0.2s;">
      <rect x="650" y="110" width="140" height="80" rx="12" fill="url(#glow-panel)" stroke="#444" stroke-width="2" />
      <text x="720" y="145" fill="#fff" font-family="sans-serif" font-size="15" font-weight="bold" text-anchor="middle">Ollama</text>
      <text x="720" y="165" fill="#aaa" font-family="sans-serif" font-size="11" text-anchor="middle">Local LLM</text>
    </g>

    <!-- Middle Service: Qdrant -->
    <g style="animation: float-y 6s ease-in-out infinite 1s;">
      <rect x="650" y="210" width="140" height="80" rx="12" fill="url(#glow-panel)" stroke="#444" stroke-width="2" />
      <text x="720" y="245" fill="#fff" font-family="sans-serif" font-size="15" font-weight="bold" text-anchor="middle">Qdrant</text>
      <text x="720" y="265" fill="#aaa" font-family="sans-serif" font-size="11" text-anchor="middle">Vector Memory</text>
    </g>

    <!-- Bottom Service: SearXNG + Browserless -->
    <g style="animation: float-y 5.5s ease-in-out infinite 0.7s;">
      <rect x="650" y="310" width="140" height="80" rx="12" fill="url(#glow-panel)" stroke="#444" stroke-width="2" />
      <text x="720" y="345" fill="#fff" font-family="sans-serif" font-size="15" font-weight="bold" text-anchor="middle">SearXNG</text>
      <text x="720" y="365" fill="#aaa" font-family="sans-serif" font-size="11" text-anchor="middle">Search + Browser</text>
    </g>
  </svg>
  <p class="text-sm text-muted-foreground mt-6 text-center">OpenClaw decides what to do → fires webhook to n8n → n8n routes sub-tasks to different tools → returns structured results</p>
</div>

		<p>This is exactly the pattern that Pawel Huryn built with "Agent One" and what xCloud's guide describes as the optimal OpenClaw + n8n architecture.</p>

		<h2>Pre-Built Workflow Templates</h2>

		<p>The AI Powerhouse preset includes pre-built n8n workflow templates that implement common autonomous agent patterns:</p>

		<h3>1. Deep Research Workflow</h3>
		<p>Multi-source research with automatic summarization:</p>
		<ol>
			<li><strong>SearXNG</strong> searches multiple engines for your query</li>
			<li><strong>Browserless</strong> scrapes the top 10 results in parallel</li>
			<li><strong>Qdrant</strong> indexes the content for semantic search</li>
			<li><strong>Ollama</strong> reads and synthesizes a comprehensive summary</li>
			<li>Results stored in <strong>PostgreSQL</strong> with full citation tracking</li>
		</ol>

		<h3>2. Content Creation Workflow</h3>
		<p>From research to publication:</p>
		<ol>
			<li><strong>Research</strong> — Gather sources using the deep research workflow</li>
			<li><strong>Outline</strong> — Structure the content with an LLM</li>
			<li><strong>Write</strong> — Generate sections using different models (fast model for simple sections, powerful model for complex analysis)</li>
			<li><strong>Generate Images</strong> — Create visuals with Stable Diffusion</li>
			<li><strong>Publish</strong> — Deploy to your CMS or static site</li>
		</ol>

		<h3>3. Code Generation Workflow</h3>
		<p>Specification to deployment:</p>
		<ol>
			<li><strong>Specification</strong> — Parse requirements from natural language</li>
			<li><strong>Generate</strong> — Create code using a specialized coding model</li>
			<li><strong>Test</strong> — Run automated tests in isolated environment</li>
			<li><strong>Deploy</strong> — Push to staging or production</li>
		</ol>

		<h2>Getting Started in 5 Minutes</h2>

		<p>Here's how to deploy your own AI Powerhouse infrastructure:</p>

		<pre><code class="language-bash"># Install better-openclaw
npx create-better-openclaw

# Select the AI Powerhouse preset during setup
# Or use the non-interactive mode:
npx create-better-openclaw --preset ai-powerhouse --yes

# Start your stack
cd my-ai-stack
docker compose up -d</code></pre>

		<p>That's it. In less than 5 minutes, you'll have:</p>
		<ul>
			<li>Ollama running on <code>http://localhost:11434</code></li>
			<li>n8n workflow editor on <code>http://localhost:5678</code></li>
			<li>Qdrant vector database on <code>http://localhost:6333</code></li>
			<li>SearXNG search on <code>http://localhost:8080</code></li>
			<li>All services connected and ready to orchestrate</li>
		</ul>

		<h2>Customizing Your Stack</h2>

		<p>Unlike Manus or Perplexity Computer, you have complete control over every component:</p>

		<h3>Swap the LLM Provider</h3>
		<p>Don't want to use Ollama? Replace it with:</p>
		<ul>
			<li><strong>LiteLLM</strong> — Unified API to 100+ LLM providers (OpenAI, Anthropic, Groq, etc.)</li>
			<li><strong>vLLM</strong> — High-performance inference for production deployments</li>
			<li><strong>Text Generation WebUI</strong> — Advanced model configuration and fine-tuning</li>
		</ul>

		<h3>Add More Services</h3>
		<p>Extend your stack with additional capabilities:</p>
		<ul>
			<li><strong>Firecrawl</strong> — Advanced web scraping and content extraction</li>
			<li><strong>Whisper</strong> — Speech-to-text for voice-based agents</li>
			<li><strong>Stable Diffusion</strong> — Image generation for visual content</li>
			<li><strong>Langfuse</strong> — LLM observability and debugging</li>
		</ul>

		<h3>Connect External APIs</h3>
		<p>n8n has 400+ pre-built integrations. Connect your AI agent to:</p>
		<ul>
			<li>Slack, Discord, Telegram for notifications</li>
			<li>GitHub, GitLab for code operations</li>
			<li>Google Drive, Notion, Obsidian for knowledge management</li>
			<li>Stripe, Shopify for e-commerce automation</li>
		</ul>

		<h2>Real-World Use Cases</h2>

		<h3>Self-Hosted Perplexity Replacement</h3>
		<p>Build your own AI-powered search engine:</p>
		<ul>
			<li>SearXNG aggregates results from multiple search engines</li>
			<li>Browserless scrapes and renders pages</li>
			<li>Ollama reads and synthesizes answers</li>
			<li>Qdrant indexes everything for follow-up questions</li>
		</ul>

		<h3>Autonomous Research Assistant</h3>
		<p>Create an agent that researches topics deeply:</p>
		<ul>
			<li>Receives a research question via webhook</li>
			<li>Searches multiple sources automatically</li>
			<li>Evaluates source credibility</li>
			<li>Synthesizes findings into structured reports</li>
			<li>Stores citations and raw data for verification</li>
		</ul>

		<h3>Lead Generation Platform (Self-Hosted Apollo Alternative)</h3>
		<p>Automate prospecting and outreach:</p>
		<ul>
			<li>Scrape LinkedIn and company websites for leads</li>
			<li>Research company backgrounds and pain points</li>
			<li>Generate personalized outreach messages</li>
			<li>Track engagement and follow-ups</li>
			<li>All data stays on your server</li>
		</ul>

		<h2>Cost Comparison: Real Numbers</h2>

		<p>Let's break down the actual costs:</p>

		<h3>Cloud AI Agents</h3>
		<ul>
			<li><strong>Manus Pro:</strong> $200/month = $2,400/year</li>
			<li><strong>Perplexity Computer:</strong> $200/month = $2,400/year</li>
		</ul>

		<h3>Self-Hosted AI Powerhouse</h3>
		<ul>
			<li><strong>VPS (Hetzner CCX33):</strong> $50/month = $600/year</li>
			<li><strong>Domain + SSL:</strong> Free (Caddy handles HTTPS automatically)</li>
			<li><strong>Total:</strong> $600/year</li>
		</ul>

		<p><strong>Savings:</strong> $1,800/year compared to Manus/Perplexity Computer</p>

		<p>And that VPS gives you 8 dedicated vCPUs, 32GB RAM, and 240GB NVMe storage. You can run dozens of other services alongside your AI stack.</p>

		<h2>Privacy and Data Sovereignty</h2>

		<p>Here's what doesn't leave your server:</p>
		<ul>
			<li>Your prompts and conversations</li>
			<li>Documents you ingest into Qdrant</li>
			<li>Research results and cached data</li>
			<li>Workflow configurations and API keys</li>
			<li>Generated content and outputs</li>
		</ul>

		<p>Compare this to cloud AI agents where every prompt, document, and result flows through someone else's infrastructure. GDPR compliance? HIPAA? Trade secrets? With self-hosted, you control it all.</p>

		<h2>Performance Considerations</h2>

		<h3>Minimum Requirements</h3>
		<ul>
			<li><strong>CPU:</strong> 4 cores (8 cores recommended)</li>
			<li><strong>RAM:</strong> 16GB minimum (32GB recommended)</li>
			<li><strong>Storage:</strong> 100GB SSD (for models, vector indices, and databases)</li>
		</ul>

		<h3>What You Can Run</h3>
		<p>On a typical 32GB VPS, you can comfortably run:</p>
		<ul>
			<li><strong>Ollama:</strong> Llama 3.3 8B, Qwen 14B, or Mistral 7B</li>
			<li><strong>Qdrant:</strong> Millions of vectors for semantic search</li>
			<li><strong>n8n:</strong> Hundreds of concurrent workflows</li>
			<li><strong>PostgreSQL:</strong> Gigabytes of structured data</li>
		</ul>

		<p>For larger models (70B+), you'll want a GPU. But for most autonomous agent workflows, smaller models with good prompting and RAG actually outperform massive models running blind.</p>

		<h2>The Future: Where This Goes Next</h2>

		<p>The AI Powerhouse preset is just the beginning. The roadmap includes:</p>

		<ul>
			<li><strong>Pre-built agent templates</strong> — One-click deployment of common agent patterns</li>
			<li><strong>n8n workflow library</strong> — Community-contributed workflows for specific use cases</li>
			<li><strong>Multi-agent orchestration</strong> — Coordinate multiple specialized agents</li>
			<li><strong>Advanced memory systems</strong> — Hierarchical memory, episodic recall, knowledge graphs</li>
			<li><strong>Tool use frameworks</strong> — Let your agents use external tools safely</li>
		</ul>

		<h2>Conclusion: Infrastructure, Not Products</h2>

		<p>Manus and Perplexity Computer are impressive products. But they're products—closed, opinionated, and vendor-controlled.</p>

		<p>The AI Powerhouse preset gives you something more valuable: <strong>infrastructure</strong>. The building blocks to create whatever AI workflows you need, exactly how you need them.</p>

		<p>You're not limited to someone else's idea of what an AI agent should do. You can build:</p>
		<ul>
			<li>A research assistant that understands your specific domain</li>
			<li>A content pipeline that matches your brand voice</li>
			<li>A lead generation system that respects privacy</li>
			<li>A code review bot that knows your architecture</li>
			<li>Anything else you can imagine</li>
		</ul>

		<p>One command. Your hardware. Your data. Your rules.</p>

		<pre><code class="language-bash">npx create-better-openclaw --preset ai-powerhouse --yes</code></pre>

		<p>The future of autonomous AI isn't in someone else's cloud. It's on your server.</p>

		<hr />

		<p class="text-sm text-muted-foreground mt-8">
			<strong>Ready to build your AI Powerhouse?</strong> Check out the
			<a href="/docs/installation" class="text-primary hover:underline">installation guide</a>
			or join the <a href="https://discord.gg/better-openclaw" class="text-primary hover:underline">Discord community</a>
			to share your autonomous agent workflows.
		</p>
	`,
};
