import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { List, type ListItem } from "./list";

const ITEMS: ListItem[] = [
	{ id: "1", label: "Introduction", icon: "fa-solid fa-file-lines" },
	{ id: "2", label: "Getting Started", icon: "fa-solid fa-rocket" },
	{ id: "3", label: "Configuration", icon: "fa-solid fa-gear" },
	{ id: "4", label: "API Reference", icon: "fa-solid fa-code" },
	{ id: "5", label: "Troubleshooting", icon: "fa-solid fa-wrench" },
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
				<List
					items={items}
					onReorder={setItems}
					onItemSelect={(item) => console.log("selected", item)}
				/>
			</div>
		);
	},
};

export const WithDisabledItem: Story = {
	render: () => {
		const itemsWithDisabled: ListItem[] = [
			{ id: "1", label: "Editable item" },
			{ id: "2", label: "Locked item", disabled: true },
			{ id: "3", label: "Another editable item" },
		];
		const [items, setItems] = useState(itemsWithDisabled);

		return (
			<div style={{ maxWidth: 320, padding: "2rem" }}>
				<List items={items} onReorder={setItems} />
			</div>
		);
	},
};

export const CustomRender: Story = {
	render: () => {
		const [items, setItems] = useState(ITEMS);

		return (
			<div style={{ maxWidth: 320, padding: "2rem" }}>
				<List
					items={items}
					onReorder={setItems}
					renderItem={(item) => (
						<div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flex: 1 }}>
							{item.icon && <i className={item.icon} />}
							<strong>{item.label}</strong>
						</div>
					)}
				/>
			</div>
		);
	},
};
