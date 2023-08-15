import { Rule } from 'htmlhint/types';
import { EventTree } from '../lib/EventTree';

const rule: Rule = {
    id: 'head-body-descendents-html',
    description: 'The head and body tags must be a direct child descendents of the html tag.',
    init(parser, reporter) {
        new EventTree(parser, reporter, root => {
            const html = root.findFirst('html');

            root.find('head', 'body')
                .filter(child => {
                    return !html || !child.isChildOf(html);
                })
                .forEach(child => {
                    const { line, col, raw } = child;
                    
                    const message = html
                        ? `The [ ${child.tagName} ] tag must be a direct child descendent of the [ html ] tag on line ${html.line}.`
                        : `The [ ${child.tagName} ] tag must be a direct child descendent of an [ html ] tag.`;

                    reporter.error(message, line, col, this, raw);
                });
        });
    }
};

export default rule;