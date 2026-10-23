import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: 'src/index.ts',
  format: ['esm', 'cjs'],
  dts: true,
  // Emit exports.default in CJS so it matches `export default` in the .d.cts types
  cjsDefault: false,
})
