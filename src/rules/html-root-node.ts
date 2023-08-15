import { Rule } from 'htmlhint/types';
import { EventTree } from '../lib/EventTree';

const rule: Rule = {
    id: 'html-root-node',
    description: 'The html tag must be the only root node in the document.',
    init(parser, reporter) {
        new EventTree(parser, reporter, root => {
            const html = root.findFirst('html');

            if(html) {
                root.children.filter(child => child.tagName !== 'html')
                    .forEach(child => {
                        const { line, col, raw } = child;

                        const message = `The [ ${child.tagName} ] cannot come ${child.isBefore(html) ? 'before' : 'after'} the [ html ] tag on line ${html.line}.`;

                        reporter.error(message, line, col, this, raw);
                    });
            }
        });
    }
};

export default rule;