import { describe, expect, it } from 'vitest'
import { createBlock, isPeleLang, parseInfo, renderPele } from 'pele-core'

describe('pele-core', () => {
  it('parses info string', () => {
    expect(parseInfo('pele title="a b"')).toEqual({ lang: 'pele', meta: 'title="a b"' })
    expect(parseInfo('  pele  ')).toEqual({ lang: 'pele', meta: '' })
    expect(parseInfo(undefined)).toEqual({ lang: '', meta: '' })
  })

  it('matches custom lang', () => {
    expect(isPeleLang('pele')).toBe(true)
    expect(isPeleLang('pl', { lang: 'pl' })).toBe(true)
    expect(isPeleLang('js')).toBe(false)
  })

  it('strips one trailing newline', () => {
    expect(createBlock('a\n\n').source).toBe('a\n')
  })

  it('escapes html by default', () => {
    expect(renderPele(createBlock('<b>'))).toBe('<div class="pele">&lt;b&gt;</div>\n')
  })

  it('supports custom render', () => {
    const html = renderPele(createBlock('x', 'm'), { render: b => `<p>${b.source}|${b.meta}</p>` })
    expect(html).toBe('<p>x|m</p>')
  })
})
