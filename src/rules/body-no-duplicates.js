const { EventTree } = require('../lib/EventTree');

module.exports = {
    id: 'body-no-duplicates',
    description: 'The body tag must not be a duplicate.',
    init(parser, reporter, options) {
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