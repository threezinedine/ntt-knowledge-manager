import type { ButtonHTMLAttributes } from "react";
import styles from "./button.module.scss";
import type { Variant, Size } from "../common";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: Variant;
	size?: Size;
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
