# marked-pele

Render [Mermaid](https://mermaid.js.org) diagrams in [marked](https://marked.js.org) to SVG at build time with [pele](https://pele.run). The output is plain inline SVG, so the browser needs no JS.

**[Try it in the playground](https://yue1123.github.io/pele-markdown/)** · [Full documentation](https://github.com/yue1123/pele-markdown#readme)

## Install

```sh
npm install marked-pele
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
import { Marked } from 'marked'
import markedPele from 'marked-pele'

const marked = new Marked(markedPele({ lang: ['pele', 'mermaid'] }))
marked.parse(source)
```

In CommonJS, use `require('marked-pele').default`.

## Options

| Option | Description |
|---|---|
| `lang` | Fence language to handle, `'pele'` by default. Pass `['pele', 'mermaid']` to also handle ```` ```mermaid ```` |
| `pele` | Options passed through to pele's `render()`. See the [pele API](https://pele.run/api) |
| `onError(error, block)` | HTML to output when rendering fails; `throw error` here to fail the build |
| `render(block)` | Replaces the built-in rendering. Call `renderPele(block)` to wrap the default output |

The generated `<svg>` has `class="pele pele-<diagram type>"` and is themed with CSS variables such as `--pele-fg` and `--pele-accent`. See [pele theming](https://pele.run/theming).

## Related

- [`markdown-it-pele`](https://www.npmjs.com/package/markdown-it-pele) for markdown-it and VitePress
- [`remark-pele`](https://www.npmjs.com/package/remark-pele) for remark / unified

## License

MIT
