/*
 * jQuery UI Widget 1.8.6
 *
 * Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Widget
 */ (function (a, c) {
    if (a.cleanData) {
        var d = a.cleanData;
        a.cleanData = function (b) {
            for (var f = 0, g;
            (g = b[f]) != null; f++) {
                a(g).triggerHandler("remove");
            }
            d(b);
        };
    } else {
        var e = a.fn.remove;
        a.fn.remove = function (b, f) {
            return this.each(function () {
                if (!f) {
                    if (!b || a.filter(b, [this]).length) {
                        a("*", this).add([this]).each(function () {
                            a(this).triggerHandler("remove");
                        });
                    }
                }
                return e.call(a(this), b, f);
            });
        };
    }
    a.widget = function (b, g, h) {
        var j = b.split(".")[0],
            k;
        b = b.split(".")[1];
        k = j + "-" + b;
        if (!h) {
            h = g;
            g = a.Widget;
        }
        a.expr[":"][k] = function (f) {
            return !!a.data(f, b);
        };
        a[j] = a[j] || {};
        a[j][b] = function (l, f) {
            arguments.length && this._createWidget(l, f);
        };
        g = new g;
        g.options = a.extend(true, {}, g.options);
        a[j][b].prototype = a.extend(true, g, {
            namespace: j,
            widgetName: b,
            widgetEventPrefix: a[j][b].prototype.widgetEventPrefix || b,
            widgetBaseClass: k
        }, h);
        a.widget.bridge(b, a[j][b]);
    };
    a.widget.bridge = function (b, f) {
        a.fn[b] = function (g) {
            var j = typeof g === "string",
                k = Array.prototype.slice.call(arguments, 1),
                l = this;
            g = !j && k.length ? a.extend.apply(null, [true, g].concat(k)) : g;
            if (j && g.charAt(0) === "_") {
                return l;
            }
            j ? this.each(function () {
                var h = a.data(this, b),
                    n = h && a.isFunction(h[g]) ? h[g].apply(h, k) : h;
                if (n !== h && n !== c) {
                    l = n;
                    return false;
                }
            }) : this.each(function () {
                var h = a.data(this, b);
                h ? h.option(g || {})._init() : a.data(this, b, new f(g, this));
            });
            return l;
        };
    };
    a.Widget = function (b, f) {
        arguments.length && this._createWidget(b, f);
    };
    a.Widget.prototype = {
        widgetName: "widget",
        widgetEventPrefix: "",
        options: {
            disabled: false
        },
        _createWidget: function (b, f) {
            a.data(f, this.widgetName, this);
            this.element = a(f);
            this.options = a.extend(true, {}, this.options, this._getCreateOptions(), b);
            var g = this;
            this.element.bind("remove." + this.widgetName, function () {
                g.destroy();
            });
            this._create();
            this._trigger("create");
            this._init();
        },
        _getCreateOptions: function () {
            return a.metadata && a.metadata.get(this.element[0])[this.widgetName];
        },
        _create: function () {},
        _init: function () {},
        destroy: function () {
            this.element.unbind("." + this.widgetName).removeData(this.widgetName);
            this.widget().unbind("." + this.widgetName).removeAttr("aria-disabled").removeClass(this.widgetBaseClass + "-disabled ui-state-disabled");
        },
        widget: function () {
            return this.element;
        },
        option: function (b, f) {
            var g = b;
            if (arguments.length === 0) {
                return a.extend({}, this.options);
            }
            if (typeof b === "string") {
                if (f === c) {
                    return this.options[b];
                }
                g = {};
                g[b] = f;
            }
            this._setOptions(g);
            return this;
        },
        _setOptions: function (b) {
            var f = this;
            a.each(b, function (g, h) {
                f._setOption(g, h);
            });
            return this;
        },
        _setOption: function (b, f) {
            this.options[b] = f;
            if (b === "disabled") {
                this.widget()[f ? "addClass" : "removeClass"](this.widgetBaseClass + "-disabled ui-state-disabled").attr("aria-disabled", f);
            }
            return this;
        },
        enable: function () {
            return this._setOption("disabled", false);
        },
        disable: function () {
            return this._setOption("disabled", true);
        },
        _trigger: function (b, g, h) {
            var j = this.options[b];
            g = a.Event(g);
            g.type = (b === this.widgetEventPrefix ? b : this.widgetEventPrefix + b).toLowerCase();
            h = h || {};
            if (g.originalEvent) {
                b = a.event.props.length;
                for (var k; b;) {
                    k = a.event.props[--b];
                    g[k] = g.originalEvent[k];
                }
            }
            this.element.trigger(g, h);
            return !(a.isFunction(j) && j.call(this.element[0], g, h) === false || g.isDefaultPrevented());
        }
    };
})(jQuery);


