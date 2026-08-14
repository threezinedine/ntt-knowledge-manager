import { useEffect } from "react";
import { Button } from "../../../components/button";
import { Form } from "../../../components/form";
import type { FormField } from "../../../components/form";
import { useToastStore } from "../../toast";
import { AvatarUpload } from "../../avatar-upload";
import { useSettingsStore } from "../store";
import styles from "./setting.module.scss";

export function Setting() {
	const {
		settings,
		loading,
		load,
		pendingAvatarPreview,
		avatarRemoved,
		stageAvatar,
		unstageAvatar,
		save,
	} = useSettingsStore();

	useEffect(() => {
		load();
	}, [load]);

	if (loading || !settings) return <p>Loading...</p>;

	const avatarSrc = pendingAvatarPreview
		|| (avatarRemoved ? "" : settings.avatar);

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
		<div className={styles.layout}>
			<div className={styles.avatarCol}>
				<AvatarUpload
					src={avatarSrc || undefined}
					size="xl"
					loading={loading}
					onUpload={stageAvatar}
					onRemove={unstageAvatar}
				/>
			</div>
			<div className={styles.formCol}>
				<Form
					title="Settings"
					items={fields}
					onSubmit={async (values) => {
						try {
							await save({
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
			</div>
		</div>
	);
}
