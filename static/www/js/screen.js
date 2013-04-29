seScreen.tabstrip_categories = function (e) {
    var f = RobotfruitApp.getPageByRef({
        "$ref": e.params.pageId
    }),
        d = [],
        b = 0,
        h = f.tabs.length;
    this.title = f.title;
    for (b = 0; b < h; b++) {
        var g = f.tabs[b],
            c = Binding.createObject({
                bindDesc: g,
                bindEnv: {}
            });
        d.push(c);
    }
    var a = {
        id: f.id + "_tabs_page",
        type: "ListPage",
        hideRefresh: true,
        dataSource: {
            id: f.id + "_tabs",
            type: "InlineDataSource",
            data: d
        },
        items: [{
            type: "CategoryItem",
            bindings: {
                title: {
                    path: "title"
                },
                tabId: {
                    path: "id"
                }
            },
            action: {
                type: "DelegateAction",
                delegate: function (j) {
                    executeAction({
                        type: "OpenPageAction",
                        page: {
                            "$ref": f.id
                        },
                        parameters: {
                            activeTab: j.activeTab,
                            hideCategories: true,
                            showBack: true
                        }
                    });
                },
                parameters: {
                    activeTab: {
                        path: "id"
                    }
                }
            }
        }]
    };
    this.page = createPage(a, e);
};
seScreen.tabstrip_categories.prototype = new ScreenBase();
seScreen.tabstrip_categories.constructor = ScreenBase;
seScreen.tabstrip_categories.prototype.parent = ScreenBase.prototype;
seScreen.tabstrip_categories.prototype.onOrientationChange = function () {};
seScreen.tabstrip_categories.prototype.willAppear = function (c) {
    var a = [{
        label: M.locHome,
        url: "javascript:goToHomeScreen();",
        icon: "img/android/home.png"
    }];
    device.call("ui/setOptionsMenu", {
        items: a
    });
    this.setTitle(M.locCategories);
    var b = new NavigationBarButton({
        icon: I.backIcon,
        onClick: function () {
            navigateBack(1);
        }
    });
    b.attachTo(se.navigationBar);
    this.page.willAppear(c);
};
seScreen.tabstrip_categories.prototype.didAppear = function () {

};
seScreen.tabstrip_categories.prototype.load = function (a, b) {
    a.html($(renderEjs("generic_screen", {})));
    this.page.load(a.find("#generic_content"), b);
};
seScreen.tabstrip_categories.prototype.unload = function () {
    setAndroidOptionsMenu();
};
seScreen.createGenericScreen = function (a) {
    var d = RobotfruitApp.getPageByRef({
        "$ref": a.params.page
    });
    var e = createPage(d, a);
    var c = e.load;
    var b = e.authentication;
    e.load = function (f, g) {
        var h = this;
        if (RobotfruitApp.isGeoRequired()) {
            requireGeoPosition(function () {
                c.call(h, f, g);
            });
        } else {
            c.call(h, f, g);
        }
    };
    return e;
};
NetworkLoginScreen = ScreenBase.extend({
    baseCls: "se-network-login",
    init: function (a) {
        this._super(a);
        this.authServer = a.params.authServer || "RobotfruitNetwork";
        this.onAuthenticate = a.params.onAuthenticate || function () {
            navigateBack(1);
        };
    },
    willAppear: function (a) {
        this.setTitle(M.locLogin);
        this._super(a);
    },
    load: function (k, o) {
        if (user.authenticated(this.authServer)) {
            this.onAuthenticate();
            return;
        }
        var p = o.params,
            n = RobotfruitApp.getModule(RobotfruitApp.MODULES.NING),
            b = RobotfruitApp.getModule(RobotfruitApp.MODULES.COMMUNITY),
            f = b.robotfruitConnectEnabled || b.ningConnectEnabled,
            c = b.facebookConnectEnabled,
            h = b.twitterConnectEnabled,
            d = b.ningConnectEnabled && n && !device.isPlatform("web"),
            g = b.robotfruitConnectEnabled && this.authServer == "RobotfruitNetwork",
            e = !g && n,
            l, a = this.authServer;
        if (a == "RobotfruitNetwork") {
            l = getMessage("locLoginShare", RobotfruitApp.getName());
        } else {
            h = false;
            c = false;
            d = false;
            l = getMessage("locLoginShare", a.split("?")[0]);
        }
        this.addChild(new SELabel({
            cls: "se-section-label",
            text: l
        }));
        if (RobotfruitApp.getNid() === network.knownNetworks.lalit) {
            this.addChild(new SELabel({
                cls: "se-title se-text-center",
                text: "Connect your networks to earn points, badges and rewards when you check-in."
            }));
        }
        this.addChild(new SESeparator());
        if (d) {
            var s = n.authProviders.split(",");
            for (var j = 0; j < s.length; j++) {
                var q = s[j].replace("!", "");
                if (!q) {
                    continue;
                }
                if (j) {
                    this.addChild(new SESeparator());
                }
                this.addChild(new SEButton({
                    title: q,
                    onClick: (function (t) {
                        return function () {
                            navigateToJanRainConnect(n.authAppId, t);
                        };
                    })(q)
                }));
            }
        }
        if (c) {
            this.addChild(new SEButton({
                cls: "fb-btn",
                icon: imageUrl(I.signInFacebookIcon),
                title: "Facebook",
                onClick: function () {
                    navigateToFacebookConnect(true);
                }
            }));
            this.addChild(new SESeparator());
        }
        if (h) {
            this.addChild(new SEButton({
                title: "Twitter",
                cls: "twitter-btn",
                icon: imageUrl(I.signInTwitterIcon),
                onClick: function () {
                    navigateToTwitterConnect(true);
                }
            }));
            this.addChild(new SESeparator());
        }
        if (f) {
            this.addChild(new SESeparator());
            this.email = new SETextField({
                placeholder: M.locNicknameOrEmail
            });
            this.password = new SETextField({
                type: "password",
                placeholder: M.locPassword
            });
            this.addChild(this.email);
            this.addChild(this.password);
            this.addChild(new SEButton({
                title: M.locLogin,
                onClick: functor(this, "onLogin")
            }));
            this.addChild(new SESeparator());
            this.addChild(new SEButton({
                title: "Forgot Passsword?",
                onClick: functor(this, "forgotPassword")
            }));
        }
        if (g || e) {
            this.addChild(new SELabel({
                text: M.locRegisterMessage,
                cls: "se-title se-text-center"
            }));
            this.addChild(new SEButton({
                title: M.locSignUp,
                onClick: function () {
                    if (n) {
                        openExternalUrl("http://" + n.networkSubdomain + ".ning.com/main/authorization/signUp");
                    } else {
                        navigateTo(getScreenUrl("account_new", {}));
                    }
                }
            }));
        }
        this.anchorContent(k);
    },
    onLogin: function () {
        user.authenticate({
            authServer: this.authServer,
            username: this.email.getVal(),
            password: this.password.getVal(),
            success: this.onAuthenticate,
            error: standardErrorHandler
        });
    },
    forgotPassword: function() {
        var name=prompt("Please enter your email address");
        if (name!=null && name!="")
            network.retrievePassword(name, function (d) {
                alert(d.responseText)
            
        });
    }
});
seScreen.network_login = NetworkLoginScreen;
SEAccountNewScreen = ScreenBase.extend({
    baseCls: "se-account-new",
    init: function (a) {
        this._super(a);
    },
    willAppear: function (a) {
        this._super(a);
        this.setTitle(getMessage("locJoinNetwork", RobotfruitApp.getName()));
    },
    load: function (a) {
        this.email = new SETextField({
            placeholder: M.locLoginEmail
        });
        this.firstname = new SETextField({
            placeholder: M.locUserFirstNameTextFieldPlaceholder
        });
        this.lastname = new SETextField({
            placeholder: M.locUserLastNameTextFieldPlaceholder
        });
        this.password = new SETextField({
            type: "password",
            placeholder: M.locPassword
        });
        this.passwordRepeat = new SETextField({
            type: "password",
            placeholder: M.locRepeatPassword
        });
        this.phone = new SETextField({
            placeholder: "Phone"
        })

        this.addSeparator();
        this.addChild(this.email);
        this.addChild(this.firstname);
        this.addChild(this.lastname);
        this.addChild(this.password);
        this.addChild(this.passwordRepeat);
        this.addChild(this.phone);

        this.addChild(new SEButton({
            title: M.locSendMessageButtonTitle,
            onClick: functor(this, "onSubmit")
        }));
        this.anchorContent(a);
    },
    validateForm: function () {
        var b = this.firstname.getVal(),
            c = this.lastname.getVal(),
            a = this.email.getVal();
        password = this.password.getVal(), password2 = this.passwordRepeat.getVal();
        if (a == "") {
            ui.error(getMessage("locForgottenItems", "E-mail"));
            return false;
        }
        if (b == "") {
            ui.error(getMessage("locForgottenItems", getMessage("locUserFirstNameTextFieldPlaceholder")));
            return false;
        }
        if (c == "") {
            ui.error(getMessage("locForgottenItems", getMessage("locUserLastNameTextFieldPlaceholder")));
            return false;
        }
        if (password == "") {
            ui.error(getMessage("locForgottenItems", getMessage("locPassword")));
            return false;
        }
        if (password2 == "") {
            ui.error(getMessage("locForgottenItems", getMessage("locRepeatPassword")));
            return false;
        }
        if (password != password2) {
            ui.error(getMessage("passwordsDontMatch"));
            return false;
        }
        return true;
    },
    onSubmit: function () {
        if (!this.validateForm()) {
            return;
        }
        termsOfServiceAccepted = functor(this, "onTermsAccepted");
        showTermsOfServiceDialog();
    },
    onTermsAccepted: function (a) {
        var c = this.firstname.getVal() + " " + this.lastname.getVal(),
            b = this.email.getVal(),
            p = this.phone.getVal();
        password = this.password.getVal();
        if (!a) {
            return;
        }
        var s = null;
        if(serverConfig.shareCode)
            s = serverConfig.shareCode;
            

        network.signUp(b, c, p, s, password, function (d) {
            user.authenticate({
                authServer: "RobotfruitNetwork",
                username: b,
                phone: p,
                password: password,
                share_code: s,
                success: function () {
                    navigateBack(1);
                },
                error: standardErrorHandler
            });
        }, standardErrorHandler);
    }
});
seScreen.account_new = SEAccountNewScreen;
seScreen.test2 = SEAccountNewScreen;
if (!window.seDevice) {
    seDevice = {
        getDeviceId: function () {
            return "mock_device_id2";
        }
    };
}

