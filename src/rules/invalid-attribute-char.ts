import { Rule } from 'htmlhint/types';

const rule: Rule ={
    id: 'invalid-attribute-char',
    description: 'Attribute must contain valid characters.',
    init(parser, reporter) {
        parser.addListener('tagstart', event => {
            let offset = 1;

            event.attrs.forEach(({ name, index }) => {
                offset += event.raw.slice(offset).indexOf(name);
                
                let pos = 0;

                const matches = name.match(/[^a-zA-Z:\-1-9]/g);
                    
                if(matches) {
                    while(matches.length) {
                        const slice = name.slice(pos),
                            char = matches.shift(),
                            index = slice.indexOf(char);

                        reporter.error(
                            `[ ${char} ] character cannot be used for attribute names.`,
                            event.line,
                            event.col + offset + pos + index,
                            this,
                            char
                        );
                    
                        pos += index + 1;
                    }
                }
            })
        });
    }
}

export default rule;