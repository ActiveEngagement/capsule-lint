import { Rule } from "htmlhint/types";
import { parse } from "../parser";
import { hasFreemarkerSyntax } from "../lib/freemarkerSyntax";

const rule: Rule = {
    id: 'spec-char-escape',
    description: 'Special characters must be escaped.',
    init(parser, reporter) {
        parser.addListener('text', (event) => {
            const raw = event.raw;
            const reSpecChar = /[<>]| \& /g;

            let tags = [];

            // The parse only matters when the chunk holds FreeMarker syntax
            // whose `<`/`>`/`&` must be exempted below — plain text is a
            // single segment, no need for the (expensive) tokenization. A
            // chunk that fails to parse still yields no segments, matching
            // the old behavior of skipping it.
            if(!hasFreemarkerSyntax(raw)) {
                tags = [{ start: 0, end: raw.length, tag: raw }];
            }
            else {
                try {
                    let index = 0;

                    tags = parse(raw).map(tag => {
                        const sliced = raw.slice(index);

                        const start = index;
                        const end = index + tag.length;

                        index += tag.length + sliced.indexOf(tag);

                        return {
                            start,
                            end,
                            tag
                        }
                    }).filter(Boolean)
                }
                catch(e) {
                    // Do nothing
                }
            }

            let match;

            for(const {start, end, tag} of tags) {
                // Skip FreeMarker constructs (directives, closing tags and
                // ${...} interpolations) — the `<`, `>` and `&` inside them are
                // template syntax, not HTML text that needs escaping. `[\s\S]`
                // (rather than `.`) so multi-line comments/tags are covered too.
                if(/^(?:<\/?[#@]|\$\{)[\s\S]*$/.test(tag)) {
                    continue;
                }

                while (match = reSpecChar.exec(tag)) {
                    if(!(match.index >= start && match.index <= end)) {
                        continue;
                    }

                    const { line, col } = parser.fixPos(event, match.index);

                    reporter.error(`Special characters must be escaped : [ ${match[0]} ].`, line, col, this, event.raw);
                }
            }
        });
    },
};

export default rule;