SEPlaceCategoriesScreen = ScreenBase.extend({
    init: function (a) {
        var b = a.params;
        this.categoryId = b.categoryId;
        this.categoryPath = b.categoryPath ? b.categoryPath.split(",") : [];
        this._super(a);
        this.itemFactory = createPageItemFactory({});
        this.title = b.categoryName || M.locCategories;
    },
    load: function (a, b) {
        this.postponeAnchorContent(a, b);
        this.addChild(new SEList({
            listProvider: new SEPlacesProvider({
                categoryPath: this.categoryPath
            }),
            itemFactory: {
                createItemElement: functor(this, "createItem")
            }
        }));
        this.anchorContent();
    },
    createItem: function (a) {
        var b = {
            type: "CategoryItem",
            bindings: {
                title: {
                    path: "name"
                },
                showSeparator: true,
                showIcon: true,
                icon: {
                    path: "icon_url"
                }
            },
            action: {
                type: "DelegateAction",
                delegate: functor(this, "onItemClicked"),
                parameters: {
                    id: {
                        path: "id"
                    },
                    name: {
                        path: "name"
                    },
                    children: {
                        path: "categories"
                    }
                }
            }
        };
        if (a.categories.length > 0 && a.id + "" !== this.categoryId) {
            b.bindings.showDisclosure = true;
        }
        return this.itemFactory.createItemElement(a, b);
    },
    onItemClicked: function (d) {
        var b = d.id,
            a = d.children,
            c = d.name;
        if (b + "" == this.categoryId || !a.length) {
            $(document).trigger("placeCategorySelected", [d]);
            se.backToMark({
                mark: "placesCategorySuccess"
            });
        } else {
            navigateTo(getNewPlaceCategoriesUrl(b, c, this.categoryPath));
        }
    }
});
seScreen.places_categories = SEPlaceCategoriesScreen;

