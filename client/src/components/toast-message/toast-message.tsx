import type { HTMLAttributes } from "react";
import styles from "./toast-message.module.scss";

export type ToastVariant = "info" | "success" | "warn" | "error";
export type ToastPosition =
	| "top-left"
	| "top-right"
	| "bottom-left"
	| "bottom-right";

const VARIANT_ICONS: Record<ToastVariant, string> = {
	info: "fa-solid fa-circle-info",
	success: "fa-solid fa-circle-check",
	warn: "fa-solid fa-triangle-exclamation",
	error: "fa-solid fa-circle-xmark",
};

type ToastMessageProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
	title: string;
	description?: string;
	variant?: ToastVariant;
	position?: ToastPosition;
	onClose?: () => void;
};

export function ToastMessage({
	className,
	title,
	description,
	variant = "info",
	position = "bottom-right",
	onClose,
	...props
}: ToastMessageProps) {
	const classes = [
		styles.toast,
		styles[`toast--${variant}`],
		styles[`toast--${position}`],
		className,
	]
		.filter(Boolean)
		.join(" ");

	return (
		<div className={classes} role="alert" {...props}>
			<i className={`${VARIANT_ICONS[variant]} ${styles.icon}`} aria-hidden="true" />
			<div className={styles.body}>
				<p className={styles.title}>{title}</p>
				{description && (
					<p className={styles.description}>{description}</p>
				)}
			</div>
			{onClose && (
				<button
					className={styles.close}
					type="button"
					aria-label="Close"
					onClick={onClose}
				>
					&times;
				</button>
			)}
		</div>
	);
}
