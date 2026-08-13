import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Editor } from "./editor";

describe("Editor", () => {
	it("renders the editor container", () => {
		render(<Editor />);

		expect(screen.getByTestId("editor")).toBeInTheDocument();
	});

	it("applies a custom className", () => {
		render(<Editor className="custom" />);

		expect(screen.getByTestId("editor")).toHaveClass("custom");
	});
});
