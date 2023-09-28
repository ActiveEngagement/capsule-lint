import { Rule } from "htmlhint/types";
import { parse } from "../parser";

const rule: Rule = {
    id: 'spec-char-escape',
    description: 'Special characters must be escaped.',
    init(parser, reporter) {
        parser.addListener('text', (event) => {
            const raw = event.raw;
            const reSpecChar = /[<>]| \& /g;
            let match;
            
            while (match = reSpecChar.exec(raw)) {
                const fixedPos = parser.fixPos(event, match.index);

                try {
                    const tags = parse(raw);

                    if(tags.length) {
                        for(const tag of tags) {
                            const start = raw.indexOf(tag);
                            const end = start + tag.length - 1;

                            if(match.index >= start && match.index <= end) {
                                continue;
                            }

                            reporter.error(`Special characters must be escaped : [ ${match[0]} ].`, fixedPos.line, fixedPos.col, this, event.raw);
                        }
                    }
                    else {
                        reporter.error(`Special characters must be escaped : [ ${match[0]} ].`, fixedPos.line, fixedPos.col, this, event.raw);
                    }
                }
                catch(e) {
                    // Do nothing
                }
            }
        });
    },
};

export default rule;