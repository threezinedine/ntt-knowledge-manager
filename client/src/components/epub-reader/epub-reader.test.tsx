import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EpubReader } from "./epub-reader";

describe("EpubReader", () => {
	it("renders without crashing", () => {
		const { container } = render(<EpubReader />);
		expect(container).toBeDefined();
	});
});