var fileAttachmentImageData;
SEShoutsNewScreen = ScreenBase.extend({
    init: function (b) {
        this._super(b);
        var a = $.extend({
            authServer: "RobotfruitNetwork",
            type: undefined,
        }, b.params);
        this.authServer = a.authServer || "RobotfruitNetwork";
        this.type = a.type;
        this.params = a;
        this.isCommentLengthLimited = this.authServer === "RobotfruitNetwork";
        this.picturesEnabled = false; //this.type != "comment" && this.type != "news_comment" && !device.isPlatform("web");
        this.persistantData = se.getPersistantData();
        this.providerType = this.params.providerType || (this.authServer == "RobotfruitNetwork" ? "RobotfruitNetwork" : "RobotfruitApi");
        $(document).unbind(".shoutsNewScreen");
        $(document).bind("associateFacebookWithCurrentUser.shoutsNewScreen", functor(this, "onAssociateCredentials", ["facebook"]));
        $(document).bind("associateTwitterWithCurrentUser.shoutsNewScreen", functor(this, "onAssociateCredentials", ["twitter"]));
    },
    unload: function () {
        $(document).unbind(".shoutsNewScreen");
    },
    onAssociateCredentials: function (a) {
        switch (a) {
        case "facebook":
            this.persistantData.facebookCheckbox = undefined;
            break;
        case "twitter":
            this.persistantData.twitterCheckbox = undefined;
            break;
        }
    },
    authentication: function (a) {
        this.hasAnonymousCommentFields = a.params.anonymous && !user.authenticated(this.authServer);
        if (this.hasAnonymousCommentFields) {
            return false;
        }
        if (!user.authenticated(this.authServer)) {
            return new seScreen.network_login({
                params: {
                    authServer: this.authServer,
                    onAuthenticate: reloadScreen
                }
            });
        }
    },
    willAppear: function (a) {
        var b = a.params;
        var c = "";
        switch (b.type) {
        case "checkin":
            c = M.Checkin;
            break;
        case "reshout":
            c = M.locActionSheetReShoutButton;
            break;
        case "comment":
            c = M.locComment;
            break;
        case "news_comment":
            c = M.locComment;
            break;
        default:
            c = M.locComment;
        }
        this.setTitle(c);
        this._super(a);
    },
    load: function (a, b) {
        this.postponeAnchorContent(a, b);
        if (this.type == "news_comment") {
            this.showSharingOptions = false;
            this.renderNewShouts();
        } else {
            if (this.params.placeId) {
                this.loadPlace();
            } else {
                this.loadSharingInfo();
            }
        }
    },
    loadSharingInfo: function () {
        network.getSharingInfo(user.getUserId("RobotfruitNetwork"), functor(this, "onSharingInfoLoaded"), functor(this, "renderNewShouts"));
    },
    onPlaceLoaded: function (a) {
        this.place = a;
        this.loadSharingInfo();
    },
    loadPlace: function () {
        var a = this.params.placeId;
        provider = this.getPlacesProvider(), params = {
            postId: a,
            success: functor(this, "onPlaceLoaded"),
            error: functor(this, "loadSharingInfo")
        }, cached = false;
        params.fromCache = true;
        cached = provider.get(params);
        if (cached) {
            this.onPlaceLoaded(cached);
        } else {
            params.fromCache = false;
            provider.get(params);
        }
    },
    onSharingInfoLoaded: function (a) {
        this.sharingInfo = a;
        this.showSharingOptions = this.providerType == "RobotfruitNetwork" && this.sharingInfo && (this.sharingInfo.facebook !== undefined || this.sharingInfo.twitter !== undefined);
        if (this.persistantData.facebookCheckbox === undefined) {
            this.persistantData.facebookCheckbox = a.facebook_connected && a.facebook;
        }
        if (this.persistantData.twitterCheckbox === undefined) {
            this.persistantData.twitterCheckbox = a.twitter_connected && a.twitter;
        }
        this.renderNewShouts();
    },
    renderNewShouts: function () {
        var b = M.locNewShoutText,
            d = this.showSharingOptions,
            c = this.place,
            a = this.persistantData.anonymousData || {}, e = this;
        if (this.type == "news_comment") {
            b = M.locTellUs;
        }
        this.addChild(new SELabel({
            cls: "se-section-label",
            text: b
        }));
        if (this.hasAnonymousCommentFields) {
            this.name = new SETextField({
                placeholder: M.locPlaceName,
                val: a.author
            });
            this.email = new SETextField({
                placeholder: M.locLoginEmail,
                val: a.authorEmail
            });
            this.url = new SETextField({
                placeholder: M.locLoginAuthorUrl,
                val: a.authorUrl
            });
            this.addSeparator();
            this.addChild(this.name);
            this.addSeparator();
            this.addChild(this.email);
            this.addSeparator();
            this.addChild(this.url);
            this.addSeparator();
            this.addChild(new SEButton({
                title: M.locOrLogin,
                onClick: function () {
                    navigateTo("network_login", $.extend({
                        autoOpened: true
                    }, e.params));
                }
            }));
        }
        this.addSeparator();
        this.text = new SETextArea({
            placeholder: M.locComment
        });
        this.addChild(this.text);
        if (c) {
            this.addChild(new SEDisclosure({
                icon: "bundle://ButtonMapIcon.png",
                title: c.name,
                onClick: function () {
                    navigateBack(1);
                }
            }));
            this.addSeparator();
        }
        if (this.picturesEnabled) {
            onPhotoTaken = functor(this, "onPhotoTaken");
            this.jPhotoPreviewContainer = $(renderEjs("photo_preview", {}));
            this.jPhotoPreview = this.jPhotoPreviewContainer.find("#photoPreview");
            this.jContent.append(this.jPhotoPreviewContainer);
            this.addChild(new SEDisclosure({
                title: M.locConfirmTakePhotoTitle,
                onClick: functor(this, "onPhotoDialog", ["takePhoto"])
            }));
            this.addSeparator({
                style: "separatorCellGroup"
            });
            this.addChild(new SEDisclosure({
                title: M.locConfirmChooseTitle,
                onClick: functor(this, "onPhotoDialog", ["choosePhoto"])
            }));
        }
        this.addChild(new SENavButton({
            title: M.locSubmit,
            onClick: functor(this, "onSubmit")
        }));
        if (d) {
            this.addSeparator();
            this.addChild(new SELabel({
                cls: "se-section-label",
                text: M.locShare
            }));
            this.addSeparator();
            this.connectFacebook = new SEDisclosureCheckBox({
                iconName: I.buttonFacebook,
                title: "Facebook",
                onChange: functor(this, "onFacebookChange"),
                checked: this.persistantData.facebookCheckbox
            });
            this.addChild(this.connectFacebook);
            this.addSeparator({
                style: "separatorCellGroup"
            });
            this.connectTwitter = new SEDisclosureCheckBox({
                icon: I.buttonTwitter,
                title: "Twitter",
                onChange: functor(this, "onTwitterChange"),
                checked: this.persistantData.twitterCheckbox
            });
            this.addChild(this.connectTwitter);
        }
        this.anchorContent();
    },
    onPhotoDialog: function (a) {
        this.fileAttachmentImageData = undefined;
        this.jPhotoPreviewContainer.hide();
        switch (a) {
        case "takePhoto":
            device.call("media/showCamera", {
                complete: "onPhotoTaken"
            });
            break;
        case "choosePhoto":
            device.call("media/showGallery", {
                complete: "onPhotoTaken",
                title: M.locConfirmChooseTitle
            });
            break;
        }
    },
    onPhotoTaken: function (c, a, b) {
        if (c) {
            this.imageUrl = b + "?" + new Date().getTime();
            this.fileAttachmentImageData = a;
            this.jPhotoPreview.attr("src", this.imageUrl);
            this.jPhotoPreviewContainer.show();
        }
    },
    onFacebookChange: function (a) {
        var b = a.getChecked();
        if (b && !this.sharingInfo.facebook_connected) {
            a.setChecked(false);
            this.persistantData.facebookCheckbox = this.persistantData.twitterCheckbox = false;
            navigateToFacebookConnect();
            return;
        }
        this.persistantData.facebookCheckbox = b;
    },
    onTwitterChange: function (a) {
        var b = a.getChecked();
        if (b && !this.sharingInfo.twitter_connected) {
            a.setChecked(false);
            this.persistantData.facebookCheckbox = this.persistantData.twitterCheckbox = false;
            navigateToTwitterConnect();
            return;
        }
        this.persistantData.twitterCheckbox = b;
    },
    validateFields: function () {
        var c = this.text.getVal().length;
        if (this.hasAnonymousCommentFields) {
            var a = this.name.getVal(),
                b = this.email.getVal();
            if (!a) {
                ui.error(getMessage("locForgottenItems", M.locPlaceName));
                return false;
            }
            if (!b) {
                ui.error(getMessage("locForgottenItems", M.locLoginEmail));
                return false;
            }
        }
        if (this.isCommentLengthLimited && c > RobotfruitApp.getCommentLength()) {
            ui.error(M.locExceededNumberOfChars);
            return false;
        }
        if (!this.place && !this.fileAttachmentImageData && c == 0) {
            if (this.hasAnonymousCommentFields) {
                ui.error(getMessage("locForgottenItems", M.locComment));
            } else {
                ui.error(getMessage("locForgottenItems", M.locShoutDetailTitle));
            }
            return false;
        }
        return true;
    },
    onSubmit: function () {
        if (!this.validateFields()) {
            return;
        }
        var k = undefined,
            p = this.text.getVal() || " ",
            e = undefined,
            f = undefined,
            j = undefined,
            n = undefined,
            o = undefined,
            g = {}, d = this.authServer,
            h = this.place;
        if (this.showSharingOptions) {
            n = this.connectFacebook.getChecked();
            o = this.connectTwitter.getChecked();
        }
        if (h) {
            e = this.place.geo.coordinates[0], f = this.place.geo.coordinates[1], j = h.id || h.place_id;
        }

        k = new ShoutsListProvider();
        g = {
            text: p,
            inReplyTo: this.params.inReplyToShoutId,
            latitude: e,
            longitude: f,
            placeId: j,
            shareFacebook: n,
            shareTwitter: o,
            fileAttachment: this.fileAttachmentImageData,
            success: functor(this, "onShoutCreated")
        };

        k.create(g);
    },
    onShoutCreated: function (a) {
        $(document).trigger("shoutSent", [this.params, a]);
        if (a && a.approved === false) {
            ui.message(M.locCommentSubmitted, "");
        }
        this.fileAttachmentImageData = undefined;
        if (this.type == "checkin") {
            if (this.params.subType == "eventShout") {
                navigateBackToMark(1, {
                    reload: true
                });
            } else {
                se.showToast(M.locConfirmedCheckIn);
                se.backToMark({
                    mark: "checkInSuccess",
                    reload: true
                });
            }
        } else {
            if (this.type == "shout") {
                se.showToast(M.locPendingApproval);
            }
            navigateBack(1, {
                reload: true
            });
        }
    },
    getPlacesProvider: function () {
        var a = se.history[se.history.length - 2];
        if (a && a.screenObj && a.screenObj.newsProvider) {
            return a.screenObj.newsProvider;
        } else {
            return {
                get: function (b) {
                    if (b.fromCache) {
                        return false;
                    }
                    network.getPlace(b.postId, b.success, b.error);
                }
            };
        }
    }
});
seScreen.shouts_new = SEShoutsNewScreen;

