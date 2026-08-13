import { describe, expect, it } from "vitest";
import { LabelNode } from "./label-node";

describe("LabelNode bounds", () => {
	it("computes zero-width bounds for empty text", () => {
		const node = new LabelNode();

		const bounds = node.Bounds;

		expect(bounds.topLeft.x).toBeCloseTo(0);
		expect(bounds.topLeft.y).toBe(-7);
		expect(bounds.bottomRight.x).toBeCloseTo(0);
		expect(bounds.bottomRight.y).toBe(7);
	});

	it("computes centered bounds by default (center/middle)", () => {
		const node = new LabelNode();
		node.Text = "Hello";
		node.FontSize = 20;

		const bounds = node.Bounds;
		const expectedWidth = 20 * 0.6 * 5;

		expect(bounds.topLeft).toEqual({ x: -expectedWidth / 2, y: -10 });
		expect(bounds.topRight).toEqual({ x: expectedWidth / 2, y: -10 });
		expect(bounds.bottomRight).toEqual({ x: expectedWidth / 2, y: 10 });
		expect(bounds.bottomLeft).toEqual({ x: -expectedWidth / 2, y: 10 });
	});

	it("computes left-aligned bounds", () => {
		const node = new LabelNode();
		node.Text = "Test";
		node.FontSize = 10;
		node.TextAlign = "left";

		const bounds = node.Bounds;
		const expectedWidth = 10 * 0.6 * 4;

		expect(bounds.topLeft.x).toBe(0);
		expect(bounds.topRight.x).toBe(expectedWidth);
	});

	it("computes right-aligned bounds", () => {
		const node = new LabelNode();
		node.Text = "Test";
		node.FontSize = 10;
		node.TextAlign = "right";

		const bounds = node.Bounds;
		const expectedWidth = 10 * 0.6 * 4;

		expect(bounds.topLeft.x).toBe(-expectedWidth);
		expect(bounds.topRight.x).toBe(0);
	});

	it("computes top baseline bounds", () => {
		const node = new LabelNode();
		node.Text = "Hi";
		node.FontSize = 16;
		node.TextBaseline = "top";

		const bounds = node.Bounds;

		expect(bounds.topLeft.y).toBe(0);
		expect(bounds.bottomLeft.y).toBe(16);
	});

	it("computes bottom baseline bounds", () => {
		const node = new LabelNode();
		node.Text = "Hi";
		node.FontSize = 16;
		node.TextBaseline = "bottom";

		const bounds = node.Bounds;

		expect(bounds.topLeft.y).toBe(-16);
		expect(bounds.bottomLeft.y).toBe(0);
	});

	it("computes world bounds offset by position", () => {
		const node = new LabelNode();
		node.Text = "AB";
		node.FontSize = 10;
		node.Position = { x: 50, y: 100 };

		const wb = node.WorldBounds;
		const expectedWidth = 10 * 0.6 * 2;

		expect(wb.topLeft.x).toBe(50 - expectedWidth / 2);
		expect(wb.topLeft.y).toBe(100 - 5);
		expect(wb.bottomRight.x).toBe(50 + expectedWidth / 2);
		expect(wb.bottomRight.y).toBe(100 + 5);
	});

	it("rotates world bounds by 90 degrees", () => {
		const node = new LabelNode();
		node.Text = "ABCD";
		node.FontSize = 10;
		node.TextAlign = "center";
		node.TextBaseline = "middle";
		node.Rotation = Math.PI / 2;

		// const bounds = node.Bounds;
		const halfW = (10 * 0.6 * 4) / 2;
		const halfH = 10 / 2;

		const wb = node.WorldBounds;

		expect(wb.topLeft.x).toBeCloseTo(-halfH);
		expect(wb.topLeft.y).toBeCloseTo(-halfW);
		expect(wb.bottomRight.x).toBeCloseTo(halfH);
		expect(wb.bottomRight.y).toBeCloseTo(halfW);
	});
});
