---
"capsule-lint": minor
---

Enable the `attr-value-no-duplication` rule in the default config.

HTMLHint 1.9.x (already in range via `^1.1.4`) added this rule, which flags
duplicate values within an attribute (e.g. `class="btn btn"`). It checks
`class` by default and is configurable to other attributes.
