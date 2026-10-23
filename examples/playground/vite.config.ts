import { defineConfig } from 'vite'

export default defineConfig({
  // Relative asset paths so the build can be hosted under any sub-path
  base: './',
  // pele plus three Markdown libraries is one large bundle by design
  build: { chunkSizeWarningLimit: 1200 },
})
