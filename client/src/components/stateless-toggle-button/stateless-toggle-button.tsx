import type { ButtonHTMLAttributes } from "react";
import styles from "./stateless-toggle-button.module.scss";
import type { Size } from "../common";

type ToggleButtonProps = Omit<
	ButtonHTMLAttributes<HTMLButtonElement>,
	"onClick" | "value" | "children"
> & {
	value: boolean;
	onValueChanged: (value: boolean) => void;
	size?: Size;
	isLoading?: boolean;
	/** Font Awesome class(es) shown when value is true, e.g. "fa-solid fa-toggle-on". */
	trueIcon: string;
	/** Font Awesome class(es) shown when value is false, e.g. "fa-solid fa-toggle-off". */
	falseIcon: string;
};

export function ToggleButton({
	className,
	type = "button",
	size = "md",
	isLoading = false,
	trueIcon,
	falseIcon,
	disabled,
	value,
	onValueChanged,
	...props
}: ToggleButtonProps) {
	const icon = value ? trueIcon : falseIcon;

	const classes = [
		styles.toggle,
		styles[`toggle--${size}`],
		isLoading && styles["toggle--loading"],
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
			aria-pressed={value}
			onClick={() => onValueChanged(!value)}
			{...props}
		>
			{isLoading && (
				<span className={styles.spinner} aria-hidden="true" />
			)}
			<i
				className={[icon, isLoading && styles["icon--hidden"]]
					.filter(Boolean)
					.join(" ")}
				aria-hidden="true"
			/>
		</button>
	);
}
