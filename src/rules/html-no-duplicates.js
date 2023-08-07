const { EventTree } = require('../lib/EventTree');

module.exports = {
    id: 'html-no-duplicates',
    description: 'The html tag must be a unique root element.',
    init(parser, reporter, options) {
        new EventTree(parser, reporter, root => {
            const htmls = root.find('html');

            htmls.filter(subject => subject !== htmls[0])
                .forEach(child => {
                    const { line, col, raw } = child;

                    const message = `The [ ${child.tagName} ] tag already exists on line ${htmls[0].line}.`;

                    reporter.error(message, line, col, this, raw);
                });
        });
    }
};