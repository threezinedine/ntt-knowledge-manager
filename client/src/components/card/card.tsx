import type { HTMLAttributes, KeyboardEvent, ReactNode } from "react";
import { Avatar } from "../avatar";
import styles from "./card.module.scss";

type CardProps = Omit<HTMLAttributes<HTMLElement>, "title" | "onClick"> & {
	/** Avatar image URL. When omitted, a placeholder avatar is shown. */
	avatarSrc?: string;
	/** Accessible label for the avatar. */
	avatarAlt?: string;
	/** Fallback content shown inside the placeholder avatar. Defaults to the first letter of the title. */
	avatarFallback?: ReactNode;
	title: string;
	/** Short description; truncated with "..." when it exceeds the max length. */
	description?: string;
	/** Maximum length of the description before truncation. */
	descriptionMaxLength?: number;
	/** Called when the card is activated (click, Enter, or Space). */
	onClick?: () => void;
};

function truncate(text: string, maxLength: number): string {
	if (text.length <= maxLength) {
		return text;
	}
	return `${text.slice(0, maxLength).trimEnd()}...`;
}

export function Card({
	className,
	avatarSrc,
	avatarAlt = "Note avatar",
	avatarFallback,
	title,
	description,
	descriptionMaxLength = 80,
	onClick,
	...props
}: CardProps) {
	const isClickable = Boolean(onClick);

	const classes = [
		styles.card,
		isClickable && styles["card--clickable"],
		className,
	]
		.filter(Boolean)
		.join(" ");
	const text = description
		? truncate(description, descriptionMaxLength)
		: undefined;

	const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			onClick?.();
		}
	};

	return (
		<article
			className={classes}
			role={isClickable ? "button" : undefined}
			tabIndex={isClickable ? 0 : undefined}
			onClick={onClick}
			onKeyDown={isClickable ? handleKeyDown : undefined}
			{...props}
		>
			<Avatar src={avatarSrc} alt={avatarAlt} size="md">
				{avatarFallback ?? title.charAt(0).toUpperCase()}
			</Avatar>
			<div className={styles.body}>
				<h3 className={styles.title}>{title}</h3>
				{text && <p className={styles.description}>{text}</p>}
			</div>
		</article>
	);
}
