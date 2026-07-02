---
"capsule-lint": patch
---

Fix the release workflow failing with `yaml.safeLoad is removed in js-yaml 4`.

The blanket `js-yaml: ">=4.2.0"` override forced `read-yaml-file` (a transitive
dependency of `@changesets/cli`) onto js-yaml 4, which removed the `safeLoad` API
it still calls. Scope the override so `read-yaml-file` stays on js-yaml 3.x while
keeping a `js-yaml@<3.13.1` guard to preserve the original security fix. `pnpm
audit` reports no known vulnerabilities.
