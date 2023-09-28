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

        parser.addListener('text', (event) => {
            try {
                for(const tag of parse(event.raw)) {
                    if(tag.match(/^<#if/)) {
                        stack.push({ tag, event  });
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
            if(event.tagName !== '#if') {
                return;
            }

            if(!stack.length) {
                reporter.error(`Conditional must be paired, no start tag: [ ${event.raw} ]`, event.line, event.col, this, event.raw);
            }

            stack.pop();
        });

        parser.addListener('end', () => {
            for(const { tag, event } of stack) {
                reporter.error(`Conditional [${tag}] is missing a closing tag: [</#if>]`, event.line, event.col, this, event.raw)
            }
        })
    },
};

export default rule;