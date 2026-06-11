---
"capsule-lint": minor
---

Add htmlLinting option and improve FreeMarker grammar support

- Add `htmlLinting: false` option to `lint()` to suppress HTML errors for plain-text email use cases
- Fix FreeMarker syntax error positions being reported relative to HTML chunks instead of the full document
- Support parenthesized expressions with modifiers: `${(hpcAmount?number*0.5)?round}`
- Support arithmetic in parentheses: `${(a+b)*c}`
- Add FreeMarker comment support: `<#-- ... -->`
- Fix operator ordering to correctly handle `==`, `!=`, `<=`, `>=`
- Add `<#local>` and `<#global>` assign directives
- Support modulo operator `%`
