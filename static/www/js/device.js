var deviceUrlProcessed;
var setLocaleHandler;
var device = window.device = {};
(function () {
    device.isPositionFixedSupported = function () {
        var a = $("<div style='height: 1000px;'><div id='fixed-position-test' style='width: 1px; height: 1px; opacity:0px; position: fixed; top: 0px;'></div></div>");
        $("body").append(a);
        var c = a.find("#fixed-position-test").offset().top;
        var d = window.pageYOffset;
        window.scrollTo(0, 10);
        var b = a.find("#fixed-position-test").offset().top;
        window.scrollTo(0, d);
        a.remove();
        if (c == b - 10) {
            return true;
        } else {
            return false;
        }
    };
    device.open = (function () {
        var d = [];
        var a = function (e) {
            if (device.platform == "web") {
                return;
            }
            //console.debug("DEVICE URL " + e);
            $("#deviceUrl").attr("src", e);
        };
        var c = function () {
            if (d.length === 0) {
                return;
            }
            a(d[0].deviceUrl);
            d.shift();
        };
        var b = setInterval(c, 200);
        return function (h, g) {
            var f = h + (g ? "/" + encodeURIComponent(JSON.stringify(g)) : "");
            var e = new Date().getTime();
            d.push({
                deviceUrl: f,
                timestamp: e
            });
        };
    })();
    
    device.getCallUrl = function (a, b) {
        var urlBase = "robot://"
        if(device.platform === "native") {
            urlBase = serverConfig.appDomain + "://";
        }
       return urlBase + a + (b ? "/" + encodeURIComponent(JSON.stringify(b)) : "");
    };
    device.platform_name = function () {
        return device.platform + "_" + device.name;
    };
    device.isPlatform = function (a) {
        return device.platform === a;
    };
    device.getSafariNavBarHeight = function () {
        return 60;
    };
    device.isStandalone = function () {
        if ("standalone" in navigator) {
            return navigator.standalone;
        }
        return false;
    };
    device.is = function (c) {
        var d = c.split(" or ");
        var e = false;
        for (var b = 0; b < d.length; b++) {
            var a = d[b];
            e = e || (device.name === a);
        }
        return e;
    };
    device.isPlatform = function (a) {
        return device.platform === a;
    };
    device.isNativeIPhone = function () {
        return device.platform === "native" && device.name === "iphone";
    };
    device.call = function (a, b) {
        //alert(a);
        var urlBase = "robot://"
        if(device.platform === "native") {
            urlBase = serverConfig.appDomain + "://";
        }
        device.open(urlBase + a, b);
    };
    device.robotfruit = function (a, b) {
        device.open("robotfruit://" + a, b);
    };
    device.orientation = function () {
        if (window.orientation) {
            return orientation === 0 || orientation === 180 ? "portrait" : "landscape";
        }
        return $(window).width() < se.getWindowHeight() ? "portrait" : "landscape";
    };
    device.name = (function () {
        var d = navigator.userAgent.toLowerCase();
        var b = ["android", "iphone", "ipod", "ipad", "blackberry", "nokia", "opera mobi"];
        for (var c in b) {
            var a = b[c];
            if (d.indexOf(a) != -1) {
                return a;
            }
        }
        return "pc";
    })();
    device.resolution = function () {
        return screen.width + "x" + screen.height;
    };
    if (location.protocol.indexOf("http") != -1 || location.protocol.indexOf("https") != -1) {
        device.scriptOrigin = "remote";
        device.platform = "web";
    } else {
        if (device.name === "pc" && location.hostname === "") {
            device.scriptOrigin = "local";
            device.platform = "web";
        } else {
            device.scriptOrigin = "local";
            device.platform = "native";
        }
    }
    if (location.href.indexOf("native") != -1) {
        device.platform = "native";
    }
    setSysInfoHandler = function (a) {
        if (a) {
            device.sysInfo = device.locale = a;
            if (a.dateFormat) {
                M.dateFormat = a.dateFormat;
            }
            if (a.timeFormat) {
                M.timeFormat = a.timeFormat;
            }
        }
    };
    device.supports = {
        html5AudioPlayer: device.isNativeIPhone(),
        iTunesLink: device.isNativeIPhone()
    };
    device.sysInfo = device.locale = {
        isPositionFixedSupported: false,
        locale: "en_US",
        measurementSystem: "Imperial"
    };
})();
var Binding = (function () {
    var a = {
        isVisible: function (c, b) {
            if (c.bindings && c.bindings.webVisibilityBinding && device.isPlatform("web") && !toBool(b.webVisibilityBinding)) {
                return false;
            }
            if (c.bindings && c.bindings.visibilityBinding && !toBool(b.visibilityBinding)) {
                return false;
            }
            if (c.bindings && c.bindings.inverseVisibilityBinding && toBool(b.inverseVisibilityBinding)) {
                return false;
            }
            return true;
        },
        getValue: function (g, d, b) {
            var f = d.split(".");
            var f = [];
            $.each(d.split("."), function (h, k) {
                var j = k.split("[");
                if (j.length === 1) {
                    f.push(k);
                } else {
                    $.each(j, function (l, n) {
                        if (n) {
                            if (n.indexOf("]") !== -1) {
                                f.push(n.substring(0, n.length - 1));
                            } else {
                                f.push(n);
                            }
                        }
                    });
                }
            });
            for (var c = 0; c < f.length; c++) {
                var e = f[c];
                if (typeof (g[e]) == "undefined" || g[e] === null) {
                    return b;
                } else {
                    g = g[e];
                }
            }
            return g;
        },
        setValue: function (g, d, h) {
            var f = d.split(".");
            for (var b = 0; b < f.length - 1; b++) {
                var e = f[b];
                if (!g[e]) {
                    g[e] = {};
                }
                g = g[e];
            }
            var c = f[f.length - 1];
            g[c] = h;
        },
        createObject: function (b) {
            b = $.extend({
                bindDesc: {},
                bindEnv: {},
                context: {}
            }, b);
            var g = {};
            if (b.bindDesc instanceof Array) {
                g = [];
                for (var c = 0; c < b.bindDesc.length; c++) {
                    var d = Binding.createObject({
                        bindDesc: b.bindDesc[c],
                        bindEnv: b.bindEnv
                    });
                    g.push(d);
                }
                return g;
            }
            for (var h in b.bindDesc) {
                var j = b.bindDesc[h],
                    o, l = b.bindEnv;
                if (typeof (j) === "object" && j.context) {
                    var e = b.context[j.context];
                    l = (typeof (e) != "undefined") ? e : {};
                }
                if (typeof (j) === "object" && j.androidPath && device.is("android")) {
                    o = a.getValue(l, j.androidPath, j.defaultValue);
                } else {
                    if (typeof (j) === "object" && j.androidPath && device.is("android")) {
                        o = a.getValue(l, j.androidPath, j.defaultValue);
                    } else {
                        if (typeof (j) === "object" && j.path) {
                            o = a.getValue(l, j.path, j.defaultValue);
                        } else {
                            o = typeof (j.value) != "undefined" ? j.value : j;
                        }
                    }
                }
                if (j.converter) {
                    var n = b.bindEnv.converters ? b.bindEnv.converters[j.converter.type] : window[j.converter.type];
                    if (n && typeof (n) == "function") {
                        var k = Binding.createObject({
                            bindDesc: j.converter.parameters,
                            bindEnv: b.bindEnv,
                            context: b.context
                        });
                        o = n(k);
                    }
                }
                if ($.isArray(o)) {
                    var f = [];
                    for (var c = 0; c < o.length; c++) {
                        f.push(Binding.createObject({
                            bindDesc: o[c],
                            bindEnv: b.bindEnv,
                            context: b.context
                        }));
                    }
                    o = f;
                }
                a.setValue(g, h, o);
            }
            return g;
        }
    };
    return a;
})();
getVal = Binding.getValue;
DistanceConverter = function (b) {
    var c = b.placeName;
    var d = "";
    if (c) {
        d = c;
    }
    var a = getPlaceDistanceText({
        geo: {
            coordinates: [b.latitude, b.longitude]
        }
    });
    if (a && d !== "") {
        d += ", ";
    }
    if (a) {
        d += a;
    }
    return d;
};
RecurrenceDescriptionConverter = function (g) {
    var a = g.recurrenceMask;
    if (!a) {
        return false;
    }
    a = parseInt(a, 10);
    var f = "";
    if (a == 127) {
        f = M.locEveryDay;
    } else {
        if (a == 31) {
            f = M.locWeekdays;
        } else {
            if (a == 96) {
                f = M.locWeekends;
            } else {
                var h = "";
                var b = false;
                for (i = 0; i < 7; i++) {
                    h += h ? ", " : "";
                    b = (a % 2);
                    a = parseInt(a / 2, 10);
                    h += M.locDayOfWeek[i].substring(0, 3);
                }
                f = h;
            }
        }
    }
    var k = convertDate(g.startDate, g.useDeviceTimeZone);
    var e = convertDate(g.endDate, g.useDeviceTimeZone);
    var j = new Date(k);
    var d = new Date(k);
    var c = new Date(d.getTime() - j.getTime());
    if (c.getTime() !== 0 && c.getHours() !== 24) {
        f += ",";
        f += " " + M.locFrom + " " + j.toString(M.timeFormat);
        f += " " + M.locTill + " " + d.toString(M.timeFormat);
    }
    return f;
};
SpecializedMapButtonVisibilityConverter = function (a) {
    if (a.placeId) {
        return false;
    } else {
        if (a.longitude && a.latitude) {
            return true;
        } else {
            return false;
        }
    }
};
DurationConverter = function (b) {
    var a = parseInt(b.duration_in_seconds, 10);
    if (a) {
        return formatTime(a, "mm:ss");
    }
};
LocalizedStringConverter = function (b) {
    var a = b.key;
    if (M[a]) {
        return M[a];
    } else {
        return a;
    }
};
TextTransformConverter = function (a) {
    switch (a.transformType) {
    case "ToUpperCase":
        return a.value ? a.value.toUpperCase() : a.value;
        break;
    }
    return a.value;
};
ApplicationEnvironmentConverter = function (c) {
    var b = c.key,
        d = RobotfruitApp.getModule(RobotfruitApp.MODULES.PLACES) || {}, a = RobotfruitApp.getModule(RobotfruitApp.MODULES.COMMUNITY) || {};
    switch (b) {
    case "configuration/communityModule":
        return RobotfruitApp.getModule(RobotfruitApp.MODULES.COMMUNITY);
    case "configuration/places/canShowOnYelp":
        return d.viewOnYelpButtonVisible;
    case "configuration/places/canShowNearbyTweets":
        return d.nearbyTweetsButtonVisible;
    case "configuration/removeRobotFruitBranding/removeRobotFruitBranding":
        return RobotfruitApp.application.removeRobotFruitBranding;
    case "configuration/subscriptionsEnabled":
        return a.subscriptionsEnabled;
        break;
    case "configuration/privateMessagesEnabled":
        return a.subscriptionsEnabled;
        break;
    case "loggedInMemberID":
        return user.getUserId("RobotfruitNetwork");
    }
};
URLEncodeConverter = function (a) {
    var b = a.string;
    return encodeURIComponent(b);
};
StringFormatterConverter = function (b) {
    var d = [];
    for (var a = 1; a < 10; a++) {
        if (typeof (b["param" + a]) == "undefined") {
            break;
        }
        d.push(b["param" + a]);
    }
    var c = b.formatString;
    for (a = 0; a < d.length; a++) {
        c = c.replace(/%@/, d[a]);
    }
    c = c.replace(/%@/g, "");
    return c;
};
SpecializedNameInitialsConverter = NameConverter = function (f) {
    var c = f.fullName,
        g = f.type,
        d, a = "",
        b = "",
        e = "";
    if (!c) {
        return;
    }
    d = c.split(" ", 2);
    a = d[0];
    lastName = d[1];
    e += a;
    if (lastName) {
        e += " " + lastName.substring(0, 1) + ".";
    }
    return e;
};
NetworkIdComparisonConverter = function (b) {
    var a = b.networkIds;
    return $.inArray("" + RobotfruitApp.getNid(), a) !== -1;
};
TimeDistanceConverter = function (c) {

    var d = convertDate(c.startTime, c.useDeviceTimeZone);
    var b = convertDate(c.endTime, c.useDeviceTimeZone);
    var a = false;
    if (c.longitude && c.latitude) {
        a = getPlaceDistanceText({
            geo: {
                coordinates: [c.latitude, c.longitude]
            }
        });
    }
    var e = "";
    if (d && b) {
        e = renderEventTime(d, b, c.hideDate, c.hideTime);
    } else {
        if (d) {
            e = renderEventTime(d, null, c.hideDate, c.hideTime);
        }
    }
    if (a && e !== "") {
        e += ", ";
    }
    if (a) {
        e += a;
    }
    return e;
};
HtmlAttachmentConverter = function (d) {
    var b = d.body,
        a = d.attachments || {}, c = d.leadImage || getVal(a, "images[0].src", false);
    return insertImageAttachments(b, a.images, c);
};
JavascriptEvaluationConverter = function (params) {
    var result = false;
    try {
        var result = eval(params.code);
        if (typeof (result) == "function") {
            return result(params);
        } else {
            return result;
        }
    } catch (e) {
        return false;
    }
};
var TestBinding = function () {
    test("TestBinding creation of simple object", function () {
        var a = {
            id: {
                path: "id",
                context: "global"
            },
            title: {
                path: "title"
            },
            "place.imageUrl": {
                converter: {
                    type: "concatConverter",
                    parameters: {
                        left: {
                            path: "[place].[imageUrls].[0]"
                        },
                        right: {
                            path: "[place].[imageUrls].[0]"
                        }
                    }
                }
            }
        };
        var b = {
            title: "_name",
            place: {
                imageUrls: ["_url"]
            },
            converters: {
                concatConverter: function (g) {
                    return g.left + g.right;
                }
            }
        };
        var c = {
            id: "_id",
            title: "_name",
            place: {
                imageUrl: "_url_url"
            }
        };
        var d = Binding.createObject({
            bindDesc: a,
            bindEnv: b,
            context: {
                global: {
                    id: "_id"
                }
            }
        });
        var f = JSON.stringify(d);
        var e = JSON.stringify(c);
        ok(f === e);
    });
};
(function (a) {
    var c = false;
    window.globalStopClickPropagation = function (d) {
        d = d || 2000;
        c = true;
        setTimeout(function () {
            c = false;
        }, d);
    };
    var b = false;
    document.addEventListener("click", function (d) {
        console.debug("global bubble: " + d.type);
    }, false);
    document.addEventListener("click", function (d) {
        console.debug("global capture: " + d.type);
        if (c) {
            c = false;
            console.debug("preventing default: ");
            d.stopPropagation();
            d.preventDefault();
        }
    }, true);
    document.addEventListener("touchstart", function (d) {}, true);
    document.addEventListener("touchend", function (d) {}, true);
    document.addEventListener("touchcancel", function (d) {}, true);
    a.fn.touchEvents = function (d) {
        var e = a.extend({
            delayActive: 100
        }, d);
        return this.each(function () {
            var g = false;
            var f = a(this);
            var h;
            f.bind("touchstart", function (k) {
                console.debug("Touch " + k.type);
                var j = a(this);
                if (e.delayActive) {
                    if (h) {
                        clearTimeout(h);
                    }
                    h = setTimeout(function () {
                        if (!g) {
                            j.addClass("se-active");
                        }
                    }, e.delayActive);
                } else {
                    j.addClass("se-active");
                }
            }).bind("touchmove", function (j) {
                console.debug("Touch " + j.type);
                g = true;
                a(this).removeClass("se-active");
            }).bind("touchend", function (j) {
                console.debug("Touch " + j.type);
                if (!g && !c) {
                    c = true;
                    setTimeout(function () {
                        c = false;
                    }, 2000);
                    a(this).trigger("fastClick");
                }
                a(this).removeClass("se-active");
                if (h) {
                    clearTimeout(h);
                }
                g = false;
            }).bind("touchcancel", function (j) {
                console.debug("Touch " + j.type);
                a(this).removeClass("se-active");
                if (h) {
                    clearTimeout(h);
                }
                g = false;
            });
        });
    };
})(jQuery);

