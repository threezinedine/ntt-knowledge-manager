import { useEffect } from "react";
import { Button } from "../../../components/button";
import { Form } from "../../../components/form";
import type { FormField } from "../../../components/form";
import { useToastStore } from "../../toast";
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
			onSubmit={async (values) => {
				try {
					await update({
						theme: values.theme as "light" | "dark",
						nickname: values.nickname,
					});
					useToastStore.getState().success("Settings saved");
				} catch {
					useToastStore.getState().error("Failed to save settings");
				}
			}}
		>
			<Button type="submit">Save</Button>
		</Form>
	);
}
