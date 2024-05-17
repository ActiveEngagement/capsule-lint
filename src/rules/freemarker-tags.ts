import { Block } from 'htmlhint/htmlparser';
import { Rule } from 'htmlhint/types';
import { PeggySyntaxError, parse } from '../parser';

const rule: Rule =  {
    id: 'freemarker-tags',
    description: 'Validate Freemarker tags.',
    init(parser, reporter) {
        const stack: {
            tag: string,
            event: Block
        }[] = [];

        const blockTags = ['#if', '#list'];
        const pattern = new RegExp(`^<(${blockTags.join('|')})`)

        parser.addListener('text', (event) => {
            try {
                for(const tag of parse(event.raw)) {
                    if(tag.match(pattern)) {
                        stack.push({ tag, event });
                    }
                }
            }
            catch(error) {
                if(error instanceof PeggySyntaxError) {
                    reporter.error(
                        error.message,
                        error.location.start.line,                    
                        error.location.start.column,
                        this,
                        event.raw
                    );
                }
            }
        });

        parser.addListener('tagend', (event) => {
            if(!blockTags.includes(event.tagName)) {
                return;
            }

            if(!stack.length) {
                reporter.error(`Conditional must be paired, no start tag: [ ${event.raw} ]`, event.line, event.col, this, event.raw);
            }

            stack.pop();
        });

        parser.addListener('end', () => {
            for(const { tag, event } of stack) {
                reporter.error(`Tag [${tag}] is missing a closing tag: [</${tag.match(pattern)[1]}>]`, event.line, event.col, this, event.raw)
            }
        })
    },
};

export default rule;