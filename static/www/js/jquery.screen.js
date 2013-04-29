var focusScreen, loadScreen, reloadScreen, getAbsoluteUrl, getScreenUrl, navigateTo, currentScreen = false,
    currentScreenLoaded, currentScreenHash, prevScreen, navigateBack, isReload, isBack, params, backButtonHandler, initScreenHandler, onResumeApp, screenHistory = [];
screenInstanceData = {};
seScreen = {};
Screen = function (a) {
    this.jScreen = $(renderEjs("screen_item", {}));
    this.displaceForSafari = device.is("iphone") && !device.isStandalone() && (device.platform != 'native');
    console.log('shifting to the bottom');
    if (this.displaceForSafari) {
        this.jScreen.find("#screenContainer").css({
            "min-height": $(window).height() + device.getSafariNavBarHeight()
        });
    }
    this.jGlobalComponents = this.jScreen.find("#globalComponents");
    this.toast = new SEToast();
    this.toast.load(this.jGlobalComponents);
    this.history = [];
    this.navigationBar = new NavigationBar(this.jScreen);
    this.jContent = this.jScreen.find("#content");
    a.append(this.jScreen);
    this.activityIndicator = new ActivityIndicator(a);
    this.screenDataStore = {};
    this.hooks = $("<div></div>");
    var b = this;
    $(document).bind("userLogIn userLogOut", function () {
        if (b.history.length > 1) {
            for (var d = b.history.length - 2; d >= 0; d--) {
                var c = b.history[d];
                if (c.screenObj) {
                    c.screenObj.unload(c.params);
                    delete c.screenObj;
                }
                if (c.jCanvas) {
                    c.jCanvas.empty();
                    delete c.jCanvas;
                }
            }
        }
        setAndroidOptionsMenu();
    });
    
    
};
Screen.prototype.showSplash = function (a) {
    this.jContent.html(a);
};
Screen.prototype.getWindowHeight = function () {
    if (this.displaceForSafari) {
        return $(window).height() + device.getSafariNavBarHeight();
    }
    return $(window).height();
};
Screen.prototype.deleteCachedCanvases = function (a) {
    a = a || 1000;
    if (this.history.length > 1) {
        for (var c = this.history.length - 2; c >= 0 && a > 0; c--, a--) {
            var b = this.history[c];
            if (b.jCanvas) {
                b.jCanvas.empty();
                delete b.jCanvas;
            }
        }
    }
};
Screen.prototype.onOrientationChange = function () {
    this.deleteCachedCanvases();
    if (this.displaceForSafari) {
        this.jScreen.find("#screenContainer").css({
            "min-height": $(window).height() + device.getSafariNavBarHeight()
        });
    }
    if (this.currentScreen) {
        this.currentScreen.onOrientationChange();
    }
};
Screen.prototype.showToast = function (a) {
    this.toast.showToast(a);
};
Screen.prototype.getPersistantData = function (e, b, a) {
    var c = false;
    var d = this.screenDataStore;
    if (!d[e]) {
        if (a) {
            d[e] = {};
            d[e][a] = {};
            c = d[e][a];
        } else {
            d[e] = {};
            c = d[e];
        }
    } else {
        if (a) {
            if (!d[e][a]) {
                d[e][a] = {};
            }
            c = d[e][a];
        } else {
            c = d[e];
        }
    }
    $.extend(b, c);
    $.extend(c, b);
    return c;
};
Screen.prototype.screenData = function (b) {
    var c = $.extend({
        stepsBack: 0,
        defaultData: {},
        compartmentId: undefined
    }, b);
    var a = this.history[this.history.length - 1 - c.stepsBack];
    if (a) {
        return this.getPersistantData(a.hash, c.defaultData, c.compartmentId);
    }
};
Screen.prototype.hashChange = function (b) {
    if (!b) {
        return;
    }
    var a = (this.history[this.history.length - 1] || {}).hash;
    var e = (this.history[this.history.length - 2] || {}).hash;
    var c = b;
    var d = paramsToObject(c.substring(1)) || {};
    if (e == c) {
        this._back();
    } else {
        if (a == c) {
            return;
        } else {
            device.call("system/pageChange", {});
            this.load({
                hash: c,
                params: d
            });
        }
    }
};
Screen.prototype.reload = function (b) {
    if (this.loading) {
        return;
    }
    network.clearCache();
    if (this.currentScreen.reload) {
        this.currentScreen.reload();
    } else {
        this._clearHistory(1);
        var a = location.hash;
        var c = paramsToObject(a.substring(1));
        if (b && b.params) {
            var d = c._;
            c = b.params;
            c._ = d;
        }
        this.load({
            hash: a,
            params: c,
            isReload: true
        });
    }
};
Screen.prototype.back = function (d, a) {
    if (this.currentScreen && !this.currentScreen.backAllowed) {
        return;
    }
    var c = $.extend({
        reload: false,
        pageYOffset: false
    }, a);
    this._clearHistory(d - 1);
    if (this.history.length < 2) {
        navigateTo("home");
    } else {
        var b = this.history[this.history.length - 2] || {};
        if (c.reload) {
            b.reload = true;
        }
        if (c.pageYOffset !== false) {
            b.scrollYOffset = c.pageYOffset;
        }
        //if (device.is("pc") && $.browser.webkit) {   // changed this to fix issue with Motorola phone
        if (device.is("pc") || $.browser.webkit) {
            if (b && b.hash) {
                location.hash = b.hash;
            }
        } else {
            history.go(d * -1);
        }
    }
};
Screen.prototype.markCurrentScreen = function (b) {
    b = b || "mark";
    var a = this.history[this.history.length - 1];
    if (a) {
        a.mark = b;
    }
};
Screen.prototype.backToMark = function (d) {
    var b = d.mark || "mark";
    var e = 0;
    var c = false;
    for (var a = this.history.length - 2; a >= 0; a--) {
        e++;
        if (b === this.history[a].mark) {
            c = true;
            break;
        }
    }
    if (c) {
        this.back(e, d);
    } else {
        navigateBack(1, d);
    }
};
Screen.prototype._clearHistory = function (a) {
    for (var c = 0; c < a; c++) {
        var b = this.history[this.history.length - 1];
        if (!b) {
            break;
        }
        if (b.screenObj) {
            b.screenObj.willDisappear(b.params, b.jCanvas);
            b.screenObj.unload(b.params);
            b.screenObj.didDisappear(b.params);
            delete b.screenObj;
        }
        if (b.jCanvas) {
            b.jCanvas.empty();
        }
        this.history.pop();
    }
};
Screen.prototype._clearResources = function () {
    this.navigationBar.removeAdditions();
    this.navigationBar.removeButtons();
    this.activityIndicator.clear();
    network.abortRequests();
};
Screen.prototype._back = function (a) {
    window.scrollTo(0, window.pageYOffset);
    device.call("ui/hideKeyboard");
    this.loading = true;
    this.hooks.trigger("screenLoad", [this.loading]);
    this._clearHistory(1);
    var c = this.history[this.history.length - 1];
    if (!c.jCanvas || !c.screenObj || c.reload || (c.screenObj && !c.screenObj.isCacheable())) {
        c.reload = false;
        this._clearHistory(1);
        this.load({
            isBack: true,
            hash: c.hash,
            params: c.params
        });
        if (c.scrollYOffset) {
            window.scrollTo(0, c.scrollYOffset);
        }
        return;
    }
    var b = paramsToObject(c.hash.substring(1));
    var d = {
        params: b,
        isBack: true,
        isReload: false,
    };
    this._clearResources();
    this.currentScreen = c.screenObj;
    c.screenObj.willAppear(d);
    c.jCanvas.find(".se-active").removeClass("se-active");
    this.navigationBar.clearActiveButtons();
    this.jContent.html(c.jCanvas);
    c.screenObj.didAppear(d, c.jCanvas);
    if (typeof (c.scrollYOffset) != "undefined") {
        window.scrollTo(0, c.scrollYOffset);
        delete c.scrollYOffset;
    }
    this.loading = false;
    this.hooks.trigger("screenLoad", [this.loading]);
};

