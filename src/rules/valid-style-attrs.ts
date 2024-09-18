import { Rule } from 'htmlhint/types';

function validateInlineCSS(styleString) {
    // Remove whitespace around semicolons and colons
    styleString = styleString.replace(/\s*([;:])\s*/g, '$1');
    
    // Split into individual declarations
    const declarations = styleString.split(';').filter(d => d.trim() !== '');
    
    const errors: {
        declaration: string,
        message: string
    }[] = [];
    
    declarations.forEach((declaration, index) => {        
        // Check for common mistakes like using '=' instead of ':'
        if (declaration.includes('=')) {
            errors.push({
                declaration,
                message: `Declaration "${declaration}" uses '=' instead of ':'`
            });

            return;
        }

        // Check if the declaration has a colon
        if (!declaration.includes(':')) {
            errors.push({
                declaration,
                message: `The value "${declaration}" does not contain a declaration.`
            });
            
            return;
        }
        
        const [property, value] = declaration.split(':');
        
        // Check if property is empty
        if (!property.trim()) {
            errors.push({
                declaration,
                message: `The value "${value}" does not have a declaration.`
            });
        }
        
        // Check if value is empty
        if (!value || !value.trim()) {
            errors.push({
                declaration,
                message: `Property "${property}" has an empty value`
            });
        }
    });
    
    return {
      valid: errors.length === 0,
      errors: errors
    };
}

const rule: Rule = {
    id: 'valid-style-attrs',
    description: 'Style attributes must contain valid CSS.',
    init(parser, reporter) {

        parser.addListener('tagstart', event => {
            const matches = event.attrs.filter(({ name }) => name === 'style');

            for(const attr of matches) {
                for(const error of validateInlineCSS(attr.value).errors) {
                    reporter.error(
                        error.message,
                        event.line,
                        event.col + event.raw.indexOf(attr.raw.trim()),
                        this,
                        attr.raw.trim()
                    );
                };
            }
        })
    }
}

export default rule;