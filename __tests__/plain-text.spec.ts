import { lint } from '../src/index';

describe('htmlLinting: false', () => {
    it('suppresses HTML spec-char-escape errors for angle brackets in plain text', () => {
        const errors = lint('<<gift array>>', undefined, { htmlLinting: false });
        expect(errors).toHaveLength(0);
    });

    it('suppresses tag-pair errors for unmatched HTML-like syntax in plain text', () => {
        const errors = lint('<greeting> Hello world </greeting>', undefined, { htmlLinting: false });
        expect(errors).toHaveLength(0);
    });

    it('suppresses invalid-attribute-char and spec-char-escape for plain text content', () => {
        const errors = lint('Price: 10 > 5 & 3 < 8', undefined, { htmlLinting: false });
        expect(errors).toHaveLength(0);
    });

    it('still reports FreeMarker syntax errors with htmlLinting: false', () => {
        const errors = lint('${unclosed', undefined, { htmlLinting: false });
        expect(errors.length).toBeGreaterThan(0);
    });

    it('still reports unmatched FreeMarker if tags with htmlLinting: false', () => {
        const errors = lint('<#if foo>content', undefined, { htmlLinting: false });
        expect(errors.length).toBeGreaterThan(0);
    });

    it('passes valid FreeMarker in plain text without errors', () => {
        const errors = lint(
            'Hello <<gift array>>\n<#if recipient.name?has_content>${recipient.name}<#else>Friend</#if>',
            undefined,
            { htmlLinting: false }
        );
        expect(errors).toHaveLength(0);
    });

    it('passes FreeMarker interpolation in plain text without errors', () => {
        const errors = lint(
            'Dear ${firstName},\nYour total is ${(amount * 0.9)?round}.',
            undefined,
            { htmlLinting: false }
        );
        expect(errors).toHaveLength(0);
    });
});

describe('htmlLinting: true (default)', () => {
    it('reports spec-char-escape errors for unescaped angle brackets', () => {
        const errors = lint('<<gift array>>');
        const ruleIds = errors.map(e => e.rule.id);
        expect(ruleIds).toContain('spec-char-escape');
    });

    it('reports tag-pair errors for unmatched tags', () => {
        const errors = lint('<div>');
        const ruleIds = errors.map(e => e.rule.id);
        expect(ruleIds).toContain('tag-pair');
    });

    it('accepts an explicit htmlLinting: true and behaves the same as default', () => {
        const defaultErrors = lint('<<gift array>>');
        const explicitErrors = lint('<<gift array>>', undefined, { htmlLinting: true });
        expect(explicitErrors.map(e => e.rule.id)).toEqual(defaultErrors.map(e => e.rule.id));
    });
});

describe('FreeMarker error position accuracy when HTML splits text chunks', () => {
    // When HTML tags like <<gift array>> are present, HTMLHint splits the document
    // into text chunks. PEG error positions must be offset by the chunk's document
    // position so errors are reported at the correct document line/col.
    const content = [
        'Eddie Gallagher',
        'Director of Operations',
        'Pipe Hitter Foundation',
        '',
        'REPLACE <<gift array>> with:',
        '',
        '${(hpcAmount?number*0.5?round}',  // missing closing ) — FreeMarker syntax error on line 7
    ].join('\n');

    it('reports FreeMarker syntax error at the correct document line when HTML precedes it', () => {
        const errors = lint(content, undefined, { htmlLinting: false });
        expect(errors).toHaveLength(1);
        expect(errors[0].rule.id).toBe('freemarker-tags');
        expect(errors[0].line).toBe(7);
    });

    it('reports FreeMarker syntax error at correct line even when HTML linting is on', () => {
        const errors = lint(content);
        const fmError = errors.find(e => e.rule.id === 'freemarker-tags');
        expect(fmError).toBeDefined();
        expect(fmError!.line).toBe(7);
    });

    it('does not report the FreeMarker error at the chunk-relative line 3', () => {
        const errors = lint(content, undefined, { htmlLinting: false });
        const wrongLine = errors.find(e => e.rule.id === 'freemarker-tags' && e.line === 3);
        expect(wrongLine).toBeUndefined();
    });
})

describe('htmlLinting: false with custom ruleset', () => {
    it('respects a custom ruleset but still disables non-FreeMarker rules', () => {
        const customRuleset = {
            'freemarker-tags': true,
            'spec-char-escape': true,
            'tag-pair': true
        };
        const errors = lint('<<gift array>>', customRuleset, { htmlLinting: false });
        expect(errors).toHaveLength(0);
    });

    it('still runs FreeMarker rule from custom ruleset', () => {
        const customRuleset = { 'freemarker-tags': true };
        const errors = lint('<#if foo>no close', customRuleset, { htmlLinting: false });
        expect(errors.length).toBeGreaterThan(0);
    });
});
