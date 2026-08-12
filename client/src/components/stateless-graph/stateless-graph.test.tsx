import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Graph, type GraphItem } from "./stateless-graph";

// Shape of the server's GET /nodes/map response: { nodeId, nodeName, map }
const MAP_ITEMS: GraphItem[] = [
	{
		nodeId: 1,
		nodeName: "Home",
		map: { "2": { relationId: 10, relationName: "links to" } },
	},
	{
		nodeId: 2,
		nodeName: "React",
		map: { "3": { relationId: 11, relationName: "depends on" } },
	},
	{
		nodeId: 3,
		nodeName: "Design",
		map: {},
	},
];

describe("Graph", () => {
	it("renders an accessible canvas", () => {
		render(<Graph />);

		expect(
			screen.getByRole("img", { name: "Node graph" }),
		).toBeInTheDocument();
	});

	it("accepts the /nodes/map payload as input (not rendered yet)", () => {
		const { container } = render(<Graph items={MAP_ITEMS} />);

		expect(container.querySelector("canvas")).toBeInTheDocument();
		// nothing drawn yet — the items are accepted but ignored for now
		expect(container.querySelector("canvas")).toBeEmptyDOMElement();
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
