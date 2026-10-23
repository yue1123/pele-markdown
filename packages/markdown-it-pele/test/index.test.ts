import MarkdownIt from 'markdown-it'
import { expect, it } from 'vitest'
import markdownItPele from '../src/index'
import { runFixtures } from '../../../test-utils/fixtures'

runFixtures('markdown-it', md => new MarkdownIt().use(markdownItPele).render(md))

it('supports custom lang and render', () => {
  const md = new MarkdownIt().use(markdownItPele, { lang: 'pl', render: b => `[${b.source}]` })
  expect(md.render('```pl\nx\n```\n')).toBe('[x]')
})
