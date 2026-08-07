import type { Meta, StoryObj } from "@storybook/react-vite";
import { ToggleButton } from "./toggle-button";
import type { Size } from "../common";

const SIZES: Size[] = ["sm", "md", "lg"];

const meta = {
	title: "Components/ToggleButton",
	component: ToggleButton,
	args: {
		defaultValue: false,
		onValueChanged: () => {},
		trueIcon: "fa-solid fa-thumbtack",
		falseIcon: "fa-regular fa-square",
		"aria-label": "Pin note",
	},
	argTypes: {
		size: {
			control: "select",
			options: SIZES,
		},
		isLoading: {
			control: "boolean",
		},
		trueIcon: {
			control: "text",
		},
		falseIcon: {
			control: "text",
		},
		defaultValue: {
			control: "boolean",
		},
	},
} satisfies Meta<typeof ToggleButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Off: Story = {};

export const On: Story = {
	args: {
		defaultValue: true,
	},
};

export const Sizes: Story = {
	render: (args) => (
		<div
			style={{
				display: "flex",
				gap: "0.75rem",
				alignItems: "center",
				flexWrap: "wrap",
			}}
		>
			{SIZES.map((size) => (
				<ToggleButton key={size} {...args} size={size} />
			))}
		</div>
	),
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
