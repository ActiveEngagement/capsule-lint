(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.CapsuleLint = factory());
}(this, (function () { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	var require$$0 = {
		"attr-no-duplication": true,
		"body-no-duplicates": true,
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
		"spec-char-escape": true,
		"src-not-empty": true,
		"tag-pair": true,
		"valid-path-format": [
		{
			attr: "href",
			formats: [
				"absolute",
				{
					pattern: "\\${(\\s+)?Gears\\.unsubscribe\\(\\)(\\s+)?}",
					name: "MessageGears unsubscribe"
				}
			]
		},
		{
			tag: "img",
			attr: "src",
			formats: [
				"absolute"
			]
		}
	]
	};

	var core = {};

	var htmlparser = {};

	Object.defineProperty(htmlparser, "__esModule", { value: true });
	var HTMLParser = (function () {
	    function HTMLParser() {
	        this._listeners = {};
	        this._mapCdataTags = this.makeMap('script,style');
	        this._arrBlocks = [];
	        this.lastEvent = null;
	    }
	    HTMLParser.prototype.makeMap = function (str) {
	        var obj = {};
	        var items = str.split(',');
	        for (var i = 0; i < items.length; i++) {
	            obj[items[i]] = true;
	        }
	        return obj;
	    };
	    HTMLParser.prototype.parse = function (html) {
	        var _this = this;
	        var mapCdataTags = this._mapCdataTags;
	        var regTag = /<(?:\/([^\s>]+)\s*|!--([\s\S]*?)--|!([^>]*?)|([\w\-:]+)((?:\s+[^\s"'>\/=\x00-\x0F\x7F\x80-\x9F]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'>]*))?)*?)\s*(\/?))>/g;
	        var regAttr = /\s*([^\s"'>\/=\x00-\x0F\x7F\x80-\x9F]+)(?:\s*=\s*(?:(")([^"]*)"|(')([^']*)'|([^\s"'>]*)))?/g;
	        var regLine = /\r?\n/g;
	        var match;
	        var matchIndex;
	        var lastIndex = 0;
	        var tagName;
	        var arrAttrs;
	        var tagCDATA = null;
	        var attrsCDATA;
	        var arrCDATA = [];
	        var lastCDATAIndex = 0;
	        var text;
	        var lastLineIndex = 0;
	        var line = 1;
	        var arrBlocks = this._arrBlocks;
	        this.fire('start', {
	            pos: 0,
	            line: 1,
	            col: 1,
	        });
	        var isMapCdataTagsRequired = function () {
	            var attrType = arrAttrs.find(function (attr) { return attr.name === 'type'; }) || {
	                value: '',
	            };
	            return (mapCdataTags[tagName] &&
	                attrType.value.indexOf('text/ng-template') === -1);
	        };
	        var saveBlock = function (type, raw, pos, data) {
	            var col = pos - lastLineIndex + 1;
	            if (data === undefined) {
	                data = {};
	            }
	            data.raw = raw;
	            data.pos = pos;
	            data.line = line;
	            data.col = col;
	            arrBlocks.push(data);
	            _this.fire(type, data);
	            while ((regLine.exec(raw))) {
	                line++;
	                lastLineIndex = pos + regLine.lastIndex;
	            }
	        };
	        while ((match = regTag.exec(html))) {
	            matchIndex = match.index;
	            if (matchIndex > lastIndex) {
	                text = html.substring(lastIndex, matchIndex);
	                if (tagCDATA) {
	                    arrCDATA.push(text);
	                }
	                else {
	                    saveBlock('text', text, lastIndex);
	                }
	            }
	            lastIndex = regTag.lastIndex;
	            if ((tagName = match[1])) {
	                if (tagCDATA && tagName === tagCDATA) {
	                    text = arrCDATA.join('');
	                    saveBlock('cdata', text, lastCDATAIndex, {
	                        tagName: tagCDATA,
	                        attrs: attrsCDATA,
	                    });
	                    tagCDATA = null;
	                    attrsCDATA = undefined;
	                    arrCDATA = [];
	                }
	                if (!tagCDATA) {
	                    saveBlock('tagend', match[0], matchIndex, {
	                        tagName: tagName,
	                    });
	                    continue;
	                }
	            }
	            if (tagCDATA) {
	                arrCDATA.push(match[0]);
	            }
	            else {
	                if ((tagName = match[4])) {
	                    arrAttrs = [];
	                    var attrs = match[5];
	                    var attrMatch = void 0;
	                    var attrMatchCount = 0;
	                    while ((attrMatch = regAttr.exec(attrs))) {
	                        var name_1 = attrMatch[1];
	                        var quote = attrMatch[2]
	                            ? attrMatch[2]
	                            : attrMatch[4]
	                                ? attrMatch[4]
	                                : '';
	                        var value = attrMatch[3]
	                            ? attrMatch[3]
	                            : attrMatch[5]
	                                ? attrMatch[5]
	                                : attrMatch[6]
	                                    ? attrMatch[6]
	                                    : '';
	                        arrAttrs.push({
	                            name: name_1,
	                            value: value,
	                            quote: quote,
	                            index: attrMatch.index,
	                            raw: attrMatch[0],
	                        });
	                        attrMatchCount += attrMatch[0].length;
	                    }
	                    if (attrMatchCount === attrs.length) {
	                        saveBlock('tagstart', match[0], matchIndex, {
	                            tagName: tagName,
	                            attrs: arrAttrs,
	                            close: match[6],
	                        });
	                        if (isMapCdataTagsRequired()) {
	                            tagCDATA = tagName;
	                            attrsCDATA = arrAttrs.concat();
	                            arrCDATA = [];
	                            lastCDATAIndex = lastIndex;
	                        }
	                    }
	                    else {
	                        saveBlock('text', match[0], matchIndex);
	                    }
	                }
	                else if (match[2] || match[3]) {
	                    saveBlock('comment', match[0], matchIndex, {
	                        content: match[2] || match[3],
	                        long: match[2] ? true : false,
	                    });
	                }
	            }
	        }
	        if (html.length > lastIndex) {
	            text = html.substring(lastIndex, html.length);
	            saveBlock('text', text, lastIndex);
	        }
	        this.fire('end', {
	            pos: lastIndex,
	            line: line,
	            col: html.length - lastLineIndex + 1,
	        });
	    };
	    HTMLParser.prototype.addListener = function (types, listener) {
	        var _listeners = this._listeners;
	        var arrTypes = types.split(/[,\s]/);
	        var type;
	        for (var i = 0, l = arrTypes.length; i < l; i++) {
	            type = arrTypes[i];
	            if (_listeners[type] === undefined) {
	                _listeners[type] = [];
	            }
	            _listeners[type].push(listener);
	        }
	    };
	    HTMLParser.prototype.fire = function (type, data) {
	        if (data === undefined) {
	            data = {};
	        }
	        data.type = type;
	        var listeners = [];
	        var listenersType = this._listeners[type];
	        var listenersAll = this._listeners['all'];
	        if (listenersType !== undefined) {
	            listeners = listeners.concat(listenersType);
	        }
	        if (listenersAll !== undefined) {
	            listeners = listeners.concat(listenersAll);
	        }
	        var lastEvent = this.lastEvent;
	        if (lastEvent !== null) {
	            delete lastEvent['lastEvent'];
	            data.lastEvent = lastEvent;
	        }
	        this.lastEvent = data;
	        for (var i = 0, l = listeners.length; i < l; i++) {
	            listeners[i].call(this, data);
	        }
	    };
	    HTMLParser.prototype.removeListener = function (type, listener) {
	        var listenersType = this._listeners[type];
	        if (listenersType !== undefined) {
	            for (var i = 0, l = listenersType.length; i < l; i++) {
	                if (listenersType[i] === listener) {
	                    listenersType.splice(i, 1);
	                    break;
	                }
	            }
	        }
	    };
	    HTMLParser.prototype.fixPos = function (event, index) {
	        var text = event.raw.substr(0, index);
	        var arrLines = text.split(/\r?\n/);
	        var lineCount = arrLines.length - 1;
	        var line = event.line;
	        var col;
	        if (lineCount > 0) {
	            line += lineCount;
	            col = arrLines[lineCount].length + 1;
	        }
	        else {
	            col = event.col + index;
	        }
	        return {
	            line: line,
	            col: col,
	        };
	    };
	    HTMLParser.prototype.getMapAttrs = function (arrAttrs) {
	        var mapAttrs = {};
	        var attr;
	        for (var i = 0, l = arrAttrs.length; i < l; i++) {
	            attr = arrAttrs[i];
	            mapAttrs[attr.name] = attr.value;
	        }
	        return mapAttrs;
	    };
	    return HTMLParser;
	}());
	htmlparser.default = HTMLParser;

	var reporter = {};

	Object.defineProperty(reporter, "__esModule", { value: true });
	var Reporter = (function () {
	    function Reporter(html, ruleset) {
	        this.html = html;
	        this.lines = html.split(/\r?\n/);
	        var match = /\r?\n/.exec(html);
	        this.brLen = match !== null ? match[0].length : 0;
	        this.ruleset = ruleset;
	        this.messages = [];
	    }
	    Reporter.prototype.info = function (message, line, col, rule, raw) {
	        this.report("info", message, line, col, rule, raw);
	    };
	    Reporter.prototype.warn = function (message, line, col, rule, raw) {
	        this.report("warning", message, line, col, rule, raw);
	    };
	    Reporter.prototype.error = function (message, line, col, rule, raw) {
	        this.report("error", message, line, col, rule, raw);
	    };
	    Reporter.prototype.report = function (type, message, line, col, rule, raw) {
	        var lines = this.lines;
	        var brLen = this.brLen;
	        var evidence = '';
	        var evidenceLen = 0;
	        for (var i = line - 1, lineCount = lines.length; i < lineCount; i++) {
	            evidence = lines[i];
	            evidenceLen = evidence.length;
	            if (col > evidenceLen && line < lineCount) {
	                line++;
	                col -= evidenceLen;
	                if (col !== 1) {
	                    col -= brLen;
	                }
	            }
	            else {
	                break;
	            }
	        }
	        this.messages.push({
	            type: type,
	            message: message,
	            raw: raw,
	            evidence: evidence,
	            line: line,
	            col: col,
	            rule: {
	                id: rule.id,
	                description: rule.description,
	                link: "https://github.com/thedaviddias/HTMLHint/wiki/" + rule.id,
	            },
	        });
	    };
	    return Reporter;
	}());
	reporter.default = Reporter;

	var rules$2 = {};

	var altRequire = {};

	Object.defineProperty(altRequire, "__esModule", { value: true });
	altRequire.default = {
	    id: 'alt-require',
	    description: 'The alt attribute of an <img> element must be present and alt attribute of area[href] and input[type=image] must have a value.',
	    init: function (parser, reporter) {
	        var _this = this;
	        parser.addListener('tagstart', function (event) {
	            var tagName = event.tagName.toLowerCase();
	            var mapAttrs = parser.getMapAttrs(event.attrs);
	            var col = event.col + tagName.length + 1;
	            var selector;
	            if (tagName === 'img' && !('alt' in mapAttrs)) {
	                reporter.warn('An alt attribute must be present on <img> elements.', event.line, col, _this, event.raw);
	            }
	            else if ((tagName === 'area' && 'href' in mapAttrs) ||
	                (tagName === 'input' && mapAttrs['type'] === 'image')) {
	                if (!('alt' in mapAttrs) || mapAttrs['alt'] === '') {
	                    selector = tagName === 'area' ? 'area[href]' : 'input[type=image]';
	                    reporter.warn("The alt attribute of " + selector + " must have a value.", event.line, col, _this, event.raw);
	                }
	            }
	        });
	    },
	};

	var attrLowercase = {};

	Object.defineProperty(attrLowercase, "__esModule", { value: true });
	function testAgainstStringOrRegExp(value, comparison) {
	    if (comparison instanceof RegExp) {
	        return comparison.test(value)
	            ? { match: value, pattern: comparison }
	            : false;
	    }
	    var firstComparisonChar = comparison[0];
	    var lastComparisonChar = comparison[comparison.length - 1];
	    var secondToLastComparisonChar = comparison[comparison.length - 2];
	    var comparisonIsRegex = firstComparisonChar === '/' &&
	        (lastComparisonChar === '/' ||
	            (secondToLastComparisonChar === '/' && lastComparisonChar === 'i'));
	    var hasCaseInsensitiveFlag = comparisonIsRegex && lastComparisonChar === 'i';
	    if (comparisonIsRegex) {
	        var valueMatches = hasCaseInsensitiveFlag
	            ? new RegExp(comparison.slice(1, -2), 'i').test(value)
	            : new RegExp(comparison.slice(1, -1)).test(value);
	        return valueMatches;
	    }
	    return value === comparison;
	}
	attrLowercase.default = {
	    id: 'attr-lowercase',
	    description: 'All attribute names must be in lowercase.',
	    init: function (parser, reporter, options) {
	        var _this = this;
	        var exceptions = Array.isArray(options) ? options : [];
	        parser.addListener('tagstart', function (event) {
	            var attrs = event.attrs;
	            var attr;
	            var col = event.col + event.tagName.length + 1;
	            var _loop_1 = function (i, l) {
	                attr = attrs[i];
	                var attrName = attr.name;
	                if (!exceptions.find(function (exp) { return testAgainstStringOrRegExp(attrName, exp); }) &&
	                    attrName !== attrName.toLowerCase()) {
	                    reporter.error("The attribute name of [ " + attrName + " ] must be in lowercase.", event.line, col + attr.index, _this, attr.raw);
	                }
	            };
	            for (var i = 0, l = attrs.length; i < l; i++) {
	                _loop_1(i);
	            }
	        });
	    },
	};

	var attrSorted = {};

	Object.defineProperty(attrSorted, "__esModule", { value: true });
	attrSorted.default = {
	    id: 'attr-sorted',
	    description: 'Attribute tags must be in proper order.',
	    init: function (parser, reporter) {
	        var _this = this;
	        var orderMap = {};
	        var sortOrder = [
	            'class',
	            'id',
	            'name',
	            'src',
	            'for',
	            'type',
	            'href',
	            'value',
	            'title',
	            'alt',
	            'role',
	        ];
	        for (var i = 0; i < sortOrder.length; i++) {
	            orderMap[sortOrder[i]] = i;
	        }
	        parser.addListener('tagstart', function (event) {
	            var attrs = event.attrs;
	            var listOfAttributes = [];
	            for (var i = 0; i < attrs.length; i++) {
	                listOfAttributes.push(attrs[i].name);
	            }
	            var originalAttrs = JSON.stringify(listOfAttributes);
	            listOfAttributes.sort(function (a, b) {
	                if (orderMap[a] == undefined && orderMap[b] == undefined) {
	                    return 0;
	                }
	                if (orderMap[a] == undefined) {
	                    return 1;
	                }
	                else if (orderMap[b] == undefined) {
	                    return -1;
	                }
	                return orderMap[a] - orderMap[b] || a.localeCompare(b);
	            });
	            if (originalAttrs !== JSON.stringify(listOfAttributes)) {
	                reporter.error("Inaccurate order " + originalAttrs + " should be in hierarchy " + JSON.stringify(listOfAttributes) + " ", event.line, event.col, _this, event.raw);
	            }
	        });
	    },
	};

	var attrNoDuplication$1 = {};

	Object.defineProperty(attrNoDuplication$1, "__esModule", { value: true });
	attrNoDuplication$1.default = {
	    id: 'attr-no-duplication',
	    description: 'Elements cannot have duplicate attributes.',
	    init: function (parser, reporter) {
	        var _this = this;
	        parser.addListener('tagstart', function (event) {
	            var attrs = event.attrs;
	            var attr;
	            var attrName;
	            var col = event.col + event.tagName.length + 1;
	            var mapAttrName = {};
	            for (var i = 0, l = attrs.length; i < l; i++) {
	                attr = attrs[i];
	                attrName = attr.name;
	                if (mapAttrName[attrName] === true) {
	                    reporter.error("Duplicate of attribute name [ " + attr.name + " ] was found.", event.line, col + attr.index, _this, attr.raw);
	                }
	                mapAttrName[attrName] = true;
	            }
	        });
	    },
	};

	var attrUnsafeChars = {};

	Object.defineProperty(attrUnsafeChars, "__esModule", { value: true });
	attrUnsafeChars.default = {
	    id: 'attr-unsafe-chars',
	    description: 'Attribute values cannot contain unsafe chars.',
	    init: function (parser, reporter) {
	        var _this = this;
	        parser.addListener('tagstart', function (event) {
	            var attrs = event.attrs;
	            var attr;
	            var col = event.col + event.tagName.length + 1;
	            var regUnsafe = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/;
	            var match;
	            for (var i = 0, l = attrs.length; i < l; i++) {
	                attr = attrs[i];
	                match = regUnsafe.exec(attr.value);
	                if (match !== null) {
	                    var unsafeCode = escape(match[0])
	                        .replace(/%u/, '\\u')
	                        .replace(/%/, '\\x');
	                    reporter.warn("The value of attribute [ " + attr.name + " ] cannot contain an unsafe char [ " + unsafeCode + " ].", event.line, col + attr.index, _this, attr.raw);
	                }
	            }
	        });
	    },
	};

	var attrValueDoubleQuotes = {};

	Object.defineProperty(attrValueDoubleQuotes, "__esModule", { value: true });
	attrValueDoubleQuotes.default = {
	    id: 'attr-value-double-quotes',
	    description: 'Attribute values must be in double quotes.',
	    init: function (parser, reporter) {
	        var _this = this;
	        parser.addListener('tagstart', function (event) {
	            var attrs = event.attrs;
	            var attr;
	            var col = event.col + event.tagName.length + 1;
	            for (var i = 0, l = attrs.length; i < l; i++) {
	                attr = attrs[i];
	                if ((attr.value !== '' && attr.quote !== '"') ||
	                    (attr.value === '' && attr.quote === "'")) {
	                    reporter.error("The value of attribute [ " + attr.name + " ] must be in double quotes.", event.line, col + attr.index, _this, attr.raw);
	                }
	            }
	        });
	    },
	};

	var attrValueNotEmpty = {};

	Object.defineProperty(attrValueNotEmpty, "__esModule", { value: true });
	attrValueNotEmpty.default = {
	    id: 'attr-value-not-empty',
	    description: 'All attributes must have values.',
	    init: function (parser, reporter) {
	        var _this = this;
	        parser.addListener('tagstart', function (event) {
	            var attrs = event.attrs;
	            var attr;
	            var col = event.col + event.tagName.length + 1;
	            for (var i = 0, l = attrs.length; i < l; i++) {
	                attr = attrs[i];
	                if (attr.quote === '' && attr.value === '') {
	                    reporter.warn("The attribute [ " + attr.name + " ] must have a value.", event.line, col + attr.index, _this, attr.raw);
	                }
	            }
	        });
	    },
	};

	var attrValueSingleQuotes = {};

	Object.defineProperty(attrValueSingleQuotes, "__esModule", { value: true });
	attrValueSingleQuotes.default = {
	    id: 'attr-value-single-quotes',
	    description: 'Attribute values must be in single quotes.',
	    init: function (parser, reporter) {
	        var _this = this;
	        parser.addListener('tagstart', function (event) {
	            var attrs = event.attrs;
	            var attr;
	            var col = event.col + event.tagName.length + 1;
	            for (var i = 0, l = attrs.length; i < l; i++) {
	                attr = attrs[i];
	                if ((attr.value !== '' && attr.quote !== "'") ||
	                    (attr.value === '' && attr.quote === '"')) {
	                    reporter.error("The value of attribute [ " + attr.name + " ] must be in single quotes.", event.line, col + attr.index, _this, attr.raw);
	                }
	            }
	        });
	    },
	};

	var attrWhitespace = {};

	Object.defineProperty(attrWhitespace, "__esModule", { value: true });
	attrWhitespace.default = {
	    id: 'attr-whitespace',
	    description: 'All attributes should be separated by only one space and not have leading/trailing whitespace.',
	    init: function (parser, reporter, options) {
	        var _this = this;
	        var exceptions = Array.isArray(options)
	            ? options
	            : [];
	        parser.addListener('tagstart', function (event) {
	            var attrs = event.attrs;
	            var attr;
	            var col = event.col + event.tagName.length + 1;
	            attrs.forEach(function (elem) {
	                attr = elem;
	                var attrName = elem.name;
	                if (exceptions.indexOf(attrName) !== -1) {
	                    return;
	                }
	                if (elem.value.trim() !== elem.value) {
	                    reporter.error("The attributes of [ " + attrName + " ] must not have trailing whitespace.", event.line, col + attr.index, _this, attr.raw);
	                }
	                if (elem.value.replace(/ +(?= )/g, '') !== elem.value) {
	                    reporter.error("The attributes of [ " + attrName + " ] must be separated by only one space.", event.line, col + attr.index, _this, attr.raw);
	                }
	            });
	        });
	    },
	};

	var doctypeFirst = {};

	Object.defineProperty(doctypeFirst, "__esModule", { value: true });
	doctypeFirst.default = {
	    id: 'doctype-first',
	    description: 'Doctype must be declared first.',
	    init: function (parser, reporter) {
	        var _this = this;
	        var allEvent = function (event) {
	            if (event.type === 'start' ||
	                (event.type === 'text' && /^\s*$/.test(event.raw))) {
	                return;
	            }
	            if ((event.type !== 'comment' && event.long === false) ||
	                /^DOCTYPE\s+/i.test(event.content) === false) {
	                reporter.error('Doctype must be declared first.', event.line, event.col, _this, event.raw);
	            }
	            parser.removeListener('all', allEvent);
	        };
	        parser.addListener('all', allEvent);
	    },
	};

	var doctypeHtml5 = {};

	Object.defineProperty(doctypeHtml5, "__esModule", { value: true });
	doctypeHtml5.default = {
	    id: 'doctype-html5',
	    description: 'Invalid doctype. Use: "<!DOCTYPE html>"',
	    init: function (parser, reporter) {
	        var _this = this;
	        var onComment = function (event) {
	            if (event.long === false &&
	                event.content.toLowerCase() !== 'doctype html') {
	                reporter.warn('Invalid doctype. Use: "<!DOCTYPE html>"', event.line, event.col, _this, event.raw);
	            }
	        };
	        var onTagStart = function () {
	            parser.removeListener('comment', onComment);
	            parser.removeListener('tagstart', onTagStart);
	        };
	        parser.addListener('all', onComment);
	        parser.addListener('tagstart', onTagStart);
	    },
	};

	var headScriptDisabled = {};

	Object.defineProperty(headScriptDisabled, "__esModule", { value: true });
	headScriptDisabled.default = {
	    id: 'head-script-disabled',
	    description: 'The <script> tag cannot be used in a <head> tag.',
	    init: function (parser, reporter) {
	        var _this = this;
	        var reScript = /^(text\/javascript|application\/javascript)$/i;
	        var isInHead = false;
	        var onTagStart = function (event) {
	            var mapAttrs = parser.getMapAttrs(event.attrs);
	            var type = mapAttrs.type;
	            var tagName = event.tagName.toLowerCase();
	            if (tagName === 'head') {
	                isInHead = true;
	            }
	            if (isInHead === true &&
	                tagName === 'script' &&
	                (!type || reScript.test(type) === true)) {
	                reporter.warn('The <script> tag cannot be used in a <head> tag.', event.line, event.col, _this, event.raw);
	            }
	        };
	        var onTagEnd = function (event) {
	            if (event.tagName.toLowerCase() === 'head') {
	                parser.removeListener('tagstart', onTagStart);
	                parser.removeListener('tagend', onTagEnd);
	            }
	        };
	        parser.addListener('tagstart', onTagStart);
	        parser.addListener('tagend', onTagEnd);
	    },
	};

	var hrefAbsOrRel = {};

	Object.defineProperty(hrefAbsOrRel, "__esModule", { value: true });
	hrefAbsOrRel.default = {
	    id: 'href-abs-or-rel',
	    description: 'An href attribute must be either absolute or relative.',
	    init: function (parser, reporter, options) {
	        var _this = this;
	        var hrefMode = options === 'abs' ? 'absolute' : 'relative';
	        parser.addListener('tagstart', function (event) {
	            var attrs = event.attrs;
	            var attr;
	            var col = event.col + event.tagName.length + 1;
	            for (var i = 0, l = attrs.length; i < l; i++) {
	                attr = attrs[i];
	                if (attr.name === 'href') {
	                    if ((hrefMode === 'absolute' && /^\w+?:/.test(attr.value) === false) ||
	                        (hrefMode === 'relative' &&
	                            /^https?:\/\//.test(attr.value) === true)) {
	                        reporter.warn("The value of the href attribute [ " + attr.value + " ] must be " + hrefMode + ".", event.line, col + attr.index, _this, attr.raw);
	                    }
	                    break;
	                }
	            }
	        });
	    },
	};

	var htmlLangRequire = {};

	Object.defineProperty(htmlLangRequire, "__esModule", { value: true });
	var regular = '(art-lojban|cel-gaulish|no-bok|no-nyn|zh-guoyu|zh-hakka|zh-min|zh-min-nan|zh-xiang)';
	var irregular = '(en-GB-oed|i-ami|i-bnn|i-default|i-enochian|i-hak|i-klingon|i-lux|i-mingo|i-navajo|i-pwn|i-tao|i-tay|i-tsu|sgn-BE-FR|sgn-BE-NL|sgn-CH-DE)';
	var grandfathered = "(?<grandfathered>" + irregular + "|" + regular + ")";
	var privateUse = '(?<privateUse>x(-[A-Za-z0-9]{1,8})+)';
	var privateUse2 = '(?<privateUse2>x(-[A-Za-z0-9]{1,8})+)';
	var singleton = '[0-9A-WY-Za-wy-z]';
	var extension = "(?<extension>" + singleton + "(-[A-Za-z0-9]{2,8})+)";
	var variant = '(?<variant>[A-Za-z0-9]{5,8}|[0-9][A-Za-z0-9]{3})';
	var region = '(?<region>[A-Za-z]{2}|[0-9]{3})';
	var script = '(?<script>[A-Za-z]{4})';
	var extlang = '(?<extlang>[A-Za-z]{3}(-[A-Za-z]{3}){0,2})';
	var language = "(?<language>([A-Za-z]{2,3}(-" + extlang + ")?)|[A-Za-z]{4}|[A-Za-z]{5,8})";
	var langtag = "(" + language + "(-" + script + ")?" +
	    ("(-" + region + ")?") +
	    ("(-" + variant + ")*") +
	    ("(-" + extension + ")*") +
	    ("(-" + privateUse + ")?") +
	    ')';
	var languageTag = "(" + grandfathered + "|" + langtag + "|" + privateUse2 + ")";
	htmlLangRequire.default = {
	    id: 'html-lang-require',
	    description: 'The lang attribute of an <html> element must be present and should be valid.',
	    init: function (parser, reporter) {
	        var _this = this;
	        parser.addListener('tagstart', function (event) {
	            var tagName = event.tagName.toLowerCase();
	            var mapAttrs = parser.getMapAttrs(event.attrs);
	            var col = event.col + tagName.length + 1;
	            var langValidityPattern = new RegExp(languageTag, 'g');
	            if (tagName === 'html') {
	                if ('lang' in mapAttrs) {
	                    if (!mapAttrs['lang']) {
	                        reporter.warn('The lang attribute of <html> element must have a value.', event.line, col, _this, event.raw);
	                    }
	                    else if (!langValidityPattern.test(mapAttrs['lang'])) {
	                        reporter.warn('The lang attribute value of <html> element must be a valid BCP47.', event.line, col, _this, event.raw);
	                    }
	                }
	                else {
	                    reporter.warn('An lang attribute must be present on <html> elements.', event.line, col, _this, event.raw);
	                }
	            }
	        });
	    },
	};

	var idClassAdDisabled = {};

	Object.defineProperty(idClassAdDisabled, "__esModule", { value: true });
	idClassAdDisabled.default = {
	    id: 'id-class-ad-disabled',
	    description: 'The id and class attributes cannot use the ad keyword, it will be blocked by adblock software.',
	    init: function (parser, reporter) {
	        var _this = this;
	        parser.addListener('tagstart', function (event) {
	            var attrs = event.attrs;
	            var attr;
	            var attrName;
	            var col = event.col + event.tagName.length + 1;
	            for (var i = 0, l = attrs.length; i < l; i++) {
	                attr = attrs[i];
	                attrName = attr.name;
	                if (/^(id|class)$/i.test(attrName)) {
	                    if (/(^|[-_])ad([-_]|$)/i.test(attr.value)) {
	                        reporter.warn("The value of attribute " + attrName + " cannot use the ad keyword.", event.line, col + attr.index, _this, attr.raw);
	                    }
	                }
	            }
	        });
	    },
	};

	var idClassValue = {};

	Object.defineProperty(idClassValue, "__esModule", { value: true });
	idClassValue.default = {
	    id: 'id-class-value',
	    description: 'The id and class attribute values must meet the specified rules.',
	    init: function (parser, reporter, options) {
	        var _this = this;
	        var arrRules = {
	            underline: {
	                regId: /^[a-z\d]+(_[a-z\d]+)*$/,
	                message: 'The id and class attribute values must be in lowercase and split by an underscore.',
	            },
	            dash: {
	                regId: /^[a-z\d]+(-[a-z\d]+)*$/,
	                message: 'The id and class attribute values must be in lowercase and split by a dash.',
	            },
	            hump: {
	                regId: /^[a-z][a-zA-Z\d]*([A-Z][a-zA-Z\d]*)*$/,
	                message: 'The id and class attribute values must meet the camelCase style.',
	            },
	        };
	        var rule;
	        if (typeof options === 'string') {
	            rule = arrRules[options];
	        }
	        else {
	            rule = options;
	        }
	        if (typeof rule === 'object' && rule.regId) {
	            var regId_1 = rule.regId;
	            var message_1 = rule.message;
	            if (!(regId_1 instanceof RegExp)) {
	                regId_1 = new RegExp(regId_1);
	            }
	            parser.addListener('tagstart', function (event) {
	                var attrs = event.attrs;
	                var attr;
	                var col = event.col + event.tagName.length + 1;
	                for (var i = 0, l1 = attrs.length; i < l1; i++) {
	                    attr = attrs[i];
	                    if (attr.name.toLowerCase() === 'id') {
	                        if (regId_1.test(attr.value) === false) {
	                            reporter.warn(message_1, event.line, col + attr.index, _this, attr.raw);
	                        }
	                    }
	                    if (attr.name.toLowerCase() === 'class') {
	                        var arrClass = attr.value.split(/\s+/g);
	                        var classValue = void 0;
	                        for (var j = 0, l2 = arrClass.length; j < l2; j++) {
	                            classValue = arrClass[j];
	                            if (classValue && regId_1.test(classValue) === false) {
	                                reporter.warn(message_1, event.line, col + attr.index, _this, classValue);
	                            }
	                        }
	                    }
	                }
	            });
	        }
	    },
	};

	var idUnique = {};

	Object.defineProperty(idUnique, "__esModule", { value: true });
	idUnique.default = {
	    id: 'id-unique',
	    description: 'The value of id attributes must be unique.',
	    init: function (parser, reporter) {
	        var _this = this;
	        var mapIdCount = {};
	        parser.addListener('tagstart', function (event) {
	            var attrs = event.attrs;
	            var attr;
	            var id;
	            var col = event.col + event.tagName.length + 1;
	            for (var i = 0, l = attrs.length; i < l; i++) {
	                attr = attrs[i];
	                if (attr.name.toLowerCase() === 'id') {
	                    id = attr.value;
	                    if (id) {
	                        if (mapIdCount[id] === undefined) {
	                            mapIdCount[id] = 1;
	                        }
	                        else {
	                            mapIdCount[id]++;
	                        }
	                        if (mapIdCount[id] > 1) {
	                            reporter.error("The id value [ " + id + " ] must be unique.", event.line, col + attr.index, _this, attr.raw);
	                        }
	                    }
	                    break;
	                }
	            }
	        });
	    },
	};

	var inlineScriptDisabled = {};

	Object.defineProperty(inlineScriptDisabled, "__esModule", { value: true });
	inlineScriptDisabled.default = {
	    id: 'inline-script-disabled',
	    description: 'Inline script cannot be used.',
	    init: function (parser, reporter) {
	        var _this = this;
	        parser.addListener('tagstart', function (event) {
	            var attrs = event.attrs;
	            var attr;
	            var col = event.col + event.tagName.length + 1;
	            var attrName;
	            var reEvent = /^on(unload|message|submit|select|scroll|resize|mouseover|mouseout|mousemove|mouseleave|mouseenter|mousedown|load|keyup|keypress|keydown|focus|dblclick|click|change|blur|error)$/i;
	            for (var i = 0, l = attrs.length; i < l; i++) {
	                attr = attrs[i];
	                attrName = attr.name.toLowerCase();
	                if (reEvent.test(attrName) === true) {
	                    reporter.warn("Inline script [ " + attr.raw + " ] cannot be used.", event.line, col + attr.index, _this, attr.raw);
	                }
	                else if (attrName === 'src' || attrName === 'href') {
	                    if (/^\s*javascript:/i.test(attr.value)) {
	                        reporter.warn("Inline script [ " + attr.raw + " ] cannot be used.", event.line, col + attr.index, _this, attr.raw);
	                    }
	                }
	            }
	        });
	    },
	};

	var inlineStyleDisabled = {};

	Object.defineProperty(inlineStyleDisabled, "__esModule", { value: true });
	inlineStyleDisabled.default = {
	    id: 'inline-style-disabled',
	    description: 'Inline style cannot be used.',
	    init: function (parser, reporter) {
	        var _this = this;
	        parser.addListener('tagstart', function (event) {
	            var attrs = event.attrs;
	            var attr;
	            var col = event.col + event.tagName.length + 1;
	            for (var i = 0, l = attrs.length; i < l; i++) {
	                attr = attrs[i];
	                if (attr.name.toLowerCase() === 'style') {
	                    reporter.warn("Inline style [ " + attr.raw + " ] cannot be used.", event.line, col + attr.index, _this, attr.raw);
	                }
	            }
	        });
	    },
	};

	var inputRequiresLabel = {};

	Object.defineProperty(inputRequiresLabel, "__esModule", { value: true });
	inputRequiresLabel.default = {
	    id: 'input-requires-label',
	    description: 'All [ input ] tags must have a corresponding [ label ] tag. ',
	    init: function (parser, reporter) {
	        var _this = this;
	        var labelTags = [];
	        var inputTags = [];
	        parser.addListener('tagstart', function (event) {
	            var tagName = event.tagName.toLowerCase();
	            var mapAttrs = parser.getMapAttrs(event.attrs);
	            var col = event.col + tagName.length + 1;
	            if (tagName === 'input') {
	                inputTags.push({ event: event, col: col, id: mapAttrs['id'] });
	            }
	            if (tagName === 'label') {
	                if ('for' in mapAttrs && mapAttrs['for'] !== '') {
	                    labelTags.push({ event: event, col: col, forValue: mapAttrs['for'] });
	                }
	            }
	        });
	        parser.addListener('end', function () {
	            inputTags.forEach(function (inputTag) {
	                if (!hasMatchingLabelTag(inputTag)) {
	                    reporter.warn('No matching [ label ] tag found.', inputTag.event.line, inputTag.col, _this, inputTag.event.raw);
	                }
	            });
	        });
	        function hasMatchingLabelTag(inputTag) {
	            var found = false;
	            labelTags.forEach(function (labelTag) {
	                if (inputTag.id && inputTag.id === labelTag.forValue) {
	                    found = true;
	                }
	            });
	            return found;
	        }
	    },
	};

	var scriptDisabled = {};

	Object.defineProperty(scriptDisabled, "__esModule", { value: true });
	scriptDisabled.default = {
	    id: 'script-disabled',
	    description: 'The <script> tag cannot be used.',
	    init: function (parser, reporter) {
	        var _this = this;
	        parser.addListener('tagstart', function (event) {
	            if (event.tagName.toLowerCase() === 'script') {
	                reporter.error('The <script> tag cannot be used.', event.line, event.col, _this, event.raw);
	            }
	        });
	    },
	};

	var spaceTabMixedDisabled = {};

	Object.defineProperty(spaceTabMixedDisabled, "__esModule", { value: true });
	spaceTabMixedDisabled.default = {
	    id: 'space-tab-mixed-disabled',
	    description: 'Do not mix tabs and spaces for indentation.',
	    init: function (parser, reporter, options) {
	        var _this = this;
	        var indentMode = 'nomix';
	        var spaceLengthRequire = null;
	        if (typeof options === 'string') {
	            var match = /^([a-z]+)(\d+)?/.exec(options);
	            if (match) {
	                indentMode = match[1];
	                spaceLengthRequire = match[2] && parseInt(match[2], 10);
	            }
	        }
	        parser.addListener('text', function (event) {
	            var raw = event.raw;
	            var reMixed = /(^|\r?\n)([ \t]+)/g;
	            var match;
	            while ((match = reMixed.exec(raw))) {
	                var fixedPos = parser.fixPos(event, match.index + match[1].length);
	                if (fixedPos.col !== 1) {
	                    continue;
	                }
	                var whiteSpace = match[2];
	                if (indentMode === 'space') {
	                    if (spaceLengthRequire) {
	                        if (/^ +$/.test(whiteSpace) === false ||
	                            whiteSpace.length % spaceLengthRequire !== 0) {
	                            reporter.warn("Please use space for indentation and keep " + spaceLengthRequire + " length.", fixedPos.line, 1, _this, event.raw);
	                        }
	                    }
	                    else {
	                        if (/^ +$/.test(whiteSpace) === false) {
	                            reporter.warn('Please use space for indentation.', fixedPos.line, 1, _this, event.raw);
	                        }
	                    }
	                }
	                else if (indentMode === 'tab' && /^\t+$/.test(whiteSpace) === false) {
	                    reporter.warn('Please use tab for indentation.', fixedPos.line, 1, _this, event.raw);
	                }
	                else if (/ +\t|\t+ /.test(whiteSpace) === true) {
	                    reporter.warn('Do not mix tabs and spaces for indentation.', fixedPos.line, 1, _this, event.raw);
	                }
	            }
	        });
	    },
	};

	var specCharEscape$2 = {};

	Object.defineProperty(specCharEscape$2, "__esModule", { value: true });
	specCharEscape$2.default = {
	    id: 'spec-char-escape',
	    description: 'Special characters must be escaped.',
	    init: function (parser, reporter) {
	        var _this = this;
	        parser.addListener('text', function (event) {
	            var raw = event.raw;
	            var reSpecChar = /([<>])|( \& )/g;
	            var match;
	            while ((match = reSpecChar.exec(raw))) {
	                var fixedPos = parser.fixPos(event, match.index);
	                reporter.error("Special characters must be escaped : [ " + match[0] + " ].", fixedPos.line, fixedPos.col, _this, event.raw);
	            }
	        });
	    },
	};

	var srcNotEmpty$2 = {};

	Object.defineProperty(srcNotEmpty$2, "__esModule", { value: true });
	srcNotEmpty$2.default = {
	    id: 'src-not-empty',
	    description: 'The src attribute of an img(script,link) must have a value.',
	    init: function (parser, reporter) {
	        var _this = this;
	        parser.addListener('tagstart', function (event) {
	            var tagName = event.tagName;
	            var attrs = event.attrs;
	            var attr;
	            var col = event.col + tagName.length + 1;
	            for (var i = 0, l = attrs.length; i < l; i++) {
	                attr = attrs[i];
	                if (((/^(img|script|embed|bgsound|iframe)$/.test(tagName) === true &&
	                    attr.name === 'src') ||
	                    (tagName === 'link' && attr.name === 'href') ||
	                    (tagName === 'object' && attr.name === 'data')) &&
	                    attr.value === '') {
	                    reporter.error("The attribute [ " + attr.name + " ] of the tag [ " + tagName + " ] must have a value.", event.line, col + attr.index, _this, attr.raw);
	                }
	            }
	        });
	    },
	};

	var styleDisabled = {};

	Object.defineProperty(styleDisabled, "__esModule", { value: true });
	styleDisabled.default = {
	    id: 'style-disabled',
	    description: '<style> tags cannot be used.',
	    init: function (parser, reporter) {
	        var _this = this;
	        parser.addListener('tagstart', function (event) {
	            if (event.tagName.toLowerCase() === 'style') {
	                reporter.warn('The <style> tag cannot be used.', event.line, event.col, _this, event.raw);
	            }
	        });
	    },
	};

	var tagPair$2 = {};

	Object.defineProperty(tagPair$2, "__esModule", { value: true });
	tagPair$2.default = {
	    id: 'tag-pair',
	    description: 'Tag must be paired.',
	    init: function (parser, reporter) {
	        var _this = this;
	        var stack = [];
	        var mapEmptyTags = parser.makeMap('area,base,basefont,br,col,frame,hr,img,input,isindex,link,meta,param,embed,track,command,source,keygen,wbr');
	        parser.addListener('tagstart', function (event) {
	            var tagName = event.tagName.toLowerCase();
	            if (mapEmptyTags[tagName] === undefined && !event.close) {
	                stack.push({
	                    tagName: tagName,
	                    line: event.line,
	                    raw: event.raw,
	                });
	            }
	        });
	        parser.addListener('tagend', function (event) {
	            var tagName = event.tagName.toLowerCase();
	            var pos;
	            for (pos = stack.length - 1; pos >= 0; pos--) {
	                if (stack[pos].tagName === tagName) {
	                    break;
	                }
	            }
	            if (pos >= 0) {
	                var arrTags = [];
	                for (var i = stack.length - 1; i > pos; i--) {
	                    arrTags.push("</" + stack[i].tagName + ">");
	                }
	                if (arrTags.length > 0) {
	                    var lastEvent = stack[stack.length - 1];
	                    reporter.error("Tag must be paired, missing: [ " + arrTags.join('') + " ], start tag match failed [ " + lastEvent.raw + " ] on line " + lastEvent.line + ".", event.line, event.col, _this, event.raw);
	                }
	                stack.length = pos;
	            }
	            else {
	                reporter.error("Tag must be paired, no start tag: [ " + event.raw + " ]", event.line, event.col, _this, event.raw);
	            }
	        });
	        parser.addListener('end', function (event) {
	            var arrTags = [];
	            for (var i = stack.length - 1; i >= 0; i--) {
	                arrTags.push("</" + stack[i].tagName + ">");
	            }
	            if (arrTags.length > 0) {
	                var lastEvent = stack[stack.length - 1];
	                reporter.error("Tag must be paired, missing: [ " + arrTags.join('') + " ], open tag match failed [ " + lastEvent.raw + " ] on line " + lastEvent.line + ".", event.line, event.col, _this, '');
	            }
	        });
	    },
	};

	var tagSelfClose = {};

	Object.defineProperty(tagSelfClose, "__esModule", { value: true });
	tagSelfClose.default = {
	    id: 'tag-self-close',
	    description: 'Empty tags must be self closed.',
	    init: function (parser, reporter) {
	        var _this = this;
	        var mapEmptyTags = parser.makeMap('area,base,basefont,br,col,frame,hr,img,input,isindex,link,meta,param,embed,track,command,source,keygen,wbr');
	        parser.addListener('tagstart', function (event) {
	            var tagName = event.tagName.toLowerCase();
	            if (mapEmptyTags[tagName] !== undefined) {
	                if (!event.close) {
	                    reporter.warn("The empty tag : [ " + tagName + " ] must be self closed.", event.line, event.col, _this, event.raw);
	                }
	            }
	        });
	    },
	};

	var tagnameLowercase = {};

	Object.defineProperty(tagnameLowercase, "__esModule", { value: true });
	tagnameLowercase.default = {
	    id: 'tagname-lowercase',
	    description: 'All html element names must be in lowercase.',
	    init: function (parser, reporter, options) {
	        var _this = this;
	        var exceptions = Array.isArray(options)
	            ? options
	            : [];
	        parser.addListener('tagstart,tagend', function (event) {
	            var tagName = event.tagName;
	            if (exceptions.indexOf(tagName) === -1 &&
	                tagName !== tagName.toLowerCase()) {
	                reporter.error("The html element name of [ " + tagName + " ] must be in lowercase.", event.line, event.col, _this, event.raw);
	            }
	        });
	    },
	};

	var tagnameSpecialchars = {};

	Object.defineProperty(tagnameSpecialchars, "__esModule", { value: true });
	tagnameSpecialchars.default = {
	    id: 'tagname-specialchars',
	    description: 'All html element names must be in lowercase.',
	    init: function (parser, reporter) {
	        var _this = this;
	        var specialchars = /[^a-zA-Z0-9\-:_]/;
	        parser.addListener('tagstart,tagend', function (event) {
	            var tagName = event.tagName;
	            if (specialchars.test(tagName)) {
	                reporter.error("The html element name of [ " + tagName + " ] contains special character.", event.line, event.col, _this, event.raw);
	            }
	        });
	    },
	};

	var titleRequire = {};

	Object.defineProperty(titleRequire, "__esModule", { value: true });
	titleRequire.default = {
	    id: 'title-require',
	    description: '<title> must be present in <head> tag.',
	    init: function (parser, reporter) {
	        var _this = this;
	        var headBegin = false;
	        var hasTitle = false;
	        var onTagStart = function (event) {
	            var tagName = event.tagName.toLowerCase();
	            if (tagName === 'head') {
	                headBegin = true;
	            }
	            else if (tagName === 'title' && headBegin) {
	                hasTitle = true;
	            }
	        };
	        var onTagEnd = function (event) {
	            var tagName = event.tagName.toLowerCase();
	            if (hasTitle && tagName === 'title') {
	                var lastEvent = event.lastEvent;
	                if (lastEvent.type !== 'text' ||
	                    (lastEvent.type === 'text' && /^\s*$/.test(lastEvent.raw) === true)) {
	                    reporter.error('<title></title> must not be empty.', event.line, event.col, _this, event.raw);
	                }
	            }
	            else if (tagName === 'head') {
	                if (hasTitle === false) {
	                    reporter.error('<title> must be present in <head> tag.', event.line, event.col, _this, event.raw);
	                }
	                parser.removeListener('tagstart', onTagStart);
	                parser.removeListener('tagend', onTagEnd);
	            }
	        };
	        parser.addListener('tagstart', onTagStart);
	        parser.addListener('tagend', onTagEnd);
	    },
	};

	var tagsCheck = {};

	var __assign = (commonjsGlobal && commonjsGlobal.__assign) || function () {
	    __assign = Object.assign || function(t) {
	        for (var s, i = 1, n = arguments.length; i < n; i++) {
	            s = arguments[i];
	            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
	                t[p] = s[p];
	        }
	        return t;
	    };
	    return __assign.apply(this, arguments);
	};
	Object.defineProperty(tagsCheck, "__esModule", { value: true });
	var tagsTypings = {
	    a: {
	        selfclosing: false,
	        attrsRequired: ['href', 'title'],
	        redundantAttrs: ['alt'],
	    },
	    div: {
	        selfclosing: false,
	    },
	    main: {
	        selfclosing: false,
	        redundantAttrs: ['role'],
	    },
	    nav: {
	        selfclosing: false,
	        redundantAttrs: ['role'],
	    },
	    script: {
	        attrsOptional: [
	            ['async', 'async'],
	            ['defer', 'defer'],
	        ],
	    },
	    img: {
	        selfclosing: true,
	        attrsRequired: ['src', 'alt', 'title'],
	    },
	};
	tagsCheck.default = {
	    id: 'tags-check',
	    description: 'Checks html tags.',
	    init: function (parser, reporter, options) {
	        var _this = this;
	        tagsTypings = __assign(__assign({}, tagsTypings), options);
	        parser.addListener('tagstart', function (event) {
	            var attrs = event.attrs;
	            var col = event.col + event.tagName.length + 1;
	            var tagName = event.tagName.toLowerCase();
	            if (tagsTypings[tagName]) {
	                var currentTagType = tagsTypings[tagName];
	                if (currentTagType.selfclosing === true && !event.close) {
	                    reporter.warn("The <" + tagName + "> tag must be selfclosing.", event.line, event.col, _this, event.raw);
	                }
	                else if (currentTagType.selfclosing === false && event.close) {
	                    reporter.warn("The <" + tagName + "> tag must not be selfclosing.", event.line, event.col, _this, event.raw);
	                }
	                if (Array.isArray(currentTagType.attrsRequired)) {
	                    var attrsRequired = currentTagType.attrsRequired;
	                    attrsRequired.forEach(function (id) {
	                        if (Array.isArray(id)) {
	                            var copyOfId = id.map(function (a) { return a; });
	                            var realID_1 = copyOfId.shift();
	                            var values_1 = copyOfId;
	                            if (attrs.some(function (attr) { return attr.name === realID_1; })) {
	                                attrs.forEach(function (attr) {
	                                    if (attr.name === realID_1 &&
	                                        values_1.indexOf(attr.value) === -1) {
	                                        reporter.error("The <" + tagName + "> tag must have attr '" + realID_1 + "' with one value of '" + values_1.join("' or '") + "'.", event.line, col, _this, event.raw);
	                                    }
	                                });
	                            }
	                            else {
	                                reporter.error("The <" + tagName + "> tag must have attr '" + realID_1 + "'.", event.line, col, _this, event.raw);
	                            }
	                        }
	                        else if (!attrs.some(function (attr) { return id.split('|').indexOf(attr.name) !== -1; })) {
	                            reporter.error("The <" + tagName + "> tag must have attr '" + id + "'.", event.line, col, _this, event.raw);
	                        }
	                    });
	                }
	                if (Array.isArray(currentTagType.attrsOptional)) {
	                    var attrsOptional = currentTagType.attrsOptional;
	                    attrsOptional.forEach(function (id) {
	                        if (Array.isArray(id)) {
	                            var copyOfId = id.map(function (a) { return a; });
	                            var realID_2 = copyOfId.shift();
	                            var values_2 = copyOfId;
	                            if (attrs.some(function (attr) { return attr.name === realID_2; })) {
	                                attrs.forEach(function (attr) {
	                                    if (attr.name === realID_2 &&
	                                        values_2.indexOf(attr.value) === -1) {
	                                        reporter.error("The <" + tagName + "> tag must have optional attr '" + realID_2 + "' with one value of '" + values_2.join("' or '") + "'.", event.line, col, _this, event.raw);
	                                    }
	                                });
	                            }
	                        }
	                    });
	                }
	                if (Array.isArray(currentTagType.redundantAttrs)) {
	                    var redundantAttrs = currentTagType.redundantAttrs;
	                    redundantAttrs.forEach(function (attrName) {
	                        if (attrs.some(function (attr) { return attr.name === attrName; })) {
	                            reporter.error("The attr '" + attrName + "' is redundant for <" + tagName + "> and should be ommited.", event.line, col, _this, event.raw);
	                        }
	                    });
	                }
	            }
	        });
	    },
	};

	var attrNoUnnecessaryWhitespace = {};

	Object.defineProperty(attrNoUnnecessaryWhitespace, "__esModule", { value: true });
	attrNoUnnecessaryWhitespace.default = {
	    id: 'attr-no-unnecessary-whitespace',
	    description: 'No spaces between attribute names and values.',
	    init: function (parser, reporter, options) {
	        var _this = this;
	        var exceptions = Array.isArray(options) ? options : [];
	        parser.addListener('tagstart', function (event) {
	            var attrs = event.attrs;
	            var col = event.col + event.tagName.length + 1;
	            for (var i = 0; i < attrs.length; i++) {
	                if (exceptions.indexOf(attrs[i].name) === -1) {
	                    var match = /(\s*)=(\s*)/.exec(attrs[i].raw.trim());
	                    if (match && (match[1].length !== 0 || match[2].length !== 0)) {
	                        reporter.error("The attribute '" + attrs[i].name + "' must not have spaces between the name and value.", event.line, col + attrs[i].index, _this, attrs[i].raw);
	                    }
	                }
	            }
	        });
	    },
	};

	(function (exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	var alt_require_1 = altRequire;
	Object.defineProperty(exports, "altRequire", { enumerable: true, get: function () { return alt_require_1.default; } });
	var attr_lowercase_1 = attrLowercase;
	Object.defineProperty(exports, "attrLowercase", { enumerable: true, get: function () { return attr_lowercase_1.default; } });
	var attr_sorted_1 = attrSorted;
	Object.defineProperty(exports, "attrSort", { enumerable: true, get: function () { return attr_sorted_1.default; } });
	var attr_no_duplication_1 = attrNoDuplication$1;
	Object.defineProperty(exports, "attrNoDuplication", { enumerable: true, get: function () { return attr_no_duplication_1.default; } });
	var attr_unsafe_chars_1 = attrUnsafeChars;
	Object.defineProperty(exports, "attrUnsafeChars", { enumerable: true, get: function () { return attr_unsafe_chars_1.default; } });
	var attr_value_double_quotes_1 = attrValueDoubleQuotes;
	Object.defineProperty(exports, "attrValueDoubleQuotes", { enumerable: true, get: function () { return attr_value_double_quotes_1.default; } });
	var attr_value_not_empty_1 = attrValueNotEmpty;
	Object.defineProperty(exports, "attrValueNotEmpty", { enumerable: true, get: function () { return attr_value_not_empty_1.default; } });
	var attr_value_single_quotes_1 = attrValueSingleQuotes;
	Object.defineProperty(exports, "attrValueSingleQuotes", { enumerable: true, get: function () { return attr_value_single_quotes_1.default; } });
	var attr_whitespace_1 = attrWhitespace;
	Object.defineProperty(exports, "attrWhitespace", { enumerable: true, get: function () { return attr_whitespace_1.default; } });
	var doctype_first_1 = doctypeFirst;
	Object.defineProperty(exports, "doctypeFirst", { enumerable: true, get: function () { return doctype_first_1.default; } });
	var doctype_html5_1 = doctypeHtml5;
	Object.defineProperty(exports, "doctypeHTML5", { enumerable: true, get: function () { return doctype_html5_1.default; } });
	var head_script_disabled_1 = headScriptDisabled;
	Object.defineProperty(exports, "headScriptDisabled", { enumerable: true, get: function () { return head_script_disabled_1.default; } });
	var href_abs_or_rel_1 = hrefAbsOrRel;
	Object.defineProperty(exports, "hrefAbsOrRel", { enumerable: true, get: function () { return href_abs_or_rel_1.default; } });
	var html_lang_require_1 = htmlLangRequire;
	Object.defineProperty(exports, "htmlLangRequire", { enumerable: true, get: function () { return html_lang_require_1.default; } });
	var id_class_ad_disabled_1 = idClassAdDisabled;
	Object.defineProperty(exports, "idClsasAdDisabled", { enumerable: true, get: function () { return id_class_ad_disabled_1.default; } });
	var id_class_value_1 = idClassValue;
	Object.defineProperty(exports, "idClassValue", { enumerable: true, get: function () { return id_class_value_1.default; } });
	var id_unique_1 = idUnique;
	Object.defineProperty(exports, "idUnique", { enumerable: true, get: function () { return id_unique_1.default; } });
	var inline_script_disabled_1 = inlineScriptDisabled;
	Object.defineProperty(exports, "inlineScriptDisabled", { enumerable: true, get: function () { return inline_script_disabled_1.default; } });
	var inline_style_disabled_1 = inlineStyleDisabled;
	Object.defineProperty(exports, "inlineStyleDisabled", { enumerable: true, get: function () { return inline_style_disabled_1.default; } });
	var input_requires_label_1 = inputRequiresLabel;
	Object.defineProperty(exports, "inputRequiresLabel", { enumerable: true, get: function () { return input_requires_label_1.default; } });
	var script_disabled_1 = scriptDisabled;
	Object.defineProperty(exports, "scriptDisabled", { enumerable: true, get: function () { return script_disabled_1.default; } });
	var space_tab_mixed_disabled_1 = spaceTabMixedDisabled;
	Object.defineProperty(exports, "spaceTabMixedDisabled", { enumerable: true, get: function () { return space_tab_mixed_disabled_1.default; } });
	var spec_char_escape_1 = specCharEscape$2;
	Object.defineProperty(exports, "specCharEscape", { enumerable: true, get: function () { return spec_char_escape_1.default; } });
	var src_not_empty_1 = srcNotEmpty$2;
	Object.defineProperty(exports, "srcNotEmpty", { enumerable: true, get: function () { return src_not_empty_1.default; } });
	var style_disabled_1 = styleDisabled;
	Object.defineProperty(exports, "styleDisabled", { enumerable: true, get: function () { return style_disabled_1.default; } });
	var tag_pair_1 = tagPair$2;
	Object.defineProperty(exports, "tagPair", { enumerable: true, get: function () { return tag_pair_1.default; } });
	var tag_self_close_1 = tagSelfClose;
	Object.defineProperty(exports, "tagSelfClose", { enumerable: true, get: function () { return tag_self_close_1.default; } });
	var tagname_lowercase_1 = tagnameLowercase;
	Object.defineProperty(exports, "tagnameLowercase", { enumerable: true, get: function () { return tagname_lowercase_1.default; } });
	var tagname_specialchars_1 = tagnameSpecialchars;
	Object.defineProperty(exports, "tagnameSpecialChars", { enumerable: true, get: function () { return tagname_specialchars_1.default; } });
	var title_require_1 = titleRequire;
	Object.defineProperty(exports, "titleRequire", { enumerable: true, get: function () { return title_require_1.default; } });
	var tags_check_1 = tagsCheck;
	Object.defineProperty(exports, "tagsCheck", { enumerable: true, get: function () { return tags_check_1.default; } });
	var attr_no_unnecessary_whitespace_1 = attrNoUnnecessaryWhitespace;
	Object.defineProperty(exports, "attrNoUnnecessaryWhitespace", { enumerable: true, get: function () { return attr_no_unnecessary_whitespace_1.default; } });

	}(rules$2));

	(function (exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.HTMLParser = exports.Reporter = exports.HTMLRules = exports.HTMLHint = void 0;
	var htmlparser_1 = htmlparser;
	exports.HTMLParser = htmlparser_1.default;
	var reporter_1 = reporter;
	exports.Reporter = reporter_1.default;
	var HTMLRules = rules$2;
	exports.HTMLRules = HTMLRules;
	var HTMLHintCore = (function () {
	    function HTMLHintCore() {
	        this.rules = {};
	        this.defaultRuleset = {
	            'tagname-lowercase': true,
	            'attr-lowercase': true,
	            'attr-value-double-quotes': true,
	            'doctype-first': true,
	            'tag-pair': true,
	            'spec-char-escape': true,
	            'id-unique': true,
	            'src-not-empty': true,
	            'attr-no-duplication': true,
	            'title-require': true,
	        };
	    }
	    HTMLHintCore.prototype.addRule = function (rule) {
	        this.rules[rule.id] = rule;
	    };
	    HTMLHintCore.prototype.verify = function (html, ruleset) {
	        if (ruleset === void 0) { ruleset = this.defaultRuleset; }
	        if (Object.keys(ruleset).length === 0) {
	            ruleset = this.defaultRuleset;
	        }
	        html = html.replace(/^\s*<!--\s*htmlhint\s+([^\r\n]+?)\s*-->/i, function (all, strRuleset) {
	            strRuleset.replace(/(?:^|,)\s*([^:,]+)\s*(?:\:\s*([^,\s]+))?/g, function (all, ruleId, value) {
	                ruleset[ruleId] =
	                    value !== undefined && value.length > 0 ? JSON.parse(value) : true;
	                return '';
	            });
	            return '';
	        });
	        var parser = new htmlparser_1.default();
	        var reporter = new reporter_1.default(html, ruleset);
	        var rules = this.rules;
	        var rule;
	        for (var id in ruleset) {
	            rule = rules[id];
	            if (rule !== undefined && ruleset[id] !== false) {
	                rule.init(parser, reporter, ruleset[id]);
	            }
	        }
	        parser.parse(html);
	        return reporter.messages;
	    };
	    HTMLHintCore.prototype.format = function (arrMessages, options) {
	        if (options === void 0) { options = {}; }
	        var arrLogs = [];
	        var colors = {
	            white: '',
	            grey: '',
	            red: '',
	            reset: '',
	        };
	        if (options.colors) {
	            colors.white = '\x1b[37m';
	            colors.grey = '\x1b[90m';
	            colors.red = '\x1b[31m';
	            colors.reset = '\x1b[39m';
	        }
	        var indent = options.indent || 0;
	        arrMessages.forEach(function (hint) {
	            var leftWindow = 40;
	            var rightWindow = leftWindow + 20;
	            var evidence = hint.evidence;
	            var line = hint.line;
	            var col = hint.col;
	            var evidenceCount = evidence.length;
	            var leftCol = col > leftWindow + 1 ? col - leftWindow : 1;
	            var rightCol = evidence.length > col + rightWindow ? col + rightWindow : evidenceCount;
	            if (col < leftWindow + 1) {
	                rightCol += leftWindow - col + 1;
	            }
	            evidence = evidence.replace(/\t/g, ' ').substring(leftCol - 1, rightCol);
	            if (leftCol > 1) {
	                evidence = "..." + evidence;
	                leftCol -= 3;
	            }
	            if (rightCol < evidenceCount) {
	                evidence += '...';
	            }
	            arrLogs.push(colors.white + repeatStr(indent) + "L" + line + " |" + colors.grey + evidence + colors.reset);
	            var pointCol = col - leftCol;
	            var match = evidence.substring(0, pointCol).match(/[^\u0000-\u00ff]/g);
	            if (match !== null) {
	                pointCol += match.length;
	            }
	            arrLogs.push(colors.white +
	                repeatStr(indent) +
	                repeatStr(String(line).length + 3 + pointCol) + "^ " + colors.red + hint.message + " (" + hint.rule.id + ")" + colors.reset);
	        });
	        return arrLogs;
	    };
	    return HTMLHintCore;
	}());
	function repeatStr(n, str) {
	    return new Array(n + 1).join(str || ' ');
	}
	exports.HTMLHint = new HTMLHintCore();
	Object.keys(HTMLRules).forEach(function (key) {
	    exports.HTMLHint.addRule(HTMLRules[key]);
	});

	}(core));

	var attrNoDuplication = [{
	    name: 'Remove Attribute',
	    apply(view, from, to) {
	        view.dispatch({
	            changes: { from, to, insert: '' }
	        });
	    }
	},{
	    name: 'Rename Attribute',
	    apply(view, from, to) {
	        const [ value, attr ] = view.state.doc.slice(from, to).toString().match(/(?:\s+)?(\w+)=/);
	       
	        const anchor = from + value.indexOf(attr);

	        const tr = view.state.update({
	            selection: {
	                anchor,
	                head: anchor + attr.length
	            },
	            scrollIntoView: true
	        });

	        view.dispatch(tr);
	        view.focus();
	    }
	}];

	var invalidAttributeChar$3 = [{
	    name: 'Fix Error',
	    apply(view, from, to) {
	        view.dispatch({
	            changes: { from, to, insert: '' }
	        });
	    }
	}];

	var specCharEscape$1 = [{
	    name: 'Fix Error',
	    apply(view, from, to) {
	        const map = {
	            '<': '&lt;',
	            '>': '&rt;',
	            '&': '&amp;'
	        };

	        const [ value, char ] = view.state.doc.slice(from, to)
	            .toString()
	            .match(/(?:\s+)?([<&>]|\&\s)/);

	        const index = value.indexOf(char);
	        
	        view.dispatch({
	            changes: { from: from + index, to: from + index + 1, insert: map[char] }
	        });
	    }
	}];

	var srcNotEmpty$1 = [{
	    name: 'Remove Img',
	    apply(view, from, to) {
	        const cursor = view.state.tree.cursor(from);

	        view.dispatch({
	            changes: { from: cursor.from , to: cursor.to, insert: '' }
	        });
	    }
	}];

	class Element {
	    constructor(view, from, to) {
	        this.from = from;
	        this.to = to;
	        this.tagName = tagName(view, from, to);
	        this.closed = false;
	    }

	    is(tagName) {
	        return this.tagName.toLowerCase() === tagName.toLowerCase();
	    }
	}

	function tagName(view, from, to) {
	    return view.state.doc.sliceString(from, to)
	        .toLowerCase()
	        .match(/^<\/?(?:\s+)?(\w+)/)[1];
	}

	function changes(view, from, to) {
	    let lastElement, pos, stack = [];

	    view.state.tree.iterate({
	        from, to,
	        enter(type, from, to, get) {
	            if(type.name === 'Element') {
	                stack.push(lastElement = new Element(view, from, to));
	            }
	            else if(type.name === 'SelfClosingTag') {
	                stack.splice(stack.indexOf(lastElement), 1);
	            }
	        },
	        leave(type, from, to) {
	            if(type.name === 'CloseTag') {
	                for(pos = stack.length - 1; pos >= 0; pos--) {
	                    if(!stack[pos].closed && stack[pos].is(tagName(view, from, to))) {
	                        stack[pos].closed = true;

	                        break;
	                    }
	                }
	            }
	        }
	    });

	    return stack.filter(element => !element.closed)
	        .reverse()
	        .map(({ to, tagName }) => ({
	            from: to,
	            to: to,
	            insert: `</${tagName}>`
	        }));
	}

	function validate(view, { message }) {
	    return message.indexOf('Tag must be paired, no start tag') === -1;
	}

	var tagPair$1 = [{
	    name: 'Close Only First Tag',
	    validate,
	    apply(view, from, to) {
	        let data = [];

	        // The purpose of this loop is if the from/to doen't catch the error,
	        // then we should traverse backwards until we find a charge, or reach
	        // the beginning of the document.
	        do {      
	            data = changes(view, from, to);

	            from -= 10;
	        }
	        while(from >= 0 && !data.length);
	            
	        view.dispatch({
	            changes: data.slice(0, 1)
	        });
	    }
	}, {
	    name: 'Close All Tags',
	    validate,
	    apply(view, from, to) {
	        view.dispatch({
	            changes: changes(view)
	        });
	    }
	}];

	var validPathFormat$3 = [{
	    name: 'Fix Path',
	    apply(view, from, to) {
	        const matches = view.state.doc.slice(from, to).toString().match(/(=(?:\s+)?['"])(.+)?['"]/);
	        
	        const [ expression, eq, value] = matches;

	        const anchor = from + eq.length + matches.index;

	        const tr = view.state.update({
	            selection: {
	                anchor,
	                head: anchor + (value ? value.length : 0)
	            },
	            scrollIntoView: true
	        });

	        view.dispatch(tr);
	        view.focus();
	    }
	}, {
	    name: 'Remove Attribute',
	    apply(view, from, to) {
	        view.dispatch({
	            changes: { from, to, insert: '' }
	        });
	    }
	},{
	    name: 'Remove Tag',
	    apply(view, from, to) {
	        const cursor = view.state.tree.cursor(from);

	        cursor.moveTo(cursor.to);
	        
	        view.dispatch({
	            changes: { from: cursor.from , to: cursor.to, insert: '' }
	        });
	    }
	},];

	const attrNoDuplicate = attrNoDuplication;
	const invalidAttributeChar$2 = invalidAttributeChar$3;
	const specCharEscape = specCharEscape$1;
	const srcNotEmpty = srcNotEmpty$1;
	const tagPair = tagPair$1;
	const validPathFormat$2 = validPathFormat$3;

	var actions$1 = {
	    'attr-no-duplication': attrNoDuplicate,
	    'invalid-attribute-char': invalidAttributeChar$2,
	    'spec-char-escape': specCharEscape,
	    'src-not-empty': srcNotEmpty,
	    'tag-pair': tagPair,
	    'valid-path-format': validPathFormat$2,
	};

	const EMPTY_TAGS = [
	    'area', 'base', 'basefont', 'br', 'col', 'frame', 'hr', 'img', 'input',
	    'isindex', 'link', 'meta', 'param', 'embed', 'track', 'command', 'source',
	    'keygen', 'wbr'
	];

	class EventNode {
	    constructor(event, parent) {
	        event = event || {};

	        const tagName = event.tagName && event.tagName.toLowerCase();

	        this.children = [];

	        if(this.root === parent) {
	            this.root = true;
	        }
	        else {
	            this.closed = !!event.close || EMPTY_TAGS.indexOf(tagName) > -1;
	            this.parent = parent;
	            this.tagName = tagName;
	            this.attrs = event.attrs;
	            this.from = event.pos;
	            this.to = null;
	            this.col = event.col;
	            this.line = event.line;
	            this.raw = event.raw;
	        }
	    }

	    get depth() {
	        let depth = 0, el = this.parent;

	        while(el.parent) {
	            depth++;

	            el = el.parent;
	        }
	        
	        return depth;
	    }
	    
	    close(event, reporter) {
	        this.to = event.pos + event.raw.length;
	        this.raw = reporter.html.slice(this.from, this.to);
	    }

	    push(event) {
	        return this.children.push(event);
	    }

	    before(index) {
	        return this.children.slice(0, index);
	    }

	    after(index) {
	        return this.children.slice(index + 1);
	    }

	    find(...args) {
	        const find = children => {
	            return children.reduce((carry, child) => {
	                if(child.match(...args)) {
	                    carry.push(child);
	                }

	                if(child.children.length) {
	                    carry = carry.concat(find(child.children));
	                }

	                return carry;
	            }, []);
	        };

	        return find(this.children);
	    }

	    findFirst(tagName) {
	        return this.find(tagName)[0];
	    }

	    index() {
	        return this.parent ? this.parent.children.indexOf(this) : 0;
	    }

	    isChildOf(subject) {
	        return this.parent === subject;
	    }

	    isBefore(subject) {
	        return this.index() < subject.index();
	    }

	    isAfter(subject) {
	        return this.index() > subject.index();
	    }

	    isFirst() {
	        return !this.parent || this.index() === 0;
	    }

	    isLast() {
	        return !this.parent || this.index() === this.parent.children.length - 1;
	    }
	    
	    first() {
	        return this.children[0];
	    }

	    match(...args) {
	        return args.indexOf(this.tagName && this.tagName.toLowerCase()) > -1;
	    }

	}
	class EventTree$8 {
	    constructor(parser, reporter, finish) {
	        this.reporter = reporter;

	        const stack = [], root = new EventNode();
	        
	        let parentNode = root;

	        parser.addListener('tagstart', event => {
	            const node = new EventNode(event, parentNode);

	            parentNode.push(node);

	            if(!node.closed) {
	                stack.push(parentNode = node);
	            }
	        });

	        parser.addListener('tagend', event => {
	            const tagName = event.tagName.toLowerCase();
	            
	            let pos;

	            for(pos = stack.length - 1; pos >= 0; pos--) {
	                if(stack[pos].tagName === tagName) {
	                    break;
	                }
	            }

	            if(stack[pos]) {
	                stack[pos].close(event, this.reporter);

	                parentNode = stack[pos].parent;
	                
	                stack.splice(pos, 1);
	            }
	        });

	        parser.addListener('end', event => {
	            root.closed = true;
	            
	            finish && finish(root);
	        });
	    }
	}
	var EventTree_1 = {
	    EventNode,
	    EventTree: EventTree$8
	};

	const { EventTree: EventTree$7 } = EventTree_1;

	var bodyNoDuplicates$1 = {
	    id: 'body-no-duplicates',
	    description: 'The body tag must not be a duplicate.',
	    init(parser, reporter, options) {
	        new EventTree$7(parser, reporter, root => {
	            let body;

	            for(let node of root.find('body')) {
	                if(!body) {
	                    body = node;

	                    continue;
	                }

	                reporter.error(
	                    `The [ body ] tag already exists on line ${body.line}.`,
	                    node.line,
	                    node.col,
	                    this,
	                    node.raw
	                );
	            }
	        });
	    }
	};

	const { EventTree: EventTree$6 } = EventTree_1;

	var headBodyDescendentsHtml$1 = {
	    id: 'head-body-descendents-html',
	    description: 'The head and body tags must be a direct child descendents of the html tag.',
	    init(parser, reporter, options) {
	        new EventTree$6(parser, reporter, root => {
	            const html = root.findFirst('html');

	            root.find('head', 'body')
	                .filter(child => {
	                    return !html || !child.isChildOf(html);
	                })
	                .forEach(child => {
	                    const { line, col, raw } = child;
	                    
	                    const message = html
	                        ? `The [ ${child.tagName} ] tag must be a direct child descendent of the [ html ] tag on line ${html.line}.`
	                        : `The [ ${child.tagName} ] tag must be a direct child descendent of an [ html ] tag.`;

	                    reporter.error(message, line, col, this, raw);
	                });
	        });
	    }
	};

	const { EventTree: EventTree$5 } = EventTree_1;

	var headNoDuplicates$1 = {
	    id: 'head-no-duplicates',
	    description: 'The head tag must not be a duplicate.',
	    init(parser, reporter, options) {
	        new EventTree$5(parser, reporter, root => {
	            let head;

	            for(let node of root.find('head')) {
	                if(!head) {
	                    head = node;

	                    continue;
	                }

	                reporter.error(
	                    `The [ head ] tag is a duplicate of the tag on line ${head.line}.`,
	                    node.line,
	                    node.col,
	                    this,
	                    node.raw
	                );
	            }
	        });
	    }
	};

	const { EventTree: EventTree$4 } = EventTree_1;

	var headValidChildren = {
	    id: 'head-valid-children',
	    description: 'The head tag must only contain valid elements.',
	    init(parser, reporter, options) {
	        const tags = Array.isArray(options) ? options : [
	            'base', 'link', 'meta', 'noscript', 'script', 'style', 'template', 'title'
	        ];

	        new EventTree$4(parser, reporter, root => {
	            for(let node of root.find('head')) {
	                for(let child of node.children) {
	                    if(tags.indexOf(child.tagName.toLowerCase()) > -1) {
	                        return;
	                    }

	                    reporter.error(
	                        `The [ ${child.tagName} ] tag is not allowed inside the [ head ] tag on line ${node.line}.`,
	                        child.line,
	                        child.col,
	                        this,
	                        child.raw
	                    );
	                }
	            }
	        });
	    }
	};

	const { EventTree: EventTree$3 } = EventTree_1;

	var htmlValidChildrenOrder$1 = {
	    id: 'html-valid-children-order',
	    description: 'The head and body tags must be in the correct order.',
	    init(parser, reporter, options) {
	        new EventTree$3(parser, reporter, root => {
	            const html = root.findFirst('html');

	            const htmlChildren = root.find('head', 'body').filter(child => {
	                return !html || child.isChildOf(html);
	            });

	            const bodyTags = htmlChildren.filter(child => child.tagName === 'body');
	            const headTags = htmlChildren.filter(child => child.tagName === 'head');

	            if(bodyTags[0] && headTags[0] && bodyTags[0].isBefore(headTags[0])) {
	                const { line, col, raw } = bodyTags[0];

	                const message = `The [ ${bodyTags[0].tagName} ] tag must come after the [ head ] tag on line ${headTags[0].line}.`;

	                reporter.error(message, line, col, this, raw);
	            }
	                
	            if(bodyTags[0] && headTags[0] && headTags[0].isAfter(bodyTags[0])) {
	                const { line, col, raw } = headTags[0];

	                const message = `The [ ${headTags[0].tagName} ] tag must come before the [ body ] tag on line ${bodyTags[0].line}.`;

	                reporter.error(message, line, col, this, raw);
	            }
	        });
	    }
	};

	const { EventTree: EventTree$2 } = EventTree_1;

	var htmlNoDuplicates$1 = {
	    id: 'html-no-duplicates',
	    description: 'The html tag must be a unique root element.',
	    init(parser, reporter, options) {
	        new EventTree$2(parser, reporter, root => {
	            const htmls = root.find('html');

	            htmls.filter(subject => subject !== htmls[0])
	                .forEach(child => {
	                    const { line, col, raw } = child;

	                    const message = `The [ ${child.tagName} ] tag already exists on line ${htmls[0].line}.`;

	                    reporter.error(message, line, col, this, raw);
	                });
	        });
	    }
	};

	const { EventTree: EventTree$1 } = EventTree_1;

	var htmlRootNode$1 = {
	    id: 'html-root-node',
	    description: 'The html tag must be the only root node in the document.',
	    init(parser, reporter, options) {
	        new EventTree$1(parser, reporter, root => {
	            const html = root.findFirst('html');

	            if(html) {
	                root.children.filter(child => child.tagName !== 'html')
	                    .forEach(child => {
	                        const { line, col, raw } = child;

	                        const message = `The [ ${child.tagName} ] cannot come ${child.isBefore(html) ? 'before' : 'after'} the [ html ] tag on line ${html.line}.`;

	                        reporter.error(message, line, col, this, raw);
	                    });
	            }
	        });
	    }
	};

	const { EventTree } = EventTree_1;

	var htmlValidChildren$1 = {
	    id: 'html-valid-children',
	    description: 'The html tag must only contain a head and body tag.',
	    init(parser, reporter, options) {
	        new EventTree(parser, reporter, root => {
	            const html = root.findFirst('html');

	            if(html) {
	                html.children.forEach(child => {
	                    if(!child.match('head', 'body')) {                        
	                        const { line, col, raw } = child;

	                        const message = `The [ ${child.tagName} ] tag cannot be a direct descendent of the [ html ] tag on line ${html.line}.`;

	                        reporter.error(message, line, col, this, raw);
	                    }
	                });
	            }
	        });
	    }
	};

	var imgSrcRequired$1 = {
	    id: 'img-src-required',
	    description: 'The img tag must have a src attribute.',
	    init(parser, reporter, options) {
	        parser.addListener('tagstart', event => {
	            if(event.tagName.toLowerCase() === 'img') {
	                for(let attr of event.attrs) {
	                    if(attr.name.toLowerCase() === 'src') {
	                        return;
	                    }
	                }
	    
	                const { line, col, raw } = event;

	                const message = `The [ ${event.tagName} ] tag must have a [ src ] attribute`;

	                reporter.error(message, line, col, this, raw);
	            }
	        });
	    }
	};

	var invalidAttributeChar$1 = {
	    id: 'invalid-attribute-char',
	    description: 'Attribute must contain valid characters.',
	    init(parser, reporter, chars) {
	        parser.addListener('tagstart', event => {
	            let offset = 1;

	            event.attrs.forEach(({ name, index }) => {
	                offset += event.raw.slice(offset).indexOf(name);
	                
	                let pos = 0;

	                const matches = name.match(/[^a-zA-Z:\-1-9]/g);
	                    
	                if(matches) {
	                    while(matches.length) {
	                        const slice = name.slice(pos),
	                            char = matches.shift(),
	                            index = slice.indexOf(char);

	                        reporter.error(
	                            `[ ${char} ] character cannot be used for attribute names.`,
	                            event.line,
	                            event.col + offset + pos + index,
	                            this,
	                            char
	                        );
	                    
	                        pos += index + 1;
	                    }
	                }
	            });
	        });
	    }
	};

	const regex = {
	    'absolute': /^https?:\/\//,
	    'relative': /^\w+?:/
	};

	class Pattern {
	    constructor(options) {
	        const { name, pattern } =Object.assign({
	            pattern: null,
	            name: null
	        }, typeof options === 'object' ? options : {
	            pattern: options
	        });

	        this.name = name || pattern;
	        this.pattern = pattern;
	        this.regex = regex[pattern] || new RegExp(pattern);
	    }

	    test(value) {
	        return this.regex.test(value);
	    }

	    error(event, attr) {
	        return new MatchError(this, event, attr);
	    }
	}

	class MatchError extends Error {
	    constructor(pattern, event, attr) {
	        super();

	        this.message = `The [ ${attr.name} ] attribute "${attr.value}" must follow the ${pattern.name} format.`;        
	        this.name = pattern.name;
	        this.line = event.line;
	        this.col = event.col + event.tagName.length + 1 + attr.index;
	    }
	}

	class ReporterError extends Error {
	    
	    constructor(event, errors, attr) {
	        super(errors.length === 1 ? errors[0].message : (
	            `The [ ${attr.name} ] attribute "${attr.value}" must one of the following formats: ${errors.map(event => `"${event.name}"`).join(', ')}.`
	        ));

	        this.line = event.line;
	        this.col = event.col + event.tagName.length + 1 + attr.index;
	    }
	    
	}
	function test(patterns, event, attr) {
	    const errors = [];

	    for(const [i, pattern] of Object.entries(patterns)) {
	        if(pattern.test(attr.value)) {
	            return true;
	        }
	        
	        errors.push(pattern.error(event, attr));
	    }

	    throw new ReporterError(event, errors, attr);
	}

	var validPathFormat$1 = {
	    id: 'valid-path-format',
	    description: 'Paths must be a valid format.',
	    init(parser, reporter, options) {
	        options = Array.isArray(options) ? options : [];

	        parser.addListener('tagstart', (event) => {
	            options.forEach(config => {
	                config = Object.assign({
	                    formats: []
	                }, config || {});
	        
	                const patterns = config.formats.map(pattern => new Pattern(pattern));
	        
	                if(config.tag && !Array.isArray(config.tag)) {
	                    config.tag = [config.tag];
	                }

	                if(!config.tag || config.tag.indexOf(event.tagName) > -1) {
	                    event.attrs.forEach(attr => {
	                        if(!config.attr || config.attr === attr.name) {
	                            try {
	                                test(patterns, event, attr);
	                            }
	                            catch (e) {
	                                reporter.error(
	                                    e.message,
	                                    e.line,
	                                    e.col,
	                                    this,
	                                    attr.raw
	                                );
	                            }
	                        }
	                    });
	                }
	            });
	        });
	    }
	};

	var nestedParagraphs$1 = {
	    id: 'nested-paragraphs',
	    description: 'Nested paragraphs are prohibited.',
	    init(parser, reporter) {
	        let openingTag = false;
	        
	        const stack = [];

	        parser.addListener('tagstart', event => {
	            if(event.tagName.toLowerCase() === 'p') {
	                if(openingTag) {
	                    stack.push(event);
	                }
	                else {
	                    openingTag = event;
	                }
	            }
	        });

	        parser.addListener('tagend', event => {
	            const isParagraph = event.tagName.toLowerCase() === 'p';

	            if(openingTag && isParagraph) {
	                const [ start ] = stack.splice(stack.length - 1);

	                if(!start) {
	                    openingTag = false;

	                    return;
	                }
	                
	                reporter.error(
	                    `[ p ] tags cannot be nested inside the [ p ] tag on line ${openingTag.line}.`,
	                    start.line,
	                    start.col,
	                    this,
	                    reporter.html.slice(start.pos, event.pos + event.raw.length)
	                );
	            }
	            else if(!isParagraph) {
	                openingTag = false;
	            }
	        });

	        parser.addListener('end', event => {
	            if(openingTag && stack.length) {
	                stack.forEach(start => {
	                    reporter.error(
	                        `[ p ] tags cannot be nested inside the [ p ] tag on line ${openingTag.line}.`,
	                        start.line,
	                        start.col,
	                        this,
	                        reporter.html.slice(start.pos, event.lastEvent.pos + event.lastEvent.raw.length)
	                    );
	                });
	            }
	        });
	    }
	};

	const bodyNoDuplicates = bodyNoDuplicates$1;
	const headBodyDescendentsHtml = headBodyDescendentsHtml$1;
	const headNoDuplicates = headNoDuplicates$1;
	const headValidContentModel = headValidChildren;
	const htmlValidChildrenOrder = htmlValidChildrenOrder$1;
	const htmlNoDuplicates = htmlNoDuplicates$1;
	const htmlRootNode = htmlRootNode$1;
	const htmlValidChildren = htmlValidChildren$1;
	const imgSrcRequired = imgSrcRequired$1;
	const invalidAttributeChar = invalidAttributeChar$1;
	const validPathFormat = validPathFormat$1;
	const nestedParagraphs = nestedParagraphs$1;

	var rules$1 = {
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
	    'nested-paragraphs': nestedParagraphs,
	    'valid-path-format': validPathFormat,
	};

	const defaultConfig = require$$0;
	const { HTMLHint } = core;
	const actions = actions$1;
	const rules = rules$1;

	Object.keys(rules).forEach((key) => {
	    HTMLHint.addRule(rules[key]);
	});

	function verify(html, config) {
	    return HTMLHint.verify(html, config || defaultConfig).map(error => {
	        error.rule.link = error.rule.link.replace(
	            'https://github.com/thedaviddias/HTMLHint/wiki/',
	            'https://thecapsule.email/docs/codes/'
	        );
	        
	        return error;
	    });
	}

	function lint(html, config) {
	    return verify(html, config || defaultConfig).map(error => {
	        error.rule.actions = actions[error.rule.id] || [];

	        return error;
	    });
	}

	var capsuleLint = {
	    lint,
	    verify
	};

	return capsuleLint;

})));
