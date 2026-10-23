import { render as renderDiagram, type RenderOptions } from 'pele'

export { PeleError } from 'pele'
export type { RenderOptions } from 'pele'

export interface PeleBlock {
  /** Block content (Mermaid syntax) without the trailing newline */
  source: string
  /** The info string after the language name, e.g. `title="x"` in ```pele title="x" */
  meta: string
}

export interface PeleOptions {
  /** Fence language(s) to handle, `pele` by default; accepts an array such as `['pele', 'mermaid']` */
  lang?: string | string[]
  /** Options passed through to pele's `render()` */
  pele?: RenderOptions
  /** Replaces the built-in rendering entirely; returns an HTML string */
  render?: (block: PeleBlock) => string
  /** HTML to output when rendering fails; defaults to `<pre class="pele-error">`. Rethrow here to abort rendering */
  onError?: (error: unknown, block: PeleBlock) => string
}

export const DEFAULT_LANG = 'pele'

/** Splits an info string into the language name and meta */
export function parseInfo(info: string | null | undefined): { lang: string; meta: string } {
  const trimmed = (info ?? '').trim()
  const match = /^(\S*)\s*([\s\S]*)$/.exec(trimmed)!
  return { lang: match[1], meta: match[2] }
}

export function isPeleLang(lang: string | null | undefined, options: PeleOptions = {}): boolean {
  if (!lang) return false
  const langs = options.lang ?? DEFAULT_LANG
  return Array.isArray(langs) ? langs.includes(lang) : lang === langs
}

export function createBlock(source: string, meta = ''): PeleBlock {
  // markdown-it and marked normalize \r\n to \n but mdast doesn't, and only
  // markdown-it keeps the trailing newline; make all of them consistent
  return { source: source.replace(/\r\n?/g, '\n').replace(/\n$/, ''), meta }
}

export function renderPele(block: PeleBlock, options: PeleOptions = {}): string {
  if (options.render) return options.render(block)
  try {
    return `${renderDiagram(block.source, options.pele).svg}\n`
  } catch (error) {
    return (options.onError ?? defaultOnError)(error, block)
  }
}

function defaultOnError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error)
  return `<pre class="pele-error"><code>${escapeHtml(message)}</code></pre>\n`
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
