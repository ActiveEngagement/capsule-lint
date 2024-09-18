export default {
	"attr-whitespace": false,
	"attr-no-duplication": true,
	"body-no-duplicates": true,
	"freemarker-tags": true,
	"head-body-descendents-html": true,
	"head-no-duplicates": true,
	"head-valid-children": true,
	"html-no-duplicates": true,
	"html-root-node": true,
	"html-valid-children": true,
	"html-valid-children-order": true,
	"img-src-required": true,
	"invalid-attribute-char": true,
	"nested-paragraphs": true,
	"no-enties-in-attributes": ['style', 'class', 'id'],
	"spec-char-escape": true,
	"src-not-empty": true,
	"tag-pair": true,
	"valid-path-format": [{
		"attr": "href",
		"formats": [
			"absolute",
			{
				"pattern": "\\${(\\s+)?Gears\\.unsubscribe\\(\\)(\\s+)?}",
				"name": "MessageGears unsubscribe"
			},
			{
				"pattern": "mailto:.+",
				"name": "Mailto link"
			}
		]
	}, {
		"tag": "img",
		"attr": "src",
		"formats": [
			"absolute"
		]
	}],
	'valid-style-attrs': true
}