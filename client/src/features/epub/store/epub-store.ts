import { create } from "zustand";

type EpubState = {
	selectedWord: string | null;
	popupPosition: { x: number; y: number } | null;
	selectWord: (word: string, position: { x: number; y: number }) => void;
	clearSelection: () => void;
};

export const useEpubStore = create<EpubState>((set) => ({
	selectedWord: null,
	popupPosition: null,

	selectWord: (word, position) => {
		set({ selectedWord: word.trim().toLowerCase(), popupPosition: position });
	},

	clearSelection: () => {
		set({ selectedWord: null, popupPosition: null });
	},
}));