(function (a) {
    a.ui = a.ui || {};
    var b = /left|center|right/,
        d = /top|center|bottom/,
        e = a.fn.position,
        f = a.fn.offset;
    a.fn.position = function (l) {
        if (!l || !l.of) {
            return e.apply(this, arguments);
        }
        l = a.extend({}, l);
        var c = a(l.of),
            n = c[0],
            p = (l.collision || "flip").split(" "),
            o = l.offset ? l.offset.split(" ") : [0, 0],
            q, t, s;
        if (n.nodeType === 9) {
            q = c.width();
            t = c.height();
            s = {
                top: 0,
                left: 0
            };
        } else {
            if (n.setTimeout) {
                q = c.width();
                t = c.height();
                s = {
                    top: c.scrollTop(),
                    left: c.scrollLeft()
                };
            } else {
                if (n.preventDefault) {
                    l.at = "left top";
                    q = t = 0;
                    s = {
                        top: l.of.pageY,
                        left: l.of.pageX
                    };
                } else {
                    q = c.outerWidth();
                    t = c.outerHeight();
                    s = c.offset();
                }
            }
        }
        a.each(["my", "at"], function () {
            var g = (l[this] || "").split(" ");
            if (g.length === 1) {
                g = b.test(g[0]) ? g.concat(["center"]) : d.test(g[0]) ? ["center"].concat(g) : ["center", "center"];
            }
            g[0] = b.test(g[0]) ? g[0] : "center";
            g[1] = d.test(g[1]) ? g[1] : "center";
            l[this] = g;
        });
        if (p.length === 1) {
            p[1] = p[0];
        }
        o[0] = parseInt(o[0], 10) || 0;
        if (o.length === 1) {
            o[1] = o[0];
        }
        o[1] = parseInt(o[1], 10) || 0;
        if (l.at[0] === "right") {
            s.left += q;
        } else {
            if (l.at[0] === "center") {
                s.left += q / 2;
            }
        }
        if (l.at[1] === "bottom") {
            s.top += t;
        } else {
            if (l.at[1] === "center") {
                s.top += t / 2;
            }
        }
        s.left += o[0];
        s.top += o[1];
        return this.each(function () {
            var g = a(this),
                j = g.outerWidth(),
                k = g.outerHeight(),
                u = parseInt(a.curCSS(this, "marginLeft", true)) || 0,
                x = parseInt(a.curCSS(this, "marginTop", true)) || 0,
                z = j + u + parseInt(a.curCSS(this, "marginRight", true)) || 0,
                A = k + x + parseInt(a.curCSS(this, "marginBottom", true)) || 0,
                h = a.extend({}, s),
                y;
            if (l.my[0] === "right") {
                h.left -= j;
            } else {
                if (l.my[0] === "center") {
                    h.left -= j / 2;
                }
            }
            if (l.my[1] === "bottom") {
                h.top -= k;
            } else {
                if (l.my[1] === "center") {
                    h.top -= k / 2;
                }
            }
            h.left = parseInt(h.left);
            h.top = parseInt(h.top);
            y = {
                left: h.left - u,
                top: h.top - x
            };
            a.each(["left", "top"], function (v, w) {
                a.ui.position[p[v]] && a.ui.position[p[v]][w](h, {
                    targetWidth: q,
                    targetHeight: t,
                    elemWidth: j,
                    elemHeight: k,
                    collisionPosition: y,
                    collisionWidth: z,
                    collisionHeight: A,
                    offset: o,
                    my: l.my,
                    at: l.at
                });
            });
            a.fn.bgiframe && g.bgiframe();
            g.offset(a.extend(h, {
                using: l.using
            }));
        });
    };
    a.ui.position = {
        fit: {
            left: function (g, c) {
                var h = a(window);
                h = c.collisionPosition.left + c.collisionWidth - h.width() - h.scrollLeft();
                g.left = h > 0 ? g.left - h : Math.max(g.left - c.collisionPosition.left, g.left);
            },
            top: function (g, c) {
                var h = a(window);
                h = c.collisionPosition.top + c.collisionHeight - h.height() - h.scrollTop();
                g.top = h > 0 ? g.top - h : Math.max(g.top - c.collisionPosition.top, g.top);
            }
        },
        flip: {
            left: function (j, c) {
                if (c.at[0] !== "center") {
                    var k = a(window);
                    k = c.collisionPosition.left + c.collisionWidth - k.width() - k.scrollLeft();
                    var n = c.my[0] === "left" ? -c.elemWidth : c.my[0] === "right" ? c.elemWidth : 0,
                        l = c.at[0] === "left" ? c.targetWidth : -c.targetWidth,
                        o = -2 * c.offset[0];
                    j.left += c.collisionPosition.left < 0 ? n + l + o : k > 0 ? n + l + o : 0;
                }
            },
            top: function (j, c) {
                if (c.at[1] !== "center") {
                    var k = a(window);
                    k = c.collisionPosition.top + c.collisionHeight - k.height() - k.scrollTop();
                    var n = c.my[1] === "top" ? -c.elemHeight : c.my[1] === "bottom" ? c.elemHeight : 0,
                        l = c.at[1] === "top" ? c.targetHeight : -c.targetHeight,
                        o = -2 * c.offset[1];
                    j.top += c.collisionPosition.top < 0 ? n + l + o : k > 0 ? n + l + o : 0;
                }
            }
        }
    };
    if (!a.offset.setOffset) {
        a.offset.setOffset = function (j, c) {
            if (/static/.test(a.curCSS(j, "position"))) {
                j.style.position = "relative";
            }
            var k = a(j),
                n = k.offset(),
                l = parseInt(a.curCSS(j, "top", true), 10) || 0,
                o = parseInt(a.curCSS(j, "left", true), 10) || 0;
            n = {
                top: c.top - n.top + l,
                left: c.left - n.left + o
            };
            "using" in c ? c.using.call(j, n) : k.css(n);
        };
        a.fn.offset = function (g) {
            var c = this[0];
            if (!c || !c.ownerDocument) {
                return null;
            }
            if (g) {
                return this.each(function () {
                    a.offset.setOffset(this, g);
                });
            }
            return f.call(this);
        };
    }
})(jQuery);


