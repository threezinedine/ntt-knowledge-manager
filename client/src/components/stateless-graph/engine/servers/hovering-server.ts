import { Server } from "./server";
import type { Node } from "../nodes";

export class HoveringServer extends Server {
	protected startImpl(): void {}

	protected stopImpl(): void {}

	protected addElementImpl(element: Node): void {}

	protected removeElementImpl(element: Node): void {}

	protected updateImpl(dt: number): void {}
}
