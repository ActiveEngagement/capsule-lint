module.exports = {
    id: 'invalid-attribute-char',
    description: 'Invalid attribute character.',
    init(parser, reporter, chars) {
        chars = typeof chars === 'string' ? chars : '[^a-zA-Z_-]';
        
        parser.addListener('tagstart', event => {
            for(let attr of event.attrs) {
                const match = attr.name.match(
                    new RegExp(chars, 'g')
                );

                if(match) {
                    const { line, col } = event;
                    const message = `The [ ${attr.name} ] attribute contains an invalid character${match.length > 1 ? 's: ' : ''} [ ${match.join(', ')} ]`;
                    const index = event.raw.indexOf(attr.name);

                    reporter.error(message, line, col + index - 1, this, attr.raw);
                }
            }
        });
    }
}
