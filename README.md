# pele-markdown

把 ```` ```pele ```` 围栏代码块渲染成 HTML，同时支持 markdown-it、marked 和 remark。

| 包 | 说明 |
|---|---|
| `pele-core` | 解析与渲染逻辑，不依赖任何 markdown 库 |
| `markdown-it-pele` | markdown-it 插件 |
| `marked-pele` | marked 扩展 |
| `remark-pele` | remark 插件 |

## 用法

```js
// markdown-it
new MarkdownIt().use(markdownItPele, options)

// marked
new Marked(markedPele(options))

// remark（pele 会生成原始 HTML，需开启 allowDangerousHtml）
unified()
  .use(remarkParse)
  .use(remarkPele, options)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeStringify, { allowDangerousHtml: true })
```

`options`：

- `lang`：要接管的语言名，默认 `'pele'`
- `render(block)`：自定义渲染，`block` 为 `{ source, meta }`

## 开发

```sh
pnpm install
pnpm test        # 三个适配器共用 fixtures/ 下的用例
pnpm typecheck
pnpm build
pnpm changeset   # 记录版本变更
```

新增用例：在 `fixtures/` 下放一对 `xxx.md` 和 `xxx.html`。比较时会忽略标签之间的空白。
