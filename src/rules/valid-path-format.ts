import { Attr, Block } from "htmlhint/htmlparser";
import { Rule } from 'htmlhint/types';

const regex = {
    'absolute': /^https?:\/\//,
    'relative': /^\w+?:/
};

class Pattern {
    public name: string;
    public pattern: string;
    public regex: RegExp;

    constructor(options) {
        const { name, pattern } =Object.assign({
            pattern: null,
            name: null
        }, typeof options === 'object' ? options : {
            pattern: options
        });

        this.name = name || pattern;
        this.pattern = pattern;
        this.regex = regex[pattern] || new RegExp(pattern);
    }

    test(value) {
        return this.regex.test(value);
    }

    error(event, attr) {
        return new MatchError(this, event, attr);
    }
}

class MatchError extends Error {
    public line: number;
    public col: number;

    constructor(pattern, event, attr) {
        super();

        this.message = `The [ ${attr.name} ] attribute "${attr.value}" must follow the ${pattern.name} format.`;        
        this.name = pattern.name;
        this.line = event.line;
        this.col = event.col + event.tagName.length + 1 + attr.index;
    }
}

class ReporterError extends Error {
    public line: number;
    public col: number;
    
    constructor(event, errors, attr) {
        super(errors.length === 1 ? errors[0].message : (
            `The [ ${attr.name} ] attribute "${attr.value}" must be one of the following formats: ${errors.map(event => `"${event.name}"`).join(', ')}.`
        ));

        this.line = event.line;
        this.col = event.col + event.tagName.length + 1 + attr.index;
    }
    
}
function test(patterns: Pattern[], event: Block, attr: Attr) {
    const errors = [];

    for(const [i, pattern] of Object.entries(patterns)) {
        if(pattern.test(attr.value)) {
            return true;
        }
        
        errors.push(pattern.error(event, attr));
    }

    throw new ReporterError(event, errors, attr);
}

export type ValidPathFormatOptions = {
    tag: string,
    attr: string,
    formats: ('absolute' | 'relative' | RegExp)[]
}

const rule: Rule = {
    id: 'valid-path-format',
    description: 'Paths must be a valid format.',
    init(parser, reporter, options: ValidPathFormatOptions[]) {
        parser.addListener('tagstart', (event) => {
            options.forEach(config => {
                const patterns = config.formats.map(pattern => new Pattern(pattern));
        
                let tags: string[] = Array.isArray(config.tag)
                    ? config.tag
                    : config.tag ? [config.tag] : [];

                if(!tags.length || tags.indexOf(event.tagName) > -1) {
                    event.attrs.forEach(attr => {
                        if(!config.attr || config.attr === attr.name) {
                            try {
                                test(patterns, event, attr);
                            }
                            catch (e) {
                                reporter.error(
                                    e.message,
                                    e.line,
                                    e.col,
                                    this,
                                    attr.raw
                                );
                            }
                        }
                    });
                }
            });
        });
    }
};

export default rule;