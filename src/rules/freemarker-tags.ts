import { Reporter } from 'htmlhint';
import { Block } from 'htmlhint/htmlparser';
import { Rule } from 'htmlhint/types';
import { PeggySyntaxError, parse } from '../parser';
import { hasFreemarkerSyntax } from '../lib/freemarkerSyntax';

// Known FreeMarker directive names, used only to tailor the parse-error message
// (a recognized name that fails to parse is malformed; an unrecognized one is a
// typo or unsupported directive).
const KNOWN_DIRECTIVES = new Set([
    'if', 'elseif', 'else', 'list', 'sep', 'items', 'switch', 'case', 'default',
    'break', 'macro', 'function', 'nested', 'return', 'attempt', 'recover',
    'escape', 'noescape', 'autoesc', 'noautoesc', 'compress', 'noparse',
    'outputformat', 'assign', 'local', 'global', 'include', 'import', 'setting',
    'stop', 'flush', 'continue', 'visit', 'recurse', 't', 'lt', 'rt', 'nt',
    'fallback'
]);

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
            // No FreeMarker markers → the parse would yield only plain text;
            // skip it (it's by far the hottest path on large documents).
            if(!hasFreemarkerSyntax(event.raw)) {
                return;
            }

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
                    const pegLine = error.location.start.line;
                    const pegCol = error.location.start.column;
                    const absoluteLine = event.line + pegLine - 1;
                    const absoluteCol = pegLine === 1 ? event.col + pegCol - 1 : pegCol;

                    const rest = event.raw.slice(error.location.start.offset);
                    const lineEnd = rest.indexOf('\n');

                    // Confine the highlighted range to the line where parsing
                    // failed rather than the entire (possibly multi-line) chunk,
                    // which the editor would otherwise underline in full.
                    const raw = lineEnd === -1 ? rest : rest.slice(0, lineEnd);

                    // Replace Peggy's "expected <every directive> but ... found"
                    // dump with a focused message when the failure is a directive.
                    const directive = rest.match(/^<\/?#([a-zA-Z_]\w*)/);
                    const message = directive
                        ? (KNOWN_DIRECTIVES.has(directive[1])
                            ? `Malformed FreeMarker directive "<#${directive[1]}>". Check its syntax.`
                            : `Unrecognized FreeMarker directive "<#${directive[1]}>". Check for a typo or an unsupported directive.`)
                        : error.message;

                    reporter.error(
                        message,
                        absoluteLine,
                        absoluteCol,
                        this,
                        raw
                    );

                    // A failed parse discards every token in the chunk, including
                    // valid <#if>/<#list> opens. Salvage those opens so their
                    // closing tags elsewhere aren't reported as unpaired.
                    const salvage = new RegExp(`<(${blockTags.join('|')})\\b`, 'g');

                    let open: RegExpExecArray | null;

                    while((open = salvage.exec(event.raw))) {
                        stack.push({
                            event,
                            raw: open[0],
                            tagName: open[1],
                            open: true
                        });
                    }
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