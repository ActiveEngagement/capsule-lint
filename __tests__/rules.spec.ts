import { readFileSync } from 'fs';
import { resolve } from 'path';
import rules from '../src/capsule.config';
import { lint } from '../src/index';

function doc(rule) {
    return readFileSync(resolve(__dirname, `examples/${rule}/document.html`), 'utf8');
}

function errors(rule) {
    return require(resolve(__dirname, `examples/${rule}/errors.js`));
}

function rule(rule) {
    const key = rule.split('/')[0];

    return expect(lint(doc(rule), {
        [key]: rules[key] 
    })).toMatchObject(errors(rule));
}

describe('Rule: "attr-no-duplication"', () => {
    it('Throws errors for duplicate attributes.', () => {
        rule('attr-no-duplication');
    });
});

describe('Rule: "body-no-duplicates"', () => {
    it('Throws errors for duplicate <body> tags.', () => {
        rule('body-no-duplicates');
    });
});

describe('Rule: "head-body-descendents-html"', () => {
    it('Throws errors when the <head> tag is not a direct descendent of <html>.', () => {
        rule('head-body-descendents-html/head');
    });
        
    it('Throws errors when the <body> tag is not a direct descendent of <html>', () => {
        rule('head-body-descendents-html/body');
    });
});

describe('Rule: "head-no-duplicates"', () => {
    it('Throws errors for duplicate <head> tags.', () => {
        rule('head-no-duplicates');
    });
});

describe('Rule: "html-no-duplicates"', () => {
    it('Throws errors for duplicate <html> tags.', () => {
        rule('html-no-duplicates');
    });
});

describe('Rule: "html-root-node"', () => {
    it('Throws errors an error when the <html> element is not the root node.', () => {
        rule('html-root-node');
    });
});

describe('Rule: "html-valid-children"', () => {
    it('Throws errors when the <html> element has invalid children elements.', () => {
        rule('html-valid-children');
    });
});

describe('Rule: "html-valid-children-order"', () => {
    it('Throws errors for the <head> and <body> tag are in the incorrect order.', () => {
        rule('html-valid-children-order');
    });
});

describe('Rule: "img-src-required"', () => {
    it('Throws errors when img tags don\'t have src attributes.', () => {
        rule('img-src-required');
    });
});

describe('Rule: "invalid-attribute-char"', () => {
    it('Throws errors when attribute has invalid characters.', () => {
        rule('invalid-attribute-char');
    });
});

describe('Rule: "nested-paragraphs"', () => {
    it('Throws errors when there are nested paragraphs tags.', () => {
        rule('nested-paragraphs');
    });
});

describe('Rule: "valid-path-format"', () => {
    it('Throws errors for relative paths.', () => {
        rule('valid-path-format');
    });
});

describe('Rule: "freemarker-tags"', () => {
    it('Throws errors for invalid freemarker tags.', () => {
        rule('freemarker-tags');
    });
});