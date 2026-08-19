import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatelessEpubList, type EpubItem } from "./stateless-epub-list";

const MOCK_ITEMS: EpubItem[] = [
	{
		id: 1,
		name: "The Great Gatsby",
		originalFilename: "the-great-gatsby.epub",
		fileSize: 1_200_000,
		uploadCount: 1,
		createdAt: "2026-08-17T10:00:00",
		updatedAt: "2026-08-17T10:00:00",
		downloaded: true,
	},
	{
		id: 2,
		name: "1984",
		originalFilename: "1984.epub",
		fileSize: 850_000,
		uploadCount: 3,
		createdAt: "2026-08-16T08:00:00",
		updatedAt: "2026-08-16T08:00:00",
		downloaded: false,
	},
	{
		id: 3,
		name: "To Kill a Mockingbird",
		originalFilename: "to-kill-a-mockingbird.epub",
		fileSize: 2_400_000,
		uploadCount: 1,
		createdAt: "2026-08-15T14:30:00",
		updatedAt: "2026-08-15T14:30:00",
		downloaded: false,
	},
	{
		id: 4,
		name: "A Very Long Book Title That Should Be Truncated in the UI",
		originalFilename: "long-title.epub",
		fileSize: 5_600_000,
		uploadCount: 2,
		createdAt: "2026-08-10T09:00:00",
		updatedAt: "2026-08-14T12:00:00",
		downloaded: true,
	},
];

const meta = {
	title: "Components/StatelessEpubList",
	component: StatelessEpubList,
	args: {
		items: [],
		loading: false,
		error: null,
		onSelect: (item: EpubItem) => alert(`Open: ${item.name}`),
		onDownload: (item: EpubItem) => alert(`Download: ${item.name}`),
		onDelete: (item: EpubItem) => alert(`Delete: ${item.name}`),
	},
	decorators: [
		(Story) => (
			<div style={{ width: 500, height: 400, border: "1px solid var(--color-border)", borderRadius: 8, overflow: "hidden" }}>
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof StatelessEpubList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const Loading: Story = {
	args: {
		loading: true,
	},
};

export const Error: Story = {
	args: {
		error: "Failed to load epub library",
	},
};

export const WithItems: Story = {
	args: {
		items: MOCK_ITEMS,
	},
};

export const AllDownloaded: Story = {
	args: {
		items: MOCK_ITEMS.map((item) => ({ ...item, downloaded: true })),
	},
};

export const WithoutDelete: Story = {
	args: {
		items: MOCK_ITEMS.slice(0, 2),
		onDelete: undefined,
	},
};
