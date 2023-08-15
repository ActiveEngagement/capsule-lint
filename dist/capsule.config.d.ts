declare const _default: {
    "attr-no-duplication": boolean;
    "body-no-duplicates": boolean;
    "head-body-descendents-html": boolean;
    "head-no-duplicates": boolean;
    "head-valid-children": boolean;
    "html-no-duplicates": boolean;
    "html-root-node": boolean;
    "html-valid-children": boolean;
    "html-valid-children-order": boolean;
    "img-src-required": boolean;
    "invalid-attribute-char": boolean;
    "nested-paragraphs": boolean;
    "spec-char-escape": boolean;
    "src-not-empty": boolean;
    "tag-pair": boolean;
    "valid-path-format": ({
        attr: string;
        formats: (string | {
            pattern: string;
            name: string;
        })[];
        tag?: undefined;
    } | {
        tag: string;
        attr: string;
        formats: string[];
    })[];
};
export default _default;
