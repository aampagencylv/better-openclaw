import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Terms of Service | Better OpenClaw",
	description: "Terms of Service for using Better OpenClaw.",
};

export default function TermsPage() {
	return (
		<div className="container max-w-4xl py-12 md:py-24">
			<div className="prose prose-slate dark:prose-invert max-w-none">
				<h1>Terms of Service</h1>
				<p className="lead">Last updated: {new Date().toLocaleDateString()}</p>

				<h2>1. Acceptance of Terms</h2>
				<p>
					By accessing this website or using the Better OpenClaw CLI tool, you agree to be bound by
					these Terms of Service and all applicable laws and regulations.
				</p>

				<h2>2. License (MIT)</h2>
				<p>
					Better OpenClaw is open-source software licensed under the <strong>MIT License</strong>.
				</p>
				<blockquote>
					Permission is hereby granted, free of charge, to any person obtaining a copy of this
					software and associated documentation files (the "Software"), to deal in the Software
					without restriction, including without limitation the rights to use, copy, modify, merge,
					publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons
					to whom the Software is furnished to do so, subject to the following conditions:
					<br />
					<br />
					The above copyright notice and this permission notice shall be included in all copies or
					substantial portions of the Software.
				</blockquote>

				<h2>3. Disclaimer of Warranties</h2>
				<p>
					THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
					INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
					PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
					FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
					OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
					DEALINGS IN THE SOFTWARE.
				</p>

				<h2>4. User Responsibility</h2>
				<p>You are solely responsible for:</p>
				<ul>
					<li>The security and configuration of your self-hosted infrastructure.</li>
					<li>
						Compliance with the terms of service of any third-party APIs (e.g., OpenAI, Anthropic)
						you integrate with your stack.
					</li>
					<li>Any data or content processed by your AI agents.</li>
				</ul>

				<h2>5. Limitations</h2>
				<p>
					In no event shall Better OpenClaw or its contributors be liable for any damages
					(including, without limitation, damages for loss of data or profit, or due to business
					interruption) arising out of the use or inability to use the materials on Better
					OpenClaw's website or software.
				</p>

				<h2>6. Modifications</h2>
				<p>
					We may revise these terms of service at any time without notice. By using this website or
					software you are agreeing to be bound by the then current version of these terms of
					service.
				</p>
			</div>
		</div>
	);
}
