const defaultConfig = require('./capsule.config.json');
const { HTMLHint } = require('htmlhint');
const actions = require('./actions');
const rules = require('./rules');

Object.keys(rules).forEach((key) => {
    HTMLHint.addRule(rules[key]);
});

function verify(html, config) {
    return HTMLHint.verify(html, config || defaultConfig).map(error => {
        error.rule.link = error.rule.link.replace(
            'https://github.com/thedaviddias/HTMLHint/wiki/',
            'https://thecapsule.email/docs/codes/'
        );
        
        return error;
    });
}

function lint(html, config) {
    return verify(html, config || defaultConfig).map(error => {
        error.rule.actions = actions[error.rule.id] || [];

        return error;
    });
}

module.exports = {
    lint,
    verify
};