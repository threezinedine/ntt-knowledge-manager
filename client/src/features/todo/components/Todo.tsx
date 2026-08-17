import { useEffect } from "react";
import { StatelessTaskList } from "../../../components";
import type { TaskItem, TaskFilter } from "../../../components";
import { useTodoStore } from "../store/todo-store";
import type { Task } from "../apis/todo-api";

function taskToItem(t: Task): TaskItem {
	return {
		id: t.id,
		title: t.title,
		description: t.description,
		status: t.status,
		priority: t.priority,
		created_at: t.created_at,
	};
}

export function Todo() {
	const { tasks, loading, creating, error, filter, setFilter, load, create, toggleStatus, remove } =
		useTodoStore();

	useEffect(() => {
		load();
	}, [load]);

	return (
		<StatelessTaskList
			tasks={tasks.map(taskToItem)}
			loading={loading}
			creating={creating}
			error={error}
			filter={filter as TaskFilter}
			onFilterChange={(f) => setFilter(f as TaskFilter)}
			onCreate={create}
			onToggleStatus={(item) => {
				const task = tasks.find((t) => t.id === item.id);
				if (task) toggleStatus(task);
			}}
			onDelete={remove}
		/>
	);
}
