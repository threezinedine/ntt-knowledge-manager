import type { Meta, StoryObj } from "@storybook/react-vite";
import { Graph } from "./stateless-graph";
import type { GraphItem } from "./stateless-graph";
import { CircleNode, LabelNode, HoveringNode, ArrowNode } from "./engine";
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
	const tweens = engine.tweens;

	const red = new CircleNode();
	red.Position = { x: 200, y: 150 };
	red.Radius = 15;
	red.Color = { r: 220, g: 60, b: 60, a: 1 };
	red.BorderWidth = 2;
	red.BorderColor = { r: 0, g: 0, b: 0, a: 1 };

	const redLabel = new LabelNode();
	redLabel.Position = { x: 0, y: 35 };
	redLabel.Text = "Big Red";
	redLabel.Color = { r: 0, g: 0, b: 0, a: 1 };
	redLabel.FontSize = 16;

	const redHover = new HoveringNode();
	redHover.RefNode = red;

	let redTween: number | null = null;
	red.onHoverEnter = () => {
		if (redTween !== null) tweens.stop(redTween);
		redTween = tweens.start(red, 0.2, { prop: "Radius", to: 25 });
	};
	red.onHoverExit = () => {
		if (redTween !== null) tweens.stop(redTween);
		redTween = tweens.start(red, 0.2, { prop: "Radius", to: 15 });
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

	const blueLabel = new LabelNode();
	blueLabel.Position = { x: 0, y: 32 };
	blueLabel.Text = "Tilted Blue";
	blueLabel.Color = { r: 0, g: 0, b: 0, a: 1 };
	blueLabel.FontSize = 12;

	const blueHover = new HoveringNode();
	blueHover.RefNode = blue;

	let blueTween: number | null = null;
	blue.onHoverEnter = () => {
		if (blueTween !== null) tweens.stop(blueTween);
		blueTween = tweens.start(
			blue,
			0.3,
			{ prop: "Radius", to: 28 },
			{ prop: "Rotation", to: Math.PI / 4 },
		);
	};
	blue.onHoverExit = () => {
		if (blueTween !== null) tweens.stop(blueTween);
		blueTween = tweens.start(
			blue,
			0.3,
			{ prop: "Radius", to: 20 },
			{ prop: "Rotation", to: 0 },
		);
	};

	blue.addChild(blueLabel);
	blue.addChild(blueHover);
	engine.addNode(blue);

	const arrow = new ArrowNode();
	arrow.StartNode = red;
	arrow.EndNode = blue;
	arrow.Direction = "forward";
	arrow.Color = { r: 80, g: 80, b: 80, a: 1 };
	engine.addNode(arrow);
}

export const CustomEngine: Story = {
	args: {
		onEngine: setupCustomEngine,
	},
};

function setupArrowsDemo(engine: Engine) {
	const tweens = engine.tweens;

	function makeCircle(
		x: number,
		y: number,
		label: string,
		color: { r: number; g: number; b: number },
	): CircleNode {
		const circle = new CircleNode();
		circle.Position = { x, y };
		circle.Radius = 18;
		circle.Color = { ...color, a: 1 };
		circle.BorderWidth = 1;
		circle.BorderColor = { r: 0, g: 0, b: 0, a: 1 };

		const lbl = new LabelNode();
		lbl.Position = { x: 0, y: 30 };
		lbl.Text = label;
		lbl.Color = { r: 0, g: 0, b: 0, a: 1 };
		lbl.FontSize = 12;

		const hover = new HoveringNode();
		hover.RefNode = circle;

		let tween: number | null = null;
		circle.onHoverEnter = () => {
			if (tween !== null) tweens.stop(tween);
			tween = tweens.start(circle, 0.15, { prop: "Radius", to: 24 });
		};
		circle.onHoverExit = () => {
			if (tween !== null) tweens.stop(tween);
			tween = tweens.start(circle, 0.15, { prop: "Radius", to: 18 });
		};

		circle.addChild(lbl);
		circle.addChild(hover);
		engine.addNode(circle);
		return circle;
	}

	const a = makeCircle(150, 120, "A", { r: 220, g: 60, b: 60 });
	const b = makeCircle(400, 80, "B", { r: 60, g: 60, b: 220 });
	const c = makeCircle(400, 280, "C", { r: 60, g: 180, b: 60 });
	const d = makeCircle(650, 180, "D", { r: 180, g: 120, b: 60 });

	const forwardArrow = new ArrowNode();
	forwardArrow.StartNode = a;
	forwardArrow.EndNode = b;
	forwardArrow.Direction = "forward";
	forwardArrow.Color = { r: 80, g: 80, b: 80, a: 1 };
	engine.addNode(forwardArrow);

	const biArrow = new ArrowNode();
	biArrow.StartNode = b;
	biArrow.EndNode = c;
	biArrow.Direction = "both";
	biArrow.Color = { r: 60, g: 120, b: 200, a: 1 };
	biArrow.ArrowSize = 12;
	engine.addNode(biArrow);

	const lineArrow = new ArrowNode();
	lineArrow.StartNode = a;
	lineArrow.EndNode = c;
	lineArrow.Direction = "none";
	lineArrow.Color = { r: 160, g: 160, b: 160, a: 1 };
	lineArrow.LineWidth = 1;
	engine.addNode(lineArrow);

	const toD = new ArrowNode();
	toD.StartNode = c;
	toD.EndNode = d;
	toD.Direction = "forward";
	toD.Color = { r: 80, g: 80, b: 80, a: 1 };
	engine.addNode(toD);

	const bToD = new ArrowNode();
	bToD.StartNode = b;
	bToD.EndNode = d;
	bToD.Direction = "forward";
	bToD.Color = { r: 80, g: 80, b: 80, a: 1 };
	engine.addNode(bToD);
}

export const Arrows: Story = {
	args: {
		onEngine: setupArrowsDemo,
	},
};
