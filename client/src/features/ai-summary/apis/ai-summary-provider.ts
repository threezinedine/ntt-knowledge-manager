export type AiSummaryResult = {
	systemPrompt: string;
	userInput: string;
	output: string;
};

export interface AiSummaryProvider {
	name: string;
	summarize(systemPrompt: string, userInput: string): Promise<AiSummaryResult>;
}
