import type { Meta, StoryObj } from "@storybook/react-vite";
import { Editor } from "./editor";

const SAMPLE_MARKDOWN = `# Welcome to the Editor

This is a **markdown** editor with *Vim keybindings*.

## Features

- Vim motions (hjkl, w, b, e, etc.)
- Visual mode selection
- Markdown syntax highlighting
- Code block support

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

const meta = {
	title: "Components/Editor",
	component: Editor,
	argTypes: {
		vimMode: { control: "boolean" },
	},
	decorators: [
		(Story) => (
			<div style={{ height: "500px", width: "100%" }}>
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof Editor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		defaultValue: SAMPLE_MARKDOWN,
		vimMode: true,
	},
};

export const NoVim: Story = {
	args: {
		defaultValue: SAMPLE_MARKDOWN,
		vimMode: false,
	},
};

export const Empty: Story = {
	args: {
		vimMode: true,
	},
};
