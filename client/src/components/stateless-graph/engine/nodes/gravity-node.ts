import { Node } from "./node";
import type { Point } from "../type";

export const GRAVITY_SERVER_TAG = "gravity";

export class GravityNode extends Node {
	private _refNode: Node | null = null;
	private _links: GravityNode[] = [];
	private _velocity: Point = { x: 0, y: 0 };
	private _mass: number = 1;

	constructor() {
		super();
		this.addToServers(GRAVITY_SERVER_TAG);
	}

	get RefNode(): Node | null {
		return this._refNode;
	}

	set RefNode(node: Node | null) {
		this._refNode = node;
	}

	get Links(): GravityNode[] {
		return this._links;
	}

	get Velocity(): Point {
		return this._velocity;
	}

	set Velocity(v: Point) {
		this._velocity = v;
	}

	get Mass(): number {
		return this._mass;
	}

	set Mass(m: number) {
		this._mass = m;
	}

	public addLink(other: GravityNode): void {
		if (!this._links.includes(other)) {
			this._links.push(other);
		}
		if (!other._links.includes(this)) {
			other._links.push(this);
		}
	}
}
