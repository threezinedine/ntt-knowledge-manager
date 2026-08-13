import { RenderingServer, HoveringServer, LabelServer, Server } from "./servers";
import type { Node } from "./nodes";

export class Engine {
	private _canvas: HTMLCanvasElement;
	private _servers: Server[] = [];

	constructor(canvas: HTMLCanvasElement) {
		this._canvas = canvas;

		this._servers.push(new RenderingServer(this._canvas));
		this._servers.push(new HoveringServer(this._canvas));
		this._servers.push(new LabelServer(this._canvas));
	}

	public start(): void {
		for (const server of this._servers) {
			server.start();
		}
	}

	public stop(): void {
		for (const server of this._servers) {
			server.stop();
		}
	}

	public update(dt: number): void {
		for (const server of this._servers) {
			server.update(dt);
		}
	}

	public addNode(node: Node): void {
		for (const server of this._servers) {
			if (node.shouldAddToServer(server.tag)) {
				server.addElement(node);
			}

			for (const child of node.Children) {
				if (child.shouldAddToServer(server.tag)) {
					server.addElement(child);
				}
			}
		}
	}

	public removeNode(node: Node): void {
		for (const server of this._servers) {
			for (const child of node.Children) {
				if (child.shouldAddToServer(server.tag)) {
					server.removeElement(child);
				}
			}

			if (node.shouldAddToServer(server.tag)) {
				server.removeElement(node);
			}
		}
	}
}
