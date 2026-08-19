import { useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import styles from "./stateless-task-list.module.scss";

export type TaskItem = {
	id: number;
	title: string;
	description: string;
	status: "todo" | "in_progress" | "done";
	priority: "low" | "medium" | "high";
	created_at: string;
};

export type TaskFilter = "all" | "todo" | "in_progress" | "done";

type Props = {
	tasks: TaskItem[];
	loading: boolean;
	creating: boolean;
	error: string | null;
	filter: TaskFilter;
	onFilterChange: (f: TaskFilter) => void;
	onCreate: (title: string, priority: string) => void;
	onToggleStatus: (task: TaskItem) => void;
	onDelete: (id: number) => void;
};

const FILTERS: { value: TaskFilter; label: string }[] = [
	{ value: "all", label: "All" },
	{ value: "todo", label: "Todo" },
	{ value: "in_progress", label: "In progress" },
	{ value: "done", label: "Done" },
];

const PRIORITY_COLORS: Record<string, string> = {
	high: "#ef4444",
	medium: "#f59e0b",
	low: "#22c55e",
};

const STATUS_ICONS: Record<string, string> = {
	todo: "○",
	in_progress: "◑",
	done: "●",
};

export function StatelessTaskList({
	tasks,
	loading,
	creating,
	error,
	filter,
	onFilterChange,
	onCreate,
	onToggleStatus,
	onDelete,
}: Props) {
	const [title, setTitle] = useState("");
	const [priority, setPriority] = useState("medium");
	const inputRef = useRef<HTMLInputElement>(null);

	const handleCreate = () => {
		const trimmed = title.trim();
		if (!trimmed) return;
		onCreate(trimmed, priority);
		setTitle("");
		inputRef.current?.focus();
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") handleCreate();
	};

	return (
		<div className={styles.container}>
			{/* Create form */}
			<div className={styles.form}>
				<input
					ref={inputRef}
					className={styles.titleInput}
					type="text"
					placeholder="New task…"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					onKeyDown={handleKeyDown}
					disabled={creating}
				/>
				<select
					className={styles.prioritySelect}
					value={priority}
					onChange={(e) => setPriority(e.target.value)}
					disabled={creating}
				>
					<option value="high">High</option>
					<option value="medium">Medium</option>
					<option value="low">Low</option>
				</select>
				<button
					className={styles.addBtn}
					onClick={handleCreate}
					disabled={creating || !title.trim()}
				>
					{creating ? "Adding…" : "Add"}
				</button>
			</div>

			{/* Filter tabs */}
			<div className={styles.filters} role="tablist">
				{FILTERS.map((f) => (
					<button
						key={f.value}
						role="tab"
						aria-selected={filter === f.value}
						className={`${styles.filterTab} ${filter === f.value ? styles.filterTabActive : ""}`}
						onClick={() => onFilterChange(f.value)}
					>
						{f.label}
					</button>
				))}
			</div>

			{/* Error */}
			{error && <p className={styles.error}>{error}</p>}

			{/* Task list */}
			{loading ? (
				<div className={styles.loading}>Loading…</div>
			) : tasks.length === 0 ? (
				<div className={styles.empty}>No tasks yet. Add one above!</div>
			) : (
				<ul className={styles.list}>
					{tasks.map((task) => (
						<li key={task.id} className={`${styles.item} ${task.status === "done" ? styles.itemDone : ""}`}>
							<button
								className={styles.statusBtn}
								onClick={() => onToggleStatus(task)}
								aria-label={`Status: ${task.status}`}
								title="Click to advance status"
							>
								{STATUS_ICONS[task.status]}
							</button>

							<span className={styles.itemTitle}>{task.title}</span>

							<span
								className={styles.priorityBadge}
								style={{ color: PRIORITY_COLORS[task.priority] }}
							>
								{task.priority}
							</span>

							<button
								className={styles.deleteBtn}
								onClick={() => onDelete(task.id)}
								aria-label="Delete task"
							>
								✕
							</button>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
