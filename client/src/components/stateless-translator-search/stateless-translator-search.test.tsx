import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { StatelessTranslatorSearch } from "./stateless-translator-search";

const defaultProps = {
	query: "",
	sourceLang: "English",
	targetLang: "Vietnamese",
	result: null,
	loading: false,
	error: null,
	onQueryChange: vi.fn(),
	onSubmit: vi.fn(),
};

describe("StatelessTranslatorSearch", () => {
	it("renders text input and language labels", () => {
		render(<StatelessTranslatorSearch {...defaultProps} />);

		expect(screen.getByLabelText("Translation input")).toBeVisible();
		expect(screen.getByText("English")).toBeVisible();
		expect(screen.getByText("Vietnamese")).toBeVisible();
	});

	it("shows placeholder in output panel when no result", () => {
		render(<StatelessTranslatorSearch {...defaultProps} />);

		expect(screen.getByText("Translation")).toBeVisible();
	});

	it("calls onQueryChange when typing", () => {
		const onQueryChange = vi.fn();
		render(<StatelessTranslatorSearch {...defaultProps} onQueryChange={onQueryChange} />);

		fireEvent.change(screen.getByLabelText("Translation input"), {
			target: { value: "hello" },
		});

		expect(onQueryChange).toHaveBeenCalledWith("hello");
	});

	it("calls onSubmit on Enter", () => {
		const onSubmit = vi.fn();
		render(<StatelessTranslatorSearch {...defaultProps} query="hello" onSubmit={onSubmit} />);

		fireEvent.keyDown(screen.getByLabelText("Translation input"), { key: "Enter" });

		expect(onSubmit).toHaveBeenCalledWith("hello");
	});

	it("does not submit on Shift+Enter", () => {
		const onSubmit = vi.fn();
		render(<StatelessTranslatorSearch {...defaultProps} query="hello" onSubmit={onSubmit} />);

		fireEvent.keyDown(screen.getByLabelText("Translation input"), { key: "Enter", shiftKey: true });

		expect(onSubmit).not.toHaveBeenCalled();
	});

	it("does not submit when query is empty", () => {
		const onSubmit = vi.fn();
		render(<StatelessTranslatorSearch {...defaultProps} query="  " onSubmit={onSubmit} />);

		fireEvent.keyDown(screen.getByLabelText("Translation input"), { key: "Enter" });

		expect(onSubmit).not.toHaveBeenCalled();
	});

	it("shows translation result in output panel", () => {
		render(
			<StatelessTranslatorSearch
				{...defaultProps}
				result={{
					sourceText: "hello",
					translatedText: "xin chào",
					sourceLang: "English",
					targetLang: "Vietnamese",
				}}
			/>,
		);

		expect(screen.getByText("xin chào")).toBeVisible();
	});

	it("shows loading state", () => {
		render(<StatelessTranslatorSearch {...defaultProps} loading />);

		expect(screen.getByText("Translating...")).toBeVisible();
	});

	it("shows error state", () => {
		render(<StatelessTranslatorSearch {...defaultProps} error="Translation failed" />);

		expect(screen.getByText("Translation failed")).toBeVisible();
	});

	it("shows clear button when query is not empty", () => {
		render(<StatelessTranslatorSearch {...defaultProps} query="hello" />);

		expect(screen.getByLabelText("Clear input")).toBeVisible();
	});

	it("clears input when clear button is clicked", () => {
		const onQueryChange = vi.fn();
		render(<StatelessTranslatorSearch {...defaultProps} query="hello" onQueryChange={onQueryChange} />);

		fireEvent.click(screen.getByLabelText("Clear input"));

		expect(onQueryChange).toHaveBeenCalledWith("");
	});

	it("calls onSwapLanguages when swap button is clicked", () => {
		const onSwapLanguages = vi.fn();
		render(<StatelessTranslatorSearch {...defaultProps} onSwapLanguages={onSwapLanguages} />);

		fireEvent.click(screen.getByLabelText("Swap languages"));

		expect(onSwapLanguages).toHaveBeenCalled();
	});
});
