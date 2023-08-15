import { Rule } from 'htmlhint/types';
import { EventTree } from '../lib/EventTree';

const rule: Rule = {
    id: 'html-valid-children',
    description: 'The html tag must only contain a head and body tag.',
    init(parser, reporter) {
        new EventTree(parser, reporter, root => {
            const html = root.findFirst('html');

            if(html) {
                html.children.forEach(child => {
                    if(!child.match('head', 'body')) {                        
                        const { line, col, raw } = child;

                        const message = `The [ ${child.tagName} ] tag cannot be a direct descendent of the [ html ] tag on line ${html.line}.`;

                        reporter.error(message, line, col, this, raw);
                    }
                });
            }
        });
    }
}

export default rule;