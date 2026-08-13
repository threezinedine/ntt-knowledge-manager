import { Server } from "./server";

export const RENDERING_SERVER_TAG = "rendering";

export class RenderingServer extends Server {
	private _canvas: HTMLCanvasElement;

	constructor(canvas: HTMLCanvasElement) {
		super(RENDERING_SERVER_TAG);
		this._canvas = canvas;
	}

	protected startImpl(): void {}

	protected stopImpl(): void {}

	protected updateImpl(_: number): void {
		this._canvas.width = this._canvas.clientWidth;
		this._canvas.height = this._canvas.clientHeight;

		const ctx = this._canvas.getContext("2d");

		if (!ctx) {
			throw new Error("Failed to get 2D rendering context");
		}

		ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

		for (const node of this._nodes) {
			node.draw(ctx);
		}
	}
}
