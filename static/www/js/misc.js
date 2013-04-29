var cookie = {};
cookie.each = function (d) {
    var a = document.cookie.split(";");
    for (var b = 0; b < a.length; b++) {
        var c = a[b].split("=")[0];
        d(c);
    }
};
cookie.get = function (a) {
    var b = RegExp(a + "=([^;]+)").exec(document.cookie);
    return b ? (b[1] != "" ? b[1] : undefined) : undefined;
};
cookie.set = function (a, b) {
    document.cookie = a + "=" + b.toString();
};
cookie.remove = function (a) {
    document.cookie = a + "=; expires=Thu, 01-Jan-70 00:00:01 GMT;";
};
SEPermanentStorage = Class.extend({
    init: function (b) {
        var a = $.extend({
            compartment: "js_main"
        }, b);
        $.extend(this, a);
    },
    setValue: function (a, c) {
        if (window.seStorage) {
            var b = {
                val: c
            };
            seStorage.setValue(this.compartment, a, JSON.stringify(b));
        } else {
            DB.set(this.compartment + "_" + a, c);
        }
    },
    getValue: function (b) {
        if (window.seStorage) {
            var f = seStorage.getValue(this.compartment, b);
            var c = f;
            if (f) {
                try {
                    var d = JSON.parse(f);
                    c = d.val || f;
                } catch (a) {
                    c = false;
                }
            }
            return c;
        } else {
            console.log("Getting value from db storage");
            return DB.get(this.compartment + "_" + b);
        }
    },
    removeKey: function (a) {
        if (window.seStorage) {
            seStorage.removeKey(this.compartment, a);
        } else {
            DB.remove(this.compartment + "_" + a);
        }
    }
});
DB = (function () {
    var a, c, b;
    if (window.localStorage) {
        console.info("DB uses window.localStorage");
        a = function (d) {
            var e = window.localStorage.getItem(d);
            console.debug("DB GET " + d + " : " + ((e || "").length > 100 ? e.substr(0, 100) + "[...]" : e));
            return e;
        };
        c = function (d, e) {
            console.debug("DB SET " + d + " = " + ((e || "").length > 100 ? e.substr(0, 100) + "[...]" : e));
            window.localStorage.setItem(d, e);
        };
        b = function (d) {
            console.debug("DB REMOVE " + d);
            window.localStorage.setItem(d, undefined);
        };
    } else {
        console.info("DB uses cookies");
        a = function (d) {
            var e = cookie.get(d);
            console.debug("DB GET " + d + " : " + ((e || "").length > 100 ? e.substr(0, 100) + "[...]" : e));
            return e;
        };
        c = function (d, e) {
            console.debug("DB SET " + d + " = " + ((e || "").length > 100 ? e.substr(0, 100) + "[...]" : e));
            e == undefined ? cookie.remove(d) : cookie.set(d, e);
        };
        b = function (d) {
            console.debug("DB REMOVE " + d);
            cookie.remove(d);
        };
    }
    return {
        get: function (f) {
            var g = a(f);
            if (g) {
                try {
                    return JSON.parse(g);
                } catch (d) {
                    if (g === "undefined") {
                        g = null;
                    }
                    this.set(f, g);
                    return g;
                }
            }
        },
        set: function (d, e) {
            c(d, JSON.stringify(e));
        }
    };
})();
AudioPlayerContstants = {
    eventType: {
        loadStart: "loadstart",
        waiting: "waiting",
        playing: "playing",
        timeUpdate: "timeupdate",
        pause: "pause",
        ended: "ended",
        emptied: "emptied",
        progress: "progress",
        load: "load",
        error: "error",
        suspend: "suspend",
        abort: "abort",
        stalled: "stalled",
        loadedmetadata: "loadedmetadata",
        loadeddata: "loadeddata",
        canplay: "canplay",
        canplaythrough: "canplaythrough",
        seeking: "seeking",
        seeked: "seeked",
        durationchange: "durationchange"
    },
    playerStatus: {
        buffering: "buffering",
        playing: "playing",
        stopped: "stopped",
        notLoaded: "notLoaded"
    }
};
AudioPlayer = function (b) {
    this.container = b;
    this.canPlay = false;
    this.audioElement = b.find("audio").get(0);
    this.sliderControl = b.find("#slider-control").get(0);
    this.currentTimeLabel = b.find("#time");
    this.sliderThumb = b.find("#slider-thumb");
    this.sliderTrail = b.find("#slider-trail");
    this.sliderBar = b.find("#slider-bar").get(0);
    this.sliderControlOffsetLeft = 0;
    this.sliderControlWidth = $(this.sliderControl).outerWidth();
    this.playPauseBtn = b.find("#play-pause-btn");
    this.status = AudioPlayerContstants.playerStatus.notLoaded;
    this.setPlayerStatus(AudioPlayerContstants.playerStatus.notLoaded);
    var a = $(this.audioElement);
    for (var c in AudioPlayerContstants.eventType) {
        this.audioElement.addEventListener(AudioPlayerContstants.eventType[c], this, false);
    }
    this.resizeDisplayArea();
    this.playPauseBtn.get(0).addEventListener("click", this, false);
    this.sliderControl.addEventListener("touchstart", this, false);
    this.sliderControl.addEventListener("touchout", this, false);
    this.sliderControl.addEventListener("touchend", this, false);
};
AudioPlayer.prototype.resizeDisplayArea = function () {
    this.sliderControlWidth = $(this.sliderControl).outerWidth();
};
AudioPlayer.prototype.handleEvent = function (a) {
    var b = a.type;
    console.debug("Event type: " + b);
    switch (b) {
    case "touchstart":
    case "touchout":
    case "touchend":
    case "touchmove":
        this.handlePositionDrag(a);
        break;
    case "click":
        if (a.currentTarget == this.playPauseBtn.get(0)) {
            this.onPlayPauseButtonClick();
        }
        break;
    case AudioPlayerContstants.eventType.loadStart:
        this.setPlayerStatus(AudioPlayerContstants.playerStatus.stopped);
        break;
    case AudioPlayerContstants.eventType.waiting:
        this.setPlayerStatus(AudioPlayerContstants.playerStatus.buffering);
        break;
    case AudioPlayerContstants.eventType.playing:
        this.setPlayerStatus(AudioPlayerContstants.playerStatus.playing);
        break;
    case AudioPlayerContstants.eventType.canplay:
        this.canPlay = true;
        this.setPlayerStatus(AudioPlayerContstants.playerStatus.stopped);
        break;
    case AudioPlayerContstants.eventType.load:
    case AudioPlayerContstants.eventType.progress:
        this.gotMoreData();
        break;
    case AudioPlayerContstants.eventType.timeUpdate:
        this.updatePlayerTime();
        break;
    case AudioPlayerContstants.eventType.error:
        this.playPauseBtn.get(0).removeEventListener("click", this, false);
        this.sliderThumb.hide();
        break;
    case AudioPlayerContstants.eventType.ended:
        this.moveThumb(0);
        this.audioElement.pause();
    case AudioPlayerContstants.eventType.pause:
    case AudioPlayerContstants.eventType.emptied:
        this.setPlayerStatus(AudioPlayerContstants.playerStatus.stopped);
        break;
    }
};
AudioPlayer.prototype.setPlayerStatus = function (a) {
    if (!this.canPlay) {
        return;
    }
    switch (a) {
    case AudioPlayerContstants.playerStatus.notLoaded:
        this.playPauseBtn.removeClass("pause").removeClass("not-loaded").addClass("play");
        break;
    case AudioPlayerContstants.playerStatus.stopped:
        this.playPauseBtn.removeClass("pause").removeClass("not-loaded").addClass("play");
        break;
    case AudioPlayerContstants.playerStatus.buffering:
        this.sliderThumb.show();
        break;
    case AudioPlayerContstants.playerStatus.playing:
        this.sliderThumb.show();
        break;
    }
    this.status = a;
};
AudioPlayer.prototype.getDuration = function () {
    return this.audioElement.duration;
};
AudioPlayer.prototype.gotMoreData = function () {};
AudioPlayer.prototype.updatePlayerTime = function () {
    if (this.status === AudioPlayerContstants.playerStatus.stopped || this.status === AudioPlayerContstants.playerStatus.notLoaded) {
        return;
    }
    if (!this.userDraggingTimeControl) {
        var a = parseInt(this.audioElement.currentTime / this.getDuration() * 100, 10);
        this.moveThumb(a);
    }
    this.currentTimeLabel.html(this.formatTime(this.audioElement.currentTime));
};
AudioPlayer.prototype.onPlayPauseButtonClick = function () {
    if (!this.canPlay) {
        return;
    }
    switch (this.status) {
    case AudioPlayerContstants.playerStatus.buffering:
    case AudioPlayerContstants.playerStatus.playing:
        this.playPauseBtn.removeClass("pause").addClass("play");
        this.audioElement.pause();
        break;
    case AudioPlayerContstants.playerStatus.stopped:
    case AudioPlayerContstants.playerStatus.notLoaded:
        this.audioElement.play();
        this.playPauseBtn.removeClass("play").addClass("pause");
        break;
    }
};
AudioPlayer.prototype.handlePositionDrag = function (a) {
    a.stopPropagation();
    if (this.status !== AudioPlayerContstants.playerStatus.playing && this.status !== AudioPlayerContstants.playerStatus.buffering) {
        return;
    }
    switch (a.type) {
    case "touchstart":
        if (a.touches && a.touches.length > 0) {
            var c = a.touches[0];
            this.touchIdentifier = c.identifier;
            this.positionDrag(c);
            this.userDraggingTimeControl = true;
            this.sliderControl.addEventListener("touchmove", this, true);
        }
        break;
    case "touchout":
    case "touchend":
        this.changeCurrentTime(this.selectedTime);
        this.sliderControl.removeEventListener("touchmove", this, true);
        this.userDraggingTimeControl = false;
        delete this.selectedTime;
        delete this.touchIdentifier;
        break;
    case "touchmove":
        var c = a.touches[0];
        for (var b = 0; b < a.touches.length; b++) {
            if (a.touches[b].identifier = this.touchIdentifier) {
                c = a.touches[b];
                break;
            }
        }
        this.positionDrag(c);
        break;
    }
};
AudioPlayer.prototype.changeCurrentTime = function (a) {
    if (!a) {
        return;
    }
    this.audioElement.currentTime = a;
};
AudioPlayer.prototype.positionDrag = function (d) {
    var b = $(this.sliderControl).offset().left;
    var c = $(this.sliderControl).outerWidth();
    var a = Math.max(d.screenX - b, 0);
    percentage = Math.min(a * 100 / c, 100);
    console.debug("Touch: " + d.screenX + " width: " + c + " Slider left: " + b + " offsetX: " + a + " percentage: " + percentage);
    if (typeof (percentage) !== "number") {
        return false;
    }
    this.moveThumb(percentage);
    this.selectedTime = percentage * this.getDuration() / 100;
    return true;
};
AudioPlayer.prototype.moveThumb = function (a) {
    if (parseInt(this.sliderThumb.css("left"), 10) !== a) {
        this.sliderTrail.css("width", a + "%");
        this.sliderThumb.css("left", a + "%");
    }
};
AudioPlayer.prototype.formatTime = function (a) {
    return formatTime(a, "hh:mm:ss");
};
var createPlayerList = function (c, b) {
    var d = [];
    $.each(c, function (e, f) {
        d.push(renderEjs("audio_player_item", {
            feedItem: {
                title: f.title,
                audio_url: (f.audioLinks[0] || f.articleLink)
            }
        }));
    });
    b.html(d.join(""));
    var a = [];
    b.find(".se-audio-player").each(function (e, f) {
        a.push(new AudioPlayer($(f)));
    });
    return a;
};

