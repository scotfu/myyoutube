/*
 * iScroll v4.2.2 ~ Copyright (c) 2012 Matteo Spinelli, http://cubiq.org
 * Released under MIT license, http://cubiq.org/license
 */ (function (H, d) {
    var q = Math,
        e = d.createElement("div").style,
        F = (function () {
            var N = "t,webkitT,MozT,msT,OT".split(","),
                L, J = 0,
                K = N.length;
            for (; J < K; J++) {
                L = N[J] + "ransform";
                if (L in e) {
                    return N[J].substr(0, N[J].length - 1);
                }
            }
            return false;
        })(),
        c = F ? "-" + F.toLowerCase() + "-" : "",
        x = u("transform"),
        B = u("transitionProperty"),
        A = u("transitionDuration"),
        y = u("transformOrigin"),
        C = u("transitionTimingFunction"),
        z = u("transitionDelay"),
        l = (/android/gi).test(navigator.appVersion),
        o = (/iphone|ipad/gi).test(navigator.appVersion),
        p = (/hp-tablet/gi).test(navigator.appVersion),
        g = u("perspective") in e,
        h = "ontouchstart" in H && !p,
        j = !! F,
        k = u("transition") in e,
        v = "onorientationchange" in H ? "orientationchange" : "resize",
        w = h ? "touchstart" : "mousedown",
        s = h ? "touchmove" : "mousemove",
        f = h ? "touchend" : "mouseup",
        a = h ? "touchcancel" : "mouseup",
        G = F == "Moz" ? "DOMMouseScroll" : "mousewheel",
        E = (function () {
            if (F === false) {
                return false;
            }
            var J = {
                "": "transitionend",
                webkit: "webkitTransitionEnd",
                Moz: "transitionend",
                O: "otransitionend",
                ms: "MSTransitionEnd"
            };
            return J[F];
        })(),
        t = (function () {
            return H.requestAnimationFrame || H.webkitRequestAnimationFrame || H.mozRequestAnimationFrame || H.oRequestAnimationFrame || H.msRequestAnimationFrame || function (J) {
                return setTimeout(J, 1);
            };
        })(),
        b = (function () {
            return H.cancelRequestAnimationFrame || H.webkitCancelAnimationFrame || H.webkitCancelRequestAnimationFrame || H.mozCancelRequestAnimationFrame || H.oCancelRequestAnimationFrame || H.msCancelRequestAnimationFrame || clearTimeout;
        })(),
        D = g ? " translateZ(0)" : "",
        n = function (J, L) {
            var N = this,
                K;
            N.wrapper = typeof J == "object" ? J : d.getElementById(J);
            N.wrapper.style.overflow = "hidden";
            N.scroller = N.wrapper.children[0];
            N.options = {
                hScroll: true,
                vScroll: true,
                x: 0,
                y: 0,
                bounce: true,
                bounceLock: false,
                momentum: true,
                lockDirection: true,
                useTransform: true,
                useTransition: false,
                topOffset: 0,
                checkDOMChanges: false,
                handleClick: true,
                hScrollbar: true,
                vScrollbar: true,
                fixedScrollbar: l,
                hideScrollbar: o,
                fadeScrollbar: o && g,
                scrollbarClass: "",
                zoom: false,
                zoomMin: 1,
                zoomMax: 4,
                doubleTapZoom: 2,
                wheelAction: "scroll",
                snap: false,
                snapThreshold: 1,
                onRefresh: null,
                onBeforeScrollStart: function (O) {
                    O.preventDefault();
                },
                onScrollStart: null,
                onBeforeScrollMove: null,
                onScrollMove: null,
                onBeforeScrollEnd: null,
                onScrollEnd: null,
                onTouchEnd: null,
                onDestroy: null,
                onZoomStart: null,
                onZoom: null,
                onZoomEnd: null,
                onPageChanged: null
            };
            for (K in L) {
                N.options[K] = L[K];
            }
            N.x = N.options.x;
            N.y = N.options.y;
            N.options.useTransform = j && N.options.useTransform;
            N.options.hScrollbar = N.options.hScroll && N.options.hScrollbar;
            N.options.vScrollbar = N.options.vScroll && N.options.vScrollbar;
            N.options.zoom = N.options.useTransform && N.options.zoom;
            N.options.useTransition = k && N.options.useTransition;
            if (N.options.zoom && l) {
                D = "";
            }
            N.scroller.style[B] = N.options.useTransform ? c + "transform" : "top left";
            N.scroller.style[A] = "0";
            N.scroller.style[y] = "0 0";
            if (N.options.useTransition) {
                N.scroller.style[C] = "cubic-bezier(0.33,0.66,0.66,1)";
            }
            if (N.options.useTransform) {
                N.scroller.style[x] = "translate(" + N.x + "px," + N.y + "px)" + D;
            } else {
                N.scroller.style.cssText += ";position:absolute;top:" + N.y + "px;left:" + N.x + "px";
            }
            if (N.options.useTransition) {
                N.options.fixedScrollbar = true;
            }
            N.refresh();
            N._bind(v, H);
            N._bind(w);
            if (!h) {
                if (N.options.wheelAction != "none") {
                    N._bind(G);
                }
            }
            if (N.options.checkDOMChanges) {
                N.checkDOMTime = setInterval(function () {
                    N._checkDOMChanges();
                }, 500);
            }
        };
    n.prototype = {
        enabled: true,
        x: 0,
        y: 0,
        steps: [],
        scale: 1,
        currPageX: 0,
        currPageY: 0,
        pagesX: [],
        pagesY: [],
        aniTime: null,
        wheelZoomCount: 0,
        handleEvent: function (J) {
            var K = this;
            switch (J.type) {
            case w:
                if (!h && J.button !== 0) {
                    return;
                }
                K._start(J);
                break;
            case s:
                K._move(J);
                break;
            case f:
            case a:
                K._end(J);
                break;
            case v:
                K._resize();
                break;
            case G:
                K._wheel(J);
                break;
            case E:
                K._transitionEnd(J);
                break;
            }
        },
        _checkDOMChanges: function () {
            if (this.moved || this.zoomed || this.animating || (this.scrollerW == this.scroller.offsetWidth * this.scale && this.scrollerH == this.scroller.offsetHeight * this.scale)) {
                return;
            }
            this.refresh();
        },
        _scrollbar: function (K) {
            var L = this,
                J;
            if (!L[K + "Scrollbar"]) {
                if (L[K + "ScrollbarWrapper"]) {
                    if (j) {
                        L[K + "ScrollbarIndicator"].style[x] = "";
                    }
                    L[K + "ScrollbarWrapper"].parentNode.removeChild(L[K + "ScrollbarWrapper"]);
                    L[K + "ScrollbarWrapper"] = null;
                    L[K + "ScrollbarIndicator"] = null;
                }
                return;
            }
            if (!L[K + "ScrollbarWrapper"]) {
                J = d.createElement("div");
                if (L.options.scrollbarClass) {
                    J.className = L.options.scrollbarClass + K.toUpperCase();
                } else {
                    J.style.cssText = "position:absolute;z-index:100;" + (K == "h" ? "height:7px;bottom:1px;left:2px;right:" + (L.vScrollbar ? "7" : "2") + "px" : "width:7px;bottom:" + (L.hScrollbar ? "7" : "2") + "px;top:2px;right:1px");
                }
                J.style.cssText += ";pointer-events:none;" + c + "transition-property:opacity;" + c + "transition-duration:" + (L.options.fadeScrollbar ? "350ms" : "0") + ";overflow:hidden;opacity:" + (L.options.hideScrollbar ? "0" : "1");
                L.wrapper.appendChild(J);
                L[K + "ScrollbarWrapper"] = J;
                J = d.createElement("div");
                if (!L.options.scrollbarClass) {
                    J.style.cssText = "position:absolute;z-index:100;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);" + c + "background-clip:padding-box;" + c + "box-sizing:border-box;" + (K == "h" ? "height:100%" : "width:100%") + ";" + c + "border-radius:3px;border-radius:3px";
                }
                J.style.cssText += ";pointer-events:none;" + c + "transition-property:" + c + "transform;" + c + "transition-timing-function:cubic-bezier(0.33,0.66,0.66,1);" + c + "transition-duration:0;" + c + "transform: translate(0,0)" + D;
                if (L.options.useTransition) {
                    J.style.cssText += ";" + c + "transition-timing-function:cubic-bezier(0.33,0.66,0.66,1)";
                }
                L[K + "ScrollbarWrapper"].appendChild(J);
                L[K + "ScrollbarIndicator"] = J;
            }
            if (K == "h") {
                L.hScrollbarSize = L.hScrollbarWrapper.clientWidth;
                L.hScrollbarIndicatorSize = q.max(q.round(L.hScrollbarSize * L.hScrollbarSize / L.scrollerW), 8);
                L.hScrollbarIndicator.style.width = L.hScrollbarIndicatorSize + "px";
                L.hScrollbarMaxScroll = L.hScrollbarSize - L.hScrollbarIndicatorSize;
                L.hScrollbarProp = L.hScrollbarMaxScroll / L.maxScrollX;
            } else {
                L.vScrollbarSize = L.vScrollbarWrapper.clientHeight;
                L.vScrollbarIndicatorSize = q.max(q.round(L.vScrollbarSize * L.vScrollbarSize / L.scrollerH), 8);
                L.vScrollbarIndicator.style.height = L.vScrollbarIndicatorSize + "px";
                L.vScrollbarMaxScroll = L.vScrollbarSize - L.vScrollbarIndicatorSize;
                L.vScrollbarProp = L.vScrollbarMaxScroll / L.maxScrollY;
            }
            L._scrollbarPos(K, true);
        },
        _resize: function () {
            var J = this;
            setTimeout(function () {
                J.refresh();
            }, l ? 200 : 0);
        },
        _pos: function (J, K) {
            if (this.zoomed) {
                return;
            }
            J = this.hScroll ? J : 0;
            K = this.vScroll ? K : 0;
            if (this.options.useTransform) {
                this.scroller.style[x] = "translate(" + J + "px," + K + "px) scale(" + this.scale + ")" + D;
            } else {
                J = q.round(J);
                K = q.round(K);
                this.scroller.style.left = J + "px";
                this.scroller.style.top = K + "px";
            }
            this.x = J;
            this.y = K;
            this._scrollbarPos("h");
            this._scrollbarPos("v");
        },
        _scrollbarPos: function (J, K) {
            var O = this,
                L = J == "h" ? O.x : O.y,
                N;
            if (!O[J + "Scrollbar"]) {
                return;
            }
            L = O[J + "ScrollbarProp"] * L;
            if (L < 0) {
                if (!O.options.fixedScrollbar) {
                    N = O[J + "ScrollbarIndicatorSize"] + q.round(L * 3);
                    if (N < 8) {
                        N = 8;
                    }
                    O[J + "ScrollbarIndicator"].style[J == "h" ? "width" : "height"] = N + "px";
                }
                L = 0;
            } else {
                if (L > O[J + "ScrollbarMaxScroll"]) {
                    if (!O.options.fixedScrollbar) {
                        N = O[J + "ScrollbarIndicatorSize"] - q.round((L - O[J + "ScrollbarMaxScroll"]) * 3);
                        if (N < 8) {
                            N = 8;
                        }
                        O[J + "ScrollbarIndicator"].style[J == "h" ? "width" : "height"] = N + "px";
                        L = O[J + "ScrollbarMaxScroll"] + (O[J + "ScrollbarIndicatorSize"] - N);
                    } else {
                        L = O[J + "ScrollbarMaxScroll"];
                    }
                }
            }
            O[J + "ScrollbarWrapper"].style[z] = "0";
            O[J + "ScrollbarWrapper"].style.opacity = K && O.options.hideScrollbar ? "0" : "1";
            O[J + "ScrollbarIndicator"].style[x] = "translate(" + (J == "h" ? L + "px,0)" : "0," + L + "px)") + D;
        },
        _start: function (L) {
            var P = this,
                O = h ? L.touches[0] : L,
                N, Q, R, J, K;
            if (!P.enabled) {
                return;
            }
            if (P.options.onBeforeScrollStart) {
                P.options.onBeforeScrollStart.call(P, L);
            }
            if (P.options.useTransition || P.options.zoom) {
                P._transitionTime(0);
            }
            P.moved = false;
            P.animating = false;
            P.zoomed = false;
            P.distX = 0;
            P.distY = 0;
            P.absDistX = 0;
            P.absDistY = 0;
            P.dirX = 0;
            P.dirY = 0;
            if (P.options.zoom && h && L.touches.length > 1) {
                J = q.abs(L.touches[0].pageX - L.touches[1].pageX);
                K = q.abs(L.touches[0].pageY - L.touches[1].pageY);
                P.touchesDistStart = q.sqrt(J * J + K * K);
                P.originX = q.abs(L.touches[0].pageX + L.touches[1].pageX - P.wrapperOffsetLeft * 2) / 2 - P.x;
                P.originY = q.abs(L.touches[0].pageY + L.touches[1].pageY - P.wrapperOffsetTop * 2) / 2 - P.y;
                if (P.options.onZoomStart) {
                    P.options.onZoomStart.call(P, L);
                }
            }
            if (P.options.momentum) {
                if (P.options.useTransform) {
                    N = getComputedStyle(P.scroller, null)[x].replace(/[^0-9\-.,]/g, "").split(",");
                    Q = +N[4];
                    R = +N[5];
                } else {
                    Q = +getComputedStyle(P.scroller, null).left.replace(/[^0-9-]/g, "");
                    R = +getComputedStyle(P.scroller, null).top.replace(/[^0-9-]/g, "");
                }
                if (Q != P.x || R != P.y) {
                    if (P.options.useTransition) {
                        P._unbind(E);
                    } else {
                        b(P.aniTime);
                    }
                    P.steps = [];
                    P._pos(Q, R);
                    if (P.options.onScrollEnd) {
                        P.options.onScrollEnd.call(P);
                    }
                }
            }
            P.absStartX = P.x;
            P.absStartY = P.y;
            P.startX = P.x;
            P.startY = P.y;
            P.pointX = O.pageX;
            P.pointY = O.pageY;
            P.startTime = L.timeStamp || Date.now().getTime();
            if (P.options.onScrollStart) {
                P.options.onScrollStart.call(P, L);
            }
            P._bind(s, H);
            P._bind(f, H);
            P._bind(a, H);
        },
        _move: function (O) {
            var T = this,
                R = h ? O.touches[0] : O,
                L = R.pageX - T.pointX,
                N = R.pageY - T.pointY,
                P = T.x + L,
                Q = T.y + N,
                J, K, S, U = O.timeStamp || Date.now().getTime();
            if (T.options.onBeforeScrollMove) {
                T.options.onBeforeScrollMove.call(T, O);
            }
            if (T.options.zoom && h && O.touches.length > 1) {
                J = q.abs(O.touches[0].pageX - O.touches[1].pageX);
                K = q.abs(O.touches[0].pageY - O.touches[1].pageY);
                T.touchesDist = q.sqrt(J * J + K * K);
                T.zoomed = true;
                S = 1 / T.touchesDistStart * T.touchesDist * this.scale;
                if (S < T.options.zoomMin) {
                    S = 0.5 * T.options.zoomMin * Math.pow(2, S / T.options.zoomMin);
                } else {
                    if (S > T.options.zoomMax) {
                        S = 2 * T.options.zoomMax * Math.pow(0.5, T.options.zoomMax / S);
                    }
                }
                T.lastScale = S / this.scale;
                P = this.originX - this.originX * T.lastScale + this.x, Q = this.originY - this.originY * T.lastScale + this.y;
                this.scroller.style[x] = "translate(" + P + "px," + Q + "px) scale(" + S + ")" + D;
                if (T.options.onZoom) {
                    T.options.onZoom.call(T, O);
                }
                return;
            }
            T.pointX = R.pageX;
            T.pointY = R.pageY;
            if (P > 0 || P < T.maxScrollX) {
                P = T.options.bounce ? T.x + (L / 2) : P >= 0 || T.maxScrollX >= 0 ? 0 : T.maxScrollX;
            }
            if (Q > T.minScrollY || Q < T.maxScrollY) {
                Q = T.options.bounce ? T.y + (N / 2) : Q >= T.minScrollY || T.maxScrollY >= 0 ? T.minScrollY : T.maxScrollY;
            }
            T.distX += L;
            T.distY += N;
            T.absDistX = q.abs(T.distX);
            T.absDistY = q.abs(T.distY);
            if (T.absDistX < 6 && T.absDistY < 6) {
                return;
            }
            if (T.options.lockDirection) {
                if (T.absDistX > T.absDistY + 5) {
                    Q = T.y;
                    N = 0;
                } else {
                    if (T.absDistY > T.absDistX + 5) {
                        P = T.x;
                        L = 0;
                    }
                }
            }
            T.moved = true;
            T._pos(P, Q);
            T.dirX = L > 0 ? -1 : L < 0 ? 1 : 0;
            T.dirY = N > 0 ? -1 : N < 0 ? 1 : 0;
            if (U - T.startTime > 300) {
                T.startTime = U;
                T.startX = T.x;
                T.startY = T.y;
            }
            if (T.options.onScrollMove) {
                T.options.onScrollMove.call(T, O);
            }
        },
        _end: function (N) {
            if (h && N.touches.length !== 0) {
                return;
            }
            var Y = this,
                U = h ? N.changedTouches[0] : N,
                X, O, P = {
                    dist: 0,
                    time: 0
                }, Q = {
                    dist: 0,
                    time: 0
                }, L = (N.timeStamp || Date.now().getTime()) - Y.startTime,
                S = Y.x,
                T = Y.y,
                J, K, R, W, V;
            Y._unbind(s, H);
            Y._unbind(f, H);
            Y._unbind(a, H);
            if (Y.options.onBeforeScrollEnd) {
                Y.options.onBeforeScrollEnd.call(Y, N);
            }
            if (Y.zoomed) {
                V = Y.scale * Y.lastScale;
                V = Math.max(Y.options.zoomMin, V);
                V = Math.min(Y.options.zoomMax, V);
                Y.lastScale = V / Y.scale;
                Y.scale = V;
                Y.x = Y.originX - Y.originX * Y.lastScale + Y.x;
                Y.y = Y.originY - Y.originY * Y.lastScale + Y.y;
                Y.scroller.style[A] = "200ms";
                Y.scroller.style[x] = "translate(" + Y.x + "px," + Y.y + "px) scale(" + Y.scale + ")" + D;
                Y.zoomed = false;
                Y.refresh();
                if (Y.options.onZoomEnd) {
                    Y.options.onZoomEnd.call(Y, N);
                }
                return;
            }
            if (!Y.moved) {
                if (h) {
                    if (Y.doubleTapTimer && Y.options.zoom) {
                        clearTimeout(Y.doubleTapTimer);
                        Y.doubleTapTimer = null;
                        if (Y.options.onZoomStart) {
                            Y.options.onZoomStart.call(Y, N);
                        }
                        Y.zoom(Y.pointX, Y.pointY, Y.scale == 1 ? Y.options.doubleTapZoom : 1);
                        if (Y.options.onZoomEnd) {
                            setTimeout(function () {
                                Y.options.onZoomEnd.call(Y, N);
                            }, 200);
                        }
                    } else {
                        if (this.options.handleClick) {
                            Y.doubleTapTimer = setTimeout(function () {
                                Y.doubleTapTimer = null;
                                X = U.target;
                                while (X.nodeType != 1) {
                                    X = X.parentNode;
                                }
                                if (X.tagName != "SELECT" && X.tagName != "INPUT" && X.tagName != "TEXTAREA") {
                                    O = d.createEvent("MouseEvents");
                                    O.initMouseEvent("click", true, true, N.view, 1, U.screenX, U.screenY, U.clientX, U.clientY, N.ctrlKey, N.altKey, N.shiftKey, N.metaKey, 0, null);
                                    O._fake = true;
                                    X.dispatchEvent(O);
                                }
                            }, Y.options.zoom ? 250 : 0);
                        }
                    }
                }
                Y._resetPos(400);
                if (Y.options.onTouchEnd) {
                    Y.options.onTouchEnd.call(Y, N);
                }
                return;
            }
            if (L < 300 && Y.options.momentum) {
                P = S ? Y._momentum(S - Y.startX, L, - Y.x, Y.scrollerW - Y.wrapperW + Y.x, Y.options.bounce ? Y.wrapperW : 0) : P;
                Q = T ? Y._momentum(T - Y.startY, L, - Y.y, (Y.maxScrollY < 0 ? Y.scrollerH - Y.wrapperH + Y.y - Y.minScrollY : 0), Y.options.bounce ? Y.wrapperH : 0) : Q;
                S = Y.x + P.dist;
                T = Y.y + Q.dist;
                if ((Y.x > 0 && S > 0) || (Y.x < Y.maxScrollX && S < Y.maxScrollX)) {
                    P = {
                        dist: 0,
                        time: 0
                    };
                }
                if ((Y.y > Y.minScrollY && T > Y.minScrollY) || (Y.y < Y.maxScrollY && T < Y.maxScrollY)) {
                    Q = {
                        dist: 0,
                        time: 0
                    };
                }
            }
            if (P.dist || Q.dist) {
                R = q.max(q.max(P.time, Q.time), 10);
                if (Y.options.snap) {
                    J = S - Y.absStartX;
                    K = T - Y.absStartY;
                    if (q.abs(J) < Y.options.snapThreshold && q.abs(K) < Y.options.snapThreshold) {
                        Y.scrollTo(Y.absStartX, Y.absStartY, 200);
                    } else {
                        W = Y._snap(S, T);
                        S = W.x;
                        T = W.y;
                        R = q.max(W.time, R);
                    }
                }
                Y.scrollTo(q.round(S), q.round(T), R);
                if (Y.options.onTouchEnd) {
                    Y.options.onTouchEnd.call(Y, N);
                }
                return;
            }
            if (Y.options.snap) {
                J = S - Y.absStartX;
                K = T - Y.absStartY;
                if (q.abs(J) < Y.options.snapThreshold && q.abs(K) < Y.options.snapThreshold) {
                    Y.scrollTo(Y.absStartX, Y.absStartY, 200);
                } else {
                    W = Y._snap(Y.x, Y.y);
                    if (W.x != Y.x || W.y != Y.y) {
                        Y.scrollTo(W.x, W.y, W.time);
                    }
                }
                if (Y.options.onTouchEnd) {
                    Y.options.onTouchEnd.call(Y, N);
                }
                return;
            }
            Y._resetPos(200);
            if (Y.options.onTouchEnd) {
                Y.options.onTouchEnd.call(Y, N);
            }
        },
        _resetPos: function (N) {
            var L = this,
                J = L.x >= 0 ? 0 : L.x < L.maxScrollX ? L.maxScrollX : L.x,
                K = L.y >= L.minScrollY || L.maxScrollY > 0 ? L.minScrollY : L.y < L.maxScrollY ? L.maxScrollY : L.y;
            if (J == L.x && K == L.y) {
                if (L.moved) {
                    L.moved = false;
                    if (L.options.onScrollEnd) {
                        L.options.onScrollEnd.call(L);
                    }
                }
                if (L.hScrollbar && L.options.hideScrollbar) {
                    if (F == "webkit") {
                        L.hScrollbarWrapper.style[z] = "300ms";
                    }
                    L.hScrollbarWrapper.style.opacity = "0";
                }
                if (L.vScrollbar && L.options.hideScrollbar) {
                    if (F == "webkit") {
                        L.vScrollbarWrapper.style[z] = "300ms";
                    }
                    L.vScrollbarWrapper.style.opacity = "0";
                }
                return;
            }
            L.scrollTo(J, K, N || 0);
        },
        _wheel: function (N) {
            var O = this,
                P, Q, K, L, J;
            if ("wheelDeltaX" in N) {
                P = N.wheelDeltaX / 12;
                Q = N.wheelDeltaY / 12;
            } else {
                if ("wheelDelta" in N) {
                    P = Q = N.wheelDelta / 12;
                } else {
                    if ("detail" in N) {
                        P = Q = -N.detail * 3;
                    } else {
                        return;
                    }
                }
            }
            if (O.options.wheelAction == "zoom") {
                J = O.scale * Math.pow(2, 1 / 3 * (Q ? Q / Math.abs(Q) : 0));
                if (J < O.options.zoomMin) {
                    J = O.options.zoomMin;
                }
                if (J > O.options.zoomMax) {
                    J = O.options.zoomMax;
                }
                if (J != O.scale) {
                    if (!O.wheelZoomCount && O.options.onZoomStart) {
                        O.options.onZoomStart.call(O, N);
                    }
                    O.wheelZoomCount++;
                    O.zoom(N.pageX, N.pageY, J, 400);
                    setTimeout(function () {
                        O.wheelZoomCount--;
                        if (!O.wheelZoomCount && O.options.onZoomEnd) {
                            O.options.onZoomEnd.call(O, N);
                        }
                    }, 400);
                }
                return;
            }
            K = O.x + P;
            L = O.y + Q;
            if (K > 0) {
                K = 0;
            } else {
                if (K < O.maxScrollX) {
                    K = O.maxScrollX;
                }
            }
            if (L > O.minScrollY) {
                L = O.minScrollY;
            } else {
                if (L < O.maxScrollY) {
                    L = O.maxScrollY;
                }
            }
            if (O.maxScrollY < 0) {
                O.scrollTo(K, L, 0);
            }
        },
        _transitionEnd: function (J) {
            var K = this;
            if (J.target != K.scroller) {
                return;
            }
            K._unbind(E);
            K._startAni();
        },
        _startAni: function () {
            var Q = this,
                N = Q.x,
                O = Q.y,
                L = Date.now().getTime(),
                P, K, J;
            if (Q.animating) {
                return;
            }
            if (!Q.steps.length) {
                Q._resetPos(400);
                return;
            }
            P = Q.steps.shift();
            if (P.x == N && P.y == O) {
                P.time = 0;
            }
            Q.animating = true;
            Q.moved = true;
            if (Q.options.useTransition) {
                Q._transitionTime(P.time);
                Q._pos(P.x, P.y);
                Q.animating = false;
                if (P.time) {
                    Q._bind(E);
                } else {
                    Q._resetPos(0);
                }
                return;
            }
            J = function () {
                var T = Date.now().getTime(),
                    R, S;
                if (T >= L + P.time) {
                    Q._pos(P.x, P.y);
                    Q.animating = false;
                    if (Q.options.onAnimationEnd) {
                        Q.options.onAnimationEnd.call(Q);
                    }
                    Q._startAni();
                    return;
                }
                T = (T - L) / P.time - 1;
                K = q.sqrt(1 - T * T);
                if (!K) {
                    K = 0;
                }
                R = (P.x - N) * K + N;
                S = (P.y - O) * K + O;
                Q._pos(R, S);
                if (Q.animating) {
                    Q.aniTime = t(J);
                }
            };
            J();
        },
        _transitionTime: function (J) {
            J += "ms";
            this.scroller.style[A] = J;
            if (this.hScrollbar) {
                this.hScrollbarIndicator.style[A] = J;
            }
            if (this.vScrollbar) {
                this.vScrollbarIndicator.style[A] = J;
            }
        },
        _momentum: function (K, T, N, L, R) {
            var J = 0.0006,
                S = q.abs(K) / T,
                O = (S * S) / (2 * J),
                P = 0,
                Q = 0;
            if (K > 0 && O > N) {
                Q = R / (6 / (O / S * J));
                N = N + Q;
                S = S * N / O;
                O = N;
            } else {
                if (K < 0 && O > L) {
                    Q = R / (6 / (O / S * J));
                    L = L + Q;
                    S = S * L / O;
                    O = L;
                }
            }
            O = O * (K < 0 ? -1 : 1);
            P = S / J;
            return {
                dist: O,
                time: q.round(P)
            };
        },
        _offset: function (J) {
            var K = -J.offsetLeft,
                L = -J.offsetTop;
            while (J = J.offsetParent) {
                K -= J.offsetLeft;
                L -= J.offsetTop;
            }
            if (J != this.wrapper) {
                K *= this.scale;
                L *= this.scale;
            }
            return {
                left: K,
                top: L
            };
        },
        _snap: function (R, S) {
            var P = this,
                J, K, L, Q, N, O;
            L = P.pagesX.length - 1;
            for (J = 0, K = P.pagesX.length; J < K; J++) {
                if (R >= P.pagesX[J]) {
                    L = J;
                    break;
                }
            }
            if (L == P.currPageX && L > 0 && P.dirX < 0) {
                L--;
            }
            R = P.pagesX[L];
            N = q.abs(R - P.pagesX[P.currPageX]);
            N = N ? q.abs(P.x - R) / N * 500 : 0;
            P.setCurrPageX(L);
            L = P.pagesY.length - 1;
            for (J = 0; J < L; J++) {
                if (S >= P.pagesY[J]) {
                    L = J;
                    break;
                }
            }
            if (L == P.currPageY && L > 0 && P.dirY < 0) {
                L--;
            }
            S = P.pagesY[L];
            O = q.abs(S - P.pagesY[P.currPageY]);
            O = O ? q.abs(P.y - S) / O * 500 : 0;
            P.currPageY = L;
            Q = q.round(q.max(N, O)) || 200;
            return {
                x: R,
                y: S,
                time: Q
            };
        },
        _bind: function (L, K, J) {
            (K || this.scroller).addEventListener(L, this, !! J);
        },
        _unbind: function (L, K, J) {
            (K || this.scroller).removeEventListener(L, this, !! J);
        },
        destroy: function () {
            var J = this;
            J.scroller.style[x] = "";
            J.hScrollbar = false;
            J.vScrollbar = false;
            J._scrollbar("h");
            J._scrollbar("v");
            J._unbind(v, H);
            J._unbind(w);
            J._unbind(s, H);
            J._unbind(f, H);
            J._unbind(a, H);
            if (!J.options.hasTouch) {
                J._unbind(G);
            }
            if (J.options.useTransition) {
                J._unbind(E);
            }
            if (J.options.checkDOMChanges) {
                clearInterval(J.checkDOMTime);
            }
            if (J.options.onDestroy) {
                J.options.onDestroy.call(J);
            }
        },
        refresh: function () {
            var Q = this,
                N, K, L, J, P = 0,
                O = 0;
            if (Q.scale < Q.options.zoomMin) {
                Q.scale = Q.options.zoomMin;
            }
            Q.wrapperW = Q.wrapper.clientWidth || 1;
            Q.wrapperH = Q.wrapper.clientHeight || 1;
            Q.minScrollY = -Q.options.topOffset || 0;
            Q.scrollerW = q.round(Q.scroller.offsetWidth * Q.scale);
            Q.scrollerH = q.round((Q.scroller.offsetHeight + Q.minScrollY) * Q.scale);
            Q.maxScrollX = Q.wrapperW - Q.scrollerW;
            Q.maxScrollY = Q.wrapperH - Q.scrollerH + Q.minScrollY;
            Q.dirX = 0;
            Q.dirY = 0;
            if (Q.options.onRefresh) {
                Q.options.onRefresh.call(Q);
            }
            Q.hScroll = Q.options.hScroll && Q.maxScrollX < 0;
            Q.vScroll = Q.options.vScroll && (!Q.options.bounceLock && !Q.hScroll || Q.scrollerH > Q.wrapperH);
            Q.hScrollbar = Q.hScroll && Q.options.hScrollbar;
            Q.vScrollbar = Q.vScroll && Q.options.vScrollbar && Q.scrollerH > Q.wrapperH;
            N = Q._offset(Q.wrapper);
            Q.wrapperOffsetLeft = -N.left;
            Q.wrapperOffsetTop = -N.top;
            if (typeof Q.options.snap == "string") {
                Q.pagesX = [];
                Q.pagesY = [];
                J = Q.scroller.querySelectorAll(Q.options.snap);
                for (K = 0, L = J.length; K < L; K++) {
                    P = Q._offset(J[K]);
                    P.left += Q.wrapperOffsetLeft;
                    P.top += Q.wrapperOffsetTop;
                    Q.pagesX[K] = P.left < Q.maxScrollX ? Q.maxScrollX : P.left * Q.scale;
                    Q.pagesY[K] = P.top < Q.maxScrollY ? Q.maxScrollY : P.top * Q.scale;
                }
            } else {
                if (Q.options.snap) {
                    Q.pagesX = [];
                    while (P >= Q.maxScrollX) {
                        Q.pagesX[O] = P;
                        P = P - Q.wrapperW;
                        O++;
                    }
                    if (Q.maxScrollX % Q.wrapperW) {
                        Q.pagesX[Q.pagesX.length] = Q.maxScrollX - Q.pagesX[Q.pagesX.length - 1] + Q.pagesX[Q.pagesX.length - 1];
                    }
                    P = 0;
                    O = 0;
                    Q.pagesY = [];
                    while (P >= Q.maxScrollY) {
                        Q.pagesY[O] = P;
                        P = P - Q.wrapperH;
                        O++;
                    }
                    if (Q.maxScrollY % Q.wrapperH) {
                        Q.pagesY[Q.pagesY.length] = Q.maxScrollY - Q.pagesY[Q.pagesY.length - 1] + Q.pagesY[Q.pagesY.length - 1];
                    }
                }
            }
            Q._scrollbar("h");
            Q._scrollbar("v");
            if (!Q.zoomed) {
                Q.scroller.style[A] = "0";
                Q._resetPos(400);
            }
        },
        scrollTo: function (Q, R, P, L) {
            var O = this,
                N = Q,
                J, K;
            O.stop();
            if (!N.length) {
                N = [{
                    x: Q,
                    y: R,
                    time: P,
                    relative: L
                }];
            }
            for (J = 0, K = N.length; J < K; J++) {
                if (N[J].relative) {
                    N[J].x = O.x - N[J].x;
                    N[J].y = O.y - N[J].y;
                }
                O.steps.push({
                    x: N[J].x,
                    y: N[J].y,
                    time: N[J].time || 0
                });
            }
            O._startAni();
        },
        scrollToElement: function (J, N) {
            var L = this,
                K;
            J = J.nodeType ? J : L.scroller.querySelector(J);
            if (!J) {
                return;
            }
            K = L._offset(J);
            K.left += L.wrapperOffsetLeft;
            K.top += L.wrapperOffsetTop;
            K.left = K.left > 0 ? 0 : K.left < L.maxScrollX ? L.maxScrollX : K.left;
            K.top = K.top > L.minScrollY ? L.minScrollY : K.top < L.maxScrollY ? L.maxScrollY : K.top;
            N = N === undefined ? q.max(q.abs(K.left) * 2, q.abs(K.top) * 2) : N;
            L.scrollTo(K.left, K.top, N);
        },
        setCurrPageX: function (J) {
            if (this.options.onPageChange) {
                this.options.onPageChange(J, this.currPageX);
            }
            this.currPageX = J;
        },
        scrollToPage: function (J, K, N) {
            var L = this,
                O, P;
            N = N === undefined ? 400 : N;
            if (L.options.onScrollStart) {
                L.options.onScrollStart.call(L);
            }
            if (L.options.snap) {
                J = J == "next" ? L.currPageX + 1 : J == "prev" ? L.currPageX - 1 : J;
                K = K == "next" ? L.currPageY + 1 : K == "prev" ? L.currPageY - 1 : K;
                J = J < 0 ? 0 : J > L.pagesX.length - 1 ? L.pagesX.length - 1 : J;
                K = K < 0 ? 0 : K > L.pagesY.length - 1 ? L.pagesY.length - 1 : K;
                L.setCurrPageX(J);
                L.currPageY = K;
                O = L.pagesX[J];
                P = L.pagesY[K];
            } else {
                O = -L.wrapperW * J;
                P = -L.wrapperH * K;
                if (O < L.maxScrollX) {
                    O = L.maxScrollX;
                }
                if (P < L.maxScrollY) {
                    P = L.maxScrollY;
                }
            }
            L.scrollTo(O, P, N);
        },
        disable: function () {
            this.stop();
            this._resetPos(0);
            this.enabled = false;
            this._unbind(s, H);
            this._unbind(f, H);
            this._unbind(a, H);
        },
        enable: function () {
            this.enabled = true;
        },
        stop: function () {
            if (this.options.useTransition) {
                this._unbind(E);
            } else {
                b(this.aniTime);
            }
            this.steps = [];
            this.moved = false;
            this.animating = false;
        },
        zoom: function (O, P, K, N) {
            var L = this,
                J = K / L.scale;
            if (!L.options.useTransform) {
                return;
            }
            L.zoomed = true;
            N = N === undefined ? 200 : N;
            O = O - L.wrapperOffsetLeft - L.x;
            P = P - L.wrapperOffsetTop - L.y;
            L.x = O - O * J + L.x;
            L.y = P - P * J + L.y;
            L.scale = K;
            L.refresh();
            L.x = L.x > 0 ? 0 : L.x < L.maxScrollX ? L.maxScrollX : L.x;
            L.y = L.y > L.minScrollY ? L.minScrollY : L.y < L.maxScrollY ? L.maxScrollY : L.y;
            L.scroller.style[A] = N + "ms";
            L.scroller.style[x] = "translate(" + L.x + "px," + L.y + "px) scale(" + K + ")" + D;
            L.zoomed = false;
        },
        isReady: function () {
            return !this.moved && !this.zoomed && !this.animating;
        }
    };

    function u(J) {
        if (F === "") {
            return J;
        }
        J = J.charAt(0).toUpperCase() + J.substr(1);
        return F + J;
    }
    e = null;
    if (typeof exports !== "undefined") {
        exports.iScroll = n;
    } else {
        H.iScroll = n;
    }
})(window, document);