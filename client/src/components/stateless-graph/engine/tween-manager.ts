import type { Node } from "./nodes";

export interface TweenPropertyConfig {
	prop: string;
	to: number | Record<string, number>;
}

interface ScalarTarget {
	kind: "scalar";
	prop: string;
	from: number;
	to: number;
}

interface ObjectTarget {
	kind: "object";
	prop: string;
	from: Record<string, number>;
	to: Record<string, number>;
}

type TweenTarget = ScalarTarget | ObjectTarget;

interface TweenEntry {
	node: Node;
	duration: number;
	elapsed: number;
	targets: TweenTarget[];
}

export class TweenManager {
	private _tweens = new Map<number, TweenEntry>();
	private _nextId = 0;

	start(
		node: Node,
		duration: number,
		...configs: TweenPropertyConfig[]
	): number {
		const id = this._nextId++;
		const targets: TweenTarget[] = configs.map((c) => {
			// @ts-ignore
			const current = (node as Record<string, unknown>)[c.prop];
			if (typeof c.to === "number") {
				return {
					kind: "scalar",
					prop: c.prop,
					from: current as number,
					to: c.to,
				};
			}
			return {
				kind: "object",
				prop: c.prop,
				from: { ...(current as Record<string, number>) },
				to: c.to,
			};
		});
		this._tweens.set(id, { node, duration, elapsed: 0, targets });
		return id;
	}

	stop(id: number): void {
		this._tweens.delete(id);
	}

	check(id: number): boolean {
		return this._tweens.has(id);
	}

	update(dt: number): void {
		for (const [id, tween] of this._tweens) {
			tween.elapsed += dt;
			const t =
				tween.duration <= 0
					? 1
					: Math.min(tween.elapsed / tween.duration, 1);

			for (const target of tween.targets) {
				if (target.kind === "scalar") {
					// @ts-ignore
					(tween.node as Record<string, unknown>)[target.prop] =
						target.from + (target.to - target.from) * t;
				} else {
					const result: Record<string, number> = {};
					for (const key of Object.keys(target.to)) {
						result[key] =
							target.from[key] +
							(target.to[key] - target.from[key]) * t;
					}
					// @ts-ignore
					(tween.node as Record<string, unknown>)[target.prop] =
						result;
				}
			}

			if (t >= 1) {
				this._tweens.delete(id);
			}
		}
	}
}
