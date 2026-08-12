import { describe, expect, it, vi } from "vitest";
import { Server } from "./server";
import { Node } from "../nodes";

/** A concrete server that records which hooks fired and which nodes it holds. */
class SpyServer extends Server {
	started = false;
	stopped = false;
	updated: number[] = [];
	added: Node[] = [];
	removed: Node[] = [];

	protected startImpl(): void {
		this.started = true;
	}

	protected stopImpl(): void {
		this.stopped = true;
	}

	protected updateImpl(dt: number): void {
		this.updated.push(dt);
	}

	protected addElementImpl(element: Node): void {
		this.added.push(element);
	}

	protected removeElementImpl(element: Node): void {
		this.removed.push(element);
	}

	get nodes(): readonly Node[] {
		return this._nodes;
	}
}

describe("Server", () => {
	it("forwards start/stop/update to its impl hooks", () => {
		const server = new SpyServer();
		server.start();
		server.update(0.016);
		server.update(0.5);
		server.stop();

		expect(server.started).toBe(true);
		expect(server.stopped).toBe(true);
		expect(server.updated).toEqual([0.016, 0.5]);
	});

	it("adds an element to its node list and reports it via addElementImpl", () => {
		const server = new SpyServer();
		const node = new Node();

		server.addElement(node);

		expect(server.nodes).toEqual([node]);
		expect(server.added).toEqual([node]);
	});

	it("removes an element from its node list and reports it via removeElementImpl", () => {
		const server = new SpyServer();
		const node = new Node();
		server.addElement(node);
		server.addElement(new Node());

		server.removeElement(node);

		expect(server.nodes).not.toContain(node);
		expect(server.nodes).toHaveLength(1);
		expect(server.removed).toEqual([node]);
	});

	it("is safe when removing an element it does not hold", () => {
		const server = new SpyServer();
		const node = new Node();

		expect(() => server.removeElement(node)).not.toThrow();
		expect(server.nodes).toHaveLength(0);
		// removeElementImpl is still invoked even for unknown elements
		expect(server.removed).toEqual([node]);
	});

	it("lets an update sweep the nodes it holds (server + node cooperation)", () => {
		const draw = vi.fn();
		const drawNode = new (class extends Node {
			protected drawImpl(ctx: CanvasRenderingContext2D): void {
				draw(ctx);
			}
		})();
		// a server that draws every node it manages each update, like a renderer
		const renderer = new (class extends Server {
			protected updateImpl(_dt: number): void {
				for (const node of this._nodes) {
					node.draw({} as CanvasRenderingContext2D);
				}
			}
		})();

		renderer.addElement(drawNode);
		renderer.update(0.016);
		renderer.update(0.016);

		// the server saw and drew the node on every update
		expect(draw).toHaveBeenCalledTimes(2);
	});
});
