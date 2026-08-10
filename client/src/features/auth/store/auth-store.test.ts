import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAuthStore } from "./auth-store";
import { verifyTokenWithServer } from "../apis/verify";

vi.mock("../apis/verify", () => ({
	verifyTokenWithServer: vi.fn(),
}));

const mockedVerify = vi.mocked(verifyTokenWithServer);

describe("auth store", () => {
	beforeEach(() => {
		window.localStorage.clear();
		useAuthStore.setState({ token: null, status: "checking" });
		mockedVerify.mockReset();
	});

	it("starts in the checking state without a token", () => {
		expect(useAuthStore.getState().status).toBe("checking");
		expect(useAuthStore.getState().token).toBeNull();
	});

	it("login stores the token and authenticates", () => {
		useAuthStore.getState().login("token-1");

		expect(useAuthStore.getState().status).toBe("authenticated");
		expect(useAuthStore.getState().token).toBe("token-1");
		expect(window.localStorage.getItem("knowledge-manager-token")).toBe(
			"token-1",
		);
	});

	it("logout clears the token and unauthenticates", () => {
		useAuthStore.getState().login("token-1");
		useAuthStore.getState().logout();

		expect(useAuthStore.getState().status).toBe("unauthenticated");
		expect(useAuthStore.getState().token).toBeNull();
		expect(
			window.localStorage.getItem("knowledge-manager-token"),
		).toBeNull();
	});

	it("verify unauthenticates when there is no token", async () => {
		const result = await useAuthStore.getState().verify();

		expect(result).toBe(false);
		expect(useAuthStore.getState().status).toBe("unauthenticated");
	});

	it("verify authenticates a valid token", async () => {
		useAuthStore.getState().login("token-1");
		mockedVerify.mockResolvedValue(true);

		const result = await useAuthStore.getState().verify();

		expect(result).toBe(true);
		expect(useAuthStore.getState().status).toBe("authenticated");
	});

	it("verify clears an invalid token and unauthenticates", async () => {
		useAuthStore.getState().login("token-1");
		mockedVerify.mockResolvedValue(false);

		const result = await useAuthStore.getState().verify();

		expect(result).toBe(false);
		expect(useAuthStore.getState().status).toBe("unauthenticated");
		expect(useAuthStore.getState().token).toBeNull();
		expect(
			window.localStorage.getItem("knowledge-manager-token"),
		).toBeNull();
	});
});
