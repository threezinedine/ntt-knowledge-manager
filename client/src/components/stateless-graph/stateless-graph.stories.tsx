import type { Meta, StoryObj } from "@storybook/react-vite";
import { Graph } from "./stateless-graph";
import type { GraphItem } from "./stateless-graph";
import { CircleNode, LabelNode, HoveringNode, ArrowNode, GravityNode } from "./engine";
import type { ArrowTextDirection } from "./engine/nodes/arrow-node";
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

	const arrowHover = new HoveringNode();
	arrowHover.RefNode = arrow;
	let arrowTween: number | null = null;
	arrow.onHoverEnter = () => {
		if (arrowTween !== null) tweens.stop(arrowTween);
		arrowTween = tweens.start(arrow, 0.15, { prop: "LineWidth", to: 5 });
	};
	arrow.onHoverExit = () => {
		if (arrowTween !== null) tweens.stop(arrowTween);
		arrowTween = tweens.start(arrow, 0.15, { prop: "LineWidth", to: 2 });
	};

	arrow.addChild(arrowHover);
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

	function makeArrow(
		start: CircleNode,
		end: CircleNode,
		direction: "forward" | "both" | "none",
		color: { r: number; g: number; b: number },
		lineWidth = 2,
		text = "",
		textDirection: ArrowTextDirection = "horizontal",
	): ArrowNode {
		const arrow = new ArrowNode();
		arrow.StartNode = start;
		arrow.EndNode = end;
		arrow.Direction = direction;
		arrow.Color = { ...color, a: 1 };
		arrow.LineWidth = lineWidth;
		arrow.Text = text;
		arrow.TextDirection = textDirection;

		const hover = new HoveringNode();
		hover.RefNode = arrow;
		let tween: number | null = null;
		arrow.onHoverEnter = () => {
			if (tween !== null) tweens.stop(tween);
			tween = tweens.start(arrow, 0.15, { prop: "LineWidth", to: lineWidth + 3 });
		};
		arrow.onHoverExit = () => {
			if (tween !== null) tweens.stop(tween);
			tween = tweens.start(arrow, 0.15, { prop: "LineWidth", to: lineWidth });
		};

		arrow.addChild(hover);
		engine.addNode(arrow);
		return arrow;
	}

	const a = makeCircle(150, 120, "A", { r: 220, g: 60, b: 60 });
	const b = makeCircle(400, 80, "B", { r: 60, g: 60, b: 220 });
	const c = makeCircle(400, 280, "C", { r: 60, g: 180, b: 60 });
	const d = makeCircle(650, 180, "D", { r: 180, g: 120, b: 60 });

	makeArrow(a, b, "forward", { r: 80, g: 80, b: 80 }, 2, "links to", "follow");
	makeArrow(b, c, "both", { r: 60, g: 120, b: 200 }, 2, "syncs", "horizontal");
	makeArrow(a, c, "none", { r: 160, g: 160, b: 160 }, 1, "related", "follow");
	makeArrow(c, d, "forward", { r: 80, g: 80, b: 80 }, 2, "depends on", "horizontal");
	makeArrow(b, d, "forward", { r: 80, g: 80, b: 80 }, 2, "calls", "follow");
}

export const Arrows: Story = {
	args: {
		onEngine: setupArrowsDemo,
	},
};

function setupDoubleClickDemo(engine: Engine) {
	const tweens = engine.tweens;

	const colors = [
		{ r: 220, g: 60, b: 60 },
		{ r: 60, g: 180, b: 60 },
		{ r: 60, g: 60, b: 220 },
		{ r: 220, g: 160, b: 20 },
	];

	function makeNode(x: number, y: number, label: string) {
		const circle = new CircleNode();
		circle.Position = { x, y };
		circle.Radius = 22;
		circle.Color = { ...colors[0], a: 1 };
		circle.BorderWidth = 2;
		circle.BorderColor = { r: 0, g: 0, b: 0, a: 1 };

		const lbl = new LabelNode();
		lbl.Position = { x: 0, y: 38 };
		lbl.Text = label;
		lbl.Color = { r: 0, g: 0, b: 0, a: 1 };
		lbl.FontSize = 13;

		const hover = new HoveringNode();
		hover.RefNode = circle;

		let hoverTween: number | null = null;
		circle.onHoverEnter = () => {
			if (hoverTween !== null) tweens.stop(hoverTween);
			hoverTween = tweens.start(circle, 0.15, { prop: "Radius", to: 28 });
		};
		circle.onHoverExit = () => {
			if (hoverTween !== null) tweens.stop(hoverTween);
			hoverTween = tweens.start(circle, 0.15, { prop: "Radius", to: 22 });
		};

		let colorIdx = 0;
		circle.onDoubleClick = () => {
			colorIdx = (colorIdx + 1) % colors.length;
			circle.Color = { ...colors[colorIdx], a: 1 };
		};

		circle.addChild(lbl);
		circle.addChild(hover);
		engine.addNode(circle);
		return circle;
	}

	makeNode(200, 150, "Double-click me");
	makeNode(450, 150, "Me too");
}

