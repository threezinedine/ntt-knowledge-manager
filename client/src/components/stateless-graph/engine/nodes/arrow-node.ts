import { Node } from "./node";
import type { Point, Rectangle } from "../type";

export const ARROW_SERVER_TAG = "arrow";

export type ArrowDirection = "none" | "forward" | "both";
export type ArrowTextDirection = "follow" | "horizontal";

export class ArrowNode extends Node {
	private _startNode: Node | null = null;
	private _endNode: Node | null = null;
	private _direction: ArrowDirection = "forward";
	private _arrowSize: number = 10;
	private _lineWidth: number = 2;
	private _gap: number = 4;
	private _text: string = "";
	private _textDirection: ArrowTextDirection = "horizontal";
	private _fontSize: number = 12;
	private _fontFamily: string = "sans-serif";
	private _textOffset: number = 12;

	constructor() {
		super();
		this.addToServers(ARROW_SERVER_TAG);
		this.Draggable = false;
	}

	get StartNode(): Node | null {
		return this._startNode;
	}

	set StartNode(node: Node | null) {
		this._startNode = node;
	}

	get EndNode(): Node | null {
		return this._endNode;
	}

	set EndNode(node: Node | null) {
		this._endNode = node;
	}

	get Direction(): ArrowDirection {
		return this._direction;
	}

	set Direction(d: ArrowDirection) {
		this._direction = d;
	}

	get ArrowSize(): number {
		return this._arrowSize;
	}

	set ArrowSize(s: number) {
		this._arrowSize = s;
	}

	get LineWidth(): number {
		return this._lineWidth;
	}

	set LineWidth(w: number) {
		this._lineWidth = w;
	}

	get Gap(): number {
		return this._gap;
	}

	set Gap(g: number) {
		this._gap = g;
	}

	get Text(): string {
		return this._text;
	}

	set Text(t: string) {
		this._text = t;
	}

	get TextDirection(): ArrowTextDirection {
		return this._textDirection;
	}

	set TextDirection(d: ArrowTextDirection) {
		this._textDirection = d;
	}

	get FontSize(): number {
		return this._fontSize;
	}

	set FontSize(s: number) {
		this._fontSize = s;
	}

	get FontFamily(): string {
		return this._fontFamily;
	}

	set FontFamily(f: string) {
		this._fontFamily = f;
	}

	get TextOffset(): number {
		return this._textOffset;
	}

	set TextOffset(o: number) {
		this._textOffset = o;
	}

	protected computeBounds(): Rectangle {
		if (!this._startNode || !this._endNode) return super.computeBounds();

		const s = this._startNode.WorldPosition;
		const e = this._endNode.WorldPosition;
		const minX = Math.min(s.x, e.x);
		const maxX = Math.max(s.x, e.x);
		const minY = Math.min(s.y, e.y);
		const maxY = Math.max(s.y, e.y);

		return {
			topLeft: { x: minX, y: minY },
			topRight: { x: maxX, y: minY },
			bottomRight: { x: maxX, y: maxY },
			bottomLeft: { x: minX, y: maxY },
		};
	}

	public hitTest(mousePos: Point): boolean {
		if (!this._startNode || !this._endNode) return false;

		const s = this._startNode.WorldPosition;
		const e = this._endNode.WorldPosition;

		const dx = e.x - s.x;
		const dy = e.y - s.y;
		const lenSq = dx * dx + dy * dy;
		if (lenSq === 0) return false;

		const t = Math.max(
			0,
			Math.min(1, ((mousePos.x - s.x) * dx + (mousePos.y - s.y) * dy) / lenSq),
		);

		const projX = s.x + t * dx;
		const projY = s.y + t * dy;
		const distSq =
			(mousePos.x - projX) * (mousePos.x - projX) +
			(mousePos.y - projY) * (mousePos.y - projY);

		const threshold = this._lineWidth * 3 + 4;
		return distSq <= threshold * threshold;
	}

