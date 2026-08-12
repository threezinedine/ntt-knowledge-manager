import { Node } from "./node";

export class CircleNode extends Node {
	constructor() {
		super();
	}

	protected drawImpl(ctx: CanvasRenderingContext2D): void {
		const worldPos = this.WorldPosition;

		ctx.beginPath();
		ctx.arc(worldPos.x, worldPos.y, 20, 0, Math.PI * 2);
		ctx.fillStyle = "blue";
		ctx.fill();
		ctx.closePath();
	}
}
