import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
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
});
