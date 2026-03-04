import type { BlogPost } from "../types";

export const post: BlogPost = {
	slug: "caddy-vs-traefik-homelab-reverse-proxy",
	title: "Reverse Proxy Architecture: Caddy vs. Traefik for Homelab and Enterprise",
	description:
		"An uncompromising technical comparison of Caddy and Traefik as reverse proxies for multi-service environments, covering automated cryptography, dynamic routing, performance benchmarks, and Docker interplay.",
	date: "2026-02-02",
	readTime: "11 min read",
	category: "Homelab",
	tags: ["caddy", "traefik", "reverse-proxy", "ssl", "homelab", "networking"],
	content: `
		<p>Running a single web application on port 80 is easy. Running 15 independent Docker containers—ranging from LLM APIs and Vector Databases to React front-ends and monitoring telemetry dashboards—on a single host is a routing nightmare. This complexity necessitates a Reverse Proxy: a specialized gateway server that intercepts all inbound internet traffic on port 443 (HTTPS) and conditionally forwards it internally to the precise hidden application port based on the requested domain name (e.g., <code>n8n.yourserver.com</code> routing internally to port 5678).</p>

		<p>Beyond elementary routing, the proxy fundamentally assumes responsibility for the most critical security layer of your infrastructure: actively negotiating, establishing, and indefinitely renewing SSL/TLS cryptographic certificates.</p>

		<p>In 2026, the archaic process of manually manipulating Nginx configurations with fragile Let's Encrypt Certbot cron-jobs is completely obsolete. The industry standard has unilaterally converged on two dominant, highly-capable proxies: <strong>Caddy</strong> and <strong>Traefik</strong>.</p>

		<h2>Caddy: Unapologetic Simplicity and Native Security</h2>


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
    <text x="480" y="70" fill="#fff" font-family="sans-serif" font-size="14" font-weight="bold"><h2>Caddy: Unapologetic Simplicity and Native Security</h2>0k+ / MRR</text>

    <!-- Self-Hosted Bar -->
    <line x1="150" y1="145" x2="650" y2="145" stroke="#444" stroke-width="30" stroke-linecap="round" />
    <line x1="150" y1="145" x2="230" y2="145" stroke="#10b981" stroke-width="30" stroke-linecap="round" style="animation: grow-bar-short 2s ease-out forwards;" />
    <text x="250" y="150" fill="#10b981" font-family="sans-serif" font-size="14" font-weight="bold">~$50 - $200 Fixed</text>

    <!-- Bottom Axis -->
    <text x="150" y="230" fill="#666" font-family="sans-serif" font-size="12" text-anchor="middle">$0</text>
    <text x="550" y="230" fill="#666" font-family="sans-serif" font-size="12" text-anchor="middle">$ High Usage</text>
  </svg>
</div>

		<p>Written elegantly in Go, Caddy's entire fundamental philosophy is "HTTPS by default." You establish a single configuration file—the Caddyfile—which is aggressively concise. Rather than authoring 40 lines of Nginx parameters, connecting a domain merely requires two lines of text.</p>

		<p>When Caddy detects a new domain mapping in its configuration, it autonomously contacts Let's Encrypt (or ZeroSSL), completes the ACME challenge natively, binds the cryptographic certificate locally, and rotates it weeks before expiration without any external chron dependencies or arbitrary bash scripts. Everything "just operates."</p>

		<h3>When to use Caddy:</h3>
		<ul>
			<li><strong>Configuration Velocity:</strong> If you are administrating a static topography of 5 to 20 containers that rarely mutate, the Caddyfile provides instant, readable documentation of your absolute entire network topology on a single screen.</li>
			<li><strong>Zero-Friction File Serving:</strong> Caddy inherently acts as a blistering-fast static file server. Serving a highly optimized React or Vue Single Page Application directly through Caddy negates the need for standing up explicit node servers whatsoever.</li>
		</ul>

		<p>Using <code>better-openclaw</code>, selecting the Caddy preset generates an exhaustive, flawlessly orchestrated <code>Caddyfile</code> appending strict security headers, Cross-Origin Resource Sharing (CORS) directives, and native WebSocket passthrough tunnels specifically formatted for all dependent applications instantiated.</p>

		<h2>Traefik: Native Docker Mutability and Edge Routing</h2>
		<p>Traefik approaches the routing dilemma from the absolute opposite paradigm. Traefik doesn't rely heavily on static configuration files; instead, it binds directly to the localized <code>/var/run/docker.sock</code> socket. It perpetually listens for Docker daemon events.</p>

		<p>When you spin up a brand new microservice, you append specific Traefik metadata labels directly to the Docker container YAML descriptor. Traefik instantaneously intercepts these labels, detects the newly allocated local IP address, constructs the routing rule dynamically, provisions the SSL certificate, and instantly binds the endpoint—all with exactly zero downtime and zero manual configuration reloading.</p>

		<h3>When to use Traefik:</h3>
		<ul>
			<li><strong>Aggressive Scalability:</strong> If your CI/CD pipeline dynamically destroys and recreates varied staging environments persistently or if you use Docker Swarm to spin up dozens of identical load-balanced worker nodes randomly.</li>
			<li><strong>Middleware Pipelines:</strong> Traefik champions "Middlewares"—composable logic blocks capable of intercepting traffic before it impacts the fundamental application. You can inject strict Rate-Limiting mechanisms, HTTP-to-HTTPS redirection, or append mandatory OpenID-Connect SSO authentication overlays universally across any internal application arbitrarily without modifying the internal application's source code.</li>
		</ul>

		<h2>Performance Arbitration and Conclusion</h2>
		<p>In empirical stress testing, both proxies saturate standard gigabit uplinks easily, managing tens of thousands of simultaneous multiplexed connections leveraging barely ~50MB of operational RAM overhead due to their highly optimized Go architectures.</p>

		<p>Choose Caddy when deploying stable homelab architecture or monolithic applications where an explicitly defined static configuration file feels like a comforting, auditable source-of-truth. Choose Traefik exclusively when orchestrating highly ephemeral, auto-scaling Kubernetes or Swarm clusters where manual configuration file management fundamentally breaks the entire deployment velocity model.</p>
	`,
};
