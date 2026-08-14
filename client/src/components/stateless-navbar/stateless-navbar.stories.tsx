import type { Meta, StoryObj } from "@storybook/react-vite";
import { Navbar } from "./stateless-navbar";
import heroImage from "../../assets/hero.png";
import type { DropdownItem } from "../dropdown";

const accountItems: DropdownItem[] = [
	{
		id: "settings",
		label: "Settings",
		icon: "fa-solid fa-gear",
		onSelect: () => {},
	},
	{
		id: "workspace",
		label: "Workspace",
		icon: "fa-solid fa-diagram-project",
		onSelect: () => {},
	},
	{ id: "account-separator", separator: true },
	{
		id: "logout",
		label: "Logout",
		icon: "fa-solid fa-right-from-bracket",
		danger: true,
		onSelect: () => {},
	},
];

const meta = {
	title: "Components/StatelessNavbar",
	component: Navbar,
	args: {
		isAuthenticated: false,
		onLoginClick: () => {},
		onAvatarClick: () => {},
		onBrandClick: () => alert("Brand clicked!"),
	},
	argTypes: {
		isAuthenticated: {
			control: "boolean",
		},
		variant: {
			control: "inline-radio",
			options: ["default", "brand"],
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
		accountItems,
	},
};

export const AuthenticatedWithoutImage: Story = {
	args: {
		isAuthenticated: true,
		avatarSrc: undefined,
		avatarAlt: "Jane Doe",
		avatarFallback: "J",
		accountItems,
	},
};

export const Brand: Story = {
	args: {
		variant: "brand",
		isAuthenticated: false,
	},
};