export const DoubleClick: Story = {
	args: {
		onEngine: setupDoubleClickDemo,
	},
};

function setupForceLayoutDemo(
	engine: Engine,
	opts: {
		repulsion: number;
		attraction: number;
		centerGravity: number;
		damping: number;
	},
) {
	const g = engine.gravity;
	g.RepulsionStrength = opts.repulsion;
	g.AttractionStrength = opts.attraction;
	g.CenterGravity = opts.centerGravity;
	g.Damping = opts.damping;

	const tweens = engine.tweens;
	const cx = 400;
	const cy = 200;

	const nodeData = [
		{ label: "Core", color: { r: 220, g: 60, b: 60 } },
		{ label: "Auth", color: { r: 60, g: 60, b: 220 } },
		{ label: "API", color: { r: 60, g: 180, b: 60 } },
		{ label: "DB", color: { r: 180, g: 120, b: 60 } },
		{ label: "UI", color: { r: 160, g: 60, b: 180 } },
		{ label: "Cache", color: { r: 60, g: 160, b: 160 } },
	];

	const circles: CircleNode[] = [];
	const gravityNodes: GravityNode[] = [];

	for (const { label, color } of nodeData) {
		const circle = new CircleNode();
		circle.Position = {
			x: cx + (Math.random() - 0.5) * 80,
			y: cy + (Math.random() - 0.5) * 80,
		};
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

		const gravity = new GravityNode();
		gravity.RefNode = circle;

		circle.addChild(lbl);
		circle.addChild(hover);
		circle.addChild(gravity);
		engine.addNode(circle);

		circles.push(circle);
		gravityNodes.push(gravity);
	}

	const edges: [number, number][] = [
		[0, 1], [0, 2], [0, 3],
		[1, 2], [2, 3], [2, 4],
		[3, 5], [4, 5],
	];

	for (const [i, j] of edges) {
		gravityNodes[i].addLink(gravityNodes[j]);

		const arrow = new ArrowNode();
		arrow.StartNode = circles[i];
		arrow.EndNode = circles[j];
		arrow.Direction = "forward";
		arrow.Color = { r: 80, g: 80, b: 80, a: 1 };

		const arrowHover = new HoveringNode();
		arrowHover.RefNode = arrow;
		let arrowTween: number | null = null;
		arrow.onHoverEnter = () => {
			if (arrowTween !== null) tweens.stop(arrowTween);
			arrowTween = tweens.start(arrow, 0.15, { prop: "LineWidth", to: 5 });
		};
		arrow.onHoverExit = () => {
			if (arrowTween !== null) tweens.stop(arrowTween);
			arrowTween = tweens.start(arrow, 0.15, { prop: "LineWidth", to: 2 });
		};

		arrow.addChild(arrowHover);
		engine.addNode(arrow);
	}
}

export const ForceLayout: StoryObj = {
	args: {
		width: 800,
		height: 400,
		repulsion: 50000,
		attraction: 0,
		centerGravity: 0.05,
		damping: 0.92,
	},
	argTypes: {
		repulsion: { control: { type: "range", min: 0, max: 50000, step: 500 } },
		attraction: { control: { type: "range", min: 0, max: 1, step: 0.01 } },
		centerGravity: { control: { type: "range", min: 0, max: 1, step: 0.01 } },
		damping: { control: { type: "range", min: 0, max: 1, step: 0.01 } },
	},
	render: (args) => {
		const { repulsion, attraction, centerGravity, damping, ...graphArgs } = args as {
			repulsion: number;
			attraction: number;
			centerGravity: number;
			damping: number;
			width: number;
			height: number;
		};
		return (
			<Graph
				{...graphArgs}
				onEngine={(engine) =>
					setupForceLayoutDemo(engine, { repulsion, attraction, centerGravity, damping })
				}
			/>
		);
	},
};
