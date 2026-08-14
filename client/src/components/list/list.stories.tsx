import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { List, type ListItem } from "./list";

const ITEMS: ListItem[] = [
	{
		id: "1",
		children: (
			<span>
				<i className="fa-solid fa-file-lines" /> Introduction
			</span>
		),
	},
	{
		id: "2",
		children: (
			<span>
				<i className="fa-solid fa-rocket" /> Getting Started
			</span>
		),
	},
	{
		id: "3",
		children: (
			<span>
				<i className="fa-solid fa-gear" /> Configuration
			</span>
		),
	},
	{
		id: "4",
		children: (
			<span>
				<i className="fa-solid fa-code" /> API Reference
			</span>
		),
	},
	{
		id: "5",
		children: (
			<span>
				<i className="fa-solid fa-wrench" /> Troubleshooting
			</span>
		),
	},
];

const meta = {
	title: "Components/List",
	component: List,
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => {
		const [items, setItems] = useState(ITEMS);

		return (
			<div style={{ maxWidth: 320, padding: "2rem" }}>
				<List items={items} onReorder={setItems} />
			</div>
		);
	},
};

export const WithDisabledItem: Story = {
	render: () => {
		const [items, setItems] = useState<ListItem[]>([
			{ id: "1", children: <span>Editable item</span> },
			{
				id: "2",
				children: <span>Locked item</span>,
				disabled: true,
			},
			{ id: "3", children: <span>Another editable item</span> },
		]);

		return (
			<div style={{ maxWidth: 320, padding: "2rem" }}>
				<List items={items} onReorder={setItems} />
			</div>
		);
	},
};

export const RichContent: Story = {
	render: () => {
		const [items, setItems] = useState<ListItem[]>([
			{
				id: "1",
				children: (
					<div>
						<strong>Chapter 1</strong>
						<p style={{ margin: 0, fontSize: "0.75rem", opacity: 0.6 }}>
							The beginning of it all
						</p>
					</div>
				),
			},
			{
				id: "2",
				children: (
					<div>
						<strong>Chapter 2</strong>
						<p style={{ margin: 0, fontSize: "0.75rem", opacity: 0.6 }}>
							Rising action and conflict
						</p>
					</div>
				),
			},
			{
				id: "3",
				children: (
					<div>
						<strong>Chapter 3</strong>
						<p style={{ margin: 0, fontSize: "0.75rem", opacity: 0.6 }}>
							The grand finale
						</p>
					</div>
				),
			},
		]);

		return (
			<div style={{ maxWidth: 320, padding: "2rem" }}>
				<List items={items} onReorder={setItems} />
			</div>
		);
	},
};
