---
"capsule-lint": minor
---

Expand FreeMarker grammar coverage so valid FTL is no longer flagged as invalid:

- Default (`!`) and exists (`??`) operators, e.g. `${user.name!"Friend"}`, `<#if x??>`
- Sequence and hash literals, e.g. `<#assign items = ["a", "b"]>`, `<#list ["x"] as y>`
- Multiple assignments on one directive, e.g. `<#assign x = 1 y = 2>`
- Directives previously unsupported: `#switch`/`#case`/`#default`/`#break`, `#macro`/`#function`/`#nested`/`#return`, `#include`/`#import`/`#setting`, `#items`/`#sep`, `#attempt`/`#recover`, `#escape`/`#noescape`, `#autoesc`/`#noautoesc`, `#compress`, `#noparse`, `#outputformat`, `#stop`/`#flush`/`#continue`/`#visit`/`#recurse`, and the `#t`/`#lt`/`#rt`/`#nt` whitespace directives
- User-directive (macro call) invocations, e.g. `<@button label="x" />` and `<@my.macro>...</@my.macro>`

Also fixes two rules that mis-flagged valid FreeMarker:

- `spec-char-escape` no longer reports `<`/`>`/`&` inside multi-line FreeMarker constructs or `<@...>` macro calls.
- `valid-path-format` now accepts a `${...}` interpolation as a valid `href` value.
