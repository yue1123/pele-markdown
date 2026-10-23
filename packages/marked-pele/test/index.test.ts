import { Marked } from 'marked'
import { expect, it } from 'vitest'
import markedPele from '../src/index'
import { runContract } from '../../../test-utils/contract'
import { runFixtures } from '../../../test-utils/fixtures'

runFixtures('marked', md => new Marked(markedPele()).parse(md, { async: false }))
runContract('marked', (md, options) => new Marked(markedPele(options)).parse(md, { async: false }))

it('works in async mode', async () => {
  const html = await new Marked(markedPele()).parse('```pele\nflowchart LR\n  A --> B\n```\n', { async: true })
  expect(html).toContain('<svg')
})

it('composes with another code renderer', () => {
  const marked = new Marked(markedPele(), { renderer: { code: ({ text }) => `<custom>${text}</custom>` } })
  expect(marked.parse('```js\nx\n```\n', { async: false })).toBe('<custom>x</custom>')
})
