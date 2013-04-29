robotfruit = window.robotfruit || {
    providers: {}
};

function arrayMergeAppend(d, g, c) {
    if (g.length === 0) {
        return d.slice(0);
    }
    var a = g[0][c].toString();
    var f = false;
    for (var b = 0; b < d.length; b++) {
        var e = d[b][c].toString();
        if (a == e) {
            f = d.slice(0, b);
            break;
        }
    }
    if (!f) {
        f = d.slice(0);
    }
    return f.concat(g);
}
robotfruit.providers.cache = (function () {
    var a = function (d) {
        return {
            val: d,
            cachedAt: (new Date()).getTime()
        };
    };
    var c = function (d, f) {
        if (!d) {
            return null;
        }
        if (typeof d !== "object") {
            return null;
        }
        if (!d.val) {
            return null;
        }
        var e = new Date().getTime();
        if (f.cacheExpireTimeout > 0 && e - d.cachedAt > f.cacheExpireTimeout) {
            return null;
        }
        return d.val;
    };
    var b = function (d) {
        return d;
    };
    return {
        executeAndCache: function (d, e, g, h) {
            var f = h.success;
            h.success = function (j) {
                d.set(e, j);
                (f || $.noop)(j);
            };
            g(h);
        },
        CompositeCache: function (d) {
            var e = {
                caches: d
            };
            this.set = function (f, g) {
                $.each(e.caches, function (j, h) {
                    h.put(f, g);
                });
            };
            this.get = function (g) {
                var f, h;
                for (f = 0; f < e.caches.length; f++) {
                    h = e.caches[f].get(g);
                    if (h) {
                        return h;
                    }
                }
                return null;
            };
            this.clear = function () {
                $.each(e.caches, function (g, f) {
                    f.clear();
                });
            };
        },
        MemoryCache: function (e) {
            var f = {
                cacheExpireTimeout: -1
            };
            $.extend(f, e);
            var d = {};
            this.set = function (g, h) {
                d[b(g)] = a(h);
            };
            this.get = function (h) {
                var g = d[b(h)];
                return c(g, f);
            };
            this.remove = function (g) {
                for (var h in d) {
                    if (h.match(g) || h === g) {
                        delete d[h];
                    }
                }
            };
            this.clear = function () {
                d = {};
            };
        },
        DBCache: function (d) {
            var e = {
                uniqueId: "",
                cacheExpireTimeout: -1
            };
            $.extend(e, d);
            e.uniqueId = b(e.uniqueId);
            this.set = function (g, h) {
                if (device.platform_name === "native_android") {
                    return;
                }
                var f = DB.get(e.uniqueId);
                if (f && (typeof (f) == "object")) {
                    f[g] = a(h);
                } else {
                    f = {
                        key: a(h)
                    };
                }
                DB.set(e.uniqueId, f);
            };
            this.get = function (h) {
                var f = DB.get(e.uniqueId);
                if (!f || (typeof (f) != "object")) {
                    return null;
                }
                var g = f[h];
                return c(g, e);
            };
            this.clear = function () {
                DB.set(e.uniqueId, null);
            };
        }
    };
})();


DataSourceListFeedProvider = (function () {
    var a = {
        instance: function (c, f) {
            var e, d;
            d = Binding.createObject({
                bindDesc: c.parameters,
                bindEnv: f || {},
                context: {
                    page: f,
                    datasourceParameters: f ? f.dsParams : {}
                }
            });
            if (c.type == "InlineDataSource") {
                e = {
                    statusObject: $("<div></div>"),
                    find: function (h) {
                        var g = {
                            data: c.data,
                            paging: {
                                next: null,
                                previous: null
                            }
                        };
                        if (h.fromCache) {
                            return g;
                        }(h.success || $.noop)(g);
                    },
                    get: function (h) {
                        var g = c.data;
                        if (h.fromCache) {
                            return g[0];
                        }(h.success || $.noop)(g[0]);
                    }
                };
            } else {
                if (c.type == "CustomDataSource") {
                    return c.createListProvider(d);
                } else {
                    if (c.id == "RobotFruitDataSource:Users:Friends" || c.id == "RobotfruitDataSource:Users:All") {
                        return new UsersListProvider({
                            user_id: getVal(f, "dsParams.id")
                        });
                    } else {
                        if (c.type == "ActivityDataSource") {
                            return new ShoutsListProvider({
                                user_id: d.memberId,
                                feedType: d.type
                            });
                        } else {

                            var b = getAuthServerForDataSource(c);
                            return new RobotfruitApiNewsProvider({
                                categoryId: d.category_id,
                                apiUrl: c.endpointUrl,
                                authServer: b,
                                methodPrefix: d.method_prefix,
                                searchParam: d.search_param,
                                idName: c.idName,
                                idParam: d.id_param,
                                dsParams: f ? f.dsParams : {}
                            });
                                
                            
                        }
                    }
                }
            }
            return e;
        }
    };
    return a;
})();

