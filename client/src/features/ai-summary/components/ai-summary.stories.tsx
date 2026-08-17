import type { Meta, StoryObj } from "@storybook/react-vite";
import { AiSummary } from "./AiSummary";

const meta = {
	title: "Features/AiSummary",
	component: AiSummary,
	decorators: [
		(Story) => (
			<div style={{ width: 700, height: 600, border: "1px solid var(--color-border)", borderRadius: 8, overflow: "hidden" }}>
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof AiSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
