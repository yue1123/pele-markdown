import { expect, it, vi } from 'vitest'
import { createBlock, renderPele } from '@pele-markdown/core'

vi.mock('pele', async importOriginal => ({
  ...(await importOriginal<typeof import('pele')>()),
  render: () => {
    throw 'boom <x>'
  },
}))

it('renders non-Error throws as text', () => {
  expect(renderPele(createBlock('flowchart LR'))).toBe('<pre class="pele-error"><code>boom &lt;x&gt;</code></pre>\n')
})
