import { HTMLHint } from 'htmlhint';
import { Hint, Rule, Ruleset } from 'htmlhint/types';
import defaultConfig from './capsule.config';
import rules from './rules';
import { HeadValidChildrenOptions } from './rules/head-valid-children';
import { ValidPathFormatOptions } from './rules/valid-path-format';

Object.keys(rules).forEach((key) => {
    HTMLHint.addRule(rules[key]);
});

export type {
    Rule
};

export type CapsuleRuleset = Ruleset & {
    'html-valid-children': HeadValidChildrenOptions,
    'valid-path-format': ValidPathFormatOptions
}

export function lint(html: string, config?: Ruleset): Hint[] {
    return HTMLHint.verify(html, config || defaultConfig).map(error => {
        error.rule.link = error.rule.link.replace(
            'https://github.com/thedaviddias/HTMLHint/wiki/',
            'https://thecapsule.email/docs/codes/'
        );
        
        return error;
    })
}