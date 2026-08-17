import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatelessAiSummary } from "./stateless-ai-summary";

const meta = {
	title: "Components/StatelessAiSummary",
	component: StatelessAiSummary,
	args: {
		result: null,
		loading: false,
		error: null,
	},
	decorators: [
		(Story) => (
			<div style={{ width: 600, height: 400, border: "1px solid var(--color-border)", borderRadius: 8, overflow: "hidden" }}>
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof StatelessAiSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const Loading: Story = {
	args: { loading: true },
};

export const Error: Story = {
	args: { error: "Failed to process request" },
};

export const WithResult: Story = {
	args: {
		result: {
			systemPrompt: "Summarize the following text concisely",
			userInput: "Alice was beginning to get very tired of sitting by her sister on the bank...",
			output: "Alice, bored while sitting with her sister, notices a White Rabbit with a pocket watch rushing past, which piques her curiosity and sets her adventure in motion.",
		},
	},
};
