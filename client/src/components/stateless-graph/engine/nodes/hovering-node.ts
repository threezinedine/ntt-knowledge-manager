import { Node } from "./node";
import type { Point, Rectangle } from "../type";

export const HOVERING_SERVER_TAG = "hovering";

export class HoveringNode extends Node {
	private _refNode: Node | null = null;

	constructor() {
		super();
		this.addToServers(HOVERING_SERVER_TAG);
	}

	get RefNode(): Node | null {
		return this._refNode;
	}

	set RefNode(node: Node | null) {
		this._refNode = node;
	}

	protected computeBounds(): Rectangle {
		if (this._refNode) {
			return this._refNode.Bounds;
		}
		return super.computeBounds();
	}

	public checkHover(mousePos: Point): void {
		if (!this._refNode) return;

		const inside = this._refNode.hitTest(mousePos);

		if (inside && !this._refNode.IsHovered) {
			this._refNode.IsHovered = true;
			this.IsHovered = true;
			this._refNode.onHoverEnter?.();
		} else if (!inside && this._refNode.IsHovered) {
			this._refNode.IsHovered = false;
			this.IsHovered = false;
			this._refNode.onHoverExit?.();
		}
	}
}
