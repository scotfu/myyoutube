
function runTests() {
    loadCss("jasmine/jasmine.css");
    loadScripts(["jasmine/jasmine.js", "jasmine/jasmine-html.js", "tests.js"], function () {
        initJasmine();
    }, function (a) {
        alert("Failed to load script" + a);
    });
}
function initJasmine() {
    var b = jasmine.getEnv();
    b.updateInterval = 250;
    var a = new jasmine.HtmlReporter();
    b.addReporter(a);
    b.specFilter = function (c) {
        return a.specFilter(c);
    };
    b.execute();
}
function loadScript(e, f, a) {
    var c = document.getElementsByTagName("head")[0];
    var d = document.createElement("script");
    d.type = "text/javascript";
    d.src = RobotfruitApp.getRelativeUrl("test/" + e + "?_=" + (new Date()).toString());
    var b = setTimeout(a || function () {}, 2000);
    d.onload = function () {
        clearTimeout(b);
        (f || function () {})(e);
    };
    c.appendChild(d);
}
function loadScripts(d, e, a) {
    var b = 0;
    var c = function () {
        b++;
        if (b >= d.length) {
            e();
        } else {
            loadScript(d[b], c, a);
        }
    };
    loadScript(d[b], c, a);
}
function loadCss(a) {
    var b = document.createElement("link");
    b.setAttribute("rel", "stylesheet");
    b.setAttribute("type", "text/css");
    b.setAttribute("href", RobotfruitApp.getRelativeUrl("test/" + a));
    var c = document.getElementsByTagName("head")[0];
    c.appendChild(b);
}

function getHashValue(key) {
    if(window.location.hash.match(new RegExp(key+'=([^&]*)')) !== null)
        return window.location.hash.match(new RegExp(key+'=([^&]*)'))[1];
    else
        return false;
}
var initFunction = function () {

    var a = $("#master-content");
    if (!$.browser.webkit && !$.browser.mozilla) {
        a.html('<div style="text-align: center; width: 100%; top: 50%; position: absolute; font-size: 16px; ">Browser not supported. <br/>Please open this app in webkit or mozilla browser.</div>');
        return;
    }
    var b = a.find("#splash").detach();
    a.empty();
    se = new Screen(a);
    var c = paramsToObject(location.hash.substring(1));
    if (c.mode == "runTests") {
        runTests();
        return;
    }
    if (b && device.isPlatform("web")) {
        se.showSplash(b);
    }
    $("#screen").show();
    if (c.robotfruitApi) {
        network.robotfruitApi = c.robotfruitApi;
    }
    if (device.platform_name != "native_iphone") {
        user.load();
    }
    if (device.isPlatform("web")) {
        device.sysInfo.measurementSystem = RobotfruitApp.getDefaultUnitSystem();
    } else {
        /*device.call("system/getSysInfo", {
            complete: "setSysInfoHandler"
        });*/
    }
    RobotfruitApp.load(function (e) {
        $("title").html(RobotfruitApp.getName());
        var d = e.application;
        /*if (d.appiraterEnabled) {
            device.call("ui/checkAppirater", {
                days_before_prompt: d.appiraterDaysBeforePrompt,
                appirater_starts_before_prompt: d.appiraterStartsBeforePrompt
            });
        }*/
        branding.doBranding(e, function () {
            setAndroidOptionsMenu();
            if (!c._) {
                navigateTo(getHomeUrl());
            } else {
                navigateTo(location.hash);
            }
            initScreenHandler();
            console.debug("Platform: " + device.platform + " Name " + device.name);
            if (device.platform === "native" && device.name === "android") {
                console.debug("Call hide splash screen");
                device.call("ui/hideSplashScreen");
            }
            onResumeApp = $.noop;
            if (device.is("iphone")) {
                showBookmarkBubble();
            }
            if (RobotfruitApp.isGeoRequired()) {
                requireGeoPosition($.noop);
            }
        });
    }, function (g, d) {
        console.debug("Xhr STATUS: " + g.status + " error: " + d);
        var e = "Network Unreachable",
            f = "You're offline! Sorry, it looks like you lost your Internet connection. Please reconnect and try again.";
        if (d != "timeout" && g && g.status == 400 && device.platform == "web") {
            e = f;
        }
        if (device.name == "android" && device.platform == "native" && g.status === 0) {
            onResumeApp = initFunction;
            e = f;
        }
        ui.error(e);
    });
    
    var sessionId = getHashValue('sessionId');
    var userId = getHashValue('userId');
    
        
    if(sessionId && userId) {
         window.user.identities.set({
           authServer: 	"RobotfruitNetwork",
           userId: 	userId,
           sessionId: 	sessionId,
           authType: 	"url"
       });
       window.user.save();
       loggedInSocially = true;
    }
    
    serverConfig.referrer = null;
    
    
    
    
    
};
var loggedInSocially = false;
$(document).ready(initFunction);