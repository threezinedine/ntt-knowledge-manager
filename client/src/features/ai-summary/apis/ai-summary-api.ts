import type { AiSummaryProvider } from "./ai-summary-provider";
import { MockAiSummaryProvider } from "./mock-ai-summary-provider";

export type { AiSummaryResult, AiSummaryProvider } from "./ai-summary-provider";

let activeProvider: AiSummaryProvider = new MockAiSummaryProvider();

export function setAiSummaryProvider(provider: AiSummaryProvider): void {
	activeProvider = provider;
}

export function getAiSummaryProvider(): AiSummaryProvider {
	return activeProvider;
}

export function summarize(systemPrompt: string, userInput: string) {
	return activeProvider.summarize(systemPrompt, userInput);
}
