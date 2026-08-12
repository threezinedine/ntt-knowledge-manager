import { useEffect, useRef } from "react";
import { Engine, CircleNode } from "./engine";
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
	/** The `/nodes/map` API payload. Not rendered yet — reserved for later. */
	items?: GraphItem[];
	/** Canvas width in CSS pixels. */
	width?: number;
	/** Canvas height in CSS pixels. */
	height?: number;
	/** Accessible label for the canvas. */
	ariaLabel?: string;
};

export function Graph({
	className,
	items: _items = [],
	width = 800,
	height = 600,
	ariaLabel = "Node graph",
}: StatelessGraphProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const classes = [styles.graph, className].filter(Boolean).join(" ");

	// Each mounted graph owns its own engine, bound to this canvas.
	// The engine is set up once (lazily) and torn down on unmount.
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) {
			return;
		}

		const engine = new Engine(canvas);
		engine.start();

		const circleNode = new CircleNode();
		circleNode.Position = { x: 100, y: 100 };

		engine.addNode(circleNode);

		// drive the engine's update loop
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
