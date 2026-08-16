import type { SVGAttributes } from "react";

type IconProps = SVGAttributes<SVGSVGElement>;

export function AddIcon({ width = 20, height = 20, ...props }: IconProps) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="currentColor"
			width={width}
			height={height}
			{...props}
		>
			<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
		</svg>
	);
}
