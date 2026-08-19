import { getStoredToken } from "../../auth";

const API_BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "";

export type TaskCategory = {
	id: number;
	name: string;
	color: string;
};

export type Task = {
	id: number;
	title: string;
	description: string;
	status: "todo" | "in_progress" | "done";
	priority: "low" | "medium" | "high";
	due_date: string | null;
	completed_at: string | null;
	template_id: number | null;
	categories: TaskCategory[];
	created_at: string;
	updated_at: string;
};

export type TaskPage = {
	items: Task[];
	total: number;
	limit: number;
	offset: number;
};

export type TaskCreate = {
	title: string;
	description?: string;
	status?: string;
	priority?: string;
	due_date?: string | null;
	category_ids?: number[];
};

export type TaskUpdate = Partial<TaskCreate & { status: string }>;

function authHeaders(): HeadersInit {
	return {
		"Content-Type": "application/json",
		Authorization: `Bearer ${getStoredToken()}`,
	};
}

export async function fetchTasks(params?: {
	q?: string;
	status?: string;
	priority?: string;
	sort?: string;
	limit?: number;
	offset?: number;
}): Promise<TaskPage> {
	const query = new URLSearchParams();
	if (params?.q) query.set("q", params.q);
	if (params?.status) query.set("status", params.status);
	if (params?.priority) query.set("priority", params.priority);
	if (params?.sort) query.set("sort", params.sort);
	if (params?.limit != null) query.set("limit", String(params.limit));
	if (params?.offset != null) query.set("offset", String(params.offset));
	const qs = query.toString();
	const res = await fetch(`${API_BASE_URL}/todos/tasks${qs ? `?${qs}` : ""}`, {
		headers: authHeaders(),
	});
	if (!res.ok) throw new Error("Failed to fetch tasks");
	return res.json();
}

export async function createTask(data: TaskCreate): Promise<Task> {
	const res = await fetch(`${API_BASE_URL}/todos/tasks`, {
		method: "POST",
		headers: authHeaders(),
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error("Failed to create task");
	return res.json();
}

export async function updateTask(id: number, data: TaskUpdate): Promise<Task> {
	const res = await fetch(`${API_BASE_URL}/todos/tasks/${id}`, {
		method: "PATCH",
		headers: authHeaders(),
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error("Failed to update task");
	return res.json();
}

export async function deleteTask(id: number): Promise<void> {
	const res = await fetch(`${API_BASE_URL}/todos/tasks/${id}`, {
		method: "DELETE",
		headers: authHeaders(),
	});
	if (!res.ok) throw new Error("Failed to delete task");
}
