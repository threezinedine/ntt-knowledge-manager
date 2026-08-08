import { useEffect, useState, type ReactNode } from "react";
import { clearToken, getStoredToken } from "./token";
import { verifyTokenWithServer } from "./verify";

type ProtectedRouteProps = {
	/** Content rendered only after the stored token is verified with the server. */
	children: ReactNode;
	/** Hash route to send the user to when there is no valid token. */
	redirectTo?: string;
};

type AuthState = "checking" | "authenticated" | "unauthenticated";

/**
 * Guards a route: reads the stored token, verifies it with the server, and only
 * then renders `children`. Without a valid token the user is redirected to
 * `redirectTo` (login by default). Reusable for any protected page.
 */
export function ProtectedRoute({
	children,
	redirectTo = "login",
}: ProtectedRouteProps) {
	const [state, setState] = useState<AuthState>("checking");

	useEffect(() => {
		let cancelled = false;

		const check = async () => {
			const token = getStoredToken();
			if (!token) {
				setState("unauthenticated");
				return;
			}

			const valid = await verifyTokenWithServer(token);
			if (cancelled) {
				return;
			}
			if (valid) {
				setState("authenticated");
			} else {
				clearToken();
				setState("unauthenticated");
			}
		};

		check();

		return () => {
			cancelled = true;
		};
	}, []);

	useEffect(() => {
		if (state === "unauthenticated") {
			window.location.hash = `#/${redirectTo}`;
		}
	}, [state, redirectTo]);

	if (state === "checking") {
		return <div>Checking…</div>;
	}

	if (state === "unauthenticated") {
		return null;
	}

	return children;
}
