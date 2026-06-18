---
"capsule-lint": patch
---

Fix `invalid-attribute-char` falsely rejecting the digit `0` in attribute names. The allowed-character pattern used the range `1-9` instead of `0-9`, so valid names such as `data-0` or `col0` were reported as errors.
