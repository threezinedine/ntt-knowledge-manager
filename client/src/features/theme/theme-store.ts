import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type ThemeName = "light" | "dark";

const STORAGE_KEY = "knowledge-manager-theme";

type ThemeState = {
	theme: ThemeName;
	setTheme: (theme: ThemeName) => void;
	toggleTheme: () => void;
};

function getInitialTheme(): ThemeName {
	if (typeof window === "undefined") {
		return "light";
	}
	return window.matchMedia?.("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}

export const useThemeStore = create<ThemeState>()(
	persist(
		(set) => ({
			theme: getInitialTheme(),
			setTheme: (theme) => set({ theme }),
			toggleTheme: () =>
				set((state) => ({
					theme: state.theme === "light" ? "dark" : "light",
				})),
		}),
		{
			name: STORAGE_KEY,
			storage: createJSONStorage(() => window.localStorage),
		},
	),
);
