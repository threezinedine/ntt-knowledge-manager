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

	protected drawImpl(ctx: CanvasRenderingContext2D): void {
		const worldPos = this.WorldPosition;
		const { r, g, b, a } = this.Color;

		ctx.font = `${this.fontSize}px ${this.fontFamily}`;
		ctx.textAlign = this.textAlign;
		ctx.textBaseline = this.textBaseline;
		ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
		ctx.fillText(this.text, worldPos.x, worldPos.y);
	}
}
