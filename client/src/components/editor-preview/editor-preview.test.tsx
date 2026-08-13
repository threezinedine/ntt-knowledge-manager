import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EditorPreview } from "./editor-preview";

describe("EditorPreview", () => {
	it("renders the preview container", () => {
		render(<EditorPreview value="" />);

		expect(screen.getByTestId("editor-preview")).toBeInTheDocument();
	});

	it("applies a custom className", () => {
		render(<EditorPreview value="" className="custom" />);

		expect(screen.getByTestId("editor-preview")).toHaveClass("custom");
	});

	it("renders markdown as HTML", () => {
		render(<EditorPreview value="# Hello" />);

		expect(screen.getByTestId("editor-preview").querySelector("h1")).toHaveTextContent("Hello");
	});

	it("renders bold and italic text", () => {
		render(<EditorPreview value="**bold** and *italic*" />);

		const container = screen.getByTestId("editor-preview");
		expect(container.querySelector("strong")).toHaveTextContent("bold");
		expect(container.querySelector("em")).toHaveTextContent("italic");
	});

	it("renders code blocks", () => {
		render(<EditorPreview value={"```\nconsole.log('hi')\n```"} />);

		expect(screen.getByTestId("editor-preview").querySelector("code")).toBeInTheDocument();
	});

	it("renders [[text]] as a wiki link", () => {
		render(<EditorPreview value="go to [[my note]]" />);

		const link = screen.getByTestId("editor-preview").querySelector("a[data-wiki-link]");
		expect(link).toBeInTheDocument();
		expect(link).toHaveTextContent("my note");
		expect(link).toHaveAttribute("data-wiki-link", "my note");
	});

	it("calls onWikiLinkClick when a wiki link is clicked", () => {
		const handler = vi.fn();
		render(<EditorPreview value="see [[target page]]" onWikiLinkClick={handler} />);

		const link = screen.getByTestId("editor-preview").querySelector("a[data-wiki-link]")!;
		fireEvent.click(link);

		expect(handler).toHaveBeenCalledWith("target page");
	});

	it("renders multiple wiki links", () => {
		render(<EditorPreview value="[[first]] and [[second]]" />);

		const links = screen.getByTestId("editor-preview").querySelectorAll("a[data-wiki-link]");
		expect(links).toHaveLength(2);
		expect(links[0]).toHaveTextContent("first");
		expect(links[1]).toHaveTextContent("second");
	});
});
