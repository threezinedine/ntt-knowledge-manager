import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
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
}));

beforeEach(() => {
	useDictionaryStore.getState().clear();
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

		await waitFor(() => {
			expect(lookupWord).toHaveBeenCalledWith("test");
		});

		await waitFor(() => {
			expect(screen.getByText("English")).toBeVisible();
			expect(screen.getByText("Vietnamese")).toBeVisible();
			expect(screen.getByText("Examples")).toBeVisible();
		});
	});
});
