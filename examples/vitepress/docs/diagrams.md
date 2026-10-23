# Diagram Types

pele supports every diagram type built into Mermaid. Here are some common ones.

## Flowchart

```pele
flowchart TD
  start([Start]) --> check{Signed in?}
  check -- Yes --> home[Home]
  check -- No --> login[Sign in] --> check
```

## Sequence diagram

```pele
sequenceDiagram
  Alice->>Bob: Hello
  Bob-->>Alice: Hi, how are you?
  Alice->>Bob: Great
```

## Class diagram

```pele
classDiagram
  class Animal {
    +String name
    +move()
  }
  Animal <|-- Duck
  Animal <|-- Fish
```

## State diagram

```pele
stateDiagram-v2
  [*] --> Draft
  Draft --> Review: submit
  Review --> Published: approve
  Review --> Draft: reject
  Published --> [*]
```

## ER diagram

```pele
erDiagram
  USER ||--o{ ORDER : places
  ORDER ||--|{ LINE_ITEM : contains
```

## Gantt chart

```pele
gantt
  title Release plan
  dateFormat YYYY-MM-DD
  section Build
  core      :a1, 2026-01-01, 7d
  adapters  :after a1, 5d
  section Release
  docs      :2026-01-10, 3d
```

## Pie chart

```pele
pie title Bundle size
  "core" : 45
  "markdown-it-pele" : 20
  "marked-pele" : 15
  "remark-pele" : 20
```
