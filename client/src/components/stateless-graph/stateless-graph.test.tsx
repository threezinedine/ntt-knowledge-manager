import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Graph } from "./stateless-graph";

describe("Graph", () => {
	it("renders an accessible canvas", () => {
		render(<Graph />);

		expect(
			screen.getByRole("img", { name: "Node graph" }),
		).toBeInTheDocument();
	});

	it("uses a custom aria label", () => {
		render(<Graph ariaLabel="Knowledge graph" />);

		expect(
			screen.getByRole("img", { name: "Knowledge graph" }),
		).toBeInTheDocument();
	});

	it("uses the default size", () => {
		const { container } = render(<Graph />);

		const canvas = container.querySelector("canvas");
		expect(canvas).toHaveAttribute("width", "800");
		expect(canvas).toHaveAttribute("height", "600");
	});

	it("uses a custom size", () => {
		const { container } = render(<Graph width={400} height={300} />);

		const canvas = container.querySelector("canvas");
		expect(canvas).toHaveAttribute("width", "400");
		expect(canvas).toHaveAttribute("height", "300");
	});

	it("applies a custom class name", () => {
		const { container } = render(<Graph className="my-graph" />);

		expect(container.querySelector("canvas")).toHaveClass("my-graph");
	});
});
