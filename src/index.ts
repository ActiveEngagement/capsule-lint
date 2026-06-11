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

const FREEMARKER_RULE_IDS = ['freemarker-tags'];

type CapsuleRuleset = Ruleset & {
    'html-valid-children'?: HeadValidChildrenOptions,
    'valid-path-format'?: ValidPathFormatOptions
    'valid-style-attrs'?: boolean
}

type LintOptions = {
    htmlLinting?: boolean
}

export type {
    CapsuleRuleset,
    Hint,
    LintOptions,
    Rule,
    Ruleset
};

export function lint(html: string, ruleset?: CapsuleRuleset, options?: LintOptions): Hint[] {
    const activeRuleset = ruleset ?? defaultConfig;

    const effectiveRuleset = options?.htmlLinting === false
        ? Object.fromEntries(
            Object.entries(activeRuleset).filter(([key]) => FREEMARKER_RULE_IDS.includes(key))
          )
        : activeRuleset;

    return HTMLHint.verify(html, effectiveRuleset).map(error => {
        error.rule.link = error.rule.link.replace(
            'https://htmlhint.com/docs/user-guide/rules/',
            'https://thecapsule.email/docs/codes/'
        );

        return error;
    })
}