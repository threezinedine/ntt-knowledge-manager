import { beforeEach, describe, expect, it } from "vitest";
import { useThemeStore } from "./theme-store";

describe("theme store", () => {
	beforeEach(() => {
		window.localStorage.clear();
		useThemeStore.setState({ theme: "light" });
	});

	it("toggles between light and dark", () => {
		useThemeStore.getState().toggleTheme();
		expect(useThemeStore.getState().theme).toBe("dark");

		useThemeStore.getState().toggleTheme();
		expect(useThemeStore.getState().theme).toBe("light");
	});

	it("sets the theme", () => {
		useThemeStore.getState().setTheme("dark");
		expect(useThemeStore.getState().theme).toBe("dark");
	});

	it("persists the selected theme to localStorage", () => {
		useThemeStore.getState().setTheme("dark");

		const stored = JSON.parse(
			window.localStorage.getItem("knowledge-manager-theme") ?? "{}",
		) as { state?: { theme?: string } };
		expect(stored.state?.theme).toBe("dark");
	});
});
