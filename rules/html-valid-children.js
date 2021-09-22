const { EventTree } = require('../lib/EventTree');

module.exports = {
    id: 'html-valid-children',
    description: 'The html tag must only contain a head and body tag.',
    init(parser, reporter, options) {
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
