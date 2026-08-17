import type { Meta, StoryObj } from "@storybook/react-vite";
import { FreeAiSummary } from "./FreeAiSummary";

const meta = {
	title: "Features/FreeAiSummary",
	component: FreeAiSummary,
	args: {
		systemPrompt: "Summarize the following text",
		userInput: "Alice was beginning to get very tired of sitting by her sister on the bank.",
	},
	decorators: [
		(Story) => (
			<div style={{ width: 600, height: 400, border: "1px solid var(--color-border)", borderRadius: 8, overflow: "hidden" }}>
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof FreeAiSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomPrompt: Story = {
	args: {
		systemPrompt: "Explain this to a 5 year old",
		userInput: "Quantum mechanics is a fundamental theory in physics.",
	},
};
