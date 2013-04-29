
(function () {
    var b = false,
        a = /xyz/.test(function () {
            xyz;
        }) ? /\b_super\b/ : /.*/;
    this.Class = function () {};
    Class.extend = function (f) {
        var c = this.prototype;
        b = true;
        var g = new this();
        b = false;
        for (var e in f) {
            g[e] = typeof f[e] == "function" && typeof c[e] == "function" && a.test(f[e]) ? (function (j, h) {
                return function () {
                    var l = this._super;
                    this._super = c[j];
                    var k = h.apply(this, arguments);
                    this._super = l;
                    return k;
                };
            })(e, f[e]) : f[e];
        }
        function d() {
            if (!b && this.init) {
                this.init.apply(this, arguments);
            }
        }
        d.prototype = g;
        d.prototype.constructor = d;
        d.extend = arguments.callee;
        return d;
    };
})();