config = window.config = {};
config.networkTimeout = 30000;
config.secondsBetweenGeoPositioning = 240;
config.networkCacheSecondsToLive = 20;
config.debug = true;
config.designMode = true;
removeLastSlash = function (a) {
    if (!a) {
        return a;
    }
    if (a.charAt(a.length - 1) == "/") {
        return a.substring(0, a.length - 1);
    }
    return a;
};


    config.apiVersion = 12;
    config.radius = 50000;
    if (device.platform == "native" || device.scriptOrigin === "local") {
        config.googleMapsApi = "http://maps.google.com";
    } else {
        config.googleMapsApi = "/services/Proxy.ashx?gm";
    }
    if (window.serverConfig) {
        config.designMode = serverConfig.designMode;
        config.configurationApi = removeLastSlash(serverConfig.configurationApi);
        config.robotfruitApi = removeLastSlash(serverConfig.robotfruitApi);
        config.networkId = serverConfig.networkId;
    }


switch (device.name) {
case "iphone":
    config.authorizationHeader = "X-Authorization";
    break;
}
branding = (function () {
    return {
        getCssColor: function (a) {
            var b = function (c) {
                return parseInt(c, 16);
            };
            if (a.match(/^[0-9a-fA-F]{6}$/)) {
                return "#" + a.substring(0, 6);
            } else {
                if (a.match(/^[0-9a-fA-F]{8}$/)) {
                    return "rgba(" + b(a.substring(2, 4)) + ", " + b(a.substring(4, 6)) + ", " + b(a.substring(6, 8)) + ", " + (b(a.substring(0, 2)) / 255) + ")";
                } else {
                    if (a.match(/^#([0-9a-fA-F]{6})$/)) {
                        return a.substring(0, 7);
                    }
                }
            }
            return a;
        },
        doBranding: function (a, b) {
            var c = function (h) {
                var g = RobotfruitApp.getModule(RobotfruitApp.MODULES.HOME_SCREEN_GRID);
                var e = RobotfruitApp.getSkin();
                e.homeGrid = g;
                var f = renderEjs(h, e);
                evalCss(f);
                $(document).trigger("robotfruitCssLoaded", [a]);
                b();
            };
            var d = RobotfruitApp.getSkin().style || RobotfruitApp.getRelativeUrl("theme/styling.css");
            $.ajax({
                url: d,
                success: function (e) {
                    c(e);
                },
                error: function (e) {
                    c(e.responseText);
                }
            });
        }
    };
})();
I = {};
I.backBtnIcon = "http://robotfruit.com/images/mobile/back_arrow.png";
I.videoPlayIcon = "http://robotfruit.com/images/mobile/video-play.png";
I.audioPlayIcon = "http://robotfruit.com/images/mobile/audio-play.png";
I.searchIcon = "http://robotfruit.com/images/mobile/SearchIcon.png";
I.spinner19Dark = "http://robotfruit.com/images/mobile/SpinnerDarkIcon.png";
I.spinner19Light = "http://robotfruit.com/images/mobile/SpinnerLightIcon.png";
I.refreshIcon = "http://robotfruit.com/images/mobile/ToolbarRefreshIcon.png";
I.shareIcon = "http://robotfruit.com/images/mobile/ToolbarShareIcon.png";
I.likeIcon = "http://robotfruit.com/images/mobile/ToolbarLikeIcon.png";
I.unlikeIcon = "http://robotfruit.com/images/mobile/ToolbarUnlikeIcon.png";
I.categoriesIcon = "http://robotfruit.com/images/mobile/ToolbarFilterIcon.png";
I.backIcon = "http://robotfruit.com/images/mobile/ToolbarBackIcon.png";
I.commentIcon = "http://robotfruit.com/images/mobile/ToolbarCommentIcon.png";
I.fsCircleIcon = "http://robotfruit.com/images/mobile/icon_fs_circle.png";
I.twCircleIcon = "http://robotfruit.com/images/mobile/icon_tw_circle.png";
I.fbCircleIcon = "http://robotfruit.com/images/mobile/icon_fb_circle.png";
I.chiefIcon = "http://robotfruit.com/images/mobile/icon_chief.png";
I.postYesIcon = "http://robotfruit.com/images/mobile/CheckYesIcon.png";
I.postNoIcon = "http://robotfruit.com/images/mobile/CheckNoIcon.png";
I.chiefAvatarIcon = "http://robotfruit.com/images/mobile/chief_avatar.png";
I.dealRedeemedIcon = "http://robotfruit.com/images/mobile/icon_deal_redeemed.png";
I.prevIcon = "http://robotfruit.com/images/mobile/ToolbarPreviousIcon.png";
I.nextIcon = "http://robotfruit.com/images/mobile/ToolbarNextIcon.png";
I.pinIcon = "http://robotfruit.com/images/mobile/icon_pin.png";
I.videoOverlayIcon = "http://robotfruit.com/images/mobile/VideoFeedIcon.png";
I.pauseBtn = "http://robotfruit.com/images/mobile/pause_button.png";
I.playBtn = "http://robotfruit.com/images/mobile/play_button.png";
I.activityIndicator = "http://robotfruit.com/images/mobile/activityIndicator.png";
I.imageLoadingFailIcon = "http://robotfruit.com/images/mobile/imageLoadingFailIcon.png";
I.imageLoadingIcon = "http://robotfruit.com/images/mobile/imageLoadingIcon.png";
I.loaderIcon = "http://robotfruit.com/images/mobile/LoaderIcon.png";
I.disclosureIcon = "http://robotfruit.com/images/mobile/DisclosureIcon.png";
I.activityNote = "http://robotfruit.com/images/mobile/activityNoteIcon.png";
I.activityComment = "http://robotfruit.com/images/mobile/activityCommentIcon";
I.activityLike = "http://robotfruit.com/images/mobile/ActivityLikeIcon.png";
I.activityVideo = "http://robotfruit.com/images/mobile/ActivityVideoIcon.png";
I.activityPhoto = "http://robotfruit.com/images/mobile/ActivityPhotoIcon.png";
I.activityLink = "http://robotfruit.com/images/mobile/ActivityLinkIcon.png";
I.arrow = "http://robotfruit.com/images/mobile/ArrowIcon.png";
I.avatarDefault = "http://robotfruit.com/images/mobile/AvatarDefaultIcon.png";
I.infoComments = "http://robotfruit.com/images/mobile/infoCommentsListIcon.png";
I.infoLike = "http://robotfruit.com/images/mobile/infoLikeListIcon.png";
I.infoNote = "http://robotfruit.com/images/mobile/infoNoteListIcon.png";
I.infoClock = "http://robotfruit.com/images/mobile/infoClockListIcon.png";
I.infoCommentsHead = "http://robotfruit.com/images/mobile/infoCommentsHeaderIcon.png";
I.infoLikeHead = "http://robotfruit.com/images/mobile/infoLikeHeaderIcon.png";
I.infoNoteHead = "http://robotfruit.com/images/mobile/infoNoteHeaderIcon.png";
I.infoClockHead = "http://robotfruit.com/images/mobile/InfoClockHeaderIcon.png";
I.buttonProfile = "http://robotfruit.com/images/mobile/buttonProfileIcon.png";
I.buttonWebsite = "http://robotfruit.com/images/mobile/buttonWebsiteIcon.png";
I.buttonActivity = "http://robotfruit.com/images/mobile/ButtonActivityIcon.png";
I.buttonFriends = "http://robotfruit.com/images/mobile/buttonFriendsIcon.png";
I.buttonTwitter = "http://robotfruit.com/images/mobile/buttonTwitterIcon.png";
I.buttonFacebook = "http://robotfruit.com/images/mobile/buttonFacebookIcon.png";
I.titleDealsIcon = "http://robotfruit.com/images/mobile/titleDealsIcon.png";
I.signInFacebookIcon = "http://robotfruit.com/images/mobile/signInFacebookIcon.png";
I.signInTwitterIcon = "http://robotfruit.com/images/mobile/signInTwitterIcon.png";
I.signInMailIcon = "http://robotfruit.com/images/mobile/signInMailIcon.png";
I.mapButtonReload = "http://robotfruit.com/images/mobile/map_btn_reload_icon.png";
I.mapButtonLocate = "http://robotfruit.com/images/mobile/map_btn_locate_icon.png";
if (window.console == undefined) {
    console = window.console = {};
}
var methods = ["info", "debug", "warn", "error", "log"];
for (var i = 0; i < methods.length; i++) {
    var method = methods[i];
    if (!console[method]) {
        console[method] = function () {};
    }
    if (config.debug && device.platform === "native") {
        console[method] = (function () {
            var a = "[JS-" + method.toUpperCase() + "] ";
            return function () {
                device.call("system/log", {
                    message: a + $.makeArray(arguments).join(" ")
                });
            };
        })();
    }
}
function classExtend(a, b) {
    a.prototype = new b();
    a.prototype.constructor = b;
    a.prototype.parent = b.prototype;
}
function valOrDefault(b, a) {
    if (typeof (b) == "undefined") {
        return a;
    }
    if (b === null) {
        return a;
    }
    return b;
}
SEUrl = Class.extend({
    init: function (a) {
        this.url = a;
        this.params = {};
    },
    addParam: function (a, b) {
        if (typeof (b) == "undefined") {
            return;
        }
        this.params[a] = b;
        return this;
    },
    toString: function () {
        var b = this.url,
            a = b.indexOf("?") < 0;
        for (name in this.params) {
            var c = this.params[name];
            b += a ? "?" : "&";
            b += name + "=" + encodeURIComponent(c);
            a = false;
        }
        return b;
    },
    openInExternal: function () {
        openExternalUrl(this.toString());
    },
});

function callMethod(e, c, a) {
    var b, d;
    if (e instanceof Array) {
        for (b = 0; b < e.length; b++) {
            d = e[b];
            if (typeof (d[c]) == "function") {
                d[c].apply(d, a);
            }
        }
    }
}
function shortenText(b, a) {
    a = a || 160;
    b = textifyHtml(b || "");
    if (b.length > a) {
        b = b.substring(0, a) + "...";
    }
    return b;
}
function openExternalUrl(c) {
    if (device.platform == "native") {
        return device.call("load/url", {
            url: c,
            external: true
        });
    } else {
        var b = document.createElement("a");
        b.setAttribute("href", c);
        b.setAttribute("target", "_blank");
        var a = document.createEvent("Event");
        a.initEvent("click", true, false);
        b.dispatchEvent(a);
    }
}

function openInternalUrl(c)
{
    var b = document.createElement("a");
    b.setAttribute("href", c);
    var a = document.createEvent("Event");
    a.initEvent("click", true, false);
    b.dispatchEvent(a);
}

function openUrlInApp(a, internal) {
    if (device.platform == "native") {
        return device.call("load/url", {
            url: a,
            external: true,
            logoUrl: RobotfruitApp.skin.navigationBarLogo
        });
    } else {
    
        if(internal)
            openInternalUrl(a);
        else
            openExternalUrl(a);
    }
}
function secondsHadPassed(c) {
    var b = arguments.callee.caller.name;
    var d = new Date().getTime();
    var a = secondsHadPassed[b] && (d - secondsHadPassed[b]) / 600 >= c;
    secondsHadPassed[b] = d;
    return a;
}
function showCallStack() {
    var a = showCallStack,
        c = "Call stack:\n\n";
    var d = 10;
    while ((a = a.caller) !== null) {
        var b = a.toString().match(/^function (\w+)\(/);
        if (b && typeof (b) === "object") {
            b = b[1];
        } else {
            b = a.toString().substring(0, 64);
        }
        c += "F:" + b.substring(0, 64) + "\n";
        c += "A:" + parseArguments(a.arguments).substring(0, 128) + "\n";
        c += "\n";
        if (d-- === 0) {
            break;
        }
    }
    console.debug(c);
}
function getColorFromHex(a) {
    return {
        r: parseInt(a.substring(1, 3), 16),
        g: parseInt(a.substring(3, 5), 16),
        b: parseInt(a.substring(5, 7), 16)
    };
}
function parseArguments(b) {
    var d = [];
    for (var c = 0; c < b.length; c++) {
        if ("string" == typeof b[c]) {
            d.push('"' + b[c] + '"');
        } else {
            d.push(b[c]);
        }
    }
    return "(" + d.join(", ") + ")";
}
function deviceSpecific(a) {
    (a[device.platform + "_" + device.name] || a.other || $.noop)();
}
function assert(b, a) {
    if (config.debug) {
        if (!b) {
            console.log(a || "assertion has failed");
        }
    }
}
function cloneObj(b) {
    if (b == null || typeof (b) != "object") {
        return b;
    }
    var c = new b.constructor();
    for (var a in b) {
        c[a] = cloneObj(b[a]);
    }
    return c;
}
function firstNonEmptyString() {
    var b = "";
    for (var a = 0; a < arguments.length; a++) {
        b = arguments[a];
        if (b && b !== "") {
            return b;
        }
    }
    return b;
}
function cloneAllExcept(c, b) {
    if (c == null || typeof (c) != "object") {
        return c;
    }
    var d = new c.constructor();
    for (var a in c) {
        if ($.inArray(a, b) == -1) {
            d[a] = cloneObj(c[a]);
        }
    }
    return d;
}
function compareByContent(a, b) {
    return JSON.stringify(a) == JSON.stringify(b);
}
function firstNonEmpty(a, b) {
    if (a && a != "") {
        return a;
    }
    return b;
}
Date.prototype.atMidnight = function () {
    return this.getSeconds() == 0 && this.getMinutes() == 0 && this.getHours() == 0;
};

function URIDecodeObject(b) {
    var a = {};
    if (typeof (b) != "object") {
        return decodeURIComponent(b);
    }
    for (name in b) {
        var c = b[name];
        if (typeof (c) == "object") {
            a[name] = URIDecodeObject(c);
        } else {
            a[name] = decodeURIComponent(c);
        }
    }
    return a;
}
function paramsToObject(b) {
    if (!b) {
        return {};
    }
    var a = $.deparam(b);
    return URIDecodeObject(a) || {};
}
function getClientLanguage() {
    if (navigator.language) {
        return navigator.language.indexOf("hr") != -1 ? "hr" : "en";
    }
    return location.host.indexOf(".hr") != -1 ? "hr" : "en";
}
function toBool(a) {
    if (!a) {
        return false;
    }
    if (typeof a === "boolean") {
        return a;
    } else {
        if (typeof a === "string") {
            if (a.toUpperCase() === "TRUE" || a.toUpperCase() === "YES") {
                return true;
            } else {
                if (a.toUpperCase() === "FALSE" || a.toUpperCase() === "NO") {
                    return false;
                }
            }
            return a;
        }
    }
    return a;
}
function repeatNTimes(a, d, c) {
    var b;
    for (b = 1; b <= d; b++) {
        setTimeout(a, b * c);
    }
}
function openInBackground(b, a) {
    $("#backgroundUrl").remove();
    $("body").append("<iframe id='backgroundUrl' style='display: none' src='" + b + "'></iframe>");
    if (a) {
        $("#backgroundUrl").load(a);
    }
}
function getHost(b) {
    b = b.replace("http://", "");
    var a = b.split("/")[0] || "";
    return a;
}
function addParamToUrl(a) {
    var c = a.url,
        b = a.param,
        d = a.val;
    if (typeof (d) == "undefined") {
        return c;
    }
    c += (c.indexOf("?") >= 0 ? "&" : "?") + b + "=" + encodeURIComponent(d);
    return c;
}
function toAbsoluteUrl(b, a) {
    if (b.indexOf("htt") === 0) {
        return b;
    } else {
        return a + b;
    }
}
function makeUrlAbsolute(a) {
    if (a.indexOf("http://") == -1) {
        return "http://" + a;
    }
    return a;
}
function isValidUrl(a) {
    return a.indexOf("http:") != -1 || a.indexOf("www.") != -1;
}
function repeatString(b, a) {
    return new Array(isNaN(a) ? 1 : ++a).join(b);
}
function getHostAddress(a) {
    return a.replace(/(.*?):\/\/([\w\.]*?)\/.*/g, "$1://$2");
}
function getFromObjectList(c, a, d) {
    if (!d) {
        return false;
    }
    for (var b = 0; b < c.length; b++) {
        if (c[b][a].toString() === d.toString()) {
            return c[b];
        }
    }
}
function onGoogleMapsApiLoaded() {
    requireGoogleMapsApi.complete();
    delete requireGoogleMapsApi.complete;
    requireGoogleMapsApi.loaded = true;
}
function requireGoogleMapsApi(a) {
    if (requireGoogleMapsApi.loaded) {
        a();
        return;
    } else {
        requireGoogleMapsApi.complete = a;
        var b = document.createElement("script");
        b.type = "text/javascript";
        b.src = "http://maps.google.com/maps/api/js?sensor=false&callback=onGoogleMapsApiLoaded";
        document.body.appendChild(b);
    }
}
if (!this.JSON) {
    this.JSON = {};
}(function () {
    function f(n) {
        return n < 10 ? "0" + n : n;
    }
    if (typeof Date.prototype.toJSON !== "function") {
        Date.prototype.toJSON = function (key) {
            return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null;
        };
        String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function (key) {
            return this.valueOf();
        };
    }
    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap, indent, meta = {
            "\b": "\\b",
            "\t": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            '"': '\\"',
            "\\": "\\\\"
        }, rep;

    function quote(string) {
        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }
    function str(key, holder) {
        var i, k, v, length, mind = gap,
            partial, value = holder[key];
        if (value && typeof value === "object" && typeof value.toJSON === "function") {
            value = value.toJSON(key);
        }
        if (typeof rep === "function") {
            value = rep.call(holder, key, value);
        }
        switch (typeof value) {
        case "string":
            return quote(value);
        case "number":
            return isFinite(value) ? String(value) : "null";
        case "boolean":
        case "null":
            return String(value);
        case "object":
            if (!value) {
                return "null";
            }
            gap += indent;
            partial = [];
            if (Object.prototype.toString.apply(value) === "[object Array]") {
                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || "null";
                }
                v = partial.length === 0 ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]";
                gap = mind;
                return v;
            }
            if (rep && typeof rep === "object") {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    k = rep[i];
                    if (typeof k === "string") {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ": " : ":") + v);
                        }
                    }
                }
            } else {
                for (k in value) {
                    if (Object.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ": " : ":") + v);
                        }
                    }
                }
            }
            v = partial.length === 0 ? "{}" : gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}";
            gap = mind;
            return v;
        }
    }
    if (typeof JSON.stringify !== "function") {
        JSON.stringify = function (value, replacer, space) {
            var i;
            gap = "";
            indent = "";
            if (typeof space === "number") {
                for (i = 0; i < space; i += 1) {
                    indent += " ";
                }
            } else {
                if (typeof space === "string") {
                    indent = space;
                }
            }
            rep = replacer;
            if (replacer && typeof replacer !== "function" && (typeof replacer !== "object" || typeof replacer.length !== "number")) {
                throw new Error("JSON.stringify");
            }
            return str("", {
                "": value
            });
        };
    }
    if (typeof JSON.parse !== "function") {
        JSON.parse = function (text, reviver) {
            var j;

            function walk(holder, key) {
                var k, v, value = holder[key];
                if (value && typeof value === "object") {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }
            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }
            if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
                j = eval("(" + text + ")");
                return typeof reviver === "function" ? walk({
                    "": j
                }, "") : j;
            }
            throw new SyntaxError("JSON.parse");
        };
    }
}());
var Base64 = {};
Base64.code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
Base64.encode = function (t, u) {
    u = (typeof u == "undefined") ? false : u;
    var n, o, p, b, h, j, k, l, g = [],
        q = "",
        d, s, f;
    var a = Base64.code;
    s = u ? Utf8.encode(t) : t;
    d = s.length % 3;
    if (d > 0) {
        while (d++ < 3) {
            q += "=";
            s += "\0";
        }
    }
    for (d = 0; d < s.length; d += 3) {
        n = s.charCodeAt(d);
        o = s.charCodeAt(d + 1);
        p = s.charCodeAt(d + 2);
        b = n << 16 | o << 8 | p;
        h = b >> 18 & 63;
        j = b >> 12 & 63;
        k = b >> 6 & 63;
        l = b & 63;
        g[d / 3] = a.charAt(h) + a.charAt(j) + a.charAt(k) + a.charAt(l);
    }
    f = g.join("");
    f = f.slice(0, f.length - q.length) + q;
    return f;
};
Base64.decode = function (s, t) {
    t = (typeof t == "undefined") ? false : t;
    var n, o, p, h, j, k, l, b, g = [],
        q, f;
    var a = Base64.code;
    f = t ? Utf8.decode(s) : s;
    for (var e = 0; e < f.length; e += 4) {
        h = a.indexOf(f.charAt(e));
        j = a.indexOf(f.charAt(e + 1));
        k = a.indexOf(f.charAt(e + 2));
        l = a.indexOf(f.charAt(e + 3));
        b = h << 18 | j << 12 | k << 6 | l;
        n = b >>> 16 & 255;
        o = b >>> 8 & 255;
        p = b & 255;
        g[e / 4] = String.fromCharCode(n, o, p);
        if (l == 64) {
            g[e / 4] = String.fromCharCode(n, o);
        }
        if (k == 64) {
            g[e / 4] = String.fromCharCode(n);
        }
    }
    q = g.join("");
    return t ? Utf8.decode(q) : q;
};
var Tea = {};
Tea.encrypt = function (l, j) {
    if (l.length == 0) {
        return ("");
    }
    var t = Tea.strToLongs(Utf8.encode(l));
    if (t.length <= 1) {
        t[1] = 0;
    }
    var d = Tea.strToLongs(Utf8.encode(j).slice(0, 16));
    var g = t.length;
    var w = t[g - 1],
        u = t[0],
        b = 2654435769;
    var f, c, o = Math.floor(6 + 52 / g),
        s = 0;
    while (o-- > 0) {
        s += b;
        c = s >>> 2 & 3;
        for (var h = 0; h < g; h++) {
            u = t[(h + 1) % g];
            f = (w >>> 5 ^ u << 2) + (u >>> 3 ^ w << 4) ^ (s ^ u) + (d[h & 3 ^ c] ^ w);
            w = t[h] += f;
        }
    }
    var a = Tea.longsToStr(t);
    return Base64.encode(a);
};
Tea.decrypt = function (a, j) {
    if (a.length == 0) {
        return ("");
    }
    var t = Tea.strToLongs(Base64.decode(a));
    var d = Tea.strToLongs(Utf8.encode(j).slice(0, 16));
    var g = t.length;
    var w = t[g - 1],
        u = t[0],
        b = 2654435769;
    var f, c, o = Math.floor(6 + 52 / g),
        s = o * b;
    while (s != 0) {
        c = s >>> 2 & 3;
        for (var h = g - 1; h >= 0; h--) {
            w = t[h > 0 ? h - 1 : g - 1];
            f = (w >>> 5 ^ u << 2) + (u >>> 3 ^ w << 4) ^ (s ^ u) + (d[h & 3 ^ c] ^ w);
            u = t[h] -= f;
        }
        s -= b;
    }
    var l = Tea.longsToStr(t);
    l = l.replace(/\0+$/, "");
    return Utf8.decode(l);
};
Tea.strToLongs = function (c) {
    var b = new Array(Math.ceil(c.length / 4));
    for (var a = 0; a < b.length; a++) {
        b[a] = c.charCodeAt(a * 4) + (c.charCodeAt(a * 4 + 1) << 8) + (c.charCodeAt(a * 4 + 2) << 16) + (c.charCodeAt(a * 4 + 3) << 24);
    }
    return b;
};
Tea.longsToStr = function (d) {
    var b = new Array(d.length);
    for (var c = 0; c < d.length; c++) {
        b[c] = String.fromCharCode(d[c] & 255, d[c] >>> 8 & 255, d[c] >>> 16 & 255, d[c] >>> 24 & 255);
    }
    return b.join("");
};
var Base64 = {};
Base64.code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
Base64.encode = function (t, u) {
    u = (typeof u == "undefined") ? false : u;
    var n, o, p, b, h, j, k, l, g = [],
        q = "",
        d, s, f;
    var a = Base64.code;
    s = u ? Utf8.encode(t) : t;
    d = s.length % 3;
    if (d > 0) {
        while (d++ < 3) {
            q += "=";
            s += "\0";
        }
    }
    for (d = 0; d < s.length; d += 3) {
        n = s.charCodeAt(d);
        o = s.charCodeAt(d + 1);
        p = s.charCodeAt(d + 2);
        b = n << 16 | o << 8 | p;
        h = b >> 18 & 63;
        j = b >> 12 & 63;
        k = b >> 6 & 63;
        l = b & 63;
        g[d / 3] = a.charAt(h) + a.charAt(j) + a.charAt(k) + a.charAt(l);
    }
    f = g.join("");
    f = f.slice(0, f.length - q.length) + q;
    return f;
};
Base64.decode = function (s, t) {
    t = (typeof t == "undefined") ? false : t;
    var n, o, p, h, j, k, l, b, g = [],
        q, f;
    var a = Base64.code;
    f = t ? Utf8.decode(s) : s;
    for (var e = 0; e < f.length; e += 4) {
        h = a.indexOf(f.charAt(e));
        j = a.indexOf(f.charAt(e + 1));
        k = a.indexOf(f.charAt(e + 2));
        l = a.indexOf(f.charAt(e + 3));
        b = h << 18 | j << 12 | k << 6 | l;
        n = b >>> 16 & 255;
        o = b >>> 8 & 255;
        p = b & 255;
        g[e / 4] = String.fromCharCode(n, o, p);
        if (l == 64) {
            g[e / 4] = String.fromCharCode(n, o);
        }
        if (k == 64) {
            g[e / 4] = String.fromCharCode(n);
        }
    }
    q = g.join("");
    return t ? Utf8.decode(q) : q;
};
var Utf8 = {};
Utf8.encode = function (a) {
    var b = a.replace(/[\u0080-\u07ff]/g, function (d) {
        var e = d.charCodeAt(0);
        return String.fromCharCode(192 | e >> 6, 128 | e & 63);
    });
    b = b.replace(/[\u0800-\uffff]/g, function (d) {
        var e = d.charCodeAt(0);
        return String.fromCharCode(224 | e >> 12, 128 | e >> 6 & 63, 128 | e & 63);
    });
    return b;
};
Utf8.decode = function (b) {
    var a = b.replace(/[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g, function (d) {
        var e = ((d.charCodeAt(0) & 15) << 12) | ((d.charCodeAt(1) & 63) << 6) | (d.charCodeAt(2) & 63);
        return String.fromCharCode(e);
    });
    a = a.replace(/[\u00c0-\u00df][\u0080-\u00bf]/g, function (d) {
        var e = (d.charCodeAt(0) & 31) << 6 | d.charCodeAt(1) & 63;
        return String.fromCharCode(e);
    });
    return a;
};
SEImgLoader = Class.extend({
    init: function (b) {
        var a = $.extend({
            maxConcurentReq: 3,
            queueType: "fifo",
            timeout: 100
        }, b);
        $.extend(this, a);
        this.queue = [];
        this.activeReq = 0;
    },
    loadImg: function (a) {
        this.queue.push(a);
        this.checkImgQueue();
    },
    checkImgQueue: function () {
        var b = undefined,
            c = this.queue,
            a = this.activeReq,
            d = this.queueType,
            e = undefined;
        if (!c.length) {
            return;
        }
        if (a > this.maxConcurentReq) {
            return;
        }
        switch (d) {
        case "fifo":
            b = c.shift();
            break;
        }
        e = b.attr("data-src");
        this.activeReq += 1;
        b.load(functor(this, "onLoad"));
        b.error(functor(this, "onError"));
        b.attr("src", e);
    },
    onLoad: function () {
        this.activeReq -= 1;
        this.checkImgQueue();
    },
    onError: function () {
        this.activeReq -= 1;
        this.checkImgQueue();
    }
});
SEImage = ComponentBase.extend({
    cls: "se-avatar-border se-center se-box-shadow se-block",
    baseTag: "span",
    init: function (b) {
        this._super(b);
        var a = $.extend({
            src: "",
            width: $(window).width() - 40,
            height: $(window).height() / 2,
            scale: ScaleProportional(),
            crop: "no-crop",
            maxWidth: $(window).width() - 40,
            maxHeight: $(window).height() / 2,
            overlaySrc: false,
            overlayWidth: false,
            ovelayHeight: false,
            onClick: $.noop
        }, b);
        $.extend(this, a);
        this.size = this.scale(this);
        this.jImgContainer = $("<span></span>");
        this.jImgContainer.addClass("se-crop img-loading se-inline-block");
       
        this.jContent.css(this.size);
        this.jContent.css({
            margin: "auto"
        });
        this.jContent.append(this.jImgContainer);
        this.jImg = $("<img></img>");
         if(this.abs)
        {
            this.jImgContainer.css({ position: "absolute", top: "4px"});
            this.size.height = "auto";
        }
        this.jImg.attr("src", this.src);
        if (this.crop == "no-crop") {
            this.jImg.css(this.size);
        }
        this.jImg.load(functor(this, "onImgLoad"));
        this.jImg.error(functor(this, "onImgError"));
        this.jImgContainer.append(this.jImg);
        if (this.overlaySrc) {
            this.jOverlay = $("<img></img>");
            this.jOverlay.attr("src", this.overlaySrc);
            this.jOverlay.addClass("se-cropable");
            this.jOverlay.css({
                width: this.overlayWidth,
                height: this.overlayHeight,
                left: (this.size.width - this.overlayWidth) / 2,
                top: (this.size.height - this.overlayHeight) / 2,
                position: "absolute"
            });
            this.jImgContainer.append(this.jOverlay);
        }
        this.jImgContainer.touchEvents().bind("fastClick click", this.onClick);
    },
    load: function (a, b) {
        this.anchorContent(a);
    },
    onImgLoad: function (a) {
        if (this.crop != "no-crop") {
            cropImage(a, this.crop);
        }
    },
    onImgError: function (a) {
        newsImageLoadError(a);
    }
});
ScaleProportional = function (a) {
    return function (c) {
        var d = {
            width: c.width,
            height: c.height
        }, b = c.width / c.height;
        if (d.width > c.maxWidth) {
            d.width = c.maxWidth;
            d.height = d.width / b;
        }
        if (d.height > c.maxHeight) {
            d.height = c.maxHeight;
            d.width = d.height * b;
        }
        return d;
    };
};
ScaleAspectFit = function () {
    return function (b) {
        var d = {
            width: b.width,
            height: b.height
        }, a = b.width / b.height,
            c = b.maxWidth / b.maxHeight;
        if (d.width <= b.maxWidth && d.height <= b.maxHeight) {
            return d;
        }
        if (a > c) {
            d.width = b.maxWidth;
            d.height = d.width / a;
        } else {
            d.height = b.maxHeight;
            d.width = d.height * a;
        }
        return d;
    };
};
ScaleAspectFill = function () {
    return function (b) {
        var d = {
            width: b.width,
            height: b.height
        }, a = b.width / b.height,
            c = b.maxWidth / b.maxHeight;
        if (a < c) {
            d.width = b.maxWidth;
            d.height = d.width / a;
        } else {
            d.height = b.maxHeight;
            d.width = d.height * a;
        }
        return d;
    };
};
SEYouTubeEmbed = ComponentBase.extend({
    init: function (b) {
        var a = $.extend({
            width: false,
            height: false,
            youTubeVideoId: false
        }, b);
        $.extend(this, a);
        this._super(b);
    },
    getYouTubeIFrameSrc: function () {
        return "http://www.youtube.com/embed/" + this.youTubeVideoId;
    },
    load: function (a, b) {
        this.jContent.html('<iframe class="se-video-iframe" type="text/html" frameborder="0" src="' + this.getYouTubeIFrameSrc() + '"></iframe>');
        this.anchorContent(a);
    }
});
SEVideo = ComponentBase.extend({
    init: function (b) {
        this._super(b);
        var a = $.extend({
            src: false,
            width: $(window).width() - 40,
            height: Math.round($(window).width() * 3 / 4),
            thumbSrc: false
        }, b);
        $.extend(this, a);
    },
    loadEmbedded: function (b, c) {
        var d = getYouTubeVideoId(this.src),
            a = d;
        if (a) {
            this.addChild(new SEYouTubeEmbed({
                width: this.width,
                height: this.height,
                youTubeVideoId: d
            }));
        } else {
            this.loadAsLink(b, c);
        }
    },
    loadAsLink: function (a, b) {
        this.addChild(new SEImage({
            src: this.thumbSrc,
            width: this.width,
            height: this.height,
            overlaySrc: imageUrl("http://robotfruit.com/images/mobile/video-play.png"),
            overlayWidth: 111,
            overlayHeight: 107,
            onClick: functor(this, "openVideo")
        }));
    },
    load: function (a, b) {
        if (device.is("iphone or pc")) {
            this.loadEmbedded(a, b);
        } else {
            this.loadAsLink(a, b);
        }
        this.anchorContent(a);
    },
    openVideo: function () {
        if (device.platform === "native") {
            device.call("load/video", {
                url: getVideoUrl(this.src)
            });
        } else {
            openExternalUrl(this.src);
        }
    }
});
SEAudio = ComponentBase.extend({
    init: function (c) {
        this._super(c);
        var b = $.extend({
            src: "",
            title: ""
        }, c);
        this.src = b.src.replace(/^https:/i, "http:");
        this.title = b.title;
        var a = document.createElement("audio");
        this.canPlayAudio = a.canPlayType("audio/mpeg");
    },
    load: function (a, c) {
        var b;
        if (this.canPlayAudio) {
            if (device.is("iphone")) {
                b = $('<div class="se-text-center"><audio class="se-inline-block" src="' + this.src + '" controls="true"></audio></div>');
            } else {
                b = $(renderEjs("audio_player_item", {
                    feedItem: {
                        title: this.title,
                        audio_url: this.src
                    }
                }));
                this.player = new AudioPlayer(b);
            }
        } else {
            b = renderEjs("audio_preview", {
                is_embedded: false,
                audio_url: this.src
            });
        }
        this.jContent.html(b);
        this.anchorContent(a);
    }
});
SEMapImage = SEImage.extend({
    init: function (c) {
        var d = RobotfruitApp.getModule(RobotfruitApp.MODULES.PLACES) || {};
        var a = RobotfruitApp.getGeoPosition();
        var b = $.extend({
            name: "",
            zoom: 14,
            width: $(window).width() - 40,
            height: $(window).height() / 3,
            pinIcon: d.map_pin_small_image_url,
            longitude: a.coords.longitude,
            latitude: a.coords.latitude
        }, c);
        b.src = this.googleMapsUrl(b);
        this._super(b);
    },
    googleMapsUrl: function (d) {
        var f = d.width,
            a = d.height,
            e = f + "x" + Math.round(a),
            b = d.latitude,
            c = d.longitude;
        return getGoogleStaticMap(b, c, e, d.zoom, d.pinIcon);
    }
});
SEBackgroundImage = ComponentBase.extend({
    baseCls: "se-background-image",
    init: function (b) {
        this._super(b);
        var a = $.extend({
            src: undefined,
            onLoad: $.noop,
            width: 320,
            height: 460,
            maxWidth: $(window).width(),
            maxHeight: se.getWindowHeight(),
            scale: ScaleAspectFill()
        }, b);
        this.opt = a;
        this.jLoadingMessage = $(['<div id="loading-animation" class="se-home-background-loading-holder">', '<span class="se-loading se-spinner-small-icon"></span><span class="se-text">Loading background...</span>', "</div>"].join(""));
        this.jImg = $("<img></img>");
        this.jImg.attr("src", a.src);
        this.jImg.load(functor(this, "onLoad"));
        this.jImg.error(functor(this, "onError"));
        this.jContent.append(this.jLoadingMessage);
        this.jContent.append(this.jImg);
        this.css({
            width: a.maxWidth + "px",
            height: a.maxHeight + "px"
        });
        var c = a.scale(a);
        this.jImg.css({
            position: "absolute",
            left: ((a.maxWidth - c.width) / 2) + "px",
            top: ((a.maxHeight - c.height) / 2) + "px",
            width: c.width + "px",
            height: c.height + "px"
        });
    },
    load: function (a, b) {
        a.append(this.jContent);
    },
    onLoad: function () {
        this.jLoadingMessage.hide();
        this.opt.onLoad(this);
    },
    onError: function () {}
});
SEToast = ComponentBase.extend({
    init: function (b) {
        this._super(b);
        var a = $.extend({
            toastDurationMs: 3000
        }, b);
        $.extend(this, a);
        this.jToast = $(renderEjs("toast_item", {}));
        this.jToastMessage = this.jToast.find("#message");
        this.scrollHandler = functor(this, "onScroll");
        window.addEventListener("scroll", this.scrollHandler, false);
    },
    load: function (a, b) {
        a.append(this.jToast);
    },
    unload: function () {
        this.jToast.remove();
        window.removeEventListener("scroll", this.scrollHandler, false);
    },
    onScroll: function () {
        var a = window.pageYOffset + se.getWindowHeight() - 80;
        this.jToast.css({
            top: a
        });
    },
    setTimeout: function (a, b) {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = false;
        }
        this.timer = setTimeout(b, a);
    },
    showToast: function (a, b) {
        b = b || this.toastDurationMs;
        this.setTimeout(b, functor(this, "hideToast"));
        this.jToastMessage.html(a);
        this.jToast.addClass("se-show");
        this.toastVisible = true;
    },
    hideToast: function () {
        this.toastVisible = false;
        this.jToast.removeClass("se-show");
    }
});

