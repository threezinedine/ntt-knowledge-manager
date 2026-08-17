import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { StatelessTranslator, type TranslationResult } from "./stateless-translator";

const MOCK_RESULT: TranslationResult = {
	sourceText: "hello",
	translatedText: "xin chào",
	sourceLang: "English",
	targetLang: "Vietnamese",
};

const defaultProps = {
	result: null,
	loading: false,
	error: null,
};

describe("StatelessTranslator", () => {
	it("shows empty state when no result", () => {
		render(<StatelessTranslator {...defaultProps} />);

		expect(screen.getByText("Type text to translate.")).toBeVisible();
	});

	it("shows loading state", () => {
		render(<StatelessTranslator {...defaultProps} loading />);

		expect(screen.getByText("Translating...")).toBeVisible();
	});

	it("shows error state", () => {
		render(
			<StatelessTranslator {...defaultProps} error="Translation failed" />,
		);

		expect(screen.getByText("Translation failed")).toBeVisible();
	});

	it("shows translation result with source and translated text", () => {
		render(<StatelessTranslator {...defaultProps} result={MOCK_RESULT} />);

		expect(screen.getByText("English")).toBeVisible();
		expect(screen.getByText("hello")).toBeVisible();
		expect(screen.getByText("Vietnamese")).toBeVisible();
		expect(screen.getByText("xin chào")).toBeVisible();
	});

	it("does not show result while loading", () => {
		render(<StatelessTranslator {...defaultProps} result={MOCK_RESULT} loading />);

		expect(screen.getByText("Translating...")).toBeVisible();
		expect(screen.queryByText("xin chào")).toBeNull();
	});
});
