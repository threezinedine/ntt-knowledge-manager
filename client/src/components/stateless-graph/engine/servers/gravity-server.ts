import { Server } from "./server";
import type { Point } from "../type";
import type { GravityNode } from "../nodes/gravity-node";

export { GRAVITY_SERVER_TAG } from "../nodes/gravity-node";

export class GravityServer extends Server {
	private _repulsionStrength: number = 50000;
	private _attractionStrength: number = 0;
	private _centerGravity: number = 0.05;
	private _damping: number = 0.92;
	private _center: Point = { x: 400, y: 200 };

	constructor() {
		super("gravity");
	}

	get RepulsionStrength(): number {
		return this._repulsionStrength;
	}

	set RepulsionStrength(v: number) {
		this._repulsionStrength = v;
	}

	get AttractionStrength(): number {
		return this._attractionStrength;
	}

	set AttractionStrength(v: number) {
		this._attractionStrength = v;
	}

	get CenterGravity(): number {
		return this._centerGravity;
	}

	set CenterGravity(v: number) {
		this._centerGravity = v;
	}

	get Damping(): number {
		return this._damping;
	}

	set Damping(v: number) {
		this._damping = v;
	}

	get Center(): Point {
		return this._center;
	}

	set Center(c: Point) {
		this._center = c;
	}

	protected updateImpl(dt: number): void {
		const nodes = this._nodes as GravityNode[];
		const forces = new Map<GravityNode, Point>();

		for (const node of nodes) {
			forces.set(node, { x: 0, y: 0 });
		}

		for (let i = 0; i < nodes.length; i++) {
			const a = nodes[i];
			const aRef = a.RefNode;
			if (!aRef) continue;
			const aPos = aRef.WorldPosition;

			for (let j = i + 1; j < nodes.length; j++) {
				const b = nodes[j];
				const bRef = b.RefNode;
				if (!bRef) continue;
				const bPos = bRef.WorldPosition;

				const dx = aPos.x - bPos.x;
				const dy = aPos.y - bPos.y;
				const distSq = dx * dx + dy * dy;
				const dist = Math.sqrt(distSq);
				const safeDist = Math.max(dist, 10);

				const force = this._repulsionStrength / (safeDist * safeDist);
				const ux = dist > 0 ? dx / dist : (Math.random() - 0.5);
				const uy = dist > 0 ? dy / dist : (Math.random() - 0.5);
				const fx = ux * force;
				const fy = uy * force;

				const fa = forces.get(a)!;
				fa.x += fx;
				fa.y += fy;

				const fb = forces.get(b)!;
				fb.x -= fx;
				fb.y -= fy;
			}
		}

		for (const node of nodes) {
			const ref = node.RefNode;
			if (!ref) continue;
			const pos = ref.WorldPosition;

			for (const linked of node.Links) {
				const linkedRef = linked.RefNode;
				if (!linkedRef) continue;
				const linkedPos = linkedRef.WorldPosition;

				const dx = linkedPos.x - pos.x;
				const dy = linkedPos.y - pos.y;

				const f = forces.get(node)!;
				f.x += dx * this._attractionStrength;
				f.y += dy * this._attractionStrength;
			}
		}

		for (const node of nodes) {
			const ref = node.RefNode;
			if (!ref) continue;
			const pos = ref.WorldPosition;

			const f = forces.get(node)!;
			f.x += (this._center.x - pos.x) * this._centerGravity;
			f.y += (this._center.y - pos.y) * this._centerGravity;
		}

		for (const node of nodes) {
			const ref = node.RefNode;
			if (!ref) continue;

			if (ref.IsDragging) {
				node.Velocity = { x: 0, y: 0 };
				continue;
			}

			const f = forces.get(node)!;
			const vel = node.Velocity;

			vel.x = (vel.x + f.x * dt) * this._damping;
			vel.y = (vel.y + f.y * dt) * this._damping;

			const pos = ref.WorldPosition;
			ref.WorldPosition = {
				x: pos.x + vel.x,
				y: pos.y + vel.y,
			};
		}
	}
}
