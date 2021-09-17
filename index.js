import defaultConfig from './capsule.config.json';
import { HTMLHint } from 'htmlhint';
import { actions } from './actions';
import { rules } from './rules';

Object.keys(rules).forEach((key) => {
    HTMLHint.addRule(rules[key]);
});

function lint(html, config) {
    return HTMLHint.verify(html, config || defaultConfig).map(error => {
        error.rule.link = error.rule.link.replace(
            'https://github.com/thedaviddias/HTMLHint/wiki/',
            'https://thecapsule.email/docs/codes/'
        );

        error.rule.actions = actions[error.rule.id] || [];

        return error;
    });
}

export {
    lint
};