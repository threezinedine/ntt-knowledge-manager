import type { Meta, StoryObj } from "@storybook/react-vite";
import { Editor } from "./editor";

const meta = {
	title: "Components/Editor",
	component: Editor,
} satisfies Meta<typeof Editor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
