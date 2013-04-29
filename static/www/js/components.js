seComponents = {};
var ComponentBase = Class.extend({
    init: function (b) {
        if (b) {
            this.cls = b.cls || this.cls;
            this.baseTag = b.baseTag || this.baseTag || "div";
        } else {
            this.baseTag = "div";
        }
        this.children = [];
        this.uuid = new Date().getTime();
        this.jContent = $("<" + this.baseTag + "></" + this.baseTag + ">");
        this.jContent.addClass(this.baseCls);
        this.jContent.addClass(this.cls);
        if (b && b.items) {
            for (var a = 0; a < b.items.length; a++) {
                this.addChild(b.items[a], b);
            }
        }
    },
    anchorContent: function (a) {
        if (a) {
            this.jAnchor = a;
        }
        this.jAnchor.append(this.jContent);
    },
    postponeAnchorContent: function (a, b) {
        this.jAnchor = a;
        this.options = b;
    },
    load: function (a, b) {
        this.anchorContent(a);
    },
    wrapperForChild: function (b) {
        if (b) {
            var a = $("<" + b + "></" + b + ">");
            this.jContent.append(a);
            return a;
        }
        return this.jContent;
    },
    addChild: function (a, b, c) {
        if (!b) {
            b = this.options;
        }
        this.children.push(a);
        a.willAppear(b);
        a.load(this.wrapperForChild(c), b);
        a.didAppear(b);
        return a;
    },
    willAppear: function (a) {
        callMethod(this.children, "willAppear", [a]);
    },
    didAppear: function (b, a) {
        callMethod(this.children, "didAppear", [b, a]);
    },
    willDisappear: function (b, a) {
        callMethod(this.children, "willDisappear", [b, a]);
    },
    didDisappear: function (a) {
        callMethod(this.children, "didDisappear", [a]);
    },
    unload: function (a) {
        callMethod(this.children, "unload", [a]);
    },
    hide: function () {
        this.jContent.hide();
    },
    show: function () {
        this.jContent.show();
    },
    css: function (a) {
        return this.jContent.css(a);
    },
    baseCls: "",
    cls: "",
    padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    },
    setPadding: function (a) {
        var b = $extend(this.padding, a);
        this.jContent.css({
            padding: b.top + "px " + b.right + "px " + b.bottom + "px " + b.left + "px"
        });
        this.padding = b;
    }
});
ScreenBase = ComponentBase.extend({
    init: function () {
        this._super();
        this.showNavigationBar = true;
        this.showAndroidOptionsMenu = false;
    },
    setTitle: function (b) {
        if (b) {
            var a = $(renderEjs("title_bar_item", {
                title: b
            }));
            se.navigationBar.addAddition(a, 25);
        }
    },
    willAppear: function (a) {
        if (this.showNavigationBar) {
            se.navigationBar.show();
        } else {
            se.navigationBar.hide();
        }
        if (this.title) {
            this.setTitle(this.title);
        }
        if (this.showAndroidOptionsMenu) {
            setAndroidOptionsMenu();
        }
        this._super(a);
    },
    getScreenUrl: function (a) {
        return a.params._;
    },
    load: function (a, b) {
        a.append(this.jContent);
    },
    layoutChildren: function () {
        callMethod(this.children, "willAppear", [options]);
        callMethod(this.children, "load", [jContent, options]);
        callMethod(this.children, "didAppear", [options]);
    },
    addSeparator: function (a) {
        this.addChild(new SESeparator(a));
    },
    isCacheable: function () {
        return true;
    },
    onOrientationChange: function () {},
    authRealm: false,
    paymentRealm: false,
    backAllowed: true,
    authentication: function () {
        var b = this.paymentRealm,
            a = this.authRealm;
        if (!RobotfruitApp.getContentSubscribtionModule()) {
            b = false;
        }
        if (!(device.platform === "native" && device.name === "android")) {
            b = false;
        }
        if (a && !user.authenticated(a)) {
            return new seScreen.network_login({
                params: {
                    authServer: a,
                    onAuthenticate: function () {
                        reloadScreen();
                    }
                }
            });
        } else {
            return false;
        }
    }
});
SEHLayout = ComponentBase.extend({
    init: function (b) {
        var a = $.extend({
            percentages: [50, 50]
        }, b);
        this.percentages = a.percentages;
        this._super(b);
    },
    addChild: function (a, c, b) {
        var b = (typeof (b) === "number") ? b : (this.children.length % this.percentages.length);
        a.css({
            display: "inline-block",
            width: this.percentages[b] + "%"
        });
        this._super(a, c);
    }
});
SECardLayout = ComponentBase.extend({
    init: function (b) {
        var a = $.extend({
            lazyLoad: true,
            activeCardNum: 0,
            lazyLoad: true
        }, b);
        $.extend(this, a);
        this._super(b);
        this.cards = [];
    },
    unload: function (b) {
        for (var a = 0; a < this.cards.length; a++) {
            this.cards[a].component.unload(b);
        }
        this.cards.length = 0;
    },
    addCard: function (b, c) {
        var a = {
            loaded: false,
            component: b,
            jAnchor: $("<div></div>")
        };
        this.cards.push(a);
        if (!this.lazyLoad) {
            b.load(a.jAnchor, c);
            a.loaded = true;
        }
    },
    load: function (a, b) {
        this.postponeAnchorContent(b);
        if (typeof (this.activeCard) == "undefined") {
            this.setCard(this.activeCardNum);
        }
        this.anchorContent(a);
    },
    setCard: function (b) {
        this.activeCardNum = b;
        var a = this.cards[this.activeCardNum];
        if (typeof (this.activeCard) !== "undefined") {
            this.unloadCard(this.activeCard);
        }
        this.activeCard = a;
        this.loadCard(this.activeCard);
    },
    unloadCard: function (a) {
        var b = a.component;
        b.willDisappear(this.options);
        a.jAnchor.detach();
        b.didDisappear(this.options);
    },
    loadCard: function (a) {
        var c = this.options;
        var b = a.component;
        b.willAppear(c);
        if (!a.loaded) {
            b.load(a.jAnchor, c);
            a.loaded = true;
        }
        this.jContent.html(b.jAnchor);
        b.didAppear(c);
        this.children.length = 0;
        this.children.push(b);
    },
});