function getServiceClient(k, j) {
    if (k.indexOf("%s") == -1) {
        if (j.methodParameterName === undefined) {
            k += "/%s";
        }
    }
    var f = {
        appendTypeToUrl: true,
        type: "json",
        timeout: 30000,
        authorizationHeader: "Authorization",
        onAjaxStart: $.noop,
        onAjaxComplete: $.noop,
        status: $(document)
    };
    j = $.extend({}, f, j);
    j.defaultParams = {
        version: config.apiVersion
    };
    var l = [];
    var b = {};
    var h = {};

    function g(p, o, n) {
        if (h.url == p && compareByContent(h.data, o) && h.auth == n) {
            return true;
        }
        h = {
            url: p,
            data: o,
            auth: n
        };
        return false;
    }
    function d(o, n) {
        return o + JSON.stringify(n);
    }
    function c(x, t, q, n, v, s, o, u) {
        if (!v) {
            v = $.noop;
        }
        if (!s) {
            s = $.noop;
        }
        var p = d(x, q);
        if (b[p] && !secondsHadPassed(config.networkCacheSecondsToLive)) {
            console.debug("AJAX CACHE HIT " + x);
            v(b[p]);
            h = {};
        } else {
            var w = function (y) {
                console.debug("AJAX CACHE ADD " + x);
                b[p] = y;
                v(y);
                h = {};
            };
            a(x, t, q, n, w, s, o, u);
        }
    }
    function a(A, x, s, o, z, u, p, y) {
        if (config.debug) {
            console.debug("AJAX " + x + " " + A + " " + (s ? JSON.stringify(s) + " " : ""));
        }
        y = y ? y : {
            headers: {}
        };
        var n = (typeof (y.allowBrowserCache) === "undefined") ? true : y.allowBrowserCache;
        if (!z) {
            z = $.noop;
        }
        if (!u) {
            u = $.noop;
        }
        var t = y.type || j.type;
        var q = x == "GET" ? "application/" + t : "application/x-www-form-urlencoded";
        var w = A.indexOf("count.json") >= 0 || y.inBackground;
        if (j.status.data("events")) {
            j.status.trigger("apiAjaxStart", [w]);
        } else {
            $(document).trigger("apiAjaxStart", [w]);
        }
        j.onAjaxStart(w);
        for (var v in s) {
            if (typeof (s[v]) === "string" && s[v] === "") {
                delete s[v];
            }
        }
        l.push($.ajax({
            url: A,
            dataType: t,
            cache: n,
            data: serviceClientfilterDataHook(j, s, p, A),
            type: x,
            timeout: j.timeout,
            headers: y.headers || {},
            beforeSend: function (C) {
                for (var B in y.headers) {
                    C.setRequestHeader(B, y.headers[B]);
                }
                serviceClientBeforeSendHook(j, C, p);
            },
            error: function (D, C) {
                h = {};
                try {
                    console.debug("AJAX ERROR for url " + A + (C ? " " + C : "") + (D ? " " + D.status + " text: " + D.responseText : ""));
                } catch (B) {
                    console.debug("AJAX ERROR" + (C ? " " + C : ""));
                }
                u(D, C);
            },
            success: function (B, D, E) {
                h = {};
                if (B == null || E.status === 0) {
                    if (config.debug) {
                        console.debug("AJAX ERROR empty");
                    }
                    u(E, "empty");
                } else {
                    if (config.debug) {
                        console.debug("AJAX SUCCESS", B);
                    }
                    try {
                        z(B);
                    } catch (C) {
                        if (config.debug) {
                            throw (C);
                        }
                    }
                }
            },
            complete: function (C, B) {
                j.onAjaxComplete(w);
                if (j.status.data("events")) {
                    j.status.trigger("apiAjaxComplete", [w]);
                } else {
                    $(document).trigger("apiAjaxComplete", [w]);
                }
            }
        }));
    }
    function e(n) {
        if (j.methodParameterName) {
            n = "";
        }
        return k.replace("%s", n) + (j.appendTypeToUrl && n.indexOf(".json") == -1 && n.indexOf(".xml") == -1 ? "." + j.type : "");
    }
    return {
        auth: j.auth,
        defaultParams: j.defaultParams,
        abort: function () {
            $.each(l, function (n, o) {
                o.abort();
            });
            l = [];
            h = {};
        },
        cacheKeyFor: d,
        clearCache: function (n) {
            if (n) {
                b[n] = {};
            } else {
                b = {};
            }
        },
        error: j.error,
        GET: function (u, p, t, q, o, n, s) {
            if (g(u, p, this.auth)) {
                return;
            }
            if (s && s.absoluteUrl) {
                a(u, "GET", $.extend({}, this.defaultParams, p || {}), this.auth, t, q || this.error, n, s);
            } else {
                if (j.methodParameterName) {
                    if (p == undefined) {
                        p = {};
                    }
                    p[j.methodParameterName] = u;
                }(o ? c : a)(e(u), "GET", $.extend({}, this.defaultParams, p), this.auth, t, q || this.error, n, s);
            }
        },
        POST: function (t, o, s, p, n, q) {
            if (g(t, o, this.auth)) {
                return;
            }
            if (j.methodParameterName) {
                if (o == undefined) {
                    o = {};
                }
                o[j.methodParameterName] = t;
            }
            a(e(t), "POST", $.extend({}, this.defaultParams, o), this.auth, s, p || this.error, n, q);
        }
    };
}
function getAuthData(c, a) {
    if (a) {
        return a;
    }
    if (c.authServer) {
        var b = user.identities.findIdentity(c.authServer);
        if (b) {
            return {
                authenticated: b.sessionId !== undefined || b.userId !== undefined,
                id: b.userId,
                sessionId: b.sessionId,
                authType: (b.authType) ? b.authType : "basic"
            };
        } else {
            return {
                authenticated: false
            };
        }
    }
    return {
        authenticated: false
    };
}
function serviceClientBeforeSendHook(b, c, a) {
    a = getAuthData(b, a);
    if (a.authType !== "basic") {
        return;
    }
    if (a.authenticated) {
        c.setRequestHeader(b.authorizationHeader, "Basic " + a.sessionId);
    }
}
function serviceClientfilterDataHook(c, b, a, d) {
    a = getAuthData(c, a);
    if (a.authenticated && a.authType === "url" && a.sessionId && d.indexOf("session_id=") < 0) {
        b.session_id = a.sessionId;
    }
    return b;
}
M = window.M = {};

