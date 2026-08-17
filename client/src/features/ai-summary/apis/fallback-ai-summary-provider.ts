import type { AiSummaryProvider, AiSummaryResult } from "./ai-summary-provider";

export class FallbackAiSummaryProvider implements AiSummaryProvider {
	name: string;
	private providers: AiSummaryProvider[];

	constructor(providers: AiSummaryProvider[]) {
		this.providers = providers;
		this.name = `Fallback(${providers.map((p) => p.name).join(" → ")})`;
	}

	async summarize(systemPrompt: string, userInput: string): Promise<AiSummaryResult> {
		let lastError: unknown;

		for (const provider of this.providers) {
			try {
				return await provider.summarize(systemPrompt, userInput);
			} catch (err) {
				lastError = err;
			}
		}

		throw lastError;
	}
}
