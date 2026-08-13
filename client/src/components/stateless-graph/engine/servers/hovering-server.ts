import { Server } from "./server";
import type { Point } from "../type";

export { HOVERING_SERVER_TAG } from "../nodes/hovering-node";

export class HoveringServer extends Server {
	private _canvas: HTMLCanvasElement;
	private _mousePos: Point = { x: 0, y: 0 };
	private _onMouseMove = (e: MouseEvent) => {
		this._mousePos = { x: e.offsetX, y: e.offsetY };
	};

	constructor(canvas: HTMLCanvasElement) {
		super("hovering");
		this._canvas = canvas;
	}

	protected startImpl(): void {
		this._canvas.addEventListener("mousemove", this._onMouseMove);
	}

	protected stopImpl(): void {
		this._canvas.removeEventListener("mousemove", this._onMouseMove);
	}

	protected updateImpl(_dt: number): void {
		let anyHovered = false;
		for (const node of this._nodes) {
			node.checkHover(this._mousePos);
			if (node.IsHovered) anyHovered = true;
		}
		this._canvas.style.cursor = anyHovered ? "pointer" : "default";
	}
}
