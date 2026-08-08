import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card } from "./card";
import heroImage from "../../assets/hero.png";

const LONG_DESCRIPTION =
	"A much longer description that goes on and on to demonstrate how the descriptor gets truncated with an ellipsis when it exceeds the maximum allowed length.";

const NOTES = [
	{
		title: "Database patterns",
		description:
			"Seed data, migration notes, and a practical approach to local persistence.",
	},
	{
		title: "Product brief",
		description:
			"A compact vision for the first release and its measurable outcomes.",
	},
	{
		title: "Research: field notes",
		description:
			"A collection of early observations ready to become a working model.",
	},
	{
		title: "Team onboarding",
		description:
			"Links, reading list, and a short guide for the first week.",
	},
	{
		title: "Architecture notes",
		description:
			"FastAPI + React/Electron structure and where each piece lives.",
	},
];

const meta = {
	title: "Components/Card",
	component: Card,
	args: {
		title: "Database patterns",
		description:
			"Seed data, migration notes, and a practical approach to local persistence.",
		avatarAlt: "Note avatar",
		descriptionMaxLength: 60,
		onClick: () => {},
	},
	argTypes: {
		avatarSrc: {
			control: "text",
		},
		avatarAlt: {
			control: "text",
		},
		descriptionMaxLength: {
			control: "number",
		},
	},
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithAvatarImage: Story = {
	args: {
		avatarSrc: heroImage,
		avatarAlt: "Jane Doe",
	},
};

export const LongDescription: Story = {
	args: {
		description: LONG_DESCRIPTION,
		descriptionMaxLength: 40,
	},
};

export const WithoutDescription: Story = {
	args: {
		description: undefined,
	},
};

export const Grid: Story = {
	render: (args) => (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: "repeat(auto-fill, minmax(16rem, 1fr))",
				gap: "1rem",
				padding: "1rem",
			}}
		>
			{NOTES.map((note) => (
				<Card key={note.title} {...args} {...note} />
			))}
		</div>
	),
};