UsersDetailsScreen = ScreenBase.extend({
    baseCls: "se-user-details",
    init: function (b) {
        this._super(b);
        this.authServer = "RobotfruitNetwork";
        var c = b.params;
        if (c.datasourceId) {
            var a = RobotfruitApp.getDatasourceByRef({
                $ref: c.datasourceId
            });
            this.provider = DataSourceListFeedProvider.instance(a, c);
        }
        if (!this.provider) {
            this.provider = new UsersListProvider({
                user_id: c.userId
            });
        }
        this.showNavigationBar = true;
        this.showAndroidOptionsMenu = true;
    },
    willAppear: function (a) {
        var d = this.userId = user.getUserId(this.authServer);
        var b = a.params;
        var c;
        this.isCurrentUser = (d == b.userId) || (!b.userId && d);
        if (this.isCurrentUser) {
            c = M.Profile || M.locUserProfileTitle;
        } else {
            c = M.locUserProfileTitle;
        }
        this.setTitle(c);
        this._super(a);
    },
    authentication: function (a) {
        var c = user.getUserId(this.authServer);
        var b = a.params;
        isCurrentUser = (c == b.userId) || (!b.userId && c);
        if ((!b.userId || isCurrentUser) && !user.authenticated(this.authServer)) {
            return new seScreen.network_login({
                params: {
                    authServer: this.authServer,
                    onAuthenticate: reloadScreen
                }
            });
        }
    },
    willDisappear: function (b, a) {

    },
    didAppear: function (b, a) {

    },
    load: function (a, b) {
        this._super(a, b);
        this.postponeAnchorContent(a, content);
        var c = b.params;
        var e = this;
        var d;
        d = {
            postId: c.userId || this.userId,
            success: function (g) {
                e.loadUser(a, g, b);
            }
        };
        d.fromCache = true;
        var f = this.provider.get(d);
        if (f) {
            this.loadUser(a, f, b);
        } else {
            d.fromCache = false;
            this.provider.get(d);
        }
    },
    loadUser: function (f, j, h) {
        var d = RobotfruitApp.getModule(RobotfruitApp.MODULES.COMMUNITY) || {};
        this.userInfo = j;
        this.addChild(new SEPageHeaderPanel({
            cls: "se-img-size-avatar",
            title: j.name,
            subtitle: j.location,
            iconUrl: j.profile_image_url || I.avatarDefault,
            infoBarType: "OneSegmentWideEmpty",
            info1Text: M.locMemberSince + ": " + TimeDistanceConverter({
                startTime: j.created_at,
                prettify: true
            }),
            info1Icon: I.infoClockHead
        }));
        if (this.isCurrentUser && d.profileEditingEnabled) {
            this.addChild(new SENavButton({
                title: M.locEdit,
                onClick: functor(this, "onEdit")
            }));
        }
        if (j.description) {
            var a = new SEHtml({
                html: j.description
            });
            this.addChild(a);
        } else {
            this.addChild(new SESeparator());
        }
        var p = new SEDisclosure({
            title: "My Points: " +  j.points,
            iconName: I.buttonActivity
        });
        this.addChild(p);
        this.addChild(new SESeparator());
        var b = new SEDisclosure({
            title: M.locActivity,
            iconName: I.buttonActivity,
            onClick: functor(this, "onOpenActivity")
        });
        this.addChild(b);

        this.addChild(new SESeparator());
        if (d.subscriptionsEnabled) {
            var e = new SEDisclosure({
                title: M.locFriendsLabelTitle,
                iconName: I.buttonFriends,
                onClick: functor(this, "onOpenFriends")
            });
            this.addChild(e);
        }
        this.addChild(new SESeparator());
        if (j.url) {
            this.addChild(new SEDisclosure({
                title: M.locVisitWeb,
                iconName: I.buttonWebsite,
                onClick: functor(this, "onOpenWebsite")
            }));
            this.addChild(new SESeparator());
        }
        if (!this.isCurrentUser) {
            var c = new SEButtonPanel();


            this.addChild(c);
        }
       
        if (this.isCurrentUser && device.platform != 'native') {
            this.addSeparator();
            this.addChild(new SEButton({
                title: M.locLogoutButtonTitle,
                onClick: function () {
                    logout();
                }
            }));
        }
        this.anchorContent();

    },
    onEdit: function () {
        navigateTo(getEditProfileUrl());
    },
    onOpenActivity: function () {
        navigateTo(getShoutsUrl({
            user_id: this.userInfo.id
        }));
    },
    onDirectMessage: function () {
        
    },
    onOpenWebsite: function () {
        openExternalUrl(this.userInfo.url);
    }
});
seScreen.users_details = UsersDetailsScreen;
ShareScreen = ScreenBase.extend({
    init: function (b) {
        this._super(b);
        var c = b.params;
        var a = $.extend({
            shareUrl: false,
            shareTitle: false
        }, {
            shareUrl: c.shareUrl,
            shareTitle: c.shareTitle
        });
        $.extend(this, a);
        this.title = M.locShare;
        this.emails = new SETextArea({
          placeholder: "Enter Emails to share with comma separated"
        });
    },
    load: function (a, b) {
        this.postponeAnchorContent(a, b);
        this.addSeparator();
        this.addChild(new SEDisclosure({
            icon: I.buttonFacebook,
            title: "Facebook",
            onClick: functor(this, "shareOnFacebook")
        }));
        this.addSeparator();
        this.addChild(new SEDisclosure({
            icon: I.buttonTwitter,
            title: "Twitter",
            onClick: functor(this, "shareOnTwitter")
        }));
        if(device.platform == 'native')
        {
            this.addSeparator();
            this.addChild(new SELabel({
                cls: "se-section-label",
                text: "from address book"
            }));
            this.addSeparator();
            this.addChild(new SEDisclosure({
                icon: I.buttonShareWithContacts,
                title: "Share via TXT Message",
                onClick: functor(this, "shareWithContacts")
            }));
            
        }
        this.addSeparator();
        this.addChild(new SELabel({
            cls: "se-section-label",
            text: "share by email"
        }));
        this.addSeparator();
        this.addChild(this.emails);
        
        this.addChild(new SEButton({
            title: "Share by Email",
            onClick: functor(this, "onEmailShare")
        }));
        
        this.anchorContent();
    },
    onEmailShare: function () {
        
        network.shareByEmail(this.emails.getVal(), this.shareUrl);
        //alert('shared');
    },
    shareOnFacebook: function () {
        var a = "http://www.facebook.com/sharer.php";
        if (this.shareUrl) {
            a = addParamToUrl({
                url: a,
                param: "u",
                val: this.shareUrl
            });
        }
        if (this.shareTitle) {
            a = addParamToUrl({
                url: a,
                param: "t",
                val: this.shareTitle
            });
        }
        openExternalUrl(a);
    },
    shareOnTwitter: function () {
        var b = "http://twitter.com/home";
        var a = "";
        if (this.shareTitle) {
            a += this.shareTitle;
        }
        if (this.shareUrl && this.shareTitle) {
            a += " ";
        }
        if (this.shareUrl) {
            a += this.shareUrl;
        }
        b = addParamToUrl({
            url: b,
            param: "status",
            val: a
        });
        openExternalUrl(b);
    },
    shareWithContacts: function () {

        if (this.shareUrl && this.shareTitle) {
            
            device.call("ui/shareWithContacts", { shareTitle: this.shareTitle,  shareUrl: this.shareUrl });
        }
       
        
    }
});
seScreen.share = ShareScreen;

