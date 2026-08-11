import type { ReactNode } from "react";
import { BookOpen } from "lucide-react";
import styles from "./stateless-navbar.module.scss";
import { Avatar } from "../avatar";
import { Button } from "../button";
import { Dropdown, type DropdownItem } from "../dropdown";

export type NavbarVariant = "default" | "brand";

type NavbarProps = {
	className?: string;
	variant?: NavbarVariant;
	isAuthenticated: boolean;
	avatarSrc?: string;
	avatarAlt?: string;
	avatarFallback?: ReactNode;
	onAvatarClick?: () => void;
	onLoginClick?: () => void;
	loginLabel?: string;
	// account menu
	accountItems?: DropdownItem[];
};

export function Navbar({
	className,
	variant = "default",
	isAuthenticated,
	avatarSrc,
	avatarAlt = "User avatar",
	avatarFallback,
	onAvatarClick,
	onLoginClick,
	loginLabel = "Log in",
	accountItems = [],
}: NavbarProps) {
	const classes = [styles.navbar, className].filter(Boolean).join(" ");

	return (
		<header className={classes}>
			<div className={styles.brand}>
				<BookOpen aria-hidden="true" size={20} />
				<span>Knowledge</span>
			</div>
			{variant === "default" && (
				<div className={styles.actions}>
					{isAuthenticated ? (
						<Dropdown items={accountItems} menuLabel="Account menu">
							<Avatar
								src={avatarSrc}
								alt={avatarAlt}
								onClick={onAvatarClick}
							>
								{avatarFallback}
							</Avatar>
						</Dropdown>
					) : (
						<Button
							variant="primary"
							size="sm"
							onClick={onLoginClick}
						>
							{loginLabel}
						</Button>
					)}
				</div>
			)}
		</header>
	);
}
