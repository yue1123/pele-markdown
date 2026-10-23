import type MarkdownIt14 from 'markdown-it-14'
import type { MarkdownIt } from 'markdown-it'
import { expectTypeOf, it } from 'vitest'
import markdownItPele from '../src/index'

it('accepts markdown-it 14 and 15 instances', () => {
  expectTypeOf((md: MarkdownIt) => md.use(markdownItPele, { lang: 'pele' })).toBeFunction()
  expectTypeOf((md: MarkdownIt14) => md.use(markdownItPele, { lang: 'pele' })).toBeFunction()
})
