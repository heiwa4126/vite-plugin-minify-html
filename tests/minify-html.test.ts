import { beforeEach, describe, expect, it, vi } from "vitest";

const { minifyMock, terserMinifyMock } = vi.hoisted(() => ({
	minifyMock: vi.fn(),
	terserMinifyMock: vi.fn(),
}));

vi.mock("html-minifier-terser", () => ({
	minify: minifyMock,
}));

vi.mock("terser", () => ({
	minify: terserMinifyMock,
}));

import { minifyHtml } from "../src/index";

type TransformIndexHtml = {
	order: string;
	handler: (html: string) => Promise<string>;
};

describe("minifyHtml", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("returns a Vite plugin and forwards html-minifier options", async () => {
		minifyMock.mockResolvedValue("<html>minified</html>");

		const plugin = minifyHtml();
		expect(plugin.name).toBe("vite-plugin-minify-html");
		expect(plugin.apply).toBe("build");

		const transform = plugin.transformIndexHtml as TransformIndexHtml;
		expect(transform.order).toBe("post");

		const html = "<html>  <body><!-- c --></body></html>";
		const result = await transform.handler(html);

		expect(result).toBe("<html>minified</html>");
		expect(minifyMock).toHaveBeenCalledTimes(1);
		expect(minifyMock).toHaveBeenCalledWith(
			html,
			expect.objectContaining({
				collapseWhitespace: true,
				removeComments: true,
				minifyCSS: true,
				processScripts: ["importmap"],
			}),
		);
	});

	it("compacts importmap JSON in minifyJS", async () => {
		minifyMock.mockResolvedValue("ok");

		const transform = minifyHtml().transformIndexHtml as TransformIndexHtml;
		await transform.handler("<html></html>");

		const options = minifyMock.mock.calls[0]?.[1] as {
			minifyJS: (code: string) => Promise<string>;
		};

		const compacted = await options.minifyJS('{\n  "imports": { "x": "/x.js" }\n}');
		expect(compacted).toBe('{"imports":{"x":"/x.js"}}');
		expect(terserMinifyMock).not.toHaveBeenCalled();
	});

	it("falls back to terser for non-JSON JS and respects drop flags", async () => {
		minifyMock.mockResolvedValue("ok");
		terserMinifyMock.mockResolvedValue({ code: "a();" });

		const transform = minifyHtml({
			dropConsole: false,
			dropDebugger: false,
		}).transformIndexHtml as TransformIndexHtml;
		await transform.handler("<html></html>");

		const options = minifyMock.mock.calls[0]?.[1] as {
			minifyJS: (code: string) => Promise<string>;
		};

		const source = "console.log(1); debugger;";
		const minified = await options.minifyJS(source);

		expect(minified).toBe("a();");
		expect(terserMinifyMock).toHaveBeenCalledWith(source, {
			compress: {
				drop_console: false,
				drop_debugger: false,
			},
			mangle: true,
		});
	});

	it("returns original code when terser provides no code", async () => {
		minifyMock.mockResolvedValue("ok");
		terserMinifyMock.mockResolvedValue({});

		const transform = minifyHtml().transformIndexHtml as TransformIndexHtml;
		await transform.handler("<html></html>");

		const options = minifyMock.mock.calls[0]?.[1] as {
			minifyJS: (code: string) => Promise<string>;
		};

		const source = "const x = 1;";
		const output = await options.minifyJS(source);
		expect(output).toBe(source);
	});
});
