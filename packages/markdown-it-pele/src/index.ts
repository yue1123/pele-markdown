import type { MarkdownIt } from 'markdown-it'
import { createBlock, isPeleLang, parseInfo, renderPele, type PeleOptions } from 'pele-core'

export type { PeleBlock, PeleOptions } from 'pele-core'

export default function markdownItPele(md: MarkdownIt, options: PeleOptions = {}): void {
  const fallback = md.renderer.rules.fence!

  md.renderer.rules.fence = (tokens, idx, opts, env, self) => {
    const token = tokens[idx]
    const { lang, meta } = parseInfo(token.info)
    if (!isPeleLang(lang, options)) return fallback(tokens, idx, opts, env, self)
    return renderPele(createBlock(token.content, meta), options)
  }
}
