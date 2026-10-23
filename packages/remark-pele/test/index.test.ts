import type { Root } from 'mdast'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import remarkStringify from 'remark-stringify'
import { unified } from 'unified'
import { expect, it } from 'vitest'
import remarkPele, { type PeleOptions } from '../src/index'
import { runContract } from '../../../test-utils/contract'
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
runContract('remark', render)

it('keeps the code node position on the html node', () => {
  const processor = unified().use(remarkParse).use(remarkPele)
  const tree = processor.runSync(processor.parse('text\n\n```pele\nflowchart LR\n  A --> B\n```\n')) as Root
  const node = tree.children[1]
  expect(node.type).toBe('html')
  expect(node.position?.start).toMatchObject({ line: 3, column: 1 })
  expect(node.position?.end).toMatchObject({ line: 6 })
})

it('replaces the fence with raw svg when stringifying back to markdown', () => {
  const md = String(unified().use(remarkParse).use(remarkPele).use(remarkStringify).processSync('```pele\nflowchart LR\n  A --> B\n```\n'))
  expect(md).toMatch(/^<svg /)
  expect(md).not.toContain('```')
})

it('drops the svg when allowDangerousHtml is off', () => {
  const html = String(
    unified().use(remarkParse).use(remarkPele).use(remarkRehype).use(rehypeStringify).processSync('```pele\nflowchart LR\n  A --> B\n```\n'),
  )
  expect(html).toBe('')
})
