# pele-markdown

[English](README.md) | 简体中文

在 Markdown 里写 ```` ```pele ```` 围栏代码块，内容用 [Mermaid](https://mermaid.js.org) 语法，通过 [pele](https://pele.run) 在构建时同步渲染成 SVG。浏览器端不需要任何 JS。支持 markdown-it、marked 和 remark。

````md
```pele
flowchart LR
  A[Markdown] --> B[SVG]
```
````

| 包 | 说明 |
|---|---|
| `pele-markdown-core` | 下面几个插件共用的渲染逻辑，不依赖任何 markdown 库，一般不需要直接安装 |
| `markdown-it-pele` | markdown-it 插件（markdown-it >= 14，兼容 VitePress） |
| `marked-pele` | marked 扩展（marked >= 13） |
| `remark-pele` | remark 插件（unified >= 11） |

## 用法

```js
// markdown-it
new MarkdownIt().use(markdownItPele, options)

// marked
new Marked(markedPele(options))

// remark（输出是原始 SVG，需开启 allowDangerousHtml）
unified()
  .use(remarkParse)
  .use(remarkPele, options)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeStringify, { allowDangerousHtml: true })
```

CommonJS 下默认导出在 `.default` 上：

```js
const markdownItPele = require('markdown-it-pele').default
```

> **remark 注意**：`remark-pele` 会把代码块替换成 `html` 节点。如果用 `remark-stringify` 输出 Markdown 而不是 HTML，结果里的 ```` ```pele ```` 块会变成原始 SVG。只在生成 HTML 的流程里使用它。

## 在 VitePress 中使用

VitePress 会把 Markdown 编译成 Vue 模板，需要用 `v-pre` 包一层，否则图表文字里的 `{{ }}` 会被当成插值，静默渲染成空白：

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

完整示例（含暗色模式主题映射）见 [`examples/vitepress`](examples/vitepress)，运行 `pnpm example:vitepress` 启动。

## 选项

| 选项 | 说明 |
|---|---|
| `lang` | 要接管的语言名，默认 `'pele'`。传 `['pele', 'mermaid']` 可同时接管 ```` ```mermaid ```` |
| `pele` | 透传给 pele `render()` 的参数，如 `responsive`、`fontSize`、`icons`，见 [pele API](https://pele.run/api) |
| `onError(error, block)` | 渲染失败时返回的 HTML。默认输出 `<pre class="pele-error">` 和错误信息；想让构建失败可在这里 `throw error` |
| `render(block)` | 完全替换内置渲染，`block` 为 `{ source, meta }`。需要包一层时可在里面调用各包导出的 `renderPele(block)` |

## 样式

生成的 `<svg>` 带有 `class="pele pele-<图类型>"`，颜色和字体用 CSS 变量控制：

```css
.pele {
  --pele-bg: #fffcf0;
  --pele-fg: #100f0f;
  --pele-accent: #205ea6;
}
```

完整变量见 [pele 主题文档](https://pele.run/theming)。

## 开发

```sh
pnpm install
pnpm test          # 三个适配器共用 fixtures/ 下的用例
pnpm test:update   # 改动渲染后重新生成 fixtures/*.html
pnpm test:dist     # build 后检查产物能否按包名以 ESM / CJS 加载
pnpm coverage      # 覆盖率，阈值 100%
pnpm typecheck
pnpm build
pnpm example:vitepress  # 启动 VitePress 示例
pnpm changeset     # 记录版本变更
```

测试分三层：

- `fixtures/`：完整 Markdown → HTML 快照，三个适配器输出必须一致
- `test-utils/contract.ts`：每个适配器都要满足的行为（meta、换行符、嵌套、`lang`、`onError` 等）
- 各包 `test/`：库特有的行为，如 markdown-it 的 `highlight`、marked 的异步模式、remark 的节点位置

新增用例：在 `fixtures/` 下放一个 `xxx.md`，执行 `pnpm test:update` 生成 `xxx.html`，检查无误后提交。快照只由 markdown-it 写入，marked 和 remark 的输出必须与它完全一致。
