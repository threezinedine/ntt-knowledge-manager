import type { SVGAttributes } from "react";

type IconProps = SVGAttributes<SVGSVGElement>;

export function DownloadIcon({ width = 20, height = 20, ...props }: IconProps) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="currentColor"
			width={width}
			height={height}
			{...props}
		>
			<path d="M5 20h14v-2H5v2zm7-18v12l4-4 1.41 1.41L12 16.83 6.59 11.41 8 10l4 4V2z" />
		</svg>
	);
}