ProviderBase = Class.extend({
    idProperty: "id",
    idParamName: "id",
    init: function (b) {
        var a = $.extend({
            useCaching: true
        }, b);
        this.useCaching = a.useCaching;
        this.statusObject = $("<div></div>");
        this.api = this.createApi(b);
        this.query = "";
    },
    createApi: function (a) {
        return null;
    },
    createRESTApi: function (c) {
        var b = $.extend({
            url: config.robotfruitApi + "/%s",
            authServer: "RobotfruitNetwork",
            appendTypeToUrl: true
        }, c);
        var a = new robotfruit.services.ServiceClient({
            url: b.url,
            authServer: b.authServer,
            status: this.statusObject,
            appendTypeToUrl: b.appendTypeToUrl
        });
        a.defaultParams.nid = RobotfruitApp.getNid();
        return a;
    },
    getIsAbsoluteUrl: function (a) {
        return false;
    },
    findNext: function (b) {
        b = $.extend({
            limit: 20
        }, b);
        if (!b.next) {
            return;
        }
        var c = this.getFindParams(b),
            a = this.api;
        a.GET(this.getFindUrl(b), c, functor(this, "onFindSuccess", [b, "findNextSuccess", this.query]), functor(this, "onError", [b, "findNextError"]), false, false, {
            inBackground: b.inBackground,
            absoluteUrl: this.getIsAbsoluteUrl(b)
        });
    },
    getFromQueryCache: function (b) {
        var a = this.getFromCache(b);
        if (a && (!a.query || a.query == this.query)) {
            return a;
        }
        return false;
    },
    getFindApiOptions: function () {
        return {};
    },
    addFindHeaders: function (b, a) {},
    find: function (d) {
        d = $.extend({
            limit: 20
        }, d);
        var b = this.getFromQueryCache(d);
        if (d.fromCache) {
            return b;
        }
        var e = this.getFindParams(d),
            a = this.api,
            c = {};
        if (b && b.created && device.platform == "native") {
            c["If-Modified-Since"] = b.created;
        }
        this.addFindHeaders(d, c);
        a.GET(this.getFindUrl(d), e, functor(this, "onFindSuccess", [d, "findSuccess", this.query]), functor(this, "onError", [d, "findError"]), false, false, $.extend({
            inBackground: d.inBackground,
            headers: c
        }, this.getFindApiOptions()));
    },
    setQuery: function (a) {
        if (!isEqual(a, this.query)) {
            this.query = a;
            this.getCache().clear();
            return true;
        }
        return false;
    },
    onFindSuccess: function (d, b, e, c) {
        if (this.query != e) {
            return;
        }
        var f = {
            data: this.getListFromRawData(c),
            paging: {
                next: null
            }
        }, g = f,
            a = this.getFromCache(d);
        this.addNextToResult(f, d, c);
        if (this.useCaching) {
            if (d.next && a) {
                g = a;
                a.paging.next = f.paging.next;
                a.data = arrayMergeAppend(a.data, f.data, this.idProperty);
            } else {
                g = f;
                g.created = (new Date()).toUTCString();
                g.query = this.query;
            }
            this.getCache().set(this.getCacheKey(), g);
        }
        this.statusObject.trigger(b, [f, d]);
        (d.success || $.noop)(f);
    },
    onError: function (d, c, e, b) {
        if (c == "findError" && e.status == 304) {
            var a = this.getFromCache(d);
            if (a) {
                this.statusObject.trigger("findSuccess", [a, d]);
                (d.success || $.noop)(a);
                return;
            }
        }(d.error || $.noop)(e, b);
        this.statusObject.trigger(c, [e, b]);
    },
    get: function (b) {
        var a = this.getSingleFromCache(b);
        if (b.fromCache) {
            return a;
        } else {
            if (a && b.canUseCache) {
                b.success(a);
                return a;
            }
        }
        this.api.GET(this.getGetUrl(b), this.getGetParams(b), functor(this, "onGetSuccess", [b]), b.error, false);
    },
    onGetSuccess: function (b, a) {
        (b.success || $.noop)(this.getSingleFromRawData(a));
    },
    getSingleFromRawData: function (a) {
        return a;
    },
    getSingleFromCache: function (b) {
        var a = this.getFromCache(b);
        if (a && a.data) {
            return getFromObjectList(a.data, this.idProperty, b.postId);
        }
    },
    getGetUrl: function (a) {
        return "";
    },
    getGetParams: function (a) {
        return {};
    },
    getListFromRawData: function (a) {
        return a;
    },
    getFindUrl: function (a) {
        return "";
    },
    addNextToResult: function (b, a) {
        return b;
    },
    getFindParams: function (a) {
        return {};
    },
    getCache: function () {
        return null;
    },
    getFromCache: function (a) {
        return this.getCache().get(this.getCacheKey(a));
    },
    getCacheKey: function (a) {
        return this.getFindUrl(a);
    }
});
SEPlacesProvider = ProviderBase.extend({
    init: function (b) {
        var a = $.extend({
            categoryPath: []
        }, b);
        this.categoryPath = a.categoryPath;
        this._super(a);
    },
    createApi: function (b) {
        var a = new robotfruit.services.ServiceClient({
            url: (b.robotfruitApi || config.robotfruitApi) + "/%s",
            authServer: "RobotfruitNetwork",
            status: this.statusObject
        });
        a.defaultParams.nid = RobotfruitApp.getNid();
        return a;
    },
    getFindUrl: function (a) {
        return "categories/select/root";
    },
    getCache: function () {
        return SEPlacesProvider.placesCache;
    },
    getFromCache: function (b) {
        var a = this._super(b);
        if (a) {
            return {
                data: this.findCategory(a.data, [].concat(this.categoryPath)),
                paging: a.paging
            };
        }
        return a;
    },
    getListFromRawData: function (a) {
        return this.findCategory(a, [].concat(this.categoryPath));
    },
    findCategory: function (b, d) {
        if (!d || d.length === 0) {
            return b;
        }
        if ($.isArray(b)) {
            for (var c = 0; c < b.length; c++) {
                var a = b[c];
                if (!$.isArray(a) && isEqual(a.id, d[0])) {
                    if (d.length === 1) {
                        return [a].concat(a.categories);
                    } else {
                        d.shift();
                        return this.findCategory(a.categories, d);
                    }
                }
            }
            for (var c = 0; c < b.length; c++) {
                var e = this.findCategory(b[c], d);
                if (e) {
                    return e;
                }
            }
        } else {
            if (isEqual(b.id, d[0])) {
                if (d.length === 1) {
                    return [b].concat(b.categories);
                } else {
                    d.shift();
                    return this.findCategory(b.categories, d);
                }
            } else {
                if (b.categories) {
                    return this.findCategory(b.categories, d);
                }
            }
        }
        return false;
    }
});
SEPlacesProvider.placesCache = new robotfruit.providers.cache.MemoryCache({
    uniqueId: "API_PLACES_PROVIDER_CACHE",
    cacheExpireTimeout: 60 * 60 * 1000
});

