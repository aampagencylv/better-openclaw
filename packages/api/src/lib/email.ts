import { UseSend } from "usesend-js";

const apiKey = process.env.UNSEND_API_KEY ?? "";
const apiUrl = process.env.UNSEND_API_URL ?? "https://app.usesend.com";
const FROM = process.env.EMAIL_FROM ?? "better-openclaw <noreply@bidewio.tech>";

// Create a mock client if there's no API key (e.g., in tests or local dev without email configured)
const client = apiKey
	? new UseSend(apiKey, apiUrl)
	: ({
			emails: {
				send: async () => {
					if (process.env.NODE_ENV !== "test") {
						console.warn("Skipped sending email: UNSEND_API_KEY is not set.");
					}
				},
			},
		} as unknown as UseSend);

interface SendEmailOptions {
	to: string;
	subject: string;
	html: string;
	text?: string;
}

export async function sendEmail({ to, subject, html, text }: SendEmailOptions): Promise<void> {
	await client.emails.send({
		to,
		from: FROM,
		subject,
		html,
		text: text ?? subject,
	});
}

// ── Email templates ───────────────────────────────────────────────────────────

function baseLayout(title: string, body: string): string {
	return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 16px;">
  <tr><td align="center">
    <table width="520" cellpadding="0" cellspacing="0" style="background:#141414;border:1px solid #262626;border-radius:12px;overflow:hidden;max-width:520px;width:100%;">
      <!-- Header -->
      <tr><td style="background:linear-gradient(135deg,#1a120a 0%,#0d0d0d 100%);padding:28px 32px;border-bottom:1px solid #262626;">
        <span style="font-size:22px;font-weight:700;color:#e8e0d0;letter-spacing:-0.5px;">🦞 better-openclaw</span>
      </td></tr>
      <!-- Body -->
      <tr><td style="padding:32px;">${body}</td></tr>
      <!-- Footer -->
      <tr><td style="padding:20px 32px;border-top:1px solid #1f1f1f;background:#0f0f0f;">
        <p style="margin:0;font-size:12px;color:#555;line-height:1.5;">
          You received this email because an action was performed on your better-openclaw account.<br>
          If you didn't request this, you can safely ignore this email.
        </p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

function ctaButton(href: string, label: string): string {
	return `<a href="${href}" style="display:inline-block;background:#b87333;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 28px;border-radius:8px;letter-spacing:0.3px;">${label}</a>`;
}

function bodyText(text: string): string {
	return `<p style="margin:0 0 16px;color:#a0a0a0;font-size:14px;line-height:1.6;">${text}</p>`;
}

export function buildWelcomeEmail(name: string): { subject: string; html: string } {
	const subject = "Welcome to better-openclaw 🦞";
	const html = baseLayout(
		subject,
		`<h1 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#e8e0d0;">Welcome, ${name}! 🎉</h1>
${bodyText("Your better-openclaw account is ready. You can now save stacks, manage favorites, and build production-ready OpenClaw environments in seconds.")}
${bodyText("Head to the Stack Builder to create your first stack:")}
<div style="margin:24px 0;">${ctaButton(process.env.WEB_URL ?? "http://localhost:3654", "Open Stack Builder")}</div>
${bodyText("Questions? Just reply to this email.")}`,
	);
	return { subject, html };
}

export function buildVerificationEmail(name: string, url: string): { subject: string; html: string } {
	const subject = "Verify your email — better-openclaw";
	const html = baseLayout(
		subject,
		`<h1 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#e8e0d0;">Verify your email</h1>
${bodyText(`Hi ${name}, click the button below to verify your email address.`)}
<div style="margin:24px 0;">${ctaButton(url, "Verify Email")}</div>
${bodyText("This link expires in 24 hours.")}
<p style="margin:0;font-size:12px;color:#555;">Or copy this URL: <span style="color:#7a5c3a;word-break:break-all;">${url}</span></p>`,
	);
	return { subject, html };
}

export function buildResetPasswordEmail(name: string, url: string): { subject: string; html: string } {
	const subject = "Reset your password — better-openclaw";
	const html = baseLayout(
		subject,
		`<h1 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#e8e0d0;">Reset your password</h1>
${bodyText(`Hi ${name}, we received a request to reset the password for your account.`)}
<div style="margin:24px 0;">${ctaButton(url, "Reset Password")}</div>
${bodyText("This link expires in 1 hour. If you didn't request a password reset, you can safely ignore this email.")}
<p style="margin:0;font-size:12px;color:#555;">Or copy this URL: <span style="color:#7a5c3a;word-break:break-all;">${url}</span></p>`,
	);
	return { subject, html };
}

export function buildMagicLinkEmail(email: string, url: string): { subject: string; html: string } {
	const subject = "Your magic sign-in link — better-openclaw";
	const html = baseLayout(
		subject,
		`<h1 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#e8e0d0;">Sign in to better-openclaw</h1>
${bodyText(`Click the button below to sign in to <strong style="color:#c8b89a;">${email}</strong>. No password needed.`)}
<div style="margin:24px 0;">${ctaButton(url, "Sign In →")}</div>
${bodyText("This link expires in 15 minutes and can only be used once.")}
<p style="margin:0;font-size:12px;color:#555;">Or copy this URL: <span style="color:#7a5c3a;word-break:break-all;">${url}</span></p>`,
	);
	return { subject, html };
}
