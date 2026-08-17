export type AiSummaryResult = {
	systemPrompt: string;
	userInput: string;
	output: string;
};

export type ChatMessage = {
	role: "system" | "user" | "assistant";
	content: string;
};

export interface AiSummaryProvider {
	name: string;
	summarize(systemPrompt: string, userInput: string): Promise<AiSummaryResult>;
	chatComplete(messages: ChatMessage[]): Promise<string>;
}
