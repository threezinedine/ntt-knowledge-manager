import { describe, expect, it } from "vitest";
import { TweenManager } from "./tween-manager";
import { Node } from "./nodes";
import { CircleNode } from "./nodes";

describe("TweenManager", () => {
	it("tweens a numeric property over duration", () => {
		const manager = new TweenManager();
		const node = new Node();
		node.Rotation = 0;

		manager.start(node, 1, { prop: "Rotation", to: Math.PI });

		manager.update(0.5);
		expect(node.Rotation).toBeCloseTo(Math.PI / 2);

		manager.update(0.5);
		expect(node.Rotation).toBeCloseTo(Math.PI);
	});

	it("completes and removes the tween after duration", () => {
		const manager = new TweenManager();
		const node = new Node();
		node.Rotation = 0;

		const id = manager.start(node, 0.5, { prop: "Rotation", to: 1 });

		expect(manager.check(id)).toBe(true);

		manager.update(0.5);
		expect(manager.check(id)).toBe(false);
		expect(node.Rotation).toBeCloseTo(1);
	});

	it("clamps to the target value when overshooting duration", () => {
		const manager = new TweenManager();
		const node = new Node();
		node.Rotation = 0;

		manager.start(node, 0.3, { prop: "Rotation", to: 2 });

		manager.update(1.0);
		expect(node.Rotation).toBeCloseTo(2);
	});

	it("tweens multiple properties simultaneously", () => {
		const manager = new TweenManager();
		const node = new CircleNode();
		node.Rotation = 0;
		node.Radius = 10;

		manager.start(
			node,
			1,
			{ prop: "Rotation", to: Math.PI },
			{ prop: "Radius", to: 30 },
		);

		manager.update(0.5);
		expect(node.Rotation).toBeCloseTo(Math.PI / 2);
		expect(node.Radius).toBeCloseTo(20);

		manager.update(0.5);
		expect(node.Rotation).toBeCloseTo(Math.PI);
		expect(node.Radius).toBeCloseTo(30);
	});

	it("runs multiple tweens on different nodes", () => {
		const manager = new TweenManager();
		const a = new Node();
		const b = new Node();
		a.Rotation = 0;
		b.Rotation = 0;

		const idA = manager.start(a, 1, { prop: "Rotation", to: 2 });
		const idB = manager.start(b, 0.5, { prop: "Rotation", to: 4 });

		manager.update(0.5);
		expect(a.Rotation).toBeCloseTo(1);
		expect(b.Rotation).toBeCloseTo(4);
		expect(manager.check(idA)).toBe(true);
		expect(manager.check(idB)).toBe(false);

		manager.update(0.5);
		expect(a.Rotation).toBeCloseTo(2);
		expect(manager.check(idA)).toBe(false);
	});

	it("stops a tween mid-way, freezing the property at current value", () => {
		const manager = new TweenManager();
		const node = new Node();
		node.Rotation = 0;

		const id = manager.start(node, 1, { prop: "Rotation", to: 4 });

		manager.update(0.25);
		expect(node.Rotation).toBeCloseTo(1);

		manager.stop(id);
		expect(manager.check(id)).toBe(false);

		manager.update(0.75);
		expect(node.Rotation).toBeCloseTo(1);
	});

	it("check returns false for an unknown id", () => {
		const manager = new TweenManager();

		expect(manager.check(999)).toBe(false);
	});

	it("stop is a no-op for an unknown id", () => {
		const manager = new TweenManager();

		expect(() => manager.stop(999)).not.toThrow();
	});

	it("tweens from a non-zero start value", () => {
		const manager = new TweenManager();
		const node = new Node();
		node.Rotation = Math.PI;

		manager.start(node, 1, { prop: "Rotation", to: 0 });

		manager.update(0.5);
		expect(node.Rotation).toBeCloseTo(Math.PI / 2);

		manager.update(0.5);
		expect(node.Rotation).toBeCloseTo(0);
	});

	it("tweens an object property (Color)", () => {
		const manager = new TweenManager();
		const node = new Node();
		node.Color = { r: 0, g: 0, b: 0, a: 1 };

		manager.start(node, 1, {
			prop: "Color",
			to: { r: 200, g: 100, b: 50, a: 1 },
		});

		manager.update(0.5);
		expect(node.Color.r).toBeCloseTo(100);
		expect(node.Color.g).toBeCloseTo(50);
		expect(node.Color.b).toBeCloseTo(25);
		expect(node.Color.a).toBeCloseTo(1);

		manager.update(0.5);
		expect(node.Color.r).toBeCloseTo(200);
		expect(node.Color.g).toBeCloseTo(100);
		expect(node.Color.b).toBeCloseTo(50);
	});

	it("tweens scalar and object properties together", () => {
		const manager = new TweenManager();
		const node = new CircleNode();
		node.Radius = 10;
		node.Color = { r: 255, g: 0, b: 0, a: 1 };

		manager.start(
			node,
			1,
			{ prop: "Radius", to: 30 },
			{ prop: "Color", to: { r: 0, g: 255, b: 0, a: 1 } },
		);

		manager.update(0.5);
		expect(node.Radius).toBeCloseTo(20);
		expect(node.Color.r).toBeCloseTo(127.5);
		expect(node.Color.g).toBeCloseTo(127.5);
		expect(node.Color.b).toBeCloseTo(0);

		manager.update(0.5);
		expect(node.Radius).toBeCloseTo(30);
		expect(node.Color.r).toBeCloseTo(0);
		expect(node.Color.g).toBeCloseTo(255);
	});

	it("stops an object tween mid-way, freezing at current value", () => {
		const manager = new TweenManager();
		const node = new Node();
		node.Color = { r: 0, g: 0, b: 0, a: 1 };

		const id = manager.start(node, 1, {
			prop: "Color",
			to: { r: 200, g: 200, b: 200, a: 1 },
		});

		manager.update(0.25);
		expect(node.Color.r).toBeCloseTo(50);

		manager.stop(id);
		manager.update(0.75);
		expect(node.Color.r).toBeCloseTo(50);
	});

	it("handles zero duration by jumping to target immediately", () => {
		const manager = new TweenManager();
		const node = new Node();
		node.Rotation = 0;

		const id = manager.start(node, 0, { prop: "Rotation", to: 5 });

		manager.update(0);
		expect(node.Rotation).toBeCloseTo(5);
		expect(manager.check(id)).toBe(false);
	});
});
