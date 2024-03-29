import { Block } from "htmlhint/htmlparser";
import { Rule } from 'htmlhint/types';

const rule: Rule = {
    id: 'nested-paragraphs',
    description: 'Nested paragraphs are prohibited.',
    init(parser, reporter) {
        let openingTag: Block|undefined;
        
        const stack = [];

        parser.addListener('tagstart', event => {
            if(event.tagName.toLowerCase() === 'p') {
                if(openingTag) {
                    stack.push(event);
                }
                else {
                    openingTag = event;
                }
            }
        });

        parser.addListener('tagend', event => {
            const isParagraph = event.tagName.toLowerCase() === 'p';

            if(openingTag && isParagraph) {
                const [ start ] = stack.splice(stack.length - 1);

                if(!start) {
                    openingTag = undefined;

                    return;
                }
                
                reporter.error(
                    `[ p ] tags cannot be nested inside the [ p ] tag on line ${openingTag.line}.`,
                    start.line,
                    start.col,
                    this,
                    reporter.html.slice(start.pos, event.pos + event.raw.length)
                );
            }
            else if(!isParagraph) {
                openingTag = undefined;
            }
        });

        parser.addListener('end', event => {
            if(openingTag && stack.length) {
                stack.forEach(start => {
                    reporter.error(
                        `[ p ] tags cannot be nested inside the [ p ] tag on line ${openingTag.line}.`,
                        start.line,
                        start.col,
                        this,
                        reporter.html.slice(start.pos, event.lastEvent.pos + event.lastEvent.raw.length)
                    );
                });
            }
        });
    }
}

export default rule;