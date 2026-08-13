import { Node } from "./node";
import type { RGBAColor } from "../type";
import { RENDERING_SERVER_TAG } from "../servers";
export class CircleNode extends Node {
	protected radius: number = 20;
	protected borderWidth: number = 2;
	protected borderColor: RGBAColor = { r: 0, g: 0, b: 0, a: 1 };

	constructor() {
		super();
		this.addToServers(RENDERING_SERVER_TAG);
	}

	get Radius(): number {
		return this.radius;
	}

	set Radius(r: number) {
		this.radius = r;
	}

	protected computeBounds() {
		const r = this.radius;
		return {
			topLeft: { x: -r, y: -r },
			topRight: { x: r, y: -r },
			bottomRight: { x: r, y: r },
			bottomLeft: { x: -r, y: r },
		};
	}

	public connectionRadius(): number {
		return this.radius;
	}

	get BorderWidth(): number {
		return this.borderWidth;
	}

	set BorderWidth(w: number) {
		this.borderWidth = w;
	}

	get BorderColor(): RGBAColor {
		return this.borderColor;
	}

	set BorderColor(c: RGBAColor) {
		this.borderColor = c;
	}

	protected drawImpl(ctx: CanvasRenderingContext2D): void {
		const worldPos = this.WorldPosition;

		ctx.save();
		ctx.translate(worldPos.x, worldPos.y);
		ctx.rotate(this.WorldRotation);

		ctx.beginPath();
		ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
		const { r, g, b, a } = this.Color;
		ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
		ctx.fill();

		if (this.borderWidth > 0) {
			ctx.lineWidth = this.borderWidth;
			const { r: br, g: bg, b: bb, a: ba } = this.borderColor;
			ctx.strokeStyle = `rgba(${br}, ${bg}, ${bb}, ${ba})`;
			ctx.stroke();
		}

		ctx.closePath();
		ctx.restore();
	}
}
