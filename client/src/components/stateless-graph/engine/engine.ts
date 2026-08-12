import { RenderingServer, HoveringServer, Server } from "./servers";
import type { Node } from "./nodes";

export class Engine {
	private _canvas: HTMLCanvasElement;
	private _servers: Server[] = [];

	constructor(canvas: HTMLCanvasElement) {
		this._canvas = canvas;

		this._servers.push(new RenderingServer(this._canvas));
		this._servers.push(new HoveringServer());
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
			server.addElement(node);

			for (const child of node.Children) {
				server.addElement(child);
			}
		}
	}

	public removeNode(node: Node): void {
		for (const server of this._servers) {
			for (const child of node.Children) {
				server.removeElement(child);
			}

			server.removeElement(node);
		}
	}
}
