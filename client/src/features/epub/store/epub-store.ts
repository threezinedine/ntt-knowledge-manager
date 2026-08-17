import { create } from "zustand";

type EpubView = "context-menu" | "dictionary";

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
			selectedText: text.trim().toLowerCase(),
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

	clearSelection: () => {
		set({ selectedText: null, view: null, popupPosition: null });
	},
}));
