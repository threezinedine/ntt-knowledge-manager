import { getStoredToken } from "../../auth";

const API_BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "";

function authHeaders(): HeadersInit {
	return {
		Authorization: `Bearer ${getStoredToken()}`,
	};
}

export async function uploadAvatar(file: File): Promise<string> {
	const formData = new FormData();
	formData.append("file", file);

	const res = await fetch(`${API_BASE_URL}/settings/avatar`, {
		method: "POST",
		headers: authHeaders(),
		body: formData,
	});
	if (!res.ok) throw new Error("Failed to upload avatar");
	const data = await res.json();
	return data.avatar as string;
}

export async function deleteAvatar(): Promise<void> {
	const res = await fetch(`${API_BASE_URL}/settings/avatar`, {
		method: "DELETE",
		headers: authHeaders(),
	});
	if (!res.ok) throw new Error("Failed to delete avatar");
}

export async function fetchAvatar(): Promise<string> {
	const res = await fetch(`${API_BASE_URL}/settings`, {
		headers: { ...authHeaders(), "Content-Type": "application/json" },
	});
	if (!res.ok) throw new Error("Failed to fetch settings");
	const data = await res.json();
	return (data.avatar as string) ?? "";
}
