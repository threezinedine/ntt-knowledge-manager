import type { AiSummaryProvider, AiSummaryResult } from "./ai-summary-provider";

const API_KEY = (import.meta.env.VITE_GEMINI_API_KEY as string | undefined) ?? "";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

export class GeminiProvider implements AiSummaryProvider {
	name = "Gemini 1.5 Flash";

	async summarize(systemPrompt: string, userInput: string): Promise<AiSummaryResult> {
		const response = await fetch(API_URL, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				system_instruction: systemPrompt
					? { parts: [{ text: systemPrompt }] }
					: undefined,
				contents: [{ parts: [{ text: userInput }] }],
				generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
			}),
		});

		if (!response.ok) {
			const err = await response.json().catch(() => ({}));
			throw new Error(err?.error?.message ?? `Gemini error ${response.status}`);
		}

		const data = await response.json();
		const output: string =
			data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

		if (!output) throw new Error("Gemini returned an empty response");

		return { systemPrompt, userInput, output };
	}
}
