const EventTree = require("../lib/EventTree");

module.exports = {
    id: 'html-valid-content-model',
    description: 'Validates document content for proper structure, but also allows for document fragments.',
    init(parser, reporter, options) {
        new EventTree(parser, root => {
            const html = root.findFirst('html');

            // Enforce strict document model
            if(html) {
                // Throw error on all elements on the same level as the main <html> tag.
                if(!html.isFirst()) {
                    root.children.filter(child => child.tagName !== 'html')
                        .forEach(child => {
                            const { line, col, raw } = child;

                            const message = `The [ ${child.tagName} ] cannot come ${child.isBefore(html) ? 'before' : 'after'} the html tag on line ${html.line}.`;

                            reporter.error(message, line, col, this, raw);
                        });
                }

                // Throw error for any duplicate html tag.
                root.find('html')
                    .filter(subject => subject !== html)
                    .forEach(child => {
                        const { line, col, raw } = child;

                        const message = `Only one [ ${child.tagName} ] tag allowed per document.`;

                        reporter.error(message, line, col, this, raw);
                    });
                
                // Check to ensure only body and head tags are children of the html tag.
                html.children.forEach(child => {
                    if(!child.match('head', 'body')) {                        
                        const { line, col, raw } = child;

                        const message = `The [ ${child.tagName} ] tag is not allowed inside the html tag.`;

                        reporter.error(message, line, col, this, raw);
                    }
                });
            }
                
            // Check to ensure only head and children exist as children for html.
            root.find('head', 'body')
                .filter(child => {
                    return !html || !child.isChildOf(html);
                })
                .forEach(child => {       
                    const { line, col, raw } = child;

                    const message = `The [ ${child.tagName} ] tag must be a child to the html tag.`;

                    reporter.error(message, line, col, this, raw);
                });

            // Check for duplicate children inside the html tag
            const htmlChildren = root.find('head', 'body').filter(child => {
                return !html || child.isChildOf(html);
            });

            const bodyTags = htmlChildren.filter(child => child.tagName === 'body');
            const headTags = htmlChildren.filter(child => child.tagName === 'head');

            // Ensure the head and body are in the correct order.
            if(bodyTags[0] && headTags[0] && bodyTags[0].isBefore(headTags[0])) {
                const { line, col, raw } = bodyTags[0];

                const message = `The [ ${bodyTags[0].tagName} ] tag must come after the head tag on line ${headTags[0].line}.`;

                reporter.warn(message, line, col, this, raw);
            }
                
            if(bodyTags[0] && headTags[0] && headTags[0].isAfter(bodyTags[0])) {
                const { line, col, raw } = bodyTags[0];

                const message = `The [ ${headTags[0].tagName} ] tag must come before the body tag on line ${bodyTags[0].line}.`;

                reporter.warn(message, line, col, this, raw);
            }

            // Check for the remaining duplicates
            bodyTags.splice(1).concat(headTags.splice(1))
                .filter(child => html && child.isChildOf(html))
                .forEach(child => {
                    const { line, col, raw } = child;

                    const message = `The [ ${child.tagName} ] tag is a duplicate to the tag on line ${htmlChildren.find(subject => child.tagName === subject.tagName).line}.`;

                    reporter.error(message, line, col, this, raw);
                });
        });
    }
};