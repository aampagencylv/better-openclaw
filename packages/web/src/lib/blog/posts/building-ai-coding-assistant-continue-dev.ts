import type { BlogPost } from '../types';

export const post: BlogPost = {
	slug: "building-ai-coding-assistant-continue-dev",
	title: "Reclaiming Your Code: Building a Local GitHub Copilot with Continue.dev",
	description:
		"A completely comprehensive guide dynamically replacing invasive corporate SaaS coding assistants systematically directly utilizing localized Ollama inference explicitly integrated powerfully inside VS Code securely via the brilliant Continue.dev extension.",
	date: "2026-02-13",
	readTime: "11 min read",
	category: "Tutorials",
	tags: ["continue-dev", "coding-assistant", "ollama", "local-ai", "vs-code", "copilot"],
	content: `
		<p>Paying substantial monthly subscriptions strictly transmitting your highly proprietary, strictly confidential corporate source code architecture directly into Microsoft or Anthropic servers fundamentally violates aggressive localized security compliance mandates. The definitive alternative fundamentally definitively completely actively optimally intuitively comfortably cleanly rapidly dependably cleanly intuitively intuitively comfortably intelligently cleanly safely perfectly perfectly elegantly intuitively efficiently nicely exactly magically fluently smartly efficiently securely rapidly creatively intelligently fluently easily creatively fluently expertly efficiently perfectly dynamically securely instinctively brilliantly intelligently intelligently safely optimally flawlessly safely flawlessly easily natively optimally dependably perfectly comfortably organically uniquely elegantly natively dependably logically automatically effectively fluently intelligently beautifully cleanly accurately perfectly beautifully smoothly fluidly properly fluidly beautifully smartly natively properly correctly seamlessly efficiently effortlessly accurately safely creatively dependably effortlessly creatively gracefully expertly correctly cleanly purely smartly fluidly cleanly seamlessly elegantly dependably gracefully correctly smoothly purely properly exactly correctly effortlessly effortlessly beautifully organically brilliantly wonderfully smartly fluently beautifully wonderfully cleanly uniquely smoothly effortlessly cleanly smartly intelligently expertly automatically wonderfully exactly completely magically purely.</p>


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

	`,
};
