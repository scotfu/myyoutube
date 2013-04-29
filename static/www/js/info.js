// made the change to js framework
function InfoBubble(a) {
    this.extend(InfoBubble, google.maps.OverlayView);
    this.tabs_ = [];
    this.activeTab_ = null;
    this.baseZIndex_ = 100;
    this.isOpen_ = false;
    var b = a || {};
    if (b.backgroundColor == undefined) {
        b.backgroundColor = this.BACKGROUND_COLOR_;
    }
    if (b.borderColor == undefined) {
        b.borderColor = this.BORDER_COLOR_;
    }
    if (b.borderRadius == undefined) {
        b.borderRadius = this.BORDER_RADIUS_;
    }
    if (b.borderWidth == undefined) {
        b.borderWidth = this.BORDER_WIDTH_;
    }
    if (b.padding == undefined) {
        b.padding = this.PADDING_;
    }
    if (b.arrowPosition == undefined) {
        b.arrowPosition = this.ARROW_POSITION_;
    }
    if (b.disableAutoPan == undefined) {
        b.disableAutoPan = false;
    }
    if (b.disableAnimation == undefined) {
        b.disableAnimation = false;
    }
    if (b.minWidth == undefined) {
        b.minWidth = this.MIN_WIDTH_;
    }
    if (b.shadowStyle == undefined) {
        b.shadowStyle = this.SHADOW_STYLE_;
    }
    if (b.arrowSize == undefined) {
        b.arrowSize = this.ARROW_SIZE_;
    }
    if (b.arrowStyle == undefined) {
        b.arrowStyle = this.ARROW_STYLE_;
    }
    this.buildDom_();
    this.setValues(b);
}
window.InfoBubble = InfoBubble;
InfoBubble.prototype.ARROW_SIZE_ = 15;
InfoBubble.prototype.ARROW_STYLE_ = 0;
InfoBubble.prototype.SHADOW_STYLE_ = 1;
InfoBubble.prototype.MIN_WIDTH_ = 50;
InfoBubble.prototype.ARROW_POSITION_ = 50;
InfoBubble.prototype.PADDING_ = 10;
InfoBubble.prototype.BORDER_WIDTH_ = 1;
InfoBubble.prototype.BORDER_COLOR_ = "#ccc";
InfoBubble.prototype.BORDER_RADIUS_ = 10;
InfoBubble.prototype.BACKGROUND_COLOR_ = "#fff";
InfoBubble.prototype.extend = function (a, b) {
    return (function (c) {
        for (var d in c.prototype) {
            this.prototype[d] = c.prototype[d];
        }
        return this;
    }).apply(a, [b]);
};
InfoBubble.prototype.buildDom_ = function () {
    var e = this.bubble_ = document.createElement("DIV");
    e.style.position = "absolute";
    e.style.zIndex = this.baseZIndex_;
    var n = this.tabsContainer_ = document.createElement("DIV");
    n.style.position = "relative";
    var g = this.close_ = document.createElement("IMG");
    g.style.position = "absolute";
    g.style.width = this.px(12);
    g.style.height = this.px(12);
    g.style.border = 0;
    g.style.zIndex = this.baseZIndex_ + 1;
    g.style.cursor = "pointer";
    g.src = "http://maps.gstatic.com/intl/en_us/mapfiles/iw_close.gif";
    var o = this;
    google.maps.event.addDomListener(g, "click", function () {
        o.close();
        google.maps.event.trigger(o, "closeclick");
    });
    var j = this.contentContainer_ = document.createElement("DIV");
    j.style.overflowX = "auto";
    j.style.overflowY = "auto";
    j.style.cursor = "default";
    j.style.clear = "both";
    j.style.position = "relative";
    var h = this.content_ = document.createElement("DIV");
    j.appendChild(h);
    var a = this.arrow_ = document.createElement("DIV");
    a.style.position = "relative";
    var c = this.arrowOuter_ = document.createElement("DIV");
    var b = this.arrowInner_ = document.createElement("DIV");
    var d = this.getArrowSize_();
    c.style.position = b.style.position = "absolute";
    c.style.left = b.style.left = "50%";
    c.style.height = b.style.height = "0";
    c.style.width = b.style.width = "0";
    c.style.marginLeft = this.px(-d);
    c.style.borderWidth = this.px(d);
    c.style.borderBottomWidth = 0;
    var f = this.bubbleShadow_ = document.createElement("DIV");
    f.style.position = "absolute";
    e.style.display = f.style.display = "none";
    e.appendChild(this.tabsContainer_);
    e.appendChild(g);
    e.appendChild(j);
    a.appendChild(c);
    a.appendChild(b);
    e.appendChild(a);
    var l = document.createElement("style");
    l.setAttribute("type", "text/css");
    this.animationName_ = "_ibani_" + Math.round(Math.random() * 10000);
    var k = "." + this.animationName_ + "{-webkit-animation-name:" + this.animationName_ + ";-webkit-animation-duration:0.5s;-webkit-animation-iteration-count:1;}@-webkit-keyframes " + this.animationName_ + " {from {-webkit-transform: scale(0)}50% {-webkit-transform: scale(1.2)}90% {-webkit-transform: scale(0.95)}to {-webkit-transform: scale(1)}}";
    l.textContent = k;
    document.getElementsByTagName("head")[0].appendChild(l);
};

