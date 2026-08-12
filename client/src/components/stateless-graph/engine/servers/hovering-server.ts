import { Server } from "./server";
import type { Node } from "../nodes";

export class HoveringServer extends Server {
	protected startImpl(): void {}

	protected stopImpl(): void {}

	protected addElementImpl(_element: Node): void {}

	protected removeElementImpl(_element: Node): void {}

	protected updateImpl(_dt: number): void {}
}
