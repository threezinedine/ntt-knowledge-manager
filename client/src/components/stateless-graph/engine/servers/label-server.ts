import { Server } from "./server";

export const LABEL_SERVER_TAG = "label";

export class LabelServer extends Server {
	private _canvas: HTMLCanvasElement;

	constructor(canvas: HTMLCanvasElement) {
		super(LABEL_SERVER_TAG);
		this._canvas = canvas;
	}

	protected updateImpl(_: number): void {
		const ctx = this._canvas.getContext("2d");

		if (!ctx) {
			throw new Error("Failed to get 2D rendering context");
		}

		for (const node of this._nodes) {
			node.draw(ctx);
		}
	}
}
