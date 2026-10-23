import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import { expect, it } from 'vitest'
import remarkPele, { type PeleOptions } from '../src/index'
import { runFixtures } from '../../../test-utils/fixtures'

const render = (md: string, options?: PeleOptions) =>
  String(
    unified()
      .use(remarkParse)
      .use(remarkPele, options)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeStringify, { allowDangerousHtml: true })
      .processSync(md),
  )

runFixtures('remark', md => render(md))

it('supports custom lang and render', () => {
  expect(render('```pl\nx\n```\n', { lang: 'pl', render: b => `[${b.source}]` })).toBe('[x]')
})
