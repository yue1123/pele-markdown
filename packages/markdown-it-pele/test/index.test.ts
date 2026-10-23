import MarkdownIt from 'markdown-it'
import MarkdownIt14 from 'markdown-it-14'
import { expect, it } from 'vitest'
import markdownItPele from '../src/index'
import { runContract } from '../../../test-utils/contract'
import { runFixtures } from '../../../test-utils/fixtures'

runFixtures('markdown-it', md => new MarkdownIt().use(markdownItPele).render(md), { reference: true })
runContract('markdown-it', (md, options) => new MarkdownIt().use(markdownItPele, options).render(md))

it('keeps the highlight option working for other fences', () => {
  const md = new MarkdownIt({ highlight: code => `<b>${code.trim()}</b>` }).use(markdownItPele)
  expect(md.render('```js\nx\n```\n')).toContain('<b>x</b>')
})

it('delegates to a fence rule installed before it', () => {
  const md = new MarkdownIt()
  md.renderer.rules.fence = () => '<custom/>'
  md.use(markdownItPele)
  expect(md.render('```js\nx\n```\n')).toBe('<custom/>')
  expect(md.render('```pele\nflowchart LR\n  A --> B\n```\n')).toContain('<svg')
})

// Tools such as VitePress still bundle markdown-it 14, so run everything against it too
runFixtures('markdown-it@14', md => new MarkdownIt14().use(markdownItPele).render(md))
runContract('markdown-it@14', (md, options) => new MarkdownIt14().use(markdownItPele, options).render(md))
