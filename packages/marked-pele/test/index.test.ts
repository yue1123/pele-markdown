import { Marked } from 'marked'
import { expect, it } from 'vitest'
import markedPele from '../src/index'
import { runFixtures } from '../../../test-utils/fixtures'

runFixtures('marked', md => new Marked(markedPele()).parse(md, { async: false }))

it('supports custom lang and render', () => {
  const marked = new Marked(markedPele({ lang: 'pl', render: b => `[${b.source}]` }))
  expect(marked.parse('```pl\nx\n```\n', { async: false })).toBe('[x]')
})
