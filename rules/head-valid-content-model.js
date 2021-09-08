module.exports = {
    id: 'head-valid-content-model',
    description: 'The head tag must only contain valid elements.',
    init(parser, reporter, options) {
        const tags = Array.isArray(options) ? options : [
            'base', 'link', 'meta', 'noscript', 'script', 'style', 'template', 'title'
        ];

        const onTagEnd = event => {
            if(event.tagName === 'head') {
                parser.removeListener('tagstart', onChildrenTagStart);
            }
        };
        
        const onTagStart = event => {
            if(event.tagName === 'head') {
                parser.addListener('tagstart', onChildrenTagStart);
            }
        };

        const onChildrenTagStart = event => {
            // Ignore if an approved tag.
            if(tags.indexOf(event.tagName.toLowerCase()) > -1) {
                return;
            }

            reporter.warn(
                `The [ ${event.tagName} ] tag is not allowed inside the head tag.`,
                event.line,
                event.col,
                this,
                event.raw
            );
        };
        
        parser.addListener('tagstart', onTagStart);
        parser.addListener('tagend', onTagEnd);
    }
};