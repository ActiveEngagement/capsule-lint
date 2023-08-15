import { Rule } from 'htmlhint/types';
import { EventTree } from '../lib/EventTree';

type HeadValidChildrenPossibleTags = 'base' | 'link' | 'meta' | 'noscript' | 'script' | 'style' | 'template' | 'title';

export type HeadValidChildrenOptions = HeadValidChildrenPossibleTags | HeadValidChildrenPossibleTags[];

const rule: Rule = {
    id: 'head-valid-children',
    description: 'The head tag must only contain valid elements.',
    init(parser, reporter, options: HeadValidChildrenOptions) {
        const tags = Array.isArray(options) ? options : [
            'base', 'link', 'meta', 'noscript', 'script', 'style', 'template', 'title'
        ];

        new EventTree(parser, reporter, root => {
            for(let node of root.find('head')) {
                for(let child of node.children) {
                    if(tags.indexOf(child.tagName.toLowerCase()) > -1) {
                        return;
                    }

                    reporter.error(
                        `The [ ${child.tagName} ] tag is not allowed inside the [ head ] tag on line ${node.line}.`,
                        child.line,
                        child.col,
                        this,
                        child.raw
                    );
                }
            }
        });
    }
};

export default rule;