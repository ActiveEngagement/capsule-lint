const { EventTree } = require('../lib/EventTree');

module.exports = {
    id: 'html-root-node',
    description: 'The html tag must be the only root node in the document.',
    init(parser, reporter, options) {
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