(function (a) {
    a.widget("ui.autocomplete", {
        options: {
            appendTo: "body",
            delay: 300,
            minLength: 1,
            position: {
                my: "left top",
                at: "left bottom",
                collision: "none"
            },
            source: null
        },
        _create: function () {
            var c = this,
                d = this.element[0].ownerDocument,
                e;
            this.element.addClass("ui-autocomplete-input").attr("autocomplete", "off").attr({
                role: "textbox",
                "aria-autocomplete": "list",
                "aria-haspopup": "true"
            }).bind("keydown.autocomplete", function (b) {
                if (!(c.options.disabled || c.element.attr("readonly"))) {
                    e = false;
                    var f = a.ui.keyCode;
                    switch (b.keyCode) {
                    case f.PAGE_UP:
                        c._move("previousPage", b);
                        break;
                    case f.PAGE_DOWN:
                        c._move("nextPage", b);
                        break;
                    case f.UP:
                        c._move("previous", b);
                        b.preventDefault();
                        break;
                    case f.DOWN:
                        c._move("next", b);
                        b.preventDefault();
                        break;
                    case f.ENTER:
                    case f.NUMPAD_ENTER:
                        if (c.menu.active) {
                            e = true;
                            b.preventDefault();
                        }
                    case f.TAB:
                        if (!c.menu.active) {
                            return;
                        }
                        c.menu.select(b);
                        break;
                    case f.ESCAPE:
                        c.element.val(c.term);
                        c.close(b);
                        break;
                    default:
                        clearTimeout(c.searching);
                        c.searching = setTimeout(function () {
                            if (c.term != c.element.val()) {
                                c.selectedItem = null;
                                c.search(null, b);
                            }
                        }, c.options.delay);
                        break;
                    }
                }
            }).bind("keypress.autocomplete", function (b) {
                if (e) {
                    e = false;
                    b.preventDefault();
                }
            }).bind("focus.autocomplete", function () {
                if (!c.options.disabled) {
                    c.selectedItem = null;
                    c.previous = c.element.val();
                }
            }).bind("blur.autocomplete", function (b) {
                if (!c.options.disabled) {
                    clearTimeout(c.searching);
                    c.closing = setTimeout(function () {
                        c.close(b);
                        c._change(b);
                    }, 150);
                }
            });
            this._initSource();
            this.response = function () {
                return c._response.apply(c, arguments);
            };
            this.menu = a("<ul></ul>").addClass("ui-autocomplete").appendTo(a(this.options.appendTo || "body", d)[0]).mousedown(function (b) {
                var f = c.menu.element[0];
                a(b.target).closest(".ui-menu-item").length || setTimeout(function () {
                    a(document).one("mousedown", function (h) {
                        h.target !== c.element[0] && h.target !== f && !a.ui.contains(f, h.target) && c.close();
                    });
                }, 1);
                setTimeout(function () {
                    clearTimeout(c.closing);
                }, 13);
            }).menu({
                focus: function (b, f) {
                    f = f.item.data("item.autocomplete");
                    false !== c._trigger("focus", b, {
                        item: f
                    }) && /^key/.test(b.originalEvent.type) && c.element.val(f.value);
                },
                selected: function (b, f) {
                    f = f.item.data("item.autocomplete");
                    var h = c.previous;
                    if (c.element[0] !== d.activeElement) {
                        c.element.focus();
                        c.previous = h;
                        setTimeout(function () {
                            c.previous = h;
                        }, 1);
                    }
                    false !== c._trigger("select", b, {
                        item: f
                    }) && c.element.val(f.value);
                    c.term = c.element.val();
                    c.close(b);
                    c.selectedItem = f;
                },
                blur: function () {
                    c.menu.element.is(":visible") && c.element.val() !== c.term && c.element.val(c.term);
                }
            }).zIndex(this.element.zIndex() + 1).css({
                top: 0,
                left: 0
            }).hide().data("menu");
            a.fn.bgiframe && this.menu.element.bgiframe();
        },
        destroy: function () {
            this.element.removeClass("ui-autocomplete-input").removeAttr("autocomplete").removeAttr("role").removeAttr("aria-autocomplete").removeAttr("aria-haspopup");
            this.menu.element.remove();
            a.Widget.prototype.destroy.call(this);
        },
        _setOption: function (c, d) {
            a.Widget.prototype._setOption.apply(this, arguments);
            c === "source" && this._initSource();
            if (c === "appendTo") {
                this.menu.element.appendTo(a(d || "body", this.element[0].ownerDocument)[0]);
            }
        },
        _initSource: function () {
            var c = this,
                d, e;
            if (a.isArray(this.options.source)) {
                d = this.options.source;
                this.source = function (b, f) {
                    f(a.ui.autocomplete.filter(d, b.term));
                };
            } else {
                if (typeof this.options.source === "string") {
                    e = this.options.source;
                    this.source = function (b, f) {
                        c.xhr && c.xhr.abort();
                        c.xhr = a.getJSON(e, b, function (j, l, k) {
                            k === c.xhr && f(j);
                            c.xhr = null;
                        });
                    };
                } else {
                    this.source = this.options.source;
                }
            }
        },
        search: function (c, d) {
            c = c != null ? c : this.element.val();
            this.term = this.element.val();
            if (c.length < this.options.minLength) {
                return this.close(d);
            }
            clearTimeout(this.closing);
            if (this._trigger("search", d) !== false) {
                return this._search(c);
            }
        },
        _search: function (b) {
            this.element.addClass("ui-autocomplete-loading");
            this.source({
                term: b
            }, this.response);
        },
        _response: function (b) {
            if (b && b.length) {
                b = this._normalize(b);
                this._suggest(b);
                this._trigger("open");
            } else {
                this.close();
            }
            this.element.removeClass("ui-autocomplete-loading");
        },
        close: function (b) {
            clearTimeout(this.closing);
            if (this.menu.element.is(":visible")) {
                this._trigger("close", b);
                this.menu.element.hide();
                this.menu.deactivate();
            }
        },
        _change: function (b) {
            this.previous !== this.element.val() && this._trigger("change", b, {
                item: this.selectedItem
            });
        },
        _normalize: function (b) {
            if (b.length && b[0].label && b[0].value) {
                return b;
            }
            return a.map(b, function (c) {
                if (typeof c === "string") {
                    return {
                        label: c,
                        value: c
                    };
                }
                return a.extend({
                    label: c.label || c.value,
                    value: c.value || c.label
                }, c);
            });
        },
        _suggest: function (b) {
            this._renderMenu(this.menu.element.empty().zIndex(this.element.zIndex() + 1), b);
            this.menu.deactivate();
            this.menu.refresh();
            this.menu.element.show().position(a.extend({
                of: this.element
            }, this.options.position));
            this._resizeMenu();
        },
        _resizeMenu: function () {
            var b = this.menu.element;
            b.outerWidth(Math.max(b.width("").outerWidth(), this.element.outerWidth()));
        },
        _renderMenu: function (c, d) {
            var e = this;
            a.each(d, function (b, f) {
                e._renderItem(c, f);
            });
        },
        _renderItem: function (c, d) {
            return a("<li></li>").data("item.autocomplete", d).append(a("<a></a>").text(d.label)).appendTo(c);
        },
        _move: function (c, d) {
            if (this.menu.element.is(":visible")) {
                if (this.menu.first() && /^previous/.test(c) || this.menu.last() && /^next/.test(c)) {
                    this.element.val(this.term);
                    this.menu.deactivate();
                } else {
                    this.menu[c](d);
                }
            } else {
                this.search(null, d);
            }
        },
        widget: function () {
            return this.menu.element;
        }
    });
    a.extend(a.ui.autocomplete, {
        escapeRegex: function (b) {
            return b.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
        },
        filter: function (c, d) {
            var e = new RegExp(a.ui.autocomplete.escapeRegex(d), "i");
            return a.grep(c, function (b) {
                return e.test(b.label || b.value || b);
            });
        }
    });
})(jQuery);


