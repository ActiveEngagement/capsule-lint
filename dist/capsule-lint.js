var Te = Object.defineProperty;
var $e = (i, r, t) => r in i ? Te(i, r, { enumerable: !0, configurable: !0, writable: !0, value: t }) : i[r] = t;
var p = (i, r, t) => ($e(i, typeof r != "symbol" ? r + "" : r, t), t);
var j = {}, M = {};
Object.defineProperty(M, "__esModule", { value: !0 });
class Oe {
  constructor() {
    this._listeners = {}, this._mapCdataTags = this.makeMap("script,style"), this._arrBlocks = [], this.lastEvent = null;
  }
  makeMap(r) {
    const t = {}, a = r.split(",");
    for (let e = 0; e < a.length; e++)
      t[a[e]] = !0;
    return t;
  }
  parse(r) {
    const t = this._mapCdataTags, a = /<(?:\/([^\s>]+)\s*|!--([\s\S]*?)--|!([^>]*?)|([\w\-:]+)((?:\s+[^\s"'>\/=\x00-\x0F\x7F\x80-\x9F]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'>]*))?)*?)\s*(\/?))>/g, e = /\s*([^\s"'>\/=\x00-\x0F\x7F\x80-\x9F]+)(?:\s*=\s*(?:(")([^"]*)"|(')([^']*)'|([^\s"'>]*)))?/g, n = /\r?\n/g;
    let s, l, o = 0, d, c, u = null, h, f = [], w = 0, m, _ = 0, b = 1;
    const A = this._arrBlocks;
    this.fire("start", {
      pos: 0,
      line: 1,
      col: 1
    });
    const $ = () => {
      const L = c.find((g) => g.name === "type") || {
        value: ""
      };
      return t[d] && L.value.indexOf("text/ng-template") === -1;
    }, y = (L, g, O, T) => {
      const C = O - _ + 1;
      for (T === void 0 && (T = {}), T.raw = g, T.pos = O, T.line = b, T.col = C, A.push(T), this.fire(L, T); n.exec(g); )
        b++, _ = O + n.lastIndex;
    };
    for (; s = a.exec(r); ) {
      if (l = s.index, l > o && (m = r.substring(o, l), u ? f.push(m) : y("text", m, o)), o = a.lastIndex, (d = s[1]) && (u && d === u && (m = f.join(""), y("cdata", m, w, {
        tagName: u,
        attrs: h
      }), u = null, h = void 0, f = []), !u)) {
        y("tagend", s[0], l, {
          tagName: d
        });
        continue;
      }
      if (u)
        f.push(s[0]);
      else if (d = s[4]) {
        c = [];
        const L = s[5];
        let g, O = 0;
        for (; g = e.exec(L); ) {
          const T = g[1], C = g[2] ? g[2] : g[4] ? g[4] : "", v = g[3] ? g[3] : g[5] ? g[5] : g[6] ? g[6] : "";
          c.push({
            name: T,
            value: v,
            quote: C,
            index: g.index,
            raw: g[0]
          }), O += g[0].length;
        }
        O === L.length ? (y("tagstart", s[0], l, {
          tagName: d,
          attrs: c,
          close: s[6]
        }), $() && (u = d, h = c.concat(), f = [], w = o)) : y("text", s[0], l);
      } else
        (s[2] || s[3]) && y("comment", s[0], l, {
          content: s[2] || s[3],
          long: !!s[2]
        });
    }
    r.length > o && (m = r.substring(o, r.length), y("text", m, o)), this.fire("end", {
      pos: o,
      line: b,
      col: r.length - _ + 1
    });
  }
  addListener(r, t) {
    const a = this._listeners, e = r.split(/[,\s]/);
    let n;
    for (let s = 0, l = e.length; s < l; s++)
      n = e[s], a[n] === void 0 && (a[n] = []), a[n].push(t);
  }
  fire(r, t) {
    t === void 0 && (t = {}), t.type = r;
    let a = [];
    const e = this._listeners[r], n = this._listeners.all;
    e !== void 0 && (a = a.concat(e)), n !== void 0 && (a = a.concat(n));
    const s = this.lastEvent;
    s !== null && (delete s.lastEvent, t.lastEvent = s), this.lastEvent = t;
    for (let l = 0, o = a.length; l < o; l++)
      a[l].call(this, t);
  }
  removeListener(r, t) {
    const a = this._listeners[r];
    if (a !== void 0) {
      for (let e = 0, n = a.length; e < n; e++)
        if (a[e] === t) {
          a.splice(e, 1);
          break;
        }
    }
  }
  fixPos(r, t) {
    const e = r.raw.substr(0, t).split(/\r?\n/), n = e.length - 1;
    let s = r.line, l;
    return n > 0 ? (s += n, l = e[n].length + 1) : l = r.col + t, {
      line: s,
      col: l
    };
  }
  getMapAttrs(r) {
    const t = {};
    let a;
    for (let e = 0, n = r.length; e < n; e++)
      a = r[e], t[a.name] = a.value;
    return t;
  }
}
M.default = Oe;
var E = {};
Object.defineProperty(E, "__esModule", { value: !0 });
class Ne {
  constructor(r, t) {
    this.html = r, this.lines = r.split(/\r?\n/);
    const a = /\r?\n/.exec(r);
    this.brLen = a !== null ? a[0].length : 0, this.ruleset = t, this.messages = [];
  }
  info(r, t, a, e, n) {
    this.report("info", r, t, a, e, n);
  }
  warn(r, t, a, e, n) {
    this.report("warning", r, t, a, e, n);
  }
  error(r, t, a, e, n) {
    this.report("error", r, t, a, e, n);
  }
  report(r, t, a, e, n, s) {
    const l = this.lines, o = this.brLen;
    let d = "", c = 0;
    for (let u = a - 1, h = l.length; u < h && (d = l[u], c = d.length, e > c && a < h); u++)
      a++, e -= c, e !== 1 && (e -= o);
    this.messages.push({
      type: r,
      message: t,
      raw: s,
      evidence: d,
      line: a,
      col: e,
      rule: {
        id: n.id,
        description: n.description,
        link: `https://htmlhint.com/docs/user-guide/rules/${n.id}`
      }
    });
  }
}
E.default = Ne;
var ge = {}, x = {};
Object.defineProperty(x, "__esModule", { value: !0 });
x.default = {
  id: "alt-require",
  description: "The alt attribute of an <img> element must be present and alt attribute of area[href] and input[type=image] must have a value.",
  init(i, r) {
    i.addListener("tagstart", (t) => {
      const a = t.tagName.toLowerCase(), e = i.getMapAttrs(t.attrs), n = t.col + a.length + 1;
      let s;
      a === "img" && !("alt" in e) ? r.warn("An alt attribute must be present on <img> elements.", t.line, n, this, t.raw) : (a === "area" && "href" in e || a === "input" && e.type === "image") && (!("alt" in e) || e.alt === "") && (s = a === "area" ? "area[href]" : "input[type=image]", r.warn(`The alt attribute of ${s} must have a value.`, t.line, n, this, t.raw));
    });
  }
};
var k = {};
Object.defineProperty(k, "__esModule", { value: !0 });
const Ae = [
  "allowReorder",
  "attributeName",
  "attributeType",
  "autoReverse",
  "baseFrequency",
  "baseProfile",
  "calcMode",
  "clipPath",
  "clipPathUnits",
  "contentScriptType",
  "contentStyleType",
  "diffuseConstant",
  "edgeMode",
  "externalResourcesRequired",
  "filterRes",
  "filterUnits",
  "glyphRef",
  "gradientTransform",
  "gradientUnits",
  "kernelMatrix",
  "kernelUnitLength",
  "keyPoints",
  "keySplines",
  "keyTimes",
  "lengthAdjust",
  "limitingConeAngle",
  "markerHeight",
  "markerUnits",
  "markerWidth",
  "maskContentUnits",
  "maskUnits",
  "numOctaves",
  "onBlur",
  "onChange",
  "onClick",
  "onFocus",
  "onKeyUp",
  "onLoad",
  "pathLength",
  "patternContentUnits",
  "patternTransform",
  "patternUnits",
  "pointsAtX",
  "pointsAtY",
  "pointsAtZ",
  "preserveAlpha",
  "preserveAspectRatio",
  "primitiveUnits",
  "refX",
  "refY",
  "repeatCount",
  "repeatDur",
  "requiredExtensions",
  "requiredFeatures",
  "specularConstant",
  "specularExponent",
  "spreadMethod",
  "startOffset",
  "stdDeviation",
  "stitchTiles",
  "surfaceScale",
  "systemLanguage",
  "tableValues",
  "targetX",
  "targetY",
  "textLength",
  "viewBox",
  "viewTarget",
  "xChannelSelector",
  "yChannelSelector",
  "zoomAndPan"
];
function Ce(i, r) {
  if (r instanceof RegExp)
    return r.test(i) ? { match: i, pattern: r } : !1;
  const t = r[0], a = r[r.length - 1], e = r[r.length - 2], n = t === "/" && (a === "/" || e === "/" && a === "i"), s = n && a === "i";
  return n ? s ? new RegExp(r.slice(1, -2), "i").test(i) : new RegExp(r.slice(1, -1)).test(i) : i === r;
}
k.default = {
  id: "attr-lowercase",
  description: "All attribute names must be in lowercase.",
  init(i, r, t) {
    const a = (Array.isArray(t) ? t : []).concat(Ae);
    i.addListener("tagstart", (e) => {
      const n = e.attrs;
      let s;
      const l = e.col + e.tagName.length + 1;
      for (let o = 0, d = n.length; o < d; o++) {
        s = n[o];
        const c = s.name;
        !a.find((u) => Ce(c, u)) && c !== c.toLowerCase() && r.error(`The attribute name of [ ${c} ] must be in lowercase.`, e.line, l + s.index, this, s.raw);
      }
    });
  }
};
var q = {};
Object.defineProperty(q, "__esModule", { value: !0 });
q.default = {
  id: "attr-sorted",
  description: "Attribute tags must be in proper order.",
  init(i, r) {
    const t = {}, a = [
      "class",
      "id",
      "name",
      "src",
      "for",
      "type",
      "href",
      "value",
      "title",
      "alt",
      "role"
    ];
    for (let e = 0; e < a.length; e++)
      t[a[e]] = e;
    i.addListener("tagstart", (e) => {
      const n = e.attrs, s = [];
      for (let o = 0; o < n.length; o++)
        s.push(n[o].name);
      const l = JSON.stringify(s);
      s.sort((o, d) => t[o] == null && t[d] == null ? 0 : t[o] == null ? 1 : t[d] == null ? -1 : t[o] - t[d] || o.localeCompare(d)), l !== JSON.stringify(s) && r.error(`Inaccurate order ${l} should be in hierarchy ${JSON.stringify(s)} `, e.line, e.col, this, e.raw);
    });
  }
};
var R = {};
Object.defineProperty(R, "__esModule", { value: !0 });
R.default = {
  id: "attr-no-duplication",
  description: "Elements cannot have duplicate attributes.",
  init(i, r) {
    i.addListener("tagstart", (t) => {
      const a = t.attrs;
      let e, n;
      const s = t.col + t.tagName.length + 1, l = {};
      for (let o = 0, d = a.length; o < d; o++)
        e = a[o], n = e.name, l[n] === !0 && r.error(`Duplicate of attribute name [ ${e.name} ] was found.`, t.line, s + e.index, this, e.raw), l[n] = !0;
    });
  }
};
var S = {};
Object.defineProperty(S, "__esModule", { value: !0 });
S.default = {
  id: "attr-unsafe-chars",
  description: "Attribute values cannot contain unsafe chars.",
  init(i, r) {
    i.addListener("tagstart", (t) => {
      const a = t.attrs;
      let e;
      const n = t.col + t.tagName.length + 1, s = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/;
      let l;
      for (let o = 0, d = a.length; o < d; o++)
        if (e = a[o], l = s.exec(e.value), l !== null) {
          const c = escape(l[0]).replace(/%u/, "\\u").replace(/%/, "\\x");
          r.warn(`The value of attribute [ ${e.name} ] cannot contain an unsafe char [ ${c} ].`, t.line, n + e.index, this, e.raw);
        }
    });
  }
};
var D = {};
Object.defineProperty(D, "__esModule", { value: !0 });
D.default = {
  id: "attr-value-double-quotes",
  description: "Attribute values must be in double quotes.",
  init(i, r) {
    i.addListener("tagstart", (t) => {
      const a = t.attrs;
      let e;
      const n = t.col + t.tagName.length + 1;
      for (let s = 0, l = a.length; s < l; s++)
        e = a[s], (e.value !== "" && e.quote !== '"' || e.value === "" && e.quote === "'") && r.error(`The value of attribute [ ${e.name} ] must be in double quotes.`, t.line, n + e.index, this, e.raw);
    });
  }
};
var z = {};
Object.defineProperty(z, "__esModule", { value: !0 });
z.default = {
  id: "attr-value-not-empty",
  description: "All attributes must have values.",
  init(i, r) {
    i.addListener("tagstart", (t) => {
      const a = t.attrs;
      let e;
      const n = t.col + t.tagName.length + 1;
      for (let s = 0, l = a.length; s < l; s++)
        e = a[s], e.quote === "" && e.value === "" && r.warn(`The attribute [ ${e.name} ] must have a value.`, t.line, n + e.index, this, e.raw);
    });
  }
};
var I = {};
Object.defineProperty(I, "__esModule", { value: !0 });
I.default = {
  id: "attr-value-single-quotes",
  description: "Attribute values must be in single quotes.",
  init(i, r) {
    i.addListener("tagstart", (t) => {
      const a = t.attrs;
      let e;
      const n = t.col + t.tagName.length + 1;
      for (let s = 0, l = a.length; s < l; s++)
        e = a[s], (e.value !== "" && e.quote !== "'" || e.value === "" && e.quote === '"') && r.error(`The value of attribute [ ${e.name} ] must be in single quotes.`, t.line, n + e.index, this, e.raw);
    });
  }
};
var U = {};
Object.defineProperty(U, "__esModule", { value: !0 });
U.default = {
  id: "attr-whitespace",
  description: "All attributes should be separated by only one space and not have leading/trailing whitespace.",
  init(i, r, t) {
    const a = Array.isArray(t) ? t : [];
    i.addListener("tagstart", (e) => {
      const n = e.attrs;
      let s;
      const l = e.col + e.tagName.length + 1;
      n.forEach((o) => {
        s = o;
        const d = o.name;
        a.indexOf(d) === -1 && (o.value.trim() !== o.value && r.error(`The attributes of [ ${d} ] must not have leading or trailing whitespace.`, e.line, l + s.index, this, s.raw), o.value.replace(/ +(?= )/g, "") !== o.value && r.error(`The attributes of [ ${d} ] must be separated by only one space.`, e.line, l + s.index, this, s.raw));
      });
    });
  }
};
var H = {};
Object.defineProperty(H, "__esModule", { value: !0 });
H.default = {
  id: "doctype-first",
  description: "Doctype must be declared first.",
  init(i, r) {
    const t = (a) => {
      a.type === "start" || a.type === "text" && /^\s*$/.test(a.raw) || ((a.type !== "comment" && a.long === !1 || /^DOCTYPE\s+/i.test(a.content) === !1) && r.error("Doctype must be declared first.", a.line, a.col, this, a.raw), i.removeListener("all", t));
    };
    i.addListener("all", t);
  }
};
var F = {};
Object.defineProperty(F, "__esModule", { value: !0 });
F.default = {
  id: "doctype-html5",
  description: 'Invalid doctype. Use: "<!DOCTYPE html>"',
  init(i, r) {
    const t = (e) => {
      e.long === !1 && e.content.toLowerCase() !== "doctype html" && r.warn('Invalid doctype. Use: "<!DOCTYPE html>"', e.line, e.col, this, e.raw);
    }, a = () => {
      i.removeListener("comment", t), i.removeListener("tagstart", a);
    };
    i.addListener("all", t), i.addListener("tagstart", a);
  }
};
var Z = {};
Object.defineProperty(Z, "__esModule", { value: !0 });
Z.default = {
  id: "head-script-disabled",
  description: "The <script> tag cannot be used in a <head> tag.",
  init(i, r) {
    const t = /^(text\/javascript|application\/javascript)$/i;
    let a = !1;
    const e = (s) => {
      const o = i.getMapAttrs(s.attrs).type, d = s.tagName.toLowerCase();
      d === "head" && (a = !0), a === !0 && d === "script" && (!o || t.test(o) === !0) && r.warn("The <script> tag cannot be used in a <head> tag.", s.line, s.col, this, s.raw);
    }, n = (s) => {
      s.tagName.toLowerCase() === "head" && (i.removeListener("tagstart", e), i.removeListener("tagend", n));
    };
    i.addListener("tagstart", e), i.addListener("tagend", n);
  }
};
var V = {};
Object.defineProperty(V, "__esModule", { value: !0 });
V.default = {
  id: "href-abs-or-rel",
  description: "An href attribute must be either absolute or relative.",
  init(i, r, t) {
    const a = t === "abs" ? "absolute" : "relative";
    i.addListener("tagstart", (e) => {
      const n = e.attrs;
      let s;
      const l = e.col + e.tagName.length + 1;
      for (let o = 0, d = n.length; o < d; o++)
        if (s = n[o], s.name === "href") {
          (a === "absolute" && /^\w+?:/.test(s.value) === !1 || a === "relative" && /^https?:\/\//.test(s.value) === !0) && r.warn(`The value of the href attribute [ ${s.value} ] must be ${a}.`, e.line, l + s.index, this, s.raw);
          break;
        }
    });
  }
};
var W = {};
Object.defineProperty(W, "__esModule", { value: !0 });
const Pe = "(art-lojban|cel-gaulish|no-bok|no-nyn|zh-guoyu|zh-hakka|zh-min|zh-min-nan|zh-xiang)", ve = "(en-GB-oed|i-ami|i-bnn|i-default|i-enochian|i-hak|i-klingon|i-lux|i-mingo|i-navajo|i-pwn|i-tao|i-tay|i-tsu|sgn-BE-FR|sgn-BE-NL|sgn-CH-DE)", je = `(?<grandfathered>${ve}|${Pe})`, Me = "(?<privateUse>x(-[A-Za-z0-9]{1,8})+)", Ee = "(?<privateUse2>x(-[A-Za-z0-9]{1,8})+)", xe = "[0-9A-WY-Za-wy-z]", ke = `(?<extension>${xe}(-[A-Za-z0-9]{2,8})+)`, qe = "(?<variant>[A-Za-z0-9]{5,8}|[0-9][A-Za-z0-9]{3})", Re = "(?<region>[A-Za-z]{2}|[0-9]{3})", Se = "(?<script>[A-Za-z]{4})", De = "(?<extlang>[A-Za-z]{3}(-[A-Za-z]{3}){0,2})", ze = `(?<language>([A-Za-z]{2,3}(-${De})?)|[A-Za-z]{4}|[A-Za-z]{5,8})`, Ie = `(${ze}(-${Se})?(-${Re})?(-${qe})*(-${ke})*(-${Me})?)`, Ue = `(${je}|${Ie}|${Ee})`;
W.default = {
  id: "html-lang-require",
  description: "The lang attribute of an <html> element must be present and should be valid.",
  init(i, r) {
    i.addListener("tagstart", (t) => {
      const a = t.tagName.toLowerCase(), e = i.getMapAttrs(t.attrs), n = t.col + a.length + 1, s = new RegExp(Ue, "g");
      a === "html" && ("lang" in e ? e.lang ? s.test(e.lang) || r.warn("The lang attribute value of <html> element must be a valid BCP47.", t.line, n, this, t.raw) : r.warn("The lang attribute of <html> element must have a value.", t.line, n, this, t.raw) : r.warn("An lang attribute must be present on <html> elements.", t.line, n, this, t.raw));
    });
  }
};
var B = {};
Object.defineProperty(B, "__esModule", { value: !0 });
B.default = {
  id: "id-class-ad-disabled",
  description: "The id and class attributes cannot use the ad keyword, it will be blocked by adblock software.",
  init(i, r) {
    i.addListener("tagstart", (t) => {
      const a = t.attrs;
      let e, n;
      const s = t.col + t.tagName.length + 1;
      for (let l = 0, o = a.length; l < o; l++)
        e = a[l], n = e.name, /^(id|class)$/i.test(n) && /(^|[-_])ad([-_]|$)/i.test(e.value) && r.warn(`The value of attribute ${n} cannot use the ad keyword.`, t.line, s + e.index, this, e.raw);
    });
  }
};
var Y = {};
Object.defineProperty(Y, "__esModule", { value: !0 });
Y.default = {
  id: "id-class-value",
  description: "The id and class attribute values must meet the specified rules.",
  init(i, r, t) {
    const a = {
      underline: {
        regId: /^[a-z\d]+(_[a-z\d]+)*$/,
        message: "The id and class attribute values must be in lowercase and split by an underscore."
      },
      dash: {
        regId: /^[a-z\d]+(-[a-z\d]+)*$/,
        message: "The id and class attribute values must be in lowercase and split by a dash."
      },
      hump: {
        regId: /^[a-z][a-zA-Z\d]*([A-Z][a-zA-Z\d]*)*$/,
        message: "The id and class attribute values must meet the camelCase style."
      }
    };
    let e;
    if (typeof t == "string" ? e = a[t] : e = t, typeof e == "object" && e.regId) {
      let n = e.regId;
      const s = e.message;
      n instanceof RegExp || (n = new RegExp(n)), i.addListener("tagstart", (l) => {
        const o = l.attrs;
        let d;
        const c = l.col + l.tagName.length + 1;
        for (let u = 0, h = o.length; u < h; u++)
          if (d = o[u], d.name.toLowerCase() === "id" && n.test(d.value) === !1 && r.warn(s, l.line, c + d.index, this, d.raw), d.name.toLowerCase() === "class") {
            const f = d.value.split(/\s+/g);
            let w;
            for (let m = 0, _ = f.length; m < _; m++)
              w = f[m], w && n.test(w) === !1 && r.warn(s, l.line, c + d.index, this, w);
          }
      });
    }
  }
};
var Q = {};
Object.defineProperty(Q, "__esModule", { value: !0 });
Q.default = {
  id: "id-unique",
  description: "The value of id attributes must be unique.",
  init(i, r) {
    const t = {};
    i.addListener("tagstart", (a) => {
      const e = a.attrs;
      let n, s;
      const l = a.col + a.tagName.length + 1;
      for (let o = 0, d = e.length; o < d; o++)
        if (n = e[o], n.name.toLowerCase() === "id") {
          s = n.value, s && (t[s] === void 0 ? t[s] = 1 : t[s]++, t[s] > 1 && r.error(`The id value [ ${s} ] must be unique.`, a.line, l + n.index, this, n.raw));
          break;
        }
    });
  }
};
var G = {};
Object.defineProperty(G, "__esModule", { value: !0 });
G.default = {
  id: "inline-script-disabled",
  description: "Inline script cannot be used.",
  init(i, r) {
    i.addListener("tagstart", (t) => {
      const a = t.attrs;
      let e;
      const n = t.col + t.tagName.length + 1;
      let s;
      const l = /^on(unload|message|submit|select|scroll|resize|mouseover|mouseout|mousemove|mouseleave|mouseenter|mousedown|load|keyup|keypress|keydown|focus|dblclick|click|change|blur|error)$/i;
      for (let o = 0, d = a.length; o < d; o++)
        e = a[o], s = e.name.toLowerCase(), l.test(s) === !0 ? r.warn(`Inline script [ ${e.raw} ] cannot be used.`, t.line, n + e.index, this, e.raw) : (s === "src" || s === "href") && /^\s*javascript:/i.test(e.value) && r.warn(`Inline script [ ${e.raw} ] cannot be used.`, t.line, n + e.index, this, e.raw);
    });
  }
};
var J = {};
Object.defineProperty(J, "__esModule", { value: !0 });
J.default = {
  id: "inline-style-disabled",
  description: "Inline style cannot be used.",
  init(i, r) {
    i.addListener("tagstart", (t) => {
      const a = t.attrs;
      let e;
      const n = t.col + t.tagName.length + 1;
      for (let s = 0, l = a.length; s < l; s++)
        e = a[s], e.name.toLowerCase() === "style" && r.warn(`Inline style [ ${e.raw} ] cannot be used.`, t.line, n + e.index, this, e.raw);
    });
  }
};
var X = {};
Object.defineProperty(X, "__esModule", { value: !0 });
X.default = {
  id: "input-requires-label",
  description: "All [ input ] tags must have a corresponding [ label ] tag. ",
  init(i, r) {
    const t = [], a = [];
    i.addListener("tagstart", (n) => {
      const s = n.tagName.toLowerCase(), l = i.getMapAttrs(n.attrs), o = n.col + s.length + 1;
      s === "input" && l.type !== "hidden" && a.push({ event: n, col: o, id: l.id }), s === "label" && "for" in l && l.for !== "" && t.push({ event: n, col: o, forValue: l.for });
    }), i.addListener("end", () => {
      a.forEach((n) => {
        e(n) || r.warn("No matching [ label ] tag found.", n.event.line, n.col, this, n.event.raw);
      });
    });
    function e(n) {
      let s = !1;
      return t.forEach((l) => {
        n.id && n.id === l.forValue && (s = !0);
      }), s;
    }
  }
};
var K = {};
Object.defineProperty(K, "__esModule", { value: !0 });
K.default = {
  id: "script-disabled",
  description: "The <script> tag cannot be used.",
  init(i, r) {
    i.addListener("tagstart", (t) => {
      t.tagName.toLowerCase() === "script" && r.error("The <script> tag cannot be used.", t.line, t.col, this, t.raw);
    });
  }
};
var ee = {};
Object.defineProperty(ee, "__esModule", { value: !0 });
ee.default = {
  id: "space-tab-mixed-disabled",
  description: "Do not mix tabs and spaces for indentation.",
  init(i, r, t) {
    let a = "nomix", e = null;
    if (typeof t == "string") {
      const n = /^([a-z]+)(\d+)?/.exec(t);
      n && (a = n[1], e = n[2] && parseInt(n[2], 10));
    }
    i.addListener("text", (n) => {
      const s = n.raw, l = /(^|\r?\n)([ \t]+)/g;
      let o;
      for (; o = l.exec(s); ) {
        const d = i.fixPos(n, o.index + o[1].length);
        if (d.col !== 1)
          continue;
        const c = o[2];
        a === "space" ? e ? (/^ +$/.test(c) === !1 || c.length % e !== 0) && r.warn(`Please use space for indentation and keep ${e} length.`, d.line, 1, this, n.raw) : /^ +$/.test(c) === !1 && r.warn("Please use space for indentation.", d.line, 1, this, n.raw) : a === "tab" && /^\t+$/.test(c) === !1 ? r.warn("Please use tab for indentation.", d.line, 1, this, n.raw) : / +\t|\t+ /.test(c) === !0 && r.warn("Do not mix tabs and spaces for indentation.", d.line, 1, this, n.raw);
      }
    });
  }
};
var te = {};
Object.defineProperty(te, "__esModule", { value: !0 });
te.default = {
  id: "spec-char-escape",
  description: "Special characters must be escaped.",
  init(i, r) {
    i.addListener("text", (t) => {
      const a = t.raw, e = /([<>])|( \& )/g;
      let n;
      for (; n = e.exec(a); ) {
        const s = i.fixPos(t, n.index);
        r.error(`Special characters must be escaped : [ ${n[0]} ].`, s.line, s.col, this, t.raw);
      }
    });
  }
};
var ae = {};
Object.defineProperty(ae, "__esModule", { value: !0 });
ae.default = {
  id: "src-not-empty",
  description: "The src attribute of an img(script,link) must have a value.",
  init(i, r) {
    i.addListener("tagstart", (t) => {
      const a = t.tagName, e = t.attrs;
      let n;
      const s = t.col + a.length + 1;
      for (let l = 0, o = e.length; l < o; l++)
        n = e[l], (/^(img|script|embed|bgsound|iframe)$/.test(a) === !0 && n.name === "src" || a === "link" && n.name === "href" || a === "object" && n.name === "data") && n.value === "" && r.error(`The attribute [ ${n.name} ] of the tag [ ${a} ] must have a value.`, t.line, s + n.index, this, n.raw);
    });
  }
};
var re = {};
Object.defineProperty(re, "__esModule", { value: !0 });
re.default = {
  id: "style-disabled",
  description: "<style> tags cannot be used.",
  init(i, r) {
    i.addListener("tagstart", (t) => {
      t.tagName.toLowerCase() === "style" && r.warn("The <style> tag cannot be used.", t.line, t.col, this, t.raw);
    });
  }
};
var ie = {};
Object.defineProperty(ie, "__esModule", { value: !0 });
ie.default = {
  id: "tag-pair",
  description: "Tag must be paired.",
  init(i, r) {
    const t = [], a = i.makeMap("area,base,basefont,br,col,frame,hr,img,input,isindex,link,meta,param,embed,track,command,source,keygen,wbr");
    i.addListener("tagstart", (e) => {
      const n = e.tagName.toLowerCase();
      a[n] === void 0 && !e.close && t.push({
        tagName: n,
        line: e.line,
        raw: e.raw
      });
    }), i.addListener("tagend", (e) => {
      const n = e.tagName.toLowerCase();
      let s;
      for (s = t.length - 1; s >= 0 && t[s].tagName !== n; s--)
        ;
      if (s >= 0) {
        const l = [];
        for (let o = t.length - 1; o > s; o--)
          l.push(`</${t[o].tagName}>`);
        if (l.length > 0) {
          const o = t[t.length - 1];
          r.error(`Tag must be paired, missing: [ ${l.join("")} ], start tag match failed [ ${o.raw} ] on line ${o.line}.`, e.line, e.col, this, e.raw);
        }
        t.length = s;
      } else
        r.error(`Tag must be paired, no start tag: [ ${e.raw} ]`, e.line, e.col, this, e.raw);
    }), i.addListener("end", (e) => {
      const n = [];
      for (let s = t.length - 1; s >= 0; s--)
        n.push(`</${t[s].tagName}>`);
      if (n.length > 0) {
        const s = t[t.length - 1];
        r.error(`Tag must be paired, missing: [ ${n.join("")} ], open tag match failed [ ${s.raw} ] on line ${s.line}.`, e.line, e.col, this, "");
      }
    });
  }
};
var se = {};
Object.defineProperty(se, "__esModule", { value: !0 });
se.default = {
  id: "tag-self-close",
  description: "Empty tags must be self closed.",
  init(i, r) {
    const t = i.makeMap("area,base,basefont,bgsound,br,col,frame,hr,img,input,isindex,link,meta,param,embed,track,command,source,keygen,wbr");
    i.addListener("tagstart", (a) => {
      const e = a.tagName.toLowerCase();
      t[e] !== void 0 && (a.close || r.warn(`The empty tag : [ ${e} ] must be self closed.`, a.line, a.col, this, a.raw));
    });
  }
};
var ne = {};
Object.defineProperty(ne, "__esModule", { value: !0 });
ne.default = {
  id: "empty-tag-not-self-closed",
  description: "Empty tags must not use self closed syntax.",
  init(i, r) {
    const t = i.makeMap("area,base,basefont,bgsound,br,col,frame,hr,img,input,isindex,link,meta,param,embed,track,command,source,keygen,wbr");
    i.addListener("tagstart", (a) => {
      const e = a.tagName.toLowerCase();
      t[e] !== void 0 && a.close && r.error(`The empty tag : [ ${e} ] must not use self closed syntax.`, a.line, a.col, this, a.raw);
    });
  }
};
var le = {};
Object.defineProperty(le, "__esModule", { value: !0 });
le.default = {
  id: "tagname-lowercase",
  description: "All html element names must be in lowercase.",
  init(i, r, t) {
    const a = Array.isArray(t) ? t : [];
    i.addListener("tagstart,tagend", (e) => {
      const n = e.tagName;
      a.indexOf(n) === -1 && n !== n.toLowerCase() && r.error(`The html element name of [ ${n} ] must be in lowercase.`, e.line, e.col, this, e.raw);
    });
  }
};
var oe = {};
Object.defineProperty(oe, "__esModule", { value: !0 });
oe.default = {
  id: "tagname-specialchars",
  description: "All special characters must be escaped.",
  init(i, r) {
    const t = /[^a-zA-Z0-9\-:_]/;
    i.addListener("tagstart,tagend", (a) => {
      const e = a.tagName;
      t.test(e) && r.error(`The html element name of [ ${e} ] contains special character.`, a.line, a.col, this, a.raw);
    });
  }
};
var de = {};
Object.defineProperty(de, "__esModule", { value: !0 });
de.default = {
  id: "title-require",
  description: "<title> must be present in <head> tag.",
  init(i, r) {
    let t = !1, a = !1;
    const e = (s) => {
      const l = s.tagName.toLowerCase();
      l === "head" ? t = !0 : l === "title" && t && (a = !0);
    }, n = (s) => {
      const l = s.tagName.toLowerCase();
      if (a && l === "title") {
        const o = s.lastEvent;
        (o.type !== "text" || o.type === "text" && /^\s*$/.test(o.raw) === !0) && r.error("<title></title> must not be empty.", s.line, s.col, this, s.raw);
      } else
        l === "head" && (a === !1 && r.error("<title> must be present in <head> tag.", s.line, s.col, this, s.raw), i.removeListener("tagstart", e), i.removeListener("tagend", n));
    };
    i.addListener("tagstart", e), i.addListener("tagend", n);
  }
};
var ce = {};
Object.defineProperty(ce, "__esModule", { value: !0 });
let P = {
  a: {
    selfclosing: !1,
    attrsRequired: ["href", "title"],
    redundantAttrs: ["alt"]
  },
  div: {
    selfclosing: !1
  },
  main: {
    selfclosing: !1,
    redundantAttrs: ["role"]
  },
  nav: {
    selfclosing: !1,
    redundantAttrs: ["role"]
  },
  script: {
    attrsOptional: [
      ["async", "async"],
      ["defer", "defer"]
    ]
  },
  img: {
    selfclosing: !0,
    attrsRequired: ["src", "alt", "title"]
  }
};
ce.default = {
  id: "tags-check",
  description: "Checks html tags.",
  init(i, r, t) {
    P = Object.assign(Object.assign({}, P), t), i.addListener("tagstart", (a) => {
      const e = a.attrs, n = a.col + a.tagName.length + 1, s = a.tagName.toLowerCase();
      if (P[s]) {
        const l = P[s];
        l.selfclosing === !0 && !a.close ? r.warn(`The <${s}> tag must be selfclosing.`, a.line, a.col, this, a.raw) : l.selfclosing === !1 && a.close && r.warn(`The <${s}> tag must not be selfclosing.`, a.line, a.col, this, a.raw), Array.isArray(l.attrsRequired) && l.attrsRequired.forEach((d) => {
          if (Array.isArray(d)) {
            const c = d.map((f) => f), u = c.shift(), h = c;
            e.some((f) => f.name === u) ? e.forEach((f) => {
              f.name === u && h.indexOf(f.value) === -1 && r.error(`The <${s}> tag must have attr '${u}' with one value of '${h.join("' or '")}'.`, a.line, n, this, a.raw);
            }) : r.error(`The <${s}> tag must have attr '${u}'.`, a.line, n, this, a.raw);
          } else
            e.some((c) => d.split("|").indexOf(c.name) !== -1) || r.error(`The <${s}> tag must have attr '${d}'.`, a.line, n, this, a.raw);
        }), Array.isArray(l.attrsOptional) && l.attrsOptional.forEach((d) => {
          if (Array.isArray(d)) {
            const c = d.map((f) => f), u = c.shift(), h = c;
            e.some((f) => f.name === u) && e.forEach((f) => {
              f.name === u && h.indexOf(f.value) === -1 && r.error(`The <${s}> tag must have optional attr '${u}' with one value of '${h.join("' or '")}'.`, a.line, n, this, a.raw);
            });
          }
        }), Array.isArray(l.redundantAttrs) && l.redundantAttrs.forEach((d) => {
          e.some((c) => c.name === d) && r.error(`The attr '${d}' is redundant for <${s}> and should be omitted.`, a.line, n, this, a.raw);
        });
      }
    });
  }
};
var ue = {};
Object.defineProperty(ue, "__esModule", { value: !0 });
ue.default = {
  id: "attr-no-unnecessary-whitespace",
  description: "No spaces between attribute names and values.",
  init(i, r, t) {
    const a = Array.isArray(t) ? t : [];
    i.addListener("tagstart", (e) => {
      const n = e.attrs, s = e.col + e.tagName.length + 1;
      for (let l = 0; l < n.length; l++)
        if (a.indexOf(n[l].name) === -1) {
          const o = /(\s*)=(\s*)/.exec(n[l].raw.trim());
          o && (o[1].length !== 0 || o[2].length !== 0) && r.error(`The attribute '${n[l].name}' must not have spaces between the name and value.`, e.line, s + n[l].index, this, n[l].raw);
        }
    });
  }
};
(function(i) {
  Object.defineProperty(i, "__esModule", { value: !0 }), i.attrNoUnnecessaryWhitespace = i.tagsCheck = i.titleRequire = i.tagnameSpecialChars = i.tagnameLowercase = i.emptyTagNotSelfClosed = i.tagSelfClose = i.tagPair = i.styleDisabled = i.srcNotEmpty = i.specCharEscape = i.spaceTabMixedDisabled = i.scriptDisabled = i.inputRequiresLabel = i.inlineStyleDisabled = i.inlineScriptDisabled = i.idUnique = i.idClassValue = i.idClsasAdDisabled = i.htmlLangRequire = i.hrefAbsOrRel = i.headScriptDisabled = i.doctypeHTML5 = i.doctypeFirst = i.attrWhitespace = i.attrValueSingleQuotes = i.attrValueNotEmpty = i.attrValueDoubleQuotes = i.attrUnsafeChars = i.attrNoDuplication = i.attrSort = i.attrLowercase = i.altRequire = void 0;
  var r = x;
  Object.defineProperty(i, "altRequire", { enumerable: !0, get: function() {
    return r.default;
  } });
  var t = k;
  Object.defineProperty(i, "attrLowercase", { enumerable: !0, get: function() {
    return t.default;
  } });
  var a = q;
  Object.defineProperty(i, "attrSort", { enumerable: !0, get: function() {
    return a.default;
  } });
  var e = R;
  Object.defineProperty(i, "attrNoDuplication", { enumerable: !0, get: function() {
    return e.default;
  } });
  var n = S;
  Object.defineProperty(i, "attrUnsafeChars", { enumerable: !0, get: function() {
    return n.default;
  } });
  var s = D;
  Object.defineProperty(i, "attrValueDoubleQuotes", { enumerable: !0, get: function() {
    return s.default;
  } });
  var l = z;
  Object.defineProperty(i, "attrValueNotEmpty", { enumerable: !0, get: function() {
    return l.default;
  } });
  var o = I;
  Object.defineProperty(i, "attrValueSingleQuotes", { enumerable: !0, get: function() {
    return o.default;
  } });
  var d = U;
  Object.defineProperty(i, "attrWhitespace", { enumerable: !0, get: function() {
    return d.default;
  } });
  var c = H;
  Object.defineProperty(i, "doctypeFirst", { enumerable: !0, get: function() {
    return c.default;
  } });
  var u = F;
  Object.defineProperty(i, "doctypeHTML5", { enumerable: !0, get: function() {
    return u.default;
  } });
  var h = Z;
  Object.defineProperty(i, "headScriptDisabled", { enumerable: !0, get: function() {
    return h.default;
  } });
  var f = V;
  Object.defineProperty(i, "hrefAbsOrRel", { enumerable: !0, get: function() {
    return f.default;
  } });
  var w = W;
  Object.defineProperty(i, "htmlLangRequire", { enumerable: !0, get: function() {
    return w.default;
  } });
  var m = B;
  Object.defineProperty(i, "idClsasAdDisabled", { enumerable: !0, get: function() {
    return m.default;
  } });
  var _ = Y;
  Object.defineProperty(i, "idClassValue", { enumerable: !0, get: function() {
    return _.default;
  } });
  var b = Q;
  Object.defineProperty(i, "idUnique", { enumerable: !0, get: function() {
    return b.default;
  } });
  var A = G;
  Object.defineProperty(i, "inlineScriptDisabled", { enumerable: !0, get: function() {
    return A.default;
  } });
  var $ = J;
  Object.defineProperty(i, "inlineStyleDisabled", { enumerable: !0, get: function() {
    return $.default;
  } });
  var y = X;
  Object.defineProperty(i, "inputRequiresLabel", { enumerable: !0, get: function() {
    return y.default;
  } });
  var L = K;
  Object.defineProperty(i, "scriptDisabled", { enumerable: !0, get: function() {
    return L.default;
  } });
  var g = ee;
  Object.defineProperty(i, "spaceTabMixedDisabled", { enumerable: !0, get: function() {
    return g.default;
  } });
  var O = te;
  Object.defineProperty(i, "specCharEscape", { enumerable: !0, get: function() {
    return O.default;
  } });
  var T = ae;
  Object.defineProperty(i, "srcNotEmpty", { enumerable: !0, get: function() {
    return T.default;
  } });
  var C = re;
  Object.defineProperty(i, "styleDisabled", { enumerable: !0, get: function() {
    return C.default;
  } });
  var v = ie;
  Object.defineProperty(i, "tagPair", { enumerable: !0, get: function() {
    return v.default;
  } });
  var me = se;
  Object.defineProperty(i, "tagSelfClose", { enumerable: !0, get: function() {
    return me.default;
  } });
  var pe = ne;
  Object.defineProperty(i, "emptyTagNotSelfClosed", { enumerable: !0, get: function() {
    return pe.default;
  } });
  var be = le;
  Object.defineProperty(i, "tagnameLowercase", { enumerable: !0, get: function() {
    return be.default;
  } });
  var ye = oe;
  Object.defineProperty(i, "tagnameSpecialChars", { enumerable: !0, get: function() {
    return ye.default;
  } });
  var we = de;
  Object.defineProperty(i, "titleRequire", { enumerable: !0, get: function() {
    return we.default;
  } });
  var _e = ce;
  Object.defineProperty(i, "tagsCheck", { enumerable: !0, get: function() {
    return _e.default;
  } });
  var Le = ue;
  Object.defineProperty(i, "attrNoUnnecessaryWhitespace", { enumerable: !0, get: function() {
    return Le.default;
  } });
})(ge);
(function(i) {
  Object.defineProperty(i, "__esModule", { value: !0 }), i.HTMLParser = i.Reporter = i.HTMLRules = i.HTMLHint = void 0;
  const r = M;
  i.HTMLParser = r.default;
  const t = E;
  i.Reporter = t.default;
  const a = ge;
  i.HTMLRules = a;
  class e {
    constructor() {
      this.rules = {}, this.defaultRuleset = {
        "tagname-lowercase": !0,
        "attr-lowercase": !0,
        "attr-value-double-quotes": !0,
        "doctype-first": !0,
        "tag-pair": !0,
        "spec-char-escape": !0,
        "id-unique": !0,
        "src-not-empty": !0,
        "attr-no-duplication": !0,
        "title-require": !0
      };
    }
    addRule(l) {
      this.rules[l.id] = l;
    }
    verify(l, o = this.defaultRuleset) {
      Object.keys(o).length === 0 && (o = this.defaultRuleset), l = l.replace(/^\s*<!--\s*htmlhint\s+([^\r\n]+?)\s*-->/i, (f, w) => (w.replace(/(?:^|,)\s*([^:,]+)\s*(?:\:\s*([^,\s]+))?/g, (m, _, b) => (o[_] = b !== void 0 && b.length > 0 ? JSON.parse(b) : !0, "")), ""));
      const d = new r.default(), c = new t.default(l, o), u = this.rules;
      let h;
      for (const f in o)
        h = u[f], h !== void 0 && o[f] !== !1 && h.init(d, c, o[f]);
      return d.parse(l), c.messages;
    }
    format(l, o = {}) {
      const d = [], c = {
        white: "",
        grey: "",
        red: "",
        reset: ""
      };
      o.colors && (c.white = "\x1B[37m", c.grey = "\x1B[90m", c.red = "\x1B[31m", c.reset = "\x1B[39m");
      const u = o.indent || 0;
      return l.forEach((h) => {
        let m = h.evidence;
        const _ = h.line, b = h.col, A = m.length;
        let $ = b > 40 + 1 ? b - 40 : 1, y = m.length > b + 60 ? b + 60 : A;
        b < 40 + 1 && (y += 40 - b + 1), m = m.replace(/\t/g, " ").substring($ - 1, y), $ > 1 && (m = `...${m}`, $ -= 3), y < A && (m += "..."), d.push(`${c.white + n(u)}L${_} |${c.grey}${m}${c.reset}`);
        let L = b - $;
        const g = m.substring(0, L).match(/[^\u0000-\u00ff]/g);
        g !== null && (L += g.length), d.push(`${c.white + n(u) + n(String(_).length + 3 + L)}^ ${c.red}${h.message} (${h.rule.id})${c.reset}`);
      }), d;
    }
  }
  function n(s, l) {
    return new Array(s + 1).join(l || " ");
  }
  i.HTMLHint = new e(), Object.keys(a).forEach((s) => {
    i.HTMLHint.addRule(a[s]);
  });
})(j);
const He = {
  "attr-no-duplication": !0,
  "body-no-duplicates": !0,
  "head-body-descendents-html": !0,
  "head-no-duplicates": !0,
  "head-valid-children": !0,
  "html-no-duplicates": !0,
  "html-root-node": !0,
  "html-valid-children": !0,
  "html-valid-children-order": !0,
  "img-src-required": !0,
  "invalid-attribute-char": !0,
  "nested-paragraphs": !0,
  "spec-char-escape": !0,
  "src-not-empty": !0,
  "tag-pair": !0,
  "valid-path-format": [{
    attr: "href",
    formats: [
      "absolute",
      {
        pattern: "\\${(\\s+)?Gears\\.unsubscribe\\(\\)(\\s+)?}",
        name: "MessageGears unsubscribe"
      }
    ]
  }, {
    tag: "img",
    attr: "src",
    formats: [
      "absolute"
    ]
  }]
}, Fe = [
  "area",
  "base",
  "basefont",
  "br",
  "col",
  "frame",
  "hr",
  "img",
  "input",
  "isindex",
  "link",
  "meta",
  "param",
  "embed",
  "track",
  "command",
  "source",
  "keygen",
  "wbr"
];
class fe {
  constructor(r, t) {
    p(this, "children");
    p(this, "closed");
    p(this, "root");
    p(this, "tagName");
    p(this, "attrs");
    p(this, "from");
    p(this, "to");
    p(this, "col");
    p(this, "line");
    p(this, "raw");
    this.event = r, this.parent = t;
    const a = (r == null ? void 0 : r.tagName) && r.tagName.toLowerCase();
    this.children = [], t ? (this.closed = !!r.close || Fe.indexOf(a) > -1, this.parent = t, this.tagName = a, this.attrs = r.attrs, this.from = r.pos, this.to = void 0, this.col = r.col, this.line = r.line, this.raw = r.raw) : this.root = this;
  }
  get depth() {
    let r = 0, t = this.parent;
    for (; t.parent; )
      r++, t = t.parent;
    return r;
  }
  close(r, t) {
    this.to = r.pos + r.raw.length, this.raw = t.html.slice(this.from, this.to);
  }
  push(r) {
    return this.children.push(r);
  }
  before(r) {
    return this.children.slice(0, r);
  }
  after(r) {
    return this.children.slice(r + 1);
  }
  find(...r) {
    const t = (a) => a.reduce((e, n) => (n.match(...r) && e.push(n), n.children.length && (e = e.concat(t(n.children))), e), []);
    return t(this.children);
  }
  findFirst(r) {
    return this.find(r)[0];
  }
  index() {
    return this.parent ? this.parent.children.indexOf(this) : 0;
  }
  isChildOf(r) {
    return this.parent === r;
  }
  isBefore(r) {
    return this.index() < r.index();
  }
  isAfter(r) {
    return this.index() > r.index();
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
  match(...r) {
    return r.indexOf(this.tagName && this.tagName.toLowerCase()) > -1;
  }
}
class N {
  constructor(r, t, a) {
    this.parser = r, this.reporter = t;
    const e = [], n = new fe();
    let s = n;
    r.addListener("tagstart", (l) => {
      const o = new fe(l, s);
      s.push(o), o.closed || e.push(s = o);
    }), r.addListener("tagend", (l) => {
      const o = l.tagName.toLowerCase();
      let d;
      for (d = e.length - 1; d >= 0 && e[d].tagName !== o; d--)
        ;
      e[d] && (e[d].close(l, this.reporter), s = e[d].parent, e.splice(d, 1));
    }), r.addListener("end", () => {
      n.closed = !0, a && a(n);
    });
  }
}
const Ze = {
  id: "body-no-duplicates",
  description: "The body tag must not be a duplicate.",
  init(i, r) {
    new N(i, r, (t) => {
      let a;
      for (let e of t.find("body")) {
        if (!a) {
          a = e;
          continue;
        }
        r.error(
          `The [ body ] tag already exists on line ${a.line}.`,
          e.line,
          e.col,
          this,
          e.raw
        );
      }
    });
  }
}, Ve = {
  id: "head-body-descendents-html",
  description: "The head and body tags must be a direct child descendents of the html tag.",
  init(i, r) {
    new N(i, r, (t) => {
      const a = t.findFirst("html");
      t.find("head", "body").filter((e) => !a || !e.isChildOf(a)).forEach((e) => {
        const { line: n, col: s, raw: l } = e, o = a ? `The [ ${e.tagName} ] tag must be a direct child descendent of the [ html ] tag on line ${a.line}.` : `The [ ${e.tagName} ] tag must be a direct child descendent of an [ html ] tag.`;
        r.error(o, n, s, this, l);
      });
    });
  }
}, We = {
  id: "head-no-duplicates",
  description: "The head tag must not be a duplicate.",
  init(i, r) {
    new N(i, r, (t) => {
      let a;
      for (let e of t.find("head")) {
        if (!a) {
          a = e;
          continue;
        }
        r.error(
          `The [ head ] tag is a duplicate of the tag on line ${a.line}.`,
          e.line,
          e.col,
          this,
          e.raw
        );
      }
    });
  }
}, Be = {
  id: "head-valid-children",
  description: "The head tag must only contain valid elements.",
  init(i, r, t) {
    const a = Array.isArray(t) ? t : [
      "base",
      "link",
      "meta",
      "noscript",
      "script",
      "style",
      "template",
      "title"
    ];
    new N(i, r, (e) => {
      for (let n of e.find("head"))
        for (let s of n.children) {
          if (a.indexOf(s.tagName.toLowerCase()) > -1)
            return;
          r.error(
            `The [ ${s.tagName} ] tag is not allowed inside the [ head ] tag on line ${n.line}.`,
            s.line,
            s.col,
            this,
            s.raw
          );
        }
    });
  }
}, Ye = {
  id: "html-no-duplicates",
  description: "The html tag must be a unique root element.",
  init(i, r) {
    new N(i, r, (t) => {
      const a = t.find("html");
      a.filter((e) => e !== a[0]).forEach((e) => {
        const { line: n, col: s, raw: l } = e, o = `The [ ${e.tagName} ] tag already exists on line ${a[0].line}.`;
        r.error(o, n, s, this, l);
      });
    });
  }
}, Qe = {
  id: "html-root-node",
  description: "The html tag must be the only root node in the document.",
  init(i, r) {
    new N(i, r, (t) => {
      const a = t.findFirst("html");
      a && t.children.filter((e) => e.tagName !== "html").forEach((e) => {
        const { line: n, col: s, raw: l } = e, o = `The [ ${e.tagName} ] cannot come ${e.isBefore(a) ? "before" : "after"} the [ html ] tag on line ${a.line}.`;
        r.error(o, n, s, this, l);
      });
    });
  }
}, Ge = {
  id: "html-valid-children",
  description: "The html tag must only contain a head and body tag.",
  init(i, r) {
    new N(i, r, (t) => {
      const a = t.findFirst("html");
      a && a.children.forEach((e) => {
        if (!e.match("head", "body")) {
          const { line: n, col: s, raw: l } = e, o = `The [ ${e.tagName} ] tag cannot be a direct descendent of the [ html ] tag on line ${a.line}.`;
          r.error(o, n, s, this, l);
        }
      });
    });
  }
}, Je = {
  id: "html-valid-children-order",
  description: "The head and body tags must be in the correct order.",
  init(i, r) {
    new N(i, r, (t) => {
      const a = t.findFirst("html"), e = t.find("head", "body").filter((l) => !a || l.isChildOf(a)), n = e.filter((l) => l.tagName === "body"), s = e.filter((l) => l.tagName === "head");
      if (n[0] && s[0] && n[0].isBefore(s[0])) {
        const { line: l, col: o, raw: d } = n[0], c = `The [ ${n[0].tagName} ] tag must come after the [ head ] tag on line ${s[0].line}.`;
        r.error(c, l, o, this, d);
      }
      if (n[0] && s[0] && s[0].isAfter(n[0])) {
        const { line: l, col: o, raw: d } = s[0], c = `The [ ${s[0].tagName} ] tag must come before the [ body ] tag on line ${n[0].line}.`;
        r.error(c, l, o, this, d);
      }
    });
  }
}, Xe = {
  id: "img-src-required",
  description: "The img tag must have a src attribute.",
  init(i, r) {
    i.addListener("tagstart", (t) => {
      if (t.tagName.toLowerCase() === "img") {
        for (let l of t.attrs)
          if (l.name.toLowerCase() === "src")
            return;
        const { line: a, col: e, raw: n } = t, s = `The [ ${t.tagName} ] tag must have a [ src ] attribute`;
        r.error(s, a, e, this, n);
      }
    });
  }
}, Ke = {
  id: "invalid-attribute-char",
  description: "Attribute must contain valid characters.",
  init(i, r) {
    i.addListener("tagstart", (t) => {
      let a = 1;
      t.attrs.forEach(({ name: e, index: n }) => {
        a += t.raw.slice(a).indexOf(e);
        let s = 0;
        const l = e.match(/[^a-zA-Z:\-1-9]/g);
        if (l)
          for (; l.length; ) {
            const o = e.slice(s), d = l.shift(), c = o.indexOf(d);
            r.error(
              `[ ${d} ] character cannot be used for attribute names.`,
              t.line,
              t.col + a + s + c,
              this,
              d
            ), s += c + 1;
          }
      });
    });
  }
}, et = {
  id: "nested-paragraphs",
  description: "Nested paragraphs are prohibited.",
  init(i, r) {
    let t;
    const a = [];
    i.addListener("tagstart", (e) => {
      e.tagName.toLowerCase() === "p" && (t ? a.push(e) : t = e);
    }), i.addListener("tagend", (e) => {
      const n = e.tagName.toLowerCase() === "p";
      if (t && n) {
        const [s] = a.splice(a.length - 1);
        if (!s) {
          t = void 0;
          return;
        }
        r.error(
          `[ p ] tags cannot be nested inside the [ p ] tag on line ${t.line}.`,
          s.line,
          s.col,
          this,
          r.html.slice(s.pos, e.pos + e.raw.length)
        );
      } else
        n || (t = void 0);
    }), i.addListener("end", (e) => {
      t && a.length && a.forEach((n) => {
        r.error(
          `[ p ] tags cannot be nested inside the [ p ] tag on line ${t.line}.`,
          n.line,
          n.col,
          this,
          r.html.slice(n.pos, e.lastEvent.pos + e.lastEvent.raw.length)
        );
      });
    });
  }
}, tt = {
  absolute: /^https?:\/\//,
  relative: /^\w+?:/
};
class at {
  constructor(r) {
    p(this, "name");
    p(this, "pattern");
    p(this, "regex");
    const { name: t, pattern: a } = Object.assign({
      pattern: null,
      name: null
    }, typeof r == "object" ? r : {
      pattern: r
    });
    this.name = t || a, this.pattern = a, this.regex = tt[a] || new RegExp(a);
  }
  test(r) {
    return this.regex.test(r);
  }
  error(r, t) {
    return new rt(this, r, t);
  }
}
class rt extends Error {
  constructor(t, a, e) {
    super();
    p(this, "line");
    p(this, "col");
    this.message = `The [ ${e.name} ] attribute "${e.value}" must follow the ${t.name} format.`, this.name = t.name, this.line = a.line, this.col = a.col + a.tagName.length + 1 + e.index;
  }
}
class it extends Error {
  constructor(t, a, e) {
    super(a.length === 1 ? a[0].message : `The [ ${e.name} ] attribute "${e.value}" must one of the following formats: ${a.map((n) => `"${n.name}"`).join(", ")}.`);
    p(this, "line");
    p(this, "col");
    this.line = t.line, this.col = t.col + t.tagName.length + 1 + e.index;
  }
}
function st(i, r, t) {
  const a = [];
  for (const [e, n] of Object.entries(i)) {
    if (n.test(t.value))
      return !0;
    a.push(n.error(r, t));
  }
  throw new it(r, a, t);
}
const nt = {
  id: "valid-path-format",
  description: "Paths must be a valid format.",
  init(i, r, t) {
    i.addListener("tagstart", (a) => {
      t.forEach((e) => {
        const n = e.formats.map((l) => new at(l));
        let s = Array.isArray(e.tag) ? e.tag : e.tag ? [e.tag] : [];
        (!s.length || s.indexOf(a.tagName) > -1) && a.attrs.forEach((l) => {
          if (!e.attr || e.attr === l.name)
            try {
              st(n, a, l);
            } catch (o) {
              r.error(
                o.message,
                o.line,
                o.col,
                this,
                l.raw
              );
            }
        });
      });
    });
  }
}, he = {
  "body-no-duplicates": Ze,
  "head-body-descendents-html": Ve,
  "head-no-duplicates": We,
  "head-valid-children": Be,
  "html-valid-children-order": Je,
  "html-no-duplicates": Ye,
  "html-root-node": Qe,
  "html-valid-children": Ge,
  "img-src-required": Xe,
  "invalid-attribute-char": Ke,
  "nested-paragraphs": et,
  "valid-path-format": nt
};
Object.keys(he).forEach((i) => {
  j.HTMLHint.addRule(he[i]);
});
function ot(i, r) {
  return j.HTMLHint.verify(i, r || He).map((t) => (t.rule.link = t.rule.link.replace(
    "https://htmlhint.com/docs/user-guide/rules/",
    "https://thecapsule.email/docs/codes/"
  ), t));
}
export {
  ot as lint
};
//# sourceMappingURL=capsule-lint.js.map