SENavBarAddition = ComponentBase.extend({
    init: function (a) {
        a = $.extend({}, a);
        this._super(a);
        if (a.height) {
            this.height = a.height;
        }
    },
    willAppear: function (a) {
        this._super(a);
        if (!this.height) {
            this.height = this.jContent.outerHeight();
        }
        se.navigationBar.addAddition(this.jContent, this.height);
    },
    load: function () {}
});
Validators = {
    Required: function (a) {
        var b = a.getVal();
        if (!b) {
            return getMessage("locForgottenItems", a.label || a.placeholder);
        }
        return false;
    }
};
validateFields = function () {
    var b = true;
    for (var a = 0; a < arguments.length; a++) {
        b = b && arguments[a].validate();
    }
    return b;
};
SEValidableField = ComponentBase.extend({
    init: function (b) {
        this._super(b);
        var a = $.extend({
            required: false,
            label: false,
            validator: $.noop
        }, b);
        this.label = a.label;
        if (a.required) {
            this.validator = Validators.Required;
        } else {
            this.validator = a.validator;
        }
    },
    validate: function () {
        var a = this.validator(this);
        if (a) {
            ui.error(a);
            return false;
        }
        return true;
    },
    error: function () {
        return this.validator(this);
    }
});
SETextField = SEValidableField.extend({
    placeholder: "",
    type: "text",
    init: function (a) {
        this._super(a);
        var b = $.extend({
            type: this.type,
            placeholder: this.placeholder,
            val: ""
        }, a);
        this.placeholder = b.placeholder;
        this.type = b.type;
        this.jField = $("<div class='se-field'></div>");
        this.jInput = $('<input type="' + this.type + '" autocapitalize="off" autocorrect="off" autocomplete="off"/>');
        this.jInput.val(b.val);
        this.jInput.attr("placeholder", this.placeholder);
        this.jField.html(this.jInput);
        this.jContent.html(this.jField);
    },
    load: function (a, b) {
        this.anchorContent(a);
    },
    getVal: function () {
        return this.jInput.val();
    },
    setVal: function (a) {
        return this.jInput.val(a);
    }
});
SETextArea = SEValidableField.extend({
    baseCls: "se-field",
    placeholder: "",
    init: function (a) {
        this._super(a);
        var b = $.extend({
            placeholder: this.placeholder,
            val: ""
        }, a);
        this.placeholder = b.placeholder;
        this.jField = $('<textarea placeholder="' + this.placeholder + '">' + b.val + "</textarea>");
        this.jContent.html(this.jField);
    },
    load: function (a, b) {
        this.anchorContent(a);
    },
    getVal: function () {
        return this.jField.val();
    }
});
SELabel = ComponentBase.extend({
    baseCls: "se-label",
    init: function (a) {
        this._super(a);
        var b = $.extend({
            text: ""
        }, a);
        this.text = b.text;
        this.jText = this.jContent;
        this.jText.html(this.text);
    },
    load: function (a) {
        this.anchorContent(a);
    },
    setText: function (a) {
        this.jText.html(a);
    }
});
SEFormPanel = ComponentBase.extend({
    baseCls: "se-form-panel",
    init: function (b) {
        var a = $.extend({
            percentages: [20, 80]
        }, b);
        this.percentages = a.percentages;
        this._super(b);
    },
    addChild: function (a, c) {
        var b = new SELabel({
            cls: "se-single-line",
            text: a.label
        }),
            d = new SEHLayout({
                percentages: this.percentages,
                items: [b, a]
            });
        this._super(d, c);
    }
});
SEButton = ComponentBase.extend({
    init: function (a) {
        this._super(a);
        this.settings = $.extend({
            icon: false,
            title: "&nbsp;",
            onClick: $.noop
        }, a);
        $.extend(this, this.settings);
    },
    willAppear: function (a) {
        this._super(a);
        if (this.jButton && !this.jButton.data("events")) {
            this.jButton.touchEvents().bind("click fastClick", this.settings.onClick);
        }
    },
    load: function (a, b) {
        this.jButton = $(renderEjs("button_item", {
            data: this.settings
        }));
        this.jTitle = this.jButton.find("#title");
        this.jButton.touchEvents().bind("click fastClick", this.settings.onClick);
        this.jContent.html(this.jButton);
        this.anchorContent(a);
    },
    setTitle: function (a) {
        this.title = a;
        this.jTitle.html(this.title);
    }
});
SESeparator = ComponentBase.extend({
    init: function (a) {
        this._super();
        this.settings = $.extend({
            style: "separatorEmpty"
        }, a);
        this.cssClass = "se-separator-empty se-style-" + this.settings.style;
    },
    load: function (a, c) {
        if (this.settings.style == "separatorCellGroup") {
            var b = $("<div class='se-cell-group-separator'><div class='se-line'></div></div>");
        } else {
            var b = $("<div class='" + this.cssClass + "'></div>");
        }
        a.append(b);
    }
});
SEDisclosure = ComponentBase.extend({
    init: function (a) {
        this._super();
        this.settings = $.extend({
            title: "&nbsp;",
            iconName: "",
            icon: "",
            onClick: $.noop
        }, a);
        this.settings.iconName = this.settings.iconName || this.settings.icon;
        this.jButton = $(renderEjs("disclosure_item", {
            data: this.settings
        }));
        this.jButton.touchEvents().bind("click fastClick", functor(this, "onButtonClicked"));
        this.jTitle = this.jButton.find("#title");
        this.jContent = this.jButton;
    },
    onButtonClicked: function () {
        this.settings.onClick();
    },
    load: function (a, b) {
        this.anchorContent(a);
    },
    setTitle: function (a) {
        this.jTitle.html(a);
    }
});
SEDisclosureCheckBox = SEDisclosure.extend({
    init: function (a) {
        this._super(a);
        opt = $.extend({
            onChange: $.noop,
            checked: false
        }, a);
        $.extend(this, opt);
        this.jCheckedIcon = this.jContent.find("#right-icon");
        this.jCheckedIcon.removeClass("se-disclosure-icon-dark");
        this.setIcon();
    },
    onButtonClicked: function () {
        this.checked = !this.checked;
        this.setIcon();
        this.onChange(this);
        this._super();
    },
    setIcon: function () {
        this.jCheckedIcon.removeClass("no-post yes-post");
        if (this.checked) {
            this.jCheckedIcon.addClass("yes-post");
        } else {
            this.jCheckedIcon.addClass("no-post");
        }
    },
    setChecked: function (a) {
        this.checked = a;
        this.setIcon();
    },
    getChecked: function () {
        return this.checked;
    }
});
SENavButton = ComponentBase.extend({
    init: function (a) {
        this._super(a);
        a = $.extend({
            icon: "",
            onClick: $.noop,
            title: "",
            position: "append"
        }, a);
        this.position = a.position;
        this.icon = a.icon;
        this.onClick = a.onClick;
        this.title = a.title;
    },
    willAppear: function (b) {
        this._super(b);
        var a = new NavigationBarButton({
            icon: this.icon,
            onClick: this.onClick,
            title: this.title
        });
        a.attachTo(se.navigationBar, {
            position: this.position
        });
    }
});
SEButtonPanel = ComponentBase.extend({
    init: function (a) {
        this._super(a);
        this.jContent.addClass("se-button-panel se-hlayout");
    },
    wrapperForChild: function () {
        var a = $("<div></div>");
        a.addClass("se-wrapper se-column");
        this.jContent.append(a);
        return a;
    },
    addChild: function (a) {
        this._super(a);
        this.jContent.find(".se-wrapper").css({
            width: (100 / this.children.length) + "%",
            display: "inlineBlock"
        });
    },
    load: function (a, b) {
        this._super(a, b);
        this.anchorContent(a, b);
    }
});