getDeviceSource = function () {
    if (device.name == "iphone") {
        return "iPhone";
    } else {
        if (device.name == "android") {
            return "Android";
        } else {
            if (device.name == "nokia") {
                return "Nokia";
            } else {
                if (device.name == "opera mobi") {
                    return "Opera Mobile";
                } else {
                    return "Mobile";
                }
            }
        }
    }
};
ShoutsListProvider = ProviderBase.extend({
    methodName: "statuses/public_timeline",
    type: "ShoutsProvider",
    init: function (a) {
        a = $.extend({
            feedType: "PublicShouts"
        }, a);
        this._super(a);
        switch (a.feedType) {
        case "FriendsShouts":
            this.methodName = "status/friends_timeline";
            break;
        case "MemberShouts":
            this.methodName = "status/user_timeline/" + a.user_id;
            break;
        default:
            this.methodName = "status/public_timeline";
            break;
        }
    },
    createApi: function (b) {
        var a = new robotfruit.services.ServiceClient({
            url: (b.robotfruitApi || config.robotfruitApi) + "/%s",
            authServer: "RobotfruitNetwork",
            status: this.statusObject
        });
        a.defaultParams.nid = RobotfruitApp.getNid();
        return a;
    },
    getIsAbsoluteUrl: function (a) {
        return a.next;
    },
    getFindUrl: function (a) {
        if (a.next) {
            return a.next;
        }
        if (this.query) {
            return "search";
        }
        return this.methodName;
    },
    addNextToResult: function (c, b, a) {
        if (a.paging && a.paging.next) {
            c.paging.next = a.paging.next;
        }
    },
    getFindParams: function (a) {
        if (a.next) {
            return {};
        }
        return {
            include_robotfruit_fields: true,
            count: a.limit,
            include_anonymous_shouts: true,
            standard_response: true,
            q: this.query
        };
    },
    getGetUrl: function (a) {
        return "statuses/show";
    },
    getGetParams: function (a) {
        return {
            include_robotfruit_fields: true,
            id: a.id || a.postId
        };
    },
    onGetSuccess: function (b, a) {

        (b.success || $.noop)(a);
    },
    getListFromRawData: function (a) {
        if (a.data) {
            a = a.data;
        }
        return a;
    },
    getCacheKey: function () {
        return this.methodName;
    },
    getCache: function () {
        return ShoutsListProvider.shoutsCache;
    },
    create: function (b) {
        var a = $.extend({
            source: getDeviceSource(),
            text: "",
            inReplyTo: undefined,
            latitude: undefined,
            longitude: undefined,
            locationName: undefined,
            placeId: undefined,
            linkAttachment: undefined,
            fileAttachment: undefined,
            shareFacebook: false,
            shareTwitter: false,
            shareFoursquare: undefined,
            notificationsIncluded: undefined,
            success: $.noop,
            error: $.noop
        }, b);
        this.api.POST("status/update", {
            status: a.text,
            in_reply_to_status_id: a.inReplyTo,
            lat: a.latitude,
            "long": a.longitude,
            source: a.source,
            robotfruit_place_id: a.placeId,
            link_attachment: a.linkAttachment,
            robotfruit_location_name: a.locationName,
            share_facebook: a.shareFacebook,
            share_twitter: a.shareTwitter,
            share_foursquare: a.shareFoursquare,
            notifications_included: a.notificationsIncluded,
            file_attachment: a.fileAttachment
        }, functor(this, "onNewShout", [a]), a.error);
    },
    onNewShout: function (a, b) {
        ShoutsListProvider.shoutsCache.clear();
        a.success(b);
    },
    remove: function (a) {
        this.api.POST("status/destroy.json", {
            id: a.id
        }, function () {
            $(document).trigger("shoutDeleted", [a.id]);
            (a.success || $.noop)();
        }, a.error);
    }
});
ShoutsListProvider.shoutsCache = new robotfruit.providers.cache.MemoryCache({
    uniqueId: "API_SHOUTS_PROVIDER_CACHE",
    cacheExpireTimeout: 60 * 60 * 1000
});
$(document).bind("shoutSent shoutDeleted", function () {
    ShoutsListProvider.shoutsCache.clear();
});
$(document).bind("shoutLikeToggled", function () {
    ShoutsListProvider.shoutsCache.clear();
});


