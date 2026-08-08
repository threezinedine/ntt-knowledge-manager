import styles from "./not-found.module.scss";

export function NotFound() {
	return (
		<div className={styles.page}>
			<p className={styles.code} aria-hidden="true">
				404
			</p>
			<h1 className={styles.title}>Page not found</h1>
			<p className={styles.message}>
				The page you're looking for doesn't exist or was moved.
			</p>
			<a className={styles.link} href="#/">
				← Back to home
			</a>
		</div>
	);
}
