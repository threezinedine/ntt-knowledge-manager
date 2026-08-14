import { create } from "zustand";
import {
	fetchSettings,
	updateSettings,
	type SettingsData,
	type SettingsUpdate,
} from "../apis";

type SettingsState = {
	settings: SettingsData | null;
	loading: boolean;
	load: () => Promise<void>;
	update: (data: SettingsUpdate) => Promise<void>;
};

export const useSettingsStore = create<SettingsState>((set) => ({
	settings: null,
	loading: false,
	load: async () => {
		set({ loading: true });
		const settings = await fetchSettings();
		set({ settings, loading: false });
	},
	update: async (data) => {
		const settings = await updateSettings(data);
		set({ settings });
	},
}));
