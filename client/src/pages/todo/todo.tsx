import { Navbar } from "../../features";
import { Todo } from "../../features/todo";
import styles from "./todo.module.scss";

export function TodoPage() {
	return (
		<div className={styles.page}>
			<Navbar />
			<main className={styles.content}>
				<Todo />
			</main>
		</div>
	);
}
