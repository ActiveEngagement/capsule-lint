import { HTMLHint } from 'htmlhint';
import defaultConfig from '../capsule.config.json' assert { type: 'json' };
import actions from './actions';
import rules from './rules';

Object.keys(rules).forEach((key) => {
    HTMLHint.addRule(rules[key]);
});

export function verify(html, config) {
    return HTMLHint.verify(html, config || defaultConfig).map(error => {
        error.rule.link = error.rule.link.replace(
            'https://github.com/thedaviddias/HTMLHint/wiki/',
            'https://thecapsule.email/docs/codes/'
        );
        
        return error;
    });
}

export function lint(html, config) {
    return verify(html, config || defaultConfig).map(error => {
        return { ...error, actions: actions[error.rule.id] || [] };
    });
}