var executeRemoteAction = function (a) {
    if (!a) {
        return;
    }
    var b = new robotfruit.services.ServiceClient({
        url: config.robotfruitApi + "/%s",
        authServer: "RobotfruitNetwork"
    });
    var c = "/push/" + a;
    b.GET(c, {}, function (d) {
        executeAction(d);
    });
};
var executeAction = function (a, b, c) {
    if (!a) {
        return;
    }
    if (a.parameters && a.parameters.itemId == "post_id") {
        a.parameters.itemId = {
            path: a.parameters.itemId
        };
    }
    var j = Binding.createObject({
        bindDesc: a.parameters || {},
        bindEnv: b,
        context: c
    });
    var d = Binding.createObject({
        bindDesc: a.datasourceParameters || a.dataSourceParameters,
        bindEnv: b,
        context: c
    });
    if (d) {
        j.dsParams = d;
    }
    switch (a.type) {
    case "DelegateAction":
        var k = Binding.createObject({
            bindDesc: a.parameters || {},
            bindEnv: b,
            context: c
        });
        a.delegate(k);
        return;
    case "DeleteShoutAction":
        var g = j.itemId,
            l = new ShoutsListProvider();
        ui.confirm(M.locDelete, function () {
            l.remove({
                id: g,
                success: function () {
                    navigateBack(1, {
                        reload: true
                    });
                }
            });
        });
        return;
    case "SelectPageAction":
        switchToIconBoard(parseInt(a.parameters.index, 10));
        return;
    case "DeleteComment":
        if (a.params.deletable) {
            deleteNewsComment(a.params.commentId);
        }
        return;
    case "SelectPageAction":
        return switchToIconBoard((parseInt(a.parameters.index, 10) + 1));
    case "ShowRouteAction":
        requireGeoPosition(function () {
            openExternalUrl(getDirectionsUrl(j.endLatitude, j.endLongitude));
        });
        return;
    case "RSVPAction":
        network.rsvp(j.eventId);
        return;
    case "AddToCalendarAction":
        var n = j.startTime ? convertDate(j.startTime, j.useDeviceTimeZone) : false;
        var e = j.endTime ? convertDate(j.endTime, j.useDeviceTimeZone) : false;
        j.startTimeMs = n ? (new Date(n)).getTime() : undefined;
        j.endTimeMs = e ? (new Date(e)).getTime() : undefined;
        j.allDay = isAllDay(j.startTime, j.endTime);
        if (device.isPlatform("web")) {
            var o = new SEUrl("/mobile.php/event.ics");
            o.addParam("startTimeMs", j.startTimeMs);
            o.addParam("endTimeMs", j.endTimeMs);
            o.addParam("allDay", j.allDay);
            o.openInExternal();
        } else {
            return device.call("load/event/addToCalendar", j);
        }
    
    }
    var a = Binding.createObject({
        bindDesc: a,
        bindEnv: b
    });
    var h = RobotfruitApp.getPageByRef(a.page);
    if (a.page["$ref"] == "APP:ShoutAdd") {
        if (j.placeId) {
            navigateTo(getCheckinUrl(j.placeId));
        } else {
            navigateTo(getNewShoutUrl());
        }
        return;
    }
    if (!h.type) {
        return "";
    }
    if (h.type) {
        switch (h.type) {
        case "PlaceCategoriesPage":
            return goToNearbyPlacesByCategory(j.category_id);
        case "PlaceDetailsPage":
            return navigateTo(getPlaceDetailsUrl(j.itemId || j.placeId));
        case "PlacesPage":
            return navigateTo(getPlacesUrl());
        case "APP:Details:Shout":
            return navigateTo(getShoutDetailsUrl(j.itemId, d));
        case "CheckInPage":
            return navigateTo(getPlacesUrl());
        case "ShoutsPage":
            return navigateTo(getShoutsUrl());
        case "UserDetailsPage":
        case "UserEditPage":
            return navigateTo(getUserDetailsUrl(j.itemId || j.userId, j.datasourceId, j.dsParams));
        case "Notifications":
            return navigateTo(getNotificationsUrl());
        case "ShoutAddPage":
            if (j.shoutType == "ShoutType_CheckIn") {
                return navigateTo(getCheckinUrl(j.placeId));
            } else {
                return navigateTo(getNewShoutUrl());
            }
        case "SearchPage":
            return navigateTo(getShoutsUrl());
        case "UsersPage":
            return navigateTo(getUsersUrl());
        case "MapPage":
            if (j && j.longitude && j.latitude && !j.showInPage) {
                return openExternalUrl(getDirectionsUrl(j.latitude, j.longitude));
            }
            break;
        case "StreamPage":
            if (device.isPlatform("web")) {
                if (device.is("android")) {
                    var o = new SEUrl(a.parameters.streamUrl);
                    o.openInExternal();
                } else {
                    se.showToast(M.locNoRadioInMobileWeb);
                }
            } else {
                device.call("load/radio", {
                    url: a.parameters.streamUrl,
                    logoUrl: RobotfruitApp.skin.navigationBarLogo
                });
            }
            return;
        case "ExternalPage":
        case "ExternalUrl":
        case "WebPage":
        case "Web":
            openExternalUrl(j.url);
            return;
        }
    }
    if (h.type == "TabbedPage" && h.tabBarType == "Strip" && h.tabs.length === 1) {
        var f = RobotfruitApp.getPageByRef(h.tabs[0].page);
        console.log('web page');
        console.log(f);
        if (f && f.type == "WebPage") {
            console.log('internal parameter '+h.tabs[0].parameters.internal);
            openUrlInApp(h.tabs[0].parameters.url, h.tabs[0].parameters.internal);
            return;
        }
    }
    j._ = "GenericScreen";
    j.page = a.page["$ref"];
    j = sanitizeParams(j);
    navigateTo("#" + $.param(j));
};



var actionRunnable = function (a, b) {
    return function () {
        executeAction(a, b);
    };
};
var TestAction = function () {
    test("TestAction compilation test", function () {
        var a = {
            id: "The id"
        };
        executeAction({
            type: "OpenPageAction",
            page: {
                "$ref": "terraneoPage"
            },
            targetParameters: {
                test: {
                    path: "id"
                },
                test2: "This is a test"
            }
        }, a);
        ok(true);
    });
};