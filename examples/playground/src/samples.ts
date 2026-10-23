export interface Sample {
  name: string
  source: string
}

const fence = '```'

export const samples: Sample[] = [
  {
    name: 'Getting started',
    source: `# Hello pele

Write a \`pele\` code block using [Mermaid](https://mermaid.js.org) syntax and it becomes an SVG:

${fence}pele
flowchart LR
  A[Markdown] --> B[pele] --> C[SVG]
${fence}

\`\` ${fence}mermaid \`\` blocks work too, because this playground passes \`lang: ['pele', 'mermaid']\`:

${fence}mermaid
sequenceDiagram
  participant U as User
  participant P as Parser
  U->>P: Markdown
  P-->>U: HTML + SVG
${fence}

Other code blocks are left alone:

${fence}ts
const answer = 42
${fence}
`,
  },
  {
    name: 'Flow and structure',
    source: `## Flowchart

${fence}pele
flowchart TD
  start([Start]) --> check{Signed in?}
  check -- Yes --> home[Home]
  check -- No --> login[Sign in] --> check
${fence}

## Sequence diagram

${fence}pele
sequenceDiagram
  Alice->>Bob: Hello
  Bob-->>Alice: Hi, how are you?
  Alice->>Bob: Great
${fence}

## Class diagram

${fence}pele
classDiagram
  class Animal {
    +String name
    +move()
  }
  Animal <|-- Duck
  Animal <|-- Fish
${fence}

## State diagram

${fence}pele
stateDiagram-v2
  [*] --> Draft
  Draft --> Review: submit
  Review --> Published: approve
  Review --> Draft: reject
  Published --> [*]
${fence}

## ER diagram

${fence}pele
erDiagram
  USER ||--o{ ORDER : places
  ORDER ||--|{ LINE_ITEM : contains
${fence}

## Block diagram

${fence}pele
block-beta
  columns 3
  a["Markdown"] b["Parser"] c["SVG"]
  a --> b
  b --> c
${fence}

## Architecture

${fence}pele
architecture-beta
  group app(cloud)[App]
  service web(internet)[Web] in app
  service api(server)[API] in app
  service db(database)[Database] in app
  web:R --> L:api
  api:R --> L:db
${fence}

## C4 context

${fence}pele
C4Context
  title Docs site
  Person(author, "Author")
  System(site, "Docs site", "Built with markdown-it-pele")
  Rel(author, site, "Writes Markdown")
${fence}

## Requirement diagram

${fence}pele
requirementDiagram
  requirement render {
    id: 1
    text: Render diagrams at build time
    risk: low
    verifymethod: test
  }
  element adapters {
    type: package
  }
  adapters - satisfies -> render
${fence}
`,
  },
  {
    name: 'Charts and data',
    source: `## Pie chart

${fence}pele
pie title Bundle size
  "core" : 45
  "markdown-it-pele" : 20
  "marked-pele" : 15
  "remark-pele" : 20
${fence}

## XY chart

${fence}pele
xychart-beta
  title "Weekly downloads"
  x-axis [Mon, Tue, Wed, Thu, Fri]
  y-axis "Downloads" 0 --> 500
  bar [120, 230, 310, 280, 420]
  line [120, 230, 310, 280, 420]
${fence}

## Quadrant chart

${fence}pele
quadrantChart
  title Effort vs impact
  x-axis Low effort --> High effort
  y-axis Low impact --> High impact
  quadrant-1 Plan
  quadrant-2 Do now
  quadrant-3 Skip
  quadrant-4 Delegate
  Docs: [0.3, 0.8]
  Tests: [0.6, 0.7]
  Logo: [0.2, 0.2]
${fence}

## Sankey

${fence}pele
sankey-beta
Markdown,markdown-it,40
Markdown,marked,35
Markdown,remark,25
markdown-it,SVG,40
marked,SVG,35
remark,SVG,25
${fence}

## Radar

${fence}pele
radar-beta
  title Adapter features
  axis s["Speed"], c["Compat"], d["Docs"], t["Types"]
  curve a["markdown-it"]{4, 5, 4, 5}
  curve b["marked"]{5, 4, 3, 4}
${fence}

## Treemap

${fence}pele
treemap-beta
"Bundle"
  "pele": 70
  "Adapters"
    "markdown-it-pele": 10
    "marked-pele": 8
    "remark-pele": 12
${fence}

## Venn diagram

${fence}pele
venn-beta
  set A["markdown-it"]
  set B["marked"]
  union A,B["CommonMark"]
${fence}

## Packet diagram

${fence}pele
packet-beta
  0-15: "Source port"
  16-31: "Destination port"
  32-63: "Sequence number"
${fence}
`,
  },
  {
    name: 'Planning and time',
    source: `## Gantt chart

${fence}pele
gantt
  title Release plan
  dateFormat YYYY-MM-DD
  section Build
  core      :a1, 2026-01-01, 7d
  adapters  :after a1, 5d
  section Release
  docs      :2026-01-10, 3d
${fence}

## Timeline

${fence}pele
timeline
  title Release history
  2025 : core
       : markdown-it-pele
  2026 : marked-pele
       : remark-pele
${fence}

## User journey

${fence}pele
journey
  title Writing docs
  section Draft
    Outline: 4: Me
    Write: 3: Me
  section Review
    Feedback: 2: Me, Reviewer
    Publish: 5: Me
${fence}

## Git graph

${fence}pele
gitGraph
  commit
  branch feature
  checkout feature
  commit
  commit
  checkout main
  merge feature
  commit
${fence}

## Kanban

${fence}pele
kanban
  todo[Todo]
    t1[Write docs]
  doing[In progress]
    t2[Playground]
  done[Done]
    t3[Adapters]
${fence}

## Mindmap

${fence}pele
mindmap
  root((pele))
    Parsers
      markdown-it
      marked
      remark
    Output
      SVG
      CSS variables
${fence}
`,
  },
  {
    name: 'Nesting',
    source: `Diagrams inside lists and blockquotes:

- A list item

  ${fence}pele
  flowchart LR
    A --> B
  ${fence}

> ${fence}pele
> pie
>   "a": 1
>   "b": 2
> ${fence}
`,
  },
  {
    name: 'Syntax errors',
    source: `A broken diagram doesn't break the page. The error is shown in its place:

${fence}pele
flowchart LR
  A -->
${fence}

The rest of the document still renders.
`,
  },
]
