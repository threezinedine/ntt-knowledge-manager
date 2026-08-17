import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { StatelessDictionary, type DictionaryEntry } from "./stateless-dictionary";

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
	entry: null,
	loading: false,
	error: null,
	onSubmit: vi.fn(),
};

describe("StatelessDictionary", () => {
	it("shows empty state when no entry", () => {
		render(<StatelessDictionary {...defaultProps} />);

		expect(screen.getByText("Type a word to look it up.")).toBeVisible();
	});

	it("shows loading state", () => {
		render(<StatelessDictionary {...defaultProps} loading />);

		expect(screen.getByText("Looking up...")).toBeVisible();
	});

	it("shows error state", () => {
		render(
			<StatelessDictionary {...defaultProps} error='Could not find "xyz"' />,
		);

		expect(screen.getByText('Could not find "xyz"')).toBeVisible();
	});

	it("shows English tab with word, phonetic, and meanings", () => {
		render(<StatelessDictionary {...defaultProps} entry={MOCK_ENTRY} />);

		expect(screen.getByText("test")).toBeVisible();
		expect(screen.getByText("/tɛst/")).toBeVisible();
		expect(screen.getByText("noun")).toBeVisible();
		expect(screen.getByText("verb")).toBeVisible();
		expect(screen.getByText("A procedure for assessment")).toBeVisible();
		expect(screen.getByLabelText("Play pronunciation")).toBeVisible();
	});

	it("switches to Vietnamese tab", () => {
		render(<StatelessDictionary {...defaultProps} entry={MOCK_ENTRY} />);

		fireEvent.click(screen.getByText("Vietnamese"));

		expect(screen.getByText("kiểm tra, thử nghiệm")).toBeVisible();
	});

	it("shows placeholder when no Vietnamese meaning", () => {
		const entry = { ...MOCK_ENTRY, vietnamese_meaning: "" };
		render(<StatelessDictionary {...defaultProps} entry={entry} />);

		fireEvent.click(screen.getByText("Vietnamese"));

		expect(screen.getByText("No Vietnamese meaning added yet.")).toBeVisible();
	});

	it("switches to Examples tab", () => {
		render(<StatelessDictionary {...defaultProps} entry={MOCK_ENTRY} />);

		fireEvent.click(screen.getByText("Examples"));

		expect(screen.getByText(/"Take a test"/)).toBeVisible();
		expect(screen.getByText(/"Test the theory"/)).toBeVisible();
	});

	it("shows no examples message when none available", () => {
		const entry: DictionaryEntry = {
			...MOCK_ENTRY,
			meanings: [
				{
					partOfSpeech: "noun",
					definitions: [{ definition: "Something", example: "" }],
				},
			],
		};
		render(<StatelessDictionary {...defaultProps} entry={entry} />);

		fireEvent.click(screen.getByText("Examples"));

		expect(screen.getByText("No examples available.")).toBeVisible();
	});

	it("shows similar words when provided with entry", () => {
		render(
			<StatelessDictionary
				{...defaultProps}
				entry={MOCK_ENTRY}
				similarWords={["testing", "taste", "text"]}
			/>,
		);

		expect(screen.getByText("Similar words:")).toBeVisible();
		expect(screen.getByText("testing")).toBeVisible();
		expect(screen.getByText("taste")).toBeVisible();
		expect(screen.getByText("text")).toBeVisible();
	});

	it("calls onSubmit when clicking a similar word", () => {
		const onSubmit = vi.fn();
		render(
			<StatelessDictionary
				{...defaultProps}
				entry={MOCK_ENTRY}
				similarWords={["testing"]}
				onSubmit={onSubmit}
			/>,
		);

		fireEvent.click(screen.getByText("testing"));

		expect(onSubmit).toHaveBeenCalledWith("testing");
	});

	it("shows similar words on error state", () => {
		render(
			<StatelessDictionary
				{...defaultProps}
				error='Could not find "xyz"'
				similarWords={["xylophone", "xyz"]}
			/>,
		);

		expect(screen.getByText('Could not find "xyz"')).toBeVisible();
		expect(screen.getByText("Similar words:")).toBeVisible();
		expect(screen.getByText("xylophone")).toBeVisible();
	});

	it("does not show similar words section when list is empty", () => {
		render(
			<StatelessDictionary
				{...defaultProps}
				entry={MOCK_ENTRY}
				similarWords={[]}
			/>,
		);

		expect(screen.queryByText("Similar words:")).toBeNull();
	});
});
