import type { Meta, StoryObj } from "@storybook/react-vite";
import { ToggleButton } from "./stateless-toggle-button";
import type { Size } from "../common";

const SIZES: Size[] = ["sm", "md", "lg"];

const meta = {
	title: "Components/StatelessToggleButton",
	component: ToggleButton,
	args: {
		value: false,
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
		value: {
			control: "boolean",
		},
	},
} satisfies Meta<typeof ToggleButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Values: Story = {
	render: (args) => (
		<div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
			<ToggleButton {...args} value={false} />
			<ToggleButton {...args} value />
		</div>
	),
};

export const Sizes: Story = {
	render: (args) => (
		<div
			style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
		>
			<div
				style={{
					display: "flex",
					gap: "0.75rem",
					alignItems: "center",
					flexWrap: "wrap",
				}}
			>
				{SIZES.map((size) => (
					<ToggleButton
						key={size}
						{...args}
						size={size}
						value={false}
					/>
				))}
			</div>
			<div
				style={{
					display: "flex",
					gap: "0.75rem",
					alignItems: "center",
					flexWrap: "wrap",
				}}
			>
				{SIZES.map((size) => (
					<ToggleButton key={size} {...args} size={size} value />
				))}
			</div>
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
