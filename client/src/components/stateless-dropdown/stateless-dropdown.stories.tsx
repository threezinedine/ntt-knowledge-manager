import type { Meta, StoryObj } from "@storybook/react-vite";
import { Dropdown } from "./stateless-dropdown";
import { Button } from "../button";

const meta = {
	title: "Components/StatelessDropdown",
	component: Dropdown,
	args: {
		showMenu: false,
		items: [
			{ id: "rename", label: "Rename", icon: "fa-solid fa-pen" },
			{ id: "separator-1", separator: true },
			{
				id: "duplicate",
				label: "Duplicate",
				icon: "fa-regular fa-copy",
			},
			{ id: "separator-2", separator: true },
			{
				id: "delete",
				label: "Delete",
				icon: "fa-solid fa-trash",
				danger: true,
			},
		],
		menuLabel: "Note actions",
	},
	argTypes: {
		showMenu: {
			control: "boolean",
		},
		menuLabel: {
			control: "text",
		},
	},
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {
	render: (args) => (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				padding: "3rem 0",
			}}
		>
			<Dropdown {...args}>
				<Button variant="outline" size="sm">
					Actions{" "}
					<i
						className="fa-solid fa-chevron-down"
						aria-hidden="true"
					/>
				</Button>
			</Dropdown>
		</div>
	),
};

export const Open: Story = {
	args: {
		showMenu: true,
	},
	render: (args) => (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				padding: "3rem 0",
			}}
		>
			<Dropdown {...args}>
				<Button variant="outline" size="sm">
					Actions{" "}
					<i
						className="fa-solid fa-chevron-down"
						aria-hidden="true"
					/>
				</Button>
			</Dropdown>
		</div>
	),
};

export const OpenWithDisabledItem: Story = {
	args: {
		showMenu: true,
		items: [
			{ id: "rename", label: "Rename", icon: "fa-solid fa-pen" },
			{ id: "separator-1", separator: true },
			{
				id: "archive",
				label: "Archive",
				icon: "fa-solid fa-box-archive",
				disabled: true,
			},
			{
				id: "delete",
				label: "Delete",
				icon: "fa-solid fa-trash",
				danger: true,
			},
		],
	},
	render: (args) => (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				padding: "3rem 0",
			}}
		>
			<Dropdown {...args}>
				<Button variant="outline" size="sm">
					Actions{" "}
					<i
						className="fa-solid fa-chevron-down"
						aria-hidden="true"
					/>
				</Button>
			</Dropdown>
		</div>
	),
};
