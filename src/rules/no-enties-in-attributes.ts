import { Rule } from 'htmlhint/types';

const rule: Rule = {
    id: 'no-enties-in-attributes',
    description: 'No HTML entities within tag attributes.',
    init(parser, reporter) {
        parser.addListener('tagstart', event => {
            event.attrs.forEach(({ value, name }) => {
                value.split(/[\n\r\v]/gi).reduce(({ line, col }, str) => {
                    const matches = str.match(
                        /&([a-z0-9]+|#[0-9]{1,6}|#x[0-9a-fA-F]{1,6});/ig
                    );

                    if(!matches) {
                        return {
                            line: line + 1,
                            col: 0
                        };
                    }

                    let offset = 0;

                    for(const match of matches) {
                        const index = str.indexOf(match, offset);

                        reporter.error(
                            `Invalid entity [ ${match} ] encapsulated in the [ ${name} ] attribute on line ${line}.`,
                            line,
                            col + index + 1,
                            this,
                            match
                        );
                        
                        offset = str.indexOf(match, offset) + match.length;
                    }

                    return {
                        line: line + 1,
                        col: 0
                    };
                }, {
                    line: event.line,
                    col: event.raw.indexOf(value)
                });
            });
        });
    }
}

export default rule;