SEShareButton = ComponentBase.extend({
    init: function (a) {
        this._super(a);
        this.settings = $.extend({
            articleLink: false,
            title: M.locShareNewsText
        }, a);
    },
    load: function (a) {
        if (this.settings.articleLink) {
            this.addChild(new SENavButton({
                icon: I.shareIcon,
                onClick: functor(this, "share")
            }));
        }
    },
    share: function () {
        var b = this.settings.articleLink,
            a = this.settings.title;
            
        navigateTo(getShareUrl(a, b));
    }
});
SEShoutListHeader = ComponentBase.extend({
    init: function (a) {
        this._super(a);
    },
    load: function (b, c) {
        markCurrentScreen("checkInSuccess");
        this.postponeAnchorContent(b, c);
        var a = new SEButtonPanel();
        /*a.addChild(new SEButton({
            title: M.locCheckInTitle,
            onClick: functor(this, "onCheckIn")
        }));*/
        a.addChild(new SEButton({
            title: M.locShoutDetailTitle,
            onClick: functor(this, "onShout")
        }));
        headerButtons = new SENavBarAddition({
            height: 55
        });
        headerButtons.addChild(new SESeparator());
        headerButtons.addChild(a);
        headerButtons.addChild(new SESeparator());
        this.addChild(headerButtons);
        this.anchorContent();
    },
    onCheckIn: function () {
        navigateTo(getPlacesUrl());
    },
    onShout: function () {
        navigateTo(getNewShoutUrl());
    }
});
$(document).bind("shoutSent shoutLikeToggled", function () {
    se.deleteCachedCanvases(2);
});
SEGalleryDisclosure = ComponentBase.extend({
    init: function (e) {
        var d = $.extend({
            gallery: [],
            onClick: $.noop
        }, e);
        $.extend(this, d);
        this.jContent = $(renderEjs("gallery_disclosure_item", {}));
        this.jContent.touchEvents().bind("click fastClick", functor(this, "onButtonClicked"));
        this.jImagesHolder = this.jContent.find("#images-holder");
        this.jGalleryContent = this.jContent.find(".gallery-content");
        for (var a = 0; a < Math.min(this.gallery.length, 4); a++) {
            var b = this.gallery[a],
                c = b.thumbnail_src || b.src;
            this.jImagesHolder.append(renderEjs("gallery_disclosure_item_image", {
                item: {
                    src: c
                }
            }));
        }
    },
    wrapperForChild: function () {
        return this.jGalleryContent;
    },
    load: function (a, b) {
        this.anchorContent(a, b);
    },
    onButtonClicked: function () {
        this.onClick(this);
    }
});
SEPageHeaderPanel = ComponentBase.extend({
    init: function (a) {
        this._super(a);
        this.item = a;
    },
    load: function (a, d) {
        var c = $(renderEjs("detailed_title_item", {
            data: this.item
        }));
        var b = c.find(".se-info-bar-grid");
        if (createInfoBar(b, this.item)) {
            c.addClass("with-infobar");
        } else {
            b.hide();
        }
        this.jContent.append(c);
        this.anchorContent(a);
    }
});
SEHtml = ComponentBase.extend({
    init: function (a) {
        this._super(a);
        this.settings = $.extend({
            html: ""
        }, a);
    },
    load: function (a, b) {
        this.jHTML = $("<div class='se-html-item se-text-container'>" + this.settings.html + "</div>");
        this.jHTML.find("a").click(openExternalLink).attr("target", "_blank");
        this.jContent.append(this.jHTML);
        this.anchorContent(a);
    }
});

