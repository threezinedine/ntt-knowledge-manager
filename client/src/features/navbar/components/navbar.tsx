import { useEffect, type ReactNode } from "react";
import { User } from "lucide-react";
import {
	StatelessNavbar,
	type DropdownItem,
	type NavbarVariant,
} from "../../../components";
import { useAuthStore } from "../../auth";

type NavbarProps = {
	className?: string;
	variant?: NavbarVariant;
	loginLabel?: string;
	avatarAlt?: string;
	avatarFallback?: ReactNode;
};

export function Navbar({
	className,
	variant = "default",
	loginLabel,
	avatarAlt = "User avatar",
	avatarFallback = <User aria-hidden="true" size={16} />,
}: NavbarProps) {
	const token = useAuthStore((state) => state.token);
	const status = useAuthStore((state) => state.status);
	const verify = useAuthStore((state) => state.verify);
	const logout = useAuthStore((state) => state.logout);

	// resolve an unverified stored token so the right control is shown
	useEffect(() => {
		if (variant !== "brand" && token && status === "checking") {
			verify();
		}
	}, [variant, token, status, verify]);

	// a stored token counts as signed in until verification says otherwise
	const isAuthenticated =
		status === "authenticated" || (status === "checking" && token !== null);

	const accountItems: DropdownItem[] = [
		{
			id: "settings",
			label: "Settings",
			icon: "fa-solid fa-gear",
			onSelect: () => {
				window.location.hash = "#/settings";
			},
		},
		{
			id: "workspace",
			label: "Workspace",
			icon: "fa-solid fa-diagram-project",
			onSelect: () => {
				window.location.hash = "#/workspace";
			},
		},
		{ id: "account-separator", separator: true },
		{
			id: "logout",
			label: "Logout",
			icon: "fa-solid fa-right-from-bracket",
			danger: true,
			onSelect: () => {
				logout();
				window.location.hash = "#/";
			},
		},
	];

	return (
		<StatelessNavbar
			className={className}
			variant={variant}
			isAuthenticated={isAuthenticated}
			avatarAlt={avatarAlt}
			avatarFallback={avatarFallback}
			loginLabel={loginLabel}
			accountItems={accountItems}
			onLoginClick={() => {
				window.location.hash = "#/login";
			}}
		/>
	);
}
