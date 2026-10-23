export interface PeleBlock {
  /** 代码块内容，已去掉末尾换行 */
  source: string
  /** info string 中语言名之后的部分，例如 ```pele title="x" 里的 `title="x"` */
  meta: string
}

export interface PeleOptions {
  /** 要接管的围栏语言名，默认 `pele` */
  lang?: string
  /** 自定义渲染，返回 HTML 字符串；不传则使用内置渲染 */
  render?: (block: PeleBlock) => string
}

export const DEFAULT_LANG = 'pele'

/** 把 info string 拆成语言名和 meta */
export function parseInfo(info: string | null | undefined): { lang: string; meta: string } {
  const trimmed = (info ?? '').trim()
  const match = /^(\S*)\s*([\s\S]*)$/.exec(trimmed)!
  return { lang: match[1], meta: match[2] }
}

export function isPeleLang(lang: string | null | undefined, options: PeleOptions = {}): boolean {
  return lang === (options.lang ?? DEFAULT_LANG)
}

export function createBlock(source: string, meta = ''): PeleBlock {
  // markdown-it 的 fence 内容带末尾换行，marked / mdast 不带，这里统一
  return { source: source.replace(/\r?\n$/, ''), meta }
}

export function renderPele(block: PeleBlock, options: PeleOptions = {}): string {
  if (options.render) return options.render(block)
  return defaultRender(block)
}

// TODO: 替换为真正的 pele 解析与渲染
function defaultRender(block: PeleBlock): string {
  return `<div class="pele">${escapeHtml(block.source)}</div>\n`
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
