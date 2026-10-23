import markdownItPele, { renderPele } from 'markdown-it-pele'
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'markdown-it-pele',
  description: 'Render Mermaid diagrams in VitePress with pele',
  markdown: {
    config(md) {
      md.use(markdownItPele, {
        // Also handle ```mermaid so existing docs work unchanged
        lang: ['pele', 'mermaid'],
        // VitePress compiles Markdown into Vue templates; wrap the output in v-pre
        // so {{ }} in diagram text isn't treated as interpolation
        render: block => `<div class="pele-diagram" v-pre>${renderPele(block)}</div>`,
      })
    },
  },
  themeConfig: {
    nav: [{ text: 'pele', link: 'https://pele.run' }],
    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Getting Started', link: '/' },
          { text: 'Diagram Types', link: '/diagrams' },
          { text: 'Theming and Errors', link: '/theming' },
        ],
      },
    ],
  },
})
