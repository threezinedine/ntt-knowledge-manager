import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { TabSpace, type TabItem } from "./tab-space";

const INITIAL_TABS: TabItem[] = [
	{
		id: "index.tsx",
		label: "index.tsx",
		children: (
			<pre style={{ padding: "1rem", margin: 0, fontSize: "0.875rem" }}>
				{`export { App } from "./App";\nexport type { AppProps } from "./App";`}
			</pre>
		),
	},
	{
		id: "App.tsx",
		label: "App.tsx",
		children: (
			<pre style={{ padding: "1rem", margin: 0, fontSize: "0.875rem" }}>
				{`function App() {\n  return <div>Hello World</div>;\n}`}
			</pre>
		),
	},
	{
		id: "styles.css",
		label: "styles.css",
		children: (
			<pre style={{ padding: "1rem", margin: 0, fontSize: "0.875rem" }}>
				{`body {\n  margin: 0;\n  font-family: sans-serif;\n}`}
			</pre>
		),
	},
	{
		id: "utils.ts",
		label: "utils.ts",
		children: (
			<pre style={{ padding: "1rem", margin: 0, fontSize: "0.875rem" }}>
				{`export function clamp(val: number, min: number, max: number) {\n  return Math.min(Math.max(val, min), max);\n}`}
			</pre>
		),
	},
];

const meta = {
	title: "Components/TabSpace",
	component: TabSpace,
} satisfies Meta<typeof TabSpace>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => {
		const [tabs, setTabs] = useState(INITIAL_TABS);
		const [activeId, setActiveId] = useState("App.tsx");

		const handleClose = (id: string) => {
			const next = tabs.filter((t) => t.id !== id);
			if (activeId === id && next.length > 0) {
				const closedIndex = tabs.findIndex((t) => t.id === id);
				const newActive =
					next[Math.min(closedIndex, next.length - 1)];
				setActiveId(newActive.id);
			}
			setTabs(next);
		};

		return (
			<div
				style={{
					width: 600,
					height: 300,
					border: "1px solid var(--color-border)",
					borderRadius: 8,
					overflow: "hidden",
				}}
			>
				<TabSpace
					tabs={tabs}
					activeId={activeId}
					onTabChange={setActiveId}
					onClose={handleClose}
					onReorder={setTabs}
				/>
			</div>
		);
	},
};

export const SingleTab: Story = {
	render: () => {
		const tabs: TabItem[] = [
			{
				id: "readme",
				label: "README.md",
				children: <p style={{ padding: "1rem" }}>Project readme content.</p>,
			},
		];

		return (
			<div
				style={{
					width: 600,
					height: 200,
					border: "1px solid var(--color-border)",
					borderRadius: 8,
					overflow: "hidden",
				}}
			>
				<TabSpace tabs={tabs} activeId="readme" />
			</div>
		);
	},
};

export const ManyTabs: Story = {
	render: () => {
		const files = [
			"index.tsx",
			"App.tsx",
			"main.ts",
			"router.ts",
			"config.ts",
			"utils.ts",
			"helpers.ts",
			"constants.ts",
			"types.d.ts",
			"vite-env.d.ts",
		];
		const [tabs, setTabs] = useState<TabItem[]>(
			files.map((f) => ({
				id: f,
				label: f,
				children: (
					<p style={{ padding: "1rem" }}>
						Content of <code>{f}</code>
					</p>
				),
			})),
		);
		const [activeId, setActiveId] = useState("App.tsx");

		const handleClose = (id: string) => {
			const next = tabs.filter((t) => t.id !== id);
			if (activeId === id && next.length > 0) {
				const closedIndex = tabs.findIndex((t) => t.id === id);
				const newActive =
					next[Math.min(closedIndex, next.length - 1)];
				setActiveId(newActive.id);
			}
			setTabs(next);
		};

		return (
			<div
				style={{
					width: 600,
					height: 250,
					border: "1px solid var(--color-border)",
					borderRadius: 8,
					overflow: "hidden",
				}}
			>
				<TabSpace
					tabs={tabs}
					activeId={activeId}
					onTabChange={setActiveId}
					onClose={handleClose}
					onReorder={setTabs}
				/>
			</div>
		);
	},
};

export const WithDisabledTab: Story = {
	render: () => {
		const tabs: TabItem[] = [
			{
				id: "editable",
				label: "editable.ts",
				children: <p style={{ padding: "1rem" }}>Editable content.</p>,
			},
			{
				id: "locked",
				label: "locked.ts",
				children: <p style={{ padding: "1rem" }}>Locked content.</p>,
				disabled: true,
			},
			{
				id: "another",
				label: "another.ts",
				children: <p style={{ padding: "1rem" }}>Another file.</p>,
			},
		];
		const [activeId, setActiveId] = useState("editable");

		return (
			<div
				style={{
					width: 600,
					height: 200,
					border: "1px solid var(--color-border)",
					borderRadius: 8,
					overflow: "hidden",
				}}
			>
				<TabSpace
					tabs={tabs}
					activeId={activeId}
					onTabChange={setActiveId}
					onClose={() => {}}
				/>
			</div>
		);
	},
};
