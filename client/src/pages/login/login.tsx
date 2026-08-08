import { Button, Form } from "../../components";
import styles from "./login.module.scss";

export function Login() {
	return (
		<div className={styles.page}>
			<Form
				className={styles.form}
				title="Log in"
				onSubmit={() => {
					// Server auth is not implemented yet; for now a valid
					// submission simply navigates back to the home page.
					window.location.hash = "#/";
				}}
				items={[
					{
						id: "token",
						label: "Token",
						type: "password",
						placeholder: "Paste your access token",
						required: true,
					},
				]}
			>
				<Button type="submit">Log in</Button>
			</Form>
			<a className={styles.back} href="#/">
				← Back to home
			</a>
		</div>
	);
}
