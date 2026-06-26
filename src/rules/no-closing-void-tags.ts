import { Rule } from 'htmlhint/types';

const rule: Rule = {
    id: 'no-closing-void-tags',
    description: 'Void elements cannot have closing tags.',
    init(parser, reporter) {
        const voidTags = parser.makeMap(
            'area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr'
        );

        parser.addListener('tagend', event => {
            const tagName = event.tagName.toLowerCase();

            if (voidTags[tagName] !== undefined) {
                reporter.error(
                    `The [ ${tagName} ] tag is a void element and cannot have a closing tag.`,
                    event.line,
                    event.col,
                    this,
                    event.raw
                );
            }
        });
    },
};

export default rule;
