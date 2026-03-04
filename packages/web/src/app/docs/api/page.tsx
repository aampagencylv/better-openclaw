import Link from "next/link";

export const metadata = {
	title: "API Overview — better-openclaw Docs",
	description:
		"REST API overview for better-openclaw. Base URL, authentication, rate limiting, and quick examples.",
};

export default function ApiOverviewPage() {
	return (
		<>
			<h1>API Overview</h1>
			<p>
				The better-openclaw REST API lets you programmatically generate OpenClaw stacks, validate
				configurations, and browse available services and skill packs. Use it to build integrations,
				CI/CD pipelines, or custom UIs.
			</p>

			<h2>Base URL</h2>
			<p>
				The API is available at the web application&apos;s base URL. In development, that&apos;s
				typically:
			</p>
			<pre>
				<code>{`http://localhost:3000/api`}</code>
			</pre>
			<p>In production:</p>
			<pre>
				<code>{`https://better-openclaw.dev/api`}</code>
			</pre>
			<p>
				All endpoints are prefixed with <code>/api</code> followed by the version (currently{" "}
				<code>/api/v1</code>), giving you a full base URL of:
			</p>
			<pre>
				<code>{`https://better-openclaw.dev/api/v1`}</code>
			</pre>

			<h2>Authentication</h2>
			<p>
				The public API endpoints (listing services, skill packs, and presets) do not require
				authentication. For stack generation endpoints, you need an API key.
			</p>

			<h3>Getting an API Key</h3>
			<p>
				Set the <code>OPENCLAW_API_KEY</code> environment variable in your deployment&apos;s{" "}
				<code>.env</code> file to enable authentication:
			</p>
			<pre>
				<code>{`# .env
OPENCLAW_API_KEY=your-secret-api-key-here`}</code>
			</pre>

			<h3>Using the API Key</h3>
			<p>
				Pass the API key in the <code>Authorization</code> header:
			</p>
			<pre>
				<code>{`curl -X POST https://better-openclaw.dev/api/v1/generate \\
  -H "Authorization: Bearer your-secret-api-key-here" \\
  -H "Content-Type: application/json" \\
  -d '{"preset": "researcher"}'`}</code>
			</pre>

			<h3>Public vs Protected Endpoints</h3>
			<table>
				<thead>
					<tr>
						<th>Endpoint</th>
						<th>Auth Required</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>
							<code>GET /api/v1/health</code>
						</td>
						<td>No</td>
					</tr>
					<tr>
						<td>
							<code>GET /api/v1/services</code>
						</td>
						<td>No</td>
					</tr>
					<tr>
						<td>
							<code>GET /api/v1/skills</code>
						</td>
						<td>No</td>
					</tr>
					<tr>
						<td>
							<code>GET /api/v1/presets</code>
						</td>
						<td>No</td>
					</tr>
					<tr>
						<td>
							<code>POST /api/v1/validate</code>
						</td>
						<td>Yes</td>
					</tr>
					<tr>
						<td>
							<code>POST /api/v1/generate</code>
						</td>
						<td>Yes</td>
					</tr>
					<tr>
						<td>
							<code>GET /api/v1/presets/:name</code>
						</td>
						<td>No</td>
					</tr>
				</tbody>
			</table>

			<h2>Rate Limiting</h2>
			<p>The API enforces rate limits to prevent abuse:</p>
			<table>
				<thead>
					<tr>
						<th>Endpoint Type</th>
						<th>Limit</th>
						<th>Window</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Read (GET)</td>
						<td>100 requests</td>
						<td>Per minute</td>
					</tr>
					<tr>
						<td>Write (POST)</td>
						<td>20 requests</td>
						<td>Per minute</td>
					</tr>
					<tr>
						<td>Generate</td>
						<td>5 requests</td>
						<td>Per minute</td>
					</tr>
				</tbody>
			</table>
			<p>Rate limit headers are included in every response:</p>
			<pre>
				<code>{`X-RateLimit-Limit: 100
X-RateLimit-Remaining: 97
X-RateLimit-Reset: 1700000000`}</code>
			</pre>
			<p>
				When rate limited, the API returns <code>429 Too Many Requests</code> with a{" "}
				<code>Retry-After</code> header indicating when you can retry.
			</p>

			<h2>Response Format</h2>
			<p>All responses are JSON. Successful responses follow this structure:</p>
			<pre>
				<code>{`{
  "ok": true,
  "data": { ... }
}`}</code>
			</pre>
			<p>Error responses:</p>
			<pre>
				<code>{`{
  "ok": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Service 'invalid-service' does not exist",
    "details": { ... }
  }
}`}</code>
			</pre>

			<h2>Error Codes</h2>
			<table>
				<thead>
					<tr>
						<th>HTTP Status</th>
						<th>Code</th>
						<th>Description</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>400</td>
						<td>
							<code>VALIDATION_ERROR</code>
						</td>
						<td>Invalid request body or parameters</td>
					</tr>
					<tr>
						<td>401</td>
						<td>
							<code>UNAUTHORIZED</code>
						</td>
						<td>Missing or invalid API key</td>
					</tr>
					<tr>
						<td>404</td>
						<td>
							<code>NOT_FOUND</code>
						</td>
						<td>Resource not found</td>
					</tr>
					<tr>
						<td>409</td>
						<td>
							<code>CONFLICT</code>
						</td>
						<td>Conflicting services selected</td>
					</tr>
					<tr>
						<td>429</td>
						<td>
							<code>RATE_LIMITED</code>
						</td>
						<td>Too many requests</td>
					</tr>
					<tr>
						<td>500</td>
						<td>
							<code>INTERNAL_ERROR</code>
						</td>
						<td>Unexpected server error</td>
					</tr>
				</tbody>
			</table>

			<h2>Quick Example</h2>
			<pre>
				<code>{`# List all available services
curl https://better-openclaw.dev/api/v1/services | jq

# Generate a stack
curl -X POST https://better-openclaw.dev/api/v1/generate \\
  -H "Authorization: Bearer $OPENCLAW_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "my-stack",
    "preset": "researcher",
    "proxy": "caddy",
    "domain": "ai.example.com"
  }'`}</code>
			</pre>

			<h2>Next Steps</h2>
			<ul>
				<li>
					<Link href="/docs/api/endpoints">All Endpoints</Link> — full request and response
					reference
				</li>
				<li>
					<Link href="/docs/services">Service Catalog</Link> — browse available services
				</li>
				<li>
					<Link href="/docs/skill-packs">Skill Packs</Link> — curated skill bundles
				</li>
			</ul>
		</>
	);
}
