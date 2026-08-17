import type { AiSummaryProvider, AiSummaryResult } from "./ai-summary-provider";

export class MockAiSummaryProvider implements AiSummaryProvider {
	name = "Mock AI";

	async summarize(systemPrompt: string, userInput: string): Promise<AiSummaryResult> {
		await new Promise((resolve) => setTimeout(resolve, 800));

		return {
			systemPrompt,
			userInput,
			output: `[Mock AI Response]\n\nSystem: "${systemPrompt}"\n\nBased on your input, here is a summary of the provided text:\n\n"${userInput.slice(0, 200)}${userInput.length > 200 ? "..." : ""}"`,
		};
	}
}
