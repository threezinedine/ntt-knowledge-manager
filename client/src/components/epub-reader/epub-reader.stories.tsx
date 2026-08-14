import type { Meta, StoryObj } from "@storybook/react-vite";
import { EpubReader } from "./epub-reader";

const meta = {
	title: "Components/EpubReader",
	component: EpubReader,
} satisfies Meta<typeof EpubReader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
