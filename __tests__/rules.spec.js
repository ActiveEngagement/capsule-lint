import fs from 'fs';
import path from 'path';
import { lint } from '../index';
import rules from '../capsule.config.json';

function document(rule) {
    return fs.readFileSync(path.resolve(`./examples/${rule}/document.html`), 'utf8');
}

function errors(rule) {
    return JSON.parse(fs.readFileSync(path.resolve(`./examples/${rule}/errors.js`), 'utf8'));
}

function rule(rule) {
    const key = rule.split('/')[0];

    return expect(lint(document(rule), {
        [key]: rules[key] 
    })).toMatchObject(errors(rule));
}

describe('Rule: "html-valid-content-model"', () => {
    it('Throws errors for siblings to the root <html> tag.', () => {
        rule('html-valid-content-model/siblings-to-root-html-tag')
    });

    it('Throws errors for duplicate <html> tags.', () => {
        rule('html-valid-content-model/duplicate-html-tag')
    });

    it('Throws errors when <html> tags are not root elements.', () => {
        rule('html-valid-content-model/html-tag-not-root-element')
    });

    it('Throws errors when <html> tags has invalid children.', () => {
        rule('html-valid-content-model/invalid-children-to-html-tag')
    });

    it('Throws errors when <head> and <body> are not children to an <html> tag.', () => {
        rule('html-valid-content-model/head-body-not-children-to-html-tag')
    });

    it('Throws errors when there are duplicate <head> or <body> tags.', () => {
        rule('html-valid-content-model/duplicate-head-and-body-tag')
    });

    it('Throws errors when <head> or <body> tags are in the wrong order.', () => {
        rule('html-valid-content-model/duplicate-head-and-body-tag')
    });
});

describe('Rule: "head-valid-content-model"', () => {
    it('Throws errors for invalid tags inside the <head> tag.', () => {
        rule('head-valid-content-model/contains-invalid-tags')
    });
});

describe('Rule: "valid-path-format"', () => {
    it('Throws errors for relative paths.', () => {
        rule('valid-path-format/has-relative-path')
    });
});