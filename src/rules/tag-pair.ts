import { Block } from 'htmlhint/htmlparser';
import { Rule } from 'htmlhint/types';

const rule: Rule =  {
    id: 'tag-pair',
    description: 'Tag must be paired.',
    init(parser, reporter) {
        const stack: Block[] = [];
        const mapEmptyTags = parser.makeMap(
            'area,base,basefont,br,col,frame,hr,img,input,isindex,link,meta,param,embed,track,command,source,keygen,wbr'
        );

        parser.addListener('tagstart', (event) => {
            const tagName = event.tagName.toLowerCase();
            
            if (mapEmptyTags[tagName] === undefined && !event.close) {
                stack.push({ tagName, ...event });
            }
        });

        parser.addListener('tagend', (event) => {
            const tagName = event.tagName.toLowerCase();
            
            if(tagName === '#if') {
                return;
            }

            let pos;

            for (pos = stack.length - 1; pos >= 0; pos--) {
                if (stack[pos].tagName === tagName) {
                    break;
                }
            }

            if (pos >= 0) {
                const arrTags = [];

                for (let i = stack.length - 1; i > pos; i--) {
                    arrTags.push(`</${stack[i].tagName}>`);
                }

                if (arrTags.length > 0) {
                    const lastEvent = stack[stack.length - 1];
                    
                    reporter.error(
                        `Tag must be paired, missing: [ ${arrTags.join('')} ], start tag match failed [ ${lastEvent.raw} ] on line ${lastEvent.line}.`,
                        lastEvent.line,
                        lastEvent.col,
                        this,
                        lastEvent.raw
                    );
                }

                stack.length = pos;
            }
            else {
                reporter.error(
                    `Tag must be paired, no start tag: [ ${event.raw} ]`,
                    event.line,
                    event.col,
                    this,
                    event.raw
                );
            }
        });

        parser.addListener('end', (event) => {
            for (let i = stack.length - 1; i >= 0; i--) {
                reporter.error(
                    `Tag must be paired, missing: [ </${stack[i].tagName}> ], start tag match failed [ ${stack[i].raw} ] on line ${stack[i].line}.`,
                    stack[i].line, 
                    stack[i].col,
                    this,
                    stack[i].raw
                );
            }
        });
    },
};

export default rule;