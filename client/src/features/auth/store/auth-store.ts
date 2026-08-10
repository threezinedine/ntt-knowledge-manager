import { create } from "zustand";
import { clearToken, getStoredToken, storeToken } from "../utils/token";
import { verifyTokenWithServer } from "../apis/verify";

export type AuthStatus = "checking" | "authenticated" | "unauthenticated";

type AuthState = {
	token: string | null;
	status: AuthStatus;
	login: (token: string) => void;
	logout: () => void;
	verify: () => Promise<boolean>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
	token: getStoredToken(),
	status: "checking",
	login: (token) => {
		storeToken(token);
		set({ token, status: "authenticated" });
	},
	logout: () => {
		clearToken();
		set({ token: null, status: "unauthenticated" });
	},
	verify: async () => {
		const { token } = get();
		if (!token) {
			set({ status: "unauthenticated" });
			return false;
		}

		const valid = await verifyTokenWithServer(token);
		if (valid) {
			set({ status: "authenticated" });
		} else {
			clearToken();
			set({ token: null, status: "unauthenticated" });
		}
		return valid;
	},
}));
