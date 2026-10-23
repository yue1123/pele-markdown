# markdown-it-pele

Render [Mermaid](https://mermaid.js.org) diagrams in [markdown-it](https://github.com/markdown-it/markdown-it) and VitePress to SVG at build time with [pele](https://pele.run). The output is plain inline SVG, so the browser needs no JS.

**[Try it in the playground](https://yue1123.github.io/pele-markdown/)** · [Full documentation](https://github.com/yue1123/pele-markdown#readme)

## Install

```sh
npm install markdown-it-pele
```

## Usage

Write a `pele` code block using Mermaid syntax:

````md
```pele
flowchart LR
  A[Markdown] --> B[SVG]
```
````

```js
import MarkdownIt from 'markdown-it'
import markdownItPele from 'markdown-it-pele'

const md = new MarkdownIt().use(markdownItPele, { lang: ['pele', 'mermaid'] })
md.render(source)
```

In CommonJS, use `require('markdown-it-pele').default`.

### VitePress

Wrap the output in `v-pre` so `{{ }}` in diagram text isn't treated as Vue interpolation:

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

## Options

| Option | Description |
|---|---|
| `lang` | Fence language to handle, `'pele'` by default. Pass `['pele', 'mermaid']` to also handle ```` ```mermaid ```` |
| `pele` | Options passed through to pele's `render()`. See the [pele API](https://pele.run/api) |
| `onError(error, block)` | HTML to output when rendering fails; `throw error` here to fail the build |
| `render(block)` | Replaces the built-in rendering. Call `renderPele(block)` to wrap the default output |

The generated `<svg>` has `class="pele pele-<diagram type>"` and is themed with CSS variables such as `--pele-fg` and `--pele-accent`. See [pele theming](https://pele.run/theming).

## Related

- [`marked-pele`](https://www.npmjs.com/package/marked-pele) for marked
- [`remark-pele`](https://www.npmjs.com/package/remark-pele) for remark / unified

## License

MIT
