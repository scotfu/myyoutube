RobotFruitApplication = Class.extend({
    MODULES: {
        HOME_SCREEN_GRID: "HomeScreenModule",
        COMMUNITY: "CommunityModule",
        PLACES: "PlacesModule"
    },
    init: function (c) {
        var b = $.extend({
            nid: config.networkId,
            version: config.apiVersion,
            designMode: config.designMode,
            cryptoKey: "vab3fre8evuwU8a9abruNeqawawR74Tuy3tutraT392Huq6br3racrerudretRuy",
            facebookAppId: serverConfig.facebookAppId
        }, c);
        $.extend(this, b);
        this.subscriptionEnabled = false;
        var a = this;
        $(document).bind("subscriptionEnabled", function (d, e) {
            a.setSubscriptionEnabled(true, e);
        });
        this.storage = new SEPermanentStorage();
    },
    getIsNetworkPrivate: function () {
        return this.application.privacy === "Private";
    },
    getDefaultUnitSystem: function () {
        if (window.serverConfig) {
            return serverConfig.unitSystem;
        }
        return "Imperial";
    },
    getGeoPosition: function () {
        if (currentGeoPosition) {
            return currentGeoPosition;
        }
        return {
            coords: {}
        };
    },
    getNid: function () {
        return this.nid;
    },
    getName: function () {
        return this.application.name;
    },
    getSubdomain: function () {
        return this.application.subdomain;
    },
    getFacebookAppId: function () {
        return this.facebookAppId;
    },
    getFacebookConnectPath: function (b) {

        if (window.serverConfig && serverConfig.fbConnectPath) {
            var c = serverConfig.fbConnectPath,
                a = user.identities.findIdentity("RobotfruitNetwork");
            var d = new SEUrl("https://m.facebook.com/dialog/oauth");
            d.addParam("client_id", this.getFacebookAppId()).addParam("redirect_uri", c);
            
            var stateObject = new Object();
            stateObject.app_id = serverConfig.networkId;
            if(serverConfig.referrer === null)
                stateObject.referrer = location.href
            else
                stateObject.referrer = serverConfig.referrer;
                
            

            if(device.platform == "native")
            {
                if(serverConfig.token)
                {
                     stateObject.token = serverConfig.token;
                }
            }
            else
            {
                if(serverConfig.shareCode)
                {
                    stateObject.share_code = serverConfig.shareCode;
                }
            }
            //alert(JSON.stringify(stateObject));
            d.addParam("state", encodeURI(JSON.stringify(stateObject)));
                                  
            location.href = d.toString();
        }
    },
    getTwitterConnectPath: function (c) {
        if (window.serverConfig && serverConfig.twitterConnectPath) {
            var d = serverConfig.twitterEndpointPath,
                a = serverConfig.twitterConnectPath,
                b = user.identities.findIdentity("RobotfruitNetwork");
            if (!c && b && b.sessionId) {
                a = addParamToUrl({
                    url: a,
                    param: "session_id",
                    val: b.sessionId
                });
            }
            
            if(device.platform == "native") {
                cordova.exec(function(regId) {
                        d = addParamToUrl({
                            url: d,
                            param: "token",
                            val: regId
                        });
                        
                    }, function(error) {}, "GCMRegistrationId", "get", []);
            } else {
                if(serverConfig.shareCode) {
                    d = addParamToUrl({
                        url: d,
                        param: "share_code",
                        val: serverConfig.shareCode
                    });
                }
                
            }
            d = addParamToUrl({
                url: d,
                param: "app_id",
                val: serverConfig.networkId
            });
            return addParamToUrl({
                url: d,
                param: "rurl",
                val: a
            });
        }
    },
    getLanguage: function () {
        return "en";
    },
    load: function (b, a) {
        this.configProvider = new SEConfigurationProvider({
            nid: this.nid,
            version: this.version,
            designMode: this.designMode
        });
        this.configProvider.find({
            success: functor(this, "onLoadSuccess", [b, a]),
            error: a
        });
    },
    getCommentLength: function () {
        var a = this.getModule("CommunityModule");
        if (a && a.shoutLength) {
            return a.shoutLength;
        } else {
            return 1000;
        }
    },
    onLoadSuccess: function (c, b, a) {
        a = a.data;
        $(document).trigger("applicationConfigurationLoaded", [a]);
        this.config = a;
        this.application = a.application;
        this.dataSources = a.dataSources;
        
        this.modules = a.modules;
        if (this.application.textOrientation == "rtl") {
            $("body").attr("sedir", "rtl");
        }
        this.pages = a.pages;
        this.skin = a.skin;

        this.configProvider.loadLocalization(this.skin.language, functor(this, "onLocalizationLoaded", [c]), b);
    },
    onLocalizationLoaded: function (b, a) {
        M = $.extend({
            timeFormat: "h:mm tt",
            dateFormat: "M/d/yyyy"
        }, M, a);
        M.locDayOfWeek = [M.locDayOfWeekSunday, M.locDayOfWeekMonday, M.locDayOfWeekTuesday, M.locDayOfWeekWednesday, M.locDayOfWeekThursday, M.locDayOfWeekFriday, M.locDayOfWeekSaturday];
        $.extend(M, {
            INVALID_CREDENTIALS: M.locInvalidCredentials,
            SIGNUP_EMAIL_MISSING: M.errorSignupEmailMissing,
            SIGNUP_EMAIL_INVALID: M.errorSignupEmailInvalid,
            SIGNUP_EMAIL_FORBIDDEN: M.errorSignupEmailForbidden,
            SIGNUP_PASSWORD_MISSING: M.errorSignupPasswordMissing,
            SIGNUP_PASSWORD_INVALID: M.errorSignupPasswordInvalid,
            SIGNUP_USERNAME_MISSING: M.errorSignupUsernameMissing,
            SIGNUP_USERNAME_INVALID: M.errorSignupUsernameInvalid,
            SIGNUP_USERNAME_FORBIDDEN: M.errorSignupUsernameForbidden,
            SIGNUP_USERNAME_EXISTS: M.errorSignupUsernameExists,
            SIGNUP_EMAIL_EXISTS: M.errorSignupEmailExists,
            SIGNUP_EMAIL_DOMAIN_NOT_ALLOWED: M.errorSignupEmailDomainNotAllowed,
            MEMBER_NOT_APPROVED: M.errorMemberNotApproved,
            ACCOUNT_NOT_EXISTS: M.errorAccountDoesntExist,
            ACCOUNT_LOCKED: M.errorAccountLocked,
            EMAIL_NOT_CONFIRMED: M.errorEmailNotConfirmed
        });
        (b || $.noop)(this.config);
    },
    isGeoRequired: function () {
        return this.getModule(this.MODULES.PLACES);
    },
    getModule: function (a) {
        return getFromObjectList(this.modules, "type", a);
    },
    getSkin: function () {
        return this.skin;
    },
    getContentSubscribtionModule: function () {
        return this.getModule(this.MODULES.CONTENT_SUBSCRIBTION_MODULE);
    },
    getInAppPurchaseKey: function () {
        if (!this.getContentSubscribtionModule().googlePlayPublicKey) {
            return;
        }
        if (!this.inAppPurchaseKey) {
            this.inAppPurchaseKey = Tea.decrypt(this.getContentSubscribtionModule().googlePlayPublicKey, this.cryptoKey);
        }
        return this.inAppPurchaseKey;
    },
    isGooglePlaySubscription: function () {
        if (!this.googlePlaySubscription) {
            this.googlePlaySubscription = (this.getContentSubscribtionModule().identityProvider == "ITunesAndGooglePlay");
        }
        return this.googlePlaySubscription;
    },
    isSubscriptionEnabled: function () {
        var b = this.storage.getValue("subscriptionEnabled"),
            a = (new Date()).getTime();
        if (!b) {
            return false;
        }
        if (b.expires < a) {
            return false;
        }
        return b.isEnabled;
    },
    setSubscriptionEnabled: function (a, b) {
        b = b || (new Date().getTime() + 1000 * 60 * 60 * 24);
        this.storage.setValue("subscriptionEnabled", {
            isEnabled: a,
            expires: b
        });
    },
    getDatasourceByRef: function (a) {
        if (!a) {
            return false;
        }
        if (a["$ref"]) {
            return getFromObjectList(this.dataSources, "id", a["$ref"]);
        } else {
            if (a.id) {
                return a;
            }
        }
    },
    getPageByRef: function (a) {
        if (!a) {
            return false;
        }
        if (a["$ref"]) {
            return getFromObjectList(this.pages, "id", a["$ref"]);
        } else {
            return a;
        }
    },
    getPage: function (a, b) {
        return getFromObjectList(this.pages, b, a);
    },
    getRelativeUrl: function (a) {
        if (window.serverConfig && serverConfig.mountPath) {
            return serverConfig.mountPath + "/" + a;
        }
        return a;
    },
    getIcon: function (c) {
        if (!c) {
            return false;
        }
        var b, a;
        b = c.split(".", 1)[0];
        b = b.charAt(0).toLowerCase() + b.slice(1);
        var a = this.skin.icons[b];
        if (!a) {
            return this.getRelativeUrl("theme/images/" + c);
        }
        return a;
    }
});
var RobotfruitApp = new RobotFruitApplication();
var robotfruit = window.robotfruit = {};
robotfruit.providers = {};
robotfruit.services = {};
robotfruit.services.ServiceClient = function (a) {
    return getServiceClient(a.url, {
        appendTypeToUrl: a.appendTypeToUrl === undefined ? true : a.appendTypeToUrl,
        timeout: config.networkTimeout,
        authorizationHeader: config.authorizationHeader,
        error: onErrorResponse,
        status: a.status,
        methodParameterName: a.methodParameterName,
        authServer: a.authServer
    });
};
$(document).bind("apiAjaxStart", function (a, b) {
    if (!b) {
        se.activityIndicator.show();
    }
});
$(document).bind("apiAjaxComplete", function (a, b) {
    if (!b) {
        se.activityIndicator.hide();
    }
});
ui = {};
var refreshNavigationBarButton = new RefreshNavigationBarButton();
(function (a) {
    ui.contentSize = function () {
        var d = a(window).width();
        var b;
        if (a(".tabLinks").length) {
            var c = a(".tabLinks").position().top + a(".tabLinks").height();
            b = a(window).height() - c;
        } else {
            var c = 0;
            if (a("#content h1").length) {
                c = a("#content h1").position().top + a("#content h1").height();
            }
            b = a(window).height() - c;
        }
        return {
            width: d,
            height: b
        };
    };
    ui.error = function (b) {
        ui.message(b, M.locServerRejectedReceiptTitle);
    };
    ui.message = function (c, d) {

            alert(c);

    };
    ui.confirm = function (c, d, b) {
        if (confirm(c)) {
            (d || a.noop)();
        } else {
            (b || a.noop)();
        }
    };
    ui.activityIndicator = "spinner";
})(jQuery);

