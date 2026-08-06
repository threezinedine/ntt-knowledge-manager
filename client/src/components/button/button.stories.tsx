import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";
import type { Variant, Size } from "../common";

const VARIANTS: Variant[] = [
	"primary",
	"secondary",
	"outline",
	"ghost",
	"danger",
	"link",
];

const SIZES: Size[] = ["sm", "md", "lg"];

const meta = {
	title: "Components/Button",
	component: Button,
	args: {
		children: "Save note",
	},
	argTypes: {
		variant: {
			control: "select",
			options: VARIANTS,
		},
		size: {
			control: "select",
			options: SIZES,
		},
		isLoading: {
			control: "boolean",
		},
	},
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
	render: (args) => (
		<div
			style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
		>
			<div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
				{VARIANTS.map((variant) => (
					<Button key={variant} {...args} variant={variant} />
				))}
			</div>
			<div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
				{VARIANTS.map((variant) => (
					<Button
						key={variant}
						{...args}
						variant={variant}
						isLoading
					/>
				))}
			</div>
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
					<Button key={size} {...args} size={size} />
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
					<Button key={size} {...args} size={size} isLoading />
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