SEConfigurationProvider = ProviderBase.extend({
    init: function (b) {
        var a = $.extend({
            nid: config.networkId,
            version: config.apiVersion,
            designMode: config.designMode
        }, b);
        this.nid = a.nid;
        this.version = a.version;
        this.designMode = a.designMode;
        this._super(b);
        this.useCaching = false;
    },
    createApi: function () {
        var a = new robotfruit.services.ServiceClient({
            url: (config.configurationApi || config.robotfruitApi) + "/%s",
            authServer: "RobotfruitNetwork"
        });
        return a;
    },
    loadLocalization: function (b, c, a) {
        this.api.GET(b, {}, c, a, false, false, {
            absoluteUrl: true
        });
    },
    getFindUrl: function () {
        if (config.designMode) {
            return "new.json";
        } else {
            return "live.json";
        }
    },
    getCacheKey: function () {
        return this.nid;
    },
    getFindParams: function () {
        var a = window.devicePixelRatio >= 1.5 ? "retina" : "nonretina";
        return {
            include_robotfruit_fields: true,
            nid: this.nid,
            version: this.version,
            design_mode: this.designMode,
            device_type: "android",
            screen_density: a
        };
    },
    getCache: function () {
        return SEConfigurationProvider.cache;
    }
});
SEConfigurationProvider.cache = new robotfruit.providers.cache.DBCache({
    uniqueId: "API_CONFIGURATION_PROVIDER_CACHE",
});