Screen.prototype.load = function (d) {
    this.loading = true;
    this.hooks.trigger("screenLoad", [this.loading, d]);
    var k = $.extend({
        params: {},
        isBack: false,
        isReload: false
    }, d);
    var e = this.history[this.history.length - 1];
    if (!k.isReload && e && e.screenObj && e.jCanvas) {
        if (typeof (e.scrollYOffset) == "undefined") {
            e.scrollYOffset = window.pageYOffset;
        }
        e.screenObj.willDisappear(e.params, e.jCanvas);
        e.jCanvas.detach();
        e.screenObj.didDisappear(e.params);
    }
    this._clearResources();
    var b = {
        hash: d.hash,
        params: k.params
    };
    this.history.push(b);
    var g = seScreen["create" + k.params._];
    console.log(g);
    if (typeof (g) === "function") {
        var h = g(k);
    } else {
        console.log(k.params._);
        var f = seScreen[k.params._];
        var h = new f(k);
    }
    if (!k.isReload && !k.isBack) {
        var j = "/" + h.getScreenUrl(d);

    }
    this.currentScreen = h;
    console.debug("Loading screen " + k.params._);
    this.jContent.empty();
    this.jContent.html($("<div id='rendered-content'></div>"));
    var c = this.jContent.find("#rendered-content");
    if (this.displaceForSafari) {
        window.scrollTo(0, device.getSafariNavBarHeight());
    } else {
        window.scrollTo(0, 0);
    }
    device.call("ui/hideKeyboard");
    var a = h.authentication(k);
    if (a) {
        h = a;
        this.authenticationScreenObject = h;
        h.willAppear(k);
        h.load(c, k);
        h.didAppear(k, c);
    } else {
        delete this.authenticationScreenObject;
        h.willAppear(k);
        h.load(c, k);
        h.didAppear(k, c);
        b.screenObj = this.currentScreen;
        b.jCanvas = c;
    }
    this.loading = false;
    this.hooks.trigger("screenLoad", [this.loading, d]);
};

