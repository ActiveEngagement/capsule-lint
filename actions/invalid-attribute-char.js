const rules = require('../capsule.config.json');

module.exports = [{
    name: 'Fix Error',
    apply(view, from, to) {
        const chars = typeof rules['invalid-attribute-char'] === 'string'
            ? rules['invalid-attribute-char']
            : '[^a-zA-Z_-]';

        const raw = view.state.doc.slice(from, to).toString();

        const [ attr, value ] = raw.split('=');
            
        const matches = attr.trim().match(new RegExp(chars, 'g'));

        const insert = attr.replace(new RegExp(`[${matches.join('|')}]`, 'g'), '') + `=${value}`;
        
        view.dispatch({
            changes: { from: from, to: from + raw.length, insert }
        });
    }
}]