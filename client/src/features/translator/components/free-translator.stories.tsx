import type { Meta, StoryObj } from "@storybook/react-vite";
import { FreeTranslator } from "./FreeTranslator";

const meta = {
	title: "Features/FreeTranslator",
	component: FreeTranslator,
	args: {
		text: "hello",
	},
	decorators: [
		(Story) => (
			<div style={{ width: 500, height: 300, border: "1px solid var(--color-border)", borderRadius: 8, overflow: "hidden" }}>
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof FreeTranslator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LongText: Story = {
	args: {
		text: "The quick brown fox jumps over the lazy dog",
	},
};

export const CustomLanguages: Story = {
	args: {
		text: "hello world",
		sourceLang: "English",
		targetLang: "Japanese",
	},
};
