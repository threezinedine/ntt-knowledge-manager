import type { Point, Rectangle, RGBAColor } from "../type";

export class Node {
	private children: Node[] = [];
	private parent: Node | null = null;
	private _serverTags: Set<string> = new Set();

	protected position: Point = { x: 0, y: 0 };
	protected bounds: Rectangle = {
		topLeft: { x: 0, y: 0 },
		topRight: { x: 0, y: 0 },
		bottomRight: { x: 0, y: 0 },
		bottomLeft: { x: 0, y: 0 },
	};
	protected color: RGBAColor = { r: 0, g: 0, b: 0, a: 1 };

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
			return {
				x: parentWorldPos.x + this.position.x,
				y: parentWorldPos.y + this.position.y,
			};
		}
		return this.position;
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
			this.position = {
				x: pos.x - parentWorldPos.x,
				y: pos.y - parentWorldPos.y,
			};
		} else {
			this.position = pos;
		}
		this.onPositionChanged();
	}

	get Bounds(): Rectangle {
		return this.bounds;
	}

	get WorldBounds(): Rectangle {
		const worldPos = this.WorldPosition;
		return {
			topLeft: {
				x: worldPos.x + this.bounds.topLeft.x,
				y: worldPos.y + this.bounds.topLeft.y,
			},
			topRight: {
				x: worldPos.x + this.bounds.topRight.x,
				y: worldPos.y + this.bounds.topRight.y,
			},
			bottomRight: {
				x: worldPos.x + this.bounds.bottomRight.x,
				y: worldPos.y + this.bounds.bottomRight.y,
			},
			bottomLeft: {
				x: worldPos.x + this.bounds.bottomLeft.x,
				y: worldPos.y + this.bounds.bottomLeft.y,
			},
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

	public draw(ctx: CanvasRenderingContext2D): void {
		this.drawImpl(ctx);
	}

	protected drawImpl(_ctx: CanvasRenderingContext2D): void {}
}
