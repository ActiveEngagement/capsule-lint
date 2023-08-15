import { Rule } from 'htmlhint/types';
import { EventTree } from '../lib/EventTree';

const rule: Rule = {
    id: 'html-valid-children-order',
    description: 'The head and body tags must be in the correct order.',
    init(parser, reporter) {
        new EventTree(parser, reporter, root => {
            const html = root.findFirst('html');

            const htmlChildren = root.find('head', 'body').filter(child => {
                return !html || child.isChildOf(html);
            });

            const bodyTags = htmlChildren.filter(child => child.tagName === 'body');
            const headTags = htmlChildren.filter(child => child.tagName === 'head');

            if(bodyTags[0] && headTags[0] && bodyTags[0].isBefore(headTags[0])) {
                const { line, col, raw } = bodyTags[0];

                const message = `The [ ${bodyTags[0].tagName} ] tag must come after the [ head ] tag on line ${headTags[0].line}.`;

                reporter.error(message, line, col, this, raw);
            }
                
            if(bodyTags[0] && headTags[0] && headTags[0].isAfter(bodyTags[0])) {
                const { line, col, raw } = headTags[0];

                const message = `The [ ${headTags[0].tagName} ] tag must come before the [ body ] tag on line ${bodyTags[0].line}.`;

                reporter.error(message, line, col, this, raw);
            }
        });
    }
};

export default rule;