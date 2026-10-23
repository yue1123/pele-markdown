import { createBlock, isPeleLang, parseInfo, renderPele, type PeleOptions } from 'pele-markdown-core'

export { renderPele } from 'pele-markdown-core'
export type { PeleBlock, PeleOptions } from 'pele-markdown-core'

type FenceRule = (tokens: any[], idx: number, options: any, env: any, self: any) => string

/** markdown-it 14 and 15 ship incompatible types, so describe only what the plugin uses */
export interface MarkdownItLike {
  renderer: { rules: { fence?: FenceRule } }
}

export default function markdownItPele(md: MarkdownItLike, options: PeleOptions = {}): void {
  const fallback = md.renderer.rules.fence!

  md.renderer.rules.fence = (tokens, idx, opts, env, self) => {
    const token: { info: string; content: string } = tokens[idx]
    const { lang, meta } = parseInfo(token.info)
    if (!isPeleLang(lang, options)) return fallback(tokens, idx, opts, env, self)
    return renderPele(createBlock(token.content, meta), options)
  }
}
