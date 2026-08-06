import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "./avatar";
import type { Size } from "../common";
import heroImage from "../../assets/hero.png";

const SIZES: Size[] = ["sm", "md", "lg"];

const TRANSPARENT_PIXEL_BASE64 =
	"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

const meta = {
	title: "Components/Avatar",
	component: Avatar,
	args: {
		src: heroImage,
		alt: "User avatar",
	},
	argTypes: {
		size: {
			control: "select",
			options: SIZES,
		},
	},
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sizes: Story = {
	render: (args) => (
		<div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
			{SIZES.map((size) => (
				<Avatar key={size} {...args} size={size} />
			))}
		</div>
	),
};

export const UrlImage: Story = {
	args: {
		src: heroImage,
	},
};

export const Base64Image: Story = {
	args: {
		src: TRANSPARENT_PIXEL_BASE64,
	},
};

export const Letter: Story = {
	args: {
		src: undefined,
		alt: "Jane Doe",
		children: "J",
	},
};
