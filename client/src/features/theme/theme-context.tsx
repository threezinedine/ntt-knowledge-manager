import { useEffect, type ReactNode } from "react";
import { useShallow } from "zustand/react/shallow";
import { useThemeStore, type ThemeName } from "./theme-store";

export type { ThemeName } from "./theme-store";

type ThemeProviderProps = {
	children: ReactNode;
	defaultTheme?: ThemeName;
};

export function ThemeProvider({ children, defaultTheme }: ThemeProviderProps) {
	const theme = useThemeStore((state) => state.theme);

	useEffect(() => {
		document.documentElement.setAttribute("data-theme", theme);
	}, [theme]);

	useEffect(() => {
		if (defaultTheme) {
			useThemeStore.getState().setTheme(defaultTheme);
		}
	}, [defaultTheme]);

	return children;
}

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
