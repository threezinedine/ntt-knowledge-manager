import type { ButtonHTMLAttributes } from "react";
import styles from "./button.module.scss";

export type ButtonVariant =
	| "primary"
	| "secondary"
	| "outline"
	| "ghost"
	| "danger"
	| "link";

export type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: ButtonVariant;
	size?: ButtonSize;
};

export function Button({
	className,
	type = "button",
	variant = "primary",
	size = "md",
	...props
}: ButtonProps) {
	const classes = [
		styles.button,
		styles[`button--${variant}`],
		styles[`button--${size}`],
		className,
	]
		.filter(Boolean)
		.join(" ");

	return <button className={classes} type={type} {...props} />;
}
