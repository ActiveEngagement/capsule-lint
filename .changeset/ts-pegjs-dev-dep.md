---
"capsule-lint": patch
---

Move ts-pegjs to devDependencies. It is only used at build time to compile grammar.pegjs into the pre-built parser — consumers no longer see a transitive peggy peer dependency warning.
