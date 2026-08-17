import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { StatelessAiSummarySearch } from "./stateless-ai-summary-search";

const defaultProps = {
	systemPrompt: "",
	userInput: "",
	result: null,
	loading: false,
	error: null,
	onSystemPromptChange: vi.fn(),
	onUserInputChange: vi.fn(),
	onSubmit: vi.fn(),
};

describe("StatelessAiSummarySearch", () => {
	it("renders both input fields", () => {
		render(<StatelessAiSummarySearch {...defaultProps} />);

		expect(screen.getByLabelText("System prompt")).toBeVisible();
		expect(screen.getByLabelText("User input")).toBeVisible();
	});

	it("shows empty state when no result", () => {
		render(<StatelessAiSummarySearch {...defaultProps} />);

		expect(screen.getByText("Enter a prompt and input to get a response.")).toBeVisible();
	});

	it("calls onSystemPromptChange when typing in system prompt", () => {
		const onSystemPromptChange = vi.fn();
		render(<StatelessAiSummarySearch {...defaultProps} onSystemPromptChange={onSystemPromptChange} />);

		fireEvent.change(screen.getByLabelText("System prompt"), {
			target: { value: "Summarize" },
		});

		expect(onSystemPromptChange).toHaveBeenCalledWith("Summarize");
	});

	it("calls onUserInputChange when typing in user input", () => {
		const onUserInputChange = vi.fn();
		render(<StatelessAiSummarySearch {...defaultProps} onUserInputChange={onUserInputChange} />);

		fireEvent.change(screen.getByLabelText("User input"), {
			target: { value: "Some text" },
		});

		expect(onUserInputChange).toHaveBeenCalledWith("Some text");
	});

	it("calls onSubmit on Enter in user input", () => {
		const onSubmit = vi.fn();
		render(
			<StatelessAiSummarySearch
				{...defaultProps}
				systemPrompt="Summarize"
				userInput="Hello world"
				onSubmit={onSubmit}
			/>,
		);

		fireEvent.keyDown(screen.getByLabelText("User input"), { key: "Enter" });

		expect(onSubmit).toHaveBeenCalledWith("Summarize", "Hello world");
	});

	it("does not submit on Shift+Enter", () => {
		const onSubmit = vi.fn();
		render(
			<StatelessAiSummarySearch
				{...defaultProps}
				userInput="Hello"
				onSubmit={onSubmit}
			/>,
		);

		fireEvent.keyDown(screen.getByLabelText("User input"), { key: "Enter", shiftKey: true });

		expect(onSubmit).not.toHaveBeenCalled();
	});

	it("does not submit when user input is empty", () => {
		const onSubmit = vi.fn();
		render(<StatelessAiSummarySearch {...defaultProps} userInput="  " onSubmit={onSubmit} />);

		fireEvent.keyDown(screen.getByLabelText("User input"), { key: "Enter" });

		expect(onSubmit).not.toHaveBeenCalled();
	});

	it("calls onSubmit when submit button is clicked", () => {
		const onSubmit = vi.fn();
		render(
			<StatelessAiSummarySearch
				{...defaultProps}
				systemPrompt="Summarize"
				userInput="Some text"
				onSubmit={onSubmit}
			/>,
		);

		fireEvent.click(screen.getByText("Submit"));

		expect(onSubmit).toHaveBeenCalledWith("Summarize", "Some text");
	});

	it("disables submit button when loading", () => {
		render(
			<StatelessAiSummarySearch
				{...defaultProps}
				userInput="text"
				loading
			/>,
		);

		expect(screen.getByRole("button", { name: "Processing..." })).toBeDisabled();
	});

	it("shows result output", () => {
		render(
			<StatelessAiSummarySearch
				{...defaultProps}
				result={{
					systemPrompt: "Summarize",
					userInput: "Hello",
					output: "A greeting.",
				}}
			/>,
		);

		expect(screen.getByText("A greeting.")).toBeVisible();
	});
});
