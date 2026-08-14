import { getStoredToken } from "../../auth";

const API_BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "";

export type SettingsData = {
	theme: "light" | "dark";
	nickname: string;
};

export type SettingsUpdate = Partial<SettingsData>;

function authHeaders(): HeadersInit {
	return {
		"Content-Type": "application/json",
		Authorization: `Bearer ${getStoredToken()}`,
	};
}

export async function fetchSettings(): Promise<SettingsData> {
	const res = await fetch(`${API_BASE_URL}/settings`, {
		headers: authHeaders(),
	});
	if (!res.ok) throw new Error("Failed to fetch settings");
	return res.json();
}

export async function updateSettings(
	data: SettingsUpdate,
): Promise<SettingsData> {
	const res = await fetch(`${API_BASE_URL}/settings`, {
		method: "PATCH",
		headers: authHeaders(),
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error("Failed to update settings");
	return res.json();
}
