# @heiwa4126/vite-plugin-minify-html

English | [日本語](README-ja.md)

[![npm version](https://img.shields.io/npm/v/@heiwa4126/vite-plugin-minify-html.svg)](https://www.npmjs.com/package/@heiwa4126/vite-plugin-minify-html)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)

Vite plugin for build-time HTML minification.
It minifies `index.html`, handles inline scripts, and safely compacts `importmap` JSON.

It is mostly a thin wrapper around [html-minifier-terser](https://www.npmjs.com/package/html-minifier-terser), but it also works on Vite 8 (Rolldown).

## Installation

```bash
pnpm add -D @heiwa4126/vite-plugin-minify-html
```

## Usage

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { minifyHtml } from "@heiwa4126/vite-plugin-minify-html";

export default defineConfig({
	plugins: [react(), minifyHtml()],
});
```

## API

```ts
minifyHtml({
  dropConsole?: boolean; // default: true
  dropDebugger?: boolean; // default: true
});
```

## Development

```bash
pnpm install
pnpm test
pnpm build
```

## Build Output

- ESM: `dist/index.mjs`
- CJS: `dist/index.cjs`
- Types: `dist/index.d.mts` / `dist/index.d.cts`

## License

MIT
