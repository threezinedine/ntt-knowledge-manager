import { useEffect, type ReactNode } from "react";
import { useAuthStore } from "../store/auth-store";

type ProtectedRouteProps = {
	/** Content rendered only after the stored token is verified with the server. */
	children: ReactNode;
	/** Hash route to send the user to when there is no valid token. */
	redirectTo?: string;
};

/**
 * Guards a route: verifies the stored token with the server (via the auth
 * store) and only then renders `children`. Without a valid token the user is
 * redirected to `redirectTo` (login by default). Reusable for any protected
 * page.
 */
export function ProtectedRoute({
	children,
	redirectTo = "login",
}: ProtectedRouteProps) {
	const status = useAuthStore((state) => state.status);
	const verify = useAuthStore((state) => state.verify);

	useEffect(() => {
		verify();
	}, [verify]);

	useEffect(() => {
		if (status === "unauthenticated") {
			window.location.hash = `#/${redirectTo}`;
		}
	}, [status, redirectTo]);

	if (status === "checking") {
		return <div>Checking…</div>;
	}

	if (status === "unauthenticated") {
		return null;
	}

	return children;
}
