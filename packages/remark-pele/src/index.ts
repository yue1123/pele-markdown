import type { Html, Root } from 'mdast'
import { visit } from 'unist-util-visit'
import { createBlock, isPeleLang, renderPele, type PeleOptions } from '@pele-markdown/core'

export { renderPele } from '@pele-markdown/core'
export type { PeleBlock, PeleOptions } from '@pele-markdown/core'

/**
 * Replaces ```pele code blocks with html nodes.
 * Converting to HTML requires `allowDangerousHtml` on remark-rehype,
 * together with rehype-raw or `allowDangerousHtml` on rehype-stringify.
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
