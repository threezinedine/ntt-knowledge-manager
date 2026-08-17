import { create } from "zustand";

type EpubView = "context-menu" | "dictionary" | "translator" | "ai-summary" | "ai-explain";

type EpubState = {
	selectedText: string | null;
	view: EpubView | null;
	popupPosition: { x: number; y: number } | null;
	wordTop: number;
	containerWidth: number;
	containerHeight: number;
	showContextMenu: (
		text: string,
		position: { x: number; y: number },
		wordTop: number,
		containerWidth: number,
		containerHeight: number,
	) => void;
	showDictionary: () => void;
	showTranslator: () => void;
	showAiSummary: () => void;
	showAiExplain: () => void;
	clearSelection: () => void;
};

export const useEpubStore = create<EpubState>((set) => ({
	selectedText: null,
	view: null,
	popupPosition: null,
	wordTop: 0,
	containerWidth: 0,
	containerHeight: 0,

	showContextMenu: (text, position, wordTop, containerWidth, containerHeight) => {
		set({
			selectedText: text.trim(),
			view: "context-menu",
			popupPosition: position,
			wordTop,
			containerWidth,
			containerHeight,
		});
	},

	showDictionary: () => {
		set({ view: "dictionary" });
	},

	showTranslator: () => {
		set({ view: "translator" });
	},

	showAiSummary: () => {
		set({ view: "ai-summary" });
	},

	showAiExplain: () => {
		set({ view: "ai-explain" });
	},

	clearSelection: () => {
		set({ selectedText: null, view: null, popupPosition: null });
	},
}));