(function (a) {
    a.widget("ui.menu", {
        _create: function () {
            var b = this;
            this.element.addClass("ui-menu ui-widget ui-widget-content ui-corner-all").attr({
                role: "listbox",
                "aria-activedescendant": "ui-active-menuitem"
            }).click(function (c) {
                if (a(c.target).closest(".ui-menu-item a").length) {
                    c.preventDefault();
                    b.select(c);
                }
            });
            this.refresh();
        },
        refresh: function () {
            var b = this;
            this.element.children("li:not(.ui-menu-item):has(a)").addClass("ui-menu-item").attr("role", "menuitem").children("a").addClass("ui-corner-all").attr("tabindex", - 1).mouseenter(function (c) {
                b.activate(c, a(this).parent());
            }).mouseleave(function () {
                b.deactivate();
            });
        },
        activate: function (e, g) {
            this.deactivate();
            if (this.hasScroll()) {
                var k = g.offset().top - this.element.offset().top,
                    h = this.element.attr("scrollTop"),
                    j = this.element.height();
                if (k < 0) {
                    this.element.attr("scrollTop", h + k);
                } else {
                    k >= j && this.element.attr("scrollTop", h + k - j + g.height());
                }
            }
            this.active = g.eq(0).children("a").addClass("ui-state-hover").attr("id", "ui-active-menuitem").end();
            this._trigger("focus", e, {
                item: g
            });
        },
        deactivate: function () {
            if (this.active) {
                this.active.children("a").removeClass("ui-state-hover").removeAttr("id");
                this._trigger("blur");
                this.active = null;
            }
        },
        next: function (b) {
            this.move("next", ".ui-menu-item:first", b);
        },
        previous: function (b) {
            this.move("prev", ".ui-menu-item:last", b);
        },
        first: function () {
            return this.active && !this.active.prevAll(".ui-menu-item").length;
        },
        last: function () {
            return this.active && !this.active.nextAll(".ui-menu-item").length;
        },
        move: function (c, d, e) {
            if (this.active) {
                c = this.active[c + "All"](".ui-menu-item").eq(0);
                c.length ? this.activate(e, c) : this.activate(e, this.element.children(d));
            } else {
                this.activate(e, this.element.children(d));
            }
        },
        nextPage: function (d) {
            if (this.hasScroll()) {
                if (!this.active || this.last()) {
                    this.activate(d, this.element.children(".ui-menu-item:first"));
                } else {
                    var e = this.active.offset().top,
                        h = this.element.height(),
                        g = this.element.children(".ui-menu-item").filter(function () {
                            var b = a(this).offset().top - e - h + a(this).height();
                            return b < 10 && b > -10;
                        });
                    g.length || (g = this.element.children(".ui-menu-item:last"));
                    this.activate(d, g);
                }
            } else {
                this.activate(d, this.element.children(".ui-menu-item").filter(!this.active || this.last() ? ":first" : ":last"));
            }
        },
        previousPage: function (c) {
            if (this.hasScroll()) {
                if (!this.active || this.first()) {
                    this.activate(c, this.element.children(".ui-menu-item:last"));
                } else {
                    var d = this.active.offset().top,
                        e = this.element.height();
                    result = this.element.children(".ui-menu-item").filter(function () {
                        var b = a(this).offset().top - d + e - a(this).height();
                        return b < 10 && b > -10;
                    });
                    result.length || (result = this.element.children(".ui-menu-item:first"));
                    this.activate(c, result);
                }
            } else {
                this.activate(c, this.element.children(".ui-menu-item").filter(!this.active || this.first() ? ":last" : ":first"));
            }
        },
        hasScroll: function () {
            return this.element.height() < this.element.attr("scrollHeight");
        },
        select: function (b) {
            this._trigger("selected", b, {
                item: this.active
            });
        }
    });
})(jQuery);


