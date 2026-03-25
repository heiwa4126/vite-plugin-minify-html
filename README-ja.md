# @heiwa4126/vite-plugin-minify-html

[English](README.md) | 日本語

[![npm version](https://img.shields.io/npm/v/@heiwa4126/vite-plugin-minify-html.svg)](https://www.npmjs.com/package/@heiwa4126/vite-plugin-minify-html)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)

Vite のビルド時に `index.html` を圧縮するプラグインです。
インラインスクリプトも圧縮し、`importmap` の JSON は安全に 1 行化します。

ほぼ [html-minifier-terser](https://www.npmjs.com/package/html-minifier-terser)をラップしただけですが、Vite 8 (Rolldown)でも動きます。

## インストール

```bash
pnpm add -D @heiwa4126/vite-plugin-minify-html
```

## 使い方

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
  dropConsole?: boolean; // 既定値: true
  dropDebugger?: boolean; // 既定値: true
});
```

## 開発

```bash
pnpm install
pnpm test
pnpm build
```

## ビルド出力

- ESM: `dist/index.mjs`
- CJS: `dist/index.cjs`
- 型定義: `dist/index.d.mts` / `dist/index.d.cts`

## ライセンス

MIT
