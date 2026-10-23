// Checks the build output: every file referenced by exports exists, and each package
// loads and works by name through both ESM and CJS.
// Usage: pnpm build && node scripts/smoke-dist.mjs
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'

const packages = ['core', 'markdown-it-pele', 'marked-pele', 'remark-pele']
const FENCE = '```pele\nflowchart LR\n  A --> B\n```\n'

function collectPaths(value) {
  if (typeof value === 'string') return [value]
  return Object.values(value ?? {}).flatMap(collectPaths)
}

const loaded = {}
for (const dir of packages) {
  const root = new URL(`../packages/${dir}/`, import.meta.url)
  const pkg = JSON.parse(readFileSync(new URL('package.json', root), 'utf8'))

  for (const file of [pkg.main, pkg.module, pkg.types, ...collectPaths(pkg.exports)]) {
    assert.ok(existsSync(new URL(file, root)), `${pkg.name}: ${file} does not exist`)
  }

  // Resolve by package name (self-reference) to exercise real exports resolution and cross-package deps
  const require = createRequire(new URL('package.json', root))
  const esm = await import(pathToFileURL(require.resolve(pkg.name)).href.replace(/\.cjs$/, '.mjs'))
  const cjs = require(pkg.name)
  assert.equal(typeof (esm.default ?? esm.renderPele), 'function', `${pkg.name}: missing ESM export`)
  assert.equal(typeof (cjs.default ?? cjs.renderPele), 'function', `${pkg.name}: missing CJS export`)
  loaded[dir] = { esm, cjs, require }
}

const { esm: core } = loaded.core
assert.match(core.renderPele(core.createBlock('flowchart LR\n  A --> B')), /^<svg /)

for (const format of ['esm', 'cjs']) {
  const MarkdownIt = loaded['markdown-it-pele'].require('markdown-it')
  const mdit = loaded['markdown-it-pele'][format].default
  assert.match(new (MarkdownIt.default ?? MarkdownIt)().use(mdit).render(FENCE), /^<svg /, `markdown-it-pele (${format})`)

  const { Marked } = loaded['marked-pele'].require('marked')
  const markedPele = loaded['marked-pele'][format].default
  assert.match(new Marked(markedPele()).parse(FENCE, { async: false }), /^<svg /, `marked-pele (${format})`)
}

// The unified ecosystem is ESM-only, so only test the ESM build
const resolveEsm = name => import(pathToFileURL(loaded['remark-pele'].require.resolve(name)).href)
const [{ unified }, { default: remarkParse }, { default: remarkRehype }, { default: rehypeStringify }] = await Promise.all(
  ['unified', 'remark-parse', 'remark-rehype', 'rehype-stringify'].map(resolveEsm),
)
const html = String(
  unified()
    .use(remarkParse)
    .use(loaded['remark-pele'].esm.default)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .processSync(FENCE),
)
assert.match(html, /^<svg /, 'remark-pele (esm)')

console.log('dist smoke test passed')
