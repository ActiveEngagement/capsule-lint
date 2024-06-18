import { Reporter } from 'htmlhint';
import { Block } from 'htmlhint/htmlparser';
import { Rule } from 'htmlhint/types';
import { PeggySyntaxError, parse } from '../parser';

function isMatchingTag(tagName: string, tag: string) {
    return !!tag.match(new RegExp(`^<${tagName}`));
}

type Tag = {
    open: boolean
    raw: string;
    tagName: string
    event: Block;
};

class BlockTag {
    parent?: BlockTag;
    openTag?: Tag;
    closeTag?: Tag;
    children: BlockTag[];

    constructor(tag?: Tag, parent?: BlockTag) {
        if(tag && tag.open) {
            this.openTag = tag;
        }
        else if(tag && !tag.open) {
            this.closeTag = tag;
        }

        this.parent = parent;
        this.children = [];
    }
}

function createTree(stack: Tag[]) {
    const root: BlockTag = new BlockTag();

    let currentTag: BlockTag = root;

    for(const tag of stack) {
        if(tag.open) {
            currentTag.children.push(
                currentTag = new BlockTag(tag, currentTag)
            );
        }
        else if(!tag.open && currentTag.openTag?.tagName === tag.tagName) {
            currentTag.closeTag = tag;
            currentTag = currentTag.parent
        }
        else {
            currentTag.children.push(new BlockTag(tag, currentTag.parent ?? root));
        }
    }

    return root;
}

function lintTree(nodes: BlockTag[], reporter: Reporter, rule: Rule) {
    for(const node of nodes) {
        if(node.children) {
            lintTree(node.children, reporter, rule)
        }

        if(node.openTag && node.closeTag) {
            continue;
        }
        else if(node.openTag) {
            reporter.error(
                `Tag [${node.openTag.raw}] is missing a closing tag: [</${node.openTag.tagName}>]`,
                node.openTag.event.line,
                node.openTag.event.col, 
                rule,
                node.openTag.raw
            );
        }
        else if(node.closeTag) {
            reporter.error(`Tag must be paired, no start tag: [ ${node.closeTag.raw} ]`, node.closeTag.event.line, node.closeTag.event.col, rule, node.closeTag.event.raw);
        }
    }
}

const rule: Rule =  {
    id: 'freemarker-tags',
    description: 'Validate Freemarker tags.',
    init(parser, reporter) {
        const stack: Tag[] = [];

        const blockTags = ['#if', '#list'];
        const pattern = new RegExp(`^<(${blockTags.join('|')})`)
        
        parser.addListener('text', (event) => {
            try {
                for(const tag of parse(event.raw)) {
                    const match = tag.match(pattern);

                    if(match) {
                        stack.push({
                            event,
                            raw: tag,
                            tagName: match[1],
                            open: true
                        });
                    }
                }
            }
            catch(error) {
                if(error instanceof PeggySyntaxError) {
                    reporter.error(
                        error.message,
                        error.location.start.line,                    
                        error.location.start.column,
                        this,
                        event.raw
                    );
                }
            }
        });

        parser.addListener('tagend', (event) => {
            if(!blockTags.includes(event.tagName)) {
                return;
            }

            stack.push({
                raw: event.raw,
                tagName: event.tagName,
                event,
                open: false
            });
        });

        parser.addListener('end', () => {
            lintTree(createTree(stack).children, reporter, this);      
        })
    },
};

export default rule;