import type { Point, Rectangle, RGBAColor } from "../type";

export class Node {
	private children: Node[] = [];
	private parent: Node | null = null;
	private _serverTags: Set<string> = new Set();
	private _isHovered: boolean = false;

	protected position: Point = { x: 0, y: 0 };
	protected color: RGBAColor = { r: 0, g: 0, b: 0, a: 1 };
	protected rotation: number = 0;

	public addToServers(...tags: string[]): void {
		for (const tag of tags) {
			this._serverTags.add(tag);
		}
	}

	public shouldAddToServer(serverTag: string): boolean {
		if (this._serverTags.size === 0) return true;
		return this._serverTags.has(serverTag);
	}

	get Position(): Point {
		return this.position;
	}

	get WorldPosition(): Point {
		if (this.parent) {
			const parentWorldPos = this.parent.WorldPosition;
			const parentWorldRot = this.parent.WorldRotation;
			const cos = Math.cos(parentWorldRot);
			const sin = Math.sin(parentWorldRot);
			return {
				x: parentWorldPos.x + this.position.x * cos - this.position.y * sin,
				y: parentWorldPos.y + this.position.x * sin + this.position.y * cos,
			};
		}
		return this.position;
	}

	get Rotation(): number {
		return this.rotation;
	}

	set Rotation(r: number) {
		this.rotation = r;
	}

	get WorldRotation(): number {
		if (this.parent) {
			return this.parent.WorldRotation + this.rotation;
		}
		return this.rotation;
	}

	set Position(pos: Point) {
		this.position = pos;
		this.onPositionChanged();
	}

	get Color(): RGBAColor {
		return this.color;
	}

	set Color(c: RGBAColor) {
		this.color = c;
	}

	set WorldPosition(pos: Point) {
		if (this.parent) {
			const parentWorldPos = this.parent.WorldPosition;
			const parentWorldRot = this.parent.WorldRotation;
			const cos = Math.cos(-parentWorldRot);
			const sin = Math.sin(-parentWorldRot);
			const dx = pos.x - parentWorldPos.x;
			const dy = pos.y - parentWorldPos.y;
			this.position = {
				x: dx * cos - dy * sin,
				y: dx * sin + dy * cos,
			};
		} else {
			this.position = pos;
		}
		this.onPositionChanged();
	}

	protected computeBounds(): Rectangle {
		return {
			topLeft: { x: 0, y: 0 },
			topRight: { x: 0, y: 0 },
			bottomRight: { x: 0, y: 0 },
			bottomLeft: { x: 0, y: 0 },
		};
	}

	get Bounds(): Rectangle {
		return this.computeBounds();
	}

	get WorldBounds(): Rectangle {
		const worldPos = this.WorldPosition;
		const local = this.computeBounds();
		const worldRot = this.WorldRotation;
		const cos = Math.cos(worldRot);
		const sin = Math.sin(worldRot);

		const corners: Point[] = [
			local.topLeft,
			local.topRight,
			local.bottomRight,
			local.bottomLeft,
		];

		const rotated = corners.map((c) => ({
			x: worldPos.x + c.x * cos - c.y * sin,
			y: worldPos.y + c.x * sin + c.y * cos,
		}));

		const xs = rotated.map((p) => p.x);
		const ys = rotated.map((p) => p.y);
		const minX = Math.min(...xs);
		const maxX = Math.max(...xs);
		const minY = Math.min(...ys);
		const maxY = Math.max(...ys);

		return {
			topLeft: { x: minX, y: minY },
			topRight: { x: maxX, y: minY },
			bottomRight: { x: maxX, y: maxY },
			bottomLeft: { x: minX, y: maxY },
		};
	}

	private onPositionChanged(): void {
		this.onPositionChangedImpl();
	}

	// There're 2 main objects types in the graph: nodes and edges.
	// Nodes are the main objects that can have children, while edges are connections between nodes.
	// The onPositionChanged method is called whenever a node's position is updated, allowing for
	//      any necessary updates to be made to the node's state or its children's state.
	protected onPositionChangedImpl(): void {}

	get Parent(): Node | null {
		return this.parent;
	}

	public addChild(child: Node): void {
		this.children.push(child);
		child.parent = this;
		this.onChildAdded(child);
		child.onPositionChanged();
	}

	protected onChildAdded(_: Node): void {}

	public removeChild(child: Node): void {
		const index = this.children.indexOf(child);
		if (index !== -1) {
			this.children.splice(index, 1);
			child.parent = null;
			this.onChildRemoved(child);
			child.onPositionChanged();
		}
	}

	protected onChildRemoved(_: Node): void {}

	get Children(): Node[] {
		return this.children;
	}

	get IsHovered(): boolean {
		return this._isHovered;
	}

	set IsHovered(value: boolean) {
		this._isHovered = value;
	}

	public onHoverEnter?: () => void;
	public onHoverExit?: () => void;

	public checkHover(_mousePos: Point): void {}

	public connectionRadius(): number {
		const b = this.computeBounds();
		const hw = (b.bottomRight.x - b.topLeft.x) / 2;
		const hh = (b.bottomRight.y - b.topLeft.y) / 2;
		return Math.sqrt(hw * hw + hh * hh);
	}

	public draw(ctx: CanvasRenderingContext2D): void {
		this.drawImpl(ctx);
	}

	protected drawImpl(_ctx: CanvasRenderingContext2D): void {}
}
