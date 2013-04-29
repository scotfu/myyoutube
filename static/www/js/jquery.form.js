/*
 * jQuery Form Plugin
 * version: 2.47 (04-SEP-2010)
 * @requires jQuery v1.3.2 or later
 *
 * Examples and documentation at: http://malsup.com/jquery/form/
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */;
(function (a) {
    a.fn.ajaxSubmit = function (s) {
        if (!this.length) {
            b("ajaxSubmit: skipping submit process - no element selected");
            return this;
        }
        if (typeof s == "function") {
            s = {
                success: s
            };
        }
        var u = a.trim(this.attr("action"));
        if (u) {
            u = (u.match(/^([^#]+)/) || [])[1];
        }
        u = u || window.location.href || "";
        s = a.extend(true, {
            url: u,
            type: this.attr("method") || "GET",
            iframeSrc: /^https/i.test(window.location.href || "") ? "javascript:false" : "about:blank"
        }, s);
        var x = {};
        this.trigger("form-pre-serialize", [this, s, x]);
        if (x.veto) {
            b("ajaxSubmit: submit vetoed via form-pre-serialize trigger");
            return this;
        }
        if (s.beforeSerialize && s.beforeSerialize(this, s) === false) {
            b("ajaxSubmit: submit aborted via beforeSerialize callback");
            return this;
        }
        var o, w, d = this.formToArray(s.semantic);
        if (s.data) {
            s.extraData = s.data;
            for (o in s.data) {
                if (s.data[o] instanceof Array) {
                    for (var h in s.data[o]) {
                        d.push({
                            name: o,
                            value: s.data[o][h]
                        });
                    }
                } else {
                    w = s.data[o];
                    w = a.isFunction(w) ? w() : w;
                    d.push({
                        name: o,
                        value: w
                    });
                }
            }
        }
        if (s.beforeSubmit && s.beforeSubmit(d, this, s) === false) {
            b("ajaxSubmit: submit aborted via beforeSubmit callback");
            return this;
        }
        this.trigger("form-submit-validate", [d, this, s, x]);
        if (x.veto) {
            b("ajaxSubmit: submit vetoed via form-submit-validate trigger");
            return this;
        }
        var t = a.param(d);
        if (s.type.toUpperCase() == "GET") {
            s.url += (s.url.indexOf("?") >= 0 ? "&" : "?") + t;
            s.data = null;
        } else {
            s.data = t;
        }
        var c = this,
            e = [];
        if (s.resetForm) {
            e.push(function () {
                c.resetForm();
            });
        }
        if (s.clearForm) {
            e.push(function () {
                c.clearForm();
            });
        }
        if (!s.dataType && s.target) {
            var p = s.success || function () {};
            e.push(function (k) {
                var n = s.replaceTarget ? "replaceWith" : "html";
                a(s.target)[n](k).each(p, arguments);
            });
        } else {
            if (s.success) {
                e.push(s.success);
            }
        }
        s.success = function (n, y, z) {
            var k = s.context || s;
            for (var q = 0, v = e.length; q < v; q++) {
                e[q].apply(k, [n, y, z || c, c]);
            }
        };
        var f = a("input:file", this).length > 0;
        var j = "multipart/form-data";
        var l = (c.attr("enctype") == j || c.attr("encoding") == j);
        if (s.iframe !== false && (f || s.iframe || l)) {
            if (s.closeKeepAlive) {
                a.get(s.closeKeepAlive, g);
            } else {
                g();
            }
        } else {
            a.ajax(s);
        }
        this.trigger("form-submit-notify", [this, s]);
        return this;

        function g() {
            var D = c[0];
            if (a(":input[name=submit],:input[id=submit]", D).length) {
                return;
            }
            var J = a.extend(true, {}, a.ajaxSettings, s);
            J.context = J.context || J;
            var F = "jqFormIO" + (new Date().getTime()),
                C = "_" + F;
            window[C] = function () {
                var P = k.data("form-plugin-onload");
                if (P) {
                    P();
                    window[C] = undefined;
                    try {
                        delete window[C];
                    } catch (n) {}
                }
            };
            var k = a('<iframe id="' + F + '" name="' + F + '" src="' + J.iframeSrc + '" onload="window[\'_\'+this.id]()" />');
            var G = k[0];
            k.css({
                position: "absolute",
                top: "-1000px",
                left: "-1000px"
            });
            var O = {
                aborted: 0,
                responseText: null,
                responseXML: null,
                status: 0,
                statusText: "n/a",
                getAllResponseHeaders: function () {},
                getResponseHeader: function () {},
                setRequestHeader: function () {},
                abort: function () {
                    this.aborted = 1;
                    k.attr("src", J.iframeSrc);
                }
            };
            var E = J.global;
            if (E && !a.active++) {
                a.event.trigger("ajaxStart");
            }
            if (E) {
                a.event.trigger("ajaxSend", [O, J]);
            }
            if (J.beforeSend && J.beforeSend.call(J.context, O, J) === false) {
                if (J.global) {
                    a.active--;
                }
                return;
            }
            if (O.aborted) {
                return;
            }
            var v = false;
            var L = 0;
            var K = D.clk;
            if (K) {
                var H = K.name;
                if (H && !K.disabled) {
                    J.extraData = J.extraData || {};
                    J.extraData[H] = K.value;
                    if (K.type == "image") {
                        J.extraData[H + ".x"] = D.clk_x;
                        J.extraData[H + ".y"] = D.clk_y;
                    }
                }
            }
            function B() {
                var S = c.attr("target"),
                    P = c.attr("action");
                D.setAttribute("target", F);
                if (D.getAttribute("method") != "POST") {
                    D.setAttribute("method", "POST");
                }
                if (D.getAttribute("action") != J.url) {
                    D.setAttribute("action", J.url);
                }
                if (!J.skipEncodingOverride) {
                    c.attr({
                        encoding: "multipart/form-data",
                        enctype: "multipart/form-data"
                    });
                }
                if (J.timeout) {
                    setTimeout(function () {
                        L = true;
                        q();
                    }, J.timeout);
                }
                var Q = [];
                try {
                    if (J.extraData) {
                        for (var R in J.extraData) {
                            Q.push(a('<input type="hidden" name="' + R + '" value="' + J.extraData[R] + '" />').appendTo(D)[0]);
                        }
                    }
                    k.appendTo("body");
                    k.data("form-plugin-onload", q);
                    D.submit();
                } finally {
                    D.setAttribute("action", P);
                    if (S) {
                        D.setAttribute("target", S);
                    } else {
                        c.removeAttr("target");
                    }
                    a(Q).remove();
                }
            }
            if (J.forceSync) {
                B();
            } else {
                setTimeout(B, 10);
            }
            var y, z, A = 50;

            function q() {
                if (v) {
                    return;
                }
                k.removeData("form-plugin-onload");
                var Q = true;
                try {
                    if (L) {
                        throw "timeout";
                    }
                    z = G.contentWindow ? G.contentWindow.document : G.contentDocument ? G.contentDocument : G.document;
                    var P = J.dataType == "xml" || z.XMLDocument || a.isXMLDoc(z);
                    b("isXml=" + P);
                    if (!P && window.opera && (z.body == null || z.body.innerHTML == "")) {
                        if (--A) {
                            b("requeing onLoad callback, DOM not available");
                            setTimeout(q, 250);
                            return;
                        }
                    }
                    v = true;
                    O.responseText = z.documentElement ? z.documentElement.innerHTML : null;
                    O.responseXML = z.XMLDocument ? z.XMLDocument : z;
                    O.getResponseHeader = function (U) {
                        var V = {
                            "content-type": J.dataType
                        };
                        return V[U];
                    };
                    var S = /(json|script)/.test(J.dataType);
                    if (S || J.textarea) {
                        var T = z.getElementsByTagName("textarea")[0];
                        if (T) {
                            O.responseText = T.value;
                        } else {
                            if (S) {
                                var R = z.getElementsByTagName("pre")[0];
                                if (R) {
                                    O.responseText = R.innerHTML;
                                }
                            }
                        }
                    } else {
                        if (J.dataType == "xml" && !O.responseXML && O.responseText != null) {
                            O.responseXML = N(O.responseText);
                        }
                    }
                    y = a.httpData(O, J.dataType);
                } catch (n) {
                    b("error caught:", n);
                    Q = false;
                    O.error = n;
                    a.handleError(J, O, "error", n);
                }
                if (Q) {
                    J.success.call(J.context, y, "success", O);
                    if (E) {
                        a.event.trigger("ajaxSuccess", [O, J]);
                    }
                }
                if (E) {
                    a.event.trigger("ajaxComplete", [O, J]);
                }
                if (E && !--a.active) {
                    a.event.trigger("ajaxStop");
                }
                if (J.complete) {
                    J.complete.call(J.context, O, Q ? "success" : "error");
                }
                setTimeout(function () {
                    k.removeData("form-plugin-onload");
                    k.remove();
                    O.responseXML = null;
                }, 100);
            }
            function N(P, n) {
                if (window.ActiveXObject) {
                    n = new ActiveXObject("Microsoft.XMLDOM");
                    n.async = "false";
                    n.loadXML(P);
                } else {
                    n = (new DOMParser()).parseFromString(P, "text/xml");
                }
                return (n && n.documentElement && n.documentElement.tagName != "parsererror") ? n : null;
            }
        }
    };
    a.fn.ajaxForm = function (d) {
        if (this.length === 0) {
            var c = {
                s: this.selector,
                c: this.context
            };
            if (!a.isReady && c.s) {
                b("DOM not ready, queuing ajaxForm");
                a(function () {
                    a(c.s, c.c).ajaxForm(d);
                });
                return this;
            }
            b("terminating; zero elements found by selector" + (a.isReady ? "" : " (DOM not ready)"));
            return this;
        }
        return this.ajaxFormUnbind().bind("submit.form-plugin", function (f) {
            if (!f.isDefaultPrevented()) {
                f.preventDefault();
                a(this).ajaxSubmit(d);
            }
        }).bind("click.form-plugin", function (g) {
            var l = g.target;
            var f = a(l);
            if (!(f.is(":submit,input:image"))) {
                var k = f.closest(":submit");
                if (k.length == 0) {
                    return;
                }
                l = k[0];
            }
            var h = this;
            h.clk = l;
            if (l.type == "image") {
                if (g.offsetX != undefined) {
                    h.clk_x = g.offsetX;
                    h.clk_y = g.offsetY;
                } else {
                    if (typeof a.fn.offset == "function") {
                        var j = f.offset();
                        h.clk_x = g.pageX - j.left;
                        h.clk_y = g.pageY - j.top;
                    } else {
                        h.clk_x = g.pageX - l.offsetLeft;
                        h.clk_y = g.pageY - l.offsetTop;
                    }
                }
            }
            setTimeout(function () {
                h.clk = h.clk_x = h.clk_y = null;
            }, 100);
        });
    };
    a.fn.ajaxFormUnbind = function () {
        return this.unbind("submit.form-plugin click.form-plugin");
    };
    a.fn.formToArray = function (p) {
        var d = [];
        if (this.length === 0) {
            return d;
        }
        var g = this[0];
        var f = p ? g.getElementsByTagName("*") : g.elements;
        if (!f) {
            return d;
        }
        var h, l, o, q, e;
        for (h = 0, max = f.length; h < max; h++) {
            e = f[h];
            o = e.name;
            if (!o) {
                continue;
            }
            if (p && g.clk && e.type == "image") {
                if (!e.disabled && g.clk == e) {
                    d.push({
                        name: o,
                        value: a(e).val()
                    });
                    d.push({
                        name: o + ".x",
                        value: g.clk_x
                    }, {
                        name: o + ".y",
                        value: g.clk_y
                    });
                }
                continue;
            }
            q = a.fieldValue(e, true);
            if (q && q.constructor == Array) {
                for (l = 0, jmax = q.length; l < jmax; l++) {
                    d.push({
                        name: o,
                        value: q[l]
                    });
                }
            } else {
                if (q !== null && typeof q != "undefined") {
                    d.push({
                        name: o,
                        value: q
                    });
                }
            }
        }
        if (!p && g.clk) {
            var c = a(g.clk),
                k = c[0];
            o = k.name;
            if (o && !k.disabled && k.type == "image") {
                d.push({
                    name: o,
                    value: c.val()
                });
                d.push({
                    name: o + ".x",
                    value: g.clk_x
                }, {
                    name: o + ".y",
                    value: g.clk_y
                });
            }
        }
        return d;
    };
    a.fn.formSerialize = function (c) {
        return a.param(this.formToArray(c));
    };
    a.fn.fieldSerialize = function (d) {
        var c = [];
        this.each(function () {
            var g = this.name;
            if (!g) {
                return;
            }
            var h = a.fieldValue(this, d);
            if (h && h.constructor == Array) {
                for (var e = 0, f = h.length; e < f; e++) {
                    c.push({
                        name: g,
                        value: h[e]
                    });
                }
            } else {
                if (h !== null && typeof h != "undefined") {
                    c.push({
                        name: this.name,
                        value: h
                    });
                }
            }
        });
        return a.param(c);
    };
    a.fn.fieldValue = function (f) {
        for (var h = [], d = 0, e = this.length; d < e; d++) {
            var c = this[d];
            var g = a.fieldValue(c, f);
            if (g === null || typeof g == "undefined" || (g.constructor == Array && !g.length)) {
                continue;
            }
            g.constructor == Array ? a.merge(h, g) : h.push(g);
        }
        return h;
    };
    a.fieldValue = function (d, o) {
        var h = d.name,
            p = d.type,
            q = d.tagName.toLowerCase();
        if (o === undefined) {
            o = true;
        }
        if (o && (!h || d.disabled || p == "reset" || p == "button" || (p == "checkbox" || p == "radio") && !d.checked || (p == "submit" || p == "image") && d.form && d.form.clk != d || q == "select" && d.selectedIndex == -1)) {
            return null;
        }
        if (q == "select") {
            var f = d.selectedIndex;
            if (f < 0) {
                return null;
            }
            var c = [],
                l = d.options;
            var j = (p == "select-one");
            var g = (j ? f + 1 : l.length);
            for (var e = (j ? f : 0); e < g; e++) {
                var k = l[e];
                if (k.selected) {
                    var s = k.value;
                    if (!s) {
                        s = (k.attributes && k.attributes.value && !(k.attributes.value.specified)) ? k.text : k.value;
                    }
                    if (j) {
                        return s;
                    }
                    c.push(s);
                }
            }
            return c;
        }
        return a(d).val();
    };
    a.fn.clearForm = function () {
        return this.each(function () {
            a("input,select,textarea", this).clearFields();
        });
    };
    a.fn.clearFields = a.fn.clearInputs = function () {
        return this.each(function () {
            var c = this.type,
                d = this.tagName.toLowerCase();
            if (c == "text" || c == "password" || d == "textarea") {
                this.value = "";
            } else {
                if (c == "checkbox" || c == "radio") {
                    this.checked = false;
                } else {
                    if (d == "select") {
                        this.selectedIndex = -1;
                    }
                }
            }
        });
    };
    a.fn.resetForm = function () {
        return this.each(function () {
            if (typeof this.reset == "function" || (typeof this.reset == "object" && !this.reset.nodeType)) {
                this.reset();
            }
        });
    };
    a.fn.enable = function (c) {
        if (c === undefined) {
            c = true;
        }
        return this.each(function () {
            this.disabled = !c;
        });
    };
    a.fn.selected = function (c) {
        if (c === undefined) {
            c = true;
        }
        return this.each(function () {
            var e = this.type;
            if (e == "checkbox" || e == "radio") {
                this.checked = c;
            } else {
                if (this.tagName.toLowerCase() == "option") {
                    var d = a(this).parent("select");
                    if (c && d[0] && d[0].type == "select-one") {
                        d.find("option").selected(false);
                    }
                    this.selected = c;
                }
            }
        });
    };

    function b() {
        if (a.fn.ajaxSubmit.debug) {
            var c = "[jquery.form] " + Array.prototype.join.call(arguments, "");
            if (window.console && window.console.log) {
                window.console.log(c);
            } else {
                if (window.opera && window.opera.postError) {
                    window.opera.postError(c);
                }
            }
        }
    }
})(jQuery);
(function (a) {
    a.fn.swipe = function (c) {
        var b = {
            threshold: {
                x: 10,
                y: 10
            },
            swipeLeft: function () {},
            swipeRight: function () {}
        };
        var c = a.extend(b, c);
        if (!this) {
            return false;
        }
        return this.each(function () {
            var e = a(this);
            var f = {
                x: 0,
                y: 0
            };
            var d = {
                x: 0,
                y: 0
            };

            function k(l) {
                f.x = l.targetTouches[0].pageX;
                f.y = l.targetTouches[0].pageY;
            }
            function j(l) {
                l.preventDefault();
                d.x = l.targetTouches[0].pageX;
                d.y = l.targetTouches[0].pageY;
            }
            function h(n) {
                var l = f.y - d.y;
                changeX = f.x - d.x;
                if (changeX > b.threshold.x) {
                    b.swipeLeft();
                }
                if (changeX < (b.threshold.x * -1)) {
                    b.swipeRight();
                }
            }
            function k(l) {
                f.x = l.targetTouches[0].pageX;
                f.y = l.targetTouches[0].pageY;
                d.x = f.x;
                d.y = f.y;
            }
            function g(l) {}
            this.addEventListener("touchstart", k, false);
            this.addEventListener("touchmove", j, false);
            this.addEventListener("touchend", h, false);
            this.addEventListener("touchcancel", g, false);
        });
    };
})(jQuery);
(function (a) {
    a.fn.slideCenterToLeft = function (b) {
        a(this).animate({
            left: -a(window).width()
        }, b, function () {
            a(this).hide();
        });
    };
    a.fn.slideCenterToRight = function (b) {
        a(this).animate({
            left: a(window).width()
        }, b, function () {
            a(this).hide();
        });
    };
    a.fn.slideLeftToCenter = function (b) {
        a(this).css("left", - a(window).width()).show().animate({
            left: 0
        }, b);
    };
    a.fn.slideRightToCenter = function (b) {
        a(this).css("left", a(window).width()).show().animate({
            left: 0
        }, b);
    };
})(jQuery);