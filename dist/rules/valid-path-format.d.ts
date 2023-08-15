import { Rule } from 'htmlhint/types';
export type ValidPathFormatOptions = {
    tag: string;
    attr: string;
    formats: ('absolute' | 'relative' | RegExp)[];
};
declare const rule: Rule;
export default rule;
