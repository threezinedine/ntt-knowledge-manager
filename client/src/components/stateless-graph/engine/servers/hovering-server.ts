import { Server } from "./server";
import type { Point } from "../type";
import type { HoveringNode } from "../nodes/hovering-node";

export { HOVERING_SERVER_TAG } from "../nodes/hovering-node";

export class HoveringServer extends Server {
	private _canvas: HTMLCanvasElement;
	private _mousePos: Point = { x: 0, y: 0 };
	private _isMouseDown: boolean = false;
	private _dragTarget: HoveringNode | null = null;
	private _dragOffset: Point = { x: 0, y: 0 };

	private _onMouseMove = (e: MouseEvent) => {
		this._mousePos = { x: e.offsetX, y: e.offsetY };

		if (this._isMouseDown && this._dragTarget) {
			const ref = this._dragTarget.RefNode;
			if (ref && ref.Draggable) {
				ref.WorldPosition = {
					x: this._mousePos.x - this._dragOffset.x,
					y: this._mousePos.y - this._dragOffset.y,
				};
			}
		}
	};

	private _onMouseDown = (e: MouseEvent) => {
		this._isMouseDown = true;
		const pos: Point = { x: e.offsetX, y: e.offsetY };

		for (const node of this._nodes) {
			const hoverNode = node as HoveringNode;
			const ref = hoverNode.RefNode;
			if (ref && ref.IsHovered && ref.Draggable) {
				this._dragTarget = hoverNode;
				const worldPos = ref.WorldPosition;
				this._dragOffset = {
					x: pos.x - worldPos.x,
					y: pos.y - worldPos.y,
				};
				break;
			}
		}
	};

	private _onMouseUp = () => {
		this._isMouseDown = false;
		this._dragTarget = null;
	};

	private _onDblClick = (e: MouseEvent) => {
		const pos: Point = { x: e.offsetX, y: e.offsetY };
		for (const node of this._nodes) {
			const hoverNode = node as HoveringNode;
			const ref = hoverNode.RefNode;
			if (ref && ref.hitTest(pos) && ref.onDoubleClick) {
				ref.onDoubleClick();
				break;
			}
		}
	};

	constructor(canvas: HTMLCanvasElement) {
		super("hovering");
		this._canvas = canvas;
	}

	protected startImpl(): void {
		this._canvas.addEventListener("mousemove", this._onMouseMove);
		this._canvas.addEventListener("mousedown", this._onMouseDown);
		this._canvas.addEventListener("mouseup", this._onMouseUp);
		this._canvas.addEventListener("mouseleave", this._onMouseUp);
		this._canvas.addEventListener("dblclick", this._onDblClick);
	}

	protected stopImpl(): void {
		this._canvas.removeEventListener("mousemove", this._onMouseMove);
		this._canvas.removeEventListener("mousedown", this._onMouseDown);
		this._canvas.removeEventListener("mouseup", this._onMouseUp);
		this._canvas.removeEventListener("mouseleave", this._onMouseUp);
		this._canvas.removeEventListener("dblclick", this._onDblClick);
	}

	protected updateImpl(_dt: number): void {
		let anyHovered = false;
		const hoverNodes: HoveringNode[] = [];
		const arrowNodes: HoveringNode[] = [];

		for (const node of this._nodes) {
			const hn = node as HoveringNode;
			if (hn.RefNode?.Draggable) {
				hoverNodes.push(hn);
			} else {
				arrowNodes.push(hn);
			}
		}

		let draggableHovered = false;
		for (const node of hoverNodes) {
			node.checkHover(this._mousePos);
			if (node.IsHovered) {
				anyHovered = true;
				draggableHovered = true;
			}
		}

		for (const node of arrowNodes) {
			if (draggableHovered) {
				node.clearHover();
			} else {
				node.checkHover(this._mousePos);
				if (node.IsHovered) anyHovered = true;
			}
		}

		this._canvas.style.cursor = this._dragTarget
			? "grabbing"
			: anyHovered
				? "pointer"
				: "default";
	}
}
