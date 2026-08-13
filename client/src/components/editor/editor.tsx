import { useRef, useEffect } from "react";
import styles from "./editor.module.scss";

type EditorProps = {
	className?: string;
	defaultValue?: string;
	vimMode?: boolean;
	darkTheme?: boolean;
	onChange?: (value: string) => void;
};

export function Editor({
	className,
	defaultValue = "",
	vimMode = true,
	darkTheme = false,
	onChange,
}: EditorProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const viewRef = useRef<unknown>(null);
	const classes = [styles.editor, className].filter(Boolean).join(" ");

	useEffect(() => {
		if (!containerRef.current) return;

		let destroyed = false;

		(async () => {
			const [
				{ EditorView, keymap },
				{ EditorState },
				{ markdown },
				{ languages },
				{ oneDark },
				{ vim },
				{ basicSetup },
				{ indentWithTab },
			] = await Promise.all([
				import("@codemirror/view"),
				import("@codemirror/state"),
				import("@codemirror/lang-markdown"),
				import("@codemirror/language-data"),
				import("@codemirror/theme-one-dark"),
				import("@replit/codemirror-vim"),
				import("codemirror"),
				import("@codemirror/commands"),
			]);

			if (destroyed || !containerRef.current) return;

			const extensions = [
				basicSetup,
				markdown({ codeLanguages: languages }),
				keymap.of([indentWithTab]),
				EditorView.updateListener.of((update) => {
					if (update.docChanged) {
						onChange?.(update.state.doc.toString());
					}
				}),
			];

			if (vimMode) extensions.unshift(vim());
			if (darkTheme) extensions.push(oneDark);

			const state = EditorState.create({
				doc: defaultValue,
				extensions,
			});

			const view = new EditorView({
				state,
				parent: containerRef.current,
			});

			viewRef.current = view;
		})();

		return () => {
			destroyed = true;
			if (viewRef.current) {
				(viewRef.current as { destroy: () => void }).destroy();
				viewRef.current = null;
			}
		};
	}, [vimMode, darkTheme]);

	return <div ref={containerRef} className={classes} data-testid="editor" />;
}
