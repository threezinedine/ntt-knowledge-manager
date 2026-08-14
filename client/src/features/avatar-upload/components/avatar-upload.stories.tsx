import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { AvatarUpload } from "./AvatarUpload";

const meta = {
	title: "Features/AvatarUpload",
	component: AvatarUpload,
} satisfies Meta<typeof AvatarUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
	render: () => {
		const [src, setSrc] = useState("");
		const [loading, setLoading] = useState(false);

		const handleUpload = (file: File) => {
			setLoading(true);
			const reader = new FileReader();
			reader.onload = () => {
				setSrc(reader.result as string);
				setLoading(false);
			};
			reader.readAsDataURL(file);
		};

		return (
			<div style={{ padding: "2rem" }}>
				<AvatarUpload
					src={src}
					loading={loading}
					onUpload={handleUpload}
					onRemove={() => setSrc("")}
				/>
			</div>
		);
	},
};

export const WithAvatar: Story = {
	render: () => {
		const [src, setSrc] = useState(
			"https://i.pravatar.cc/150?img=12",
		);
		const [loading, setLoading] = useState(false);

		const handleUpload = (file: File) => {
			setLoading(true);
			const reader = new FileReader();
			reader.onload = () => {
				setSrc(reader.result as string);
				setLoading(false);
			};
			reader.readAsDataURL(file);
		};

		return (
			<div style={{ padding: "2rem" }}>
				<AvatarUpload
					src={src}
					loading={loading}
					onUpload={handleUpload}
					onRemove={() => setSrc("")}
				/>
			</div>
		);
	},
};

export const Loading: Story = {
	render: () => (
		<div style={{ padding: "2rem" }}>
			<AvatarUpload loading={true} />
		</div>
	),
};
