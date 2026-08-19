import { create } from "zustand";
import {
	fetchTasks,
	createTask,
	updateTask,
	deleteTask,
	type Task,
} from "../apis/todo-api";
import { useToastStore } from "../../toast";

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
		const toast = useToastStore.getState();
		set({ creating: true, error: null });
		try {
			const task = await createTask({ title, priority });
			const { filter } = get();
			if (filter === "all" || filter === "todo") {
				set((s) => ({ tasks: [task, ...s.tasks], total: s.total + 1 }));
			}
			toast.success("Task created", title);
		} catch {
			set({ error: "Failed to create task" });
			toast.error("Failed to create task");
		} finally {
			set({ creating: false });
		}
	},

	toggleStatus: async (task) => {
		const toast = useToastStore.getState();
		const next =
			task.status === "done"
				? "todo"
				: task.status === "todo"
					? "in_progress"
					: "done";
		try {
			const updated = await updateTask(task.id, { status: next });
			set((s) => {
				const tasks = s.tasks.map((t) =>
					t.id === updated.id ? updated : t,
				);
				const { filter } = s;
				const visible =
					filter === "all"
						? tasks
						: tasks.filter((t) => t.status === filter);
				return { tasks: filter === "all" ? tasks : visible };
			});
			get().load();
			const label = next.replace("_", " ");
			toast.info("Status updated", `"${task.title}" → ${label}`);
		} catch {
			toast.error("Failed to update task");
		}
	},

	remove: async (id) => {
		const toast = useToastStore.getState();
		const task = get().tasks.find((t) => t.id === id);
		try {
			await deleteTask(id);
			set((s) => ({
				tasks: s.tasks.filter((t) => t.id !== id),
				total: s.total - 1,
			}));
			toast.success("Task deleted", task?.title);
		} catch {
			toast.error("Failed to delete task");
		}
	},
}));
