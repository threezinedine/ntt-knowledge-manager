import { create } from "zustand";
import {
	fetchEpubs,
	uploadEpub,
	deleteEpub,
	getDownloadUrl,
	type EpubData,
} from "../apis/epub-api";

type EpubLibraryState = {
	items: EpubData[];
	downloadedIds: Set<number>;
	total: number;
	loading: boolean;
	error: string | null;
	load: () => Promise<void>;
	upload: (file: File) => Promise<void>;
	remove: (id: number) => Promise<void>;
	download: (epub: EpubData) => void;
};

export const useEpubLibraryStore = create<EpubLibraryState>((set, get) => ({
	items: [],
	downloadedIds: new Set(),
	total: 0,
	loading: false,
	error: null,

	load: async () => {
		set({ loading: true, error: null });
		try {
			const page = await fetchEpubs({ limit: 100 });
			set({ items: page.items, total: page.total, loading: false });
		} catch {
			set({ loading: false, error: "Failed to load epub library" });
		}
	},

	upload: async (file: File) => {
		set({ error: null });
		try {
			await uploadEpub(file);
			await get().load();
		} catch {
			set({ error: "Failed to upload epub" });
		}
	},

	remove: async (id: number) => {
		set({ error: null });
		try {
			await deleteEpub(id);
			set((state) => ({
				items: state.items.filter((e) => e.id !== id),
				total: state.total - 1,
			}));
		} catch {
			set({ error: "Failed to delete epub" });
		}
	},

	download: (epub: EpubData) => {
		const url = getDownloadUrl(epub);
		const a = document.createElement("a");
		a.href = url;
		a.download = epub.original_filename;
		a.click();
		set((state) => {
			const next = new Set(state.downloadedIds);
			next.add(epub.id);
			return { downloadedIds: next };
		});
	},
}));
