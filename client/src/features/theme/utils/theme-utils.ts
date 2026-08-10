export type ThemeName = "light" | "dark";

export const THEME_STORAGE_KEY = "knowledge-manager-theme";

export function getInitialTheme(): ThemeName {
	if (typeof window === "undefined") {
		return "light";
	}
	return window.matchMedia?.("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}
