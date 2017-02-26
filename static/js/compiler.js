var compile = {
    transform: function(t, n, e) {
        var i = {
                events: [],
                html: ""
            },
            r = {
                events: !1
            };
        if (r = compile._extend(r, e), void 0 !== n || void 0 !== t) {
            var s = "string" == typeof t ? JSON.parse(t) : t;
            i = compile._transform(s, n, r)
        }
        return r.events ? i : i.html
    },
    _extend: function(t, n) {
        var e = {};
        for (var i in t) e[i] = t[i];
        for (var i in n) e[i] = n[i];
        return e
    },
    _append: function(t, n) {
        var e = {
            html: "",
            event: []
        };
        return "undefined" != typeof t && "undefined" != typeof n && (e.html = t.html + n.html, e.events = t.events.concat(n.events)), e
    },
    _isArray: function(t) {
        return "[object Array]" === Object.prototype.toString.call(t)
    },
    _transform: function(t, n, e) {
        var i = {
            events: [],
            html: ""
        };
        if (compile._isArray(t))
            for (var r = t.length, s = 0; r > s; ++s) i = compile._append(i, compile._apply(t[s], n, s, e));
        else "object" == typeof t && (i = compile._append(i, compile._apply(t, n, void 0, e)));
        return i
    },
    _apply: function(t, n, e, i) {
        var r = {
            events: [],
            html: ""
        };
        if (compile._isArray(n))
            for (var s = n.length, o = 0; s > o; ++o) r = compile._append(r, compile._apply(t, n[o], e, i));
        else if ("object" == typeof n) {
            var a = "<>";
            if (void 0 === n[a] && (a = "tag"), void 0 !== n[a]) {
                var l = compile._getValue(t, n, a, e);
                r.html += "<" + l;
                var h, f = {
                    events: [],
                    html: ""
                };
                for (var u in n) switch (u) {
                    case "tag":
                    case "<>":
                        break;
                    case "children":
                    case "html":
                        var d = n[u];
                        if (compile._isArray(d)) f = compile._append(f, compile._apply(t, d, e, i));
                        else if ("function" == typeof d) {
                            var c = d.call(t, t, e);
                            switch (typeof c) {
                                case "object":
                                    void 0 !== c.html && void 0 !== c.events && (f = compile._append(f, c));
                                    break;
                                case "function":
                                case "undefined":
                                    break;
                                default:
                                    f.html += c
                            }
                        } else h = compile._getValue(t, n, u, e);
                        break;
                    default:
                        var v = !1;
                        if (u.length > 2 && "on" == u.substring(0, 2).toLowerCase()) {
                            if (i.events) {
                                var m = {
                                        action: n[u],
                                        obj: t,
                                        data: i.eventData,
                                        index: e
                                    },
                                    p = compile._guid();
                                r.events[r.events.length] = {
                                    id: p,
                                    type: u.substring(2),
                                    data: m
                                }, r.html += " compile-event-id-" + u.substring(2) + "='" + p + "'"
                            }
                            v = !0
                        }
                        if (!v) {
                            var j = compile._getValue(t, n, u, e);
                            if (void 0 !== j) {
                                var _;
                                _ = "string" == typeof j ? '"' + j.replace(/"/g, "&quot;") + '"' : j, r.html += " " + u + "=" + _
                            }
                        }
                }
                r.html += ">", h && (r.html += h), r = compile._append(r, f), r.html += "</" + l + ">"
            }
        }
        return r
    },
    _guid: function() {
        var t = function() {
            return (65536 * (1 + Math.random()) | 0).toString(16).substring(1)
        };
        return t() + t() + "-" + t() + t() + "-" + t() + t()
    },
    _getValue: function(t, n, e, i) {
        var r = "",
            s = n[e],
            o = typeof s;
        if ("function" === o) return s.call(t, t, i);
        if ("string" === o) {
            var a = new compile._tokenizer([/\$\{([^\}\{]+)\}/], function(n, e, i) {
                return e ? n.replace(i, function(n, e) {
                    for (var i = e.split("."), r = t, s = "", o = i.length, a = 0; o > a; ++a)
                        if (i[a].length > 0) {
                            var l = r[i[a]];
                            if (r = l, null === r || void 0 === r) break
                        }
                    return null !== r && void 0 !== r && (s = r), s
                }) : n
            });
            r = a.parse(s).join("")
        } else r = s;
        return r
    },
    _tokenizer: function(t, n) {
        return this instanceof compile._tokenizer ? (this.tokenizers = t.splice ? t : [t], n && (this.doBuild = n), this.parse = function(t) {
            this.src = t, this.ended = !1, this.tokens = [];
            do this.next(); while (!this.ended);
            return this.tokens
        }, this.build = function(t, n) {
            t && this.tokens.push(this.doBuild ? this.doBuild(t, n, this.tkn) : t)
        }, this.next = function() {
            var t, n = this;
            n.findMin(), t = n.src.slice(0, n.min), n.build(t, !1), n.src = n.src.slice(n.min).replace(n.tkn, function(t) {
                return n.build(t, !0), ""
            }), n.src || (n.ended = !0)
        }, void(this.findMin = function() {
            var t, n, e = this,
                i = 0;
            for (e.min = -1, e.tkn = ""; void 0 !== (t = e.tokenizers[i++]);) n = e.src[t.test ? "search" : "indexOf"](t), -1 != n && (-1 == e.min || n < e.min) && (e.tkn = t, e.min = n); - 1 == e.min && (e.min = e.src.length)
        })) : new compile._tokenizer(t, n)
    }
};

function compile_events(t) {
    for (var e = $(document.createElement("i")).html(t.html), n = 0; n < t.events.length; n++) {
        var r = t.events[n],
            o = $(e).find("[compile-event-id-" + r.type + "='" + r.id + "']");
        if (0 === o.length) throw "jquery.compile was unable to attach event " + r.id + " to DOM";
        $(o).removeAttr("compile-event-id-" + r.type), $(o).on(r.type, r.data, function(t) {
            t.data.event = t, t.data.action.call($(this), t.data)
        })
    }
    return $(e).children()
}! function(t) {
    t.compile = function(e, n, r) {
        if ("undefined" == typeof compile) return void 0;
        var o = {
            output: "compile"
        };
        switch (void 0 !== r && t.extend(o, r), o.output) {
            case "compile":
                return o.events = !0, compile.transform(e, n, o);
            case "html":
                return o.events = !1, compile.transform(e, n, o);
            case "jquery":
                o.events = !1;
                var a = compile_events(compile.transform(e, n, o));
                return a
        }
    }, t.fn.compile = function(e, n, r) {
        if ("undefined" == typeof compile) return void 0;
        var o = {
            append: !0,
            replace: !1,
            prepend: !1,
            eventData: {}
        };
        return void 0 !== r && t.extend(o, r), o.events = !0, this.each(function() {
            var r = compile_events(compile.transform(e, n, o));
            o.replace ? t.fn.replaceWith.call(t(this), r) : o.prepend ? t.fn.prepend.call(t(this), r) : t.fn.append.call(t(this), r)
        })
    }
}(jQuery);