import { PeleError, type PeleBlock, type PeleOptions } from 'pele-markdown-core'
import { describe, expect, it } from 'vitest'

const FLOWCHART = 'flowchart LR\n  A --> B'
const fence = (info: string, body: string) => `\`\`\`${info}\n${body}\n\`\`\`\n`
const dump = (block: PeleBlock) => `[${JSON.stringify(block)}]`

/** Behavior every adapter must share: options and block info pass through the adapter intact */
export function runContract(name: string, render: (markdown: string, options?: PeleOptions) => string) {
  describe(`${name} contract`, () => {
    it('passes source and meta to render', () => {
      expect(render('```pele  title="a b" x\nline 1\nline 2\n```\n', { render: dump })).toContain(
        dump({ source: 'line 1\nline 2', meta: 'title="a b" x' }),
      )
    })

    it('normalizes CRLF line endings', () => {
      expect(render('```pele\r\na\r\nb\r\n```\r\n', { render: dump })).toContain(dump({ source: 'a\nb', meta: '' }))
      expect(render(fence('pele', FLOWCHART).replace(/\n/g, '\r\n'))).toContain('<svg')
    })

    it('handles tilde fences', () => {
      expect(render(`~~~pele\n${FLOWCHART}\n~~~\n`)).toContain('class="pele pele-flowchart"')
    })

    it('handles fences nested in lists and blockquotes', () => {
      const html = render(`- item\n\n  \`\`\`pele\n  a\n  \`\`\`\n\n> \`\`\`pele\n> b\n> \`\`\`\n`, { render: dump })
      expect(html).toMatch(/<li>[\s\S]*\[\{"source":"a","meta":""\}\][\s\S]*<\/li>/)
      expect(html).toMatch(/<blockquote>[\s\S]*\[\{"source":"b","meta":""\}\][\s\S]*<\/blockquote>/)
    })

    it('accepts an array of langs', () => {
      const options = { lang: ['pele', 'mermaid'] }
      expect(render(fence('mermaid', FLOWCHART), options)).toContain('<svg')
      expect(render(fence('pele', FLOWCHART), options)).toContain('<svg')
    })

    it('leaves the default lang alone when lang is overridden', () => {
      const html = render(fence('pele', FLOWCHART), { lang: 'pl' })
      expect(html).not.toContain('<svg')
      expect(html).toContain('class="language-pele"')
    })

    it('does not match a lang that only starts with pele', () => {
      expect(render(fence('pelex', FLOWCHART))).not.toContain('<svg')
    })

    it('passes options to pele', () => {
      expect(render(fence('pele', FLOWCHART), { pele: { responsive: false } })).not.toContain('max-width:100%')
    })

    it('calls onError with the PeleError and block', () => {
      const calls: [unknown, PeleBlock][] = []
      const html = render(fence('pele title=t', 'flowchart LR\n  A -->'), {
        onError: (error, block) => {
          calls.push([error, block])
          return '<p>failed</p>'
        },
      })
      expect(html).toContain('<p>failed</p>')
      expect(calls).toHaveLength(1)
      expect(calls[0][0]).toBeInstanceOf(PeleError)
      expect(calls[0][1]).toEqual({ source: 'flowchart LR\n  A -->', meta: 'title=t' })
    })

    it('lets onError abort rendering', () => {
      expect(() => render(fence('pele', 'nope'), { onError: error => { throw error } })).toThrow(PeleError)
    })
  })
}
