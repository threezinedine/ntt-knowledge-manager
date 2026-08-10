import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getInitialTheme, THEME_STORAGE_KEY, type ThemeName } from "../utils";

type ThemeState = {
	theme: ThemeName;
	setTheme: (theme: ThemeName) => void;
	toggleTheme: () => void;
};

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
			name: THEME_STORAGE_KEY,
			storage: createJSONStorage(() => window.localStorage),
		},
	),
);
