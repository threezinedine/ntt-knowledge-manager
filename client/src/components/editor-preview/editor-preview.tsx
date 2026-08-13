import { useMemo } from "react";
import { marked } from "marked";
import styles from "./editor-preview.module.scss";

type EditorPreviewProps = {
	className?: string;
	value: string;
};

export function EditorPreview({ className, value }: EditorPreviewProps) {
	const html = useMemo(() => {
		return marked.parse(value, { async: false }) as string;
	}, [value]);

	const classes = [styles.preview, className].filter(Boolean).join(" ");

	return (
		<div
			className={classes}
			data-testid="editor-preview"
			dangerouslySetInnerHTML={{ __html: html }}
		/>
	);
}