(function (A, J, Z) {
    var Q = "function",
        K = "password",
        C = "maxLength",
        F = "type",
        z = "",
        B = true,
        P = "placeholder",
        D = false,
        X = "watermark",
        L = X,
        H = "watermarkClass",
        U = "watermarkFocus",
        O = "watermarkSubmit",
        S = "watermarkMaxLength",
        G = "watermarkPassword",
        E = "watermarkText",
        N = /\r/g,
        W = ":data(" + L + ")",
        R = ":text,:password,:search,textarea",
        T = ["Page_ClientValidate"],
        V = D,
        Y = P in document.createElement("input");
    A.watermark = A.watermark || {
        version: "3.1.1",
        runOnce: B,
        options: {
            className: X,
            useNative: B,
            hideBeforeUnload: B
        },
        hide: function (b) {
            A(b).filter(W).each(function () {
                A.watermark._hide(A(this));
            });
        },
        _hide: function (a, u) {
            var s = a[0],
                t = (s.value || z).replace(N, z),
                h = a.data(E) || z,
                j = a.data(S) || 0,
                g = a.data(H);
            if (h.length && t == h) {
                s.value = z;
                if (a.data(G)) {
                    if ((a.attr(F) || z) === "text") {
                        var f = a.data(G) || [],
                            d = a.parent() || [];
                        if (f.length && d.length) {
                            d[0].removeChild(a[0]);
                            d[0].appendChild(f[0]);
                            a = f;
                        }
                    }
                }
                if (j) {
                    a.attr(C, j);
                    a.removeData(S);
                }
                if (u) {
                    a.attr("autocomplete", "off");
                    J.setTimeout(function () {
                        a.select();
                    }, 1);
                }
            }
            g && a.removeClass(g);
        },
        show: function (b) {
            A(b).filter(W).each(function () {
                A.watermark._show(A(this));
            });
        },
        _show: function (a) {
            var g = a[0],
                t = (g.value || z).replace(N, z),
                b = a.data(E) || z,
                h = a.attr(F) || z,
                k = a.data(H);
            if ((t.length == 0 || t == b) && !a.data(U)) {
                V = B;
                if (a.data(G)) {
                    if (h === K) {
                        var f = a.data(G) || [],
                            d = a.parent() || [];
                        if (f.length && d.length) {
                            d[0].removeChild(a[0]);
                            d[0].appendChild(f[0]);
                            a = f;
                            a.attr(C, b.length);
                            g = a[0];
                        }
                    }
                }
                if (h === "text" || h === "search") {
                    var c = a.attr(C) || 0;
                    if (c > 0 && b.length > c) {
                        a.data(S, c);
                        a.attr(C, b.length);
                    }
                }
                k && a.addClass(k);
                g.value = b;
            } else {
                A.watermark._hide(a);
            }
        },
        hideAll: function () {
            if (V) {
                A.watermark.hide(R);
                V = D;
            }
        },
        showAll: function () {
            A.watermark.show(R);
        }
    };
    A.fn.watermark = A.fn.watermark || function (b, a) {
        var c = "string";
        if (!this.length) {
            return this;
        }
        var e = D,
            d = typeof b === c;
        if (d) {
            b = b.replace(N, z);
        }
        if (typeof a === "object") {
            e = typeof a.className === c;
            a = A.extend({}, A.watermark.options, a);
        } else {
            if (typeof a === c) {
                e = B;
                a = A.extend({}, A.watermark.options, {
                    className: a
                });
            } else {
                a = A.watermark.options;
            }
        }
        if (typeof a.useNative !== Q) {
            a.useNative = a.useNative ? function () {
                return B;
            } : function () {
                return D;
            };
        }
        return this.each(function () {
            var o = "dragleave",
                n = "dragenter",
                g = this,
                j = A(g);
            if (!j.is(R)) {
                return;
            }
            if (j.data(L)) {
                if (d || e) {
                    A.watermark._hide(j);
                    d && j.data(E, b);
                    e && j.data(H, a.className);
                }
            } else {
                if (Y && a.useNative.call(g, j) && (j.attr("tagName") || z) !== "TEXTAREA") {
                    d && j.attr(P, b);
                    return;
                }
                j.data(E, d ? b : z);
                j.data(H, a.className);
                j.data(L, 1);
                if ((j.attr(F) || z) === K) {
                    var h = j.wrap("<span>").parent(),
                        k = A(h.html().replace(/type=["']?password["']?/i, 'type="text"'));
                    k.data(E, j.data(E));
                    k.data(H, j.data(H));
                    k.data(L, 1);
                    k.attr(C, b.length);
                    k.focus(function () {
                        A.watermark._hide(k, B);
                    }).bind(n, function () {
                        A.watermark._hide(k);
                    }).bind("dragend", function () {
                        J.setTimeout(function () {
                            k.blur();
                        }, 1);
                    });
                    j.blur(function () {
                        A.watermark._show(j);
                    }).bind(o, function () {
                        A.watermark._show(j);
                    });
                    k.data(G, j);
                    j.data(G, k);
                } else {
                    j.focus(function () {
                        j.data(U, 1);
                        A.watermark._hide(j, B);
                    }).blur(function () {
                        j.data(U, 0);
                        A.watermark._show(j);
                    }).bind(n, function () {
                        A.watermark._hide(j);
                    }).bind(o, function () {
                        A.watermark._show(j);
                    }).bind("dragend", function () {
                        J.setTimeout(function () {
                            A.watermark._show(j);
                        }, 1);
                    }).bind("drop", function (s) {
                        var q = j[0],
                            p = s.originalEvent.dataTransfer.getData("Text");
                        if ((q.value || z).replace(N, z).replace(p, z) === j.data(E)) {
                            q.value = p;
                        }
                        j.focus();
                    });
                }
                if (g.form) {
                    var l = g.form,
                        f = A(l);
                    if (!f.data(O)) {
                        f.submit(A.watermark.hideAll);
                        if (l.submit) {
                            f.data(O, l.submit);
                            l.submit = function (q, p) {
                                return function () {
                                    var s = p.data(O);
                                    A.watermark.hideAll();
                                    if (s.apply) {
                                        s.apply(q, Array.prototype.slice.call(arguments));
                                    } else {
                                        s();
                                    }
                                };
                            }(l, f);
                        } else {
                            f.data(O, 1);
                            l.submit = function (p) {
                                return function () {
                                    A.watermark.hideAll();
                                    delete p.submit;
                                    p.submit();
                                };
                            }(l);
                        }
                    }
                }
            }
            A.watermark._show(j);
        });
    };
    if (A.watermark.runOnce) {
        A.watermark.runOnce = D;
        A.extend(A.expr[":"], {
            search: function (a) {
                return "search" === (a.type || z);
            },
            data: function (e, f, b) {
                return !!A.data(e, b[3]);
            }
        });
        (function (a) {
            A.fn.val = function () {
                var b = this;
                if (!b.length) {
                    return arguments.length ? b : Z;
                }
                if (!arguments.length) {
                    if (b.data(L)) {
                        var c = (b[0].value || z).replace(N, z);
                        return c === (b.data(E) || z) ? z : c;
                    } else {
                        return a.apply(b, arguments);
                    }
                } else {
                    a.apply(b, arguments);
                    A.watermark.show(b);
                    return b;
                }
            };
        })(A.fn.val);
        T.length && A(function () {
            for (var b, e, f = T.length - 1; f >= 0; f--) {
                b = T[f];
                e = J[b];
                if (typeof e === Q) {
                    J[b] = function (c) {
                        return function () {
                            A.watermark.hideAll();
                            return c.apply(null, Array.prototype.slice.call(arguments));
                        };
                    }(e);
                }
            }
        });
        A(J).bind("beforeunload", function () {
            A.watermark.options.hideBeforeUnload && A.watermark.hideAll();
        });
    }
})(jQuery, window);


(function (J, ak) {
    var Z, ag = Array.prototype.slice,
        am = decodeURIComponent,
        K = J.param,
        ac, P, af, ar, N = J.bbq = J.bbq || {}, al, aq, ad, T = J.event.special,
        R = "hashchange",
        O = "querystring",
        W = "fragment",
        at = "elemUrlAttr",
        ae = "href",
        ap = "src",
        ai = /^.*\?|#.*$/g,
        an, aa, X, ab, Q, U = {};

    function Y(a) {
        return typeof a === "string";
    }
    function S(b) {
        var a = ag.call(arguments, 1);
        return function () {
            return b.apply(this, a.concat(ag.call(arguments)));
        };
    }
    function ah(a) {
        return a.replace(aa, "$2");
    }
    function aj(a) {
        return a.replace(/(?:^[^?#]*\?([^#]*).*$)?.*/, "$1");
    }
    function V(c, h, a, d, b) {
        var k, g, f, j, e;
        if (d !== Z) {
            f = a.match(c ? aa : /^([^#?]*)\??([^#]*)(#?.*)/);
            e = f[3] || "";
            if (b === 2 && Y(d)) {
                g = d.replace(c ? an : ai, "");
            } else {
                j = af(f[2]);
                d = Y(d) ? af[c ? W : O](d) : d;
                g = b === 2 ? d : b === 1 ? J.extend({}, d, j) : J.extend({}, j, d);
                g = ac(g);
                if (c) {
                    g = g.replace(X, am);
                }
            }
            k = f[1] + (c ? Q : g || !f[1] ? "?" : "") + g + e;
        } else {
            k = h(a !== Z ? a : location.href);
        }
        return k;
    }
    K[O] = S(V, 0, aj);
    K[W] = P = S(V, 1, ah);
    K.sorted = ac = function (b, c) {
        var a = [],
            d = {};
        J.each(K(b, c).split("&"), function (h, e) {
            var g = e.replace(/(?:%5B|=).*$/, ""),
                f = d[g];
            if (!f) {
                f = d[g] = [];
                a.push(g);
            }
            f.push(e);
        });
        return J.map(a.sort(), function (e) {
            return d[e];
        }).join("&");
    };
    P.noEscape = function (b) {
        b = b || "";
        var a = J.map(b.split(""), encodeURIComponent);
        X = new RegExp(a.join("|"), "g");
    };
    P.noEscape(",/");
    P.ajaxCrawlable = function (a) {
        if (a !== Z) {
            if (a) {
                an = /^.*(?:#!|#)/;
                aa = /^([^#]*)(?:#!|#)?(.*)$/;
                Q = "#!";
            } else {
                an = /^.*#/;
                aa = /^([^#]*)#?(.*)$/;
                Q = "#";
            }
            ab = !! a;
        }
        return ab;
    };
    P.ajaxCrawlable(0);
    J.deparam = af = function (d, a) {
        var c = {}, b = {
            "true": !0,
            "false": !1,
            "null": null
        };
        J.each(d.replace(/\+/g, " ").split("&"), function (g, n) {
            var f = n.split("="),
                l = am(f[0]),
                e, k = c,
                h = 0,
                o = l.split("]["),
                j = o.length - 1;
            if (/\[/.test(o[0]) && /\]$/.test(o[j])) {
                o[j] = o[j].replace(/\]$/, "");
                o = o.shift().split("[").concat(o);
                j = o.length - 1;
            } else {
                j = 0;
            }
            if (f.length === 2) {
                e = am(f[1]);
                if (a) {
                    e = e && !isNaN(e) ? +e : e === "undefined" ? Z : b[e] !== Z ? b[e] : e;
                }
                if (j) {
                    for (; h <= j; h++) {
                        l = o[h] === "" ? k.length : o[h];
                        k = k[l] = h < j ? k[l] || (o[h + 1] && isNaN(o[h + 1]) ? {} : []) : e;
                    }
                } else {
                    if (J.isArray(c[l])) {
                        c[l].push(e);
                    } else {
                        if (c[l] !== Z) {
                            c[l] = [c[l], e];
                        } else {
                            c[l] = e;
                        }
                    }
                }
            } else {
                if (l) {
                    c[l] = a ? Z : "";
                }
            }
        });
        return c;
    };

    function L(c, a, b) {
        if (a === Z || typeof a === "boolean") {
            b = a;
            a = K[c ? W : O]();
        } else {
            a = Y(a) ? a.replace(c ? an : ai, "") : a;
        }
        return af(a, b);
    }
    af[O] = S(L, 0);
    af[W] = ar = S(L, 1);
    J[at] || (J[at] = function (a) {
        return J.extend(U, a);
    })({
        a: ae,
        base: ae,
        iframe: ap,
        img: ap,
        input: ap,
        form: "action",
        link: ae,
        script: ap
    });
    ad = J[at];

    function ao(d, b, c, a) {
        if (!Y(c) && typeof c !== "object") {
            a = c;
            c = b;
            b = Z;
        }
        return this.each(function () {
            var g = J(this),
                e = b || ad()[(this.nodeName || "").toLowerCase()] || "",
                f = e && g.attr(e) || "";
            g.attr(e, K[d](f, c, a));
        });
    }
    J.fn[O] = S(ao, O);
    J.fn[W] = S(ao, W);
    N.pushState = al = function (d, a) {
        if (Y(d) && /^#/.test(d) && a === Z) {
            a = 2;
        }
        var c = d !== Z,
            b = P(location.href, c ? d : {}, c ? a : 2);
        location.href = b;
    };
    N.getState = aq = function (a, b) {
        return a === Z || typeof a === "boolean" ? ar(a) : ar(b)[a];
    };
    N.removeState = function (a) {
        var b = {};
        if (a !== Z) {
            b = aq();
            J.each(J.isArray(a) ? a : arguments, function (d, c) {
                delete b[c];
            });
        }
        al(b, 2);
    };
    T[R] = J.extend(T[R], {
        add: function (a) {
            var c;

            function b(e) {
                var d = e[W] = P();
                e.getState = function (f, g) {
                    return f === Z || typeof f === "boolean" ? af(d, f) : af(d, g)[f];
                };
                c.apply(this, arguments);
            }
            if (J.isFunction(a)) {
                c = a;
                return b;
            } else {
                c = a.handler;
                a.handler = b;
            }
        }
    });
})(jQuery, this);


(function (j, p, l) {
    var n = "hashchange",
        t = document,
        q, s = j.event.special,
        u = t.documentMode,
        o = "on" + n in p && (u === l || u > 7);

    function k(a) {
        a = a || location.href;
        return "#" + a.replace(/^[^#]*#?(.*)$/, "$1");
    }
    j.fn[n] = function (a) {
        return a ? this.bind(n, a) : this.trigger(n);
    };
    j.fn[n].delay = 50;
    s[n] = j.extend(s[n], {
        setup: function () {
            if (o) {
                return false;
            }
            j(q.start);
        },
        teardown: function () {
            if (o) {
                return false;
            }
            j(q.stop);
        }
    });
    q = (function () {
        var a = {}, g, d = k(),
            b = function (h) {
                return h;
            }, c = b,
            f = b;
        a.start = function () {
            g || e();
        };
        a.stop = function () {
            g && clearTimeout(g);
            g = l;
        };

        function e() {
            var v = k(),
                h = f(d);
            if (v !== d) {
                c(d = v, h);
                j(p).trigger(n);
            } else {
                if (h !== d) {
                    location.href = location.href.replace(/#.*/, "") + h;
                }
            }
            g = setTimeout(e, j.fn[n].delay);
        }
        j.browser.msie && !o && (function () {
            var h, v;
            a.start = function () {
                if (!h) {
                    v = j.fn[n].src;
                    v = v && v + k();
                    h = j('<iframe tabindex="-1" title="empty"/>').hide().one("load", function () {
                        v || c(k());
                        e();
                    }).attr("src", v || "javascript:0").insertAfter("body")[0].contentWindow;
                    t.onpropertychange = function () {
                        try {
                            if (event.propertyName === "title") {
                                h.document.title = t.title;
                            }
                        } catch (w) {}
                    };
                }
            };
            a.stop = b;
            f = function () {
                return k(h.location.href);
            };
            c = function (z, w) {
                var y = h.document,
                    x = j.fn[n].domain;
                if (z !== w) {
                    y.title = t.title;
                    y.open();
                    x && y.write('<script>document.domain="' + x + '"</script>');
                    y.close();
                    h.location.hash = z;
                }
            };
        })();
        return a;
    })();
})(jQuery, this);