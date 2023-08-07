const { EventTree } = require('../lib/EventTree');

module.exports = {
    id: 'head-body-descendents-html',
    description: 'The head and body tags must be a direct child descendents of the html tag.',
    init(parser, reporter, options) {
        new EventTree(parser, reporter, root => {
            const html = root.findFirst('html');

            root.find('head', 'body')
                .filter(child => {
                    return !html || !child.isChildOf(html);
                })
                .forEach(child => {
                    const { line, col, raw } = child;
                    
                    const message = html
                        ? `The [ ${child.tagName} ] tag must be a direct child descendent of the [ html ] tag on line ${html.line}.`
                        : `The [ ${child.tagName} ] tag must be a direct child descendent of an [ html ] tag.`;

                    reporter.error(message, line, col, this, raw);
                });
        });
    }
};