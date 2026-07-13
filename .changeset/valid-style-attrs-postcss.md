---
"capsule-lint": minor
---

Validate CSS with a real parser instead of string-splitting, and extend
coverage to `<style>` blocks.

`valid-style-attrs` previously validated inline `style` attributes with a
hand-rolled split-on-`;` heuristic that missed structural errors — most notably
a missing semicolon that silently merges two declarations
(e.g. `font-family:...sans-serif background-color:transparent`), which then made
`capsule-capsulate` throw downstream. It now parses each chunk with PostCSS (the
same engine capsulate uses to inline styles via juice) and inspects the parsed
AST for empty properties/values, so anything that lints clean is safe downstream
and no regex is involved. The rule also now validates the CSS inside `<style>`
blocks, reporting errors at their true document line/column, not just inline
`style` attributes.
