type EditorProps = {
	className?: string;
};

export function Editor({ className }: EditorProps) {
	return <div className={className} data-testid="editor">Editor</div>;
}
