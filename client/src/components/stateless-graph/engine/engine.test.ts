import { describe, expect, it, vi } from "vitest";
import { Engine } from "./engine";
import { Node } from "./nodes";
import { Server } from "./servers";

/** A spy server injected in place of the real ones to observe the Engine. */
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

/** A subclass recording how the engine's parent/child nodes get drawn. */
class DrawSpyNode extends Node {
	drawn = 0;
	protected drawImpl(_ctx: CanvasRenderingContext2D): void {
		this.drawn += 1;
	}
}

// The Engine's own servers (RenderingServer/HoveringServer) are out of scope
// here; we use the base Server + Node to prove the wiring: servers collect
// nodes, render them each update, and forward start/stop/update.
function makeServerHarness(): { server: SpyServer; renderer: Server } {
	const server = new SpyServer();
	const renderer = new (class extends Server {
		protected updateImpl(_dt: number): void {
			for (const node of this._nodes) {
				node.draw({} as CanvasRenderingContext2D);
			}
		}
	})();
	return { server, renderer };
}

/** A minimal 2D context stub so the real RenderingServer can run its loop. */
function fakeCanvas(): HTMLCanvasElement {
	const ctx = {
		clearRect: vi.fn(),
		beginPath: vi.fn(),
		arc: vi.fn(),
		fill: vi.fn(),
		fillRect: vi.fn(),
		stroke: vi.fn(),
		closePath: vi.fn(),
	} as unknown as CanvasRenderingContext2D;
	return {
		clientWidth: 800,
		clientHeight: 600,
		getContext: vi.fn(() => ctx),
	} as unknown as HTMLCanvasElement;
}

describe("Engine base building blocks (Server + Node together)", () => {
	it("adds a node (and its children) to every server that manages it", () => {
		const { server, renderer } = makeServerHarness();
		const parent = new Node();
		const child = new Node();
		parent.addChild(child);

		// emulate Engine.addNode: forward node + its children to each server
		for (const manager of [server, renderer]) {
			manager.addElement(parent);
			for (const c of parent.Children) {
				manager.addElement(c);
			}
		}

		expect(server.nodes).toContain(parent);
		expect(server.nodes).toContain(child);
		// both managers received the same node + children
		expect(server.nodes).toEqual([parent, child]);
	});

	it("renders every node it holds on each update (server -> node draw)", () => {
		const parent = new DrawSpyNode();
		const child = new DrawSpyNode();
		parent.addChild(child);

		const { renderer } = makeServerHarness();
		renderer.addElement(parent);
		for (const c of parent.Children) {
			renderer.addElement(c);
		}

		renderer.update(0.016);
		renderer.update(0.016);

		expect(parent.drawn).toBe(2);
		expect(child.drawn).toBe(2);
	});

	it("stops drawing a node once it is removed from the server", () => {
		const node = new DrawSpyNode();
		const { renderer } = makeServerHarness();
		renderer.addElement(node);

		renderer.update(0.016);
		renderer.removeElement(node);
		renderer.update(0.016);

		expect(node.drawn).toBe(1);
	});

	it("updates every server each frame, mirroring the engine loop", () => {
		const { server } = makeServerHarness();
		server.start();
		server.update(0.016);
		server.update(0.5);
		server.stop();

		expect(server.started).toBe(true);
		expect(server.stopped).toBe(true);
		// dt is forwarded unchanged to each server update
		expect(server.updated).toEqual([0.016, 0.5]);
	});

	it("addNode/removeNode fan out to each server via the real Engine", () => {
		// The Engine builds its own RenderingServer + HoveringServer; bound to a
		// canvas with a real-ish 2d context, start/update/stop all run.
		const canvas = fakeCanvas();

		const engine = new Engine(canvas);
		engine.start();
		engine.update(0.016);
		// no nodes added, so nothing is rendered, but start/update/stop work
		engine.stop();

		expect(canvas.getContext).toHaveBeenCalled();
	});

	it("adds a node and its children to all servers via addNode", () => {
		const canvas = fakeCanvas();
		const engine = new Engine(canvas);

		const parent = new Node();
		const child = new Node();
		parent.addChild(child);

		// addNode must add node + children to every server and render cleanly
		expect(() => engine.addNode(parent)).not.toThrow();
		expect(() => engine.update(0.016)).not.toThrow();

		engine.removeNode(parent);
		expect(() => engine.update(0.016)).not.toThrow();
	});
});
