import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
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
];

describe("StatelessEpubList", () => {
	it("shows empty state when no items", () => {
		render(<StatelessEpubList items={[]} loading={false} error={null} />);
		expect(screen.getByText("No epubs uploaded yet.")).toBeVisible();
	});

	it("shows loading state", () => {
		render(<StatelessEpubList items={[]} loading={true} error={null} />);
		expect(screen.getByText("Loading...")).toBeVisible();
	});

	it("shows error state", () => {
		render(<StatelessEpubList items={[]} loading={false} error="Failed to load" />);
		expect(screen.getByText("Failed to load")).toBeVisible();
	});

	it("renders items with name and meta", () => {
		render(<StatelessEpubList items={MOCK_ITEMS} loading={false} error={null} />);
		expect(screen.getByText("The Great Gatsby")).toBeVisible();
		expect(screen.getByText("1984")).toBeVisible();
	});

	it("calls onSelect when item is clicked", async () => {
		const onSelect = vi.fn();
		render(<StatelessEpubList items={MOCK_ITEMS} loading={false} error={null} onSelect={onSelect} />);

		await userEvent.click(screen.getByText("The Great Gatsby"));
		expect(onSelect).toHaveBeenCalledWith(MOCK_ITEMS[0]);
	});

	it("calls onDelete when delete button is clicked", async () => {
		const onDelete = vi.fn();
		render(<StatelessEpubList items={MOCK_ITEMS} loading={false} error={null} onDelete={onDelete} />);

		const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
		await userEvent.click(deleteButtons[0]);
		expect(onDelete).toHaveBeenCalledWith(MOCK_ITEMS[0]);
	});

	it("shows download icon only for non-downloaded items", () => {
		const onDownload = vi.fn();
		render(<StatelessEpubList items={MOCK_ITEMS} loading={false} error={null} onDownload={onDownload} />);

		const downloadButtons = screen.getAllByRole("button", { name: /download/i });
		expect(downloadButtons).toHaveLength(1);
	});

	it("calls onDownload when download button is clicked", async () => {
		const onDownload = vi.fn();
		render(<StatelessEpubList items={MOCK_ITEMS} loading={false} error={null} onDownload={onDownload} />);

		const downloadBtn = screen.getByRole("button", { name: /download/i });
		await userEvent.click(downloadBtn);
		expect(onDownload).toHaveBeenCalledWith(MOCK_ITEMS[1]);
	});

	it("hides download icon when item is downloaded", () => {
		const allDownloaded = MOCK_ITEMS.map((item) => ({ ...item, downloaded: true }));
		const onDownload = vi.fn();
		render(<StatelessEpubList items={allDownloaded} loading={false} error={null} onDownload={onDownload} />);

		expect(screen.queryByRole("button", { name: /download/i })).toBeNull();
	});
});
