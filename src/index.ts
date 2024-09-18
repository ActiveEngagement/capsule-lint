import { HTMLHint } from 'htmlhint';
import { Hint, Rule, Ruleset } from 'htmlhint/types';
import defaultConfig from './capsule.config';
import rules from './rules';
import { HeadValidChildrenOptions } from './rules/head-valid-children';
import { ValidPathFormatOptions } from './rules/valid-path-format';

Object.keys(rules).forEach((key) => {
    HTMLHint.addRule(rules[key]);
});

export * from './parser';

export {
    defaultConfig
};

type CapsuleRuleset = Ruleset & {
    'html-valid-children'?: HeadValidChildrenOptions,
    'valid-path-format'?: ValidPathFormatOptions
    'valid-style-attrs'?: boolean
}

export type {
    CapsuleRuleset,
    Hint,
    Rule,
    Ruleset
};

export function lint(html: string, ruleset?: CapsuleRuleset): Hint[] {
    return HTMLHint.verify(html, ruleset ?? defaultConfig).map(error => {
        error.rule.link = error.rule.link.replace(
            'https://htmlhint.com/docs/user-guide/rules/',
            'https://thecapsule.email/docs/codes/'
        );
        
        return error;
    })
}