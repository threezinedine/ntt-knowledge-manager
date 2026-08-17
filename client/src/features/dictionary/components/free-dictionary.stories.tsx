import type { Meta, StoryObj } from "@storybook/react-vite";
import { FreeDictionary } from "./FreeDictionary";

const meta = {
	title: "Features/FreeDictionary",
	component: FreeDictionary,
	args: {
		word: "abandon",
	},
	decorators: [
		(Story) => (
			<div style={{ width: 600, height: 500, border: "1px solid var(--color-border)", borderRadius: 8, overflow: "hidden" }}>
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof FreeDictionary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AnotherWord: Story = {
	args: {
		word: "serendipity",
	},
};

export const NotFound: Story = {
	args: {
		word: "xyznotaword",
	},
};
