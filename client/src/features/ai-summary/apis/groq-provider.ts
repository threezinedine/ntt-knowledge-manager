import type { AiSummaryProvider, AiSummaryResult } from "./ai-summary-provider";

const API_KEY = (import.meta.env.VITE_GROQ_API_KEY as string | undefined) ?? "";
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

export class GroqProvider implements AiSummaryProvider {
	name: string;
	private model: string;

	constructor(model = "llama3-8b-8192") {
		this.model = model;
		this.name = `Groq (${model})`;
	}

	async summarize(systemPrompt: string, userInput: string): Promise<AiSummaryResult> {
		const messages: { role: string; content: string }[] = [];

		if (systemPrompt) {
			messages.push({ role: "system", content: systemPrompt });
		}

		messages.push({ role: "user", content: userInput });

		const response = await fetch(API_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${API_KEY}`,
			},
			body: JSON.stringify({
				model: this.model,
				messages,
				temperature: 0.7,
				max_tokens: 1024,
			}),
		});

		if (!response.ok) {
			const err = await response.json().catch(() => ({}));
			throw new Error(err?.error?.message ?? `Groq error ${response.status}`);
		}

		const data = await response.json();
		const output: string = data?.choices?.[0]?.message?.content ?? "";

		if (!output) throw new Error("Groq returned an empty response");

		return { systemPrompt, userInput, output };
	}
}
