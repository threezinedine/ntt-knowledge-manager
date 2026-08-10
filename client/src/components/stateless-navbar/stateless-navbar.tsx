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
	onSettingsClick?: () => void;
	onWorkspaceClick?: () => void;
	onLogoutClick?: () => void;
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
	onSettingsClick,
	onWorkspaceClick,
	onLogoutClick,
}: NavbarProps) {
	const classes = [styles.navbar, className].filter(Boolean).join(" ");

	const accountItems: DropdownItem[] = [
		{
			id: "settings",
			label: "Settings",
			icon: "fa-solid fa-gear",
			onSelect: onSettingsClick,
		},
		{
			id: "workspace",
			label: "Workspace",
			icon: "fa-solid fa-diagram-project",
			onSelect: onWorkspaceClick,
		},
		{ id: "account-separator", separator: true },
		{
			id: "logout",
			label: "Logout",
			icon: "fa-solid fa-right-from-bracket",
			danger: true,
			onSelect: onLogoutClick,
		},
	];

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
