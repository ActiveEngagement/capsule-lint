const { EventTree } = require('../lib/EventTree');

module.exports = {
    id: 'head-no-duplicates',
    description: 'The head tag must not be a duplicate.',
    init(parser, reporter, options) {
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