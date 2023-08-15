import { Rule } from 'htmlhint/types';
import { EventTree } from '../lib/EventTree';

const rule: Rule = {
    id: 'body-no-duplicates',
    description: 'The body tag must not be a duplicate.',
    init(parser, reporter) {
        new EventTree(parser, reporter, root => {
            let body;

            for(let node of root.find('body')) {
                if(!body) {
                    body = node;

                    continue;
                }

                reporter.error(
                    `The [ body ] tag already exists on line ${body.line}.`,
                    node.line,
                    node.col,
                    this,
                    node.raw
                );
            }
        });
    }
};

export default rule;