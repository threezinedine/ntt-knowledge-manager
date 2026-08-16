import type { Meta, StoryObj } from "@storybook/react-vite";
import { Dictionary } from "./Dictionary";

const meta = {
	title: "Features/Dictionary",
	component: Dictionary,
	decorators: [
		(Story) => (
			<div style={{ width: 600, height: 500, border: "1px solid var(--color-border)", borderRadius: 8, overflow: "hidden" }}>
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof Dictionary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
