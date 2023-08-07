const attrNoDuplicate = require('./attr-no-duplication');
const invalidAttributeChar = require('./invalid-attribute-char');
const specCharEscape = require('./spec-char-escape');
const srcNotEmpty = require('./src-not-empty');
const tagPair = require('./tag-pair');
const validPathFormat = require('./valid-path-format');

module.exports = {
    'attr-no-duplication': attrNoDuplicate,
    'invalid-attribute-char': invalidAttributeChar,
    'spec-char-escape': specCharEscape,
    'src-not-empty': srcNotEmpty,
    'tag-pair': tagPair,
    'valid-path-format': validPathFormat,
};