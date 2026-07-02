// Every construct the FreeMarker grammar recognizes opens with one of these
// markers (see grammar.pegjs `char`: text runs until `</#`, `<#`, `</@`, `<@`
// or `${`). A chunk without any marker parses to a single text token — so the
// rules that tokenize text through the Peggy parser can skip it entirely.
// That parse is the expensive path: char-by-char with backtracking, it
// dominated whole-document lint time on large emails whose text is almost
// entirely marker-free.
const MARKER = /<\/?[#@]|\$\{/;

export function hasFreemarkerSyntax(text: string) {
    return MARKER.test(text);
}
