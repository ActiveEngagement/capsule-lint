import bodyNoDuplicates from './body-no-duplicates';
import freemarkerTags from './freemarker-tags';
import headBodyDescendentsHtml from './head-body-descendents-html';
import headNoDuplicates from './head-no-duplicates';
import headValidContentModel from './head-valid-children';
import htmlNoDuplicates from './html-no-duplicates';
import htmlRootNode from './html-root-node';
import htmlValidChildren from './html-valid-children';
import htmlValidChildrenOrder from './html-valid-children-order';
import imgSrcRequired from './img-src-required';
import invalidAttributeChar from './invalid-attribute-char';
import nestedParagraphs from './nested-paragraphs';
import noEntiesInAttributes from './no-entities-in-attributes';
import specialCharEscape from './special-char-escape';
import tagPair from './tag-pair';
import validPathFormat from './valid-path-format';

export default {
    'body-no-duplicates': bodyNoDuplicates,
    'freemarker-tags': freemarkerTags,
    'head-body-descendents-html': headBodyDescendentsHtml,
    'head-no-duplicates': headNoDuplicates,
    'head-valid-children': headValidContentModel,
    'html-valid-children-order': htmlValidChildrenOrder,
    'html-no-duplicates': htmlNoDuplicates,
    'html-root-node': htmlRootNode,
    'html-valid-children': htmlValidChildren,
    'img-src-required': imgSrcRequired,
    'invalid-attribute-char': invalidAttributeChar,
    'nested-paragraphs': nestedParagraphs,
    'no-entities-in-attributes': noEntiesInAttributes,
    'special-char-escape': specialCharEscape,
    'tag-pair': tagPair,
    'valid-path-format': validPathFormat,
};