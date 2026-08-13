import { describe, expect, it, vi } from "vitest";
import { Node } from "./node";
import { CircleNode } from "./circle-node";
import { ArrowNode, ARROW_SERVER_TAG } from "./arrow-node";

describe("ArrowNode", () => {
	it("registers with the arrow server tag", () => {
		const arrow = new ArrowNode();

		expect(arrow.shouldAddToServer(ARROW_SERVER_TAG)).toBe(true);
		expect(arrow.shouldAddToServer("rendering")).toBe(false);
	});

	it("stores start and end node refs", () => {
		const a = new Node();
		const b = new Node();
		const arrow = new ArrowNode();

		arrow.StartNode = a;
		arrow.EndNode = b;

		expect(arrow.StartNode).toBe(a);
		expect(arrow.EndNode).toBe(b);
	});

	it("defaults to forward direction", () => {
		const arrow = new ArrowNode();
		expect(arrow.Direction).toBe("forward");
	});

	it("allows setting direction to none, forward, or both", () => {
		const arrow = new ArrowNode();

		arrow.Direction = "none";
		expect(arrow.Direction).toBe("none");

		arrow.Direction = "both";
		expect(arrow.Direction).toBe("both");

		arrow.Direction = "forward";
		expect(arrow.Direction).toBe("forward");
	});

	it("computes bounds spanning both ref nodes", () => {
		const a = new Node();
		const b = new Node();
		a.Position = { x: 50, y: 100 };
		b.Position = { x: 200, y: 30 };
		const arrow = new ArrowNode();
		arrow.StartNode = a;
		arrow.EndNode = b;

		const bounds = arrow.Bounds;
		expect(bounds.topLeft).toEqual({ x: 50, y: 30 });
		expect(bounds.bottomRight).toEqual({ x: 200, y: 100 });
	});

	it("returns zero bounds when refs are missing", () => {
		const arrow = new ArrowNode();
		const bounds = arrow.Bounds;

		expect(bounds.topLeft).toEqual({ x: 0, y: 0 });
		expect(bounds.bottomRight).toEqual({ x: 0, y: 0 });
	});

	it("does not throw when drawing without refs", () => {
		const arrow = new ArrowNode();
		const ctx = makeMockCtx();

		expect(() => arrow.draw(ctx)).not.toThrow();
		expect(ctx.beginPath).not.toHaveBeenCalled();
	});

	it("draws a line between two nodes", () => {
		const a = new CircleNode();
		const b = new CircleNode();
		a.Position = { x: 0, y: 0 };
		a.Radius = 10;
		b.Position = { x: 100, y: 0 };
		b.Radius = 10;

		const arrow = new ArrowNode();
		arrow.StartNode = a;
		arrow.EndNode = b;
		arrow.Direction = "none";
		const ctx = makeMockCtx();

		arrow.draw(ctx);

		expect(ctx.moveTo).toHaveBeenCalled();
		expect(ctx.lineTo).toHaveBeenCalled();
		expect(ctx.stroke).toHaveBeenCalled();
		// no arrowhead for "none"
		expect(ctx.fill).not.toHaveBeenCalled();
	});

	it("draws one arrowhead for forward direction", () => {
		const a = new CircleNode();
		const b = new CircleNode();
		a.Position = { x: 0, y: 0 };
		a.Radius = 10;
		b.Position = { x: 100, y: 0 };
		b.Radius = 10;

		const arrow = new ArrowNode();
		arrow.StartNode = a;
		arrow.EndNode = b;
		arrow.Direction = "forward";
		const ctx = makeMockCtx();

		arrow.draw(ctx);

		expect(ctx.fill).toHaveBeenCalledTimes(1);
	});

	it("draws two arrowheads for both direction", () => {
		const a = new CircleNode();
		const b = new CircleNode();
		a.Position = { x: 0, y: 0 };
		a.Radius = 10;
		b.Position = { x: 100, y: 0 };
		b.Radius = 10;

		const arrow = new ArrowNode();
		arrow.StartNode = a;
		arrow.EndNode = b;
		arrow.Direction = "both";
		const ctx = makeMockCtx();

		arrow.draw(ctx);

		expect(ctx.fill).toHaveBeenCalledTimes(2);
	});

	it("does not draw when nodes are too close (overlap)", () => {
		const a = new CircleNode();
		const b = new CircleNode();
		a.Position = { x: 0, y: 0 };
		a.Radius = 30;
		b.Position = { x: 10, y: 0 };
		b.Radius = 30;

		const arrow = new ArrowNode();
		arrow.StartNode = a;
		arrow.EndNode = b;
		const ctx = makeMockCtx();

		arrow.draw(ctx);

		expect(ctx.moveTo).not.toHaveBeenCalled();
	});

	it("offsets the line start/end by connection radius + gap", () => {
		const a = new CircleNode();
		const b = new CircleNode();
		a.Position = { x: 0, y: 0 };
		a.Radius = 10;
		b.Position = { x: 100, y: 0 };
		b.Radius = 10;

		const arrow = new ArrowNode();
		arrow.StartNode = a;
		arrow.EndNode = b;
		arrow.Direction = "none";
		arrow.Gap = 5;
		const ctx = makeMockCtx();

		arrow.draw(ctx);

		// start: 0 + 1*(10+5) = 15, end: 100 - 1*(10+5) = 85
		expect(ctx.moveTo).toHaveBeenCalledWith(15, 0);
		expect(ctx.lineTo).toHaveBeenCalledWith(85, 0);
	});

	it("uses the node connection radius (circle returns radius)", () => {
		const circle = new CircleNode();
		circle.Radius = 25;

		expect(circle.connectionRadius()).toBe(25);
	});

	it("base node connection radius uses bounding diagonal", () => {
		const node = new (class extends Node {
			protected computeBounds() {
				return {
					topLeft: { x: -6, y: -8 },
					topRight: { x: 6, y: -8 },
					bottomRight: { x: 6, y: 8 },
					bottomLeft: { x: -6, y: 8 },
				};
			}
		})();

		expect(node.connectionRadius()).toBeCloseTo(10);
	});

	it("exposes ArrowSize and LineWidth properties", () => {
		const arrow = new ArrowNode();
		arrow.ArrowSize = 15;
		arrow.LineWidth = 3;

		expect(arrow.ArrowSize).toBe(15);
		expect(arrow.LineWidth).toBe(3);
	});
});

function makeMockCtx(): CanvasRenderingContext2D {
	return {
		beginPath: vi.fn(),
		moveTo: vi.fn(),
		lineTo: vi.fn(),
		closePath: vi.fn(),
		stroke: vi.fn(),
		fill: vi.fn(),
	} as unknown as CanvasRenderingContext2D;
}
