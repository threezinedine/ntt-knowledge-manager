import type { ReactNode } from "react";
import { BookOpen } from "lucide-react";
import styles from "./stateless-navbar.module.scss";
import { Avatar } from "../avatar";
import { Button } from "../button";

type NavbarProps = {
	className?: string;
	isAuthenticated: boolean;
	avatarSrc?: string;
	avatarAlt?: string;
	avatarFallback?: ReactNode;
	onAvatarClick?: () => void;
	onLoginClick?: () => void;
	loginLabel?: string;
};

export function Navbar({
	className,
	isAuthenticated,
	avatarSrc,
	avatarAlt = "User avatar",
	avatarFallback,
	onAvatarClick,
	onLoginClick,
	loginLabel = "Log in",
}: NavbarProps) {
	const classes = [styles.navbar, className].filter(Boolean).join(" ");

	return (
		<header className={classes}>
			<div className={styles.brand}>
				<BookOpen aria-hidden="true" size={20} />
				<span>Knowledge</span>
			</div>
			<div className={styles.actions}>
				{isAuthenticated ? (
					<Avatar
						src={avatarSrc}
						alt={avatarAlt}
						onClick={onAvatarClick}
					>
						{avatarFallback}
					</Avatar>
				) : (
					<Button variant="primary" size="sm" onClick={onLoginClick}>
						{loginLabel}
					</Button>
				)}
			</div>
		</header>
	);
}
