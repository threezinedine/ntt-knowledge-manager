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
	const classes = [styles.graph, className].filter(Boolean).join(" ");

	return (
		<canvas
			className={classes}
			width={width}
			height={height}
			role="img"
			aria-label={ariaLabel}
		/>
	);
}
