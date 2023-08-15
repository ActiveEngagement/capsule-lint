import { Rule } from 'htmlhint/types';
import { EventTree } from '../lib/EventTree';

const rule: Rule = {
    id: 'head-no-duplicates',
    description: 'The head tag must not be a duplicate.',
    init(parser, reporter) {
        new EventTree(parser, reporter, root => {
            let head;

            for(let node of root.find('head')) {
                if(!head) {
                    head = node;

                    continue;
                }

                reporter.error(
                    `The [ head ] tag is a duplicate of the tag on line ${head.line}.`,
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