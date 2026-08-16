import { create } from "zustand";
import {
	lookupWord,
	getSimilarWords,
	getSuggestions,
	type DictionaryResult,
	type SuggestionItem,
} from "../apis/vocabulary-api";

type DictionaryState = {
	query: string;
	entry: DictionaryResult | null;
	similarWords: string[];
	suggestions: SuggestionItem[];
	loading: boolean;
	error: string | null;
	setQuery: (query: string) => void;
	fetchSuggestions: (prefix: string) => void;
	lookup: (word: string) => Promise<void>;
	clear: () => void;
};

let suggestTimer: ReturnType<typeof setTimeout> | null = null;

export const useDictionaryStore = create<DictionaryState>((set, get) => ({
	query: "",
	entry: null,
	similarWords: [],
	suggestions: [],
	loading: false,
	error: null,

	setQuery: (query) => {
		set({ query });
		get().fetchSuggestions(query);
	},

	fetchSuggestions: (prefix) => {
		if (suggestTimer) clearTimeout(suggestTimer);
		const trimmed = prefix.trim();
		if (trimmed.length < 2) {
			set({ suggestions: [] });
			return;
		}
		suggestTimer = setTimeout(() => {
			getSuggestions(trimmed)
				.then((suggestions) => {
					if (get().query.trim() === trimmed) {
						set({ suggestions });
					}
				})
				.catch(() => {});
		}, 300);
	},

	lookup: async (word) => {
		if (suggestTimer) clearTimeout(suggestTimer);
		set({ loading: true, error: null, similarWords: [], suggestions: [] });
		getSimilarWords(word)
			.then((similar) => set({ similarWords: similar }))
			.catch(() => {});
		try {
			const entry = await lookupWord(word);
			set({ entry, loading: false, query: entry.word });
		} catch {
			set({ loading: false, error: `Could not find "${word}"`, entry: null });
		}
	},

	clear: () => {
		if (suggestTimer) clearTimeout(suggestTimer);
		set({
			query: "",
			entry: null,
			similarWords: [],
			suggestions: [],
			loading: false,
			error: null,
		});
	},
}));
