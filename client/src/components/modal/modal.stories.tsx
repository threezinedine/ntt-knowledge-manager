import { useRef } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Modal, type ModalRef } from "./modal";
import { Button } from "../button";

const meta = {
	title: "Components/Modal",
	component: Modal,
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

function DefaultDemo() {
	const ref = useRef<ModalRef>(null);

	return (
		<div style={{ padding: "3rem" }}>
			<Button onClick={() => ref.current?.open()}>Open Modal</Button>
			<Modal ref={ref}>
				<h2 style={{ margin: "0 0 1rem" }}>Modal Title</h2>
				<p style={{ margin: "0 0 1rem" }}>
					This is the modal content. It renders only when the
					modal is open.
				</p>
				<Button
					variant="outline"
					onClick={() => ref.current?.close()}
				>
					Close
				</Button>
			</Modal>
		</div>
	);
}

export const Default: Story = {
	render: () => <DefaultDemo />,
};

function WithLongContentDemo() {
	const ref = useRef<ModalRef>(null);

	return (
		<div style={{ padding: "3rem" }}>
			<Button onClick={() => ref.current?.open()}>Open Modal</Button>
			<Modal ref={ref}>
				<h2 style={{ margin: "0 0 1rem" }}>Long Content</h2>
				{Array.from({ length: 20 }, (_, i) => (
					<p key={i} style={{ margin: "0 0 0.5rem" }}>
						Paragraph {i + 1}: Lorem ipsum dolor sit amet,
						consectetur adipiscing elit.
					</p>
				))}
				<Button
					variant="outline"
					onClick={() => ref.current?.close()}
				>
					Close
				</Button>
			</Modal>
		</div>
	);
}

export const WithLongContent: Story = {
	render: () => <WithLongContentDemo />,
};
