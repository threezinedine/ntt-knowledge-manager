import { Navbar, Setting } from "../../features";
import styles from "./settings.module.scss";

export function Settings() {
	return (
		<div className={styles.page}>
			<Navbar />
			<main className={styles.content}>
				<h1>Settings</h1>
				<Setting />
			</main>
		</div>
	);
}
