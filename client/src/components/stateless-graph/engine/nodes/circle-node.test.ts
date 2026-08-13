import { describe, expect, it } from "vitest";
import { CircleNode } from "./circle-node";

describe("CircleNode bounds", () => {
	it("computes bounds from default radius", () => {
		const node = new CircleNode();

		const bounds = node.Bounds;

		expect(bounds.topLeft).toEqual({ x: -20, y: -20 });
		expect(bounds.topRight).toEqual({ x: 20, y: -20 });
		expect(bounds.bottomRight).toEqual({ x: 20, y: 20 });
		expect(bounds.bottomLeft).toEqual({ x: -20, y: 20 });
	});

	it("updates bounds when radius changes", () => {
		const node = new CircleNode();
		node.Radius = 50;

		const bounds = node.Bounds;

		expect(bounds.topLeft).toEqual({ x: -50, y: -50 });
		expect(bounds.bottomRight).toEqual({ x: 50, y: 50 });
	});

	it("computes world bounds offset by position", () => {
		const node = new CircleNode();
		node.Radius = 10;
		node.Position = { x: 100, y: 200 };

		const wb = node.WorldBounds;

		expect(wb.topLeft).toEqual({ x: 90, y: 190 });
		expect(wb.bottomRight).toEqual({ x: 110, y: 210 });
	});

	it("world bounds expand when rotated (square corners move outward)", () => {
		const node = new CircleNode();
		node.Radius = 10;
		node.Position = { x: 0, y: 0 };
		node.Rotation = Math.PI / 4;

		const wb = node.WorldBounds;
		const diagonal = 10 * Math.SQRT2;

		expect(wb.topLeft.x).toBeCloseTo(-diagonal);
		expect(wb.topLeft.y).toBeCloseTo(-diagonal);
		expect(wb.bottomRight.x).toBeCloseTo(diagonal);
		expect(wb.bottomRight.y).toBeCloseTo(diagonal);
	});
});