function _onGoogleMapsApiLoaded() {
    _requireGoogleMapsApi.complete();
    delete _requireGoogleMapsApi.complete;
    _requireGoogleMapsApi.loaded = true;
}
function _requireGoogleMapsApi(a, b) {
    if (_requireGoogleMapsApi.loaded) {
        a();
        return;
    } else {
        _requireGoogleMapsApi.complete = a;
        var c = document.createElement("script");
        c.type = "text/javascript";
        c.src = "http://maps.googleapis.com/maps/api/js?sensor=false&callback=_onGoogleMapsApiLoaded";
        document.body.appendChild(c);
        setTimeout(function () {
            if (!_requireGoogleMapsApi.loaded) {
                se.activityIndicator.hide()(b || $.noop)();
            }
        }, 7000);
    }
}
function _createGoogleMap(a, c, b) {
    se.activityIndicator.show();
    _requireGoogleMapsApi(function () {
        var d = new google.maps.LatLng(c.coords.latitude, c.coords.longitude);
        var e = d;
        var h = {
            zoom: 15,
            center: e,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            streetViewControl: false,
            mapTypeControl: false,
            navigationControl: true,
            navigationControlOptions: {
                style: google.maps.NavigationControlStyle.ANDROID
            },
            zoomControl: true,
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.SMALL,
                position: google.maps.ControlPosition.LEFT_BOTTOM
            }
        };
        var f = new google.maps.Map(b.get(0), h);
        var j;
        j = google.maps.event.addListener(f, "tilesloaded", function () {
            se.activityIndicator.hide();
            google.maps.event.removeListener(j);
        });
        var g = new google.maps.Marker({
            position: d
        });
        g.setMap(f);
        a(f);
    });
}
var MapComponent = (function () {
    var a = {
        create: function (d, b) {
            if (isBack) {
                window.scrollTo(0, 0);
            }
            b.empty();
            var c = $("<div id='mapCanvas'></div>");
            requireGeoPosition(function () {
                setTimeout(function () {
                    var f = c.position().top;
                    var e = se.getWindowHeight() - f;
                    c.css("height", e + "px");
                    _createGoogleMap(d.mapLoaded, currentGeoPosition, c);
                }, 500);
            }, function () {
                ui.error(M.locYouAreOffline);
            });
            b.append(c);
        }
    };
    return a;
})();
SEMapControl = Class.extend({
    init: function (b) {
        var a = $.extend({
            icon: "",
            index: 1,
            map: undefined,
            onClick: $.noop
        }, b);
        $.extend(this, a);
        this.jButton = $(renderEjs("map_control_button", {}));
        this.jButton.css({
            "background-image": "url(" + imageUrl(this.icon) + ")"
        });
        this.jButton.touchEvents().bind("click fastClick", functor(this, "onButtonClicked"));
    },
    getContent: function () {
        var a = this.jButton.get(0);
        a.index = this.index;
        return a;
    },
    attachToMap: function (a, b) {
        b = b || google.maps.ControlPosition.TOP_RIGHT;
        a.controls[b].push(this.getContent());
        this.map = a;
    },
    onButtonClicked: function () {
        this.onClick(this);
    }
});
SEStaticMap = ComponentBase.extend({
    init: function (a) {
        this._super(a);
        var b = RobotfruitApp.getModule(RobotfruitApp.MODULES.PLACES) || {};
        this.settings = $.extend({
            name: "",
            zoom: 14,
            pinIcon: b.map_pin_small_image_url,
            width: $(window).width() - 40,
            height: Math.max(Math.round($(window).height() / 3), 150),
        }, a);
    },
    load: function (b, h) {
        var k = this.settings.width;
        var a = this.settings.height;
        var j = k + "x" + a;
        var e = this.settings.latitude;
        var f = this.settings.longitude;
        var d = $(renderEjs("static_map_item", {
            width: k + "px",
            height: a + "px"
        }));
        var c = d.find(".map");
        c.css({
            width: k + "px",
            height: a + "px"
        });
        c.attr("src", getGoogleStaticMap(e, f, j, this.settings.zoom, this.settings.pinIcon));
        var g = this.settings.name;
        d.touchEvents().bind("click fastClick", function () {
            executeAction({
                type: "OpenPageAction",
                page: {
                    "$ref": "MapPage:Category:000000000000000000"
                },
                parameters: {
                    hideRefresh: true,
                    showInPage: true,
                    latitude: e,
                    longitude: f,
                    name: g,
                    showBack: true
                }
            });
        });
        b.append(d);
    }
});
NavigationBarButton = function (a) {
    this.settings = $.extend({
        title: "",
        id: false,
        icon: false,
        onClick: $.noop
    }, a);
    if (!this.settings.id) {
        this.settings.id = this.settings.title + ":" + this.settings.icon;
    }
    this.id = this.settings.id;
};
NavigationBarButton.prototype.attachTo = function (a, b) {
    a.addButton(this, b);
};
NavigationBarButton.prototype.jHtml = function () {
    var a = $(renderEjs("navigation_bar_button", this.settings));
    a.touchEvents().bind("click fastClick", this.settings.onClick);
    return a;
};
RefreshNavigationBarButton = function () {
    this.constructor.call(this, {
        id: "refresh",
        icon: I.refreshIcon,
        onClick: function () {
            reloadScreen();
        }
    });
};
RefreshNavigationBarButton.prototype = new NavigationBarButton();
RefreshNavigationBarButton.constructor = NavigationBarButton;
RefreshNavigationBarButton.prototype.parent = NavigationBarButton.prototype;
NavigationBar = Class.extend({
    init: function (a) {
        this.jAnchor = a;
        this.jAdditions = a.find("#additions");
        this.jAdditionsSpacer = a.find("#additions-spacer");
        this.jRightButtonList = a.find(".right-btn-list");
        this.jVisibleElements = a.find("#top-toolbar, #top-toolbar-spacer, #header");
        a.find(".home-button").touchEvents().bind("click fastClick", function () {
            if (loggedInSocially) {
                loggedInSocially = false;
                goToHomeScreen();
                
            } else {
                navigateBack(1);
            } 
                
        });
        this.events = $("<div></div>");
        this.buttons = [];
    },
    clearActiveButtons: function () {
        this.jVisibleElements.find(".se-active").removeClass("se-active");
    },
    height: function () {
        return 45;
    },
    hideBack: function () {},
    addAddition: function (b, a) {
        this.jAdditions.append(b);
        var c = $("<div style='background: black;'></div>");
        c.css({
            height: a + "px"
        });
        this.jAdditionsSpacer.append(c);
    },
    removeAdditions: function () {
        this.jAdditions.empty();
        this.jAdditionsSpacer.empty();
    },
    removeButtons: function () {
        this.events.trigger("navigationBarButtonsRemoved");
        this.jRightButtonList.empty();
        this.buttons.length = 0;
    },
    getButtonById: function (a) {
        return getFromObjectList(this.buttons, "id", a);
    },
    addButton: function (b, d) {
        var e = $.extend({
            position: "prepend"
        }, d);
        var a = this.getButtonById(b.id);
        if (a) {
            return false;
        }
        var c = b.jHtml();
        if (e.position == "prepend") {
            this.buttons.unshift(b);
            this.jRightButtonList.prepend(c);
        } else {
            this.buttons.push(b);
            this.jRightButtonList.append(c);
        }
        return true;
    },
    hide: function () {
        this.jVisibleElements.hide();
        this.shown = false;
    },
    show: function () {
        if (!this.shown) {
            this.jVisibleElements.show();
        }
        this.shown = true;
    }
});
ActivityIndicator = function (a) {
    this.jIndicator = a.find("#activityIndicator");
    this.count = 0;
    this.visible = false;
};
ActivityIndicator.prototype.show = function () {
    this.count++;
    if (this.visible) {
        return;
    }
    if (device.platform === "native") {
        device.call("ui/showActivityIndicator", {
            visible: true
        });
    } else {
        var a = window.pageYOffset + ($(window).height() / 2) - $("#activityIndicator").height();
        this.jIndicator.css("top", a + "px").show();
        this.jIndicator.show();
    }
};
ActivityIndicator.prototype.hide = function () {
    this.count = Math.max(0, this.count - 1);
    if (this.count === 0) {
        this.visible = false;
        if (device.platform === "native") {
            device.call("ui/showActivityIndicator", {
                visible: false
            });
        } else {
            this.jIndicator.hide();
        }
    }
};
ActivityIndicator.prototype.clear = function () {
    this.count = 0;
    this.hide();
};

var TabsComponent = (function () {
    var a = {
        create: function (e, b) {
            var f = {
                activeTab: 0
            };
            var g = e.tabs;
            var d = $(renderEjs("tabs_component", {}));
            var c = d.find(".tabLinks");
            var h = 100 / g.length;
            $.each(g, function (j, o) {
                var l = $('<li style="width:' + h + '%"><div class="link" id="' + j + '">' + o.title + "</div></li>");
                var k = $('<div id="' + j + '"class="tabContent"></div>');
                var n = function () {
                    o.select(o, k);
                    f.activeTab = j;
                    d.find(".tabLinks .selected, .tabContent.selected").removeClass("selected");
                    d.find("#" + j).addClass("selected");
                };
                l.find(".link").touchEvents().bind("fastClick click", function () {
                    var p = $(this).attr("class");
                    if (p.indexOf("selected") != -1) {
                        return;
                    }
                    n();
                });
                d.append(k);
                c.append(l);
                if (j === f.activeTab || o.id === f.activeTab) {
                    n();
                }
            });
            b.append(d);
        }
    };
    return a;
})();
SEList = ComponentBase.extend({
    init: function (a) {
        this.settings = $.extend({
            itemsPerPage: 15,
            hasSearch: false,
            listProvider: undefined,
            itemFactory: undefined
        }, a);
    },
    load: function (f, t) {
        var e = this.settings.itemsPerPage,
            o = this.settings.listProvider,
            d = this.settings.itemFactory;
        jListComponent = $(renderEjs("list_component", {}));
        f.html(jListComponent);
        var h = f.find("#loadMoreButtonContainer"),
            j = f.find("#loadMoreButtonContainer"),
            k = f.find("#newsFeedLoadMessage"),
            l = jListComponent.find("#search-form"),
            n = l.find(".se-search-input");
        h.touchEvents();
        var q = function (v, u) {
            window.scrollTo(0, 0);
            f.find("#newsFeed").empty();
            if (v.status == 0) {
                k.html("<p>" + M.locYouAreOffline + "</p>").show();
            } else {
                k.html("<p>" + M.locNewsLoadErrorMessage + "</p>").show();
            }
        };
        var s = function () {
            window.scrollTo(0, 0);
            f.find("#newsFeed").empty();
            f.find("#newsFeedLoadMessage").html("<p>" + M.locNoResults + "</p>").show();
        };
        var p = function (x, u, B) {
            var A = getVal(x, "paging.next");
            x = x.data;
            if (!u && (!x || x.length === 0)) {
                s();
                return;
            }
            if (A) {
                j.show();
                h.unbind("click fastClick").bind("click fastClick", function () {
                    j.hide();
                    o.findNext({
                        next: A
                    });
                });
            } else {
                j.hide();
            }
            var w = [];
            $.each(x, function (C, D) {
                w.push(d.createItemElement(D));
            });
            var v = function (D, C) {
                $.each(C, function (E, F) {
                    D.append(F);
                });
            };
            var y = f.find("#newsFeed");
            var z = y.parent();
            y.detach();
            if (!u) {
                y.empty();
            }
            v(y, w);
            z.prepend(y);
        };
        var g = f.find("#loading-indicator");
        g.hide();
        o.statusObject.unbind(".listComponent");
        o.statusObject.bind("apiAjaxStart.listComponent", function (u, v) {
            u.stopPropagation();
            if (!v) {
                g.show();
            }
        });
        o.statusObject.bind("apiAjaxComplete.listComponent", function (u, v) {
            u.stopPropagation();
            if (!v) {
                g.hide();
            }
        });
        o.statusObject.bind("findSuccess.listComponent", function (u, v, w) {
            p(v, false, w);
        });
        o.statusObject.bind("findError.listComponent", function (u, w, v) {
            q(w, v);
        });
        o.statusObject.bind("findNextSuccess.listComponent", function (u, v, w) {
            p(v, true, w);
        });
        o.statusObject.bind("findNextError.listComponent", function (u, w, v) {
            j.show();
        });
        var c = this.settings.hasSearch;
        if (c) {
            jListComponent.find(".se-search-li").show();
        }
        if (c) {
            var b = function () {
                var u = n.val();
                if (o.setQuery(u)) {
                    k.empty().hide();
                    f.find("#newsFeed").empty();
                    j.hide();
                    o.find({
                        offset: 0,
                        limit: e
                    });
                }
            };
            l.submit(function (u) {
                u.preventDefault();
                b();
            });
            l.find(".se-search-icon").unbind("click").bind("click", b);
        }
        var a = o.find({
            fromCache: true
        });
        if (a && !t.isReload) {
            p(a, false);
        } else {
            window.scrollTo(0, 0);
            o.find({
                offset: 0,
                limit: e
            });
        }
    }
});
seComponents.ListComponent = SEList;


