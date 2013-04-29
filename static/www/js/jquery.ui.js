/*
 * jQuery UI 1.8.6
 *
 * Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI
 */ (function (a, b) {
    function d(c) {
        return !a(c).parents().andSelf().filter(function () {
            return a.curCSS(this, "visibility") === "hidden" || a.expr.filters.hidden(this);
        }).length;
    }
    a.ui = a.ui || {};
    if (!a.ui.version) {
        a.extend(a.ui, {
            version: "1.8.6",
            keyCode: {
                ALT: 18,
                BACKSPACE: 8,
                CAPS_LOCK: 20,
                COMMA: 188,
                COMMAND: 91,
                COMMAND_LEFT: 91,
                COMMAND_RIGHT: 93,
                CONTROL: 17,
                DELETE: 46,
                DOWN: 40,
                END: 35,
                ENTER: 13,
                ESCAPE: 27,
                HOME: 36,
                INSERT: 45,
                LEFT: 37,
                MENU: 93,
                NUMPAD_ADD: 107,
                NUMPAD_DECIMAL: 110,
                NUMPAD_DIVIDE: 111,
                NUMPAD_ENTER: 108,
                NUMPAD_MULTIPLY: 106,
                NUMPAD_SUBTRACT: 109,
                PAGE_DOWN: 34,
                PAGE_UP: 33,
                PERIOD: 190,
                RIGHT: 39,
                SHIFT: 16,
                SPACE: 32,
                TAB: 9,
                UP: 38,
                WINDOWS: 91
            }
        });
        a.fn.extend({
            _focus: a.fn.focus,
            focus: function (c, e) {
                return typeof c === "number" ? this.each(function () {
                    var f = this;
                    setTimeout(function () {
                        a(f).focus();
                        e && e.call(f);
                    }, c);
                }) : this._focus.apply(this, arguments);
            },
            scrollParent: function () {
                var c;
                c = a.browser.msie && /(static|relative)/.test(this.css("position")) || /absolute/.test(this.css("position")) ? this.parents().filter(function () {
                    return /(relative|absolute|fixed)/.test(a.curCSS(this, "position", 1)) && /(auto|scroll)/.test(a.curCSS(this, "overflow", 1) + a.curCSS(this, "overflow-y", 1) + a.curCSS(this, "overflow-x", 1));
                }).eq(0) : this.parents().filter(function () {
                    return /(auto|scroll)/.test(a.curCSS(this, "overflow", 1) + a.curCSS(this, "overflow-y", 1) + a.curCSS(this, "overflow-x", 1));
                }).eq(0);
                return /fixed/.test(this.css("position")) || !c.length ? a(document) : c;
            },
            zIndex: function (c) {
                if (c !== b) {
                    return this.css("zIndex", c);
                }
                if (this.length) {
                    c = a(this[0]);
                    for (var e; c.length && c[0] !== document;) {
                        e = c.css("position");
                        if (e === "absolute" || e === "relative" || e === "fixed") {
                            e = parseInt(c.css("zIndex"), 10);
                            if (!isNaN(e) && e !== 0) {
                                return e;
                            }
                        }
                        c = c.parent();
                    }
                }
                return 0;
            },
            disableSelection: function () {
                return this.bind((a.support.selectstart ? "selectstart" : "mousedown") + ".ui-disableSelection", function (c) {
                    c.preventDefault();
                });
            },
            enableSelection: function () {
                return this.unbind(".ui-disableSelection");
            }
        });
        a.each(["Width", "Height"], function (c, f) {
            function g(e, h, n, o) {
                a.each(j, function () {
                    h -= parseFloat(a.curCSS(e, "padding" + this, true)) || 0;
                    if (n) {
                        h -= parseFloat(a.curCSS(e, "border" + this + "Width", true)) || 0;
                    }
                    if (o) {
                        h -= parseFloat(a.curCSS(e, "margin" + this, true)) || 0;
                    }
                });
                return h;
            }
            var j = f === "Width" ? ["Left", "Right"] : ["Top", "Bottom"],
                k = f.toLowerCase(),
                l = {
                    innerWidth: a.fn.innerWidth,
                    innerHeight: a.fn.innerHeight,
                    outerWidth: a.fn.outerWidth,
                    outerHeight: a.fn.outerHeight
                };
            a.fn["inner" + f] = function (e) {
                if (e === b) {
                    return l["inner" + f].call(this);
                }
                return this.each(function () {
                    a(this).css(k, g(this, e) + "px");
                });
            };
            a.fn["outer" + f] = function (e, h) {
                if (typeof e !== "number") {
                    return l["outer" + f].call(this, e);
                }
                return this.each(function () {
                    a(this).css(k, g(this, e, true, h) + "px");
                });
            };
        });
        a.extend(a.expr[":"], {
            data: function (c, e, f) {
                return !!a.data(c, f[3]);
            },
            focusable: function (c) {
                var e = c.nodeName.toLowerCase(),
                    f = a.attr(c, "tabindex");
                if ("area" === e) {
                    e = c.parentNode;
                    f = e.name;
                    if (!c.href || !f || e.nodeName.toLowerCase() !== "map") {
                        return false;
                    }
                    c = a("img[usemap=#" + f + "]")[0];
                    return !!c && d(c);
                }
                return (/input|select|textarea|button|object/.test(e) ? !c.disabled : "a" == e ? c.href || !isNaN(f) : !isNaN(f)) && d(c);
            },
            tabbable: function (c) {
                var e = a.attr(c, "tabindex");
                return (isNaN(e) || e >= 0) && a(c).is(":focusable");
            }
        });
        a(function () {
            var c = document.body,
                e = c.appendChild(e = document.createElement("div"));
            a.extend(e.style, {
                minHeight: "100px",
                height: "auto",
                padding: 0,
                borderWidth: 0
            });
            a.support.minHeight = e.offsetHeight === 100;
            a.support.selectstart = "onselectstart" in e;
            c.removeChild(e).style.display = "none";
        });
        a.extend(a.ui, {
            plugin: {
                add: function (c, f, g) {
                    c = a.ui[c].prototype;
                    for (var h in g) {
                        c.plugins[h] = c.plugins[h] || [];
                        c.plugins[h].push([f, g[h]]);
                    }
                },
                call: function (c, f, g) {
                    if ((f = c.plugins[f]) && c.element[0].parentNode) {
                        for (var h = 0; h < f.length; h++) {
                            c.options[f[h][0]] && f[h][1].apply(c.element, g);
                        }
                    }
                }
            },
            contains: function (c, e) {
                return document.compareDocumentPosition ? c.compareDocumentPosition(e) & 16 : c !== e && c.contains(e);
            },
            hasScroll: function (c, e) {
                if (a(c).css("overflow") === "hidden") {
                    return false;
                }
                e = e && e === "left" ? "scrollLeft" : "scrollTop";
                var f = false;
                if (c[e] > 0) {
                    return true;
                }
                c[e] = 1;
                f = c[e] > 0;
                c[e] = 0;
                return f;
            },
            isOverAxis: function (c, e, f) {
                return c > e && c < e + f;
            },
            isOver: function (c, f, g, j, k, l) {
                return a.ui.isOverAxis(c, g, k) && a.ui.isOverAxis(f, j, l);
            }
        });
    }
})(jQuery);