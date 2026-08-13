import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Editor } from "../editor";
import { EditorPreview } from "./editor-preview";

const SAMPLE_MARKDOWN = `# Welcome to the Editor

This is a **markdown** editor with *Vim keybindings*.

## Features

- Vim motions (hjkl, w, b, e, etc.)
- Visual mode selection
- Markdown syntax highlighting
- Code block support

## Wiki Links

Try clicking these: [[Getting Started]], [[API Reference]], [[Architecture]]

## Code Example

\`\`\`typescript
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}
\`\`\`

## Checklist

- [x] Vim mode
- [x] Markdown support
- [ ] Live preview
- [ ] File saving

> Press \`Escape\` to enter Normal mode, \`i\` to insert.
`;

function EditorWithPreview({ vimMode = true }: { vimMode?: boolean }) {
	const [content, setContent] = useState(SAMPLE_MARKDOWN);

	return (
		<div style={{ display: "flex", gap: "16px", height: "100%" }}>
			<div style={{ flex: 1, minWidth: 0 }}>
				<Editor
					defaultValue={SAMPLE_MARKDOWN}
					vimMode={vimMode}
					onChange={setContent}
				/>
			</div>
			<div
				style={{
					flex: 1,
					minWidth: 0,
					border: "1px solid #ccc",
					borderRadius: "4px",
					overflow: "auto",
				}}
			>
				<EditorPreview
					value={content}
					onWikiLinkClick={(link) => alert(`Navigate to: ${link}`)}
				/>
			</div>
		</div>
	);
}

const meta = {
	title: "Components/EditorPreview",
	component: EditorPreview,
	decorators: [
		(Story) => (
			<div style={{ height: "500px", width: "100%" }}>
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof EditorPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		value: SAMPLE_MARKDOWN,
		onWikiLinkClick: (link: string) => alert(`Navigate to: ${link}`),
	},
};

export const WithEditor: Story = {
	render: () => <EditorWithPreview />,
};

export const WithEditorNoVim: Story = {
	render: () => <EditorWithPreview vimMode={false} />,
};
