import { create } from "zustand";
import { useThemeStore } from "../../theme";
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
		try {
			const settings = await fetchSettings();
			set({ settings, loading: false });
			useThemeStore.getState().setTheme(settings.theme);
		} catch {
			set({ loading: false });
			throw new Error("Failed to load settings");
		}
	},
	update: async (data) => {
		try {
			const settings = await updateSettings(data);
			set({ settings });
			if (data.theme) {
				useThemeStore.getState().setTheme(data.theme);
			}
		} catch {
			throw new Error("Failed to update settings");
		}
	},
}));
