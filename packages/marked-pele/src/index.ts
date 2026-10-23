import type { MarkedExtension } from 'marked'
import { createBlock, isPeleLang, parseInfo, renderPele, type PeleOptions } from 'pele-core'

export type { PeleBlock, PeleOptions } from 'pele-core'

export default function markedPele(options: PeleOptions = {}): MarkedExtension {
  return {
    renderer: {
      code({ text, lang: info }) {
        const { lang, meta } = parseInfo(info)
        // 返回 false 交给 marked 默认渲染
        if (!isPeleLang(lang, options)) return false
        return renderPele(createBlock(text, meta), options)
      },
    },
  }
}
