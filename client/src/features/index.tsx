/* eslint-disable react/only-export-components -- barrel: re-exports hooks and stores too */
export {
	ProtectedRoute,
	useAuthStore,
	getStoredToken,
	storeToken,
	clearToken,
	verifyTokenWithServer,
} from "./auth";
export type { AuthStatus } from "./auth";
export { ThemeProvider, useTheme, useThemeStore } from "./theme";
export type { ThemeName } from "./theme";
