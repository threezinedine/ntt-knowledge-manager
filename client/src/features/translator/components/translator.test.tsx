import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { Translator } from "./Translator";
import { useTranslatorStore } from "../store/translator-store";

vi.mock("../apis/translator-api", () => ({
	translate: vi.fn().mockResolvedValue({
		sourceText: "hello",
		translatedText: "[Vietnamese] hello",
		sourceLang: "English",
		targetLang: "Vietnamese",
	}),
}));

beforeEach(() => {
	vi.useFakeTimers();
	useTranslatorStore.getState().clear();
});

afterEach(() => {
	vi.useRealTimers();
});

describe("Translator", () => {
	it("renders the translator with language labels", () => {
		render(<Translator />);

		expect(screen.getByTestId("translator")).toBeVisible();
		expect(screen.getByLabelText("Translation input")).toBeVisible();
		expect(screen.getByText("English")).toBeVisible();
		expect(screen.getByText("Vietnamese")).toBeVisible();
	});

	it("translates text on Enter and shows result", async () => {
		const { translate } = await import("../apis/translator-api");
		render(<Translator />);

		const input = screen.getByLabelText("Translation input");
		fireEvent.change(input, { target: { value: "hello" } });
		fireEvent.keyDown(input, { key: "Enter" });

		await act(() => vi.advanceTimersByTimeAsync(0));

		expect(translate).toHaveBeenCalledWith("hello", "English", "Vietnamese");
		expect(screen.getByText("[Vietnamese] hello")).toBeVisible();
	});

	it("has a swap languages button", () => {
		render(<Translator />);

		expect(screen.getByLabelText("Swap languages")).toBeVisible();
	});
});
