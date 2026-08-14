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

function DefaultDemo() {
	const [items, setItems] = useState(ITEMS);

	return (
		<div style={{ maxWidth: 320, padding: "2rem" }}>
			<List items={items} onReorder={setItems} />
		</div>
	);
}

export const Default: Story = {
	render: () => <DefaultDemo />,
};

function WithDisabledItemDemo() {
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
}

export const WithDisabledItem: Story = {
	render: () => <WithDisabledItemDemo />,
};

function CrossListTransferDemo() {
	const [left, setLeft] = useState<ListItem[]>([
		{ id: "a1", children: <span>Apple</span> },
		{ id: "a2", children: <span>Banana</span> },
		{ id: "a3", children: <span>Cherry</span> },
	]);
	const [right, setRight] = useState<ListItem[]>([
		{ id: "b1", children: <span>Dog</span> },
		{ id: "b2", children: <span>Cat</span> },
	]);

	const allItems = [...left, ...right];

	const handleReceiveLeft = (item: ListItem, atIndex: number) => {
		const full = allItems.find((i) => i.id === item.id);
		if (!full) return;
		setRight((prev) => prev.filter((i) => i.id !== item.id));
		setLeft((prev) => {
			const next = [...prev];
			next.splice(atIndex, 0, full);
			return next;
		});
	};

	const handleReceiveRight = (item: ListItem, atIndex: number) => {
		const full = allItems.find((i) => i.id === item.id);
		if (!full) return;
		setLeft((prev) => prev.filter((i) => i.id !== item.id));
		setRight((prev) => {
			const next = [...prev];
			next.splice(atIndex, 0, full);
			return next;
		});
	};

	return (
		<div style={{ display: "flex", gap: "2rem", padding: "2rem" }}>
			<div style={{ flex: 1 }}>
				<h4>Fruits</h4>
				<List
					items={left}
					onReorder={setLeft}
					groupId="transfer"
					onReceive={handleReceiveLeft}
				/>
			</div>
			<div style={{ flex: 1 }}>
				<h4>Animals</h4>
				<List
					items={right}
					onReorder={setRight}
					groupId="transfer"
					onReceive={handleReceiveRight}
				/>
			</div>
		</div>
	);
}

export const CrossListTransfer: Story = {
	render: () => <CrossListTransferDemo />,
};

function RichContentDemo() {
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
}

export const RichContent: Story = {
	render: () => <RichContentDemo />,
};
