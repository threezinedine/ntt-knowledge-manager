import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { CommandPalette, type CommandItem } from "./command-palette";

const COMMANDS: CommandItem[] = [
	{
		id: "new-file",
		label: "New File",
		group: "File",
		shortcut: "Ctrl+N",
		onSelect: () => alert("New File"),
	},
	{
		id: "open-file",
		label: "Open File",
		group: "File",
		shortcut: "Ctrl+O",
		onSelect: () => alert("Open File"),
	},
	{
		id: "save",
		label: "Save",
		group: "File",
		shortcut: "Ctrl+S",
		onSelect: () => alert("Save"),
	},
	{
		id: "save-as",
		label: "Save As...",
		group: "File",
		shortcut: "Ctrl+Shift+S",
		onSelect: () => alert("Save As"),
	},
	{
		id: "toggle-theme",
		label: "Toggle Theme",
		group: "Preferences",
		onSelect: () => alert("Toggle Theme"),
	},
	{
		id: "zoom-in",
		label: "Zoom In",
		group: "View",
		shortcut: "Ctrl+=",
		onSelect: () => alert("Zoom In"),
	},
	{
		id: "zoom-out",
		label: "Zoom Out",
		group: "View",
		shortcut: "Ctrl+-",
		onSelect: () => alert("Zoom Out"),
	},
	{
		id: "toggle-sidebar",
		label: "Toggle Sidebar",
		group: "View",
		shortcut: "Ctrl+B",
		onSelect: () => alert("Toggle Sidebar"),
	},
	{
		id: "git-commit",
		label: "Git: Commit",
		group: "Source Control",
		onSelect: () => alert("Git Commit"),
	},
	{
		id: "git-push",
		label: "Git: Push",
		group: "Source Control",
		onSelect: () => alert("Git Push"),
	},
	{
		id: "git-pull",
		label: "Git: Pull",
		group: "Source Control",
		onSelect: () => alert("Git Pull"),
	},
];

const meta = {
	title: "Components/CommandPalette",
	component: CommandPalette,
} satisfies Meta<typeof CommandPalette>;

export default meta;
type Story = StoryObj<typeof meta>;

function DefaultDemo() {
	const [open, setOpen] = useState(true);

	return (
		<div>
			<button onClick={() => setOpen(true)}>
				Open Command Palette (Ctrl+Shift+P)
			</button>
			<CommandPalette
				commands={COMMANDS}
				open={open}
				onClose={() => setOpen(false)}
			/>
		</div>
	);
}

export const Default: Story = {
	render: () => <DefaultDemo />,
};

function FewCommandsDemo() {
	const [open, setOpen] = useState(true);
	const commands: CommandItem[] = [
		{
			id: "run",
			label: "Run Task",
			shortcut: "Ctrl+Shift+B",
			onSelect: () => alert("Run"),
		},
		{
			id: "debug",
			label: "Start Debugging",
			shortcut: "F5",
			onSelect: () => alert("Debug"),
		},
	];

	return (
		<div>
			<button onClick={() => setOpen(true)}>Open</button>
			<CommandPalette
				commands={commands}
				open={open}
				onClose={() => setOpen(false)}
			/>
		</div>
	);
}

export const FewCommands: Story = {
	render: () => <FewCommandsDemo />,
};

function WithGroupsDemo() {
	const [open, setOpen] = useState(true);

	return (
		<div>
			<button onClick={() => setOpen(true)}>Open</button>
			<CommandPalette
				commands={COMMANDS}
				open={open}
				onClose={() => setOpen(false)}
				placeholder="> Type a command..."
			/>
		</div>
	);
}

export const WithGroups: Story = {
	render: () => <WithGroupsDemo />,
};
