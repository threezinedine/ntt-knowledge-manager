import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatelessAiSummarySearch } from "./stateless-ai-summary-search";
import type { AiSummaryOutput } from "../stateless-ai-summary";

const meta = {
	title: "Components/StatelessAiSummarySearch",
	component: StatelessAiSummarySearch,
	args: {
		systemPrompt: "",
		userInput: "",
		result: null,
		loading: false,
		error: null,
		onSystemPromptChange: () => {},
		onUserInputChange: () => {},
		onSubmit: () => {},
	},
	decorators: [
		(Story) => (
			<div style={{ width: 700, height: 600, border: "1px solid var(--color-border)", borderRadius: 8, overflow: "hidden" }}>
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof StatelessAiSummarySearch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const Loading: Story = {
	args: {
		systemPrompt: "Summarize the following text",
		userInput: "Alice was beginning to get very tired...",
		loading: true,
	},
};

export const WithResult: Story = {
	args: {
		systemPrompt: "Summarize the following text",
		userInput: "Alice was beginning to get very tired of sitting by her sister on the bank...",
		result: {
			systemPrompt: "Summarize the following text",
			userInput: "Alice was beginning to get very tired...",
			output: "Alice, bored while sitting with her sister, notices a White Rabbit with a pocket watch rushing past, which piques her curiosity.",
		},
	},
};

export const Interactive: Story = {
	render: () => {
		const [systemPrompt, setSystemPrompt] = useState("Summarize the following text concisely");
		const [userInput, setUserInput] = useState("");
		const [result, setResult] = useState<AiSummaryOutput | null>(null);

		const handleSubmit = (sp: string, ui: string) => {
			setResult({
				systemPrompt: sp,
				userInput: ui,
				output: `[Mock Response]\n\nBased on the instruction "${sp}":\n\n${ui.slice(0, 100)}...`,
			});
		};

		return (
			<StatelessAiSummarySearch
				systemPrompt={systemPrompt}
				userInput={userInput}
				result={result}
				loading={false}
				error={null}
				onSystemPromptChange={setSystemPrompt}
				onUserInputChange={(v) => { setUserInput(v); setResult(null); }}
				onSubmit={handleSubmit}
			/>
		);
	},
};
