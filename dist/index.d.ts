import { Hint, Rule, Ruleset } from 'htmlhint/types';
import { HeadValidChildrenOptions } from './rules/head-valid-children';
import { ValidPathFormatOptions } from './rules/valid-path-format';
export type { Rule };
export type CapsuleRuleset = Ruleset & {
    'html-valid-children': HeadValidChildrenOptions;
    'valid-path-format': ValidPathFormatOptions;
};
export declare function lint(html: string, config?: Ruleset): Hint[];
