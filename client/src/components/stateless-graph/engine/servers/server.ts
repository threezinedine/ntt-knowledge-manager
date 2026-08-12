import type { Node } from "../nodes";

export class Server {
	protected _nodes: Node[] = [];

	start(): void {
		this.startImpl();
	}

	protected startImpl() {}

	stop(): void {
		this.stopImpl();
	}

	protected stopImpl() {}

	addElement(element: Node): void {
		this._nodes.push(element);
		this.addElementImpl(element);
	}

	protected addElementImpl(_: Node): void {}

	removeElement(element: Node): void {
		const index = this._nodes.indexOf(element);
		if (index !== -1) {
			this._nodes.splice(index, 1);
		}
		this.removeElementImpl(element);
	}

	protected removeElementImpl(_: Node): void {}

	update(dt: number): void {
		this.updateImpl(dt);
	}

	protected updateImpl(_: number): void {}
}
