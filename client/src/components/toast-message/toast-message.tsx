import { useEffect, useRef, type ComponentType, type HTMLAttributes, type SVGAttributes } from "react";
import { InfoIcon, SuccessIcon, WarnIcon, ErrorIcon } from "../../icons";
import styles from "./toast-message.module.scss";

export type ToastVariant = "info" | "success" | "warn" | "error";
export type ToastPosition =
	| "top-left"
	| "top-right"
	| "bottom-left"
	| "bottom-right";

const VARIANT_ICONS: Record<ToastVariant, ComponentType<SVGAttributes<SVGSVGElement>>> = {
	info: InfoIcon,
	success: SuccessIcon,
	warn: WarnIcon,
	error: ErrorIcon,
};

type ToastMessageProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
	title: string;
	description?: string;
	variant?: ToastVariant;
	position?: ToastPosition;
	/** Auto-dismiss duration in milliseconds. When set, a progress bar shrinks and onClose fires at the end. */
	duration?: number;
	onClose?: () => void;
};

export function ToastMessage({
	className,
	title,
	description,
	variant = "info",
	position = "bottom-right",
	duration,
	onClose,
	...props
}: ToastMessageProps) {
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		if (duration == null || !onClose) return;

		timerRef.current = setTimeout(onClose, duration);

		return () => {
			if (timerRef.current) clearTimeout(timerRef.current);
		};
	}, [duration, onClose]);

	const classes = [
		styles.toast,
		styles[`toast--${variant}`],
		styles[`toast--${position}`],
		className,
	]
		.filter(Boolean)
		.join(" ");

	const Icon = VARIANT_ICONS[variant];

	return (
		<div className={classes} role="alert" {...props}>
			<Icon className={styles.icon} aria-hidden="true" />
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
			{duration != null && (
				<div
					className={styles.progress}
					style={{ animationDuration: `${duration}ms` }}
					data-testid="toast-progress"
				/>
			)}
		</div>
	);
}
