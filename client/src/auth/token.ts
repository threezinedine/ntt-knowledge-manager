const TOKEN_KEY = "knowledge-manager-token";

export function getStoredToken(): string | null {
	return window.localStorage.getItem(TOKEN_KEY);
}

export function storeToken(token: string): void {
	window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
	window.localStorage.removeItem(TOKEN_KEY);
}
