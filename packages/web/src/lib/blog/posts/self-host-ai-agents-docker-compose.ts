import type { BlogPost } from '../types';

export const post: BlogPost = {
	slug: "self-host-ai-agents-docker-compose",
	title: "How to Self-Host AI Agents with Docker Compose: A Complete Guide",
	description:
		"Learn how to deploy and manage AI agents on your own infrastructure using Docker Compose, with automatic dependency wiring and production-ready configurations.",
	date: "2026-02-28",
	readTime: "12 min read",
	category: "AI Agents",
	tags: ["docker-compose", "self-hosting", "ai-agents", "openclaw", "devops"],
	content: `
		<p>The era of relying solely on cloud providers for artificial intelligence is evolving. Cloud services are powerful, but they come with significant trade-offs: per-token pricing that scales linearly with usage, privacy concerns regarding sensitive business or personal data, and the risk of vendor lock-in. Self-hosting AI agents natively on your own infrastructure gives you complete control over your data, costs, and software stack.</p>


<div class="my-10 relative rounded-2xl overflow-hidden border border-border/50 bg-[#0a0a0a] p-8 shadow-2xl">
  <style>
    @keyframes shield-pulse {
      0% { box-shadow: 0 0 0 0 rgba(204, 136, 51, 0.4); }
      70% { box-shadow: 0 0 0 20px rgba(204, 136, 51, 0); }
      100% { box-shadow: 0 0 0 0 rgba(204, 136, 51, 0); }
    }
    @keyframes lock-bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }
  </style>
  
  <h3 class="mt-0 pt-0 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-500 mb-6 text-center">100% Data Sovereignty</h3>
  
  <div class="flex items-center justify-center gap-12 py-8">
    <!-- Cloud (Crossed out) -->
    <div class="flex flex-col items-center opacity-50 relative">
      <div class="absolute inset-0 flex items-center justify-center z-10 w-full h-full text-red-500 text-6xl rotate-12 drop-shadow-lg">X</div>
      <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-muted-foreground">
        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
      </svg>
      <span class="mt-4 font-mono text-sm">3rd Party APIs</span>
    </div>
    
    <!-- Firewall -->
    <div class="w-2 h-32 bg-primary/30 rounded-full flex flex-col items-center justify-center relative shadow-[0_0_15px_rgba(204,136,51,0.5)]">
       <span class="absolute -top-6 text-xs text-primary font-bold uppercase tracking-widest">Airgap</span>
    </div>
    
    <!-- Local Server -->
    <div class="flex flex-col items-center relative z-10" style="animation: lock-bounce 4s ease-in-out infinite;">
      <div class="rounded-full bg-primary/10 p-5 border border-primary/40" style="animation: shield-pulse 2s infinite;">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#cc8833" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
          <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
          <line x1="6" y1="6" x2="6.01" y2="6"></line>
          <line x1="6" y1="18" x2="6.01" y2="18"></line>
        </svg>
      </div>
      <span class="mt-4 font-bold text-foreground">Your Server</span>
      <span class="text-xs text-primary mt-1 px-2 py-0.5 bg-primary/10 rounded">Encrypted</span>
    </div>
  </div>
</div>


		<p>Unlike cloud-hosted AI solutions, running your agents locally ensures that your proprietary prompts, multi-dimensional embeddings, and final outputs never traverse outside your network. Moreover, with the right infrastructure provisioning, spinning up an intricate AI agent stack is incredibly seamless. Enter Docker Compose—the industry standard for orchestrating local containers.</p>

		<h2>Why Self-Host AI Agents? The Economics and Privacy</h2>


<div class="my-10 relative rounded-2xl overflow-hidden border border-border/50 bg-[#0a0a0a] p-8 shadow-2xl">
  <style>
    @keyframes grow-bar {
      from { stroke-dasharray: 0, 1000; }
      to { stroke-dasharray: 500, 1000; }
    }
    @keyframes grow-bar-short {
      from { stroke-dasharray: 0, 1000; }
      to { stroke-dasharray: 100, 1000; }
    }
  </style>

  <h3 class="mt-0 pt-0 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-500 mb-6">TCO Comparison: Cloud APIs vs Self-Hosted</h3>

  <svg viewBox="0 0 600 250" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto">
    <!-- Grid -->
    <line x1="150" y1="0" x2="150" y2="200" stroke="#333" stroke-width="1" />
    <line x1="250" y1="0" x2="250" y2="200" stroke="#222" stroke-width="1" stroke-dasharray="4,4" />
    <line x1="350" y1="0" x2="350" y2="200" stroke="#222" stroke-width="1" stroke-dasharray="4,4" />
    <line x1="450" y1="0" x2="450" y2="200" stroke="#222" stroke-width="1" stroke-dasharray="4,4" />
    <line x1="550" y1="0" x2="550" y2="200" stroke="#222" stroke-width="1" stroke-dasharray="4,4" />

    <!-- Labels -->
    <text x="130" y="65" fill="#fff" font-family="sans-serif" font-size="14" text-anchor="end" font-weight="bold">Cloud AI APIs</text>
    <text x="130" y="85" fill="#aaa" font-family="sans-serif" font-size="11" text-anchor="end">(GPT-4 / Claude)</text>
    
    <text x="130" y="145" fill="#fff" font-family="sans-serif" font-size="14" text-anchor="end" font-weight="bold">Self-Hosted</text>
    <text x="130" y="165" fill="#aaa" font-family="sans-serif" font-size="11" text-anchor="end">(Local GPU / VPS)</text>

    <!-- Cloud Bar -->
    <line x1="150" y1="65" x2="650" y2="65" stroke="#444" stroke-width="30" stroke-linecap="round" />
    <line x1="150" y1="65" x2="550" y2="65" stroke="#ef4444" stroke-width="30" stroke-linecap="round" style="animation: grow-bar 2s ease-out forwards;" />
    <text x="480" y="70" fill="#fff" font-family="sans-serif" font-size="14" font-weight="bold"><h2>Why Self-Host AI Agents? The Economics and Privacy</h2>0k+ / MRR</text>

    <!-- Self-Hosted Bar -->
    <line x1="150" y1="145" x2="650" y2="145" stroke="#444" stroke-width="30" stroke-linecap="round" />
    <line x1="150" y1="145" x2="230" y2="145" stroke="#10b981" stroke-width="30" stroke-linecap="round" style="animation: grow-bar-short 2s ease-out forwards;" />
    <text x="250" y="150" fill="#10b981" font-family="sans-serif" font-size="14" font-weight="bold">~$50 - Why Self-Host00 Fixed</text>

    <!-- Bottom Axis -->
    <text x="150" y="230" fill="#666" font-family="sans-serif" font-size="12" text-anchor="middle">$0</text>
    <text x="550" y="230" fill="#666" font-family="sans-serif" font-size="12" text-anchor="middle">$ High Usage</text>
  </svg>
</div>

		<p>Cloud AI API costs can balloon faster than expected. For dynamic workflows such as continuous RAG (Retrieval-Augmented Generation), extensive web scraping, or automated code review, service requests are constantly active. This per-token approach is fundamentally incompatible with exploratory AI research where you want agents running autonomously 24/7. Teams processing classified documents, legal records, or healthcare data might face strict regulatory and compliance barriers (like HIPAA and GDPR) that essentially prohibit third-party data processing.</p>

		<p>Self-hosting is the antidote. It can reduce operating costs by upwards of 80% over the course of a year, particularly as open-source LLMs (Large Language Models) like Llama 3, Mistral, and DeepSeek continue to achieve near-parity with commercial models at a fraction of the hardware cost.</p>

		<h2>Understanding the Core Stack of an AI Agent</h2>


<div class="my-10 relative rounded-2xl overflow-hidden border border-border/50 bg-[#0a0a0a] p-8 shadow-2xl">
  <!-- CSS Animations -->
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

  <!-- Title -->
  <h3 class="mt-0 pt-0 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-500 mb-6">Autonomous AI Stack Architecture</h3>
  
  <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto">
    <!-- Grid Background -->
    <defs>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
      </pattern>
      
      <!-- Gradients -->
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
    <path d="M 200 200 L 400 120" stroke="#cc8833" stroke-width="2" fill="none" stroke-dasharray="6,4" style="animation: dash 1s linear infinite;" />
    <path d="M 200 200 L 400 280" stroke="#cc8833" stroke-width="2" fill="none" stroke-dasharray="6,4" style="animation: dash 1s linear infinite;" />
    <path d="M 400 120 L 600 200" stroke="#cc8833" stroke-width="2" fill="none" stroke-dasharray="6,4" style="animation: dash 1s linear infinite;" />
    <path d="M 400 280 L 600 200" stroke="#cc8833" stroke-width="2" fill="none" stroke-dasharray="6,4" style="animation: dash 1s linear infinite;" />
    <path d="M 100 200 L 200 200" stroke="#555" stroke-width="2" fill="none" />

    <!-- Nodes Custom Styles inline for scoped float animations -->
    
    <!-- User / Orchestrator Node -->
    <g style="animation: float-y 6s ease-in-out infinite;">
      <circle cx="200" cy="200" r="45" fill="url(#glow-panel)" stroke="#333" stroke-width="2" />
      <circle cx="200" cy="200" r="45" fill="none" stroke="#cc8833" stroke-width="1" style="animation: pulse-ring 3s infinite;" />
      <text x="200" y="195" fill="#e8e0d0" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">Agent</text>
      <text x="200" y="215" fill="#888" font-family="sans-serif" font-size="11" text-anchor="middle">Orchestrator</text>
    </g>

    <!-- Top Node: LLM -->
    <g style="animation: float-y 5s ease-in-out infinite 0.5s;">
      <rect x="330" y="80" width="140" height="80" rx="12" fill="url(#glow-panel)" stroke="#cc8833" stroke-width="2" filter="url(#neon-glow)" />
      <text x="400" y="115" fill="#fff" font-family="sans-serif" font-size="16" font-weight="bold" text-anchor="middle">LLM Engine</text>
      <text x="400" y="135" fill="#aaa" font-family="sans-serif" font-size="12" text-anchor="middle">Ollama / vLLM</text>
    </g>
    
    <!-- Bottom Node: Vector DB -->
    <g style="animation: float-y 6s ease-in-out infinite 1s;">
      <rect x="330" y="240" width="140" height="80" rx="12" fill="url(#glow-panel)" stroke="#444" stroke-width="2" />
      <text x="400" y="275" fill="#fff" font-family="sans-serif" font-size="16" font-weight="bold" text-anchor="middle">Vector DB</text>
      <text x="400" y="295" fill="#aaa" font-family="sans-serif" font-size="12" text-anchor="middle">Qdrant / Milvus</text>
    </g>

    <!-- Final Output / UI -->
    <g style="animation: float-y 5.5s ease-in-out infinite 0.2s;">
      <circle cx="600" cy="200" r="50" fill="url(#primary-glow)" stroke="#ffa333" stroke-width="3" filter="url(#neon-glow)" />
      <text x="600" y="195" fill="#fff" font-family="sans-serif" font-size="16" font-weight="bold" text-anchor="middle">Output</text>
      <text x="600" y="215" fill="#fff" font-family="sans-serif" font-size="12" text-anchor="middle">Action/Data</text>
    </g>
  </svg>
  <p class="text-sm text-muted-foreground mt-4 text-center">Data securely flows from local storage completely bypassing cloud networks.</p>
</div>

		<p>Running an autonomous AI agent is not just about running an LLM. An autonomous agent requires tools, memory, reasoning space, and an execution engine. A robust self-hosted AI stack generally comprises the following core components:</p>

		<ul>
			<li><strong>The Brain (LLM Runtime):</strong> This is the cognitive engine of your stack. Software like <em>Ollama</em> or <em>vLLM</em> serves local models, providing an OpenAI-compatible API layer over locally-served weights.</li>
			<li><strong>Long-term Memory (Vector Database):</strong> When parsing thousands of documents or logging past interactions, standard SQL queries fall short. A vector database like <em>Qdrant</em>, <em>Milvus</em>, or <em>ChromaDB</em> provides semantic search by indexing high-dimensional arrays of floating-point numbers.</li>
			<li><strong>Orchestration Engine:</strong> Agents require a workflow runner to process inputs, conditionally branch logic, and execute actions. Platforms like <em>n8n</em> or <em>Temporal</em> act as the backbone, connecting different APIs together.</li>
			<li><strong>Persistent State:</strong> Standard relational databases, such as <em>PostgreSQL</em>, serve to persist hard truths, workflow logs, and basic metadata.</li>
			<li><strong>Tools and Sub-agents:</strong> For web search capabilities, tools like <em>SearXNG</em> (private metasearch) and <em>Browserless</em> (headless browser automation) give your agent eyes onto the live internet without being tracked.</li>
		</ul>

		<h2>The Challenge: Manual Configuration vs. Automation</h2>
		<p>Bridging these disparate software components manually is historically frustrating. Writing the Docker Compose file by hand requires calculating memory limits, avoiding port conflicts on the host machine, establishing Docker networks to ensure services can talk to each other without exposing ports to the host OS, and coordinating environmental variables across 5+ services.</p>

		<p>Fortunately, tools like <strong>better-openclaw</strong> generate these robust, production-ready Docker Compose configurations programmatically. The engine handles all the cross-wiring, generating hyper-complex Docker YAML files that have all services pre-wired. By selecting an archetype — for example, the "Research Agent" — better-openclaw instantly provisions Ollama, Qdrant, SearXNG, and Browserless.</p>

		<h2>Step-by-Step: Getting Started with Docker Compose</h2>
		<p>With an automated generator, your path to deployment looks like this:</p>
		
		<h3>Step 1: Install Dependencies</h3>
		<p>Ensure you have Docker and Docker Compose (V2 recommended) installed on your system. A Linux host engine (like Ubuntu Server 24.04) natively running Docker provides the best GPU pass-through compatibility via the NVIDIA container toolkit.</p>

		<h3>Step 2: Generate Your Configuration</h3>
		<p>Run the generator from your terminal:</p>
		<pre><code>npx create-better-openclaw@latest</code></pre>
		<p>Follow the interactive CLI wizard. You will be prompted to select your core services. If you aren't sure, select the 'AI Playground' preset. To guarantee your services are accessible securely via HTTPS, choose a reverse proxy such as <em>Caddy</em> or <em>Traefik</em>.</p>

		<h3>Step 3: Review the Output</h3>
		<p>Once generated, you'll see a pristine <code>docker-compose.yml</code> file alongside a populated <code>.env</code> file containing randomized cryptographic secrets, an automated Caddyfile (if applicable), and prometheus/grafana configurations. All internal traffic routes via a dedicated Docker network spanning the containers securely.</p>

		<h3>Step 4: Launch the AI Stack</h3>
		<p>Spin up the daemonized services with the classical command:</p>
		<pre><code>docker compose up -d</code></pre>
		<p>Sit back as Docker pulls the optimized images. To verify that everything is running smoothly, execute <code>docker compose logs -f</code>. Within a few moments, your fully private, localized, state-of-the-art AI agent infrastructure is active—available exclusively to you.</p>
	`,
};
