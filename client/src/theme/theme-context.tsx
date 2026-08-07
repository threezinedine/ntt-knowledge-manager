import {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
	type ReactNode,
} from "react";

export type ThemeName = "light" | "dark";

const STORAGE_KEY = "knowledge-manager-theme";

type ThemeContextValue = {
	theme: ThemeName;
	setTheme: (theme: ThemeName) => void;
	toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getInitialTheme(): ThemeName {
	if (typeof window === "undefined") {
		return "light";
	}

	const stored = window.localStorage.getItem(STORAGE_KEY);
	if (stored === "light" || stored === "dark") {
		return stored;
	}

	return window.matchMedia?.("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}

type ThemeProviderProps = {
	children: ReactNode;
	defaultTheme?: ThemeName;
};

export function ThemeProvider({ children, defaultTheme }: ThemeProviderProps) {
	const [theme, setTheme] = useState<ThemeName>(
		() => defaultTheme ?? getInitialTheme(),
	);

	useEffect(() => {
		document.documentElement.setAttribute("data-theme", theme);
		window.localStorage.setItem(STORAGE_KEY, theme);
	}, [theme]);

	const value = useMemo<ThemeContextValue>(
		() => ({
			theme,
			setTheme,
			toggleTheme: () =>
				setTheme((current) => (current === "light" ? "dark" : "light")),
		}),
		[theme],
	);

	return (
		<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
	);
}

export function useTheme(): ThemeContextValue {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
}
