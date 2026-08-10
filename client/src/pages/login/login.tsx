import { Button, Form } from "../../components";
import { useAuthStore } from "../../features/auth";
import styles from "./login.module.scss";

export function Login() {
	return (
		<div className={styles.page}>
			<Form
				className={styles.form}
				title="Log in"
				onSubmit={(values) => {
					useAuthStore.getState().login(values.token);
					window.location.hash = "#/workspace";
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
