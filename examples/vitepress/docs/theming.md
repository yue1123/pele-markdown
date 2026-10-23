# Theming and Errors

## Dark mode

pele takes all of its colors from CSS variables. This example maps them to VitePress theme variables in `.vitepress/theme/style.css`. Toggle dark mode in the top right and the diagrams change color without being re-rendered:

```css
.pele {
  --pele-bg: var(--vp-c-bg);
  --pele-fg: var(--vp-c-text-1);
  --pele-line: var(--vp-c-text-2);
  --pele-surface: var(--vp-c-bg-soft);
  --pele-border: var(--vp-c-divider);
  --pele-accent: var(--vp-c-brand-1);
}
```

```pele
flowchart LR
  A[Light] <--> B[Dark]
```

## Interpolation syntax in diagram text

The first node below reads <code v-pre>{{ name }}</code>. Without `v-pre`, Vue would treat it as an interpolation expression:

```pele
flowchart LR
  A["{{ name }}"] --> B[Shown as is]
```

## Syntax errors

A broken diagram doesn't fail the whole build. The error message is shown in its place:

```pele
flowchart LR
  A -->
```

To fail the build instead, rethrow in `onError`:

```ts
md.use(markdownItPele, {
  onError: error => {
    throw error
  },
})
```
