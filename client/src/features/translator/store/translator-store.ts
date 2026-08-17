import { create } from "zustand";
import { translate, type TranslateResult } from "../apis/translator-api";

type TranslatorState = {
	query: string;
	result: TranslateResult | null;
	loading: boolean;
	error: string | null;
	sourceLang: string;
	targetLang: string;
	setQuery: (query: string) => void;
	setSourceLang: (lang: string) => void;
	setTargetLang: (lang: string) => void;
	swapLanguages: () => void;
	submit: (text: string) => Promise<void>;
	clear: () => void;
};

export const useTranslatorStore = create<TranslatorState>((set, get) => ({
	query: "",
	result: null,
	loading: false,
	error: null,
	sourceLang: "English",
	targetLang: "Vietnamese",

	setQuery: (query) => {
		set({ query, result: null, error: null });
	},

	setSourceLang: (lang) => {
		set({ sourceLang: lang });
	},

	setTargetLang: (lang) => {
		set({ targetLang: lang });
	},

	swapLanguages: () => {
		const { sourceLang, targetLang, result } = get();
		set({
			sourceLang: targetLang,
			targetLang: sourceLang,
			query: result?.translatedText ?? "",
			result: null,
			error: null,
		});
	},

	submit: async (text) => {
		const { sourceLang, targetLang } = get();
		set({ loading: true, error: null });
		try {
			const result = await translate(text, sourceLang, targetLang);
			set({ result, loading: false, query: text });
		} catch {
			set({ loading: false, error: `Translation failed for "${text}"`, result: null });
		}
	},

	clear: () => {
		set({
			query: "",
			result: null,
			loading: false,
			error: null,
		});
	},
}));
