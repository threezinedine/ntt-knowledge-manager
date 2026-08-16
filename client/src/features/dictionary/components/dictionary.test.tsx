import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { Dictionary } from "./Dictionary";
import { useDictionaryStore } from "../store/dictionary-store";

vi.mock("../apis/vocabulary-api", () => ({
	lookupWord: vi.fn().mockResolvedValue({
		word: "test",
		phonetic: "/tɛst/",
		audio_url: "",
		meanings: [
			{
				partOfSpeech: "noun",
				definitions: [
					{ definition: "A procedure for assessment", example: "Take a test" },
				],
			},
		],
		source_url: "https://en.wiktionary.org/wiki/test",
	}),
	getSimilarWords: vi.fn().mockResolvedValue(["testing", "taste", "text"]),
	getSuggestions: vi.fn().mockResolvedValue([
		{ word: "test", score: 1000 },
		{ word: "testing", score: 900 },
		{ word: "teaspoon", score: 800 },
	]),
}));

beforeEach(() => {
	vi.useFakeTimers();
	useDictionaryStore.getState().clear();
});

afterEach(() => {
	vi.useRealTimers();
});

describe("Dictionary", () => {
	it("renders the stateless dictionary", () => {
		render(<Dictionary />);

		expect(screen.getByTestId("dictionary")).toBeVisible();
		expect(screen.getByLabelText("Search word")).toBeVisible();
	});

	it("looks up a word on Enter and shows results", async () => {
		const { lookupWord } = await import("../apis/vocabulary-api");
		render(<Dictionary />);

		const input = screen.getByLabelText("Search word");
		fireEvent.change(input, { target: { value: "test" } });
		fireEvent.keyDown(input, { key: "Enter" });

		await act(() => vi.advanceTimersByTimeAsync(0));

		expect(lookupWord).toHaveBeenCalledWith("test");
		expect(screen.getByText("English")).toBeVisible();
		expect(screen.getByText("Vietnamese")).toBeVisible();
		expect(screen.getByText("Examples")).toBeVisible();
	});

	it("shows suggestions after typing with debounce", async () => {
		const { getSuggestions } = await import("../apis/vocabulary-api");
		render(<Dictionary />);

		const input = screen.getByLabelText("Search word");
		fireEvent.change(input, { target: { value: "te" } });

		expect(getSuggestions).not.toHaveBeenCalled();

		await act(() => vi.advanceTimersByTimeAsync(300));

		expect(getSuggestions).toHaveBeenCalledWith("te");
		expect(screen.getByText("test")).toBeVisible();
		expect(screen.getByText("testing")).toBeVisible();
		expect(screen.getByText("teaspoon")).toBeVisible();
	});

	it("clears suggestions on lookup", async () => {
		render(<Dictionary />);

		const input = screen.getByLabelText("Search word");
		fireEvent.change(input, { target: { value: "test" } });
		await act(() => vi.advanceTimersByTimeAsync(300));

		expect(screen.getByText("testing")).toBeVisible();

		fireEvent.keyDown(input, { key: "Enter" });
		await act(() => vi.advanceTimersByTimeAsync(0));

		expect(screen.getByText("English")).toBeVisible();
		expect(screen.queryByRole("listbox")).toBeNull();
	});

	it("shows similar words after lookup", async () => {
		render(<Dictionary />);

		const input = screen.getByLabelText("Search word");
		fireEvent.change(input, { target: { value: "test" } });
		fireEvent.keyDown(input, { key: "Enter" });

		await act(() => vi.advanceTimersByTimeAsync(0));

		expect(screen.getByText("Similar words:")).toBeVisible();
		expect(screen.getByText("taste")).toBeVisible();
		expect(screen.getByText("text")).toBeVisible();
	});
});
