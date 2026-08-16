import type { Meta, StoryObj } from "@storybook/react-vite";
import { AddIcon } from "./add-icon";
import { InfoIcon } from "./info-icon";
import { SuccessIcon } from "./success-icon";
import { WarnIcon } from "./warn-icon";
import { ErrorIcon } from "./error-icon";
import { SpeakerIcon } from "./speaker-icon";

const ICONS = [
	{ name: "AddIcon", component: AddIcon, color: "#2563eb" },
	{ name: "InfoIcon", component: InfoIcon, color: "#1e40af" },
	{ name: "SuccessIcon", component: SuccessIcon, color: "#166534" },
	{ name: "WarnIcon", component: WarnIcon, color: "#854d0e" },
	{ name: "ErrorIcon", component: ErrorIcon, color: "#991b1b" },
	{ name: "SpeakerIcon", component: SpeakerIcon, color: "#4a5568" },
];

const meta = {
	title: "Icons/All",
	argTypes: {
		size: { control: { type: "number", min: 12, max: 64, step: 4 } },
	},
	args: {
		size: 32,
	},
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Gallery: Story = {
	render: (args) => (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
				gap: "1.5rem",
				padding: "1rem",
			}}
		>
			{ICONS.map(({ name, component: Icon, color }) => (
				<div
					key={name}
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						gap: "0.5rem",
					}}
				>
					<Icon
						// @ts-ignore
						width={args.size}
						// @ts-ignore
						height={args.size}
						style={{ color }}
					/>
					<span style={{ fontSize: "0.75rem", opacity: 0.7 }}>
						{name}
					</span>
				</div>
			))}
		</div>
	),
};