	protected drawImpl(ctx: CanvasRenderingContext2D): void {
		if (!this._startNode || !this._endNode) return;

		const startPos = this._startNode.WorldPosition;
		const endPos = this._endNode.WorldPosition;

		const dx = endPos.x - startPos.x;
		const dy = endPos.y - startPos.y;
		const dist = Math.sqrt(dx * dx + dy * dy);
		if (dist === 0) return;

		const ux = dx / dist;
		const uy = dy / dist;

		const startOffset = this._startNode.connectionRadius() + this._gap;
		const endOffset = this._endNode.connectionRadius() + this._gap;

		if (startOffset + endOffset >= dist) return;

		const sx = startPos.x + ux * startOffset;
		const sy = startPos.y + uy * startOffset;
		const ex = endPos.x - ux * endOffset;
		const ey = endPos.y - uy * endOffset;

		const headSize = this._arrowSize * (this._lineWidth / 2);

		let lineStartX = sx;
		let lineStartY = sy;
		let lineEndX = ex;
		let lineEndY = ey;

		if (this._direction === "forward" || this._direction === "both") {
			lineEndX = ex - ux * headSize;
			lineEndY = ey - uy * headSize;
		}

		if (this._direction === "both") {
			lineStartX = sx + ux * headSize;
			lineStartY = sy + uy * headSize;
		}

		const { r, g, b, a } = this.Color;
		ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
		ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
		ctx.lineWidth = this._lineWidth;

		ctx.beginPath();
		ctx.moveTo(lineStartX, lineStartY);
		ctx.lineTo(lineEndX, lineEndY);
		ctx.stroke();

		if (this._direction === "forward" || this._direction === "both") {
			this.drawArrowHead(ctx, ex, ey, ux, uy);
		}

		if (this._direction === "both") {
			this.drawArrowHead(ctx, sx, sy, -ux, -uy);
		}

		if (this._text) {
			this.drawLabel(ctx, sx, sy, ex, ey, ux, uy);
		}
	}

	private drawLabel(
		ctx: CanvasRenderingContext2D,
		sx: number,
		sy: number,
		ex: number,
		ey: number,
		ux: number,
		uy: number,
	): void {
		const midX = (sx + ex) / 2;
		const midY = (sy + ey) / 2;
		const perpX = -uy;
		const perpY = ux;

		const { r, g, b, a } = this.Color;
		ctx.font = `${this._fontSize}px ${this._fontFamily}`;
		ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";

		const labelX = midX + perpX * this._textOffset;
		const labelY = midY + perpY * this._textOffset;

		if (this._textDirection === "follow") {
			let angle = Math.atan2(ey - sy, ex - sx);
			if (angle > Math.PI / 2) angle -= Math.PI;
			if (angle < -Math.PI / 2) angle += Math.PI;

			ctx.save();
			ctx.translate(labelX, labelY);
			ctx.rotate(angle);
			ctx.fillText(this._text, 0, 0);
			ctx.restore();
		} else {
			ctx.fillText(this._text, labelX, labelY);
		}
	}

	private drawArrowHead(
		ctx: CanvasRenderingContext2D,
		tipX: number,
		tipY: number,
		dirX: number,
		dirY: number,
	): void {
		const size = this._arrowSize * (this._lineWidth / 2);
		const nudge = size * 0.3;
		const perpX = -dirY;
		const perpY = dirX;
		const halfWidth = size * 0.4;

		const tx = tipX + dirX * nudge;
		const ty = tipY + dirY * nudge;

		ctx.beginPath();
		ctx.moveTo(tx, ty);
		ctx.lineTo(
			tx - dirX * size + perpX * halfWidth,
			ty - dirY * size + perpY * halfWidth,
		);
		ctx.lineTo(
			tx - dirX * size - perpX * halfWidth,
			ty - dirY * size - perpY * halfWidth,
		);
		ctx.closePath();
		ctx.fill();
	}
}
