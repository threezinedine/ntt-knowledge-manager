import { create } from "zustand";
import {
	uploadAvatar,
	deleteAvatar,
	fetchAvatar,
} from "../apis/avatar-api";

type AvatarState = {
	avatarUrl: string;
	loading: boolean;
	load: () => Promise<void>;
	upload: (file: File) => Promise<void>;
	remove: () => Promise<void>;
};

export const useAvatarStore = create<AvatarState>((set) => ({
	avatarUrl: "",
	loading: false,

	load: async () => {
		set({ loading: true });
		try {
			const url = await fetchAvatar();
			set({ avatarUrl: url, loading: false });
		} catch {
			set({ loading: false });
			throw new Error("Failed to load avatar");
		}
	},

	upload: async (file: File) => {
		set({ loading: true });
		try {
			const url = await uploadAvatar(file);
			set({ avatarUrl: url, loading: false });
		} catch {
			set({ loading: false });
			throw new Error("Failed to upload avatar");
		}
	},

	remove: async () => {
		set({ loading: true });
		try {
			await deleteAvatar();
			set({ avatarUrl: "", loading: false });
		} catch {
			set({ loading: false });
			throw new Error("Failed to remove avatar");
		}
	},
}));
