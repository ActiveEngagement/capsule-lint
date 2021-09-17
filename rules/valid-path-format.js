const regex = {
    'absolute': /^https?:\/\//,
    'relative': /^\w+?:/
};

class Pattern {
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
    constructor(pattern, event, attr) {
        super();

        this.message = `The value of the href attribute [ ${attr.value} ] must follow the ${pattern.name} format.`;        
        this.name = pattern.name;
        this.line = event.line;
        this.col = event.col + event.tagName.length + 1 + attr.index;
    }
}

class ReporterError extends Error {
    
    constructor(event, errors, attr) {
        super(errors.length === 1 ? errors[0].message : (
            `The value of the href attribute [ ${attr.value} ] must one of the following formats: ${errors.map(event => `"${event.name}"`).join(', ')}.`
        ));

        this.line = event.line;
        this.col = event.col + event.tagName.length + 1 + attr.index;
    }
    
}
function test(patterns, event, attr) {
    const errors = [];

    for(const [i, pattern] of Object.entries(patterns)) {
        if(pattern.test(attr.value)) {
            return true;
        }
        
        errors.push(pattern.error(event, attr));
    }

    throw new ReporterError(event, errors, attr);
}

module.exports = {
    id: 'valid-path-format',
    description: 'Paths must be a valid format.',
    init(parser, reporter, options) {
        options = Array.isArray(options) ? options : [];

        parser.addListener('tagstart', (event) => {
            options.forEach(config => {
                config = Object.assign({
                    formats: []
                }, config || {});
        
                const patterns = config.formats.map(pattern => new Pattern(pattern));
        
                if(!config.tag || config.tag === event.tagName) {
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