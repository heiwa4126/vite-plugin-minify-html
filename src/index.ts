import { minify } from "html-minifier-terser";
import { minify as terserMinify } from "terser";
import type { Plugin } from "vite";

export interface MinifyHtmlOptions {
	dropConsole?: boolean;
	dropDebugger?: boolean;
}

export function minifyHtml(options: MinifyHtmlOptions = {}): Plugin {
	const { dropConsole = true, dropDebugger = true } = options;

	return {
		name: "vite-plugin-minify-html",
		apply: "build",
		transformIndexHtml: {
			order: "post",
			handler: (html) =>
				minify(html, {
					collapseWhitespace: true,
					removeComments: true,
					minifyCSS: true,
					processScripts: ["importmap"],
					minifyJS: async (code) => {
						try {
							return JSON.stringify(JSON.parse(code));
						} catch {
							const result = await terserMinify(code, {
								compress: {
									drop_console: dropConsole,
									drop_debugger: dropDebugger,
								},
								mangle: true,
							});
							return result.code ?? code;
						}
					},
				}),
		},
	};
}
