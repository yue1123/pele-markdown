import { describe, expect, it } from 'vitest'
import { createBlock, isPeleLang, parseInfo, PeleError, renderPele } from '@pele-markdown/core'

describe('@pele-markdown/core', () => {
  it('parses info string', () => {
    expect(parseInfo('pele title="a b"')).toEqual({ lang: 'pele', meta: 'title="a b"' })
    expect(parseInfo('  pele  ')).toEqual({ lang: 'pele', meta: '' })
    expect(parseInfo(undefined)).toEqual({ lang: '', meta: '' })
  })

  it('matches lang', () => {
    expect(isPeleLang('pele')).toBe(true)
    expect(isPeleLang('js')).toBe(false)
    expect(isPeleLang(null)).toBe(false)
    expect(isPeleLang('pl', { lang: 'pl' })).toBe(true)
    expect(isPeleLang('mermaid', { lang: ['pele', 'mermaid'] })).toBe(true)
    expect(isPeleLang('pele', { lang: ['mermaid'] })).toBe(false)
  })

  it('strips one trailing newline', () => {
    expect(createBlock('a\n\n').source).toBe('a\n')
  })

  it('renders mermaid source to svg', () => {
    const html = renderPele(createBlock('flowchart LR\n  A --> B\n'))
    expect(html).toMatch(/^<svg [^>]*class="pele pele-flowchart"/)
    expect(html.endsWith('</svg>\n')).toBe(true)
  })

  it('passes options to pele', () => {
    const html = renderPele(createBlock('flowchart LR\n  A --> B'), { pele: { responsive: false } })
    expect(html).not.toContain('max-width:100%')
  })

  it('escapes diagram text', () => {
    const html = renderPele(createBlock('flowchart LR\n  A["<script>x</script>"] --> B'))
    expect(html).not.toContain('<script')
  })

  it('renders errors as escaped html by default', () => {
    const html = renderPele(createBlock('<b>not a diagram</b>'))
    expect(html).toBe('<pre class="pele-error"><code>No diagram type detected for the given text.</code></pre>\n')
  })

  it('supports custom onError', () => {
    let caught: unknown
    const html = renderPele(createBlock('flowchart LR\n  A -->'), {
      onError: (error, block) => {
        caught = error
        return `[${block.source}]`
      },
    })
    expect(html).toBe('[flowchart LR\n  A -->]')
    expect(caught).toBeInstanceOf(PeleError)
    expect((caught as PeleError).code).toBe('syntax')
  })

  it('onError can rethrow', () => {
    const block = createBlock('nope')
    expect(() => renderPele(block, { onError: e => { throw e } })).toThrow(PeleError)
  })

  it('supports custom render', () => {
    const html = renderPele(createBlock('x', 'm'), { render: b => `<p>${b.source}|${b.meta}</p>` })
    expect(html).toBe('<p>x|m</p>')
  })
})
