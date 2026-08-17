import { create } from "zustand";
import {
	fetchTasks,
	createTask,
	updateTask,
	deleteTask,
	type Task,
} from "../apis/todo-api";

type Filter = "all" | "todo" | "in_progress" | "done";

type TodoState = {
	tasks: Task[];
	total: number;
	loading: boolean;
	creating: boolean;
	error: string | null;
	filter: Filter;
	setFilter: (filter: Filter) => void;
	load: () => Promise<void>;
	create: (title: string, priority: string) => Promise<void>;
	toggleStatus: (task: Task) => Promise<void>;
	remove: (id: number) => Promise<void>;
};

export const useTodoStore = create<TodoState>((set, get) => ({
	tasks: [],
	total: 0,
	loading: false,
	creating: false,
	error: null,
	filter: "all",

	setFilter: (filter) => {
		set({ filter });
		get().load();
	},

	load: async () => {
		const { filter } = get();
		set({ loading: true, error: null });
		try {
			const page = await fetchTasks({
				status: filter === "all" ? undefined : filter,
				limit: 100,
			});
			set({ tasks: page.items, total: page.total, loading: false });
		} catch {
			set({ loading: false, error: "Failed to load tasks" });
		}
	},

	create: async (title, priority) => {
		set({ creating: true, error: null });
		try {
			const task = await createTask({ title, priority });
			const { filter } = get();
			if (filter === "all" || filter === "todo") {
				set((s) => ({ tasks: [task, ...s.tasks], total: s.total + 1 }));
			}
		} catch {
			set({ error: "Failed to create task" });
		} finally {
			set({ creating: false });
		}
	},

	toggleStatus: async (task) => {
		const next =
			task.status === "done"
				? "todo"
				: task.status === "todo"
					? "in_progress"
					: "done";
		const updated = await updateTask(task.id, { status: next });
		set((s) => {
			const tasks = s.tasks.map((t) => (t.id === updated.id ? updated : t));
			const { filter } = s;
			const visible =
				filter === "all" ? tasks : tasks.filter((t) => t.status === filter);
			return { tasks: filter === "all" ? tasks : visible };
		});
		// reload to get accurate list for the active filter
		get().load();
	},

	remove: async (id) => {
		await deleteTask(id);
		set((s) => ({
			tasks: s.tasks.filter((t) => t.id !== id),
			total: s.total - 1,
		}));
	},
}));
