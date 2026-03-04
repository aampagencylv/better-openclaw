import type { BlogPost } from "../types";

export const post: BlogPost = {
	slug: "private-rag-pipeline-qdrant-searxng",
	title: "How to Build a Private RAG Pipeline with Qdrant, SearXNG, and Ollama",
	description:
		"An exhaustive step-by-step masterclass on architecting a secure Retrieval-Augmented Generation pipeline that keeps all corporate and personal data strictly localized on your hardware.",
	date: "2026-02-10",
	readTime: "17 min read",
	category: "Tutorials",
	tags: ["rag", "qdrant", "searxng", "tutorial", "vector-database", "privacy"],
	content: `
		<p>Out of the box, a Large Language Model suffers from two fundamental flaws: absolute amnesia regarding your personal or corporate data, and an inherent inability to reference current, real-time events published after its final training cutoff date. If you ask a pristine Llama3.3 model what your company's refund policy is, or what the stock market closed at today, it will confidently hallucinate an answer.</p>

		<p>The industry-standard solution to this problem is <strong>RAG: Retrieval-Augmented Generation</strong>. RAG intercepts an arbitrary user prompt, converts it into a mathematical vector, queries a database for highly-similar factual documentation, and then forcibly injects those retrieved facts into the LLM's prompt window before it begins typing. The model is effectively given an open-book test.</p>

		<p>However, running RAG implementations via third-party cloud services fundamentally requires transmitting your sensitive PDFs, API specs, and proprietary research directly to external remote servers. This tutorial outlines how to construct a 100% air-gapped, entirely private RAG infrastructure utilizing Qdrant for vector storage, SearXNG for real-time web awareness, and Ollama for isolated semantic inference.</p>

		<h2>The Anatomy of the Private Stack</h2>


<div class="my-10 relative rounded-2xl overflow-hidden border border-border/50 bg-[#0a0a0a] p-8 shadow-2xl">
  <style>
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }
  </style>
  <h3 class="mt-0 pt-0 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-500 mb-6 text-center">Self-Hosted Infrastructure</h3>
  
  <div class="flex flex-col items-center gap-4 max-w-sm mx-auto">
    <!-- Server 1 -->
    <div class="w-full h-16 bg-[#161616] rounded-lg border border-[#333] flex items-center px-6 relative overflow-hidden shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
      <div class="absolute left-0 top-0 bottom-0 w-2 bg-primary/80"></div>
      <div class="flex-1 flex gap-3">
        <div class="w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" style="animation: blink 2s infinite;"></div>
        <div class="w-4 h-4 rounded-full bg-emerald-500/50" style="animation: blink 1.5s infinite 0.5s;"></div>
        <div class="w-4 h-4 rounded-full bg-[#333]"></div>
      </div>
      <div class="flex gap-2">
        <div class="w-12 h-2 bg-[#333] rounded"></div>
        <div class="w-8 h-2 bg-[#333] rounded"></div>
      </div>
    </div>
    
    <!-- Server 2 -->
    <div class="w-full h-16 bg-[#161616] rounded-lg border border-[#333] flex items-center px-6 relative overflow-hidden shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
      <div class="absolute left-0 top-0 bottom-0 w-2 bg-[#444]"></div>
      <div class="flex-1 flex gap-3">
        <div class="w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" style="animation: blink 1.2s infinite 0.2s;"></div>
        <div class="w-4 h-4 rounded-full bg-emerald-500/50" style="animation: blink 3s infinite 1s;"></div>
        <div class="w-4 h-4 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" style="animation: blink 0.5s infinite;"></div>
      </div>
      <div class="flex gap-2">
        <div class="w-16 h-2 bg-[#333] rounded"></div>
        <div class="w-8 h-2 bg-[#333] rounded"></div>
      </div>
    </div>
    
    <!-- Server 3 -->
    <div class="w-full h-16 bg-[#161616] rounded-lg border border-[#333] flex items-center px-6 relative overflow-hidden shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
      <div class="absolute left-0 top-0 bottom-0 w-2 bg-[#444]"></div>
      <div class="flex-1 flex gap-3">
        <div class="w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" style="animation: blink 2.5s infinite;"></div>
        <div class="w-4 h-4 rounded-full bg-[#333]"></div>
        <div class="w-4 h-4 rounded-full bg-[#333]"></div>
      </div>
      <div class="flex gap-2">
        <div class="w-10 h-2 bg-[#333] rounded"></div>
        <div class="w-12 h-2 bg-[#333] rounded"></div>
      </div>
    </div>
  </div>
</div>

		<p>We are going to orchestrate four fundamentally distinct open-source software packages to work symmetrically.</p>

		<ol>
			<li><strong>The Inference Engine (Ollama):</strong> Will host both the heavy conversational generative model (e.g., Llama 3) and a small, highly efficient 'Embedding Model' designed exclusively to translate text strings into dense arrays of numbers (e.g., Nomic-Embed-Text).</li>
			<li><strong>The Vector Database (Qdrant):</strong> Written entirely in Rust, Qdrant is staggeringly fast. It will permanently store these vast embedding arrays and rapidly calculate the geometric 'cosine-distance' between your question and thousands of pages of internal documents in milliseconds.</li>
			<li><strong>The Web Crawler (SearXNG + Browserless):</strong> For real-time data lacking in your internal database, SearXNG will quietly scour the internet anonymously, while Browserless utilizes a headless Chromium instance to bypass Cloudflare scripts and read raw target paragraphs dynamically.</li>
			<li><strong>The Orchestrator (n8n):</strong> The visual logic glue that controls the physical data pipeline pathways.</li>
		</ol>

		<h2>Infrastructure Generation via better-openclaw</h2>
		<p>Wiring these internal Docker bridges manually is hazardous due to latency bottlenecks and potential security misconfigurations. Using better-openclaw significantly accelerates the deployment by utilizing a heavily-tested preset flag:</p>

		<pre><code>npx create-better-openclaw --preset researcher --yes</code></pre>

		<p>This explicit preset scaffolds the exact requested services. It links the Redis cache layer into SearXNG dynamically so sequential identical search queries resolve in 0ms without exhausting API limits, and it automatically connects Qdrant to an isolated persistive volume so your vector arrays survive total server reboots permanently.</p>

		<h2>Phase 1: The Ingestion Pipeline (Loading Data)</h2>
		<p>Before the LLM can pull data, the data must be vectorized.</p>
		<p>Using n8n, create an entirely new automated ingestion workflow:</p>
		<ul>
			<li><strong>Trigger:</strong> Watch a specific local server directory via a local File Trigger, or listen to a webhook endpoint that receives uploaded PDFs dynamically.</li>
			<li><strong>Chunking:</strong> Large entire documents must be fractured. A 100-page PDF will overload a context window. Use the 'Document Chunking' node to slice the text into overlapping segments (e.g., 512 tokens long, with a 50-token overlap to ensure paragraphs aren't abruptly cut off mid-sentence).</li>
			<li><strong>Embedding Translation:</strong> Pass each tiny 512-token chunk to the Ollama API, explicitly demanding it uses the <code>nomic-embed-text</code> model. Ollama responds with a massive array of floats like <code>[0.0123, -0.0456...]</code>.</li>
			<li><strong>Database Injection:</strong> Send these vast numerical arrays into Qdrant alongside critical metadata tags representing the origin of the chunk (<code>author: "Alice"</code>, <code>department: "Legal"</code>, <code>date: "2026-01-14"</code>).</li>
		</ul>

		<h2>Phase 2: The Retrieval Pipeline (Answering Questions)</h2>
		<p>When the user subsequently queries the chatbot interface (like Open WebUI or Librechat), the flow inverses:</p>
		
		<p>The user asks: <em>"What is our updated remote work policy regarding out-of-state travel?"</em></p>
		
		<p>The orchestrator algorithm intercepts this sentence explicitly. It immediately bounces the text string to the exact same <code>nomic-embed-text</code> model on Ollama, converting the question itself into a vector array. It then queries Qdrant: <em>"Fetch the top 5 most mathematically similar arrays to this question, but strictly filter metadata so the department is equal to 'HR'."</em></p>

		<p>Qdrant retrieves the five exact correct paragraphs spanning millions of documents instantly. Finally, the orchestrator compiles the final super-prompt dynamically:</p>

		<pre><code>
System rules: Answer the user's question using ONLY the provided explicit context blocks below. 
If the answer is not present, explicitly declare ignorance.

Context Block 1: [Inserted Qdrant text]
Context Block 2: [Inserted Qdrant text]

User Question: What is our updated remote work policy regarding out-of-state travel?
		</code></pre>

		<p>This super-prompt is passed to the massive conversational Llama 3 model. Because the context is forcefully anchored natively within the prompt, the Llama model flawlessly synthesizes the exact truthful answer without a single hallucinated artifact, and crucially, without a single byte of plaintext data ever traversing the public internet.</p>
	`,
};
