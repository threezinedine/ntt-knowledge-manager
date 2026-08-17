import { create } from "zustand";
import { summarize, type AiSummaryResult } from "../apis/ai-summary-api";

type AiSummaryState = {
	systemPrompt: string;
	userInput: string;
	result: AiSummaryResult | null;
	loading: boolean;
	error: string | null;
	setSystemPrompt: (value: string) => void;
	setUserInput: (value: string) => void;
	submit: (systemPrompt: string, userInput: string) => Promise<void>;
	clear: () => void;
};

export const useAiSummaryStore = create<AiSummaryState>((set) => ({
	systemPrompt: "",
	userInput: "",
	result: null,
	loading: false,
	error: null,

	setSystemPrompt: (value) => {
		set({ systemPrompt: value });
	},

	setUserInput: (value) => {
		set({ userInput: value, result: null, error: null });
	},

	submit: async (systemPrompt, userInput) => {
		set({ loading: true, error: null });
		try {
			const result = await summarize(systemPrompt, userInput);
			set({ result, loading: false });
		} catch {
			set({ loading: false, error: "Failed to process request", result: null });
		}
	},

	clear: () => {
		set({
			systemPrompt: "",
			userInput: "",
			result: null,
			loading: false,
			error: null,
		});
	},
}));
