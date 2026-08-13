import { describe, expect, it, vi } from "vitest";
import { Node } from "./node";
import { HoveringNode, HOVERING_SERVER_TAG } from "./hovering-node";

class TestNode extends Node {
	protected computeBounds() {
		return {
			topLeft: { x: -20, y: -10 },
			topRight: { x: 20, y: -10 },
			bottomRight: { x: 20, y: 10 },
			bottomLeft: { x: -20, y: 10 },
		};
	}
}

describe("HoveringNode", () => {
	it("registers with the hovering server tag", () => {
		const hovering = new HoveringNode();

		expect(hovering.shouldAddToServer(HOVERING_SERVER_TAG)).toBe(true);
		expect(hovering.shouldAddToServer("rendering")).toBe(false);
	});

	it("does nothing when no ref node is set", () => {
		const hovering = new HoveringNode();

		expect(() => hovering.checkHover({ x: 0, y: 0 })).not.toThrow();
	});

	it("calls onHoverEnter on ref node when mouse is inside bounds", () => {
		const ref = new TestNode();
		ref.Position = { x: 100, y: 50 };
		ref.onHoverEnter = vi.fn();
		const hovering = new HoveringNode();
		hovering.RefNode = ref;

		hovering.checkHover({ x: 100, y: 50 });

		expect(ref.IsHovered).toBe(true);
		expect(ref.onHoverEnter).toHaveBeenCalledOnce();
	});

	it("calls onHoverExit on ref node when mouse moves outside bounds", () => {
		const ref = new TestNode();
		ref.Position = { x: 100, y: 50 };
		ref.onHoverEnter = vi.fn();
		ref.onHoverExit = vi.fn();
		const hovering = new HoveringNode();
		hovering.RefNode = ref;

		hovering.checkHover({ x: 100, y: 50 });
		hovering.checkHover({ x: 200, y: 200 });

		expect(ref.IsHovered).toBe(false);
		expect(ref.onHoverExit).toHaveBeenCalledOnce();
	});

	it("does not call onHoverEnter repeatedly while hovering", () => {
		const ref = new TestNode();
		ref.Position = { x: 100, y: 50 };
		ref.onHoverEnter = vi.fn();
		const hovering = new HoveringNode();
		hovering.RefNode = ref;

		hovering.checkHover({ x: 100, y: 50 });
		hovering.checkHover({ x: 105, y: 50 });
		hovering.checkHover({ x: 110, y: 50 });

		expect(ref.onHoverEnter).toHaveBeenCalledOnce();
	});

	it("does not call onHoverExit when never hovered", () => {
		const ref = new TestNode();
		ref.Position = { x: 100, y: 50 };
		ref.onHoverExit = vi.fn();
		const hovering = new HoveringNode();
		hovering.RefNode = ref;

		hovering.checkHover({ x: 0, y: 0 });
		hovering.checkHover({ x: 1, y: 1 });

		expect(ref.onHoverExit).not.toHaveBeenCalled();
	});

	it("works when ref node has no hover callbacks", () => {
		const ref = new TestNode();
		ref.Position = { x: 100, y: 50 };
		const hovering = new HoveringNode();
		hovering.RefNode = ref;

		expect(() => hovering.checkHover({ x: 100, y: 50 })).not.toThrow();
		expect(ref.IsHovered).toBe(true);

		expect(() => hovering.checkHover({ x: 200, y: 200 })).not.toThrow();
		expect(ref.IsHovered).toBe(false);
	});

	it("detects hover at the edge of the bounds", () => {
		const ref = new TestNode();
		ref.Position = { x: 100, y: 50 };
		const hovering = new HoveringNode();
		hovering.RefNode = ref;

		hovering.checkHover({ x: 80, y: 40 });
		expect(ref.IsHovered).toBe(true);

		ref.IsHovered = false;
		hovering.checkHover({ x: 120, y: 60 });
		expect(ref.IsHovered).toBe(true);
	});

	it("detects hover miss just outside the bounds", () => {
		const ref = new TestNode();
		ref.Position = { x: 100, y: 50 };
		const hovering = new HoveringNode();
		hovering.RefNode = ref;

		hovering.checkHover({ x: 79, y: 50 });
		expect(ref.IsHovered).toBe(false);

		hovering.checkHover({ x: 121, y: 50 });
		expect(ref.IsHovered).toBe(false);
	});

	it("mirrors the ref node computeBounds", () => {
		const ref = new TestNode();
		const hovering = new HoveringNode();
		hovering.RefNode = ref;

		expect(hovering.Bounds).toEqual(ref.Bounds);
	});

	it("returns the ref node via the RefNode getter", () => {
		const ref = new TestNode();
		const hovering = new HoveringNode();
		hovering.RefNode = ref;

		expect(hovering.RefNode).toBe(ref);
	});

	it("hit-tests against the rotated local bounds, not the AABB", () => {
		const ref = new TestNode();
		ref.Position = { x: 0, y: 0 };
		ref.Rotation = Math.PI / 4;
		const hovering = new HoveringNode();
		hovering.RefNode = ref;

		// Local bounds: 40x20 rect. At 45° rotation the AABB expands,
		// but a point in the AABB corner is outside the actual rotated rect.
		// AABB corner ≈ (21.2, 0) is inside the AABB but outside the rotated rect.
		// The local-space transform of (21.2, 0) at -45° is ≈ (15, -15),
		// which is outside local y range [-10, 10].
		hovering.checkHover({ x: 21, y: 0 });
		expect(ref.IsHovered).toBe(false);

		// A point along the rotated major axis should be inside.
		// (10, 10) in world → local ≈ (14.1, 0) which is inside [-20,20] x [-10,10].
		hovering.checkHover({ x: 10, y: 10 });
		expect(ref.IsHovered).toBe(true);
	});

	it("hit-tests correctly with parent rotation", () => {
		const parent = new Node();
		parent.Rotation = Math.PI / 2;
		const ref = new TestNode();
		ref.Position = { x: 10, y: 0 };
		parent.addChild(ref);

		ref.onHoverEnter = vi.fn();
		const hovering = new HoveringNode();
		hovering.RefNode = ref;

		// ref world pos: parent rotates (10,0) by 90° → (0, 10)
		// ref world rotation: 90°
		// Hover at (0, 10) should be center of the ref node.
		hovering.checkHover({ x: 0, y: 10 });
		expect(ref.IsHovered).toBe(true);
		expect(ref.onHoverEnter).toHaveBeenCalledOnce();
	});
});