function landscapeCalculations(q) {
    var s = RobotfruitApp.getPage("HomePage", "type"),
        t = s.boundingBox.size,
        d = s.scrollType == "paged",
        e = s.scrollDirection == "horizontal",
        a = s.columnCount,
        w = s.rowCount,
        c = {
            width: 640,
            height: 920
        }, b = {
            width: c.height,
            height: c.width
        }, u = 18,
        o = 36 / c.width * 100,
        l = undefined,
        g = undefined,
        p = undefined,
        j = undefined,
        k = undefined,
        h = Math,
        v = {
            width: t.width * c.width / 100,
            height: t.height * c.height / 100
        }, f = {
            width: v.width / a,
            height: v.height / w
        };
    if (d) {
        g = {
            width: t.width * c.height / 100,
            height: t.height * c.width / 100
        };
        j = h.floor(g.width / f.width);
        p = h.max(1, h.floor(g.height / f.height));
        nPageSize = {
            width: h.min(c.height, j * f.width),
            height: h.min((c.width - u), p * f.height)
        };
        l = {
            width: h.min(100, nPageSize.width / b.width * 100),
            height: h.min(100 - o, nPageSize.height / b.height * 100)
        };
        k = {
            boundingBox: {
                origin: {
                    x: (100 - l.width) / 2,
                    y: (100 - l.height - o)
                },
                size: l
            },
            rowCount: p,
            columnCount: j
        };
        var n = $.extend({}, s, k);
        return n;
    } else {
        if (e) {
            g = {
                width: t.width * c.height / 100,
                height: t.height * c.width / 100
            };
            j = h.floor(g.width / f.width);
            p = h.max(1, h.floor(g.height / f.height));
            nPageSize = {
                width: h.min(c.height, j * f.width),
                height: h.min((c.width), p * f.height)
            };
            l = {
                width: h.min(100, nPageSize.width / b.width * 100),
                height: h.min(100, nPageSize.height / b.height * 100)
            };
            k = {
                boundingBox: {
                    origin: {
                        x: (100 - l.width) / 2,
                        y: (100 - l.height)
                    },
                    size: l
                },
                rowCount: p,
                columnCount: j
            };
            var n = $.extend({}, s, k);
            return n;
        } else {
            g = {
                width: t.width * b.width / 100,
                height: b.height
            };
            j = h.max(1, h.floor(g.width / f.width));
            p = h.floor(g.height / f.height);
            nPageSize = {
                width: h.min(c.height, j * f.width),
                height: h.min((c.width), p * f.height)
            };
            l = {
                width: h.min(100, nPageSize.width / b.width * 100),
                height: 100
            };
            k = {
                boundingBox: {
                    origin: {
                        x: s.boundingBox.origin.x === 0 ? 0 : 100 - l.width,
                        y: (100 - l.height) / 2
                    },
                    size: l
                },
                rowCount: p,
                columnCount: j
            };
            var n = $.extend({}, s, k);
            return n;
        }
    }
}

