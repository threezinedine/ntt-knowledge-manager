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

export const WithSliderField: Story = {
	args: {
		title: "Audio Settings",
		items: [
			{
				id: "volume",
				label: "Volume",
				type: "slider",
				min: 0,
				max: 100,
				step: 1,
				defaultValue: 50,
				hint: "Master volume level.",
			},
			{
				id: "bass",
				label: "Bass",
				type: "slider",
				min: -10,
				max: 10,
				step: 1,
				defaultValue: 0,
			},
			{
				id: "treble",
				label: "Treble",
				type: "slider",
				min: -10,
				max: 10,
				step: 1,
				defaultValue: 0,
			},
			{
				id: "brightness",
				label: "Brightness",
				type: "slider",
				min: 0,
				max: 100,
				step: 5,
				defaultValue: 75,
				hint: "Screen brightness percentage.",
			},
		],
	},
	render: (args) => (
		<Form {...args}>
			<Button type="submit">Apply</Button>
		</Form>
	),
};

export const WithRadioField: Story = {
	args: {
		title: "Preferences",
		items: [
			{
				id: "theme",
				label: "Theme",
				type: "radio",
				options: [
					{ value: "light", label: "Light" },
					{ value: "dark", label: "Dark" },
					{ value: "system", label: "System" },
				],
				defaultValue: "system",
				hint: "Choose your preferred theme.",
			},
			{
				id: "layout",
				label: "Layout",
				type: "radio",
				options: [
					{ value: "compact", label: "Compact" },
					{ value: "comfortable", label: "Comfortable" },
				],
				defaultValue: "comfortable",
			},
		],
	},
	render: (args) => (
		<Form {...args}>
			<Button type="submit">Save</Button>
		</Form>
	),
};

export const WithMultiSelect: Story = {
	args: {
		title: "Notifications",
		items: [
			{
				id: "channels",
				label: "Notification Channels",
				type: "multiselect",
				options: [
					{ value: "email", label: "Email" },
					{ value: "sms", label: "SMS" },
					{ value: "push", label: "Push Notification" },
					{ value: "slack", label: "Slack" },
				],
				defaultValue: ["email", "push"],
				hint: "Select where you want to receive notifications.",
			},
			{
				id: "topics",
				label: "Topics",
				type: "multiselect",
				options: [
					{ value: "updates", label: "Product Updates" },
					{ value: "security", label: "Security Alerts" },
					{ value: "marketing", label: "Marketing" },
				],
				defaultValue: ["updates", "security"],
			},
		],
	},
	render: (args) => (
		<Form {...args}>
			<Button type="submit">Update</Button>
		</Form>
	),
};

export const WithCombobox: Story = {
	args: {
		title: "Shipping",
		items: [
			{
				id: "country",
				label: "Country",
				type: "combobox",
				options: [
					{ value: "us", label: "United States" },
					{ value: "uk", label: "United Kingdom" },
					{ value: "ca", label: "Canada" },
					{ value: "de", label: "Germany" },
					{ value: "fr", label: "France" },
					{ value: "jp", label: "Japan" },
					{ value: "au", label: "Australia" },
					{ value: "br", label: "Brazil" },
					{ value: "vn", label: "Vietnam" },
				],
				placeholder: "Type to search...",
				hint: "Start typing to filter countries.",
			},
			{
				id: "city",
				label: "City",
				type: "text",
				placeholder: "Enter city name",
			},
		],
	},
	render: (args) => (
		<Form {...args}>
			<Button type="submit">Ship</Button>
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
