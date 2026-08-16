import { create } from "zustand";
import { lookupWord, type DictionaryResult } from "../apis/vocabulary-api";

type DictionaryState = {
	query: string;
	entry: DictionaryResult | null;
	loading: boolean;
	error: string | null;
	setQuery: (query: string) => void;
	lookup: (word: string) => Promise<void>;
	silentLookup: (word: string) => Promise<void>;
	clear: () => void;
};

export const useDictionaryStore = create<DictionaryState>((set) => ({
	query: "",
	entry: null,
	loading: false,
	error: null,

	setQuery: (query) => set({ query }),

	lookup: async (word) => {
		set({ loading: true, error: null });
		try {
			const entry = await lookupWord(word);
			set({ entry, loading: false, query: entry.word });
		} catch {
			set({ loading: false, error: `Could not find "${word}"`, entry: null });
		}
	},

	silentLookup: async (word) => {
		try {
			const entry = await lookupWord(word);
			set({ entry, query: entry.word, error: null });
		} catch {
			set({ entry: null });
		}
	},

	clear: () =>
		set({
			query: "",
			entry: null,
			loading: false,
			error: null,
		}),
}));
