import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";

const meta = {
	title: "Components/Button",
	component: Button,
	args: {
		children: "Save note",
	},
	argTypes: {
		variant: {
			control: "select",
			options: [
				"primary",
				"secondary",
				"outline",
				"ghost",
				"danger",
				"link",
			],
		},
		size: {
			control: "select",
			options: ["sm", "md", "lg"],
		},
		isLoading: {
			control: "boolean",
		},
	},
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: {
		variant: "primary",
	},
};

export const Secondary: Story = {
	args: {
		variant: "secondary",
	},
};

export const Outline: Story = {
	args: {
		variant: "outline",
	},
};

export const Ghost: Story = {
	args: {
		variant: "ghost",
	},
};

export const Danger: Story = {
	args: {
		variant: "danger",
	},
};

export const Link: Story = {
	args: {
		variant: "link",
	},
};

export const Small: Story = {
	args: {
		size: "sm",
	},
};

export const Large: Story = {
	args: {
		size: "lg",
	},
};

export const Disabled: Story = {
	args: {
		disabled: true,
	},
};

export const Loading: Story = {
	args: {
		isLoading: true,
	},
};
