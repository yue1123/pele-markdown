import type { MarkedExtension } from 'marked'
import { createBlock, isPeleLang, parseInfo, renderPele, type PeleOptions } from 'pele-markdown-core'

export { renderPele } from 'pele-markdown-core'
export type { PeleBlock, PeleOptions } from 'pele-markdown-core'

export default function markedPele(options: PeleOptions = {}): MarkedExtension {
  return {
    renderer: {
      code({ text, lang: info }) {
        const { lang, meta } = parseInfo(info)
        // Returning false falls back to marked's default renderer
        if (!isPeleLang(lang, options)) return false
        return renderPele(createBlock(text, meta), options)
      },
    },
  }
}
