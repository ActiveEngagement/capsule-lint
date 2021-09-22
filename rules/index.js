const bodyNoDuplicates = require('./body-no-duplicates');
const headBodyDescendentsHtml = require('./head-body-descendents-html');
const headNoDuplicates = require('./head-no-duplicates');
const headValidContentModel = require('./head-valid-children');
const htmlValidChildrenOrder = require('./html-valid-children-order');
const htmlNoDuplicates = require('./html-no-duplicates');
const htmlRootNode = require('./html-root-node');
const htmlValidChildren = require('./html-valid-children');
const imgSrcRequired = require('./img-src-required');
const validPathFormat = require('./valid-path-format');
const invalidAttributeChar = require('./invalid-attribute-char');

module.exports = {
    'body-no-duplicates': bodyNoDuplicates,
    'head-body-descendents-html': headBodyDescendentsHtml,
    'head-no-duplicates': headNoDuplicates,
    'head-valid-children': headValidContentModel,
    'html-valid-children-order': htmlValidChildrenOrder,
    'html-no-duplicates': htmlNoDuplicates,
    'html-root-node': htmlRootNode,
    'html-valid-children': htmlValidChildren,
    'img-src-required': imgSrcRequired,
    'invalid-attribute-char': invalidAttributeChar,
    'valid-path-format': validPathFormat,
};