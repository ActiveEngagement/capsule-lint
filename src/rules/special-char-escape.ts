import { Rule } from "htmlhint/types";
import { parse } from "../parser";

const rule: Rule = {
    id: 'spec-char-escape',
    description: 'Special characters must be escaped.',
    init(parser, reporter) {
        parser.addListener('text', (event) => {
            const raw = event.raw;
            const reSpecChar = /[<>]| \& /g;
            
            let tags = [];

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

            let match;

            for(const {start, end, tag} of tags) {
                if(tag.match(/^<#.+>$/)) {
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