function onErrorResponse(d, a) {
    var c;
    if (a === "timeout") {
        c = M.locNetworkTimeout;
    }
    if (a === "empty") {}
    if (!c && d) {
        if (d.readyState != 4) {
            c = M.locYouAreOffline;
        } else {
            switch (d.status) {
            case 401:
                navigateTo("network_login");
                return;
            case 403:
                break;
            case 400:
                try {
                    c = JSON.parse(d.responseText).error;
                    if (c) {
                        c = $.trim(c.replace(/Parameter name: [^ ]+/, ""));
                    }
                } catch (b) {}
                break;
            case 404:
                c = M.locServerIsDown;
                break;
            case 500:
                c = M.locServerError;
                break;
            case 502:
                c = M.locNetworkTimeout;
                break;
            case 0:
                c = M.locYouAreOffline;
                navigateBack(1);
                break;
            }
        }
    }
    if (!c) {
        try {
            console.error("UNHANDLED SERVER ERROR - STATUS " + d.status + " READYSTATE " + d.readyState + " ERROR " + a);
        } catch (b) {
            console.error("UNHANDLED SERVER ERROR");
        }
    } else {
        ui.error(c);
    }
}
function onScreenError(a) {
    se.activityIndicator.hide();
    console.debug("EXCEPTION", a);
}
function onScreenStartLoading(a) {
    network.abortRequests();
    ui.screenLoadStart(a);
}
onScreenStopLoading = ui.screenLoadStop;
onScreenDestroy = ui.screenDestory;