robotfruit.providers.authenticationProviderFactory = {
    create: function (a) {
        if (a.type == "RobotfruitNetwork") {
            console.debug("Creating network authentication provider");
            return new robotfruit.providers.RobotfruitNetworkAuthenticationProvider();
        } else {
            console.debug("Creating api authentication provider for " + a.type);
            return new robotfruit.providers.RobotfruitApiAuthenticationProvider({
                apiUrl: a.type
            });
        }
    }
};
robotfruit.providers.RobotfruitApiAuthenticationProvider = function (b) {
    var a = new robotfruit.services.ServiceClient({
        url: b.apiUrl,
        appendTypeToUrl: false,
        methodParameterName: "method"
    });
    this.authenticate = function (d) {
        var c = {};
        a.POST("users/authenticate", {
            username: d.username,
            password: d.password
        }, function (e) {
            d.success({
                authType: "url",
                sessionId: e.session_id,
                userId: e.user_id
            });
        }, d.error, false, c);
    };
};
robotfruit.providers.RobotfruitNetworkAuthenticationProvider = function (a) {
    this.authenticate = function (e) {
        var b;
        if (e.sessionId) {
            b = e.sessionId;
        } else {
            if (e.username && e.password) {
                b = createAuth(e.username, e.password);
            }
        }
        if (!e.username && !e.password && !e.sessionId) {
            e.error();
            return;
        }
        var c = RobotfruitApp.getModule(RobotfruitApp.MODULES.COMMUNITY);
        var d = c && c.communityType === "Ning";
        if (d) {
            if (!e.username && !e.password) {
                network.verifyUser(e.userId, {
                    authenticated: true,
                    authType: "url",
                    sessionId: e.sessionId
                }, function (f) {
                    e.success({
                        userId: f.id,
                        sessionId: e.sessionId,
                        authType: "url"
                    });
                }, e.error);
            } else {
                network.verifyNingCredentials(e.username, e.password, function (f) {
                    e.success({
                        authType: "url",
                        sessionId: f.session_id,
                        userId: f.user.id
                    });
                }, e.error);
            }
            return;
        }
        if (b) {
            network.verifyNetworkCredentials(e.username, e.password, function (f) {
                e.success({
                    authType: "url",
                    sessionId: f.session_id,
                    userId: f.user.id
                });
            }, e.error);
        } else {
            network.getUserInfo(null, function (f) {
                e.success({
                    userId: f.id
                });
            }, e.error);
        }
    };
};
UsersListProvider = ProviderBase.extend({
    idProperty: "id",
    idParamName: "id",
    init: function (a) {
        this._super(a);
        if (a.listType == "followers") {
            this.category = "statuses/followers/" + a.user_id;
        } else {
            if (a.user_id) {
                this.category = "statuses/friends/" + a.user_id;
            } else {
                this.category = "users/all";
            }
        }
    },
    createApi: function (b) {
        var a = new robotfruit.services.ServiceClient({
            url: (b.robotfruitApi || config.robotfruitApi) + "/%s",
            authServer: "RobotfruitNetwork",
            status: this.statusObject
        });
        a.defaultParams.nid = RobotfruitApp.getNid();
        return a;
    },
    getFindUrl: function (a) {
        if (this.query) {
            return "users/search";
        }
        return this.category;
    },
    getFindParams: function (a) {
        var b = a.next || 0;
        return {
            term: this.query,
            cursor: b,
            count: a.limit + 1,
            include_robotfruit_fields: true
        };
    },
    getGetUrl: function (b) {
        var a = b.id || b.postId;
        return "user/show" + (a ? "/" + a : "");
    },
    getGetParams: function (a) {
        return {
            include_robotfruit_fields: true
        };
    },
    getListFromRawData: function (a) {
        if (this.query) {
            return a;
        }
        return a.users;
    },
    getCache: function () {
        return UsersListProvider.usersCache;
    },
    getCacheKey: function () {
        return this.category;
    }
});
UsersListProvider.usersCache = new robotfruit.providers.cache.MemoryCache({
    uniqueId: "API_SHOUTS_PROVIDER_CACHE",
    cacheExpireTimeout: 60 * 60 * 1000
});


