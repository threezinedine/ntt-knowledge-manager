import type { Meta, StoryObj } from "@storybook/react-vite";
import { Translator } from "./Translator";

const meta = {
	title: "Features/Translator",
	component: Translator,
	decorators: [
		(Story) => (
			<div style={{ width: 600, height: 500, border: "1px solid var(--color-border)", borderRadius: 8, overflow: "hidden" }}>
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof Translator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
