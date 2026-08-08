const API_BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "";

/**
 * Verifies a login token with the server.
 *
 * The server exposes `GET /login-tokens/{token}` -> `{ "valid": boolean }`.
 * `VITE_API_URL` points at the backend (e.g. http://localhost:8000 in dev);
 * in production the client and API share an origin, so the relative path works.
 */
export async function verifyTokenWithServer(token: string): Promise<boolean> {
	try {
		const response = await fetch(
			`${API_BASE_URL}/login-tokens/${encodeURIComponent(token)}`,
		);
		if (!response.ok) {
			return false;
		}
		const data: { valid?: boolean } = await response.json();
		return data.valid === true;
	} catch {
		return false;
	}
}
