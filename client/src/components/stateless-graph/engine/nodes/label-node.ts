import { Node } from "./node";
import { LABEL_SERVER_TAG } from "../servers";

export class LabelNode extends Node {
	protected text: string = "";
	protected fontSize: number = 14;
	protected fontFamily: string = "sans-serif";
	protected textAlign: CanvasTextAlign = "center";
	protected textBaseline: CanvasTextBaseline = "middle";

	constructor() {
		super();
		this.addToServers(LABEL_SERVER_TAG);
	}

	get Text(): string {
		return this.text;
	}

	set Text(t: string) {
		this.text = t;
	}

	get FontSize(): number {
		return this.fontSize;
	}

	set FontSize(s: number) {
		this.fontSize = s;
	}

	get FontFamily(): string {
		return this.fontFamily;
	}

	set FontFamily(f: string) {
		this.fontFamily = f;
	}

	get TextAlign(): CanvasTextAlign {
		return this.textAlign;
	}

	set TextAlign(a: CanvasTextAlign) {
		this.textAlign = a;
	}

	get TextBaseline(): CanvasTextBaseline {
		return this.textBaseline;
	}

	set TextBaseline(b: CanvasTextBaseline) {
		this.textBaseline = b;
	}

	protected computeBounds() {
		const width = this.fontSize * 0.6 * this.text.length;
		const height = this.fontSize;

		let left: number;
		let right: number;
		switch (this.textAlign) {
			case "left":
			case "start":
				left = 0;
				right = width;
				break;
			case "right":
			case "end":
				left = -width;
				right = 0;
				break;
			default:
				left = -width / 2;
				right = width / 2;
				break;
		}

		let top: number;
		let bottom: number;
		switch (this.textBaseline) {
			case "top":
			case "hanging":
				top = 0;
				bottom = height;
				break;
			case "bottom":
			case "ideographic":
			case "alphabetic":
				top = -height;
				bottom = 0;
				break;
			default:
				top = -height / 2;
				bottom = height / 2;
				break;
		}

		return {
			topLeft: { x: left, y: top },
			topRight: { x: right, y: top },
			bottomRight: { x: right, y: bottom },
			bottomLeft: { x: left, y: bottom },
		};
	}

	protected drawImpl(ctx: CanvasRenderingContext2D): void {
		const worldPos = this.WorldPosition;
		const { r, g, b, a } = this.Color;

		ctx.save();
		ctx.translate(worldPos.x, worldPos.y);
		ctx.rotate(this.WorldRotation);

		ctx.font = `${this.fontSize}px ${this.fontFamily}`;
		ctx.textAlign = this.textAlign;
		ctx.textBaseline = this.textBaseline;
		ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
		ctx.fillText(this.text, 0, 0);

		ctx.restore();
	}
}
