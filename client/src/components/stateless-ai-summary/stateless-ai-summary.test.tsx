import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatelessAiSummary, type AiSummaryOutput } from "./stateless-ai-summary";

const MOCK_RESULT: AiSummaryOutput = {
	systemPrompt: "Summarize the text",
	userInput: "Hello world",
	output: "This is a greeting.",
};

const defaultProps = {
	result: null,
	loading: false,
	error: null,
};

describe("StatelessAiSummary", () => {
	it("shows empty state when no result", () => {
		render(<StatelessAiSummary {...defaultProps} />);

		expect(screen.getByText("Enter a prompt and input to get a response.")).toBeVisible();
	});

	it("shows loading state", () => {
		render(<StatelessAiSummary {...defaultProps} loading />);

		expect(screen.getByText("Processing...")).toBeVisible();
	});

	it("shows error state", () => {
		render(<StatelessAiSummary {...defaultProps} error="Something went wrong" />);

		expect(screen.getByText("Something went wrong")).toBeVisible();
	});

	it("shows output when result is provided", () => {
		render(<StatelessAiSummary {...defaultProps} result={MOCK_RESULT} />);

		expect(screen.getByText("This is a greeting.")).toBeVisible();
	});

	it("does not show result while loading", () => {
		render(<StatelessAiSummary {...defaultProps} result={MOCK_RESULT} loading />);

		expect(screen.getByText("Processing...")).toBeVisible();
		expect(screen.queryByText("This is a greeting.")).toBeNull();
	});
});
