import type { Meta, StoryObj } from "@storybook/react-vite";
import { Form } from "./form";
import { Button } from "../button";

const meta = {
	title: "Components/Form",
	component: Form,
	args: {
		title: "Log in",
		onSubmit: () => {},
	},
	argTypes: {
		title: {
			control: "text",
		},
	},
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		items: [
			{
				id: "email",
				label: "Email",
				type: "email",
				placeholder: "you@example.com",
				required: true,
			},
			{
				id: "password",
				label: "Password",
				type: "password",
				placeholder: "••••••••",
				required: true,
			},
		],
	},
	render: (args) => (
		<Form {...args}>
			<Button type="submit">Log in</Button>
		</Form>
	),
};

export const LongForm: Story = {
	args: {
		title: "New note",
		items: [
			{
				id: "title",
				label: "Title",
				type: "text",
				placeholder: "A clear, searchable title",
			},
			{
				id: "body",
				label: "Body",
				type: "textarea",
				placeholder: "Write the note...",
				hint: "Markdown is supported.",
			},
			{
				id: "label",
				label: "Label",
				type: "select",
				options: [
					{ value: "strategy", label: "Strategy" },
					{ value: "engineering", label: "Engineering" },
					{ value: "research", label: "Research" },
				],
			},
		],
	},
	render: (args) => (
		<Form {...args}>
			<div style={{ display: "flex", gap: "0.5rem" }}>
				<Button type="submit">Save note</Button>
				<Button type="button" variant="outline">
					Cancel
				</Button>
			</div>
		</Form>
	),
};

export const WithNumberField: Story = {
	args: {
		title: "Settings",
		items: [
			{
				id: "name",
				label: "Name",
				type: "text",
				placeholder: "Project name",
			},
			{
				id: "port",
				label: "Port",
				type: "number",
				placeholder: "8080",
				min: 1,
				max: 65535,
				step: 1,
				defaultValue: 3000,
				hint: "Between 1 and 65535.",
			},
			{
				id: "maxRetries",
				label: "Max Retries",
				type: "number",
				min: 0,
				max: 10,
				defaultValue: 3,
			},
			{
				id: "timeout",
				label: "Timeout (ms)",
				type: "number",
				min: 0,
				step: 100,
				defaultValue: 5000,
				hint: "Request timeout in milliseconds.",
			},
		],
	},
	render: (args) => (
		<Form {...args}>
			<Button type="submit">Save settings</Button>
		</Form>
	),
};

export const WithValidation: Story = {
	args: {
		title: "Create account",
		items: [
			{
				id: "name",
				label: "Name",
				type: "text",
				placeholder: "Jane Doe",
				required: true,
			},
			{
				id: "email",
				label: "Email",
				type: "email",
				placeholder: "you@example.com",
				required: true,
				validate: (value) => {
					if (value !== "" && !/^\S+@\S+\.\S+$/.test(value)) {
						return "Enter a valid email address.";
					}
					return undefined;
				},
			},
			{
				id: "username",
				label: "Username",
				type: "text",
				placeholder: "jane",
				hint: "Between 3 and 16 characters.",
				validate: (value) => {
					if (value !== "" && value.length < 3) {
						return "Use at least 3 characters.";
					}
					if (value.length > 16) {
						return "Use at most 16 characters.";
					}
					return undefined;
				},
			},
		],
	},
	render: (args) => (
		<Form {...args}>
			<Button type="submit">Create account</Button>
		</Form>
	),
};
