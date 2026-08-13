import { useRef, useEffect, useSyncExternalStore } from "react";
import styles from "./editor.module.scss";

function subscribeToTheme(callback: () => void) {
	const observer = new MutationObserver(callback);
	observer.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ["data-theme"],
	});
	return () => observer.disconnect();
}

function getThemeSnapshot() {
	return document.documentElement.getAttribute("data-theme") ?? "light";
}

type EditorProps = {
	className?: string;
	defaultValue?: string;
	vimMode?: boolean;
	onChange?: (value: string) => void;
};

export function Editor({
	className,
	defaultValue = "",
	vimMode = true,
	onChange,
}: EditorProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const viewRef = useRef<unknown>(null);
	const theme = useSyncExternalStore(subscribeToTheme, getThemeSnapshot);
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
			if (theme === "dark") extensions.push(oneDark);

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
	}, [vimMode, theme]);

	return <div ref={containerRef} className={classes} data-testid="editor" />;
}
