import styles from "./stateless-graph.module.scss";

type StatelessGraphProps = {
	className?: string;
	/** Canvas width in CSS pixels. */
	width?: number;
	/** Canvas height in CSS pixels. */
	height?: number;
	/** Accessible label for the canvas. */
	ariaLabel?: string;
};

export function Graph({
	className,
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
