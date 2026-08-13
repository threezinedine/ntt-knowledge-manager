import type { Meta, StoryObj } from "@storybook/react-vite";
import { Graph } from "./stateless-graph";
import type { GraphItem } from "./stateless-graph";
import { CircleNode, LabelNode, HoveringNode } from "./engine";
import type { Engine } from "./engine";

const meta = {
	title: "Components/StatelessGraph",
	component: Graph,
	decorators: [
		(Story) => (
			<div
				style={{
					display: "inline-block",
					border: "1px dashed #6b7280",
				}}
			>
				<Story />
			</div>
		),
	],
	argTypes: {
		width: { control: "number" },
		height: { control: "number" },
	},
} satisfies Meta<typeof Graph>;

export default meta;
type Story = StoryObj<typeof meta>;

const SAMPLE_ITEMS: GraphItem[] = [
	{
		nodeId: 1,
		nodeName: "Home",
		map: { "2": { relationId: 10, relationName: "links to" } },
	},
	{
		nodeId: 2,
		nodeName: "React",
		map: { "3": { relationId: 11, relationName: "depends on" } },
	},
	{
		nodeId: 3,
		nodeName: "Design",
		map: {},
	},
	{
		nodeId: 4,
		nodeName: "TypeScript",
		map: {},
	},
	{
		nodeId: 5,
		nodeName: "Canvas",
		map: { "1": { relationId: 12, relationName: "renders" } },
	},
];

export const Default: Story = {
	args: {
		items: SAMPLE_ITEMS,
	},
};

export const Empty: Story = {};

export const Small: Story = {
	args: {
		width: 400,
		height: 300,
		items: SAMPLE_ITEMS.slice(0, 3),
	},
};

function setupCustomEngine(engine: Engine) {
	const red = new CircleNode();
	red.Position = { x: 200, y: 150 };
	red.Radius = 30;
	red.Color = { r: 220, g: 60, b: 60, a: 1 };
	red.BorderWidth = 2;
	red.BorderColor = { r: 0, g: 0, b: 0, a: 1 };

	const redLabel = new LabelNode();
	redLabel.Position = { x: 0, y: 45 };
	redLabel.Text = "Big Red";
	redLabel.Color = { r: 0, g: 0, b: 0, a: 1 };
	redLabel.FontSize = 16;

	const redHover = new HoveringNode();
	redHover.RefNode = red;

	red.onHoverEnter = () => {
		red.Color = { r: 255, g: 100, b: 100, a: 1 };
		red.Radius = 35;
	};
	red.onHoverExit = () => {
		red.Color = { r: 220, g: 60, b: 60, a: 1 };
		red.Radius = 30;
	};

	red.addChild(redLabel);
	red.addChild(redHover);
	engine.addNode(red);

	const blue = new CircleNode();
	blue.Position = { x: 400, y: 200 };
	blue.Radius = 20;
	blue.Color = { r: 60, g: 60, b: 220, a: 1 };
	blue.BorderWidth = 1;
	blue.BorderColor = { r: 0, g: 0, b: 0, a: 1 };
	blue.Rotation = Math.PI / 6;

	const blueLabel = new LabelNode();
	blueLabel.Position = { x: 0, y: 32 };
	blueLabel.Text = "Tilted Blue";
	blueLabel.Color = { r: 0, g: 0, b: 0, a: 1 };
	blueLabel.FontSize = 12;

	const blueHover = new HoveringNode();
	blueHover.RefNode = blue;

	blue.onHoverEnter = () => {
		blue.Color = { r: 100, g: 100, b: 255, a: 1 };
	};
	blue.onHoverExit = () => {
		blue.Color = { r: 60, g: 60, b: 220, a: 1 };
	};

	blue.addChild(blueLabel);
	blue.addChild(blueHover);
	engine.addNode(blue);
}

export const CustomEngine: Story = {
	args: {
		onEngine: setupCustomEngine,
	},
};