function onScreenDestroy() {}
function onScreenReload() {
    network.clearCache();
}(function () {
    var e = paramsToObject(location.hash.substring(1));
    var b = new robotfruit.services.ServiceClient({
        url: (e.robotfruitApi || config.robotfruitApi) + "/%s",
        authServer: "RobotfruitNetwork",
        status: $("<div></div>")
    });
    $(document).bind("applicationConfigurationLoaded", function (h, g) {
        b.defaultParams.nid = RobotfruitApp.getNid();
    });
    var c = {
        shouts: {},
        places: {},
        users: {},
        events: {},
        news_likes: {},
        news_comments: {}
    };

    function a(h, g) {
        $.each(g, function (j, k) {
            c[h][k.id] = k;
        });
        console.debug("NETWORK CACHE ADD " + h + " " + g.length);
    }
    function d(j, h, g) {
        if (c[j][h] && (g || !secondsHadPassed(config.networkCacheSecondsToLive))) {
            console.debug("NETWORK CACHE HIT " + j + " " + h);
            return c[j][h];
        }
        console.debug("NETWORK CACHE MISS " + j + " " + h);
        return false;
    }
    function f(h, g) {
        delete c[h][g];
        console.debug("NETWORK CACHE CLEAR " + h + " " + g);
    }
    network = window.network = {
        branding: {},
        knownNetworks: {
            lalit: 31736
        },
        abortRequests: function () {
            b.abort();
        },
        clearCache: function () {
            var g = RobotfruitApp.getModule(RobotfruitApp.MODULES.COMMUNITY);
            for (var h in c) {
                if (g && h == "shouts") {
                    if (g.communityType != "ning") {
                        c[h] = {};
                    }
                } else {
                    c[h] = {};
                }
            }
            b.clearCache();
        },
        setSessionId: function (g) {
            b.defaultParams.session_id = g;
        },
        getLanguage: function () {
            return network.languageName.indexOf("Croatian") != -1 || network.languageName.indexOf("Hrvatski") != -1 ? "hr" : "en";
        },
        loadBranding: function (h, g) {
            var k = "iphone";
            var j = this;
            if (j.branding.themeColor) {
                h();
            }
            b.GET("networks/branding/" + k, null, function (l) {
                j.branding = {
                    logoUrl: l.network_logo_url || imageUrl("bundle://RobotFruit.png"),
                    themeColor: l.theme_color || "#2082C5",
                    linkColor: l.theme_color,
                    homeBigLogoUrl: l.home_big_logo_url,
                    lightSublabelColor: l.light_sublabel_color || "#969696"
                };
                h();
            }, g);
        },
        authenticateWith: function (g) {
            b.auth = g;
        },
        getSharingInfo: function (j, h, g) {
            b.GET("user/sharing_info", {
                output_as_boolean: true
            }, h, g, false);
        },
        getUserInfo: function (h, j, g) {
            b.GET("user/show" + (h ? "/" + h : ""), {
                include_robotfruit_fields: true
            }, j, g, false);
        },
        retrievePassword: function (h, g) {
            b.GET("user/retrieve_password", {
                email: h
            }, g);
        },
        verifyUser: function (j, g, k, h) {
            b.GET("user/show" + (j ? "/" + j : ""), {
                include_robotfruit_fields: true
            }, k, h, false, g);
        },
        verifyNingCredentials: function (l, j, k, h) {
            var g = {
                authenticated: false,
            };
            b.GET("account/verify_ning_credentials", {
                email: l,
                password: j,
                auto_register: true
            }, k, h, false, g);
        },
        verifyJanRainCredentials: function (k, j, h) {
            var g = {
                authenticated: false,
            };
            b.GET("account/verify_ning_credentials", {
                request_token: k,
                auto_register: true
            }, j, h, false, g);
        },
        termsOfService: function (j, h) {
            var g = {
                authenticated: false,
            };
            b.GET("tos.json", {}, j, h, false, g);
        },
        verifyNetworkCredentials: function (l, j, k, h) {
            var g = {};
            if (device.platform == "native") {
                cordova.exec(function(regId) {
                        b.GET("account/verify_credentials", {
                            email: l,
                            password: j,
                            token: regId
                        }, k, h, false, g);
                    }, function(error) {}, "GCMRegistrationId", "get", []);
            } else {
                b.GET("account/verify_credentials", {
                    email: l,
                    password: j,
                    share_code: serverConfig.shareCode
                }, k, h, false, g);
            }
        },
        verifyFacebookCredentials: function (k, h, l, j) {
            var g = {};
            b.GET("account/verify_facebook_credentials", {
                session_key: k,
                auto_register: h
            }, l, j, false, g);
        },
        associateFacebookAccessTokenWithCurrentUser: function (g, j, h) {
            b.GET("account/verify_facebook_credentials", {
                access_token: g,
                nid: RobotfruitApp.getNid(),
                auto_register: true
            }, j, h, false);
        },
        associateTwitterCredentialsWithCurrentUser: function (h, j, k, g) {
            b.GET("account/verify_twitter_credentials", {
                oauth_token: h,
                oauth_verifier: j,
                auto_register: true
            }, k, g, false);
        },
        verifyFacebookAccessToken: function (g, j, l, k) {
            var h = {};
            b.GET("account/verify_facebook_credentials", {
                access_token: g,
                auto_register: j,
                nid: RobotfruitApp.getNid()
            }, l, k, false, h);
        },
        verifyTwitterCredentialsWithSessionKey: function (k, h, l, j) {
            var g = {};
            b.GET("account/verify_twitter_credentials", {
                twitter_session_key: k,
                auto_register: h
            }, l, j, false, g);
        },
        verifyTwitterCredentials: function (k, l, h, n, j) {
            var g = {};
            b.GET("account/verify_twitter_credentials", {
                oauth_token: k,
                oauth_verifier: l,
                auto_register: h
            }, n, j, false, g);
        },
        search: {
            shouts: function (k, h, j, g) {
                b.GET("search", {
                    page: h,
                    q: k
                }, j, g);
            }
        },
        getMessages: function (h, g) {
            b.GET("direct_messages", {
                page: page
            }, h, g);
        },
        getSentMessages: function (h, g) {
            b.GET("direct_messages/sent", {
                page: page
            }, h, g);
        },
        getPublicTimeline: function (j, h, k, g) {
            b.GET("status/public_timeline", {
                include_robotfruit_fields: true,
                since_id: j,
                max_id: h,
                fetch_replies: false
            }, function (l) {
                a("shouts", l);
                k(l);
            }, g);
        },
        getFriendsTimeline: function (j, h, k, g) {
            b.GET("status/friends_timeline", {
                include_robotfruit_fields: true,
                since_id: j,
                max_id: h,
                fetch_replies: false
            }, function (l) {
                a("shouts", l);
                k(l);
            }, g);
        },
        getMentions: function (j, h, k, g) {
            b.GET("status/mentions", {
                include_robotfruit_fields: true,
                since_id: j,
                max_id: h
            }, function (l) {
                a("shouts", l);
                k(l);
            }, g);
        },
        getShout: function (j, k, h) {
            var g = d("shouts", j, true);
            if (g) {
                k(g, false);
            } else {
                b.GET("status/show", {
                    include_robotfruit_fields: true,
                    id: j
                }, function (l) {
                    c.shouts[l.id] = l;
                    k(l);
                }, h);
            }
        },
        getUserShouts: function (l, j, h, k, g) {
            b.GET("status/user_timeline/" + l, {
                include_robotfruit_fields: true,
                since_id: j,
                max_id: h
            }, function (n) {
                a("shouts", n);
                k(n);
            }, g);
        },
        getUserFriends: function (k, h, j, g) {
            b.GET("status/friends/" + k, {
                page: h,
                include_robotfruit_fields: true
            }, j, g);
        },
        getUserFriendsOnFacebook: function (h, g) {
            b.GET("friends/facebook", {
                include_robotfruit_fields: true
            }, h, g);
        },
        getUserFriendsOnTwitter: function (h, g) {
            b.GET("friends/twitter", {
                include_robotfruit_fields: true
            }, h, g);
        },
        getUserFriendsOnFoursquare: function (h, g) {
            b.GET("friends/foursquare", {
                include_robotfruit_fields: true
            }, h, g);
        },
        getUserFollowers: function (k, h, j, g) {
            b.GET("status/followers/" + k, {
                page: h,
                include_robotfruit_fields: true
            }, j, g);
        },
        getShoutReplies: function (h, j, g) {
            b.GET("status/replies", {
                include_robotfruit_fields: true,
                in_reply_to_status_id: h
            }, j, function (l, k) {
                if (k == "empty") {
                    j([]);
                } else {
                    if (g) {
                        g(l, k);
                    }
                }
            });
        },
        getNearbyPlaces: function (k, l, h, p, n, q, j) {
            var o = {
                latitude: k,
                longitude: l,
                category_ids: h,
                page: n
            };
            if (h) {
                o.radius = 10000000;
            }
            var g = true;
            if (p && p.length > 2) {
                o.name = p;
                g = false;
            }
            b.GET("places/nearby", o, q, j, g);
        },
        getPlace: function (h, j, g) {
            b.GET("places/show/" + h, null, j, g);
        },
        getPlaceShouts: function (j, h, k, g) {
            b.GET("status/at_place/" + j, {
                include_robotfruit_fields: true,
                page: h
            }, k, g);
        },
        getUsersAtPlace: function (h, j, g) {
            b.GET("users/at_place/" + h, null, j, g);
        },
        getNearbyUsers: function (h, j, k, l, g) {
            b.GET("users/nearby", {
                latitude: h,
                longitude: j,
                page: k
            }, l, g);
        },
        getUsers: function (h, j, g) {
            b.GET("users/all", {
                cursor: h,
                count: 20,
                include_robotfruit_fields: true
            }, function (k) {
                j(k.users);
            }, g);
        },
        getEvents: function (h, j, k, l, g) {
            b.GET("events/at_location", {
                latitude: h,
                longitude: j,
                page: k
            }, l, g);
        },
        getEvent: function (h, j, g) {
            b.GET("events/select/" + h, null, j, g);
        },
        postMessage: function (k, j, h, g) {
            b.POST("direct_messages/new", {
                user: k,
                text: j
            }, h, g);
        },
        postPlace: function (h, j, g) {
            b.POST("places/new.json?nid=" + RobotfruitApp.getNid(), h, j, g);
        },
        updatePlace: function (n, o, p, q, g, j, k, h, s, l) {
            b.POST("places/update/" + n + ".json?nid=" + RobotfruitApp.getNid(), {
                latitude: o,
                longitude: p,
                name: q,
                address: g,
                city: j,
                country: k,
                category_id: h
            }, s, l);
        },
        postShout: function (x, j, k, o, v, l, n, q, s, u, t, p, h, w, g) {
            b.POST("status/create.json?nid=" + RobotfruitApp.getNid(), {
                status: x,
                in_reply_to_status_id: j,
                lat: k,
                "long": o,
                source: v,
                robotfruit_place_id: q,
                link_attachment: l,
                robotfruit_location_name: n,
                share_facebook: s,
                share_twitter: u,
                share_foursquare: t,
                notifications_included: p,
                file_attachment: h
            }, w, g);
        },
        getPostShoutUrl: function () {
            return config.robotfruitApi + "/status/update.json";
        },
        postFavorite: function (h, j, g) {
            b.POST("favorites/create/" + h + ".json?nid=" + RobotfruitApp.getNid(), {}, j, g);
        },
        updateProfile: function (k, n, j, g, i, l, h) {
            b.POST("account/update_profile", {
                name: k,
                phone: n,
                password: i
            }, l, h);
        },
        endSession: function (g) {
            var h = function () {
                if (b.defaultParams.hasOwnProperty("session_id")) {
                    delete b.defaultParams.session_id;
                }(g || $.noop)();
            };
            b.GET("account/end_session", null, h, h, false);
        },
        signUp: function (g, l, p, s, j, k, h) {
            if (device.platform == "native") {
                cordova.exec(function(regId) {
                        b.POST("account/signup.json?nid=" + RobotfruitApp.getNid(), {
                            email: g,
                            password: j,
                            phone: p,
                            username: l,
                            token: regId,
                            share_code: s
                        }, k, h);
                    }, function(error) {}, "GCMRegistrationId", "get", []);
            } else {
                b.POST("account/signup.json?nid=" + RobotfruitApp.getNid(), {
                    email: g,
                    password: j,
                    phone: p,
                    username: l,
                    share_code: s
                }, k, h);
            }

        },
        deletePlace: function (h, j, g) {
            b.POST("places/destroy/" + h + ".json?nid=" + RobotfruitApp.getNid(), {}, j, g);
        },
        deleteShout: function (h, j, g) {
            b.POST("status/destroy.json", {
                nid: RobotfruitApp.getNid(),
                id: h
            }, j, g);
        },
        deleteFavorite: function (h, j, g) {
            b.POST("favorites/destroy/" + h + ".json?nid=" + RobotfruitApp.getNid(), {}, j, g);
        },
        getNewsLikesSummary: function (k, j, h) {
            var g = d("news_likes", k);
            if (g) {
                j(g.summary);
            } else {
                b.GET("news_likes/url_summary", {
                    url_id: k
                }, function (l) {
                    a("news_likes", [{
                        id: k,
                        summary: l
                    }]);
                    j(l);
                }, h, false);
            }
        },
        addNewsLike: function (k, j, h, g) {
            f("news_likes", k);
            b.POST("news_likes/insert", {
                url_id: k,
                url: j
            }, h, g);
        },
        deleteNewsLike: function (k, h, j, g) {
            f("news_likes", k);
            b.POST("news_likes/delete/" + h, {}, j, g);
        },
        getNewsComments: function (k, j, h) {
            var g = d("news_comments", k);
            if (g) {
                j(g.comments);
            } else {
                b.GET("news_comments/collection", {
                    url_id: k
                }, function (l) {
                    a("news_comments", [{
                        id: k,
                        comments: l
                    }]);
                    j(l);
                }, h, false);
            }
        },
        addNewsComment: function (n, l, k, g, j, h) {
            f("news_comments", n);
            b.POST("news_comments/insert", {
                url_id: n,
                url: l,
                text: k,
                create_shout: g
            }, j, h);
        },
        deleteNewsComment: function (k, g, j, h) {
            f("news_comments", k);
            b.POST("news_comments/delete/" + g, {}, j, h);
        },
        rsvp: function(eventId)
        {
            requireAuthentication(function () {
                b.GET('event/rsvp', {
                   event_id: eventId
                }, function () {
                    reloadScreen();
                    se.showToast('you have successfully rsvpd');
                }, undefined, false);
            }, null, 'RobotfruitNetwork', true);
        },
        shareByEmail: function(emails, link)
        {
            if(emails && link)
            {
            requireAuthentication(function () {
                b.GET('share/email', {
                   emails: emails,
                   link: link
                }, function () {
                    reloadScreen();
                    se.showToast('Thank You for Sharing!');
                }, undefined, false);
            }, null, 'RobotfruitNetwork', true);
            }
            else
            {
                alert('parameter missing');
            }
        },
        getNotifications: function (k, g, l, h, j) {
            b.GET("notifications/select", {
                count: g,
                page: k,
            }, l, h, false, null, {
                inBackground: j
            });
        },
        markNotificationsAsRead: function (h, j, g) {
            b.GET("notifications/mark_as_read", {
                ids: h.join(",")
            }, j, g, false);
        },
        countNotifications: function (h, g) {
            b.GET("notifications/unread_count", {}, h, g, false);
        },
        getPlaceCategories: function (h, g) {
            b.GET("categories/select/root", undefined, h, g);
        },
        getPlaceCategory: function (g, j, h) {
            this.getPlaceCategories(function (k) {
                var n = false;

                function l(o) {
                    $.each(o, function (q, p) {
                        if (p.id == g) {
                            j(p);
                            n = true;
                            return;
                        }
                        if (p.categories.length > 0) {
                            l(p.categories);
                        }
                    });
                }
                l(k);
                if (n == false) {
                    console.error("Didn't find category " + g)(h || onErrorResponse)();
                }
            }, h);
        },
        search: function (j, h, k, g) {
            b.GET("search", {
                q: j,
                page: h
            }, function (l) {
                k(l.results);
            }, g);
        },
        searchMembers: function (h, j, g) {
            b.GET("users/search", {
                term: h
            }, j, g);
        },
        getInboxMessages: function (h, j, g) {
            b.GET("direct_messages", {
                page: h
            }, j, g);
        },
        getSentMessages: function (h, j, g) {
            b.GET("direct_messages/sent", {
                page: h
            }, j, g);
        },
        sendMessage: function (j, h, k, g) {
            b.POST("direct_messages/new", {
                screen_name: j,
                text: h
            }, function (l) {
                k(l);
            }, g);
        },
        deleteDirectMessage: function (h, j, g) {
            b.POST("direct_messages/destroy/" + h + ".json?nid=" + RobotfruitApp.getNid(), {}, j, g);
        },
    };
})();
if (!window.robotfruit) {
    window.robotfruit = {};
}
robotfruit.User = function (b) {
    var a = {};
    var c = function () {
        this.set = function (d) {
            a[d.authServer] = d;
            user.save();
            $(document).trigger("userLogIn", d);
        };
        this.remove = function (d) {
            delete a[d];
        };
        this.findIdentity = function (d) {
            return a[d];
        };
    };
    this.getNid = function () {
        if (window.RobotfruitApp) {
            return "" + RobotfruitApp.getNid();
        } else {
            if (window.serverConfig) {
                return "" + serverConfig.networkId;
            }
        }
    };
    this.save = function () {
        var e = new SEPermanentStorage();
        var d = e.getValue("networkIdentities") || {};
        d[this.getNid()] = a;
        e.setValue("networkIdentities", d);
    };
    this.load = function () {
        var e = new SEPermanentStorage();
        var d = e.getValue("networkIdentities") || {};
        a = d[this.getNid()] || {};
    };
    this.authenticated = function (d) {
        var e = user.identities.findIdentity(d);
        return (e && e.sessionId);
    };
    this.getUserId = function (d) {
        var e = this.identities.findIdentity(d);
        if (e) {
            return e.userId;
        }
        return false;
    };
    this.authenticate = function (e) {
        var d = robotfruit.providers.authenticationProviderFactory.create({
            type: e.authServer
        });
        var f = this;
        d.authenticate({
            sessionId: e.sessionId,
            userId: e.userId,
            username: e.username,
            password: e.password,
            success: function (g) {
                f.identities.set({
                    authServer: e.authServer,
                    userId: g.userId,
                    sessionId: g.sessionId,
                    authType: g.authType
                });
                f.save();
                (e.success || $.noop)();
                (e.complete || $.noop)();
            },
            error: function (h, g) {
                f.identities.remove(e.authServer);
                f.save();
                (e.error || $.noop)(h, g);
                (e.complete || $.noop)();
            }
        });
    };
    this.identities = new c();
    this.logout = function (d) {
        a = {};
        this.save();
        network.endSession(d);
        $(document).trigger("userLogOut");
    };
};
var user = new robotfruit.User();

