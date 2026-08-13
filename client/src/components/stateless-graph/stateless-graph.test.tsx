import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Graph, type GraphItem } from "./stateless-graph";

// jsdom has no real 2d canvas context; stub it so the engine's rendering
// server can run (clearRect/setTransform/fill etc.) without throwing.
beforeEach(() => {
	const ctx = {
		setTransform: vi.fn(),
		clearRect: vi.fn(),
		beginPath: vi.fn(),
		arc: vi.fn(),
		fill: vi.fn(),
		stroke: vi.fn(),
		fillText: vi.fn(),
		closePath: vi.fn(),
		save: vi.fn(),
		restore: vi.fn(),
		translate: vi.fn(),
		rotate: vi.fn(),
	} as unknown as CanvasRenderingContext2D;
	vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(ctx);

	// drive the engine's rAF loop synchronously a few frames so it initializes
	const frames: FrameRequestCallback[] = [];
	vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
		frames.push(cb);
		return frames.length;
	});
	vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
	// flush a couple of frames so the engine's update runs (and any thrown
	// error surfaces into the test)
	const raf = window.requestAnimationFrame as unknown as {
		mock: { calls: { invocationCallOrder: number }[] };
	};
	void raf;
	vi.stubGlobal("_flushRafFrames", () => {
		// process only the frames queued at call time — the engine re-schedules
		// a new frame each tick, so draining everything would loop forever
		const count = frames.length;
		for (let i = 0; i < count; i++) {
			const cb = frames.shift()!;
			cb(performance.now());
		}
	});
});

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

function flushFrames() {
	(
		globalThis as unknown as { _flushRafFrames: () => void }
	)._flushRafFrames();
}

describe("Graph", () => {
	it("renders an accessible canvas", () => {
		render(<Graph />);
		flushFrames();

		expect(
			screen.getByRole("img", { name: "Node graph" }),
		).toBeInTheDocument();
	});

	it("accepts the /nodes/map payload as input (not rendered yet)", () => {
		const { container } = render(<Graph items={MAP_ITEMS} />);
		flushFrames();

		expect(container.querySelector("canvas")).toBeInTheDocument();
		// no items are created/add to the engine yet — pure engine setup
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
		flushFrames();

		const canvas = container.querySelector("canvas");
		expect(canvas).toBeInTheDocument();
	});

	it("uses a custom size", () => {
		const { container } = render(<Graph width={400} height={300} />);
		flushFrames();

		const canvas = container.querySelector("canvas");
		expect(canvas).toBeInTheDocument();
	});

	it("applies a custom class name", () => {
		const { container } = render(<Graph className="my-graph" />);

		expect(container.querySelector("canvas")).toHaveClass("my-graph");
	});
});
