import { useEffect, useRef, type ReactNode } from "react";
import { User } from "lucide-react";
import {
	Button,
	Modal,
	type ModalRef,
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
	const logoutModalRef = useRef<ModalRef>(null);

	// resolve an unverified stored token so the right control is shown
	useEffect(() => {
		if (variant !== "brand" && token && status === "checking") {
			verify();
		}
	}, [variant, token, status, verify]);

	// a stored token counts as signed in until verification says otherwise
	const isAuthenticated =
		status === "authenticated" || (status === "checking" && token !== null);

	const handleLogoutConfirm = () => {
		logoutModalRef.current?.close();
		logout();
		window.location.hash = "#/";
	};

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
				logoutModalRef.current?.open();
			},
		},
	];

	return (
		<>
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
			<Modal ref={logoutModalRef}>
				<p>Are you sure you want to log out?</p>
				<div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
					<Button
						variant="outline"
						size="sm"
						onClick={() => logoutModalRef.current?.close()}
					>
						Cancel
					</Button>
					<Button
						variant="danger"
						size="sm"
						onClick={handleLogoutConfirm}
					>
						Yes
					</Button>
				</div>
			</Modal>
		</>
	);
}