function onVerificationError(e, b) {
    var a = "external";
    if (e === undefined) {
        ui.error(getMessage("locFailedConnectingToAccount", a));
    } else {
        if (e.status == 409) {
            var d;
            try {
                d = JSON.parse(e.responseText).error;
            } catch (c) {
                d = getMessage("locFailedConnectingToAccount", a);
            }
            ui.error(d);
        }
        if (e.status == 500) {
            ui.error(getMessage("locFailedConnectingToAccount", a));
        } else {
            onErrorResponse(e, b);
        }
    }
}
function isEqual(c, d) {
    return (c + "") === (d + "");
}
function getDirectionsUrl(a, b) {
    var c = RobotfruitApp.getGeoPosition();
    var e = c.coords.longitude;
    var d = c.coords.latitude;
    return "http://maps.google.com/maps?saddr=" + d + "," + e + "&daddr=" + a + "," + b;
}
function imageUrl(b) {
    if (b && b.indexOf("bundle:") >= 0) {
        var a = b.replace(/bundle:\/\//, "");
        b = RobotfruitApp.getIcon(a);
    }
    return b;
}
function standardErrorHandler(c, a) {
    console.debug("Standard Error handler");
    if (!navigator.onLine) {
        message = M.locYouAreOffline;
        ui.error(message);
    } else {
        if (c && c.responseText) {
            var b = JSON.parse(c.responseText);
            if (b && b.code && M[b.code]) {
                ui.error(M[b.code]);
            } else {
                if (b && b.error) {
                    ui.error(b.error);
                } else {
                    ui.error(M.locServerError);
                }
            }
        } else {
            ui.error(M.errorEmailAndPasswordMissing);
        }
    }
}



var authenticateUser = function (d, a, b, c) {
    d.identities.set({
        authServer: a,
        userId: b.user.id,
        sessionId: b.session_id,
        authType: "url"
    });
    setAndroidOptionsMenu();
    se.activityIndicator.hide();
    (c || $.noop)();
};

function getAuthServerForDataSource(a) {
    if (!a.endpointUrl) {
        return "RobotfruitNetwork";
    }
    if (a.endpointUrl.indexOf("blog.robotfruit.com") >= 0) {
        return a.endpointUrl;
    }
    if (a.endpointUrl.indexOf("aperfector.com") >= 0 || a.endpointUrl.indexOf("robotfruit.com") >= 0 || a.endpointUrl.indexOf("localhost:53788") >= 0) {
        return "RobotfruitNetwork";
    }
    return 'RobotfruitNetwork';
}
function getAuthServerForFeed(a) {
    switch (a.provider_type) {
    case "RobotfruitNingApi":
    case "WebFeed":
        return "RobotfruitNetwork";
    case "RobotfruitWordpressApi":
        if (a.rss_url.indexOf("aperfector.com") >= 0 || a.rss_url.indexOf("robotfruit.com") >= 0) {
            return "RobotfruitNetwork";
        }
        return a.rss_url;
    }
    return "RobotfruitNetwork";
}
function textifyHtml(a) {
    //a = a.replace(/<br.*?>/gi, "\n");
    return a; //a.replace(/<\/?[^>]+(>|$)/g, "");
}
function centerMap(h, g) {
    if (g.length === 0) {
        return;
    } else {
        if (g.length === 1) {
            var f = g[0];
            var j = {
                longitude: f.longitude,
                latitude: f.latitude
            };
            var d = 2;
        } else {
            var j = {
                longitude: 0,
                latitude: 0
            };
            var d = 0;
            for (var e = 0; e < g.length; e++) {
                var f = g[e];
                j.longitude += parseFloat(f.longitude);
                j.latitude += parseFloat(f.latitude);
            }
            j.longitude = j.longitude / g.length;
            j.latitude = j.latitude / g.length;
            for (var e = 0; e < g.length; e++) {
                var f = g[e];
                var c = Geocal.distance(j.latitude, j.longitude, parseFloat(f.latitude), parseFloat(f.longitude));
                if (d < c) {
                    d = c;
                }
            }
        }
    }
    if (j && d) {
        var a = new google.maps.LatLng(j.latitude, j.longitude);
        var b = new google.maps.Circle({
            radius: d * 1000,
            center: a
        });
        h.fitBounds(b.getBounds());
    }
}
function navigateToTwitterConnect(b) {
    location.href = RobotfruitApp.getTwitterConnectPath(b);
}
function twitterConnectAssociateWithCurrentUser(a, b) {
    network.associateTwitterCredentialsWithCurrentUser(a, b, function () {
        $(document).trigger("associateTwitterWithCurrentUser");
        reloadScreen();
    }, function (d, c) {
        onVerificationError(d, c);
    });
}
function twitterConnectLogin(c, d) {
    console.debug("Twitter connect is done");
    var a = function (e) {
        authenticateUser(window.user, "RobotfruitNetwork", e, function () {
            if (se.authenticationScreenObject) {
                reloadScreen();
            } else {
                navigateBack(1);
            }
            console.debug("Authenticated user");
        });
    };
    var b = function () {
        alert("Something went wrong with authentication");
    };
    network.verifyTwitterCredentials(c, d, false, function (e) {
        if (e.twitter_session_key) {
            termsOfServiceAccepted = function (f) {
                if (f) {
                    network.verifyTwitterCredentialsWithSessionKey(e.twitter_session_key, true, a, standardErrorHandler);
                } else {
                    (b || $.noop)();
                }
            };
            showTermsOfServiceDialog();
        } else {
            a(e);
        }
    }, standardErrorHandler);
}
termsOfServiceAccepted = function (a) {
    alert("TOS accepted " + a);
};
showTermsOfServiceDialog = function () {
    network.termsOfService(function (b) {
        var c = user.authenticated("RobotfruitNetwork");
        if (!b.tos || c) {
            termsOfServiceAccepted(true);
        } else {
            var a = {
                title: "Terms of service",
                text: textifyHtml(b.tos),
                options: [{
                    label: M.locAgree,
                    url: "javascript:termsOfServiceAccepted(true)"
                }, {
                    label: M.locDisagree,
                    url: "javascript:termsOfServiceAccepted(false)"
                }]
            };
            device.call("ui/showDialog", a);
        }
    }, function (b, a) {
        if (b.status == 0) {
            ui.error(M.locYouAreOffline);
            navigateBack(1);
        } else {
            termsOfServiceAccepted(false);
        }
    });
};

function facebookConnectAssociateWithCurrentUser(a) {
    network.associateFacebookAccessTokenWithCurrentUser(a, function () {
        $(document).trigger("associateFacebookWithCurrentUser");
        reloadScreen();
    }, function (c, b) {
        onVerificationError(c, b);
    });
}
function facebookConnectLogin(a) {
    console.debug("Facebook connect is done");
    var b = function (c) {
        authenticateUser(window.user, "RobotfruitNetwork", c, function () {
            if (se.authenticationScreenObject) {
                reloadScreen();
            } else {
                navigateBack(1);
            }
            console.debug("Authenticated user");
        });
    };
    network.verifyFacebookAccessToken(a, false, b, function () {
        termsOfServiceAccepted = function (c) {
            if (c) {
                network.verifyFacebookAccessToken(a, true, b, standardErrorHandler);
            }
        };
        showTermsOfServiceDialog();
    });
}
function renderPlaceItemBadges(a) {
    if (!a) {
        return "";
    }
    var b = "";
    $.each(a, function (d, c) {
        if (!c.visibilityBinding) {
            return;
        }
        b += '<div class="se-inline-block se-badge" style="' + bckCss({
            url: c.image
        }) + '"></div>';
    });
    return b;
}
function navigateToFacebookConnect(b) {

    se.activityIndicator.hide();
    RobotfruitApp.getFacebookConnectPath(b);
}
                          
function janRainConnectLogin(b) {
    console.debug("Jan rain started with token " + b);
    se.activityIndicator.clear();
    var a = function (c) {
        authenticateUser(window.user, "RobotfruitNetwork", c, function () {
            console.debug("Authenticating user");
            if (se.authenticationScreenObject) {
                reloadScreen();
            } else {
                navigateBack(1);
            }
            console.debug("Authenticated user");
        });
    };
    network.verifyJanRainCredentials(b, a, standardErrorHandler);
}
function functor(c, b, a) {
    return function () {
        var d = arguments;
        if ($.isArray(a)) {
            d = a;
            for (var e = 0; e < arguments.length; e++) {
                d.push(arguments[e]);
            }
        }
        return c[b].apply(c, d);
    };
}
function navigateToJanRainConnect(a, c) {
    var b = "janRainConnectLogin";
    se.activityIndicator.hide();
    console.debug("Navigate to JanRain connect");
    device.call("ui/showJanRainDialog", {
        appId: a,
        providers: c,
        callback: b
    });
}
var currentGeoPosition;

function requireGeoPosition(c, b, a) {
    c = c || $.noop;
    if (a || secondsHadPassed(config.secondsBetweenGeoPositioning) || currentGeoPosition === undefined) {
        se.activityIndicator.show();
        getGeoPosition(function (d) {
            currentGeoPosition = d;
            console.debug("CURRENT GEO POSITION", currentGeoPosition);
            c();
            se.activityIndicator.hide();
        }, function (d) {
            if (b != true) {
                if (currentGeoPosition === undefined) {
                    currentGeoPosition = {
                        coords: {
                            latitude: 45.815005,
                            longitude: 15.978501
                        }
                    };
                }
            }
            c();
            se.activityIndicator.hide();
        });
    } else {
        c();
    }
}
function requireAuthentication(d, b, a, c) {
    a = a ? a : "RobotfruitNetwork";
    b = b || {};
    if (user.authenticated(a)) {
        d();
    } else {
        se.activityIndicator.hide();
        navigateTo(getScreenUrl("network_login", $.extend({
            autoOpened: true,
            authServer: a
        }, params)));
    }
}
var logout = function () {
    user.logout();
    reloadScreen();
};
var setAndroidOptionsMenu = device.platform == "native" && device.name == "android" ? function (a, b) {
        a = a ? a : "RobotfruitNetwork";
        var c = [{
            label: M.locHome,
            url: "javascript:goToHomeScreen();",
            icon: "img/android/home.png"
        }];
        if (!b) {
            c.push({
                label: M.locRefreshButtonTitle,
                url: "javascript:reloadScreen();",
                icon: "img/android/refresh.png"
            });
        }
        if (user.authenticated(a)) {
            c.push({
                label: M.locLogoutButtonTitle,
                url: "javascript:logout();",
                icon: "img/android/logout.png"
            });
        }
        device.call("ui/setOptionsMenu", {
            items: c
        });
    } : $.noop;

function createAddressLine(a, b, c) {
    var d = a;
    if (a) {
        d += ", ";
    }
    if (b) {
        d += b;
    }
    if (c && c != b) {
        d += ", " + c;
    }
    return d;
}
function getPlaceDistanceText(d, e) {
    if (d == undefined || d.geo == undefined || currentGeoPosition == undefined || d.geo.coordinates[0] == undefined || d.geo.coordinates[1] == undefined) {
        return;
    }
    var b = Geocal.distance(d.geo.coordinates[0], d.geo.coordinates[1], currentGeoPosition.coords.latitude, currentGeoPosition.coords.longitude);
    var a = Geocal.angle(currentGeoPosition.coords.latitude, currentGeoPosition.coords.longitude, d.geo.coordinates[0], d.geo.coordinates[1]);
    var c = geoDistanceToString(b);
    if (e) {
        c += " " + M[geoAngleToString(a)];
    }
    return c;
}
function createAuth(b, a) {
    return Base64.encode(b + ":" + a);
}
function getFavoriteEntityTitle(a) {
    if (a.favorite_entity_type == "Event") {
        return a.favorite_entity.name + " @ " + a.favorite_entity.place.name;
    }
    if (a.favorite_entity_type == "Place") {
        return a.favorite_entity.name;
    }
    if (a.favorite_entity_type == "Shout") {
        return a.favorite_entity.text;
    }
    if (a.favorite_entity_type == "Profile") {
        return a.favorite_entity.screen_name;
    }
}
function getFavoriteEntityUrl(a) {
    if (a.favorite_entity_type == "Event") {
        return getEventDetailsUrl(a.favorite_entity.id);
    }
    if (a.favorite_entity_type == "Place") {
        return getPlaceDetailsUrl(a.favorite_entity.id);
    }
    if (a.favorite_entity_type == "Shout") {
        return getShoutDetailsUrl(a.favorite_entity.id);
    }
    if (a.favorite_entity_type == "Profile") {
        return getUserDetailsUrl(a.favorite_entity.id);
    }
}
function getShoutMessage(c, b) {
    var a = linkify(sanitizeText(c.robotfruit_text_format));
    a = a.replace("{*actor*}", "");
    if (c.favorite_entity) {
        if (a.indexOf("{*entity*}") != -1) {
            a = a.replace("{*entity*}", "<em>" + getFavoriteEntityTitle(c) + "</em>");
        }
    }
    if (c.robotfruit_place) {
        var d = c.robotfruit_place.name || c.robotfruit_place;
        if (a.indexOf("{*place*}") != -1) {
            a = a.replace("{*place*}", "<em>" + d + " </em>");
        } else {
            a = a + " @ <em>" + d + "</em>";
        }
    }
    if (c.robotfruit_properties) {
        if (a.indexOf("{*target*}") != -1 && c.robotfruit_properties.target_user) {
            a = a.replace("{*target*}", '<span class="nick">' + c.robotfruit_properties.target_user.screen_name + "</span>");
        }
        if (a.indexOf("{*badge*}") != -1 && c.robotfruit_properties.badge) {
            a = a.replace("{*badge*}", "<em>" + c.robotfruit_properties.badge.name + "</em>");
        }
    }
    if (a.indexOf("{*") != -1) {
        console.error("could not parse `" + a + "` so displaying shout.text instead");
        a = linkify(sanitizeText(c.text));
    }
    if (!a) {
        a = "&nbsp;";
    }
    return a;
}
function getShoutSourceText(a) {
    return a.source.length > 1 ? ", " + a.source : "";
}
String.prototype.hasPrefix = function (a) {
    return this.indexOf(a) === 0;
};

function showBookmarkBubble() {

}
function openExternalLink(a, c) {
    if (!c) {
        c = $(this).attr("href");
    }(a && a.stopPropagation());
    if (!device.isNativeIPhone() && c && c.hasPrefix("robotfruit://openInBrowser?url=")) {
        c = c.substring("robotfruit://openInBrowser?url=".length);
    }
    if (device.platform === "native") {
        (a && a.preventDefault());
        var b = c || $(a.currentTarget).attr("href");
        if (b) {
            window.open(b);
            /*device.call("load/url", {
                url: b,
                external: true
            });*/
        }
    }
}
function openInVideoPlayer(a) {
    if (device.platform === "native") {
        a.stopPropagation();
        a.preventDefault();
        var b = $(a.currentTarget).attr("href");
        if (b) {
            device.call("load/video", {
                url: b
            });
        }
    } else {
        openExternalLink(a);
    }
}
function openInAudioPlayer(a) {
    if (device.platform === "native") {
        a.stopPropagation();
        a.preventDefault();
        var b = $(a.currentTarget).attr("href");
        if (b) {
            device.call("load/audio", {
                url: b
            });
        }
    } else {
        openExternalLink(a);
    }
}
function getAvatarUrl(b) {
    if (b && b.profile_image_url && b.profile_image_url.indexOf("avatarMedium.jpg") == -1) {
        var a = b.profile_image_url;
        return a.replace("?type=large", "?type=square");
    } else {
        return "img/avatarMedium.jpg";
    }
}
function getImageUrl(a) {
    return a || "img/placeholder.png";
}
function isUserLiked(c, b) {
    if (!b || !c) {
        return false;
    }
    for (var a = 0; a < b.length; a++) {
        if (c === b[a].id) {
            return true;
        }
    }
    return false;
}
function getLikeLabel(c) {
    if (!c || !c.data) {
        return "";
    }
    var d = c.data[0];
    var e = c.data[1];
    var f = c.data[2];
    var b, a;
    if (c.like_id) {
        if (d && c.data.length > 2) {
            b = resolveOtherInLikeLabel(e, c.data.length - 2);
            a = getMessage("locUserAndFriendAndOtherLike", d.name, b);
        } else {
            if (c.data.length > 1) {
                b = resolveOtherInLikeLabel(d, c.data.length - 1);
                a = getMessage("locUserAndOtherLike", b);
            } else {
                a = getMessage("locUserLikes");
            }
        }
    } else {
        if (c.data.length) {
            if (d) {
                if (e && c.data.length > 2) {
                    b = resolveOtherInLikeLabel(f, c.data.length - 2);
                    a = getMessage("locTwoFriendsAndOtherLike", d.name, e.name, b);
                } else {
                    if (c.data.length > 1) {
                        b = resolveOtherInLikeLabel(e, c.data.length - 1);
                        a = getMessage("locFriendAndOtherLike", d.name, b);
                    } else {
                        a = getMessage("locFriendLikes", d.name);
                    }
                }
            } else {
                if (c.data.length > 1) {
                    a = getMessage("locManyPeopleLike", c.data.length);
                } else {
                    a = getMessage("locOnePersonLikes");
                }
            }
        } else {
            a = getMessage("locFirstToLike");
        }
    }
    return a;
}
function resolveOtherInLikeLabel(c, b) {
    var a;
    if (b <= 0) {
        return "";
    } else {
        if (b > 1) {
            a = getMessage("locOtherManyPeople", b);
        } else {
            a = getMessage("locOtherOnePerson");
        }
    }
    return a;
}
function loadLocalization(b, d) {
    se.activityIndicator.show();
    if (["en", "hr", "kr"].indexOf(b) === -1) {
        b = "en";
    }
    localizationLoaded = d;
    var e = RobotfruitApp.getRelativeUrl("localization_" + b + ".js");
    var c = document.createElement("script");
    c.type = "text/javascript";
    c.src = e;
    var a = document.getElementsByTagName("head")[0];
    a.appendChild(c);
}

function getShareUrl(a, b) {
    return getScreenUrl("share", {
        shareTitle: a,
        shareUrl: b
    });
}
function getPlacesUrl(a) {
    return getScreenUrl("GenericScreen", {
        page: "TabbedPage:Category:000000000000000000:Geo"
    });
}
function getLeadImageFromItem(b) {
    if (b && b.attachments && b.attachments.images) {
        var a = b.attachments.images[0];
        if (a && a.width > $(window).width() / 3 && a.height < $(window).height()) {
            return a.src;
        }
    } else {
        return b.images[0];
    }
    return false;
}
function insertImageAttachments(d, a, b) {
    if (!a || !a.length) {
        return d;
    }
    var e = {
        width: $(window).width(),
        height: $(window).height()
    };
    var c = $("<span></span>");
    c.html(d);
    c.find("se-attachment, attachment, se\\:attachment").each(function (g, f) {
        var h = $(f).attr("id");
        var p = 0;
        var j;
        j = false;
        for (p = 0; p < a.length; p++) {
            if (a[p].id === h) {
                j = a[p];
                break;
            }
        }
        if (!j) {
            return;
        }
        if (j.src === b) {
            return;
        }
        if (!j) {
            return;
        }
        var l = "unknown";
        if (j.width >= e.width / 1.2) {
            l = "large";
        } else {
            if (j.width >= e.width / 3) {
                l = "medium";
            } else {
                l = "small";
            }
        }
        var n = false;
        var k = false;
        if (j.width) {
            n = Math.min(j.width, e.width - 42) + "px";
        } else {
            n = "auto";
        }
        if (j.height) {
            k = j.height / j.width * n + "px";
        } else {
            k = "auto";
        }
        switch (l) {
        case "large":
        case "medium":
            var o = new SEImage({
                src: j.src,
                width: j.width,
                height: j.height
            }),
                q = $('<span class="se-img-attachment se-block"></span>');
            o.load(q);
            $(f).replaceWith(q);
            break;
        case "small":
            $(f).replaceWith("<img src='" + j.src + "' class='small-img'></img>");
            break;
        }
    });
    return c.html();
}
function getPlaceDetailsTitle() {
    return getMessage("locPlaceDetailsTitle");
}
function getPlaceDetailsUrl(a) {
    return getScreenUrl("GenericScreen", {
        page: "DetailsPage:Category:000000000000000000",
        itemId: a
    });
}
function bckCss(a) {
    var b = "";
    b += "background-image: url(" + imageUrl(a.url) + "); background-position: center; background-repeat: no-repeat; ";
    if (a.width && a.height) {
        b += "background-size: " + a.width + "px " + a.height + "px; ";
        b += "width: " + a.width + "px; ";
        b += "height: " + a.height + "px; ";
    }
    return b;
}
function renderShoutAttachments(b, f) {
    if (!b) {
        return "";
    }
    var c = "",
        a, e = f.placeName;
    if (e) {
        c += renderEjs("checkin-attachment", {
            item: f
        });
    }
    for (var d = 0; d < b.length; d++) {
        a = b[d];
        switch (a.type) {
        case "picture":
            c += renderEjs("img-attachment", {
                item: a,
                icon: "se-photo-icon"
            });
            break;
        case "video":
            c += renderEjs("img-attachment", {
                item: a,
                icon: "se-video-icon"
            });
            break;
        case "link":
            c += renderEjs("link-attachment", {
                item: a
            });
            break;
        }
        console.log(a.type);
    }
    return c;
}
function getSubscribeToNewsletterUrl() {
    return getScreenUrl("newsletter_subscribe", {});
}
function getShoutsUrl(b) {
    b = b || {};
    var a = (b.user_id) ? "APP:ListPage:UsersTimeline" : "APP:ListPage:PublicTimeline";
    var c = RobotfruitApp.getPageByRef({
        "$ref": a
    });
    return getScreenUrl("GenericScreen", {
        page: a,
        dsParams: {
            memberId: b.user_id
        }
    });
}
function getShoutDetailsUrl(b, a) {
    return null;
}
function getCheckinUrl(b) {
    var a = {};
    a.type = "checkin";
    if (b) {
        a.placeId = b.id || b;
    }
    return getScreenUrl("shouts_new", a);
}
function getEventCheckinText(a) {
    if (a.place) {
        return a.name + " @ " + a.place.name;
    }
    return M.locCheckInAtEvent + a.name;
}
function getEventShoutUrl(a) {
    return getScreenUrl("shouts_new", {
        placeId: a.place ? a.place.id : "",
        text: getEventCheckinText(a),
        type: "checkIn",
        subType: "eventShout"
    });
}
function getReshoutUrl(b, a, c) {
    return getScreenUrl("shouts_new", {
        type: "reshout",
        shoutId: b,
        text: "RS @" + a + " " + c
    });
}

function getGoogleStaticMapSize() {
    var a = {
        width: $(window).width(),
        height: $(window).width()
    };
    var b = (a.width < a.height ? a.height : a.width);
    return a.width + "x" + Math.max(b - 170, 100);
}
function addMarkerToGoogleMap(h, e, g, b, d, a) {
    var f = new google.maps.LatLng(e, g);
    var j = new google.maps.Marker({
        position: f,
        map: h,
        title: d,
    });
    if (b) {
        j.icon = b;
    }
    jBubbleContent = $(renderEjs("map_item", {
        feedItem: {
            label: d
        }
    }));
    var c = new InfoBubble({
        content: jBubbleContent.get()[0],
        disableAutoPan: true,
        hideCloseButton: true,
        padding: 0,
        borderWidth: 0,
        backgroundColor: "rgba(0,0,0,.2)",
        arrowSize: 8,
        disableAnimation: true
    });
    jBubbleContent.bind("click", function () {
        c.close();
        (a || $.noop)();
    });
    google.maps.event.addListener(j, "click", function () {
        c.open(h, j);
    });
    google.maps.event.addListener(h, "click", function () {
        c.close();
    });
    return j;
}
function createGoogleMap(a, c, b) {
    se.activityIndicator.show();
    requireGoogleMapsApi(function () {
        var d = new google.maps.LatLng(currentGeoPosition.coords.latitude, currentGeoPosition.coords.longitude);
        var e = d;
        if (c) {
            e = new google.maps.LatLng(c.coords.latitude, c.coords.longitude);
        }
        var h = {
            zoom: 16,
            center: e,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false,
            navigationControl: true,
            navigationControlOptions: {
                style: google.maps.NavigationControlStyle.ANDROID
            },
            streetViewControl: false,
            zoomControl: true,
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.SMALL,
                position: google.maps.ControlPosition.LEFT_BOTTOM
            }
        };
        $("#mapCanvas").css("height", ui.contentSize().height);
        var f = new google.maps.Map(document.getElementById("mapCanvas"), h);
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
function getCommentUrl(a, b) {
    return getScreenUrl("shouts_new", {
        type: "comment",
        inReplyToShoutId: a,
        text: "@" + b + " "
    });
}
function getNewShoutUrl() {
    return getScreenUrl("shouts_new", {
        type: "shout"
    });
}
function getNewPlaceCategoriesUrl(a, b, e) {
    var d = {};
    if (a) {
        d.categoryId = a;
    }
    if (b) {
        d.categoryName = b;
    }
    if (e && $.isArray(e)) {
        var c = e.concat([a]);
        d.categoryPath = c.join(",");
    }
    return getScreenUrl("places_categories", d);
}

function getHomeUrl() {
    return getScreenUrl("home");
}

function goToHomeScreen() {
    if (currentScreen != "home") {
        navigateTo("home");
    }
}
function goToNearbyPlacesByCategory(a) {
    network.getPlaceCategory(a, function (b) {
        if (b.categories.length > 0) {
            navigateTo(getPlaceCategoriesUrl(a));
        } else {
            navigateTo(getPlacesUrl(a));
        }
    }, function () {
        navigateTo(getPlaceCategoriesUrl(a));
    });
}

function getLoginUrl() {
    return getScreenUrl("network_login");
}
function getGeoSelectUrl(a) {
    return getMessage("geo_edit", {
        back: a
    });
}
function getEventsCategoriesUrl() {
    return getScreenUrl("events_categories");
}
function getEventsUrl(a) {
    var b = a ? {
        categoryId: a
    } : undefined;
    return getScreenUrl("events_list", b);
}
function onClickGoTo(a) {
    return "location.hash = '" + a + "'; return false;";
}
function getNewsUrl(a, b) {
    var c = {
        categoryId: a,
        feedName: b
    };
    return getScreenUrl("news", c);
}
function getNewsCategoriesUrl(a) {
    return getScreenUrl("news_categories", {
        feedName: a
    });
}
function getNewsArticleUrl(b, a, c) {
    return getScreenUrl("news_article", {
        categoryId: b,
        articleId: a,
        feedName: c
    });
}


var refreshNewsFeed, toggleNewsLike, createNewsComment, shareNewsArticleLink;
var onNewsCommentComplete, onNewsCommentLogin;


function avatarImg(d) {
    var c = $.extend({
        cls: "",
        placeholder: I.imageLoadingIcon
    }, d),
        a = "",
        b = "";
    if (c.imageUrl) {
        b = '<img class="se-cropable" onload="cropImage(event);seImageLoaded(event)" onerror="seImageLoadError(event)" src="' + imageUrl(c.imageUrl) + '"></img>';
    }
    a = '<div class="' + c.cls + '" style="background-image: url(' + imageUrl(c.placeholder) + ')">' + b + "</div>";
    return a;
}
function seImageLoaded(a) {
    var b = $(a.target);
    var c = b.parent();
    c.removeClass("img-loading");
    c.css({
        "background-image": "none"
    });
    b.removeClass("img-loading");
    b.show();
}
function seImageLoadError(a) {
    var b = $(a.target);
    var c = b.parent();
    c.removeClass("img-loading");
    c.addClass("img-loading-failed");
    b.hide();
    b.removeClass("img-loading");
    b.addClass("img-loading-failed");
}
function centerImage(c) {
    var d = $(c.target);
    var e = d.parent();
    var k = d.width();
    var g = d.width() || d[0].width || 0;
    var f = d.height() || d[0].height || 0;
    var b = e.width();
    var a = e.height();
    var h = (b - g) / 2;
    var j = (a - f) / 2;
    d.css({
        left: h + "px",
        top: j + "px"
    });
}
function newsImageLoaded(a) {
    cropImage(a);
}
function cropImageFit(a) {
    cropImage(a, "fit");
}
function cropImage(d, p) {
    if (d.target) {
        var e = $(d.target);
    } else {
        var e = d;
    }
    e.addClass("loaded");
    var g = e.parent();
    e.show();
    if (!g.hasClass("crop") && !g.hasClass("se-crop")) {
        return;
    }
    var j = parseInt(e.outerWidth() || e[0].width || 0, 10);
    var h = parseInt(e.outerHeight() || e[0].height || 0, 10);
    var c = parseInt(g.width(), 10);
    var b = parseInt(g.height(), 10);
    if (j === 0 || h === 0 || c === 0 || b === 0) {
        return;
    }
    console.debug("image [" + j + "," + h + "] container[" + c + "," + b + "]");
    if (h && j) {
        var n, l;
        var f = j / h;
        var a = Math.abs(j - c) > f * Math.abs(h - b);

        if (p == "fit") {

            if (j > c && h > b) {
                if (a) {
                    l = b;
                    n = Math.round(j * l / h);
                } else {
                    n = c;
                    l = Math.round(h * n / j);
                }
            } else {
                if (j > c) {
                    l = b;
                    n = Math.round(j * l / h);
                } else {
                    if (h > b) {
                        n = c;
                        l = Math.round(h * n / j);
                    } else {
                        if (a) {
                            n = c;
                            l = Math.round(h * n / j);
                        } else {
                            l = b;
                            n = Math.round(j * l / h);
                        }
                    }
                }
            }
        } else {

            if (a) {
                l = b;
                n = Math.round(j * b / h);
                console.log('shift: '+n);
            } else {
                n = c;
                l = Math.round(h * n / j);
            }
        }
        var k = (c - n) / 2;
        var o = (b - l) / 2;
        console.debug("new top: " + o + " new left: " + k + " new width: " + n + " new height " + l);
        e.css({
            top: o + "px",
            left: k + "px",
            width: n + "px",
            height: l + "px"
        });
    }
    g.removeClass("img-loading");
    e.removeClass("img-loading");
    e.show();
}
function newsImageLoadError(a) {
    $(a.target).remove();
}
var getSizedImage = function (e) {
    if (!getSizedImage.categories) {
        getSizedImage.categories = {
            small: ["-Ti.", "-Th.", "-S.", "_s."],
            medium: ["-M.", "_m."],
            large: ["-L.", "-XL.", "-X2.", "-X3.", "-O."]
        };
    }
    var a, c, d;
    var b = function (g, h) {
        var j, k;
        for (j = 0; j < g.length; j++) {
            k = e.split(g[j]);
            if (k.length > 1 && k[k.length - 1].length <= 4) {
                return {
                    imageParts: k,
                    imageUrl: e,
                    size: h,
                    imageName: k.join()
                };
            }
        }
    };
    var f = b(getSizedImage.categories.small, "s") || b(getSizedImage.categories.medium, "m") || b(getSizedImage.categories.large, "l") || {
        imageUrl: e,
        imageName: e
    };
    return f;
};
var getImageOfSize = function (b, c, d) {
    if (!b) {
        return;
    }
    if (!c) {
        return b;
    }
    var a, e;
    b = getSizedImage(b);
    for (a = 0; a < c.length; a++) {
        e = getSizedImage(c[a]);
        if (e.size && d.indexOf(e.size) >= 0 && b.imageName == e.imageName) {
            return e.imageUrl;
        }
    }
    return b.imageUrl;
};
var getPhotoFeedImage, getVideoFeedImage;
(function () {
    var a = $("<span></span>");
    getPhotoFeedImage = function (e) {
        var d;
        if (e.images && e.images.length > 0) {
            d = getImageOfSize(e.images[0], e.images, "lm");
        }
        if (!d) {
            d = e.thumbnail;
        }
        var c = function (f, h) {
            if (!f) {
                return;
            }
            if (!h) {
                h = "a img";
            }
            f = sanitizeHtml(f);
            var g = $("<span></span>");
            g.html(f);
            var j = g.find(h).attr("src");
            g.html("");
            return j;
        };
        var b = function (f) {
            var g = c(f, "a img[src*='flickr.com/']");
            if (g) {
                g = g.replace("_m", "_s");
            }
            return g;
        };
        if (!d) {
            d = b(e.content) || c(e.content);
        }
        if (!d) {
            d = b(e.summary) || c(e.summary);
        }
        if (!d) {
            return "";
        }
        return d;
    };
    getVideoFeedImage = function (c) {
        var b = c.images[0];
        if (!b) {
            b = c.thumbnail;
        }
        if (!b) {
            a.html(sanitizeHtml(c.content || c.summary, true));
            b = a.find("img:first").attr("src") || "";
            a.html("");
        }
        return b;
    };
})();


function getUserDetailsUrl(d, a, b) {
    var c = {};
    if (d) {
        c.userId = d;
    }
    c.datasourceId = a || "RobotfruitDataSource:Users:All";
    c.dsParams = b;
    return getScreenUrl("users_details", c);
}
function getNotificationsUrl() {
    return getScreenUrl("notifications");
}
function getYouTubeVideoId(a) {
    match = a.match(/\/v\/([^\?\&]+)/);
    if (!match) {
        match = a.match(/\?v=([^\&]+)/);
    }
    if (match) {
        return match[1];
    }
    return null;
}
function getVideoUrl(b) {
    var a, c = "";
    if (b.indexOf("youtube.com/") >= 0) {
        a = b.match(/\/v\/([^\?\&]+)/);
        if (!a) {
            a = b.match(/\?v=([^\&]+)/);
        }
        if (a) {
            if (device.name !== "android") {
                c = "http://www.youtube.com/v/";
            } else {
                c = "ytv://";
            }
            c += a[1];
        }
    } else {
        c = b;
    }
    return c;
}
function canPlayEmbeddedVideo(a) {
    if (device.name !== "iPhone") {
        return false;
    }
    return a.indexOf("youtube.com/") >= 0 || a.indexOf("vimeo.com/") >= 0 || a.indexOf(".mp4") >= 0;
}
function getYouTubeThumbnailUrl(b) {
    if (b && b.src && b.src.indexOf("youtube.com")) {
        var a = getYouTubeVideoId(b.src);
        return "http://i.ytimg.com/vi/" + a + "/default.jpg";
    }
}
function getVideoImageUrl(b) {
    var c = b.src || b;
    if (c.indexOf("youtube.com/") >= 0) {
        var a = getYouTubeVideoId(c);
        if (a) {
            return "http://i.ytimg.com/vi/" + a + "/hqdefault.jpg";
        }
    }
    return RobotfruitApp.getRelativeUrl("theme/img/audio-play.png");
}
function canPlayEmbeddedAudio() {
    return device.name !== "android";
}
function getSearchUrl() {
    return getScreenUrl("search");
}

function getUsersUrl(a) {
    var b = RobotfruitApp.getPageByRef({
        "$ref": "APP:ListPage:Users"
    });
    return getScreenUrl("GenericScreen", {
        page: "APP:ListPage:Users",
        type: a.type || "all",
        userId: a.user_id || undefined
    });
}
function getEditProfileUrl() {
    return getScreenUrl("edit_profile", {});
}
function getMessagesUrl() {
    //return getScreenUrl("messages_list");
}

function getPhotoDetailsUrl(b, a) {
    return getScreenUrl("photo_details", {
        categoryId: b,
        articleId: a
    });
}
function getAudioFeedUrl(a) {
    var b = a ? {
        categoryId: a
    } : undefined;
    return getScreenUrl("audio_feed", b);
}
function getAudioCategoriesUrl() {
    return getScreenUrl("audio_categories");
}
function getAudioDetailsUrl(b, a) {
    return getScreenUrl("audio_details", {
        categoryId: b,
        articleId: a
    });
}
function canShowNewsDetails(a) {
    return !(device.platform === "native" && (a || "").indexOf("slideshare.net/") >= 0);
}