InfoBubble.prototype.setBackgroundClassName = function (a) {
    this.set("backgroundClassName", a);
};
InfoBubble.prototype.setBackgroundClassName = InfoBubble.prototype.setBackgroundClassName;
InfoBubble.prototype.backgroundClassName_changed = function () {
    this.content_.className = this.get("backgroundClassName");
};
InfoBubble.prototype.backgroundClassName_changed = InfoBubble.prototype.backgroundClassName_changed;
InfoBubble.prototype.setTabClassName = function (a) {
    this.set("tabClassName", a);
};
InfoBubble.prototype.setTabClassName = InfoBubble.prototype.setTabClassName;
InfoBubble.prototype.tabClassName_changed = function () {
    this.updateTabStyles_();
};
InfoBubble.prototype.tabClassName_changed = InfoBubble.prototype.tabClassName_changed;
InfoBubble.prototype.getArrowStyle_ = function () {
    return parseInt(this.get("arrowStyle"), 10) || 0;
};
InfoBubble.prototype.setArrowStyle = function (a) {
    this.set("arrowStyle", a);
};
InfoBubble.prototype.setArrowStyle = InfoBubble.prototype.setArrowStyle;
InfoBubble.prototype.arrowStyle_changed = function () {
    this.arrowSize_changed();
};
InfoBubble.prototype.arrowStyle_changed = InfoBubble.prototype.arrowStyle_changed;
InfoBubble.prototype.getArrowSize_ = function () {
    return parseInt(this.get("arrowSize"), 10) || 0;
};
InfoBubble.prototype.setArrowSize = function (a) {
    this.set("arrowSize", a);
};
InfoBubble.prototype.setArrowSize = InfoBubble.prototype.setArrowSize;
InfoBubble.prototype.arrowSize_changed = function () {
    this.borderWidth_changed();
};
InfoBubble.prototype.arrowSize_changed = InfoBubble.prototype.arrowSize_changed;
InfoBubble.prototype.setArrowPosition = function (a) {
    this.set("arrowPosition", a);
};
InfoBubble.prototype.setArrowPosition = InfoBubble.prototype.setArrowPosition;
InfoBubble.prototype.getArrowPosition_ = function () {
    return parseInt(this.get("arrowPosition"), 10) || 0;
};
InfoBubble.prototype.arrowPosition_changed = function () {
    var a = this.getArrowPosition_();
    this.arrowOuter_.style.left = this.arrowInner_.style.left = a + "%";
    this.redraw_();
};
InfoBubble.prototype.arrowPosition_changed = InfoBubble.prototype.arrowPosition_changed;
InfoBubble.prototype.setZIndex = function (a) {
    this.set("zIndex", a);
};
InfoBubble.prototype.setZIndex = InfoBubble.prototype.setZIndex;
InfoBubble.prototype.getZIndex = function () {
    return parseInt(this.get("zIndex"), 10) || this.baseZIndex_;
};
InfoBubble.prototype.zIndex_changed = function () {
    var a = this.getZIndex_();
    this.bubble_.style.zIndex = this.baseZIndex_ = a;
    this.close_.style.zIndex = zIndex_ + 1;
};
InfoBubble.prototype.zIndex_changed = InfoBubble.prototype.zIndex_changed;
InfoBubble.prototype.setShadowStyle = function (a) {
    this.set("shadowStyle", a);
};
InfoBubble.prototype.setShadowStyle = InfoBubble.prototype.setShadowStyle;
InfoBubble.prototype.getShadowStyle_ = function () {
    return parseInt(this.get("shadowStyle"), 10) || 0;
};
InfoBubble.prototype.shadowStyle_changed = function () {
    var d = this.getShadowStyle_();
    var b = "";
    var c = "";
    var a = "";
    switch (d) {
    case 0:
        b = "none";
        break;
    case 1:
        c = "40px 15px 10px rgba(33,33,33,0.3)";
        a = "transparent";
        break;
    case 2:
        c = "0 0 2px rgba(33,33,33,0.3)";
        a = "rgba(33,33,33,0.35)";
        break;
    }
    this.bubbleShadow_.style.boxShadow = this.bubbleShadow_.style.webkitBoxShadow = this.bubbleShadow_.style.MozBoxShadow = c;
    this.bubbleShadow_.style.backgroundColor = a;
    if (this.isOpen_) {
        this.bubbleShadow_.style.display = b;
        this.draw();
    }
};
InfoBubble.prototype.shadowStyle_changed = InfoBubble.prototype.shadowStyle_changed;
InfoBubble.prototype.showCloseButton = function () {
    this.set("hideCloseButton", false);
};
InfoBubble.prototype.showCloseButton = InfoBubble.prototype.showCloseButton;
InfoBubble.prototype.hideCloseButton = function () {
    this.set("hideCloseButton", true);
};
InfoBubble.prototype.hideCloseButton = InfoBubble.prototype.hideCloseButton;
InfoBubble.prototype.hideCloseButton_changed = function () {
    this.close_.style.display = this.get("hideCloseButton") ? "none" : "";
};
InfoBubble.prototype.hideCloseButton_changed = InfoBubble.prototype.hideCloseButton_changed;
InfoBubble.prototype.setBackgroundColor = function (a) {
    if (a) {
        this.set("backgroundColor", a);
    }
};
InfoBubble.prototype.setBackgroundColor = InfoBubble.prototype.setBackgroundColor;
InfoBubble.prototype.backgroundColor_changed = function () {
    var a = this.get("backgroundColor");
    this.contentContainer_.style.backgroundColor = a;
    this.arrowInner_.style.borderColor = a + " transparent transparent";
    this.updateTabStyles_();
};
InfoBubble.prototype.backgroundColor_changed = InfoBubble.prototype.backgroundColor_changed;
InfoBubble.prototype.setBorderColor = function (a) {
    if (a) {
        this.set("borderColor", a);
    }
};
InfoBubble.prototype.setBorderColor = InfoBubble.prototype.setBorderColor;
InfoBubble.prototype.borderColor_changed = function () {
    var b = this.get("borderColor");
    var c = this.contentContainer_;
    var a = this.arrowOuter_;
    c.style.borderColor = b;
    a.style.borderColor = b + " transparent transparent";
    c.style.borderStyle = a.style.borderStyle = this.arrowInner_.style.borderStyle = "solid";
    this.updateTabStyles_();
};
InfoBubble.prototype.borderColor_changed = InfoBubble.prototype.borderColor_changed;
InfoBubble.prototype.setBorderRadius = function (a) {
    this.set("borderRadius", a);
};
InfoBubble.prototype.setBorderRadius = InfoBubble.prototype.setBorderRadius;
InfoBubble.prototype.getBorderRadius_ = function () {
    return parseInt(this.get("borderRadius"), 10) || 0;
};
InfoBubble.prototype.borderRadius_changed = function () {
    var a = this.getBorderRadius_();
    var b = this.getBorderWidth_();
    this.contentContainer_.style.borderRadius = this.contentContainer_.style.MozBorderRadius = this.contentContainer_.style.webkitBorderRadius = this.bubbleShadow_.style.borderRadius = this.bubbleShadow_.style.MozBorderRadius = this.bubbleShadow_.style.webkitBorderRadius = this.px(a);
    this.tabsContainer_.style.paddingLeft = this.tabsContainer_.style.paddingRight = this.px(a + b);
    this.redraw_();
};
InfoBubble.prototype.borderRadius_changed = InfoBubble.prototype.borderRadius_changed;
InfoBubble.prototype.getBorderWidth_ = function () {
    return parseInt(this.get("borderWidth"), 10) || 0;
};
InfoBubble.prototype.setBorderWidth = function (a) {
    this.set("borderWidth", a);
};
InfoBubble.prototype.setBorderWidth = InfoBubble.prototype.setBorderWidth;
InfoBubble.prototype.borderWidth_changed = function () {
    var a = this.getBorderWidth_();
    this.contentContainer_.style.borderWidth = this.px(a);
    this.tabsContainer_.style.top = this.px(a);
    this.updateArrowStyle_();
    this.updateTabStyles_();
    this.borderRadius_changed();
    this.redraw_();
};
InfoBubble.prototype.borderWidth_changed = InfoBubble.prototype.borderWidth_changed;
InfoBubble.prototype.updateArrowStyle_ = function () {
    var e = this.getBorderWidth_();
    var c = this.getArrowSize_();
    var d = this.getArrowStyle_();
    var b = this.px(c);
    var a = this.px(Math.max(0, c - e));
    var g = this.arrowOuter_;
    var f = this.arrowInner_;
    this.arrow_.style.marginTop = this.px(-e);
    g.style.borderTopWidth = b;
    f.style.borderTopWidth = a;
    if (d == 0 || d == 1) {
        g.style.borderLeftWidth = b;
        f.style.borderLeftWidth = a;
    } else {
        g.style.borderLeftWidth = f.style.borderLeftWidth = 0;
    }
    if (d == 0 || d == 2) {
        g.style.borderRightWidth = b;
        f.style.borderRightWidth = a;
    } else {
        g.style.borderRightWidth = f.style.borderRightWidth = 0;
    }
    if (d < 2) {
        g.style.marginLeft = this.px(-(c));
        f.style.marginLeft = this.px(-(c - e));
    } else {
        g.style.marginLeft = f.style.marginLeft = 0;
    }
    if (e == 0) {
        g.style.display = "none";
    } else {
        g.style.display = "";
    }
};
InfoBubble.prototype.setPadding = function (a) {
    this.set("padding", a);
};
InfoBubble.prototype.setPadding = InfoBubble.prototype.setPadding;
InfoBubble.prototype.getPadding_ = function () {
    return parseInt(this.get("padding"), 10) || 0;
};
InfoBubble.prototype.padding_changed = function () {
    var a = this.getPadding_();
    this.contentContainer_.style.padding = this.px(a);
    this.updateTabStyles_();
    this.redraw_();
};
InfoBubble.prototype.padding_changed = InfoBubble.prototype.padding_changed;
InfoBubble.prototype.px = function (a) {
    if (a) {
        return a + "px";
    }
    return a;
};
InfoBubble.prototype.addEvents_ = function () {
    var c = ["mousedown", "mousemove", "mouseover", "mouseout", "mouseup", "mousewheel", "DOMMouseScroll", "touchstart", "touchend", "touchmove", "dblclick", "contextmenu", "click"];
    var a = this.bubble_;
    this.listeners_ = [];
    for (var d = 0, b; b = c[d]; d++) {
        this.listeners_.push(google.maps.event.addDomListener(a, b, function (f) {
            f.cancelBubble = true;
            if (f.stopPropagation) {
                f.stopPropagation();
            }
        }));
    }
};
InfoBubble.prototype.onAdd = function () {
    if (!this.bubble_) {
        this.buildDom_();
    }
    this.addEvents_();
    var a = this.getPanes();
    if (a) {
        a.floatPane.appendChild(this.bubble_);
        a.floatShadow.appendChild(this.bubbleShadow_);
    }
};
InfoBubble.prototype.onAdd = InfoBubble.prototype.onAdd;
InfoBubble.prototype.draw = function () {
    var h = this.getProjection();
    if (!h) {
        return;
    }
    var e = (this.get("position"));
    if (!e) {
        this.close();
        return;
    }
    var k = 0;
    if (this.activeTab_) {
        k = this.activeTab_.offsetHeight;
    }
    var a = this.getAnchorHeight_();
    var c = this.getArrowSize_();
    var b = this.getArrowPosition_();
    b = b / 100;
    var g = h.fromLatLngToDivPixel(e);
    var n = this.contentContainer_.offsetWidth;
    var d = this.bubble_.offsetHeight;
    if (!n) {
        return;
    }
    var l = g.y - (d + c);
    if (a) {
        l -= a;
    }
    var f = g.x - (n * b);
    this.bubble_.style.top = this.px(l);
    this.bubble_.style.left = this.px(f);
    var j = parseInt(this.get("shadowStyle"), 10);
    switch (j) {
    case 1:
        this.bubbleShadow_.style.top = this.px(l + k - 1);
        this.bubbleShadow_.style.left = this.px(f);
        this.bubbleShadow_.style.width = this.px(n);
        this.bubbleShadow_.style.height = this.px(this.contentContainer_.offsetHeight - c);
        break;
    case 2:
        n = n * 0.8;
        if (a) {
            this.bubbleShadow_.style.top = this.px(g.y);
        } else {
            this.bubbleShadow_.style.top = this.px(g.y + c);
        }
        this.bubbleShadow_.style.left = this.px(g.x - n * b);
        this.bubbleShadow_.style.width = this.px(n);
        this.bubbleShadow_.style.height = this.px(2);
        break;
    }
};
InfoBubble.prototype.draw = InfoBubble.prototype.draw;
InfoBubble.prototype.onRemove = function () {
    if (this.bubble_ && this.bubble_.parentNode) {
        this.bubble_.parentNode.removeChild(this.bubble_);
    }
    if (this.bubbleShadow_ && this.bubbleShadow_.parentNode) {
        this.bubbleShadow_.parentNode.removeChild(this.bubbleShadow_);
    }
    for (var a = 0, b; b = this.listeners_[a]; a++) {
        google.maps.event.removeListener(b);
    }
};
InfoBubble.prototype.onRemove = InfoBubble.prototype.onRemove;
InfoBubble.prototype.isOpen = function () {
    return this.isOpen_;
};
InfoBubble.prototype.isOpen = InfoBubble.prototype.isOpen;
InfoBubble.prototype.close = function () {
    if (this.bubble_) {
        this.bubble_.style.display = "none";
        this.bubble_.className = this.bubble_.className.replace(this.animationName_, "");
    }
    if (this.bubbleShadow_) {
        this.bubbleShadow_.style.display = "none";
        this.bubbleShadow_.className = this.bubbleShadow_.className.replace(this.animationName_, "");
    }
    this.isOpen_ = false;
};
InfoBubble.prototype.close = InfoBubble.prototype.close;
InfoBubble.prototype.open = function (c, b) {
    if (c) {
        this.setMap(c);
    }
    if (b) {
        this.set("anchor", b);
        this.bindTo("position", b);
    }
    this.bubble_.style.display = this.bubbleShadow_.style.display = "";
    var a = !! !this.get("disableAnimation");
    if (a) {
        this.bubble_.className += " " + this.animationName_;
        this.bubbleShadow_.className += " " + this.animationName_;
    }
    this.redraw_();
    this.isOpen_ = true;
    var d = !! !this.get("disableAutoPan");
    if (d) {
        var e = this;
        window.setTimeout(function () {
            e.panToView();
        }, 200);
    }
};
InfoBubble.prototype.open = InfoBubble.prototype.open;
InfoBubble.prototype.setPosition = function (a) {
    if (a) {
        this.set("position", a);
    }
};
InfoBubble.prototype.setPosition = InfoBubble.prototype.setPosition;
InfoBubble.prototype.getPosition = function () {
    return (this.get("position"));
};
InfoBubble.prototype.getPosition = InfoBubble.prototype.getPosition;
InfoBubble.prototype.position_changed = function () {
    this.draw();
};
InfoBubble.prototype.position_changed = InfoBubble.prototype.position_changed;
InfoBubble.prototype.panToView = function () {
    var l = this.getProjection();
    if (!l) {
        return;
    }
    if (!this.bubble_) {
        return;
    }
    var a = this.getAnchorHeight_();
    var d = this.bubble_.offsetHeight + a;
    var f = this.get("map");
    var g = f.getDiv();
    var h = g.offsetHeight;
    var e = this.getPosition();
    var b = l.fromLatLngToContainerPixel(f.getCenter());
    var k = l.fromLatLngToContainerPixel(e);
    var o = b.y - d;
    var n = h - b.y;
    var j = o < 0;
    var c = 0;
    if (j) {
        o *= -1;
        c = (o + n) / 2;
    }
    k.y -= c;
    e = l.fromContainerPixelToLatLng(k);
    if (f.getCenter() != e) {
        f.panTo(e);
    }
};
InfoBubble.prototype.panToView = InfoBubble.prototype.panToView;
InfoBubble.prototype.htmlToDocumentFragment_ = function (b) {
    b = b.replace(/^\s*([\S\s]*)\b\s*$/, "$1");
    var c = document.createElement("DIV");
    c.innerHTML = b;
    if (c.childNodes.length == 1) {
        return (c.removeChild(c.firstChild));
    } else {
        var a = document.createDocumentFragment();
        while (c.firstChild) {
            a.appendChild(c.firstChild);
        }
        return a;
    }
};
InfoBubble.prototype.removeChildren_ = function (b) {
    if (!b) {
        return;
    }
    var a;
    while (a = b.firstChild) {
        b.removeChild(a);
    }
};
InfoBubble.prototype.setContent = function (a) {
    this.set("content", a);
};
InfoBubble.prototype.setContent = InfoBubble.prototype.setContent;
InfoBubble.prototype.getContent = function () {
    return (this.get("content"));
};
InfoBubble.prototype.getContent = InfoBubble.prototype.getContent;
InfoBubble.prototype.content_changed = function () {
    if (!this.content_) {
        return;
    }
    this.removeChildren_(this.content_);
    var a = this.getContent();
    if (a) {
        if (typeof a == "string") {
            a = this.htmlToDocumentFragment_(a);
        }
        this.content_.appendChild(a);
        var e = this;
        var d = this.content_.getElementsByTagName("IMG");
        for (var b = 0, c; c = d[b]; b++) {
            google.maps.event.addDomListener(c, "load", function () {
                e.imageLoaded_();
            });
        }
        google.maps.event.trigger(this, "domready");
    }
    this.redraw_();
};
InfoBubble.prototype.content_changed = InfoBubble.prototype.content_changed;
InfoBubble.prototype.imageLoaded_ = function () {
    var a = !! !this.get("disableAutoPan");
    this.redraw_();
    if (a && (this.tabs_.length == 0 || this.activeTab_.index == 0)) {
        this.panToView();
    }
};
InfoBubble.prototype.updateTabStyles_ = function () {
    if (this.tabs_ && this.tabs_.length) {
        for (var b = 0, d; d = this.tabs_[b]; b++) {
            this.setTabStyle_(d.tab);
        }
        this.activeTab_.style.zIndex = this.baseZIndex_;
        var a = this.getBorderWidth_();
        var c = this.getPadding_() / 2;
        this.activeTab_.style.borderBottomWidth = 0;
        this.activeTab_.style.paddingBottom = this.px(c + a);
    }
};
InfoBubble.prototype.setTabStyle_ = function (n) {
    var a = this.get("backgroundColor");
    var b = this.get("borderColor");
    var c = this.getBorderRadius_();
    var e = this.getBorderWidth_();
    var j = this.getPadding_();
    var h = this.px(-(Math.max(j, c)));
    var d = this.px(c);
    var g = this.baseZIndex_;
    if (n.index) {
        g -= n.index;
    }
    var l = {
        cssFloat: "left",
        position: "relative",
        cursor: "pointer",
        backgroundColor: a,
        border: this.px(e) + " solid " + b,
        padding: this.px(j / 2) + " " + this.px(j),
        marginRight: h,
        whiteSpace: "nowrap",
        borderRadiusTopLeft: d,
        MozBorderRadiusTopleft: d,
        webkitBorderTopLeftRadius: d,
        borderRadiusTopRight: d,
        MozBorderRadiusTopright: d,
        webkitBorderTopRightRadius: d,
        zIndex: g,
        display: "inline"
    };
    for (var k in l) {
        n.style[k] = l[k];
    }
    var f = this.get("tabClassName");
    if (f != undefined) {
        n.className += " " + f;
    }
};
InfoBubble.prototype.addTabActions_ = function (a) {
    var b = this;
    a.listener_ = google.maps.event.addDomListener(a, "click", function () {
        b.setTabActive_(this);
    });
};
InfoBubble.prototype.setTabActive = function (a) {
    var b = this.tabs_[a - 1];
    if (b) {
        this.setTabActive_(b.tab);
    }
};
InfoBubble.prototype.setTabActive = InfoBubble.prototype.setTabActive;
InfoBubble.prototype.setTabActive_ = function (d) {
    if (!d) {
        this.setContent("");
        return;
    }
    var c = this.getPadding_() / 2;
    var b = this.getBorderWidth_();
    if (this.activeTab_) {
        var a = this.activeTab_;
        a.style.zIndex = this.baseZIndex_ - a.index;
        a.style.paddingBottom = this.px(c);
        a.style.borderBottomWidth = this.px(b);
    }
    d.style.zIndex = this.baseZIndex_;
    d.style.borderBottomWidth = 0;
    d.style.marginBottomWidth = "-10px";
    d.style.paddingBottom = this.px(c + b);
    this.setContent(this.tabs_[d.index].content);
    this.activeTab_ = d;
    this.redraw_();
};
InfoBubble.prototype.setMaxWidth = function (a) {
    this.set("maxWidth", a);
};
InfoBubble.prototype.setMaxWidth = InfoBubble.prototype.setMaxWidth;
InfoBubble.prototype.maxWidth_changed = function () {
    this.redraw_();
};
InfoBubble.prototype.maxWidth_changed = InfoBubble.prototype.maxWidth_changed;
InfoBubble.prototype.setMaxHeight = function (a) {
    this.set("maxHeight", a);
};
InfoBubble.prototype.setMaxHeight = InfoBubble.prototype.setMaxHeight;
InfoBubble.prototype.maxHeight_changed = function () {
    this.redraw_();
};
InfoBubble.prototype.maxHeight_changed = InfoBubble.prototype.maxHeight_changed;
InfoBubble.prototype.setMinWidth = function (a) {
    this.set("minWidth", a);
};
InfoBubble.prototype.setMinWidth = InfoBubble.prototype.setMinWidth;
InfoBubble.prototype.minWidth_changed = function () {
    this.redraw_();
};
InfoBubble.prototype.minWidth_changed = InfoBubble.prototype.minWidth_changed;
InfoBubble.prototype.setMinHeight = function (a) {
    this.set("minHeight", a);
};
InfoBubble.prototype.setMinHeight = InfoBubble.prototype.setMinHeight;
InfoBubble.prototype.minHeight_changed = function () {
    this.redraw_();
};
InfoBubble.prototype.minHeight_changed = InfoBubble.prototype.minHeight_changed;
InfoBubble.prototype.addTab = function (b, a) {
    var c = document.createElement("DIV");
    c.innerHTML = b;
    this.setTabStyle_(c);
    this.addTabActions_(c);
    this.tabsContainer_.appendChild(c);
    this.tabs_.push({
        label: b,
        content: a,
        tab: c
    });
    c.index = this.tabs_.length - 1;
    c.style.zIndex = this.baseZIndex_ - c.index;
    if (!this.activeTab_) {
        this.setTabActive_(c);
    }
    c.className = c.className + " " + this.animationName_;
    this.redraw_();
};
InfoBubble.prototype.addTab = InfoBubble.prototype.addTab;
InfoBubble.prototype.updateTab = function (a, c, b) {
    if (!this.tabs_.length || a < 0 || a >= this.tabs_.length) {
        return;
    }
    var d = this.tabs_[a];
    if (c != undefined) {
        d.tab.innerHTML = d.label = c;
    }
    if (b != undefined) {
        d.content = b;
    }
    if (this.activeTab_ == d.tab) {
        this.setContent(d.content);
    }
    this.redraw_();
};
InfoBubble.prototype.updateTab = InfoBubble.prototype.updateTab;
InfoBubble.prototype.removeTab = function (b) {
    if (!this.tabs_.length || b < 0 || b >= this.tabs_.length) {
        return;
    }
    var d = this.tabs_[b];
    d.tab.parentNode.removeChild(d.tab);
    google.maps.event.removeListener(d.tab.listener_);
    this.tabs_.splice(b, 1);
    delete d;
    for (var a = 0, c; c = this.tabs_[a]; a++) {
        c.tab.index = a;
    }
    if (d.tab == this.activeTab_) {
        if (this.tabs_[b]) {
            this.activeTab_ = this.tabs_[b].tab;
        } else {
            if (this.tabs_[b - 1]) {
                this.activeTab_ = this.tabs_[b - 1].tab;
            } else {
                this.activeTab_ = undefined;
            }
        }
        this.setTabActive_(this.activeTab_);
    }
    this.redraw_();
};
InfoBubble.prototype.removeTab = InfoBubble.prototype.removeTab;
InfoBubble.prototype.getElementSize_ = function (a, c, b) {
    var e = document.createElement("DIV");
    e.style.display = "inline";
    e.style.position = "absolute";
    e.style.visibility = "hidden";
    if (typeof a == "string") {
        e.innerHTML = a;
    } else {
        e.appendChild(a.cloneNode(true));
    }
    document.body.appendChild(e);
    var d = new google.maps.Size(e.offsetWidth, e.offsetHeight);
    if (c && d.width > c) {
        e.style.width = this.px(c);
        d = new google.maps.Size(e.offsetWidth, e.offsetHeight);
    }
    if (b && d.height > b) {
        e.style.height = this.px(b);
        d = new google.maps.Size(e.offsetWidth, e.offsetHeight);
    }
    document.body.removeChild(e);
    delete e;
    return d;
};
InfoBubble.prototype.redraw_ = function () {
    this.figureOutSize_();
    this.positionCloseButton_();
    this.draw();
};
InfoBubble.prototype.figureOutSize_ = function () {
    var j = this.get("map");
    if (!j) {
        return;
    }
    var q = this.getPadding_();
    var c = this.getBorderWidth_();
    var b = this.getBorderRadius_();
    var a = this.getArrowSize_();
    var k = j.getDiv();
    var f = a * 2;
    var n = k.offsetWidth - f;
    var l = k.offsetHeight - f - this.getAnchorHeight_();
    var t = 0;
    var w = (this.get("minWidth") || 0);
    var g = (this.get("minHeight") || 0);
    var p = (this.get("maxWidth") || 0);
    var o = (this.get("maxHeight") || 0);
    p = Math.min(n, p);
    o = Math.min(l, o);
    var v = 0;
    if (this.tabs_.length) {
        for (var h = 0, s; s = this.tabs_[h]; h++) {
            var u = this.getElementSize_(s.tab, p, o);
            var e = this.getElementSize_(s.content, p, o);
            if (w < u.width) {
                w = u.width;
            }
            v += u.width;
            if (g < u.height) {
                g = u.height;
            }
            if (u.height > t) {
                t = u.height;
            }
            if (w < e.width) {
                w = e.width;
            }
            if (g < e.height) {
                g = e.height;
            }
        }
    } else {
        var d = (this.get("content"));
        if (typeof d == "string") {
            d = this.htmlToDocumentFragment_(d);
        }
        if (d) {
            var e = this.getElementSize_(d, p, o);
            if (w < e.width) {
                w = e.width;
            }
            if (g < e.height) {
                g = e.height;
            }
        }
    }
    if (p) {
        w = Math.min(w, p);
    }
    if (o) {
        g = Math.min(g, o);
    }
    w = Math.max(w, v);
    if (w == v) {
        w = w + 2 * q;
    }
    a = a * 2;
    w = Math.max(w, a);
    if (w > n) {
        w = n;
    }
    if (g > l) {
        g = l - t;
    }
    if (this.tabsContainer_) {
        this.tabHeight_ = t;
        this.tabsContainer_.style.width = this.px(v);
    }
    this.contentContainer_.style.width = this.px(w);
    this.contentContainer_.style.height = this.px(g);
};
InfoBubble.prototype.getAnchorHeight_ = function () {
    var b = 0;
    var a = this.get("anchor");
    if (a) {
        if (!b && a.height) {
            b = a.height;
        }
        if (!b) {
            b = 34;
        }
    }
    return b;
};
InfoBubble.prototype.positionCloseButton_ = function () {
    var a = this.getBorderRadius_();
    var b = this.getBorderWidth_();
    var e = 2;
    var f = 2;
    if (this.tabs_.length && this.tabHeight_) {
        f += this.tabHeight_;
    }
    f += b;
    e += b;
    var d = this.contentContainer_;
    if (d && d.clientHeight < d.scrollHeight) {
        e += 15;
    }
    this.close_.style.right = this.px(e);
    this.close_.style.top = this.px(f);
};