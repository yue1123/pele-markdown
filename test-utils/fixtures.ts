import { readdirSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const dir = new URL('../fixtures/', import.meta.url)

const normalize = (html: string) => html.replace(/>\s+</g, '><').trim()

/** 用同一批 fixtures 校验各个适配器输出一致 */
export function runFixtures(name: string, render: (markdown: string) => string | Promise<string>) {
  const cases = readdirSync(dir).filter(f => f.endsWith('.md'))
  describe(`${name} fixtures`, () => {
    for (const file of cases) {
      it(file, async () => {
        const input = readFileSync(new URL(file, dir), 'utf8')
        const expected = readFileSync(new URL(file.replace(/\.md$/, '.html'), dir), 'utf8')
        expect(normalize(await render(input))).toBe(normalize(expected))
      })
    }
  })
}
