---
"capsule-lint": patch
---

Skip the FreeMarker tokenizer for text with no FreeMarker markers.

The `freemarker-tags` and `spec-char-escape` rules ran every text chunk through the Peggy parser, which dominated whole-document lint time (~60% on a 1MB email). Every construct the grammar recognizes opens with `<#`, `</#`, `<@`, `</@` or `${`, so chunks without any marker now bypass the parse — a ~3x speedup on documents whose text is mostly plain, with identical diagnostics.
