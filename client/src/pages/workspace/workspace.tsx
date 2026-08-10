import { Navbar } from "../../features";
import styles from "./workspace.module.scss";

export function Workspace() {
	return (
		<div className={styles.page}>
			<Navbar className={styles.nav} />
			<main className={styles.content}>
				<h1>Workspace</h1>
			</main>
		</div>
	);
}
