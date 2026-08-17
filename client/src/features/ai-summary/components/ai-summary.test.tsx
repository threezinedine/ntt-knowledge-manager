import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { AiSummary } from "./AiSummary";
import { useAiSummaryStore } from "../store/ai-summary-store";

vi.mock("../apis/ai-summary-api", () => ({
	summarize: vi.fn().mockResolvedValue({
		systemPrompt: "Summarize",
		userInput: "Hello world",
		output: "A greeting.",
	}),
}));

beforeEach(() => {
	vi.useFakeTimers();
	useAiSummaryStore.getState().clear();
});

afterEach(() => {
	vi.useRealTimers();
});

describe("AiSummary", () => {
	it("renders both input fields", () => {
		render(<AiSummary />);

		expect(screen.getByTestId("ai-summary")).toBeVisible();
		expect(screen.getByLabelText("System prompt")).toBeVisible();
		expect(screen.getByLabelText("User input")).toBeVisible();
	});

	it("processes input on Enter and shows result", async () => {
		const { summarize } = await import("../apis/ai-summary-api");
		render(<AiSummary />);

		const systemInput = screen.getByLabelText("System prompt");
		const userInput = screen.getByLabelText("User input");

		fireEvent.change(systemInput, { target: { value: "Summarize" } });
		fireEvent.change(userInput, { target: { value: "Hello world" } });
		fireEvent.keyDown(userInput, { key: "Enter" });

		await act(() => vi.advanceTimersByTimeAsync(0));

		expect(summarize).toHaveBeenCalledWith("Summarize", "Hello world");
		expect(screen.getByText("A greeting.")).toBeVisible();
	});

	it("processes input on submit button click", async () => {
		const { summarize } = await import("../apis/ai-summary-api");
		render(<AiSummary />);

		fireEvent.change(screen.getByLabelText("System prompt"), { target: { value: "Summarize" } });
		fireEvent.change(screen.getByLabelText("User input"), { target: { value: "Hello world" } });
		fireEvent.click(screen.getByText("Submit"));

		await act(() => vi.advanceTimersByTimeAsync(0));

		expect(summarize).toHaveBeenCalledWith("Summarize", "Hello world");
	});
});
