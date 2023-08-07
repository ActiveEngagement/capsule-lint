const { EventTree } = require('../lib/EventTree');

module.exports = {
    id: 'img-src-required',
    description: 'The img tag must have a src attribute.',
    init(parser, reporter, options) {
        parser.addListener('tagstart', event => {
            if(event.tagName.toLowerCase() === 'img') {
                for(let attr of event.attrs) {
                    if(attr.name.toLowerCase() === 'src') {
                        return;
                    }
                }
    
                const { line, col, raw } = event;

                const message = `The [ ${event.tagName} ] tag must have a [ src ] attribute`;

                reporter.error(message, line, col, this, raw);
            }
        });
    }
}
