var Le = Object.defineProperty;
var Oe = (s, r, n) => r in s ? Le(s, r, { enumerable: !0, configurable: !0, writable: !0, value: n }) : s[r] = n;
var v = (s, r, n) => (Oe(s, typeof r != "symbol" ? r + "" : r, n), n);
var be = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, z = {}, H = {};
Object.defineProperty(H, "__esModule", { value: !0 });
var Ne = function() {
  function s() {
    this._listeners = {}, this._mapCdataTags = this.makeMap("script,style"), this._arrBlocks = [], this.lastEvent = null;
  }
  return s.prototype.makeMap = function(r) {
    for (var n = {}, e = r.split(","), t = 0; t < e.length; t++)
      n[e[t]] = !0;
    return n;
  }, s.prototype.parse = function(r) {
    var n = this, e = this._mapCdataTags, t = /<(?:\/([^\s>]+)\s*|!--([\s\S]*?)--|!([^>]*?)|([\w\-:]+)((?:\s+[^\s"'>\/=\x00-\x0F\x7F\x80-\x9F]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'>]*))?)*?)\s*(\/?))>/g, a = /\s*([^\s"'>\/=\x00-\x0F\x7F\x80-\x9F]+)(?:\s*=\s*(?:(")([^"]*)"|(')([^']*)'|([^\s"'>]*)))?/g, l = /\r?\n/g, i, o, u = 0, d, f, c = null, p, m = [], g = 0, h, b = 0, _ = 1, O = this._arrBlocks;
    this.fire("start", {
      pos: 0,
      line: 1,
      col: 1
    });
    for (var T = function() {
      var x = f.find(function(j) {
        return j.name === "type";
      }) || {
        value: ""
      };
      return e[d] && x.value.indexOf("text/ng-template") === -1;
    }, w = function(x, j, P, L) {
      var R = P - b + 1;
      for (L === void 0 && (L = {}), L.raw = j, L.pos = P, L.line = _, L.col = R, O.push(L), n.fire(x, L); l.exec(j); )
        _++, b = P + l.lastIndex;
    }; i = t.exec(r); ) {
      if (o = i.index, o > u && (h = r.substring(u, o), c ? m.push(h) : w("text", h, u)), u = t.lastIndex, (d = i[1]) && (c && d === c && (h = m.join(""), w("cdata", h, g, {
        tagName: c,
        attrs: p
      }), c = null, p = void 0, m = []), !c)) {
        w("tagend", i[0], o, {
          tagName: d
        });
        continue;
      }
      if (c)
        m.push(i[0]);
      else if (d = i[4]) {
        f = [];
        for (var A = i[5], y = void 0, C = 0; y = a.exec(A); ) {
          var k = y[1], $ = y[2] ? y[2] : y[4] ? y[4] : "", q = y[3] ? y[3] : y[5] ? y[5] : y[6] ? y[6] : "";
          f.push({
            name: k,
            value: q,
            quote: $,
            index: y.index,
            raw: y[0]
          }), C += y[0].length;
        }
        C === A.length ? (w("tagstart", i[0], o, {
          tagName: d,
          attrs: f,
          close: i[6]
        }), T() && (c = d, p = f.concat(), m = [], g = u)) : w("text", i[0], o);
      } else
        (i[2] || i[3]) && w("comment", i[0], o, {
          content: i[2] || i[3],
          long: !!i[2]
        });
    }
    r.length > u && (h = r.substring(u, r.length), w("text", h, u)), this.fire("end", {
      pos: u,
      line: _,
      col: r.length - b + 1
    });
  }, s.prototype.addListener = function(r, n) {
    for (var e = this._listeners, t = r.split(/[,\s]/), a, l = 0, i = t.length; l < i; l++)
      a = t[l], e[a] === void 0 && (e[a] = []), e[a].push(n);
  }, s.prototype.fire = function(r, n) {
    n === void 0 && (n = {}), n.type = r;
    var e = [], t = this._listeners[r], a = this._listeners.all;
    t !== void 0 && (e = e.concat(t)), a !== void 0 && (e = e.concat(a));
    var l = this.lastEvent;
    l !== null && (delete l.lastEvent, n.lastEvent = l), this.lastEvent = n;
    for (var i = 0, o = e.length; i < o; i++)
      e[i].call(this, n);
  }, s.prototype.removeListener = function(r, n) {
    var e = this._listeners[r];
    if (e !== void 0) {
      for (var t = 0, a = e.length; t < a; t++)
        if (e[t] === n) {
          e.splice(t, 1);
          break;
        }
    }
  }, s.prototype.fixPos = function(r, n) {
    var e = r.raw.substr(0, n), t = e.split(/\r?\n/), a = t.length - 1, l = r.line, i;
    return a > 0 ? (l += a, i = t[a].length + 1) : i = r.col + n, {
      line: l,
      col: i
    };
  }, s.prototype.getMapAttrs = function(r) {
    for (var n = {}, e, t = 0, a = r.length; t < a; t++)
      e = r[t], n[e.name] = e.value;
    return n;
  }, s;
}();
H.default = Ne;
var D = {};
Object.defineProperty(D, "__esModule", { value: !0 });
var Te = function() {
  function s(r, n) {
    this.html = r, this.lines = r.split(/\r?\n/);
    var e = /\r?\n/.exec(r);
    this.brLen = e !== null ? e[0].length : 0, this.ruleset = n, this.messages = [];
  }
  return s.prototype.info = function(r, n, e, t, a) {
    this.report("info", r, n, e, t, a);
  }, s.prototype.warn = function(r, n, e, t, a) {
    this.report("warning", r, n, e, t, a);
  }, s.prototype.error = function(r, n, e, t, a) {
    this.report("error", r, n, e, t, a);
  }, s.prototype.report = function(r, n, e, t, a, l) {
    for (var i = this.lines, o = this.brLen, u = "", d = 0, f = e - 1, c = i.length; f < c && (u = i[f], d = u.length, t > d && e < c); f++)
      e++, t -= d, t !== 1 && (t -= o);
    this.messages.push({
      type: r,
      message: n,
      raw: l,
      evidence: u,
      line: e,
      col: t,
      rule: {
        id: a.id,
        description: a.description,
        link: "https://github.com/thedaviddias/HTMLHint/wiki/" + a.id
      }
    });
  }, s;
}();
D.default = Te;
var _e = {}, S = {};
Object.defineProperty(S, "__esModule", { value: !0 });
S.default = {
  id: "alt-require",
  description: "The alt attribute of an <img> element must be present and alt attribute of area[href] and input[type=image] must have a value.",
  init: function(s, r) {
    var n = this;
    s.addListener("tagstart", function(e) {
      var t = e.tagName.toLowerCase(), a = s.getMapAttrs(e.attrs), l = e.col + t.length + 1, i;
      t === "img" && !("alt" in a) ? r.warn("An alt attribute must be present on <img> elements.", e.line, l, n, e.raw) : (t === "area" && "href" in a || t === "input" && a.type === "image") && (!("alt" in a) || a.alt === "") && (i = t === "area" ? "area[href]" : "input[type=image]", r.warn("The alt attribute of " + i + " must have a value.", e.line, l, n, e.raw));
    });
  }
};
var Z = {};
Object.defineProperty(Z, "__esModule", { value: !0 });
function Ae(s, r) {
  if (r instanceof RegExp)
    return r.test(s) ? { match: s, pattern: r } : !1;
  var n = r[0], e = r[r.length - 1], t = r[r.length - 2], a = n === "/" && (e === "/" || t === "/" && e === "i"), l = a && e === "i";
  if (a) {
    var i = l ? new RegExp(r.slice(1, -2), "i").test(s) : new RegExp(r.slice(1, -1)).test(s);
    return i;
  }
  return s === r;
}
Z.default = {
  id: "attr-lowercase",
  description: "All attribute names must be in lowercase.",
  init: function(s, r, n) {
    var e = this, t = Array.isArray(n) ? n : [];
    s.addListener("tagstart", function(a) {
      for (var l = a.attrs, i, o = a.col + a.tagName.length + 1, u = function(c, p) {
        i = l[c];
        var m = i.name;
        !t.find(function(g) {
          return Ae(m, g);
        }) && m !== m.toLowerCase() && r.error("The attribute name of [ " + m + " ] must be in lowercase.", a.line, o + i.index, e, i.raw);
      }, d = 0, f = l.length; d < f; d++)
        u(d);
    });
  }
};
var F = {};
Object.defineProperty(F, "__esModule", { value: !0 });
F.default = {
  id: "attr-sorted",
  description: "Attribute tags must be in proper order.",
  init: function(s, r) {
    for (var n = this, e = {}, t = [
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
    ], a = 0; a < t.length; a++)
      e[t[a]] = a;
    s.addListener("tagstart", function(l) {
      for (var i = l.attrs, o = [], u = 0; u < i.length; u++)
        o.push(i[u].name);
      var d = JSON.stringify(o);
      o.sort(function(f, c) {
        return e[f] == null && e[c] == null ? 0 : e[f] == null ? 1 : e[c] == null ? -1 : e[f] - e[c] || f.localeCompare(c);
      }), d !== JSON.stringify(o) && r.error("Inaccurate order " + d + " should be in hierarchy " + JSON.stringify(o) + " ", l.line, l.col, n, l.raw);
    });
  }
};
var I = {};
Object.defineProperty(I, "__esModule", { value: !0 });
I.default = {
  id: "attr-no-duplication",
  description: "Elements cannot have duplicate attributes.",
  init: function(s, r) {
    var n = this;
    s.addListener("tagstart", function(e) {
      for (var t = e.attrs, a, l, i = e.col + e.tagName.length + 1, o = {}, u = 0, d = t.length; u < d; u++)
        a = t[u], l = a.name, o[l] === !0 && r.error("Duplicate of attribute name [ " + a.name + " ] was found.", e.line, i + a.index, n, a.raw), o[l] = !0;
    });
  }
};
var U = {};
Object.defineProperty(U, "__esModule", { value: !0 });
U.default = {
  id: "attr-unsafe-chars",
  description: "Attribute values cannot contain unsafe chars.",
  init: function(s, r) {
    var n = this;
    s.addListener("tagstart", function(e) {
      for (var t = e.attrs, a, l = e.col + e.tagName.length + 1, i = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/, o, u = 0, d = t.length; u < d; u++)
        if (a = t[u], o = i.exec(a.value), o !== null) {
          var f = escape(o[0]).replace(/%u/, "\\u").replace(/%/, "\\x");
          r.warn("The value of attribute [ " + a.name + " ] cannot contain an unsafe char [ " + f + " ].", e.line, l + a.index, n, a.raw);
        }
    });
  }
};
var B = {};
Object.defineProperty(B, "__esModule", { value: !0 });
B.default = {
  id: "attr-value-double-quotes",
  description: "Attribute values must be in double quotes.",
  init: function(s, r) {
    var n = this;
    s.addListener("tagstart", function(e) {
      for (var t = e.attrs, a, l = e.col + e.tagName.length + 1, i = 0, o = t.length; i < o; i++)
        a = t[i], (a.value !== "" && a.quote !== '"' || a.value === "" && a.quote === "'") && r.error("The value of attribute [ " + a.name + " ] must be in double quotes.", e.line, l + a.index, n, a.raw);
    });
  }
};
var V = {};
Object.defineProperty(V, "__esModule", { value: !0 });
V.default = {
  id: "attr-value-not-empty",
  description: "All attributes must have values.",
  init: function(s, r) {
    var n = this;
    s.addListener("tagstart", function(e) {
      for (var t = e.attrs, a, l = e.col + e.tagName.length + 1, i = 0, o = t.length; i < o; i++)
        a = t[i], a.quote === "" && a.value === "" && r.warn("The attribute [ " + a.name + " ] must have a value.", e.line, l + a.index, n, a.raw);
    });
  }
};
var W = {};
Object.defineProperty(W, "__esModule", { value: !0 });
W.default = {
  id: "attr-value-single-quotes",
  description: "Attribute values must be in single quotes.",
  init: function(s, r) {
    var n = this;
    s.addListener("tagstart", function(e) {
      for (var t = e.attrs, a, l = e.col + e.tagName.length + 1, i = 0, o = t.length; i < o; i++)
        a = t[i], (a.value !== "" && a.quote !== "'" || a.value === "" && a.quote === '"') && r.error("The value of attribute [ " + a.name + " ] must be in single quotes.", e.line, l + a.index, n, a.raw);
    });
  }
};
var G = {};
Object.defineProperty(G, "__esModule", { value: !0 });
G.default = {
  id: "attr-whitespace",
  description: "All attributes should be separated by only one space and not have leading/trailing whitespace.",
  init: function(s, r, n) {
    var e = this, t = Array.isArray(n) ? n : [];
    s.addListener("tagstart", function(a) {
      var l = a.attrs, i, o = a.col + a.tagName.length + 1;
      l.forEach(function(u) {
        i = u;
        var d = u.name;
        t.indexOf(d) === -1 && (u.value.trim() !== u.value && r.error("The attributes of [ " + d + " ] must not have trailing whitespace.", a.line, o + i.index, e, i.raw), u.value.replace(/ +(?= )/g, "") !== u.value && r.error("The attributes of [ " + d + " ] must be separated by only one space.", a.line, o + i.index, e, i.raw));
      });
    });
  }
};
var Y = {};
Object.defineProperty(Y, "__esModule", { value: !0 });
Y.default = {
  id: "doctype-first",
  description: "Doctype must be declared first.",
  init: function(s, r) {
    var n = this, e = function(t) {
      t.type === "start" || t.type === "text" && /^\s*$/.test(t.raw) || ((t.type !== "comment" && t.long === !1 || /^DOCTYPE\s+/i.test(t.content) === !1) && r.error("Doctype must be declared first.", t.line, t.col, n, t.raw), s.removeListener("all", e));
    };
    s.addListener("all", e);
  }
};
var J = {};
Object.defineProperty(J, "__esModule", { value: !0 });
J.default = {
  id: "doctype-html5",
  description: 'Invalid doctype. Use: "<!DOCTYPE html>"',
  init: function(s, r) {
    var n = this, e = function(a) {
      a.long === !1 && a.content.toLowerCase() !== "doctype html" && r.warn('Invalid doctype. Use: "<!DOCTYPE html>"', a.line, a.col, n, a.raw);
    }, t = function() {
      s.removeListener("comment", e), s.removeListener("tagstart", t);
    };
    s.addListener("all", e), s.addListener("tagstart", t);
  }
};
var Q = {};
Object.defineProperty(Q, "__esModule", { value: !0 });
Q.default = {
  id: "head-script-disabled",
  description: "The <script> tag cannot be used in a <head> tag.",
  init: function(s, r) {
    var n = this, e = /^(text\/javascript|application\/javascript)$/i, t = !1, a = function(i) {
      var o = s.getMapAttrs(i.attrs), u = o.type, d = i.tagName.toLowerCase();
      d === "head" && (t = !0), t === !0 && d === "script" && (!u || e.test(u) === !0) && r.warn("The <script> tag cannot be used in a <head> tag.", i.line, i.col, n, i.raw);
    }, l = function(i) {
      i.tagName.toLowerCase() === "head" && (s.removeListener("tagstart", a), s.removeListener("tagend", l));
    };
    s.addListener("tagstart", a), s.addListener("tagend", l);
  }
};
var K = {};
Object.defineProperty(K, "__esModule", { value: !0 });
K.default = {
  id: "href-abs-or-rel",
  description: "An href attribute must be either absolute or relative.",
  init: function(s, r, n) {
    var e = this, t = n === "abs" ? "absolute" : "relative";
    s.addListener("tagstart", function(a) {
      for (var l = a.attrs, i, o = a.col + a.tagName.length + 1, u = 0, d = l.length; u < d; u++)
        if (i = l[u], i.name === "href") {
          (t === "absolute" && /^\w+?:/.test(i.value) === !1 || t === "relative" && /^https?:\/\//.test(i.value) === !0) && r.warn("The value of the href attribute [ " + i.value + " ] must be " + t + ".", a.line, o + i.index, e, i.raw);
          break;
        }
    });
  }
};
var X = {};
Object.defineProperty(X, "__esModule", { value: !0 });
var je = "(art-lojban|cel-gaulish|no-bok|no-nyn|zh-guoyu|zh-hakka|zh-min|zh-min-nan|zh-xiang)", xe = "(en-GB-oed|i-ami|i-bnn|i-default|i-enochian|i-hak|i-klingon|i-lux|i-mingo|i-navajo|i-pwn|i-tao|i-tay|i-tsu|sgn-BE-FR|sgn-BE-NL|sgn-CH-DE)", Pe = "(?<grandfathered>" + xe + "|" + je + ")", Ce = "(?<privateUse>x(-[A-Za-z0-9]{1,8})+)", Ee = "(?<privateUse2>x(-[A-Za-z0-9]{1,8})+)", Me = "[0-9A-WY-Za-wy-z]", ke = "(?<extension>" + Me + "(-[A-Za-z0-9]{2,8})+)", $e = "(?<variant>[A-Za-z0-9]{5,8}|[0-9][A-Za-z0-9]{3})", qe = "(?<region>[A-Za-z]{2}|[0-9]{3})", Re = "(?<script>[A-Za-z]{4})", ze = "(?<extlang>[A-Za-z]{3}(-[A-Za-z]{3}){0,2})", He = "(?<language>([A-Za-z]{2,3}(-" + ze + ")?)|[A-Za-z]{4}|[A-Za-z]{5,8})", De = "(" + He + "(-" + Re + ")?" + ("(-" + qe + ")?") + ("(-" + $e + ")*") + ("(-" + ke + ")*") + ("(-" + Ce + ")?") + ")", Se = "(" + Pe + "|" + De + "|" + Ee + ")";
X.default = {
  id: "html-lang-require",
  description: "The lang attribute of an <html> element must be present and should be valid.",
  init: function(s, r) {
    var n = this;
    s.addListener("tagstart", function(e) {
      var t = e.tagName.toLowerCase(), a = s.getMapAttrs(e.attrs), l = e.col + t.length + 1, i = new RegExp(Se, "g");
      t === "html" && ("lang" in a ? a.lang ? i.test(a.lang) || r.warn("The lang attribute value of <html> element must be a valid BCP47.", e.line, l, n, e.raw) : r.warn("The lang attribute of <html> element must have a value.", e.line, l, n, e.raw) : r.warn("An lang attribute must be present on <html> elements.", e.line, l, n, e.raw));
    });
  }
};
var ee = {};
Object.defineProperty(ee, "__esModule", { value: !0 });
ee.default = {
  id: "id-class-ad-disabled",
  description: "The id and class attributes cannot use the ad keyword, it will be blocked by adblock software.",
  init: function(s, r) {
    var n = this;
    s.addListener("tagstart", function(e) {
      for (var t = e.attrs, a, l, i = e.col + e.tagName.length + 1, o = 0, u = t.length; o < u; o++)
        a = t[o], l = a.name, /^(id|class)$/i.test(l) && /(^|[-_])ad([-_]|$)/i.test(a.value) && r.warn("The value of attribute " + l + " cannot use the ad keyword.", e.line, i + a.index, n, a.raw);
    });
  }
};
var te = {};
Object.defineProperty(te, "__esModule", { value: !0 });
te.default = {
  id: "id-class-value",
  description: "The id and class attribute values must meet the specified rules.",
  init: function(s, r, n) {
    var e = this, t = {
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
    }, a;
    if (typeof n == "string" ? a = t[n] : a = n, typeof a == "object" && a.regId) {
      var l = a.regId, i = a.message;
      l instanceof RegExp || (l = new RegExp(l)), s.addListener("tagstart", function(o) {
        for (var u = o.attrs, d, f = o.col + o.tagName.length + 1, c = 0, p = u.length; c < p; c++)
          if (d = u[c], d.name.toLowerCase() === "id" && l.test(d.value) === !1 && r.warn(i, o.line, f + d.index, e, d.raw), d.name.toLowerCase() === "class")
            for (var m = d.value.split(/\s+/g), g = void 0, h = 0, b = m.length; h < b; h++)
              g = m[h], g && l.test(g) === !1 && r.warn(i, o.line, f + d.index, e, g);
      });
    }
  }
};
var ae = {};
Object.defineProperty(ae, "__esModule", { value: !0 });
ae.default = {
  id: "id-unique",
  description: "The value of id attributes must be unique.",
  init: function(s, r) {
    var n = this, e = {};
    s.addListener("tagstart", function(t) {
      for (var a = t.attrs, l, i, o = t.col + t.tagName.length + 1, u = 0, d = a.length; u < d; u++)
        if (l = a[u], l.name.toLowerCase() === "id") {
          i = l.value, i && (e[i] === void 0 ? e[i] = 1 : e[i]++, e[i] > 1 && r.error("The id value [ " + i + " ] must be unique.", t.line, o + l.index, n, l.raw));
          break;
        }
    });
  }
};
var re = {};
Object.defineProperty(re, "__esModule", { value: !0 });
re.default = {
  id: "inline-script-disabled",
  description: "Inline script cannot be used.",
  init: function(s, r) {
    var n = this;
    s.addListener("tagstart", function(e) {
      for (var t = e.attrs, a, l = e.col + e.tagName.length + 1, i, o = /^on(unload|message|submit|select|scroll|resize|mouseover|mouseout|mousemove|mouseleave|mouseenter|mousedown|load|keyup|keypress|keydown|focus|dblclick|click|change|blur|error)$/i, u = 0, d = t.length; u < d; u++)
        a = t[u], i = a.name.toLowerCase(), (o.test(i) === !0 || (i === "src" || i === "href") && /^\s*javascript:/i.test(a.value)) && r.warn("Inline script [ " + a.raw + " ] cannot be used.", e.line, l + a.index, n, a.raw);
    });
  }
};
var ie = {};
Object.defineProperty(ie, "__esModule", { value: !0 });
ie.default = {
  id: "inline-style-disabled",
  description: "Inline style cannot be used.",
  init: function(s, r) {
    var n = this;
    s.addListener("tagstart", function(e) {
      for (var t = e.attrs, a, l = e.col + e.tagName.length + 1, i = 0, o = t.length; i < o; i++)
        a = t[i], a.name.toLowerCase() === "style" && r.warn("Inline style [ " + a.raw + " ] cannot be used.", e.line, l + a.index, n, a.raw);
    });
  }
};
var ne = {};
Object.defineProperty(ne, "__esModule", { value: !0 });
ne.default = {
  id: "input-requires-label",
  description: "All [ input ] tags must have a corresponding [ label ] tag. ",
  init: function(s, r) {
    var n = this, e = [], t = [];
    s.addListener("tagstart", function(l) {
      var i = l.tagName.toLowerCase(), o = s.getMapAttrs(l.attrs), u = l.col + i.length + 1;
      i === "input" && t.push({ event: l, col: u, id: o.id }), i === "label" && "for" in o && o.for !== "" && e.push({ event: l, col: u, forValue: o.for });
    }), s.addListener("end", function() {
      t.forEach(function(l) {
        a(l) || r.warn("No matching [ label ] tag found.", l.event.line, l.col, n, l.event.raw);
      });
    });
    function a(l) {
      var i = !1;
      return e.forEach(function(o) {
        l.id && l.id === o.forValue && (i = !0);
      }), i;
    }
  }
};
var se = {};
Object.defineProperty(se, "__esModule", { value: !0 });
se.default = {
  id: "script-disabled",
  description: "The <script> tag cannot be used.",
  init: function(s, r) {
    var n = this;
    s.addListener("tagstart", function(e) {
      e.tagName.toLowerCase() === "script" && r.error("The <script> tag cannot be used.", e.line, e.col, n, e.raw);
    });
  }
};
var le = {};
Object.defineProperty(le, "__esModule", { value: !0 });
le.default = {
  id: "space-tab-mixed-disabled",
  description: "Do not mix tabs and spaces for indentation.",
  init: function(s, r, n) {
    var e = this, t = "nomix", a = null;
    if (typeof n == "string") {
      var l = /^([a-z]+)(\d+)?/.exec(n);
      l && (t = l[1], a = l[2] && parseInt(l[2], 10));
    }
    s.addListener("text", function(i) {
      for (var o = i.raw, u = /(^|\r?\n)([ \t]+)/g, d; d = u.exec(o); ) {
        var f = s.fixPos(i, d.index + d[1].length);
        if (f.col === 1) {
          var c = d[2];
          t === "space" ? a ? (/^ +$/.test(c) === !1 || c.length % a !== 0) && r.warn("Please use space for indentation and keep " + a + " length.", f.line, 1, e, i.raw) : /^ +$/.test(c) === !1 && r.warn("Please use space for indentation.", f.line, 1, e, i.raw) : t === "tab" && /^\t+$/.test(c) === !1 ? r.warn("Please use tab for indentation.", f.line, 1, e, i.raw) : / +\t|\t+ /.test(c) === !0 && r.warn("Do not mix tabs and spaces for indentation.", f.line, 1, e, i.raw);
        }
      }
    });
  }
};
var oe = {};
Object.defineProperty(oe, "__esModule", { value: !0 });
oe.default = {
  id: "spec-char-escape",
  description: "Special characters must be escaped.",
  init: function(s, r) {
    var n = this;
    s.addListener("text", function(e) {
      for (var t = e.raw, a = /([<>])|( \& )/g, l; l = a.exec(t); ) {
        var i = s.fixPos(e, l.index);
        r.error("Special characters must be escaped : [ " + l[0] + " ].", i.line, i.col, n, e.raw);
      }
    });
  }
};
var ue = {};
Object.defineProperty(ue, "__esModule", { value: !0 });
ue.default = {
  id: "src-not-empty",
  description: "The src attribute of an img(script,link) must have a value.",
  init: function(s, r) {
    var n = this;
    s.addListener("tagstart", function(e) {
      for (var t = e.tagName, a = e.attrs, l, i = e.col + t.length + 1, o = 0, u = a.length; o < u; o++)
        l = a[o], (/^(img|script|embed|bgsound|iframe)$/.test(t) === !0 && l.name === "src" || t === "link" && l.name === "href" || t === "object" && l.name === "data") && l.value === "" && r.error("The attribute [ " + l.name + " ] of the tag [ " + t + " ] must have a value.", e.line, i + l.index, n, l.raw);
    });
  }
};
var de = {};
Object.defineProperty(de, "__esModule", { value: !0 });
de.default = {
  id: "style-disabled",
  description: "<style> tags cannot be used.",
  init: function(s, r) {
    var n = this;
    s.addListener("tagstart", function(e) {
      e.tagName.toLowerCase() === "style" && r.warn("The <style> tag cannot be used.", e.line, e.col, n, e.raw);
    });
  }
};
var ce = {};
Object.defineProperty(ce, "__esModule", { value: !0 });
ce.default = {
  id: "tag-pair",
  description: "Tag must be paired.",
  init: function(s, r) {
    var n = this, e = [], t = s.makeMap("area,base,basefont,br,col,frame,hr,img,input,isindex,link,meta,param,embed,track,command,source,keygen,wbr");
    s.addListener("tagstart", function(a) {
      var l = a.tagName.toLowerCase();
      t[l] === void 0 && !a.close && e.push({
        tagName: l,
        line: a.line,
        raw: a.raw
      });
    }), s.addListener("tagend", function(a) {
      var l = a.tagName.toLowerCase(), i;
      for (i = e.length - 1; i >= 0 && e[i].tagName !== l; i--)
        ;
      if (i >= 0) {
        for (var o = [], u = e.length - 1; u > i; u--)
          o.push("</" + e[u].tagName + ">");
        if (o.length > 0) {
          var d = e[e.length - 1];
          r.error("Tag must be paired, missing: [ " + o.join("") + " ], start tag match failed [ " + d.raw + " ] on line " + d.line + ".", a.line, a.col, n, a.raw);
        }
        e.length = i;
      } else
        r.error("Tag must be paired, no start tag: [ " + a.raw + " ]", a.line, a.col, n, a.raw);
    }), s.addListener("end", function(a) {
      for (var l = [], i = e.length - 1; i >= 0; i--)
        l.push("</" + e[i].tagName + ">");
      if (l.length > 0) {
        var o = e[e.length - 1];
        r.error("Tag must be paired, missing: [ " + l.join("") + " ], open tag match failed [ " + o.raw + " ] on line " + o.line + ".", a.line, a.col, n, "");
      }
    });
  }
};
var fe = {};
Object.defineProperty(fe, "__esModule", { value: !0 });
fe.default = {
  id: "tag-self-close",
  description: "Empty tags must be self closed.",
  init: function(s, r) {
    var n = this, e = s.makeMap("area,base,basefont,br,col,frame,hr,img,input,isindex,link,meta,param,embed,track,command,source,keygen,wbr");
    s.addListener("tagstart", function(t) {
      var a = t.tagName.toLowerCase();
      e[a] !== void 0 && (t.close || r.warn("The empty tag : [ " + a + " ] must be self closed.", t.line, t.col, n, t.raw));
    });
  }
};
var he = {};
Object.defineProperty(he, "__esModule", { value: !0 });
he.default = {
  id: "tagname-lowercase",
  description: "All html element names must be in lowercase.",
  init: function(s, r, n) {
    var e = this, t = Array.isArray(n) ? n : [];
    s.addListener("tagstart,tagend", function(a) {
      var l = a.tagName;
      t.indexOf(l) === -1 && l !== l.toLowerCase() && r.error("The html element name of [ " + l + " ] must be in lowercase.", a.line, a.col, e, a.raw);
    });
  }
};
var ge = {};
Object.defineProperty(ge, "__esModule", { value: !0 });
ge.default = {
  id: "tagname-specialchars",
  description: "All html element names must be in lowercase.",
  init: function(s, r) {
    var n = this, e = /[^a-zA-Z0-9\-:_]/;
    s.addListener("tagstart,tagend", function(t) {
      var a = t.tagName;
      e.test(a) && r.error("The html element name of [ " + a + " ] contains special character.", t.line, t.col, n, t.raw);
    });
  }
};
var me = {};
Object.defineProperty(me, "__esModule", { value: !0 });
me.default = {
  id: "title-require",
  description: "<title> must be present in <head> tag.",
  init: function(s, r) {
    var n = this, e = !1, t = !1, a = function(i) {
      var o = i.tagName.toLowerCase();
      o === "head" ? e = !0 : o === "title" && e && (t = !0);
    }, l = function(i) {
      var o = i.tagName.toLowerCase();
      if (t && o === "title") {
        var u = i.lastEvent;
        (u.type !== "text" || u.type === "text" && /^\s*$/.test(u.raw) === !0) && r.error("<title></title> must not be empty.", i.line, i.col, n, i.raw);
      } else
        o === "head" && (t === !1 && r.error("<title> must be present in <head> tag.", i.line, i.col, n, i.raw), s.removeListener("tagstart", a), s.removeListener("tagend", l));
    };
    s.addListener("tagstart", a), s.addListener("tagend", l);
  }
};
var pe = {}, M = be && be.__assign || function() {
  return M = Object.assign || function(s) {
    for (var r, n = 1, e = arguments.length; n < e; n++) {
      r = arguments[n];
      for (var t in r)
        Object.prototype.hasOwnProperty.call(r, t) && (s[t] = r[t]);
    }
    return s;
  }, M.apply(this, arguments);
};
Object.defineProperty(pe, "__esModule", { value: !0 });
var E = {
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
pe.default = {
  id: "tags-check",
  description: "Checks html tags.",
  init: function(s, r, n) {
    var e = this;
    E = M(M({}, E), n), s.addListener("tagstart", function(t) {
      var a = t.attrs, l = t.col + t.tagName.length + 1, i = t.tagName.toLowerCase();
      if (E[i]) {
        var o = E[i];
        if (o.selfclosing === !0 && !t.close ? r.warn("The <" + i + "> tag must be selfclosing.", t.line, t.col, e, t.raw) : o.selfclosing === !1 && t.close && r.warn("The <" + i + "> tag must not be selfclosing.", t.line, t.col, e, t.raw), Array.isArray(o.attrsRequired)) {
          var u = o.attrsRequired;
          u.forEach(function(c) {
            if (Array.isArray(c)) {
              var p = c.map(function(h) {
                return h;
              }), m = p.shift(), g = p;
              a.some(function(h) {
                return h.name === m;
              }) ? a.forEach(function(h) {
                h.name === m && g.indexOf(h.value) === -1 && r.error("The <" + i + "> tag must have attr '" + m + "' with one value of '" + g.join("' or '") + "'.", t.line, l, e, t.raw);
              }) : r.error("The <" + i + "> tag must have attr '" + m + "'.", t.line, l, e, t.raw);
            } else
              a.some(function(h) {
                return c.split("|").indexOf(h.name) !== -1;
              }) || r.error("The <" + i + "> tag must have attr '" + c + "'.", t.line, l, e, t.raw);
          });
        }
        if (Array.isArray(o.attrsOptional)) {
          var d = o.attrsOptional;
          d.forEach(function(c) {
            if (Array.isArray(c)) {
              var p = c.map(function(h) {
                return h;
              }), m = p.shift(), g = p;
              a.some(function(h) {
                return h.name === m;
              }) && a.forEach(function(h) {
                h.name === m && g.indexOf(h.value) === -1 && r.error("The <" + i + "> tag must have optional attr '" + m + "' with one value of '" + g.join("' or '") + "'.", t.line, l, e, t.raw);
              });
            }
          });
        }
        if (Array.isArray(o.redundantAttrs)) {
          var f = o.redundantAttrs;
          f.forEach(function(c) {
            a.some(function(p) {
              return p.name === c;
            }) && r.error("The attr '" + c + "' is redundant for <" + i + "> and should be ommited.", t.line, l, e, t.raw);
          });
        }
      }
    });
  }
};
var ve = {};
Object.defineProperty(ve, "__esModule", { value: !0 });
ve.default = {
  id: "attr-no-unnecessary-whitespace",
  description: "No spaces between attribute names and values.",
  init: function(s, r, n) {
    var e = this, t = Array.isArray(n) ? n : [];
    s.addListener("tagstart", function(a) {
      for (var l = a.attrs, i = a.col + a.tagName.length + 1, o = 0; o < l.length; o++)
        if (t.indexOf(l[o].name) === -1) {
          var u = /(\s*)=(\s*)/.exec(l[o].raw.trim());
          u && (u[1].length !== 0 || u[2].length !== 0) && r.error("The attribute '" + l[o].name + "' must not have spaces between the name and value.", a.line, i + l[o].index, e, l[o].raw);
        }
    });
  }
};
(function(s) {
  Object.defineProperty(s, "__esModule", { value: !0 });
  var r = S;
  Object.defineProperty(s, "altRequire", { enumerable: !0, get: function() {
    return r.default;
  } });
  var n = Z;
  Object.defineProperty(s, "attrLowercase", { enumerable: !0, get: function() {
    return n.default;
  } });
  var e = F;
  Object.defineProperty(s, "attrSort", { enumerable: !0, get: function() {
    return e.default;
  } });
  var t = I;
  Object.defineProperty(s, "attrNoDuplication", { enumerable: !0, get: function() {
    return t.default;
  } });
  var a = U;
  Object.defineProperty(s, "attrUnsafeChars", { enumerable: !0, get: function() {
    return a.default;
  } });
  var l = B;
  Object.defineProperty(s, "attrValueDoubleQuotes", { enumerable: !0, get: function() {
    return l.default;
  } });
  var i = V;
  Object.defineProperty(s, "attrValueNotEmpty", { enumerable: !0, get: function() {
    return i.default;
  } });
  var o = W;
  Object.defineProperty(s, "attrValueSingleQuotes", { enumerable: !0, get: function() {
    return o.default;
  } });
  var u = G;
  Object.defineProperty(s, "attrWhitespace", { enumerable: !0, get: function() {
    return u.default;
  } });
  var d = Y;
  Object.defineProperty(s, "doctypeFirst", { enumerable: !0, get: function() {
    return d.default;
  } });
  var f = J;
  Object.defineProperty(s, "doctypeHTML5", { enumerable: !0, get: function() {
    return f.default;
  } });
  var c = Q;
  Object.defineProperty(s, "headScriptDisabled", { enumerable: !0, get: function() {
    return c.default;
  } });
  var p = K;
  Object.defineProperty(s, "hrefAbsOrRel", { enumerable: !0, get: function() {
    return p.default;
  } });
  var m = X;
  Object.defineProperty(s, "htmlLangRequire", { enumerable: !0, get: function() {
    return m.default;
  } });
  var g = ee;
  Object.defineProperty(s, "idClsasAdDisabled", { enumerable: !0, get: function() {
    return g.default;
  } });
  var h = te;
  Object.defineProperty(s, "idClassValue", { enumerable: !0, get: function() {
    return h.default;
  } });
  var b = ae;
  Object.defineProperty(s, "idUnique", { enumerable: !0, get: function() {
    return b.default;
  } });
  var _ = re;
  Object.defineProperty(s, "inlineScriptDisabled", { enumerable: !0, get: function() {
    return _.default;
  } });
  var O = ie;
  Object.defineProperty(s, "inlineStyleDisabled", { enumerable: !0, get: function() {
    return O.default;
  } });
  var T = ne;
  Object.defineProperty(s, "inputRequiresLabel", { enumerable: !0, get: function() {
    return T.default;
  } });
  var w = se;
  Object.defineProperty(s, "scriptDisabled", { enumerable: !0, get: function() {
    return w.default;
  } });
  var A = le;
  Object.defineProperty(s, "spaceTabMixedDisabled", { enumerable: !0, get: function() {
    return A.default;
  } });
  var y = oe;
  Object.defineProperty(s, "specCharEscape", { enumerable: !0, get: function() {
    return y.default;
  } });
  var C = ue;
  Object.defineProperty(s, "srcNotEmpty", { enumerable: !0, get: function() {
    return C.default;
  } });
  var k = de;
  Object.defineProperty(s, "styleDisabled", { enumerable: !0, get: function() {
    return k.default;
  } });
  var $ = ce;
  Object.defineProperty(s, "tagPair", { enumerable: !0, get: function() {
    return $.default;
  } });
  var q = fe;
  Object.defineProperty(s, "tagSelfClose", { enumerable: !0, get: function() {
    return q.default;
  } });
  var x = he;
  Object.defineProperty(s, "tagnameLowercase", { enumerable: !0, get: function() {
    return x.default;
  } });
  var j = ge;
  Object.defineProperty(s, "tagnameSpecialChars", { enumerable: !0, get: function() {
    return j.default;
  } });
  var P = me;
  Object.defineProperty(s, "titleRequire", { enumerable: !0, get: function() {
    return P.default;
  } });
  var L = pe;
  Object.defineProperty(s, "tagsCheck", { enumerable: !0, get: function() {
    return L.default;
  } });
  var R = ve;
  Object.defineProperty(s, "attrNoUnnecessaryWhitespace", { enumerable: !0, get: function() {
    return R.default;
  } });
})(_e);
(function(s) {
  Object.defineProperty(s, "__esModule", { value: !0 }), s.HTMLParser = s.Reporter = s.HTMLRules = s.HTMLHint = void 0;
  var r = H;
  s.HTMLParser = r.default;
  var n = D;
  s.Reporter = n.default;
  var e = _e;
  s.HTMLRules = e;
  var t = function() {
    function l() {
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
    return l.prototype.addRule = function(i) {
      this.rules[i.id] = i;
    }, l.prototype.verify = function(i, o) {
      o === void 0 && (o = this.defaultRuleset), Object.keys(o).length === 0 && (o = this.defaultRuleset), i = i.replace(/^\s*<!--\s*htmlhint\s+([^\r\n]+?)\s*-->/i, function(m, g) {
        return g.replace(/(?:^|,)\s*([^:,]+)\s*(?:\:\s*([^,\s]+))?/g, function(h, b, _) {
          return o[b] = _ !== void 0 && _.length > 0 ? JSON.parse(_) : !0, "";
        }), "";
      });
      var u = new r.default(), d = new n.default(i, o), f = this.rules, c;
      for (var p in o)
        c = f[p], c !== void 0 && o[p] !== !1 && c.init(u, d, o[p]);
      return u.parse(i), d.messages;
    }, l.prototype.format = function(i, o) {
      o === void 0 && (o = {});
      var u = [], d = {
        white: "",
        grey: "",
        red: "",
        reset: ""
      };
      o.colors && (d.white = "\x1B[37m", d.grey = "\x1B[90m", d.red = "\x1B[31m", d.reset = "\x1B[39m");
      var f = o.indent || 0;
      return i.forEach(function(c) {
        var p = 40, m = p + 20, g = c.evidence, h = c.line, b = c.col, _ = g.length, O = b > p + 1 ? b - p : 1, T = g.length > b + m ? b + m : _;
        b < p + 1 && (T += p - b + 1), g = g.replace(/\t/g, " ").substring(O - 1, T), O > 1 && (g = "..." + g, O -= 3), T < _ && (g += "..."), u.push(d.white + a(f) + "L" + h + " |" + d.grey + g + d.reset);
        var w = b - O, A = g.substring(0, w).match(/[^\u0000-\u00ff]/g);
        A !== null && (w += A.length), u.push(d.white + a(f) + a(String(h).length + 3 + w) + "^ " + d.red + c.message + " (" + c.rule.id + ")" + d.reset);
      }), u;
    }, l;
  }();
  function a(l, i) {
    return new Array(l + 1).join(i || " ");
  }
  s.HTMLHint = new t(), Object.keys(e).forEach(function(l) {
    s.HTMLHint.addRule(e[l]);
  });
})(z);
const Ze = {
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
class ye {
  constructor(r, n) {
    v(this, "children");
    v(this, "closed");
    v(this, "root");
    v(this, "tagName");
    v(this, "attrs");
    v(this, "from");
    v(this, "to");
    v(this, "col");
    v(this, "line");
    v(this, "raw");
    this.event = r, this.parent = n;
    const e = (r == null ? void 0 : r.tagName) && r.tagName.toLowerCase();
    this.children = [], n ? (this.closed = !!r.close || Fe.indexOf(e) > -1, this.parent = n, this.tagName = e, this.attrs = r.attrs, this.from = r.pos, this.to = void 0, this.col = r.col, this.line = r.line, this.raw = r.raw) : this.root = this;
  }
  get depth() {
    let r = 0, n = this.parent;
    for (; n.parent; )
      r++, n = n.parent;
    return r;
  }
  close(r, n) {
    this.to = r.pos + r.raw.length, this.raw = n.html.slice(this.from, this.to);
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
    const n = (e) => e.reduce((t, a) => (a.match(...r) && t.push(a), a.children.length && (t = t.concat(n(a.children))), t), []);
    return n(this.children);
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
  constructor(r, n, e) {
    this.parser = r, this.reporter = n;
    const t = [], a = new ye();
    let l = a;
    r.addListener("tagstart", (i) => {
      const o = new ye(i, l);
      l.push(o), o.closed || t.push(l = o);
    }), r.addListener("tagend", (i) => {
      const o = i.tagName.toLowerCase();
      let u;
      for (u = t.length - 1; u >= 0 && t[u].tagName !== o; u--)
        ;
      t[u] && (t[u].close(i, this.reporter), l = t[u].parent, t.splice(u, 1));
    }), r.addListener("end", () => {
      a.closed = !0, e && e(a);
    });
  }
}
const Ie = {
  id: "body-no-duplicates",
  description: "The body tag must not be a duplicate.",
  init(s, r) {
    new N(s, r, (n) => {
      let e;
      for (let t of n.find("body")) {
        if (!e) {
          e = t;
          continue;
        }
        r.error(
          `The [ body ] tag already exists on line ${e.line}.`,
          t.line,
          t.col,
          this,
          t.raw
        );
      }
    });
  }
}, Ue = {
  id: "head-body-descendents-html",
  description: "The head and body tags must be a direct child descendents of the html tag.",
  init(s, r) {
    new N(s, r, (n) => {
      const e = n.findFirst("html");
      n.find("head", "body").filter((t) => !e || !t.isChildOf(e)).forEach((t) => {
        const { line: a, col: l, raw: i } = t, o = e ? `The [ ${t.tagName} ] tag must be a direct child descendent of the [ html ] tag on line ${e.line}.` : `The [ ${t.tagName} ] tag must be a direct child descendent of an [ html ] tag.`;
        r.error(o, a, l, this, i);
      });
    });
  }
}, Be = {
  id: "head-no-duplicates",
  description: "The head tag must not be a duplicate.",
  init(s, r) {
    new N(s, r, (n) => {
      let e;
      for (let t of n.find("head")) {
        if (!e) {
          e = t;
          continue;
        }
        r.error(
          `The [ head ] tag is a duplicate of the tag on line ${e.line}.`,
          t.line,
          t.col,
          this,
          t.raw
        );
      }
    });
  }
}, Ve = {
  id: "head-valid-children",
  description: "The head tag must only contain valid elements.",
  init(s, r, n) {
    const e = Array.isArray(n) ? n : [
      "base",
      "link",
      "meta",
      "noscript",
      "script",
      "style",
      "template",
      "title"
    ];
    new N(s, r, (t) => {
      for (let a of t.find("head"))
        for (let l of a.children) {
          if (e.indexOf(l.tagName.toLowerCase()) > -1)
            return;
          r.error(
            `The [ ${l.tagName} ] tag is not allowed inside the [ head ] tag on line ${a.line}.`,
            l.line,
            l.col,
            this,
            l.raw
          );
        }
    });
  }
}, We = {
  id: "html-no-duplicates",
  description: "The html tag must be a unique root element.",
  init(s, r) {
    new N(s, r, (n) => {
      const e = n.find("html");
      e.filter((t) => t !== e[0]).forEach((t) => {
        const { line: a, col: l, raw: i } = t, o = `The [ ${t.tagName} ] tag already exists on line ${e[0].line}.`;
        r.error(o, a, l, this, i);
      });
    });
  }
}, Ge = {
  id: "html-root-node",
  description: "The html tag must be the only root node in the document.",
  init(s, r) {
    new N(s, r, (n) => {
      const e = n.findFirst("html");
      e && n.children.filter((t) => t.tagName !== "html").forEach((t) => {
        const { line: a, col: l, raw: i } = t, o = `The [ ${t.tagName} ] cannot come ${t.isBefore(e) ? "before" : "after"} the [ html ] tag on line ${e.line}.`;
        r.error(o, a, l, this, i);
      });
    });
  }
}, Ye = {
  id: "html-valid-children",
  description: "The html tag must only contain a head and body tag.",
  init(s, r) {
    new N(s, r, (n) => {
      const e = n.findFirst("html");
      e && e.children.forEach((t) => {
        if (!t.match("head", "body")) {
          const { line: a, col: l, raw: i } = t, o = `The [ ${t.tagName} ] tag cannot be a direct descendent of the [ html ] tag on line ${e.line}.`;
          r.error(o, a, l, this, i);
        }
      });
    });
  }
}, Je = {
  id: "html-valid-children-order",
  description: "The head and body tags must be in the correct order.",
  init(s, r) {
    new N(s, r, (n) => {
      const e = n.findFirst("html"), t = n.find("head", "body").filter((i) => !e || i.isChildOf(e)), a = t.filter((i) => i.tagName === "body"), l = t.filter((i) => i.tagName === "head");
      if (a[0] && l[0] && a[0].isBefore(l[0])) {
        const { line: i, col: o, raw: u } = a[0], d = `The [ ${a[0].tagName} ] tag must come after the [ head ] tag on line ${l[0].line}.`;
        r.error(d, i, o, this, u);
      }
      if (a[0] && l[0] && l[0].isAfter(a[0])) {
        const { line: i, col: o, raw: u } = l[0], d = `The [ ${l[0].tagName} ] tag must come before the [ body ] tag on line ${a[0].line}.`;
        r.error(d, i, o, this, u);
      }
    });
  }
}, Qe = {
  id: "img-src-required",
  description: "The img tag must have a src attribute.",
  init(s, r) {
    s.addListener("tagstart", (n) => {
      if (n.tagName.toLowerCase() === "img") {
        for (let i of n.attrs)
          if (i.name.toLowerCase() === "src")
            return;
        const { line: e, col: t, raw: a } = n, l = `The [ ${n.tagName} ] tag must have a [ src ] attribute`;
        r.error(l, e, t, this, a);
      }
    });
  }
}, Ke = {
  id: "invalid-attribute-char",
  description: "Attribute must contain valid characters.",
  init(s, r) {
    s.addListener("tagstart", (n) => {
      let e = 1;
      n.attrs.forEach(({ name: t, index: a }) => {
        e += n.raw.slice(e).indexOf(t);
        let l = 0;
        const i = t.match(/[^a-zA-Z:\-1-9]/g);
        if (i)
          for (; i.length; ) {
            const o = t.slice(l), u = i.shift(), d = o.indexOf(u);
            r.error(
              `[ ${u} ] character cannot be used for attribute names.`,
              n.line,
              n.col + e + l + d,
              this,
              u
            ), l += d + 1;
          }
      });
    });
  }
}, Xe = {
  id: "nested-paragraphs",
  description: "Nested paragraphs are prohibited.",
  init(s, r) {
    let n;
    const e = [];
    s.addListener("tagstart", (t) => {
      t.tagName.toLowerCase() === "p" && (n ? e.push(t) : n = t);
    }), s.addListener("tagend", (t) => {
      const a = t.tagName.toLowerCase() === "p";
      if (n && a) {
        const [l] = e.splice(e.length - 1);
        if (!l) {
          n = void 0;
          return;
        }
        r.error(
          `[ p ] tags cannot be nested inside the [ p ] tag on line ${n.line}.`,
          l.line,
          l.col,
          this,
          r.html.slice(l.pos, t.pos + t.raw.length)
        );
      } else
        a || (n = void 0);
    }), s.addListener("end", (t) => {
      n && e.length && e.forEach((a) => {
        r.error(
          `[ p ] tags cannot be nested inside the [ p ] tag on line ${n.line}.`,
          a.line,
          a.col,
          this,
          r.html.slice(a.pos, t.lastEvent.pos + t.lastEvent.raw.length)
        );
      });
    });
  }
}, et = {
  absolute: /^https?:\/\//,
  relative: /^\w+?:/
};
class tt {
  constructor(r) {
    v(this, "name");
    v(this, "pattern");
    v(this, "regex");
    const { name: n, pattern: e } = Object.assign({
      pattern: null,
      name: null
    }, typeof r == "object" ? r : {
      pattern: r
    });
    this.name = n || e, this.pattern = e, this.regex = et[e] || new RegExp(e);
  }
  test(r) {
    return this.regex.test(r);
  }
  error(r, n) {
    return new at(this, r, n);
  }
}
class at extends Error {
  constructor(n, e, t) {
    super();
    v(this, "line");
    v(this, "col");
    this.message = `The [ ${t.name} ] attribute "${t.value}" must follow the ${n.name} format.`, this.name = n.name, this.line = e.line, this.col = e.col + e.tagName.length + 1 + t.index;
  }
}
class rt extends Error {
  constructor(n, e, t) {
    super(e.length === 1 ? e[0].message : `The [ ${t.name} ] attribute "${t.value}" must one of the following formats: ${e.map((a) => `"${a.name}"`).join(", ")}.`);
    v(this, "line");
    v(this, "col");
    this.line = n.line, this.col = n.col + n.tagName.length + 1 + t.index;
  }
}
function it(s, r, n) {
  const e = [];
  for (const [t, a] of Object.entries(s)) {
    if (a.test(n.value))
      return !0;
    e.push(a.error(r, n));
  }
  throw new rt(r, e, n);
}
const nt = {
  id: "valid-path-format",
  description: "Paths must be a valid format.",
  init(s, r, n) {
    s.addListener("tagstart", (e) => {
      n.forEach((t) => {
        const a = t.formats.map((i) => new tt(i));
        let l = Array.isArray(t.tag) ? t.tag : t.tag ? [t.tag] : [];
        (!l.length || l.indexOf(e.tagName) > -1) && e.attrs.forEach((i) => {
          if (!t.attr || t.attr === i.name)
            try {
              it(a, e, i);
            } catch (o) {
              r.error(
                o.message,
                o.line,
                o.col,
                this,
                i.raw
              );
            }
        });
      });
    });
  }
}, we = {
  "body-no-duplicates": Ie,
  "head-body-descendents-html": Ue,
  "head-no-duplicates": Be,
  "head-valid-children": Ve,
  "html-valid-children-order": Je,
  "html-no-duplicates": We,
  "html-root-node": Ge,
  "html-valid-children": Ye,
  "img-src-required": Qe,
  "invalid-attribute-char": Ke,
  "nested-paragraphs": Xe,
  "valid-path-format": nt
};
Object.keys(we).forEach((s) => {
  z.HTMLHint.addRule(we[s]);
});
function lt(s, r) {
  return z.HTMLHint.verify(s, r || Ze).map((n) => (n.rule.link = n.rule.link.replace(
    "https://github.com/thedaviddias/HTMLHint/wiki/",
    "https://thecapsule.email/docs/codes/"
  ), n));
}
export {
  lt as lint
};
//# sourceMappingURL=capsule-lint.js.map
