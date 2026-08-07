import type { Meta, StoryObj } from "@storybook/react-vite";
import { Navbar } from "./stateless-navbar";
import heroImage from "../../assets/hero.png";

const meta = {
	title: "Components/Navbar",
	component: Navbar,
	args: {
		isAuthenticated: false,
		onLoginClick: () => {},
		onAvatarClick: () => {},
	},
	argTypes: {
		isAuthenticated: {
			control: "boolean",
		},
		avatarSrc: {
			control: "text",
		},
		avatarAlt: {
			control: "text",
		},
		loginLabel: {
			control: "text",
		},
	},
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NotAuthenticated: Story = {
	args: {
		isAuthenticated: false,
	},
};

export const Authenticated: Story = {
	args: {
		isAuthenticated: true,
		avatarSrc: heroImage,
		avatarAlt: "Jane Doe",
	},
};

export const AuthenticatedWithoutImage: Story = {
	args: {
		isAuthenticated: true,
		avatarSrc: undefined,
		avatarAlt: "Jane Doe",
		avatarFallback: "J",
	},
};