robotfruit.providers.newsProviderFactory = {
    createFromDataSource: function (a) {
        return new RobotfruitApiNewsProvider({
            apiUrl: a.endpointUrl,
            authServer: getAuthServerForDataSource(a)
        });
    }
};
$(document).bind("shoutSent", function (a, c, b) {
    if (c.type == "checkin") {
        RobotfruitApiNewsProvider.newsCache.remove(/.*places.*/);
    }
});
toKey = function (e) {
    if (typeof (e) != "object") {
        return e;
    }
    if ($.isArray(e)) {
        var a = "";
        for (var b = 0; b < e.length; b++) {
            a += toKey(e[b]);
            a += ",";
        }
        return a;
    }
    var d = Object.keys(e).sort(),
        a = "";
    if (d.length === 0) {
        return "";
    }
    for (var b = 0; b < d.length; b++) {
        var c = d[b],
            f = e[c];
        a += c + "=";
        if (typeof (f) == "object") {
            a += hashFromObject(f);
        } else {
            a += f;
        }
        a += "|";
    }
    return a;
};
RobotfruitApiNewsProvider = Class.extend({
    init: function (a) {
        this.statusObject = $("<div></div>");
        this.categoryId = a.categoryId;
        this.apiUrl = a.apiUrl;
        this.hostUrl = getHostAddress(a.apiUrl);
        this.methodPrefix = a.methodPrefix || "posts";
        this.idName = a.idName || "post_id";
        this.idParam = a.idParam || "post_id";
        this.searchParam = a.searchParam || "query";
        this.query = "";
        this.api = new robotfruit.services.ServiceClient({
            url: a.apiUrl,
            appendTypeToUrl: false,
            methodParameterName: "method",
            authServer: a.authServer,
            status: this.statusObject
        });
        this.dsParams = a.dsParams || {};
        $.extend(this.api.defaultParams, a.dsParams || {});
    },
    doFindNews: function (d) {
        var b;
        var c;
        var a = RobotfruitApp.getGeoPosition();
        if (a.coords.latitude && a.coords.longitude) {
            b = a.coords.latitude;
            c = a.coords.longitude;
        }
        b = d.latitude || b;
        c = d.longitude || c;
        var g = this;
        var e = this.query;
        d = $.extend({
            categoryId: this.categoryId
        }, d);
        var f = {
            session_id: d.sessionId,
            category_id: d.categoryId,
            limit: d.limit,
            offset: d.offset,
            latitude: b,
            longitude: c,
            radius: config.radius
        };
        f[this.searchParam] = this.query;
        this.api.GET(this.methodPrefix + "/find", f, function (k) {
            var j = [];
            for (var h = 0; h < k.data.length; h++) {
                j.push(parseFeedItem(k.data[h]));
            }
            k.data = j;
            k.query = e;
            (d.success || $.noop)(k);
            g.statusObject.trigger("findSuccess", [k, d]);
        }, function (j, h) {
            (d.error || $.noop)(j, h);
            g.statusObject.trigger("findError", [j, h]);
        }, null, null, {
            inBackground: d.inBackground
        });
    },
    findNext: function (c) {
        c = $.extend({
            categoryId: this.categoryId
        }, c);
        var b = toKey([this.apiUrl, this.methodPrefix, c.categoryId, this.dsParams]);
        var a = RobotfruitApiNewsProvider.newsCache.get(b);
        var d = this.query;
        var e = this;
        this.api.GET(toAbsoluteUrl(c.next, this.hostUrl), {}, function (h) {
            if (e.query != d) {
                return;
            }
            if (!h || !h.data) {
                (c.error || $.noop)();
                return;
            }
            var g = [];
            for (var f = 0; f < h.data.length; f++) {
                g.push(parseFeedItem(h.data[f]));
            }
            h.data = g;
            if (a) {
                a.paging.next = h.paging.next;
                a.data = arrayMergeAppend(a.data, h.data, e.idName);
            }(c.success || $.noop)(h);
            e.statusObject.trigger("findNextSuccess", [h, c]);
        }, function (g, f) {
            (c.error || $.noop)(g, f);
            e.statusObject.trigger("findNextError", [g, f]);
        }, null, {}, {
            inBackground: c.inBackground,
            absoluteUrl: true
        });
    },
    find: function (c) {
        c = $.extend({
            categoryId: this.categoryId
        }, c);
        var b = toKey([this.apiUrl, this.methodPrefix, c.categoryId, this.dsParams]);
        if (c.fromCache) {
            var a = RobotfruitApiNewsProvider.newsCache.get(b);
            if (a && a.query != this.query) {
                return false;
            }
            return a;
        }
        var d = this;
        robotfruit.providers.cache.executeAndCache(RobotfruitApiNewsProvider.newsCache, b, function (e) {
            d.doFindNews(e);
        }, c);
    },
    setQuery: function (a) {
        if (this.query != a) {
            this.query = a;
            return true;
        }
        return false;
    },
    doGetNews: function (a) {
        var b = {
            session_id: a.sessionId,
        };
        b[this.idParam + ""] = a.postId || a.id;
        b.category_id = a.categoryId;
        this.api.GET(this.methodPrefix + "/get", b, function (c) {
            (a.success || $.noop)(parseFeedItem(c));
        }, a.error, false, null, {
            inBackground: a.inBackground
        });
    },
    get: function (c) {
        c = $.extend({
            categoryId: this.categoryId
        }, c);
        var b = toKey([this.apiUrl, this.methodPrefix, c.categoryId, this.dsParams]);
        if (c.fromCache) {
            var a = RobotfruitApiNewsProvider.newsCache.get(b);
            if (a && a.data) {
                return getFromObjectList(a.data, this.idName, c.postId);
            }
            return false;
        }
        this.doGetNews(c);
    }
});
(function () {
    RobotfruitApiNewsProvider.newsCache = new robotfruit.providers.cache.MemoryCache({
        uniqueId: "API_NEWS_PROVIDER_CACHE",
        cacheExpireTimeout: 24 * 60 * 60 * 1000
    });
    $(document).bind("userLogIn", function () {
        RobotfruitApiNewsProvider.newsCache.clear();
    });
    $(document).bind("userLogOut", function () {
        RobotfruitApiNewsProvider.newsCache.clear();
    });
})();

