# pele-markdown

English | [简体中文](README.zh-CN.md)

Write ```` ```pele ```` fenced code blocks in Markdown using [Mermaid](https://mermaid.js.org) syntax, and [pele](https://pele.run) renders them to SVG synchronously at build time. No JS is needed in the browser. Works with markdown-it, marked and remark.

**[Try it in the playground](https://yue1123.github.io/pele-markdown/)**

````md
```pele
flowchart LR
  A[Markdown] --> B[SVG]
```
````

| Package | Description |
|---|---|
| `pele-markdown-core` | Shared rendering logic used by the plugins below, independent of any Markdown library. You normally don't install it directly |
| `markdown-it-pele` | markdown-it plugin (markdown-it >= 14, works with VitePress) |
| `marked-pele` | marked extension (marked >= 13) |
| `remark-pele` | remark plugin (unified >= 11) |

## Usage

```js
// markdown-it
new MarkdownIt().use(markdownItPele, options)

// marked
new Marked(markedPele(options))

// remark (the output is raw SVG, so allowDangerousHtml is required)
unified()
  .use(remarkParse)
  .use(remarkPele, options)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeStringify, { allowDangerousHtml: true })
```

In CommonJS, the default export is on `.default`:

```js
const markdownItPele = require('markdown-it-pele').default
```

> **Note for remark**: `remark-pele` replaces code blocks with `html` nodes. If you use `remark-stringify` to output Markdown instead of HTML, the ```` ```pele ```` blocks become raw SVG. Use it only in pipelines that produce HTML.

## Using with VitePress

VitePress compiles Markdown into Vue templates, so wrap the output in `v-pre`. Otherwise `{{ }}` in diagram text is treated as interpolation and silently renders as blank:

```ts
// .vitepress/config.ts
import markdownItPele, { renderPele } from 'markdown-it-pele'
import { defineConfig } from 'vitepress'

export default defineConfig({
  markdown: {
    config(md) {
      md.use(markdownItPele, {
        lang: ['pele', 'mermaid'],
        render: block => `<div class="pele-diagram" v-pre>${renderPele(block)}</div>`,
      })
    },
  },
})
```

See [`examples/vitepress`](examples/vitepress) for a complete example, including dark mode theme mapping. Run `pnpm example:vitepress` to start it.

## Playground

The [playground](https://yue1123.github.io/pele-markdown/) ([`examples/playground`](examples/playground)) is a live editor: Markdown on the left, rendered output on the right, with tabs to switch between markdown-it, marked and remark and compare their output. Run `pnpm example:playground` to start it locally. It is deployed to GitHub Pages on every push to `main`.

## Options

| Option | Description |
|---|---|
| `lang` | Fence language to handle, `'pele'` by default. Pass `['pele', 'mermaid']` to also handle ```` ```mermaid ```` |
| `pele` | Options passed through to pele's `render()`, such as `responsive`, `fontSize` and `icons`. See the [pele API](https://pele.run/api) |
| `onError(error, block)` | HTML to output when rendering fails. Defaults to a `<pre class="pele-error">` with the error message; `throw error` here to fail the build |
| `render(block)` | Replaces the built-in rendering entirely. `block` is `{ source, meta }`. To wrap the output, call `renderPele(block)`, which every package exports |

## Styling

The generated `<svg>` has `class="pele pele-<diagram type>"`. Colors and fonts are controlled with CSS variables:

```css
.pele {
  --pele-bg: #fffcf0;
  --pele-fg: #100f0f;
  --pele-accent: #205ea6;
}
```

See [pele theming](https://pele.run/theming) for all variables.

## Development

```sh
pnpm install
pnpm test               # all three adapters share the cases in fixtures/
pnpm test:update        # regenerate fixtures/*.html after changing the rendering
pnpm test:dist          # build, then check each package loads by name via ESM / CJS
pnpm coverage           # coverage, with a 100% threshold
pnpm typecheck
pnpm build
pnpm example:vitepress  # start the VitePress example
pnpm example:playground # start the playground
pnpm changeset          # record a version change
```

Tests come in three layers:

- `fixtures/`: full Markdown → HTML snapshots; all three adapters must produce identical output
- `test-utils/contract.ts`: behavior every adapter must share (meta, line endings, nesting, `lang`, `onError` and more)
- each package's `test/`: library-specific behavior, such as markdown-it's `highlight`, marked's async mode and remark's node positions

To add a case, put an `xxx.md` in `fixtures/`, run `pnpm test:update` to generate `xxx.html`, review it, and commit both. Only markdown-it writes snapshots; marked and remark must match its output exactly.
