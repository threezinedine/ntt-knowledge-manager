import { useEffect, type ReactNode } from "react";
import { useThemeStore } from "../store";
import type { ThemeName } from "../utils";

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
