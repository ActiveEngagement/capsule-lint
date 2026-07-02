---
"capsule-lint": patch
---

Improve the `freemarker-tags` error output when a directive fails to parse (e.g. a mistyped `<#assgn>`):

- Replaces Peggy's "expected `<#attempt>`, `<#autoesc>`, …" alternative dump with a focused message that names the offending directive (`Unrecognized`/`Malformed FreeMarker directive "<#assgn>"`).
- Confines the reported range to the failing line instead of the entire (possibly multi-line) text chunk, which the editor would otherwise underline in full.
- Salvages `<#if>`/`<#list>` opens from a failed chunk so their closing tags are no longer reported as unpaired ("no start tag") — the error stays on the directive that actually broke.
