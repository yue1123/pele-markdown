import MarkdownIt from 'markdown-it'
import markdownItPele from 'markdown-it-pele'
import { Marked } from 'marked'
import markedPele from 'marked-pele'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkPele from 'remark-pele'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'

export interface Renderer {
  id: string
  name: string
  /** Shown in the setup panel; keep in sync with `render` */
  setup: string
  render: (markdown: string) => string
}

// Every adapter gets the same options so the outputs are comparable
const options = { lang: ['pele', 'mermaid'] }

const md = new MarkdownIt().use(markdownItPele, options)

const marked = new Marked(markedPele(options))

const processor = unified()
  .use(remarkParse)
  .use(remarkPele, options)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeStringify, { allowDangerousHtml: true })

export const renderers: Renderer[] = [
  {
    id: 'markdown-it',
    name: 'markdown-it',
    setup: `import MarkdownIt from 'markdown-it'
import markdownItPele from 'markdown-it-pele'

const md = new MarkdownIt()
  .use(markdownItPele, { lang: ['pele', 'mermaid'] })

md.render(markdown)`,
    render: source => md.render(source),
  },
  {
    id: 'marked',
    name: 'marked',
    setup: `import { Marked } from 'marked'
import markedPele from 'marked-pele'

const marked = new Marked(
  markedPele({ lang: ['pele', 'mermaid'] }),
)

marked.parse(markdown)`,
    render: source => marked.parse(source, { async: false }),
  },
  {
    id: 'remark',
    name: 'remark',
    setup: `import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkPele from 'remark-pele'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'

const processor = unified()
  .use(remarkParse)
  .use(remarkPele, { lang: ['pele', 'mermaid'] })
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeStringify, { allowDangerousHtml: true })

processor.processSync(markdown).toString()`,
    render: source => processor.processSync(source).toString(),
  },
]
