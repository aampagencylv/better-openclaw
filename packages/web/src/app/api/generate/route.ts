import { NextResponse } from "next/server";
import { generate, GenerationInputSchema } from "@better-openclaw/core";

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const parsed = GenerationInputSchema.safeParse(body);

		if (!parsed.success) {
			return NextResponse.json(
				{
					error: {
						code: "VALIDATION_ERROR",
						message: "Invalid request body",
						details: parsed.error.issues,
					},
				},
				{ status: 400 },
			);
		}

		const result = generate(parsed.data);
		return NextResponse.json(result);
	} catch (err) {
		return NextResponse.json(
			{
				error: {
					code: "GENERATION_ERROR",
					message: err instanceof Error ? err.message : "Generation failed",
				},
			},
			{ status: 500 },
		);
	}
}
