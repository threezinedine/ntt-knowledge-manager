import { useEffect, useRef } from "react";
import {
	Engine,
	CircleNode,
	LabelNode,
	HoveringNode,
} from "./engine";
import styles from "./stateless-graph.module.scss";

/** One outgoing relation in a `/nodes/map` item. */
export type GraphRelation = {
	relationId: number;
	relationName: string;
};

/** A single entry in the `/nodes/map` API response. */
export type GraphItem = {
	nodeId: number;
	nodeName: string;
	map: Record<string, GraphRelation>;
};

type StatelessGraphProps = {
	className?: string;
	/** The `/nodes/map` API payload. */
	items?: GraphItem[];
	/** Canvas width in CSS pixels. */
	width?: number;
	/** Canvas height in CSS pixels. */
	height?: number;
	/** Accessible label for the canvas. */
	ariaLabel?: string;
	/** Callback receiving the engine instance for direct manipulation. */
	onEngine?: (engine: Engine) => void;
};

export function Graph({
	className,
	items = [],
	width = 800,
	height = 600,
	ariaLabel = "Node graph",
	onEngine,
}: StatelessGraphProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const classes = [styles.graph, className].filter(Boolean).join(" ");

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) {
			return;
		}

		const engine = new Engine(canvas);
		engine.start();

		for (const item of items) {
			const circle = new CircleNode();
			circle.Position = {
				x: Math.random() * (width - 40) + 20,
				y: Math.random() * (height - 40) + 20,
			};
			circle.Radius = 15;
			circle.Color = { r: 100, g: 100, b: 200, a: 1 };
			circle.BorderWidth = 1;
			circle.BorderColor = { r: 0, g: 0, b: 0, a: 1 };

			const label = new LabelNode();
			label.Position = { x: 0, y: 28 };
			label.Text = item.nodeName;
			label.Color = { r: 0, g: 0, b: 0, a: 1 };
			label.FontSize = 14;
			label.FontFamily = "Arial";

			const hovering = new HoveringNode();
			hovering.RefNode = circle;

			circle.onHoverEnter = () => {
				circle.Color = { r: 50, g: 180, b: 80, a: 1 };
				circle.Radius = 20;
			};
			circle.onHoverExit = () => {
				circle.Color = { r: 100, g: 100, b: 200, a: 1 };
				circle.Radius = 15;
			};

			circle.addChild(label);
			circle.addChild(hovering);
			engine.addNode(circle);
		}

		onEngine?.(engine);

		let frameId = 0;
		let last = performance.now();
		const tick = (now: number) => {
			const dt = (now - last) / 1000;
			last = now;
			engine.update(dt);
			frameId = requestAnimationFrame(tick);
		};
		frameId = requestAnimationFrame(tick);

		return () => {
			cancelAnimationFrame(frameId);
			engine.stop();
		};
	}, []);

	return (
		<canvas
			ref={canvasRef}
			className={classes}
			width={width}
			height={height}
			role="img"
			aria-label={ariaLabel}
		/>
	);
}
