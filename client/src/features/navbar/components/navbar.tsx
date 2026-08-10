import { useEffect, type ReactNode } from "react";
import { User } from "lucide-react";
import { StatelessNavbar, type NavbarVariant } from "../../../components";
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

	// resolve an unverified stored token so the right control is shown
	useEffect(() => {
		if (variant !== "brand" && token && status === "checking") {
			verify();
		}
	}, [variant, token, status, verify]);

	// a stored token counts as signed in until verification says otherwise
	const isAuthenticated =
		status === "authenticated" || (status === "checking" && token !== null);

	return (
		<StatelessNavbar
			className={className}
			variant={variant}
			isAuthenticated={isAuthenticated}
			avatarAlt={avatarAlt}
			avatarFallback={avatarFallback}
			loginLabel={loginLabel}
			onLoginClick={() => {
				window.location.hash = "#/login";
			}}
		/>
	);
}