function parseFeedItem(a) {
    a.id = a.post_id || a.id;
    a.thumbnail = a.image_url;
    a.attachments = a.attachments || {};
    if (!a.summary) {
        a.summary = textifyHtml(a.description || a.body || "");
    }
    if (a.summary.length > 160) {
        a.summary = a.summary.substring(0, 160) + "...";
    }
    return a;
}

robotfruit.providers.couponsProviderFactory = {
    createFromDataSource: function (a) {
        return new RobotfruitApiCouponsProvider({
            datasource: a,
            apiUrl: a.endpointUrl,
            authServer: getAuthServerForDataSource(a)
        });
    }
};
RobotfruitApiCouponsProvider = function (a) {
    this.statusObject = $("<div></div>");
    this.apiUrl = a.apiUrl;
    this.hostUrl = getHostAddress(a.apiUrl);
    
    
    if(a.datasource.parameters.category_id == 19)
    {
        a.methodPrefix = 'rewards';
    }
    
    this.methodPrefix = a.methodPrefix || "coupons";
    this.idParam = a.idName || "post_id";
    this.query = "";
    this.api = new robotfruit.services.ServiceClient({
        url: a.apiUrl,
        appendTypeToUrl: false,
        methodParameterName: "method",
        authServer: 'RobotfruitNetwork',
        status: this.statusObject
    });
};
RobotfruitApiCouponsProvider.prototype.request = function (b, c) {
    var d = $.extend({
        success: $.noop,
        error: undefined,
        postId: undefined
    }, c);
    var a = {};
    a[this.idParam] = d.postId;
    this.api.GET(this.methodPrefix + "/" + b, a, d.success, d.error, false, null, {
        inBackground: c.inBackground
    });
};
RobotfruitApiCouponsProvider.prototype.get = function (a) {
    this.request("get", a);
};
RobotfruitApiCouponsProvider.prototype.save = function (a) {
    this.request("save", a);
};
RobotfruitApiCouponsProvider.prototype.redeem = function (a) {
    this.request("redeem", a);
};