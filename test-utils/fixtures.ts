import { readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const dir = new URL('../fixtures/', import.meta.url)

// Libraries differ in whitespace between tags, so normalize it before comparing
const normalize = (html: string) => html.replace(/>\s*</g, '>\n<').trim() + '\n'

/**
 * Checks that every adapter renders the shared fixtures identically.
 * Expected output lives in the matching .html file; regenerate it with `pnpm test:update`.
 * Only the `reference` adapter writes snapshots; the others always compare strictly,
 * so `-u` cannot let adapters overwrite each other's output.
 */
export function runFixtures(
  name: string,
  render: (markdown: string) => string | Promise<string>,
  { reference = false } = {},
) {
  const cases = readdirSync(dir).filter(f => f.endsWith('.md'))
  describe(`${name} fixtures`, () => {
    for (const file of cases) {
      it(file, async () => {
        const input = readFileSync(new URL(file, dir), 'utf8')
        const expected = fileURLToPath(new URL(file.replace(/\.md$/, '.html'), dir))
        const actual = normalize(await render(input))
        if (reference) await expect(actual).toMatchFileSnapshot(expected)
        else expect(actual).toBe(readFileSync(expected, 'utf8'))
      })
    }
  })
}
