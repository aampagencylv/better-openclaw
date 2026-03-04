import type { BlogPost } from "../types";

export const post: BlogPost = {
	slug: "docker-compose-best-practices-multi-service",
	title: "Architectural Docker Compose Best Practices for 10+ Multi-Service Stacks",
	description:
		"Essential best practices for managing complex continuous Docker Compose files — explicitly covering isolated networking, exhaustive health checking, hard resource limits, deterministic dependency ordering, and deployment strategies.",
	date: "2026-02-08",
	readTime: "13 min read",
	category: "Docker",
	tags: ["docker-compose", "best-practices", "devops", "containers", "architecture"],
	content: `
		<p>Running isolated twin microservices in Docker Compose is trivially simple. But as an AI or DevOps stack scales to accommodate 10, 20, or even 50 simultaneous containers alongside reverse-proxies, queues, active scrapers, and telemetry servers, naïve Docker Compose files will buckle under the chaos.</p>

		<p>Without enforcing stringent architectural constraints natively inside the YAML, you will encounter inexplicable race conditions on boot, silent database corruption, massive OOM (Out Of Memory) kernel kills, and port leakage. Here are the rigorous best practices implemented by default inside every robust better-openclaw configuration.</p>

		<h2>1. Deterministic Image Tagging (Never Use \`:latest\`)</h2>


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

		<p>The most devastating mistake a system administrator makes is relying on the volatile <code>:latest</code> tag within a production repository. A container designated as <code>postgres:latest</code> guarantees that the next time the system casually reboots or the daemon runs a localized <code>docker compose pull</code>, your database software might silently execute an arbitrary major version upgrade. If version 16 abruptly alters its fundamental data-directory schema mapping, your production database will irrevocably crash on startup, refusing to read the deprecated volume mappings.</p>
		
		<p><strong>The Solution:</strong> Hard-pin every single Docker image using deeply specific Semantic Versioning identifiers. Rather than writing <code>image: redis</code>, write <code>image: redis:7.2.4-alpine</code>. This locks the application runtime into absolute deterministic consistency. Updating a container becomes an explicit, deliberate, testable modification.</p>

		<h2>2. Exhaustive Container Health Checks</h2>
		<p>By default, Docker's internal mechanism considers any container "Healthy" the explicit millisecond its process PID spawns. It completely ignores whether the internal web-server is actually functionally accepting TCP connections. Without defined health-checks, dependent applications will attempt a barrage of API connections to a database that is actively occupied initializing its own background schema indexing, leading to cryptic <code>ECONNREFUSED</code> loop failures.</p>

		<p><strong>The Solution:</strong> Implement the <code>healthcheck</code> block universally.</p>
		<ul>
			<li><strong>PostgreSQL:</strong> <code>test: ["CMD-SHELL", "pg_isready -U postgres"]</code></li>
			<li><strong>Redis:</strong> <code>test: ["CMD", "redis-cli", "ping"]</code></li>
			<li><strong>Web API Layer:</strong> <code>test: ["CMD-SHELL", "wget --no-verbose --tries=1 --spider http://127.0.0.1:8080/healthz || exit 1"]</code></li>
		</ul>
		<p>Couple this methodology directly alongside explicitly defined <code>depends_on</code> ordering containing the critical <code>condition: service_healthy</code> directive. Application Layer A will fundamentally refuse to initiate its boot sequence until Database Layer B reports consecutive success loops. Intermittent boot-sequence race conditions are permanently eliminated.</p>

		<h2>3. Hard Kernel Resource Limitations</h2>
		<p>By default, the Docker daemon attempts to democratize host resources. If a poorly optimized Python scraping script container encounters an infinite recursive memory leak, it will gleefully devour 100% of the available system RAM and swap-space. This initiates a catastrophic domino effect: the Linux kernel panics and invokes the OOM Killer, terminating arbitrary critical processes indiscriminately to protect the root file system.</p>

		<p><strong>The Solution:</strong> Architect explicit ceiling limitations using <code>mem_limit</code> and CPU quota allocations inside every solitary service definition.</p>
		<pre><code>
deploy:
  resources:
    limits:
      cpus: '2.0'
      memory: 2G
    reservations:
      cpus: '0.1'
      memory: 256M
		</code></pre>
		<p>Intelligent frameworks like better-openclaw programmatically analyze the server's aggregate capacity during compilation, carving out fractional mathematical boundaries scaling proportionally to guarantee the master node retains 10% memory availability to prevent system lockups under maximum localized stress.</p>

		<h2>4. Dedicated Internal Bridge Networking</h2>
		<p>Do not expose any service blindly via explicit <code>ports:</code> bridging (e.g., <code>"5432:5432"</code>) unless you actively intend to interface with that exact container manually from outside your home network. Exposing databases or caching instances directly to the host exposes vulnerable protocol attack vectors.</p>

		<p><strong>The Solution:</strong> Establish independent internal Docker overlay networks. A standard robust deployment isolates data tiers from routing logic: a <code>frontend_proxy</code> network spanning the Reverse-Proxy to the Application services, and a distinct <code>backend_secure</code> network spanning the Application services exclusively to the databases. This creates software perimeter isolation restricting lateral movement natively. Only your unified proxy gateway (such as Caddy or Traefik) requires port 80 and 443 <code>ports:</code> exposures, sealing your internal framework cryptographically behind its TLS enforcement layer.</p>
	`,
};
