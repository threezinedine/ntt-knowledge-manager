import type { AiSummaryProvider } from "./ai-summary-provider";
import { FallbackAiSummaryProvider } from "./fallback-ai-summary-provider";
import { GeminiProvider } from "./gemini-provider";
import { GroqProvider } from "./groq-provider";
import { MockAiSummaryProvider } from "./mock-ai-summary-provider";

export type { AiSummaryResult, AiSummaryProvider } from "./ai-summary-provider";

function createDefaultProvider(): AiSummaryProvider {
	const providers: AiSummaryProvider[] = [];

	if (import.meta.env.VITE_GEMINI_API_KEY) {
		providers.push(new GeminiProvider());
	}

	providers.push(new GroqProvider());

	if (providers.length === 1) return providers[0];
	return new FallbackAiSummaryProvider(providers);
}

let activeProvider: AiSummaryProvider = createDefaultProvider();

export function setAiSummaryProvider(provider: AiSummaryProvider): void {
	activeProvider = provider;
}

export function getAiSummaryProvider(): AiSummaryProvider {
	return activeProvider;
}

export function summarize(systemPrompt: string, userInput: string) {
	return activeProvider.summarize(systemPrompt, userInput);
}