function timeDistanceInWords(d, f) {
    var e = new Date(d).getTime();
    var g = (f || new Date()).getTime();
    var c = Math.round((g - e) / 1000);
    var b = Math.round(c / 60);
    var a = Math.round(b / 60);
    if (c <= 0) {
        return getMessage("locNow");
    } else {
        if (c < 60) {
            return getMessage("locTimeDistanceSeconds", c);
        } else {
            if (b < 60) {
                return getMessage("locTimeDistanceMinutes", b);
            } else {
                if (a < 24) {
                    return getMessage("locTimeDistanceHours", a);
                }
            }
        }
    }
    return renderTime(d);
}
function formatTime(e, a) {
    var b = "" + (Math.floor(e / 3600));
    var c = "" + (Math.floor((e - b * 3600) / 60));
    var d = "" + (Math.floor(e - b * 3600 - c * 60));
    d = (d.length === 1) ? "0" + d : d;
    c = (c.length === 1) ? "0" + c : c;
    b = (b.length === 1) ? "0" + b : b;
    a = a.replace(/hh/g, b);
    a = a.replace(/mm/g, c);
    a = a.replace(/ss/g, d);
    return a;
}
function convertDate(c, d) {
    if (!c) {
        return;
    }
    if (!d) {
        c = c.replace(/[\+-]([0-9])+/i, "+0000");
        var a = new Date(c);
        var b = new Date();
        b.setFullYear(a.getUTCFullYear());
        b.setMonth(a.getUTCMonth());
        b.setDate(a.getUTCDate());
        b.setMinutes(a.getUTCMinutes());
        b.setHours(a.getUTCHours());
        b.setMilliseconds(a.getUTCMilliseconds());
        return b;
    }
    return c;
}
function getDateFmt(a) {
    return M.dateFormat;
}
function isAllDay(e, c) {
    if (!e || !c) {
        return false;
    }
    var d = new Date(e),
        b = new Date(c),
        a = b.getTime() - d.getTime();
    ticksInDay = 24 * 60 * 60 * 1000, allowedDiffMin = 20, allowedDiff = allowedDiffMin * 60 * 1000, lowerDayLimit = ticksInDay - allowedDiff, upperDayLimit = ticksInDay + allowedDiff, isCloseToMidnight = (d.getHours() === 0 && d.getMinutes() < allowedDiffMin) || (d.getHours() === 23 && d.getMinutes() > 59 - allowedDiffMin);
    if (a > lowerDayLimit && a < upperDayLimit) {
        return true;
    }
    return false;
}
function renderEventTime(d, a, b, c) {
    if (!d) {
        return;
    }
    if (isAllDay(d, a)) {
        if (b) {
            return M.locWholeDayTimeInterval;
        } else {
            return renderTime(d, true, b) + " - " + renderTime(a, true, b) + " " + M.locWholeDayTimeInterval;
        }
    }
    return renderTime(d, c, b) + ((a) ? (" - " + renderTime(a, c, b)) : "");
}
function metersToMiles(a) {
    return a / 1609.344;
}
function milesToYards(a) {
    return a * 1760;
}
function yardsToFeet(a) {
    return a * 3;
}
function distanceToStringMetric(a) {
    if (a < 1) {
        return Math.round(a * 1000) + "m";
    } else {
        return Math.round(a * 10) / 10 + "km";
    }
}
function distanceToStringImperial(a) {
    if (a < 1) {
        var b = milesToYards(a);
        return Math.round(b) + "yd";
    } else {
        return Math.round(a * 10) / 10 + "mi";
    }
}
function geoDistanceToString(a) {
    if (device.locale.measurementSystem == "Metric") {
        return distanceToStringMetric(a);
    } else {
        return distanceToStringImperial(metersToMiles(a * 1000));
    }
}
function geoAngleToString(a) {
    var b;
    if (a >= -Math.PI / 8 && a <= Math.PI / 8) {
        b = "east";
    } else {
        if (a >= Math.PI / 8 && a <= Math.PI * 3 / 8) {
            b = "northEast";
        } else {
            if (a >= Math.PI * 3 / 8 && a <= Math.PI * 5 / 8) {
                b = "north";
            } else {
                if (a >= Math.PI * 5 / 8 && a <= Math.PI * 7 / 8) {
                    b = "northWest";
                } else {
                    if (a >= Math.PI * 7 / 8 || a <= -Math.PI * 7 / 8) {
                        b = "west";
                    } else {
                        if (a <= -Math.PI / 8 && a >= -Math.PI * 3 / 8) {
                            b = "southEast";
                        } else {
                            if (a <= -Math.PI * 3 / 8 && a >= -Math.PI * 5 / 8) {
                                b = "south";
                            } else {
                                if (a <= -Math.PI * 5 / 8 && a >= -Math.PI * 7 / 8) {
                                    b = "southWest";
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return b;
}
var relativeHrefsToApsolute = function (c, a) {
    var b = /href\s*?=\s*?['"]\/(.*?)['"]/;
    return (c || "").replace(b, "href='http://" + a + "/$1'");
};
var linkify = (function () {
    var a = /(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]/ig;
    return function (b) {
        return (b || "").replace(a, "<a href='$&'>$&</a>");
    };
})();
var stripTags = (function () {
    var a = $("<span></span>");
    return function (b) {
        if (!b) {
            return "";
        }
        var c = a.html(sanitizeHtml(b, true)).text();
        a.html("");
        return c;
    };
})();
var escapeHtml = (function () {
    var a = $("<span></span>");
    return function (b) {
        return a.text(b).html();
    };
})();

function sanitizeText(a) {
    a = $.trim(a);
    a = escapeHtml(a);
    return a.replace(/\n+/g, "<br />");
}
var sanitizeHtml = (function () {
    var h = /\n/g;
    var e = /<(script|iframe).*?>.*?<\/\1>/ig;
    var f = /<\/?(script|iframe).*?\/?>/ig;
    var a = /(<[^\s\/]+)\s*((?:\s*[\w-_]+(?:\s*=\s*(?:\"[^\"]*?\"|'[^']*?'|[^'\"<>\s]+)?))*)\s*(\/?>)/ig;
    var b = /(?:on\w+|style|width)(?:\s*=\s*(?:\"[^\"]*?\"|'[^']*?'|[^'\"<>\s]+)?)/ig;
    var d = /(?:href|src)(?:\s*=\s*(?:\"javascript:.*?\"|'javascript:.*?'|javascript))/ig;
    var g = /<(a).*?href(?:\s*=\s*(\"itms:.*?\"|\"itms:.*?\')).*?>.*?<\/\1>/ig;
    var c = function (k, p, j, o, l, n) {
        if (j) {
            j = j.replace(b, "");
            j = j.replace(d, "");
        }
        return p + " " + j + " " + o;
    };
    return function (j, k) {
        if (typeof (j) !== "string") {
            return j;
        }
        if (!k) {
            j = j.replace(h, "");
        }
        j = j.replace(e, " ");
        j = j.replace(f, " ");
        if (!device.supports.iTunesLink) {
            j = j.replace(g, "");
        }
        if (!k) {
            j = j.replace(a, c);
        }
        return j;
    };
})();

function pluralize(a, c, b) {
    return a + " " + (parseInt(a) == 1 ? c : b);
}
function getTextExcerpt(d, b) {
    if (d.length <= b) {
        return d;
    }
    var a = d.slice(0, b);
    var c = a.lastIndexOf(" ");
    if (c == -1) {
        c = a.lastIndexOf(".");
    }
    if (c != -1) {
        a = a.slice(0, c);
    } else {
        a = a.slice;
    }
    return a + "...";
}
function shortenUrl(c) {
    var a = c.replace(/^[a-z]+\:\/\//, "");
    var b = a.lastIndexOf("/");
    if (b != -1 && b != (a.length - 1)) {
        a = a.substr(0, b) + "/...";
    }
    return a;
}
function shorten(b, a) {
    return (b.length <= a) ? b : b.substring(0, a - 3) + "...";
}
function shortenShorcutName(a) {
    if (!a) {
        return "";
    }
    return (a.length <= 13) ? a : a.substring(0, 5) + "..." + a.substring(a.length - 5);
}
function getMessage() {
    var a = arguments[0];
    if (M[a]) {
        if (arguments.length > 1) {
            var b = cloneObj(M[a]);
            $.each(arguments, function (c, d) {
                b = b.replace("{" + c + "}", d);
                if (c > 0) {
                    b = b.replace(/(%d)|(%@)|(%f)/, d);
                }
            });
            return b;
        } else {
            return M[a];
        }
    } else {
        return a;
    }
}