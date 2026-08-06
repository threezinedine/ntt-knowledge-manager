import type { ButtonHTMLAttributes } from "react";
import styles from "./button.module.scss";
import type { Variant, Size } from "../common";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: Variant;
	size?: Size;
	isLoading?: boolean;
	/** Font Awesome class(es), e.g. "fa-solid fa-star". Omit to render no icon. */
	icon?: string;
};

export function Button({
	className,
	type = "button",
	variant = "primary",
	size = "md",
	isLoading = false,
	icon,
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
			<span
				className={[
					styles.content,
					isLoading && styles["content--hidden"],
				]
					.filter(Boolean)
					.join(" ")}
			>
				{icon && <i className={icon} aria-hidden="true" />}
				{children}
			</span>
		</button>
	);
}
