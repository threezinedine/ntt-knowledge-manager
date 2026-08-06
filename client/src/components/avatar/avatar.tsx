import type { HTMLAttributes } from "react";
import styles from "./avatar.module.scss";
import type { Size } from "../common";

type AvatarProps = HTMLAttributes<HTMLDivElement> & {
	size?: Size;
	src?: string;
	alt?: string;
	disabled?: boolean;
	isLoading?: boolean;
};

export function Avatar({
	className,
	size = "md",
	src,
	alt = "",
	disabled = false,
	isLoading = false,
	children,
	onClick,
	...props
}: AvatarProps) {
	const isDisabled = disabled || isLoading;

	const classes = [
		styles.avatar,
		styles[`avatar--${size}`],
		isDisabled && styles["avatar--disabled"],
		isLoading && styles["avatar--loading"],
		className,
	]
		.filter(Boolean)
		.join(" ");

	const contentClasses = (base: string) =>
		[base, isLoading && styles["content--hidden"]]
			.filter(Boolean)
			.join(" ");

	// without an image, the wrapper itself stands in for the accessible image role
	const accessibilityProps = src
		? {}
		: ({ role: "img", "aria-label": alt } as const);

	return (
		<div
			className={classes}
			aria-disabled={isDisabled || undefined}
			aria-busy={isLoading || undefined}
			onClick={isDisabled ? undefined : onClick}
			{...accessibilityProps}
			{...props}
		>
			{isLoading && (
				<span className={styles.spinner} aria-hidden="true" />
			)}
			{src ? (
				<img
					className={contentClasses(styles.image)}
					src={src}
					alt={alt}
				/>
			) : (
				<span
					className={contentClasses(styles.label)}
					aria-hidden="true"
				>
					{children}
				</span>
			)}
		</div>
	);
}
