import type { Meta, StoryObj } from "@storybook/react-vite";
import { Graph } from "./stateless-graph";

const meta = {
	title: "Components/StatelessGraph",
	component: Graph,
	// border is a story-only affordance to make the canvas bounds visible
	// (it is intentionally NOT part of the component itself)
	decorators: [
		(Story) => (
			<div
				style={{
					display: "inline-block",
					border: "1px dashed #6b7280",
				}}
			>
				<Story />
			</div>
		),
	],
	argTypes: {
		width: {
			control: "number",
		},
		height: {
			control: "number",
		},
	},
} satisfies Meta<typeof Graph>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = {
	args: {
		width: 400,
		height: 300,
	},
};
