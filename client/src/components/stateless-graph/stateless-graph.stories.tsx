import type { Meta, StoryObj } from "@storybook/react-vite";
import { Graph } from "./stateless-graph";

const meta = {
	title: "Components/StatelessGraph",
	component: Graph,
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