PageBase = ScreenBase.extend({
    init: function (b, a) {
        this._super(a);
        this.pageParams = a.params || {};
        this.page = b;
    },
    addMenuItem: function (d) {
        var c = Binding.createObject({
            bindDesc: this.page.menuItem.bindings,
            bindEnv: {}
        }),
            e = c.title,
            b = undefined,
            a = this.page.menuItem.action;
        if (c.type == "AddMenuItem") {
            e = M.locAdd;
        } else {
            if (c.type == "ComposeMenuItem") {
                b = I.commentIcon;
            }
        }
        this.addChild(new SENavButton({
            position: "prepend",
            title: e,
            icon: b,
            onClick: function () {
                executeAction(a, c);
            }
        }));
    },
    willAppear: function (a) {
        if (this.page && this.page.menuItem) {
            this.addMenuItem(this.page.menuItem);
        }
        this._super(a);
    },
    authentication: function (a) {
        if ((typeof (this.page.realm) == "string" && this.page.realm != "None") && !user.authenticated("RobotfruitNetwork")) {
            return new seScreen.network_login({
                params: {
                    authServer: "RobotfruitNetwork",
                    onAuthenticate: reloadScreen
                }
            });
        }
        return this._super(a);
    },
    getContext: function () {
        return {
            page: this.pageParams,
            datasourceParameters: this.pageParams.dsParams
        };
    }
});
sePages = {};
var createPage = function (c, b) {
    var a = "create" + c.type,
        c;
    if (typeof (window[a]) == "function") {
        c = window[a](c, b);
    } else {
        var d = sePages[c.type];
        if (typeof (d) == "function") {
            c = new d(c, b);
        }
    }
    return c;
};
var unloadPage = function (b) {
    var a = "unload" + b.type;
    if (typeof (window[a]) == "function") {
        window[a](b);
    }
};
var createInfoBar = function (j, h) {
    var g = {
        segments: [{
            text: h.info1Text,
            icon: h.info1Icon
        }, {
            text: h.info2Text,
            icon: h.info2Icon
        }, {
            text: h.info3Text,
            icon: h.info3Icon
        }],
        infoBarType: h.infoBarType
    };
    var f = [];
    if (g.infoBarType && typeof (g.infoBarType) == "string") {
        var a = g.infoBarType.replace(/^(.*)?Segment(s)?(.*)/i, "$1Segment$2|$3").split("|");
        var c = a[0];
        var b = a[1];
    }
    switch (c) {
    case "OneSegment":
        j.addClass("se-one-column-grid");
        g.segments = g.segments.slice(0, 1);
        break;
    case "ThreeSegments":
        j.addClass("se-three-column-grid");
        g.segments = g.segments.slice(0, 3);
        break;
    case "TwoSegments":
        g.segments = g.segments.slice(0, 2);
        j.addClass("se-two-column-grid");
        break;
    default:
        j.addClass("se-three-column-grid");
        g.segments = g.segments.slice(0, 3);
        break;
    }
    var d = false;
    for (var e = 0; e < g.segments.length; e++) {
        var k = g.segments[e];
        if (k.icon && k.text) {
            d = true;
            break;
        }
    }
    if (!d) {
        return false;
    }
    switch (b) {
    case "Wide":
        j.addClass("se-wide");
        break;
    case "Short":
        j.addClass("se-short");
        break;
    }
    $.each(g.segments, function (n, l) {
        if (typeof (l.text) == "number" && !l.text) {
            l.text = "0";
        }
        var p = $(renderEjs("info_bar_column", l));
        f.push(p);
        if (l.icon && l.text) {
            var o = l.icon.replace(/\w+_(\w+)_(\w+).*/, "se-$1-icon-$2");
            p.find(".se-icon").addClass("se-icon-left");
            p.find(".se-icon").css({
                "background-image": "url(" + imageUrl(l.icon) + ")"
            });
            p.addClass("se-icon-left");
        } else {
            p.find(".se-icon").remove();
        }
    });
    f[0].addClass("se-first-column");
    f[f.length - 1].addClass("se-last-column");
    $.each(f, function (n, l) {
        j.append(l);
    });
    return true;
};
var createActivityItem = function (a, b) {
    var c = $(renderEjs("activity_feed_item", {
        feedItem: a
    }));
    createInfoBar(c.find(".se-info-bar-grid"), a);
    if (a.showSeparator) {
        c.addClass("se-show-separator");
    }
    return c;
};
var createItemElement = function (a, c) {
    var b = $(renderEjs(c, {
        feedItem: a
    }));
    createInfoBar(b.find(".se-info-bar-grid"), a);
    if (a.showSeparator) {
        b.addClass("se-show-separator");
    }
    return b;
};
var createPlacesElement = function (a, b) {
    a.info1Text = a.info1Text || a.infoText;
    a.info1Icon = a.info1Icon || a.infoImage;
    return createItemElement(a, b);
};
var getFromObjectList = function (c, a, d) {
    for (var b = 0; b < c.length; b++) {
        if (c[b][a] + "" === d + "") {
            return c[b];
        }
    }
    return false;
};
var createPageItemFactory = function (b, a) {
    return {
        getDefaultItem: function () {
            return b ? b[0] : {};
        },
        createItemElement: function (d, e) {
            var g = d.schema_uuid;
            if (!e) {
                e = getFromObjectList(b, "schema_uuid", g) || b[0];
            }
            var c = Binding.createObject({
                bindDesc: e.bindings,
                bindEnv: d,
                context: a
            });
            if (!Binding.isVisible(e, c)) {
                return $("");
            }
            if (e.type === "CommentItem") {
                var f = createItemElement(c, "comment_item");
            } else {
                if ((e.type === "ActivityItem" && e.style == "activityItem") || e.type === "ShoutsItem") {
                    var f = createItemElement(c, "shouts_feed_item");
                } else {
                    if (e.type === "ActivityItem" && (e.style == "read.received.message" || e.style == "sent.message")) {
                        var f = createItemElement(c, "shouts_feed_item");
                    } else {
                        if (e.type === "ActivityItem") {
                            var f = createActivityItem(c, e);
                        } else {
                            if (e.type === "SmallDisclosureItem") {
                                var f = createItemElement(c, "small_disclosure_item");
                            } else {
                                if (e.type === "NewsItem") {
                                    var f = createItemElement(c, "news_feed_item");
                                } else {
                                    if (e.type === "DealsItem") {
                                        var f = createItemElement(c, "deals_feed_item");
                                    } else {
                                        if (e.type === "PodcastItem") {
                                            var f = createItemElement(c, "podcasts_feed_item");
                                        } else {
                                            if (e.type === "CategoryItem") {
                                                var f = createItemElement(c, "categories_feed_item");
                                            } else {
                                                if (e.type === "CalendarItem") {
                                                    var f = createItemElement(c, "events_feed_item");
                                                } else {
                                                    if (e.type === "SimpleItem" && e.style == "peopleItem") {
                                                        var f = createItemElement(c, "people_feed_item");
                                                    } else {
                                                        if (e.type === "SimpleItem" && e.style == "placeItem") {
                                                            var f = createPlacesElement(c, "places_feed_item");
                                                        } else {
                                                            var f = createItemElement(c, "news_feed_item");
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (e.action) {
                f.touchEvents({
                    delayActive: 100
                }).bind("fastClick click", function () {
                    executeAction(e.action, d, a);
                });
            }
            return f;
        }
    };
};
sePages.PhotosPage = function (b, a) {
    this.page = b;
    this.dataSource = RobotfruitApp.getDatasourceByRef(b.dataSource);
    this.listFeedProvider = DataSourceListFeedProvider.instance(this.dataSource, a.params);
    this.imgLoader = new SEImgLoader({
        maxConcurentReq: 1
    });
};
classExtend(sePages.PhotosPage, ScreenBase);
sePages.PhotosPage.prototype.willAppear = function (a) {
    se.navigationBar.show();
    if (a.params.detailed_view) {
        setAndroidOptionsMenu(null, true);
    } else {
        refreshNavigationBarButton.attachTo(se.navigationBar, {
            position: "prepend"
        });
        setAndroidOptionsMenu();
    }
};
sePages.PhotosPage.prototype.onOrientationChange = function () {
    reloadScreen();
};
sePages.PhotosPage.prototype.didDisappear = function (a) {
    setAndroidOptionsMenu();
};
sePages.PhotosPage.prototype.load = function (d, s) {
    var t = this.page;
    var u = s.params;
    var b = this.dataSource;
    var o = this.listFeedProvider;
    var p = this;
    var q = function () {
        var w = $(renderEjs("load_message_item", {}));
        d.html(w);
    };
    if (u.detailed_view) {
        d.append(renderEjs("gallery_detail", {}));
        var j = d.find("#image");
        var f = d.find("#description");
        var e = d.find("#count");
        var k = j.parent();
        var n = d.find("#previous");
        var l = d.find("#next");
        var c = se.getWindowHeight() - 25 - se.navigationBar.height();
        k.css({
            height: c
        });
        var v = function (y) {
            y = y.data;
            var x = [];
            $.each(y, function (C, E) {
                var F = t.items[0];
                var D = Binding.createObject({
                    bindDesc: F.bindings,
                    bindEnv: E
                });
                if (Binding.isVisible(F, D)) {
                    x.push(D);
                }
            });
            var w = parseInt(u.select_index, 10) || 0;
            var B = function (C) {
                w = C;
                var D = x[w];
                if (j.is(":visible")) {
                    j.hide();
                    k.addClass("img-loading");
                } else {
                    k.removeClass("img-loading");
                    j.show();
                }
                if (w === 0) {
                    n.find(".se-btn-text").addClass("se-dissabled");
                } else {
                    n.find(".se-btn-text").removeClass("se-dissabled");
                }
                if (w >= x.length - 1) {
                    l.find(".se-btn-text").addClass("se-dissabled");
                } else {
                    l.find(".se-btn-text").removeClass("se-dissabled");
                }
                e.html((w + 1) + "/" + x.length);
                f.html(D.title);
                if (!D.imageUrl) {
                    k.removeClass("img-loading");
                    k.addClass("img-loading-failed");
                } else {
                    k.removeClass("img-loading-failed");
                    j.attr("src", D.imageUrl);
                }
                var E = y[w];
                var G = E.schema_uuid;
                var F = getFromObjectList(t.items, "schema", G) || t.items[0];
                var D = Binding.createObject({
                    bindDesc: F.bindings,
                    bindEnv: E
                });
                d.find("#details").unbind("click").bind("click", function () {
                    executeAction(F.action, E);
                });
                j.unbind("click").bind("click", function () {
                    executeAction(F.action, E);
                });
            };
            B(w);
            var A = function (C) {
                if (w > 0) {
                    B(w - 1);
                }
            };
            var z = function (C) {
                if (w < x.length - 1) {
                    B(w + 1);
                }
            };
            k.swipe({
                threshold: {
                    x: 10,
                    y: 10
                },
                swipeRight: A,
                swipeLeft: z
            });
            d.find("#previous").click(A);
            d.find("#next").click(z);
        };
    } else {
        var h = $(renderEjs("gallery_page", {}));
        d.append(h);
        var g = d.find("#gallery-list");
        if (device.is("pc")) {
            h.css({
                width: $(window).width() + "px",
                "overflow-x": "hiden"
            });
        }
        var v = function (z) {
            z = z.data;
            var A = $(window).width();
            var w = 3;
            var y = (A) / w;
            var x = 0;
            $.each(z, function (B, D) {
                var E = t.items[0];
                var C = Binding.createObject({
                    bindDesc: E.bindings,
                    bindEnv: D
                });
                if (!Binding.isVisible(E, C)) {
                    return;
                }
                var F = x;
                x++;
                C.width = y;
                C.height = y;
                var G = $(renderEjs("gallery_item", {
                    feedItem: C
                }));
                if ((B % w) === (w - 1)) {
                    G.addClass("se-last-column");
                }
                G.click(function () {
                    var H = $.extend({
                        page: t.id,
                        detailed_view: true,
                        select_index: F
                    }, u);
                    navigateTo(H._, H);
                });
                p.imgLoader.loadImg(G.find("img[data-src]"));
                g.append(G);
            });
        };
    }
    var a = o.find({
        fromCache: true
    });
    if (a && !isReload) {
        v(a);
    } else {
        o.find({
            offset: 0,
            limit: 30,
            success: function (w) {
                v(w);
            },
            error: q,
        });
    }
};
SEDetailsPage = PageBase.extend({
    init: function (b, a) {
        this._super(b, a);
        this.dataSource = RobotfruitApp.getDatasourceByRef(this.page.dataSource);
        this.authServer = getAuthServerForDataSource(this.dataSource);
        this.newsProvider = DataSourceListFeedProvider.instance(this.dataSource, a.params);
    },
    willDisappear: function (b, a) {
        setAndroidOptionsMenu();
        this._super(b);
    },
    addMenuItem: function (a) {
        this.menuItem = a;
    },
    doAddMenuItem: function (e, b) {
        if (!e) {
            return;
        }
        var d = Binding.createObject({
            bindDesc: e.bindings,
            bindEnv: b
        }),
            f = d.title,
            c = undefined,
            a = e.action;
        if (!Binding.isVisible(e, d)) {
            return;
        }
        if (d.type == "AddMenuItem") {
            f = M.locAdd;
        } else {
            if (d.type == "ComposeMenuItem") {
                c = I.commentIcon;
            }
        }
        this.addChild(new SENavButton({
            position: "prepend",
            title: f,
            icon: c,
            onClick: function () {
                executeAction(a, b);
            }
        }));
    },
    renderPage: function (e) {
        console.log(e);
        e.id = e.post_id || e.event_id || e.id;
        this.doAddMenuItem(this.menuItem, e);
        var f = createPageItemFactory(this.page.customItems),
            h = e.likeable || e.likable,
            c = false, //e.commentable && e.commentable !== "no",
            k = this,
            d = e.fb_commentable == "yes" ? e.link : false,
            j = this.page;
        var a = Binding.createObject({
            bindDesc: this.page.bindings,
            bindEnv: e
        });
        this.addChild(new SEPageHeaderPanel(a));
        this.addSeparator();
        if (a.leadImageUrl) {
            this.addChild(new SEImage({
                src: a.leadImageUrl,
                width: a.leadImageWidth,
                height: a.leadImageHeight
            }));
            this.addSeparator();
        }
        if (a.leadVideoUrl) {
            this.addChild(new SEVideo({
                src: a.leadVideoUrl,
                thumbSrc: getVideoImageUrl(a.leadVideoUrl),
                width: a.leadVideoWidth || $(window).width() - 40,
                height: a.leadVideoHeight || Math.round($(window).width() * 3 / 4),
            }));
            this.addSeparator();
        }
        if (a.leadAudioUrl) {
            this.addChild(new SEAudio({
                src: a.leadAudioUrl,
                title: a.title
            }));
            this.addSeparator();
        }
        if (a.leadMapLatitude && a.leadMapLongitude) {
            this.addChild(new SEStaticMap({
                latitude: a.leadMapLatitude,
                longitude: a.leadMapLongitude,
            }));
        }
        var b = e.attachments ? insertImageAttachments(a.body, e.attachments.images, a.leadImageUrl) : a.body;
        this.htmlComponent = new SEHtml({
            html: b
        });
        this.addChild(this.htmlComponent);
        if (a.readOriginalUrl) {
            var g = $("<a></a>", {
                href: a.readOriginalUrl,
                text: M.locReadOriginalArticle,
                target: "_blank",
                onClick: openExternalLink
            }).appendTo(this.htmlComponent.jHTML).wrap("<p></p>");
        }

        if (e.link) {
            this.addChild(new SEShareButton({
                articleLink: e.link
            }));
        }

        if (j.customItems) {
            $.each(j.customItems, function (o, n) {
                var l = createComponent(n, e, e, k.authServer, k.dataSource);
                if (l) {
                    k.addChild(l);
                }
            });
        }
        this.addSeparator();



        this.anchorContent();
    },
    load: function (d, e) {
        var f = e.params,
            c = f.itemId,
            b = {
                postId: c,
                success: functor(this, "renderPage"),
                error: functor(this, "onError"),
            };
        this.postponeAnchorContent(d, e);
        b.fromCache = true;
        var a = this.newsProvider.get(b);
        if (a) {
            this.renderPage(a);
        } else {
            b.fromCache = false;
            this.newsProvider.get(b);
        }
    },
    onError: function (b, a) {
        standardErrorHandler(b, a);
        navigateBack(1);
    }
});
sePages.DetailsPage = SEDetailsPage;
createComponent = function (g, d, a, b, f) {
    var c = Binding.createObject({
        bindDesc: g.bindings || {},
        bindEnv: a || {}
    });
    if (!Binding.isVisible(g, c)) {
        return false;
    }
    switch (g.type) {
    case "ShoutListHeader":
        return new SEShoutListHeader({});
    case "LabelSeparatorItem":
        return new SELabel({
            cls: "se-section-label",
            text: c.title
        });
        break;
    case "PhotoPreviewItem":
        return new SEGalleryDisclosure({
            gallery: c.photos,
            onClick: actionRunnable(g.action, a)
        });
        break;
    case "NewsDetailsTitleItem":
        if (c.iconUrl == "http://robotfruit.com/images/mobile/deal_title_transparent_icon.png") {
            c.iconUrl = "";
        }
        return new seComponents.DetailedTitleItem(c);
        break;
    case "VideoItem":
        return new SEVideo({
            src: c.videoUrl,
            thumbSrc: getVideoImageUrl(c.videoUrl),
            width: c.videoWidth,
            height: c.videoHeight,
        });
        break;
    case "MapItem":
        var h = $.extend(c, {
            width: $(window).width() - 40,
            height: 100
        });
        return new seComponents.StaticMapItem(c);
        break;
    case "SeparatorItem":
        return new seComponents.SeparatorItem({
            style: g.style
        });
        break;
    case "WebItem":
        return new seComponents.HTMLItem(c);
        break;
    case "SmallDisclosureItem":
        return new seComponents.DisclosureItem({
            title: c.title,
            iconName: c.iconName,
            onClick: actionRunnable(g.action, a)
        });
        break;
    case "MultiButtonItem":
        return new seComponents.ButtonItem({
            title: c.button1Title,
            onClick: actionRunnable(g.action, a)
        });
        break;
    case "ClaimCouponButton":
    case "BuyCouponButton":
        var e = robotfruit.providers.couponsProviderFactory.createFromDataSource(f);
        return new seComponents.ClaimCouponButtonItem({
            couponsProvider: e,
            authServer: b,
            article: a
        });
        break;
    case "ShareCouponButton":
        var e = robotfruit.providers.couponsProviderFactory.createFromDataSource(f);
        return new seComponents.ShareCouponButtonItem({
            couponsProvider: e,
            authServer: b,
            article: a
        });
        break;
    case "DealInfoPanel":
        return new seComponents.DealInfoPanel(c);
        break;
    case "PhotoItem":
        return new seComponents.PhotoItem(c);
        break;
    case "LeadImage":
        return new seComponents.LeadImageItem(c);
        break;
    case "ShareButton":
        return new seComponents.ShareButtonItem({
            articleLink: a.articleLink || a.link,
            title: a.title
        });
        break;
    case "ExtendedPlaceInfoItem":
        return new seComponents.ExtendedPlaceInfoItem(c);
        break;
    }
};
SECustomPage = PageBase.extend({
    init: function (b, a) {
        this._super(b, a);
        this.dataSource = RobotfruitApp.getDatasourceByRef(this.page.dataSource);
        this.authServer = getAuthServerForDataSource(this.dataSource);
        this.newsProvider = DataSourceListFeedProvider.instance(this.dataSource, a.params);
        this.jContent.append($("<div id='custom-section' style='padding-bottom: 10px;'></div><div id='comments-section'></div>"));
        if (this.page.cssClassName) {
            this.jContent.addClass(this.page.cssClassName);
        }
    },
    wrapperForChild: function (a) {
        if (!a) {
            return this.jContent;
        }
        return this.jContent.find(a);
    },
    onArticleLoaded: function (g, h, a) {
        var f = getFromObjectList(this.page.sections, "type", "Custom"),
            e = false,
            d = 0,
            c = false;
        f = f.items || f;
        this.loadedItem = a;
        for (var d = 0; d < f.length; d++) {
            e = f[d];
            c = createComponent(e, e, a, this.authServer, this.dataSource);
            if (c) {
                this.addChild(c, h, "#custom-section");
            }
        }
        var b = getFromObjectList(this.page.sections, "type", "Comments");

        this.anchorContent();
    },
    willDisappear: function (b, a) {
        setAndroidOptionsMenu();
        this._super(b, a);
    },
    onItemLoadError: function (b, a) {
        if (b.status == 0) {
            ui.error(M.locYouAreOffline);
        }
        navigateBack(1);
    },
    load: function (c, d) {
        var e = d.params,
            b = {
                postId: e.itemId,
                success: functor(this, "onArticleLoaded", [c, d]),
                error: functor(this, "onItemLoadError"),
            };
        this.postponeAnchorContent(c, d);
        b.fromCache = true;
        var a = this.newsProvider.get(b);
        if (a) {
            this.onArticleLoaded(c, d, a);
        } else {
            b.fromCache = false;
            this.newsProvider.get(b);
        }
    }
});
sePages.CustomPage = SECustomPage;
seComponents.HTMLItem = SEHtml;
seComponents.DetailedTitleItem = SEPageHeaderPanel;
seComponents.DisclosureItem = SEDisclosure;
seComponents.SeparatorItem = SESeparator;
seComponents.ButtonItem = SEButton;

seComponents.StaticMapItem = SEStaticMap;
seComponents.DealInfoPanel = function (a) {
    this.settings = $.extend({
        regularPrice: "&nbsp;",
        salesPrice: "&nbsp;",
        discount: "&nbsp;",
        expires: "&nbsp;"
    }, a);
};
classExtend(seComponents.DealInfoPanel, ComponentBase);
seComponents.DealInfoPanel.prototype.load = function (a, c) {
    var b = $(renderEjs("deal_info_panel", {
        data: this.settings
    }));
    a.append(b);
};
SEPhoto = ComponentBase.extend({
    init: function (a) {
        this._super(a);
        this.settings = $.extend({
            imageUrl: "",
            imageWidth: undefined,
            imageHeight: undefined
        }, a);
    },
    load: function (d, e) {
        var h = this.settings.imageWidth;
        var a = this.settings.imageHeight;
        var c = this.settings.imageUrl;
        var g = Math.min(h, $(window).width() - 44);
        var f = a / h * g;
        var b = $("<div class='se-normal-all-sides-margin'><div style='max-width: 100%; margin: 0 auto 0 auto;' class='se-crop	'><img class='se-cropable img-loading' src='" + imageUrl(c) + "' onLoad='cropImage(event);' onError='seImageLoadError(event)'></img></div></div>");
        b.find(".se-crop").css({
            width: g,
            height: f
        });
        d.append(b);
    }
});
seComponents.PhotoItem = SEPhoto;
SELeadImage = ComponentBase.extend({
    init: function (a) {
        this._super(a);
        this.settings = $.extend({
            imageUrl: ""
        }, a);
    },
    load: function (a, c) {
        var b = $("<div class='se-lead-image img-loading se-crop'><img class='se-cropable' style='display:none' onload='newsImageLoaded(event);seImageLoaded(event);' onerror='seImageLoadError(event)' src='" + imageUrl(this.settings.imageUrl) + "'></img></div>");
        a.append(b);
        console.log('loading lead image');
    }
});
seComponents.LeadImageItem = SELeadImage;
seComponents.ExtendedPlaceInfoItem = function (a) {
    this.settings = $.extend({
        avatarImageUrl: "",
        checkinCount: 0,
        chief: M.locChiefNobody,
        postedOnFacebook: false,
        postedOnTwitter: false,
        postedOnFoursquare: false
    }, a);
};
classExtend(seComponents.ExtendedPlaceInfoItem, ComponentBase);
seComponents.ExtendedPlaceInfoItem.prototype.load = function (a, c) {
    var d = this.settings;
    var b = $(renderEjs("extended_place_info_item", {
        model: d
    }));
    a.append(b);
};

seComponents.ShareButtonItem = SEShareButton;
seComponents.ClaimCouponButtonItem = function (a) {
    this.settings = $.extend({
        couponsProvider: undefined,
        authServer: "RobotfruitNetwork",
        article: undefined
    }, a);
    var b = this.settings.couponsProvider;
    b.statusObject.unbind(".couponButton");
    var c = this;
    b.statusObject.bind("apiAjaxStart.couponButton", function (d, e) {
        d.stopPropagation();
        if (c.jSpinner) {
            c.jSpinner.show();
        }
    });
    b.statusObject.bind("apiAjaxComplete.couponButton", function (d, e) {
        d.stopPropagation();
        if (c.jSpinner) {
            c.jSpinner.hide();
        }
    });
};
classExtend(seComponents.ClaimCouponButtonItem, ComponentBase);
seComponents.ClaimCouponButtonItem.prototype.buyCoupon = function () {
    var b = this.settings.couponsProvider;
    var a = this.settings.article;
    console.log('button');
    console.log(a);
    var c = this;
    this.jButton.hide();
    b.save({
        postId: a.post_id,
        success: function () {
            reloadScreen();
            se.showToast(M.locCouponClaimed);
        },
        error: function (d) {
            if (d.status == 200) {
                c.jButton.hide();
                c.jLabelPanelTitle.html(M.locNoCouponsLeft);
                c.jLabelPanelSubtitle.hide();
                c.jLabelPanel.show();
            } else if(d.status == 404)
            {
                 c.jButton.hide();
                c.jLabelPanelTitle.html('You dont have enough points');
                c.jLabelPanelSubtitle.hide();
                c.jLabelPanel.show();
            } else {
                c.jButton.show();
                c.jLabelPanel.hide();
            }
        }
    });
};
seComponents.ClaimCouponButtonItem.prototype.formatToCountdownTime = function (j) {
    var h = (new Date(j).getTime() - new Date().getTime()) / 1000;
    if (h < 0) {
        return false;
    }
    var e = (60 * 60 * 24),
        f = (60 * 60),
        g = 60,
        b, c, d, a = "";
    b = Math.floor(h / e);
    h -= b * e;
    c = Math.floor(h / f);
    h -= c * f;
    d = Math.floor(h / g);
    a += b ? (b + "d ") : "";
    if (!b) {
        a += c ? (c + "h ") : "";
        a += d ? (d + "m ") : "";
    }
    return a;
};
seComponents.ClaimCouponButtonItem.prototype.redeemCoupon = function () {
    var b = this.settings.couponsProvider;
    var a = this.settings.article;
    var c = this;
    this.jLabelPanel.hide();
    b.redeem({
        postId: a.post_id,
        success: function () {
            reloadScreen();
        },
        error: function (d) {
            reloadScreen();
        }
    });
};
seComponents.ClaimCouponButtonItem.prototype.load = function (d, f) {
    var a = this.settings.article;
    console.log('within button load');

    var c = a.availablecouponscount;
    var b = this.settings.authServer;
    var g = this.settings.couponsProvider;
    var h = this;
    var e = $(renderEjs("coupon_button_item", {
        data: {
            title: M.locUseCoupon + (c > 0 ? " (" + c + ")" : "")
        }
    }));
    this.jButton = e.find("#coupon-buy-button");
    this.jLabelPanel = e.find("#coupon-label-panel");
    this.jSpinner = e.find("#coupon-loading");
    this.jLabelPanelTitle = this.jLabelPanel.find(".se-title");
    this.jLabelPanelSubtitle = this.jLabelPanel.find(".se-subtitle");
    this.jLabelPanelDate = this.jLabelPanelSubtitle.find("#date");
    this.jLabelPanelCode = this.jLabelPanelSubtitle.find("#code");
    this.jBarcodePanel = e.find("#barcode-panel");
    this.jBarcode = this.jBarcodePanel.find("#coupon-barcode");
    this.jButton.touchEvents().unbind("fastClick click").bind("fastClick click", function () {
        serverConfig.referrer = location.href;
        requireAuthentication(function () {
            h.buyCoupon();
        }, null, b, true);
    });
    if (user.authenticated(b)) {
        if (a.couponcount > 0 && c <= 0) {
            h.jButton.hide();
            h.jLabelPanelTitle.html(M.locNoCouponsLeft);
            h.jLabelPanelSubtitle.hide();
            h.jLabelPanel.show();
        } else {
            g.get({
                postId: a.post_id,
                success: function (j) {
                    if (!j) {
                        h.jButton.show();
                        h.jLabelPanel.hide();
                    } else {
                        if (j.redemption_time) {
                            h.jLabelPanel.hide();
                            h.jButton.hide();
                            h.jBarcodePanel.show();
                            var barcodeImg = '<img id="barcode" style="border: 0; margin: 0" src="' + j.barcode_url + '" />';
                            if(j.code)
                                barcodeImg += '<div style="font-size: 50px; text-align: center; font-weight: bold; background: #FFFFFF; padding-bottom: 10px; border: 0">' + j.code + '</div>'
                            h.jBarcodeImg = $(barcodeImg);
                            h.jBarcode.html(h.jBarcodeImg);
                        } else {
                            h.jButton.hide();
                            h.jLabelPanelTitle.html(M.locCouponClaimed);
                            h.jLabelPanelSubtitle.show();
                            h.jLabelPanelDate.html(h.formatToCountdownTime(j.expiration_time));
                            h.jLabelPanelCode.html(j.code);
                            h.jLabelPanel.swipe({
                                treshold: {
                                    x: 260,
                                    y: 1000
                                },
                                swipeRight: function () {
                                    h.redeemCoupon();
                                }
                            });
                            h.jLabelPanel.show();
                        }
                    }
                },
                error: function (j) {
                    if (j.status == 200) {
                        h.jButton.show();
                        h.jLabelPanel.hide();
                    } else if(d.status == 404)
                    {
                        h.jLabelPanelTitle.html('You dont have enough points');
                        h.jLabelPanelSubtitle.hide();
                        h.jLabelPanel.show();
                    } else {
                        h.jLabelPanelTitle.html(M.locNoCouponsLeft);
                        h.jLabelPanelSubtitle.hide();
                        h.jLabelPanel.show();
                    }
                }
            });
        }
    } else {
        this.jButton.show();
    }
    d.append(e);
};




seComponents.ShareCouponButtonItem = function (a) {
        this.settings = $.extend({
            articleLink: a.article.link,
            title: a.article.title
        }, a);

};
classExtend(seComponents.ShareCouponButtonItem, ComponentBase);

seComponents.ShareCouponButtonItem.prototype.load = function (d, f) {
    console.log('within button load');

    var e = $(renderEjs("coupon_button_item", {
        data: {
            title:"Share Coupon"
        }
    }));
    var url = getShareUrl(this.settings.title, this.settings.articleLink);
    
    this.jButton = e.find("#coupon-share-button");
    this.jButton.touchEvents().unbind("fastClick click").bind("fastClick click", function () {
        navigateTo(url);
    });

    this.jButton.show();

    d.append(e);
};




SEListPage = PageBase.extend({
    init: function (c, b) {
        this._super(c, b);
        this.page = c;
        var a = RobotfruitApp.getDatasourceByRef(this.page.dataSource);
        this.listFeedProvider = DataSourceListFeedProvider.instance(a, b.params);
        if (c.search && c.search.type == "Remote") {
            this.hasSearch = true;
        } else {
            this.hasSearch = false;
        }
    },
    willAppear: function (a) {
        this._super(a);
        if (!this.page.hideRefresh) {
            refreshNavigationBarButton.attachTo(se.navigationBar, {
                position: "prepend"
            });
        }
    },
    load: function (c, d) {
        var a = RobotfruitApp.getDatasourceByRef(this.page.dataSource);
        this.postponeAnchorContent(c, d);
        this.listComponent = new seComponents.ListComponent({
            itemFactory: createPageItemFactory(this.page.items, this.getContext()),
            listProvider: this.listFeedProvider,
            hasSearch: this.hasSearch
        });
        if (this.page.header) {
            var b = createComponent(this.page.header);
            if (b) {
                this.addChild(b);
            }
        }
        this.addChild(this.listComponent, d, "div");
        this.anchorContent();
    },
    willDisappear: function (b, a) {
        this._super(b, a);
    },
    didAppear: function (b, a) {
        this._super(b, a);
    }
});
sePages.ListPage = SEListPage;
SEMapPage = PageBase.extend({
    init: function (b, a) {
        this.page = b;
        this.dataSource = RobotfruitApp.getDatasourceByRef(this.page.dataSource);
        this.markers = [];
        var c = a.params;
        this.params = c;
        if (c.longitude && c.latitude) {
            this.singleItemMap = true;
            this.includeCurrentPositionInCentering = true;
        }
    },
    unload: function () {
        var a = this.getListFeedProvider();
        a.statusObject.unbind(".mapComponent");
        a.statusObject.unbind(".mapComponentActivity");
        this._super();
    },
    getListFeedProvider: function () {
        var b = this.listFeedProvider;
        if (b) {
            return b;
        }
        if (this.parentPage && this.parentPage.tabPages) {
            var c = false;
            for (var a = 0; a < this.parentPage.tabPages.length; a++) {
                var d = this.parentPage.tabPages[a].page;
                if (d.listFeedProvider) {
                    b = d.listFeedProvider;
                    break;
                }
            }
        }
        if (!b) {
            b = DataSourceListFeedProvider.instance(this.dataSource, this.params);
        }
        this.listFeedProvider = b;
        return b;
    },
    willDisappear: function () {
        var a = this.getListFeedProvider();
        a.statusObject.unbind(".mapComponentActivity");
        se.activityIndicator.hide();
    },
    willAppear: function (c) {
        se.navigationBar.show();
        var d = this.params,
            a = this.getListFeedProvider();
        if (!d.hideRefresh) {
            refreshNavigationBarButton.attachTo(se.navigationBar, {
                position: "prepend"
            });
        }
        if (d.showBack) {
            var b = new NavigationBarButton({
                icon: I.backIcon,
                onClick: function () {
                    navigateBack(1);
                }
            });
            b.attachTo(se.navigationBar);
        }
        a.statusObject.unbind(".mapComponentActivity");
        a.statusObject.bind("apiAjaxStart.mapComponentActivity", function (e, f) {
            e.stopPropagation();
            se.activityIndicator.show();
        });
        a.statusObject.bind("apiAjaxComplete.mapComponentActivity", function (e, f) {
            e.stopPropagation();
            se.activityIndicator.hide();
        });
    },
    didAppear: function (b) {
        if (this.listFeedProvider && this.map) {
            var a = this.listFeedProvider.find({
                fromCache: true
            });
            if (a) {
                this.renderMarkers(this.map, a);
            }
        }
    },
    renderMarkers: function (b, a) {
        if (this.includeCurrentPositionInCentering) {
            requireGeoPosition(functor(this, "doRenderMarkers", [b, a]));
        } else {
            this.doRenderMarkers(b, a);
        }
    },
    doRenderMarkers: function (e, c) {
        c = c.data;
        var h = RobotfruitApp.getModule(RobotfruitApp.MODULES.PLACES) || {};
        var j = this;
        var d = [];
        var g = [];
        $.each(c, function (k, n) {
            var o = j.page.items[0];
            var l = Binding.createObject({
                bindDesc: o.bindings,
                bindEnv: n
            });
            if (l.longitude && l.latitude) {
                var p = {
                    longitude: l.longitude,
                    latitude: l.latitude
                };
                d.push(p);
                var q = addMarkerToGoogleMap(e, l.latitude, l.longitude, l.pinUrl || h.map_pin_small_image_url, l.title, function () {
                    if (!j.singleItemMap) {
                        executeAction(o.action, n);
                    } else {
                        navigateBack(1);
                    }
                });
                g.push(q);
            }
        });
        if (this.includeCurrentPositionInCentering) {
            var a = RobotfruitApp.getGeoPosition();
            d.push({
                longitude: a.coords.longitude,
                latitude: a.coords.latitude
            });
        }
        for (var b = 0; b < this.markers.length; b++) {
            var f = this.markers[b];
            f.setMap(null);
        }
        this.markers.length = 0;
        this.markers = g;
        if (g.length === 0) {
            se.showToast(M.locNoResults);
        }
        setTimeout(function () {
            centerMap(e, d);
        }, 0);
    },
    onMapReload: function (a) {
        var b = a.map.getCenter();
        this.listFeedProvider.find({
            latitude: b.Xa,
            longitude: b.Ya
        });
    },
    onMapLocate: function (a) {
        requireGeoPosition(function (c) {
            var c = RobotfruitApp.getGeoPosition(),
                b = new google.maps.LatLng(c.coords.latitude, c.coords.longitude);
            a.map.setCenter(b);
        });
    },
    load: function (a, b) {
        MapComponent.create({
            mapLoaded: functor(this, "onMapLoaded", [b.isReload])
        }, a);
    },
    onMapLoaded: function (b, e) {
        var f = this.params,
            c = this.getListFeedProvider(),
            g, d;
        if (this.map) {
            delete this.map;
        }
        this.map = e;
        if (this.singleItemMap) {
            this.renderMarkers(e, {
                data: [{
                    name: f.name,
                    geo: {
                        coordinates: [f.latitude, f.longitude]
                    }
                }]
            });
            return;
        }
        g = new SEMapControl({
            icon: I.mapButtonReload,
            onClick: functor(this, "onMapReload")
        });
        g.attachToMap(e);
        d = new SEMapControl({
            icon: I.mapButtonLocate,
            onClick: functor(this, "onMapLocate")
        });
        d.attachToMap(e);
        c.statusObject.unbind(".mapComponent");
        c.statusObject.bind("findSuccess.mapComponent", functor(this, "onListLoadSuccess"));
        c.statusObject.bind("findError.mapComponent", functor(this, "onListLoadError"));
        if (b) {
            c.find({});
        } else {
            var a = c.find({
                fromCache: true
            });
            if (a) {
                this.renderMarkers(e, a);
            } else {
                c.find({});
            }
        }
    },
    onListLoadSuccess: function (a, b, c) {
        if (!this.map) {
            return;
        }
        this.renderMarkers(this.map, b);
    },
    onListLoadError: function (a, c, b) {},
});
sePages.MapPage = SEMapPage;
var createTabbedPage = function (c, b) {
    var a = RobotfruitApp.getPageByRef(c.tabs[0].page);
    if (a && a.type == "WebPage") {
        return createUrlFeedPage(c, b);
    }
    
    
    if (c.tabBarType == "Strip")
    {
        if(b.params.activeTab)
        {
            return new sePages.TabStripPage(c, b);
        }
        else
        {
            var prms = { pageId: c.id, scrollPosition: "delete" };
            return new seScreen.tabstrip_categories({ params: prms });
        }
    }
    else
    {
        return new sePages.SegmentedTabPage(c, b);
    }
};

function createTabOptions(b, d, c) {
    var e = $.extend({}, b),
        f = Binding.createObject({
            bindDesc: d.parameters,
            bindEnv: d,
            context: c.getContext()
        }),
        a = Binding.createObject({
            bindDesc: d.datasourceParameters,
            bindEnv: d,
            context: c.getContext()
        });
    f.dsParams = a;
    e.params = f;
    return e;
}

SETabStripPage = PageBase.extend({
    init: function (b, a) {
        
        this._super(b, a);
        this.page = b;
        this.tabs = b.tabs;
        this.cacheable = true;
        var c = this;
        this.screenData = se.screenData();
        
        if (a.isReload && typeof (this.screenData.stripActiveTabId) != "undefined") {
            this.activeTabId = this.screenData.stripActiveTabId;
        } else {
            this.screenData.stripActiveTabId = undefined;
        }

        this.onCategorySelected = function (e, d) {
            if (c.activeTabId != d)
            {
                c.activeTabId = d;
                c.cacheable = false;
                c.screenData.stripActiveTabId = d;
            }
        };
    },
    unload: function () {
        $(document).unbind("categorySelected", this.onCategorySelected);
        this._super();
    },
    isCacheable: function () {
        if (!this.cacheable) {
            this.cacheable = true;
            return false;
        }
        return true;
    },
    onOrientationChange: function () {
        if (this.activeTabPage) {
            this.activeTabPage.onOrientationChange();
        }
    },
    willAppear: function (d) {
        var b = "";
        $(document).unbind("categorySelected", this.onCategorySelected);
        var e = d.params;
        this.children.length = 0;
        
        if (!this.activeTabId) {
            this.activeTabId = e.activeTab || this.tabs[0].id;
        }
        var a = this.activeTabId;
        this.activeTab = getFromObjectList(this.tabs, "id", a) || this.tabs[0];
        b = Binding.createObject({
            bindDesc: this.activeTab,
            bindEnv: {}
        });
        this.activeTab = b;
        if (e.showBack) {
            this.addChild(new SENavButton({
                icon: I.backIcon,
                onClick: function () {
                    navigateBack(1);
                }
            }));
        }
        if (this.tabs.length > 1 && !e.hideCategories) {
            this.categoriesBtn = new SENavButton({
                title: M.locCategories,
                icon: I.categoriesIcon,
                onClick: functor(this, "onCategoriesClick")
            });
            this.addChild(this.categoriesBtn);
        }
        if (this.activeTab.title) {
            this.setTitle(this.activeTab.title);
        }
        var c = RobotfruitApp.getPageByRef(this.activeTab.page);
        if (!this.activeTabPage || this.activeTabPage.page.id !== c.id) {
            var f = createTabOptions(d, this.activeTab, this);
            this.activeTabPage = createPage(c, f);
            this.activeTabPage.parent = this;
        }
        
        
        this.children.push(this.activeTabPage);
        
        //var a = this.page.id;
        
        //added code to display categories before list page

        this._super(d);
    },
    load: function (a, b)
    {
        this.activeTabPage.load(a, b);   
    },
    onCategoriesClick: function () {
        var a = this.page.id;
        $(document).one("categorySelected", this.onCategorySelected);
        navigateTo(getScreenUrl("tabstrip_categories", {
            pageId: a,
            scrollPosition: "delete"
        }));
    },
    onNavigationBarCleared: function () {
        if (this.categoriesBtn) {
            this.categoriesBtn.willAppear();
        }
    }
});


sePages.TabStripPage = SETabStripPage;
SESegmentedTabPage = PageBase.extend({
    init: function (d, c) {
        if (!d) {
            return;
        }
        this._super(d, c);
        this.tabs = d.tabs;
        this.tabPages = [];
        for (var b = 0; b < this.tabs.length; b++) {
            var e = this.tabs[b];
            var f = createTabOptions(c, e, this);
            var g = createPage(RobotfruitApp.getPageByRef(e.page), f);
            g.parentPage = this;
            var h = Binding.createObject({
                bindDesc: {
                    title: e.title
                },
                bindEnv: ((c && c.params) ? c.params : {})
            });
            var a = g.authentication(f);
            if (a) {
                g = a;
            }
            this.tabPages.push({
                page: g,
                loaded: false,
                tabOptions: f,
                tabParams: h
            });
        }
    },
    load: function (a, b) {
        var c = [];
        var d = this;
        $.each(this.tabs, function (e, f) {
            c.push({
                id: f.id,
                title: d.tabPages[e].tabParams.title,
                select: function (h, g) {
                    var k = d.tabPages[e],
                        j = k.tabOptions;
                    if (d.currentTabPage) {
                        d.currentTabPage.page.willDisappear(d.currentTabPage.tabOptions, d.currentTabPage.jTabAnchor);
                        d.currentTabPage.page.didDisappear();
                        se.navigationBar.removeAdditions();
                        se.navigationBar.removeButtons();
                        se.activityIndicator.clear();
                        if (d.parent && d.parent instanceof SETabStripPage) {
                            d.parent.onNavigationBarCleared();
                        }
                    }
                    d.currentTabPage = k;
                    k.page.willAppear(j);
                    if (!k.loaded) {
                        k.page.load(g, j);
                        k.loaded = true;
                        k.jTabAnchor = g;
                    }
                    k.page.didAppear(j, g);
                    d.children.length = 0;
                    d.children.push(k.page);
                }
            });
        });
        TabsComponent.create({
            tabs: c,
            activeTab: b.params.activeTab || 0
        }, a);
    }
});
sePages.SegmentedTabPage = SESegmentedTabPage;
var createUrlFeedPage = function (c, b) {
    var d = [];
    $.each(c.tabs, function (e, f) {
        d.push({
            title: f.title,
            url: f.parameters.url
        });
    });
    var a = {
        id: c.id + "_tabs_page",
        type: "ListPage",
        hideRefresh: true,
        dataSource: {
            id: c.id + "_tabs",
            type: "InlineDataSource",
            data: d
        },
        items: [{
            type: "CategoryItem",
            bindings: {
                title: {
                    path: "title"
                },
                url: {
                    path: "url"
                }
            },
            action: {
                type: "DelegateAction",
                delegate: function (e) {
                    openUrlInApp(e.url);
                },
                parameters: {
                    url: {
                        path: "url"
                    }
                }
            }
        }]
    };
    return createPage(a, b);
}