threeTabs = ComponentBase.extend({
    baseCls: "threeTabs",
    init: function (b) {
        this._super(b);
        var a = $.extend({
            pages: undefined
        }, b);
        $.extend(this, a);
    },
    load: function (b)
    {
        var content = this.jContent;

        var call = $("<ul><li id='rfcall'><a class='call' href='tel:"+serverConfig.phone+"'></a></li><li id='rfemail'><a class='email' href='mailto:"+serverConfig.email+"'></a></li><li id='rfshare'><a class='share' href='#'></a></li></ul>");

        content.append(call);
        
        
        this.anchorContent(b);
        
        
        
        var jItem = call.find("#rfshare");
        jItem.touchEvents().bind("fastClick click", functor(this, "onItemClick", []));

    },
    onItemClick: function(a) {

        network.getUserInfo(user.getUserId("RobotfruitNetwork"), function (d) {
            
            var link = serverConfig.share_link+'/share/'+d.share_code+'/1/'+serverConfig.networkId;
            
            console.log("link "+link);
            
            navigateTo(getShareUrl(serverConfig.share_title, link));
            
        }, function(){
            navigateTo(getShareUrl(serverConfig.share_title, serverConfig.share_link));
        });
        
        
    }
});

RFPageSwitcher = ComponentBase.extend({
    baseCls: "pageSwitcher",
    init: function (b) {
        this._super(b);
        var a = $.extend({
            pages: undefined,
            carousel: undefined
        }, b);
        $.extend(this, a);
        this.carousel.statusObject.bind("onPageChange.pageSwitcher", functor(this, "onPageChange"));
        
    },
    onPageChange: function (b, a, d) {
        var c = this.jItems[a];
        $.each(this.jItems, function (e, f) {
            f.removeClass("selected");
        });
        c.addClass("selected");
    },
    unload: function () {
        this.carousel.statusObject.unbind(".pageSwitcher");
    },
    load: function (b, e) {
        var f = this.pages,
            a = 0,
            d = this.jContent;
        this.jItems = [];
        for (a = 0; a < f; a++) {
            var c = $("<span id='item" + a + "' class='item'>&bull;</span>").data("page", a);
            c.addClass(a === 0 ? "selected" : "unselected");
            c.click(functor(this, "onPageSwitcherItem", [a]));
            this.jItems.push(c);
            d.append(c);
        }
        if(!serverConfig.phone)
        {
            this.css({bottom: "0px"});
        }
        
        this.anchorContent(b);
    },
    onPageSwitcherItem: function (a) {
        if (!this.carousel) {
            return;
        }
        this.carousel.switchToPage(a);
    }
});
RFScrollView = ComponentBase.extend({
    baseCls: "se-scroll-area",
    init: function (b) {
        this._super(b);
        var a = $.extend({
            vScrollbar: true,
            vScroll: true,
            hScroll: false,
            hScrollbar: false,
            snap: false,
            momentum: true,
            pageScrollDuration: 200
        }, b);
        this.statusObject = $("<div></div>");
        $.extend(this, a);
        this.jScrollerContent = $('<div class="iscroll-scroller"></div>');
        this.jContent.append(this.jScrollerContent);
    },
    unload: function () {
        this.iScroll.destroy();
        this.iScroll = null;
    },
    load: function (a, b) {
        this.anchorContent(a);
        this.createIScroll();
    },
    append: function (a) {
        this.jScrollerContent.append(a);
    },
    createIScroll: function () {
        if (this.iScroll) {
            this.iScroll.destroy();
        }
        this.iScroll = new iScroll(this.jContent.get(0), {
            vScrollbar: this.vScrollbar,
            hScrollbar: this.hScrollbar,
            vScroll: this.vScroll,
            hScroll: this.hScroll,
            checkDOMChanges: false,
            momentum: this.momentum,
            bounce: true,
            snap: this.snap,
            onScrollStart: functor(this, "onScrollStart"),
            onScrollMove: functor(this, "onScrollMove"),
            onBeforeScrollEnd: functor(this, "onScrollEnd"),
            onPageChange: functor(this, "onPageChange")
        });
    },
    onScrollStart: function () {
        this.scrolled = false;
    },
    onScrollMove: function () {
        this.scrolled = true;
    },
    onScrollEnd: function () {
        var a = this.iScroll;
        if (this.scrolled) {
            window.globalStopClickPropagation();
        }
        this.statusObject.trigger("onScrollEnd", [this, this.scrolled]);
    },
    onPageChange: function (a, b) {
        this.statusObject.trigger("onPageChange", [a, b, this]);
    },
    refresh: function () {
        var a = this.iScroll;
        setTimeout(function () {
            a.refresh();
        }, 0);
    },
    wrapperForChild: function () {
        return this.jScrollerContent;
    },
    switchToPage: function (a) {
        this.iScroll.scrollToPage(a, 0, this.pageScrollDuration);
    }
});
SELayoutBuilder = Class.extend({
    init: function (a) {
        this.scroller = a.scroller;
    },
    newPage: function () {},
    addItem: function (b, a, c) {}
});
SEVerticalLayoutBuilder = SELayoutBuilder.extend({
    init: function (a) {
        this._super(a);
    },
    addItem: function (b, a, c) {
        this.scroller.append(b);
    }
});
SEHorizontalLayoutBuilder = SELayoutBuilder.extend({
    init: function (b) {
        this._super(b);
        var a = Math;
        this.scroller.jScrollerContent.css({
            width: (a.ceil(b.itemSize.boxSize.width * b.itemCount)) + "px"
        });
        this.scroller.jScrollerContent.addClass("se-single-line");
    },
    addItem: function (b, a, c) {
        b.addClass("se-horizontal");
        this.scroller.append(b);
    }
});
SEGridLayoutBuilder = SELayoutBuilder.extend({
    init: function (b) {
        this._super(b);
        var a = Math;
        this.pageWidth = b.pageWidth;
        this.scroller.jScrollerContent.css({
            width: (a.ceil(b.pages * this.pageWidth)) + "px"
        });
        this.scroller.jScrollerContent.addClass("se-single-line");
    },
    newPage: function () {
        this.jCurPage = $('<div class="se-home-grid-page"></div>');
        this.jCurPage.css({
            width: this.pageWidth + "px"
        });
        this.scroller.append(this.jCurPage);
    },
    addItem: function (b, c, a) {
        if (this.prevRow !== c) {
            this.jCurRow = $('<div class="se-home-grid-row"></div>');
            this.jCurPage.append(this.jCurRow);
        }
        b.addClass("se-horizontal");
        this.jCurRow.append(b);
        this.prevRow = c;
        this.prevCol = a;
    }
});
RFHomeScreen = ScreenBase.extend({
    baseCls: "se-home-screen",
    init: function (a) {
        this._super(a);
        this.page = device.orientation() == "landscape" ? landscapeCalculations({
            isGrid: true
        }) : RobotfruitApp.getPage("HomePage", "type");
        this.authRealm = RobotfruitApp.getIsNetworkPrivate() ? "RobotfruitNetwork" : false;
        this.paymentRealm = "RobotfruitNetwork";
        this.provider = DataSourceListFeedProvider.instance(RobotfruitApp.getDatasourceByRef(this.page.dataSource));
        this.imgLoader = new SEImgLoader();
    },
    willAppear: function () {
        se.navigationBar.hide();
    },
    onOrientationChange: function () {
        //reloadScreen();
    },
    load: function (b, c) {
        var d = this.page,
            a = d.boundingBox;
        this.css({
            height: se.getWindowHeight() + "px"
        });
        this.postponeAnchorContent(b, c);
        if(device.platform == 'native')
            d.backgroundImageUrl = "images/home_image.png";
        this.addChild(new SEBackgroundImage({
            src: d.backgroundImageUrl
        }));
        if(a.origin.y == 30 || a.origin.y == 44) //tabs/w logo layout
            this.addChild(new SEImage({ src: d.homeImageUrl,
                                    abs: true
                                    }));
        
        this.scrollView = this.addChild(new RFScrollView({
            vScroll: d.scrollDirection == "vertical",
            hScroll: d.scrollDirection == "horizontal",
            hScrollbar: false,
            vScrollbar: false,
            snap: d.scrollType == "paged",
            momentum: d.scrollType != "paged",
        }));
        
        if(serverConfig.phone)
        {
            this.threeTabs = this.addChild(new threeTabs());
            this.threeTabs.css({"bottom": 0, "position": "absolute"});
            console.log('sent to bottom');
            
        }
        
        this.scrollView.css({
            left: a.origin.x + "%",
            top: (a.origin.y * se.getWindowHeight() / 100) + "px",
            height: (a.size.height * se.getWindowHeight() / 100) + "px",
            width: (a.size.width * $(window).width() / 100) + "px",
        });
        this.provider.find({
            success: functor(this, "onShortcutsLoaded")
        });
        this.anchorContent();
        
    },
    onShortcutsLoaded: function (b) {
        var a = this.insertEmptyShortcuts(b.data);
        this.renderShortcuts(a);
    },
    insertEmptyShortcuts: function (k) {
        var d = [],
            a, h, e = 0,
            c = 0,
            f, g = k.length,
            b = {
                type: "spacer"
            };
        for (e = 0; e < g; e++) {
            a = k[e];
            h = a;
            if (h && a.index - h.index > 1) {
                c = a.index - h.index;
                for (f = 0; f < c - 1; f++) {
                    d.push(b);
                }
            }
            d.push(a);
        }
        return d;
    },
    itemImageSize: function (a) {
        var c = ScaleAspectFit({}),
            b = this.page;
        return c({
            maxWidth: a.btnSize.width,
            maxHeight: a.btnSize.height,
            width: b.shortcutImageWidth / 2,
            height: b.shortcutImageHeight / 2
        });
    },
    createLayoutBuilder: function (d, a, c) {
        var b = {
            scroller: this.scrollView,
            pages: m.ceil(a.length / (d.rowCount * d.columnCount)),
            itemSize: c.itemSize,
            itemCount: a.length,
            pageWidth: c.pageWidth
        };
        if (d.scrollDirection == "vertical" && d.columnCount == 1) {
            return new SEVerticalLayoutBuilder(b);
        } else {
            if (d.scrollDirection == "horizontal" && d.scrollType !== "paged" && d.rowCount == 1) {
                return new SEHorizontalLayoutBuilder(b);
            } else {
                return new SEGridLayoutBuilder(b);
            }
        }
    },
    renderShortcuts: function (c) {
        var a = 0,
            b = c.length,
            d = this,
            e = this.page;
        pageBox = e.boundingBox.size, cols = e.columnCount, rows = e.rowCount, row = 0, col = 0, curItem = undefined, iPhoneRetinaSize = device.orientation() == "portrait" ? {
            width: 640,
            height: 920
        } : {
            width: 920,
            height: 640
        }, winSize = {
            width: $(window).width(),
            height: se.getWindowHeight()
        }, jItem = undefined, m = Math, pages = m.ceil(b / rows / cols), jCurPage = undefined, itemSize = {
            boxSize: {
                width: pageBox.width / cols * winSize.width / 100,
                height: pageBox.height / rows * winSize.height / 100
            }
        }, layoutBuilder = undefined;
        itemSize.btnSize = {
            width: m.min(e.shortcutImageWidth / iPhoneRetinaSize.width * winSize.width, itemSize.boxSize.width),
            height: m.min(e.shortcutImageHeight / iPhoneRetinaSize.height * winSize.height, itemSize.boxSize.height)
        };
        itemSize.imgSize = this.itemImageSize(itemSize);
        layoutBuilder = this.createLayoutBuilder(e, c, {
            pageWidth: e.boundingBox.size.width * winSize.width / 100,
            itemSize: itemSize
        });
        
        if (e.scrollType == "paged" && pages > 1) {
            this.addChild(new RFPageSwitcher({
                pages: pages,
                carousel: this.scrollView
            }));
        }
        
        

        for (a = 0; a < b; a++) {
            if (col === 0 && row === 0) {
                layoutBuilder.newPage();
            }
            curItem = c[a];
            jItem = $(renderEjs("home_screen_item", {
                item: {
                    origin: {
                        x: (itemSize.btnSize.width - itemSize.imgSize.width) / 2,
                        y: (itemSize.btnSize.height - itemSize.imgSize.height) / 2
                    },
                    size: itemSize,
                    btnImage: curItem.buttonImageUrl,
                    btnImagePressed: curItem.buttonImageHighlightedUrl,
                    vcenter: true
                }
            }));
            this.imgLoader.loadImg(jItem.find("img.btn-normal"));
            this.imgLoader.loadImg(jItem.find("img.btn-pressed"));
            if (curItem.action) {
                jItem.touchEvents().bind("fastClick click", functor(this, "onItemClick", [curItem.action]));
            }
            layoutBuilder.addItem(jItem, row, col);
            col = (col + 1) % cols;
            if (col % cols === 0) {
                row = (row + 1) % rows;
            }
        }
    },
    onItemClick: function (a) {
        executeAction(a, {});
    },
    didAppear: function () {
        this.scrollView.refresh();
    }
});
seScreen.home = RFHomeScreen;