function markCurrentScreen(a) {
    se.markCurrentScreen(a);
}
function navigateBackToMark(a) {
    se.backToMark(a);
}(function (a) {
    a.screen = {};
    var c, d;

    function f() {
        se.hashChange(location.hash);
    }
    initScreenHandler = function () {
        f();
        if ("onhashchange" in window) {
            console.debug("On hashe change set");
            window.onhashchange = f;
        } else {
            setInterval(f, 600);
        }
    };
    onResumeApp = function () {};
    var b;
    getAbsoluteUrl = function (j) {
        if (b === undefined) {
            var h = location.href.indexOf("#");
            b = h != -1 ? location.href.substring(0, h) : location.href;
        }
        var k = b;
        if (j) {
            k = b.replace(/index\.html/, j);
        }
        return k;
    };
    reloadScreen = function (h) {
        se.reload(h);
    };
    sanitizeParams = function (j) {
        if (j == null) {
            return null;
        }
        if (typeof (j) == "object") {
            for (var h in j) {
                if (typeof (j[h]) == "object") {
                    j[h] = sanitizeParams(j[h]);
                } else {
                    j[h] = encodeURIComponent(j[h]);
                }
                if (typeof (j[h]) == "undefined") {
                    delete j[h];
                }
            }
            return j;
        }
        return encodeURIComponent(j);
    };
    getScreenUrl = function (k, j, h) {
        j = j || {};
        j._ = k;
        j = sanitizeParams(j);
        return (h ? getAbsoluteUrl() : "") + "#" + a.param(j);
    };
    navigateTo = function (k, j) {
        if (k) {
            var h = k.charAt(0) == "#" ? k : getScreenUrl(k, j);
            setLocationHash(h);
        }
    };
    setLocationHash = function (h) {
        location.hash = h;
    };
    navigateBack = function (j, h) {
        se.back(j, h);
    };
    var g = "onorientationchange" in window,
        e = g ? "orientationchange" : "resize";
    a(window).bind(e, function () {
        if (g) {
            se.onOrientationChange();
        } else {
            if (d) {
                clearTimeout(d);
            }
            d = setTimeout(function () {
                se.onOrientationChange();
            }, 300);
        }
    });
})(jQuery);