import { Rule } from 'htmlhint/types';
type HeadValidChildrenPossibleTags = 'base' | 'link' | 'meta' | 'noscript' | 'script' | 'style' | 'template' | 'title';
export type HeadValidChildrenOptions = HeadValidChildrenPossibleTags | HeadValidChildrenPossibleTags[];
declare const rule: Rule;
export default rule;
