import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { StatelessDictionarySearch } from "./stateless-dictionary-search";
import type { DictionaryEntry } from "../stateless-dictionary";

const MOCK_ENTRY: DictionaryEntry = {
	word: "test",
	phonetic: "/tɛst/",
	audio_url: "https://example.com/test.mp3",
	meanings: [
		{
			partOfSpeech: "noun",
			definitions: [
				{ definition: "A procedure for assessment", example: "Take a test" },
				{ definition: "A trial", example: "" },
			],
		},
		{
			partOfSpeech: "verb",
			definitions: [
				{ definition: "To put to the proof", example: "Test the theory" },
			],
		},
	],
	vietnamese_meaning: "kiểm tra, thử nghiệm",
};

const defaultProps = {
	query: "",
	suggestions: [],
	entry: null,
	loading: false,
	error: null,
	onQueryChange: vi.fn(),
	onSubmit: vi.fn(),
	onSuggestionClick: vi.fn(),
};

describe("StatelessDictionarySearch", () => {
	it("renders search input", () => {
		render(<StatelessDictionarySearch {...defaultProps} />);

		expect(screen.getByLabelText("Search word")).toBeVisible();
	});

	it("shows empty state when no entry", () => {
		render(<StatelessDictionarySearch {...defaultProps} />);

		expect(screen.getByText("Type a word to look it up.")).toBeVisible();
	});

	it("calls onQueryChange when typing", () => {
		const onQueryChange = vi.fn();
		render(<StatelessDictionarySearch {...defaultProps} onQueryChange={onQueryChange} />);

		fireEvent.change(screen.getByLabelText("Search word"), {
			target: { value: "hello" },
		});

		expect(onQueryChange).toHaveBeenCalledWith("hello");
	});

	it("calls onSubmit on Enter", () => {
		const onSubmit = vi.fn();
		render(<StatelessDictionarySearch {...defaultProps} query="test" onSubmit={onSubmit} />);

		fireEvent.keyDown(screen.getByLabelText("Search word"), { key: "Enter" });

		expect(onSubmit).toHaveBeenCalledWith("test");
	});

	it("shows suggestions dropdown", () => {
		const suggestions = [
			{ id: 1, word: "test", phonetic: "/tɛst/" },
			{ id: 2, word: "testing", phonetic: "" },
		];
		render(
			<StatelessDictionarySearch
				{...defaultProps}
				query="tes"
				suggestions={suggestions}
			/>,
		);

		expect(screen.getByText("test")).toBeVisible();
		expect(screen.getByText("testing")).toBeVisible();
		expect(screen.getByText("/tɛst/")).toBeVisible();
	});

	it("calls onSuggestionClick when clicking a suggestion", () => {
		const onSuggestionClick = vi.fn();
		const suggestions = [{ id: 1, word: "test", phonetic: "/tɛst/" }];
		render(
			<StatelessDictionarySearch
				{...defaultProps}
				query="tes"
				suggestions={suggestions}
				onSuggestionClick={onSuggestionClick}
			/>,
		);

		fireEvent.click(screen.getByText("test"));

		expect(onSuggestionClick).toHaveBeenCalledWith(suggestions[0]);
	});

	it("shows lookup prompt when no suggestions and query is set", () => {
		render(<StatelessDictionarySearch {...defaultProps} query="xyz" />);

		expect(screen.getByText(/Look up/)).toBeVisible();
		expect(screen.getByText("xyz")).toBeVisible();
	});

	it("renders entry content through StatelessDictionary", () => {
		render(<StatelessDictionarySearch {...defaultProps} entry={MOCK_ENTRY} />);

		expect(screen.getByText("test")).toBeVisible();
		expect(screen.getByText("/tɛst/")).toBeVisible();
		expect(screen.getByText("noun")).toBeVisible();
	});

	it("highlights suggestions with arrow keys", () => {
		const suggestions = [
			{ id: 1, word: "test", phonetic: "" },
			{ id: 2, word: "testing", phonetic: "" },
		];
		render(
			<StatelessDictionarySearch
				{...defaultProps}
				query="tes"
				suggestions={suggestions}
			/>,
		);

		const input = screen.getByLabelText("Search word");
		fireEvent.keyDown(input, { key: "ArrowDown" });

		const options = screen.getAllByRole("option");
		expect(options[0]).toHaveAttribute("aria-selected", "true");
		expect(options[1]).toHaveAttribute("aria-selected", "false");

		fireEvent.keyDown(input, { key: "ArrowDown" });
		expect(options[0]).toHaveAttribute("aria-selected", "false");
		expect(options[1]).toHaveAttribute("aria-selected", "true");

		fireEvent.keyDown(input, { key: "ArrowUp" });
		expect(options[0]).toHaveAttribute("aria-selected", "true");
	});

	it("selects highlighted suggestion with Enter", () => {
		const onSuggestionClick = vi.fn();
		const suggestions = [
			{ id: 1, word: "test", phonetic: "" },
			{ id: 2, word: "testing", phonetic: "" },
		];
		render(
			<StatelessDictionarySearch
				{...defaultProps}
				query="tes"
				suggestions={suggestions}
				onSuggestionClick={onSuggestionClick}
			/>,
		);

		const input = screen.getByLabelText("Search word");
		fireEvent.keyDown(input, { key: "ArrowDown" });
		fireEvent.keyDown(input, { key: "ArrowDown" });
		fireEvent.keyDown(input, { key: "Enter" });

		expect(onSuggestionClick).toHaveBeenCalledWith(suggestions[1]);
	});

	it("wraps highlight around when reaching the end", () => {
		const suggestions = [
			{ id: 1, word: "test", phonetic: "" },
			{ id: 2, word: "testing", phonetic: "" },
		];
		render(
			<StatelessDictionarySearch
				{...defaultProps}
				query="tes"
				suggestions={suggestions}
			/>,
		);

		const input = screen.getByLabelText("Search word");
		fireEvent.keyDown(input, { key: "ArrowDown" });
		fireEvent.keyDown(input, { key: "ArrowDown" });
		fireEvent.keyDown(input, { key: "ArrowDown" });

		const options = screen.getAllByRole("option");
		expect(options[0]).toHaveAttribute("aria-selected", "true");
	});

	it("clears highlight on Escape", () => {
		const suggestions = [
			{ id: 1, word: "test", phonetic: "" },
		];
		render(
			<StatelessDictionarySearch
				{...defaultProps}
				query="tes"
				suggestions={suggestions}
			/>,
		);

		const input = screen.getByLabelText("Search word");
		fireEvent.keyDown(input, { key: "ArrowDown" });

		const option = screen.getByRole("option");
		expect(option).toHaveAttribute("aria-selected", "true");

		fireEvent.keyDown(input, { key: "Escape" });
		expect(option).toHaveAttribute("aria-selected", "false");
	});
});
