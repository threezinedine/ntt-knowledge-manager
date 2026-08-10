import { useShallow } from "zustand/react/shallow";
import { useThemeStore } from "../store";
import type { ThemeName } from "../utils";

export function useTheme(): {
	theme: ThemeName;
	setTheme: (theme: ThemeName) => void;
	toggleTheme: () => void;
} {
	return useThemeStore(
		useShallow((state) => ({
			theme: state.theme,
			setTheme: state.setTheme,
			toggleTheme: state.toggleTheme,
		})),
	);
}
