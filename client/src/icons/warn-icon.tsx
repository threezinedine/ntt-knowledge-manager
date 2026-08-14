import type { SVGAttributes } from "react";

type IconProps = SVGAttributes<SVGSVGElement>;

export function WarnIcon({ width = 20, height = 20, ...props }: IconProps) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="currentColor"
			width={width}
			height={height}
			{...props}
		>
			<path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
		</svg>
	);
}
