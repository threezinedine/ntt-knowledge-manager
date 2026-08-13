import { describe, expect, it, vi } from "vitest";
import { Node } from "./node";

describe("Node", () => {
	it("starts at the origin with no parent", () => {
		const node = new Node();

		expect(node.Position).toEqual({ x: 0, y: 0 });
		expect(node.WorldPosition).toEqual({ x: 0, y: 0 });
		expect(node.Parent).toBeNull();
	});

	it("returns Position and WorldPosition equal for a parentless node", () => {
		const node = new Node();
		node.Position = { x: 10, y: 20 };

		expect(node.Position).toEqual({ x: 10, y: 20 });
		expect(node.WorldPosition).toEqual({ x: 10, y: 20 });
	});

	it("offsets a child's world position by its parent's position", () => {
		const parent = new Node();
		const child = new Node();
		parent.Position = { x: 100, y: 50 };
		child.Position = { x: 10, y: 20 };

		parent.addChild(child);

		expect(child.Parent).toBe(parent);
		expect(child.WorldPosition).toEqual({ x: 110, y: 70 });
		expect(child.Position).toEqual({ x: 10, y: 20 }); // local unchanged
	});

	it("nests world positions through multiple parent levels", () => {
		const grandparent = new Node();
		const parent = new Node();
		const child = new Node();
		grandparent.Position = { x: 5, y: 5 };
		parent.Position = { x: 20, y: 10 };
		child.Position = { x: 100, y: 0 };

		grandparent.addChild(parent);
		parent.addChild(child);

		expect(child.WorldPosition).toEqual({ x: 125, y: 15 });
	});

	it("sets local position via WorldPosition to achieve the target world pos", () => {
		const parent = new Node();
		const child = new Node();
		parent.Position = { x: 50, y: 50 };
		parent.addChild(child);

		child.WorldPosition = { x: 80, y: 70 };

		// local position becomes target minus parent world position
		expect(child.Position).toEqual({ x: 30, y: 20 });
		expect(child.WorldPosition).toEqual({ x: 80, y: 70 });
	});

	it("removes a child and clears its parent link", () => {
		const parent = new Node();
		const child = new Node();
		parent.addChild(child);

		parent.removeChild(child);

		expect(parent.Children).not.toContain(child);
		expect(child.Parent).toBeNull();
	});

	it("keeps a child's children when removing the child (world pos is preserved)", () => {
		const parent = new Node();
		const child = new Node();
		const grandchild = new Node();
		parent.Position = { x: 10, y: 10 };
		child.Position = { x: 5, y: 5 };
		grandchild.Position = { x: 2, y: 3 };
		parent.addChild(child);
		child.addChild(grandchild);

		parent.removeChild(child);

		expect(parent.Children).toHaveLength(0);
		expect(child.Children).toEqual([grandchild]);
	});

	it("is a no-op when removing a child it does not have", () => {
		const parent = new Node();
		const stranger = new Node();

		expect(() => parent.removeChild(stranger)).not.toThrow();
		expect(parent.Children).toHaveLength(0);
		expect(stranger.Parent).toBeNull();
	});

	it("notifies the onPositionChanged hook when its position changes", () => {
		const onChanged = vi.fn();
		const node = new (class extends Node {
			protected onPositionChangedImpl(): void {
				onChanged();
			}
		})();

		node.Position = { x: 1, y: 1 };
		node.WorldPosition = { x: 5, y: 5 };

		expect(onChanged).toHaveBeenCalledTimes(2);
	});

	it("notifies a child when it is added or removed from its parent", () => {
		const onChildChanged = vi.fn();
		const child = new (class extends Node {
			protected onPositionChangedImpl(): void {
				onChildChanged();
			}
		})();
		const parent = new Node();

		parent.addChild(child);
		parent.removeChild(child);

		// once on add and once on remove (parent link / world pos changes)
		expect(onChildChanged).toHaveBeenCalledTimes(2);
	});

	it("reports local bounds and world-shifted bounds", () => {
		const node = new (class extends Node {
			protected computeBounds() {
				return {
					topLeft: { x: -10, y: -10 },
					topRight: { x: 10, y: -10 },
					bottomRight: { x: 10, y: 10 },
					bottomLeft: { x: -10, y: 10 },
				};
			}
		})();
		node.Position = { x: 100, y: 50 };

		expect(node.Bounds.topLeft).toEqual({ x: -10, y: -10 });
		expect(node.WorldBounds.topLeft).toEqual({ x: 90, y: 40 });
		expect(node.WorldBounds.bottomRight).toEqual({ x: 110, y: 60 });
	});

	it("applies rotation to world bounds", () => {
		const node = new (class extends Node {
			protected computeBounds() {
				return {
					topLeft: { x: -20, y: -10 },
					topRight: { x: 20, y: -10 },
					bottomRight: { x: 20, y: 10 },
					bottomLeft: { x: -20, y: 10 },
				};
			}
		})();
		node.Position = { x: 0, y: 0 };
		node.Rotation = Math.PI / 2;

		const wb = node.WorldBounds;
		expect(wb.topLeft.x).toBeCloseTo(-10);
		expect(wb.topLeft.y).toBeCloseTo(-20);
		expect(wb.bottomRight.x).toBeCloseTo(10);
		expect(wb.bottomRight.y).toBeCloseTo(20);
	});

	it("rotates child world position by parent rotation", () => {
		const parent = new Node();
		const child = new Node();
		parent.Position = { x: 100, y: 0 };
		parent.Rotation = Math.PI / 2;
		child.Position = { x: 10, y: 0 };

		parent.addChild(child);

		expect(child.Position).toEqual({ x: 10, y: 0 });
		expect(child.WorldPosition.x).toBeCloseTo(100);
		expect(child.WorldPosition.y).toBeCloseTo(10);
	});

	it("accumulates world rotation through parent chain", () => {
		const grandparent = new Node();
		const parent = new Node();
		const child = new Node();
		grandparent.Rotation = Math.PI / 4;
		parent.Rotation = Math.PI / 4;
		child.Rotation = Math.PI / 4;

		grandparent.addChild(parent);
		parent.addChild(child);

		expect(child.WorldRotation).toBeCloseTo((3 * Math.PI) / 4);
	});

	it("returns local rotation as world rotation for a parentless node", () => {
		const node = new Node();
		node.Rotation = Math.PI / 3;

		expect(node.WorldRotation).toBe(Math.PI / 3);
	});

	it("rotates child world position through multiple parent levels", () => {
		const grandparent = new Node();
		const parent = new Node();
		const child = new Node();
		grandparent.Position = { x: 0, y: 0 };
		grandparent.Rotation = Math.PI / 2;
		parent.Position = { x: 10, y: 0 };
		child.Position = { x: 5, y: 0 };

		grandparent.addChild(parent);
		parent.addChild(child);

		// grandparent rotates parent's (10,0) by 90° → world (0,10)
		expect(parent.WorldPosition.x).toBeCloseTo(0);
		expect(parent.WorldPosition.y).toBeCloseTo(10);
		// parent inherits 90° rotation, so child's (5,0) rotates → world (0,15)
		expect(child.WorldPosition.x).toBeCloseTo(0);
		expect(child.WorldPosition.y).toBeCloseTo(15);
	});

	it("sets local position via WorldPosition accounting for parent rotation", () => {
		const parent = new Node();
		const child = new Node();
		parent.Position = { x: 100, y: 0 };
		parent.Rotation = Math.PI / 2;
		parent.addChild(child);

		child.WorldPosition = { x: 100, y: 10 };

		expect(child.Position.x).toBeCloseTo(10);
		expect(child.Position.y).toBeCloseTo(0);
		expect(child.WorldPosition.x).toBeCloseTo(100);
		expect(child.WorldPosition.y).toBeCloseTo(10);
	});

	it("should be added to all servers when no server tags are set", () => {
		const node = new Node();

		expect(node.shouldAddToServer("rendering")).toBe(true);
		expect(node.shouldAddToServer("hovering")).toBe(true);
		expect(node.shouldAddToServer("anything")).toBe(true);
	});

	it("should only be added to servers matching its tags", () => {
		const node = new Node();
		node.addToServers("rendering");

		expect(node.shouldAddToServer("rendering")).toBe(true);
		expect(node.shouldAddToServer("hovering")).toBe(false);
	});

	it("supports multiple server tags", () => {
		const node = new Node();
		node.addToServers("rendering", "hovering");

		expect(node.shouldAddToServer("rendering")).toBe(true);
		expect(node.shouldAddToServer("hovering")).toBe(true);
		expect(node.shouldAddToServer("other")).toBe(false);
	});

	it("forwards draw(ctx) to its drawImpl hook", () => {
		const onDraw = vi.fn();
		const node = new (class extends Node {
			protected drawImpl(ctx: CanvasRenderingContext2D): void {
				onDraw(ctx);
			}
		})();
		const ctx = {} as CanvasRenderingContext2D;

		node.draw(ctx);

		expect(onDraw).toHaveBeenCalledWith(ctx);
	});
});
