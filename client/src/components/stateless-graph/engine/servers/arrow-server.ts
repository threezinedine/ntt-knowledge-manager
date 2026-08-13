import { Server } from "./server";

export { ARROW_SERVER_TAG } from "../nodes/arrow-node";

export class ArrowServer extends Server {
	private _canvas: HTMLCanvasElement;

	constructor(canvas: HTMLCanvasElement) {
		super("arrow");
		this._canvas = canvas;
	}

	protected updateImpl(_: number): void {
		const ctx = this._canvas.getContext("2d");
		if (!ctx) throw new Error("Failed to get 2D rendering context");

		for (const node of this._nodes) {
			node.draw(ctx);
		}
	}
}
