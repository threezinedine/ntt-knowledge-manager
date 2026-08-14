import { create } from "zustand";
import { useThemeStore } from "../../theme";
import {
	fetchSettings,
	updateSettings,
	type SettingsData,
	type SettingsUpdate,
} from "../apis";
import { uploadAvatar, deleteAvatar } from "../../avatar-upload/apis/avatar-api";

type SettingsState = {
	settings: SettingsData | null;
	loading: boolean;
	pendingAvatarFile: File | null;
	pendingAvatarPreview: string;
	avatarRemoved: boolean;
	load: () => Promise<void>;
	update: (data: SettingsUpdate) => Promise<void>;
	stageAvatar: (file: File) => void;
	unstageAvatar: () => void;
	save: (data: SettingsUpdate) => Promise<void>;
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
	settings: null,
	loading: false,
	pendingAvatarFile: null,
	pendingAvatarPreview: "",
	avatarRemoved: false,

	load: async () => {
		set({ loading: true });
		try {
			const settings = await fetchSettings();
			set({
				settings,
				loading: false,
				pendingAvatarFile: null,
				pendingAvatarPreview: "",
				avatarRemoved: false,
			});
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

	stageAvatar: (file: File) => {
		const preview = URL.createObjectURL(file);
		const prev = get().pendingAvatarPreview;
		if (prev) URL.revokeObjectURL(prev);
		set({ pendingAvatarFile: file, pendingAvatarPreview: preview, avatarRemoved: false });
	},

	unstageAvatar: () => {
		const prev = get().pendingAvatarPreview;
		if (prev) URL.revokeObjectURL(prev);
		set({ pendingAvatarFile: null, pendingAvatarPreview: "", avatarRemoved: true });
	},

	save: async (data: SettingsUpdate) => {
		const { pendingAvatarFile, avatarRemoved } = get();

		const settings = await updateSettings(data);
		if (data.theme) {
			useThemeStore.getState().setTheme(data.theme);
		}

		let avatar = settings.avatar;
		if (pendingAvatarFile) {
			avatar = await uploadAvatar(pendingAvatarFile);
		} else if (avatarRemoved) {
			await deleteAvatar();
			avatar = "";
		}

		const prev = get().pendingAvatarPreview;
		if (prev) URL.revokeObjectURL(prev);
		set({
			settings: { ...settings, avatar },
			pendingAvatarFile: null,
			pendingAvatarPreview: "",
			avatarRemoved: false,
		});
	},
}));
