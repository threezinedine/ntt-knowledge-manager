import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatelessTranslatorSearch } from "./stateless-translator-search";
import type { TranslationResult } from "../stateless-translator";

const meta = {
	title: "Components/StatelessTranslatorSearch",
	component: StatelessTranslatorSearch,
	args: {
		query: "",
		sourceLang: "English",
		targetLang: "Vietnamese",
		result: null,
		loading: false,
		error: null,
		onQueryChange: () => {},
		onSubmit: () => {},
		onSwapLanguages: () => {},
	},
	decorators: [
		(Story) => (
			<div style={{ width: 800, height: 400, border: "1px solid var(--color-border)", borderRadius: 8, overflow: "hidden" }}>
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof StatelessTranslatorSearch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const Loading: Story = {
	args: {
		query: "hello",
		loading: true,
	},
};

export const WithResult: Story = {
	args: {
		query: "The quick brown fox jumps over the lazy dog",
		result: {
			sourceText: "The quick brown fox jumps over the lazy dog",
			translatedText: "Con cáo nâu nhanh nhẹn nhảy qua con chó lười",
			sourceLang: "English",
			targetLang: "Vietnamese",
		},
	},
};

export const Error: Story = {
	args: {
		query: "hello",
		error: "Translation service unavailable",
	},
};

export const Interactive: Story = {
	render: () => {
		const [query, setQuery] = useState("");
		const [result, setResult] = useState<TranslationResult | null>(null);
		const [sourceLang, setSourceLang] = useState("English");
		const [targetLang, setTargetLang] = useState("Vietnamese");

		const handleSubmit = (text: string) => {
			setResult({
				sourceText: text,
				translatedText: `[${targetLang}] ${text}`,
				sourceLang,
				targetLang,
			});
		};

		const handleSwap = () => {
			setSourceLang(targetLang);
			setTargetLang(sourceLang);
			if (result) {
				setQuery(result.translatedText);
				setResult(null);
			}
		};

		return (
			<StatelessTranslatorSearch
				query={query}
				sourceLang={sourceLang}
				targetLang={targetLang}
				result={result}
				loading={false}
				error={null}
				onQueryChange={(q) => { setQuery(q); setResult(null); }}
				onSubmit={handleSubmit}
				onSwapLanguages={handleSwap}
			/>
		);
	},
};
