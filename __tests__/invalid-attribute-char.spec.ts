import { lint } from '../src/index';

function attrCharErrors(html: string) {
    return lint(html).filter(error => error.rule.id === 'invalid-attribute-char');
}

describe('Rule: "invalid-attribute-char"', () => {
    it('allows digits, including 0, in attribute names', () => {
        expect(attrCharErrors('<div data-0="x">test</div>')).toHaveLength(0);
        expect(attrCharErrors('<td col0="1" h1="2">cell</td>')).toHaveLength(0);
        expect(attrCharErrors('<img src="https://example.com/a.png" data-index-10="x" />')).toHaveLength(0);
    });

    it('allows letters, hyphens, and colons in attribute names', () => {
        expect(attrCharErrors('<input data-value="x" aria-label="Search" xml:lang="en">')).toHaveLength(0);
    });

    it('still reports genuinely invalid characters', () => {
        expect(attrCharErrors('<div data.value="x">test</div>').map(e => e.raw)).toContain('.');
        expect(attrCharErrors('<a <id="test">test</a>').map(e => e.raw)).toContain('<');
    });
});