seScreen.search = function () {};
classExtend(seScreen.search, ScreenBase);
seScreen.search.prototype.willAppear = function () {
    se.navigationBar.show();
    this.setTitle(M.Search);
};
seScreen.search.prototype.load = function (a) {
    var k;
    var b;

    function l(o) {
        if (o.length == 0) {
            return;
        }
        var n = a.find("#resultsList");
        $.each(o, function (p, q) {
            n.append(renderEjs("search_item", {
                shout: q
            }));
        });
    }
    function g(n) {
        b(k + 1, n);
    }
    function h(n) {
        l(n);
        g(j);
    }
    function j(n) {
        if (n.length > 0) {
            a.find("#loadMoreButton").click(function () {
                k++;
                h(n);
            });
            a.find("#loadMoreButtonContainer").show();
        } else {
            a.find("#loadMoreButtonContainer").hide();
        }
    }
    var f;

    function d(o) {
        n = function n(q, s) {
            network.search(o, q, s);
        };
        var p = a.find("#resultsList");
        p.empty();
        k = 1;
        $.screen.search.initialQuery = o;
        a.find("#loadMoreButtonContainer").hide();
        n(k, function (q) {
            a.find(".searchIcon").removeClass("activity");
            if (q.length > 0) {
                l(q);
                g(j);
            } else {
                p.append('<div class="boxData"><p>' + M.locNoResults + "</p></div>");
            }
        });
    }
    a.append(renderEjs("search", {}));
    var e = null;
    var c = $.screen.search.initialQuery;
    ui.setupSearchField(c, d);
    a.find("#searchForm").submit(function () {
        return false;
    });
};
$.screen.search = function () {
    var g;
    var a;

    function h(k) {
        if (k.length == 0) {
            return;
        }
        var j = $("#resultsList");
        $.each(k, function (l, n) {
            j.append(renderEjs("search_item", {
                shout: n
            }));
        });
    }
    function d(j) {
        a(g + 1, j);
    }
    function e(j) {
        h(j);
        d(f);
    }
    function f(j) {
        if (j.length > 0) {
            $("#loadMoreButton").click(function () {
                g++;
                e(j);
            });
            $("#loadMoreButtonContainer").show();
        } else {
            $("#loadMoreButtonContainer").hide();
        }
    }
    var c;

    function b(k) {
        j = function j(n, o) {
            network.search(k, n, o);
        };
        var l = $("#resultsList");
        l.empty();
        g = 1;
        $.screen.search.initialQuery = k;
        $("#loadMoreButtonContainer").hide();
        j(g, function (n) {
            $(".searchIcon").removeClass("activity");
            if (n.length > 0) {
                h(n);
                d(f);
            } else {
                l.append('<div class="boxData"><p>' + M.locNoResults + "</p></div>");
            }
        });
    }
    focusScreen(function () {
        var k = null;
        var j = $.screen.search.initialQuery;
        ui.setupSearchField(j, b);
        $("#searchForm").submit(function () {
            return false;
        });
    });
};
$.screen.search.initialQuery = "";
SEEditProfileScreen = ScreenBase.extend({
    baseCls: "se-edit-profile",
    init: function (a) {
        this._super(a);
    },
    willAppear: function (a) {
        this._super(a);
        this.setTitle(M.locEditProfile);
    },
    load: function (a, b) {
        this.postponeAnchorContent(a);
        var c = this;
        network.getUserInfo(user.getUserId("RobotfruitNetwork"), function (d) {
            c.render(d);
        });
    },
    render: function (a) {
        this.name = new SETextField({
            val: a.name
        });
        this.password = new SETextField({
            type: "password",
            placeholder: M.locPassword
        });
        this.password2 = new SETextField({
            type: "password",
            placeholder: M.locRepeatPassword
        });
        this.phone = new SETextField({
            val: a.phone
        })
        this.addSeparator();
        this.addChild(this.name);
        this.addChild(this.password);
        this.addChild(this.password2);
        this.addChild(this.phone);
        this.addChild(new SENavButton({
            title: M.locSubmit,
            onClick: functor(this, "onSubmit")
        }));
        this.anchorContent();
    },
    onSubmit: function () {
        var c = this.name.getVal();
        var e = this.password.getVal();
        var f = this.password2.getVal();
        var d = this.phone.getVal();
        //var b = this.location.getVal();
        var b = null
        //var a = this.description.getVal();
        var a = null
        if (c == "") {
            ui.error(getMessage("locForgottenItems", M.locPlaceName));
            return false;
        }
        if (e != f) {
            ui.error("The passwords do not match");
            return false;
        }
        
        return network.updateProfile(c, d, b, a, e, function () {  
            network.clearCache();
            navigateBack(1); 
        }, function () {  
            ui.message("Your profile has been updated.");
        });
        
    }
});
seScreen.edit_profile = SEEditProfileScreen;