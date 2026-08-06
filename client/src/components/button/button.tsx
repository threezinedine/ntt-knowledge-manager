import type { ButtonHTMLAttributes } from "react";
import styles from "./button.module.scss";
import type { Variant, Size } from "../common";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: Variant;
	size?: Size;
	isLoading?: boolean;
};

export function Button({
	className,
	type = "button",
	variant = "primary",
	size = "md",
	isLoading = false,
	disabled,
	children,
	...props
}: ButtonProps) {
	const classes = [
		styles.button,
		styles[`button--${variant}`],
		styles[`button--${size}`],
		isLoading && styles["button--loading"],
		className,
	]
		.filter(Boolean)
		.join(" ");

	return (
		<button
			className={classes}
			type={type}
			disabled={disabled || isLoading}
			aria-busy={isLoading}
			{...props}
		>
			{isLoading && (
				<span className={styles.spinner} aria-hidden="true" />
			)}
			{children}
		</button>
	);
}
