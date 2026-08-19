import { useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { TaskFilter } from "../../../components";
import { StatelessTaskList } from "../../../components";
import { storeToken } from "../../auth";
import { useTodoStore } from "../store/todo-store";
import type { Task } from "../apis/todo-api";

const TOKEN = "dev-fix-token";

function taskToItem(t: Task) {
	return {
		id: t.id,
		title: t.title,
		description: t.description,
		status: t.status,
		priority: t.priority,
		created_at: t.created_at,
	};
}

function LiveTodo() {
	const { tasks, loading, creating, error, filter, setFilter, load, create, toggleStatus, remove } =
		useTodoStore();

	useEffect(() => {
		storeToken(TOKEN);
		load();
	}, [load]);

	return (
		<div style={{ width: 680, height: 520, display: "flex", flexDirection: "column", border: "1px solid var(--color-border, #ddd)", borderRadius: 8, overflow: "hidden" }}>
			<div style={{ padding: "0.75rem 1rem", borderBottom: "1px solid var(--color-border, #ddd)", fontWeight: 600 }}>
				Todo (Live API)
			</div>
			<div style={{ flex: 1, overflow: "hidden" }}>
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
			</div>
		</div>
	);
}

const meta = {
	title: "Features/Todo",
	component: StatelessTaskList,
	parameters: { layout: "centered" },
} satisfies Meta<typeof StatelessTaskList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LiveAPI: Story = {
	render: () => <LiveTodo />,
};
