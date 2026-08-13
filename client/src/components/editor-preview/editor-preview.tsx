import { useMemo, useCallback, type MouseEvent } from "react";
import { marked } from "marked";
import styles from "./editor-preview.module.scss";

const wikiLinkExtension: marked.MarkedExtension = {
	extensions: [
		{
			name: "wikiLink",
			level: "inline",
			start(src) {
				return src.indexOf("[[");
			},
			tokenizer(src) {
				const match = /^\[\[([^\]]+)\]\]/.exec(src);
				if (match) {
					return {
						type: "wikiLink",
						raw: match[0],
						text: match[1],
					};
				}
			},
			renderer(token) {
				return `<a class="${styles.wikiLink}" data-wiki-link="${token.text}" href="#">${token.text}</a>`;
			},
		},
	],
};

marked.use(wikiLinkExtension);

type EditorPreviewProps = {
	className?: string;
	value: string;
	onWikiLinkClick?: (link: string) => void;
};

export function EditorPreview({
	className,
	value,
	onWikiLinkClick,
}: EditorPreviewProps) {
	const html = useMemo(() => {
		return marked.parse(value, { async: false }) as string;
	}, [value]);

	const handleClick = useCallback(
		(e: MouseEvent) => {
			const target = e.target as HTMLElement;
			const wikiLink = target.closest<HTMLElement>("[data-wiki-link]");
			if (wikiLink) {
				e.preventDefault();
				onWikiLinkClick?.(wikiLink.dataset.wikiLink!);
			}
		},
		[onWikiLinkClick],
	);

	const classes = [styles.preview, className].filter(Boolean).join(" ");

	return (
		<div
			className={classes}
			data-testid="editor-preview"
			dangerouslySetInnerHTML={{ __html: html }}
			onClick={handleClick}
		/>
	);
}
