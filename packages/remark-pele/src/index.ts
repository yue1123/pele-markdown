import type { Html, Root } from 'mdast'
import { visit } from 'unist-util-visit'
import { createBlock, isPeleLang, renderPele, type PeleOptions } from 'pele-core'

export type { PeleBlock, PeleOptions } from 'pele-core'

/**
 * 把 ```pele 代码块替换成 html 节点。
 * 转 HTML 时需要 remark-rehype 开启 `allowDangerousHtml`，
 * 并配合 rehype-raw 或 rehype-stringify 的 `allowDangerousHtml`。
 */
export default function remarkPele(options: PeleOptions = {}) {
  return (tree: Root) => {
    visit(tree, 'code', (node, index, parent) => {
      if (!parent || index === undefined || !isPeleLang(node.lang, options)) return
      const html: Html = {
        type: 'html',
        value: renderPele(createBlock(node.value, node.meta ?? ''), options),
        position: node.position,
      }
      parent.children[index] = html
    })
  }
}
