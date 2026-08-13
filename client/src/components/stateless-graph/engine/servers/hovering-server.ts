import { Server } from "./server";
import type { Node } from "../nodes";

export const HOVERING_SERVER_TAG = "hovering";

export class HoveringServer extends Server {
	constructor() {
		super(HOVERING_SERVER_TAG);
	}

	protected startImpl(): void {}

	protected stopImpl(): void {}

	protected addElementImpl(_element: Node): void {}

	protected removeElementImpl(_element: Node): void {}

	protected updateImpl(_dt: number): void {}
}
