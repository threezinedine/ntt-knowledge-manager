import type { Meta, StoryObj } from "@storybook/react-vite";
import { ToastMessage } from "./toast-message";
import type { ToastVariant, ToastPosition } from "./toast-message";

const VARIANTS: ToastVariant[] = ["info", "success", "warn", "error"];
const POSITIONS: ToastPosition[] = [
	"top-left",
	"top-right",
	"bottom-left",
	"bottom-right",
];

const meta = {
	title: "Components/ToastMessage",
	component: ToastMessage,
	args: {
		title: "Changes saved",
		description: "Your settings have been updated successfully.",
		onClose: () => {},
	},
	argTypes: {
		variant: {
			control: "select",
			options: VARIANTS,
		},
		position: {
			control: "select",
			options: POSITIONS,
		},
	},
} satisfies Meta<typeof ToastMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Info: Story = {
	args: { variant: "info", title: "Heads up", description: "A new version is available." },
};

export const Success: Story = {
	args: { variant: "success", title: "Saved", description: "Your changes were saved." },
};

export const Warn: Story = {
	args: { variant: "warn", title: "Warning", description: "Disk usage is above 90%." },
};

export const Error: Story = {
	args: { variant: "error", title: "Error", description: "Failed to save changes." },
};

export const AllVariants: Story = {
	render: (args) => (
		<div style={{ display: "flex", flexDirection: "column", gap: "1rem", padding: "1rem" }}>
			{VARIANTS.map((variant) => (
				<ToastMessage
					key={variant}
					{...args}
					variant={variant}
					title={variant.charAt(0).toUpperCase() + variant.slice(1)}
					style={{ position: "static" }}
				/>
			))}
		</div>
	),
};

export const WithoutDescription: Story = {
	args: { description: undefined },
};

export const WithoutClose: Story = {
	args: { onClose: undefined },
};

export const TopLeft: Story = {
	args: { position: "top-left" },
};

export const TopRight: Story = {
	args: { position: "top-right" },
};

export const BottomLeft: Story = {
	args: { position: "bottom-left" },
};

export const BottomRight: Story = {
	args: { position: "bottom-right" },
};
