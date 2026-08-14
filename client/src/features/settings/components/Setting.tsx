import { useEffect } from "react";
import { Form } from "../../../components/form";
import type { FormField } from "../../../components/form";
import { useSettingsStore } from "../store";

export function Setting() {
	const { settings, loading, load, update } = useSettingsStore();

	useEffect(() => {
		load();
	}, [load]);

	if (loading || !settings) return <p>Loading...</p>;

	const fields: FormField[] = [
		{
			id: "theme",
			label: "Theme",
			type: "select",
			defaultValue: settings.theme,
			options: [
				{ value: "light", label: "Light" },
				{ value: "dark", label: "Dark" },
			],
		},
		{
			id: "nickname",
			label: "Nickname",
			defaultValue: settings.nickname,
		},
	];

	return (
		<Form
			title="Settings"
			items={fields}
			onSubmit={(values) =>
				update({
					theme: values.theme as "light" | "dark",
					nickname: values.nickname,
				})
			}
		>
			<button type="submit">Save</button>
		</Form>
	);
}
