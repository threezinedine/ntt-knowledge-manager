import type { HTMLAttributes } from "react";
import styles from "./avatar.module.scss";
import type { Size } from "../common";

type AvatarProps = HTMLAttributes<HTMLDivElement> & {
	size?: Size;
	src?: string;
	alt?: string;
};

export function Avatar({
	className,
	size = "md",
	src,
	alt = "",
	children,
	...props
}: AvatarProps) {
	const classes = [styles.avatar, styles[`avatar--${size}`], className]
		.filter(Boolean)
		.join(" ");

	// without an image, the wrapper itself stands in for the accessible image role
	const accessibilityProps = src
		? {}
		: ({ role: "img", "aria-label": alt } as const);

	return (
		<div className={classes} {...accessibilityProps} {...props}>
			{src ? (
				<img className={styles.image} src={src} alt={alt} />
			) : (
				<span className={styles.label} aria-hidden="true">
					{children}
				</span>
			)}
		</div>
	);
}
