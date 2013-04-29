/*
 * geo-location-javascript v0.4.3
 * http://code.google.com/p/geo-location-javascript/
 *
 * Copyright (c) 2009 Stan Wiechers
 * Licensed under the MIT licenses.
 *
 * Revision: $Rev: 68 $: 
 * Author: $Author: whoisstan $:
 * Date: $Date: 2010-02-15 13:42:19 +0100 (Mon, 15 Feb 2010) $:    
 */
var bb_successCallback;
var bb_errorCallback;

var geo_position_js = function () {
    var b = {};
    var a = null;
    b.getCurrentPosition = function (e, c, d) {
        a.getCurrentPosition(e, c, d);
    };
    b.init = function () {
        try {
            if (typeof (geo_position_js_simulator) != "undefined") {
                a = geo_position_js_simulator;
            } else {
                if (typeof (bondi) != "undefined" && typeof (bondi.geolocation) != "undefined") {
                    a = bondi.geolocation;
                } else {
                    if (typeof (navigator.geolocation) != "undefined" && !device.is("pc")) {
                        a = navigator.geolocation;
                        b.getCurrentPosition = function (g, e, f) {
                            function d(h) {
                                if (typeof (h.latitude) != "undefined") {
                                    g({
                                        timestamp: h.timestamp,
                                        coords: {
                                            latitude: h.latitude,
                                            longitude: h.longitude
                                        }
                                    });
                                } else {
                                    g(h);
                                }
                            }
                            a.getCurrentPosition(d, e, f);
                        };
                        b.watchPosition = function (h, f, g) {
                            try {
                                a.watchPosition(h, f, g);
                                b.clearWatch = function (e) {
                                    if (typeof (a.clearWatch) != "undefined") {
                                        a.clearWatch(e);
                                    }
                                };
                            } catch (d) {
                                f({
                                    message: d,
                                    code: 1
                                });
                            }
                        };
                    } else {
                        if (typeof (window.google) != "undefined" && typeof (window.google.gears) != "undefined") {
                            a = google.gears.factory.create("beta.geolocation");
                            b.getCurrentPosition = function (j, g, h) {
                                try {
                                    function d(e) {
                                        if (typeof (e.latitude) != "undefined") {
                                            j({
                                                timestamp: e.timestamp,
                                                coords: {
                                                    latitude: e.latitude,
                                                    longitude: e.longitude
                                                }
                                            });
                                        } else {
                                            j(e);
                                        }
                                    }
                                    a.getCurrentPosition(d, g, h);
                                } catch (f) {
                                    g({
                                        message: f,
                                        code: 1
                                    });
                                }
                            };
                        } else {
                            if (typeof (Mojo) != "undefined" && typeof (Mojo.Service) != "undefined" && typeof (Mojo.Service.Request) != "Mojo.Service.Request") {
                                a = true;
                                b.getCurrentPosition = function (f, d, e) {
                                    parameters = {};
                                    if (e) {
                                        if (e.enableHighAccuracy && e.enableHighAccuracy == true) {
                                            parameters.accuracy = 1;
                                        }
                                        if (e.maximumAge) {
                                            parameters.maximumAge = e.maximumAge;
                                        }
                                        if (e.responseTime) {
                                            if (e.responseTime < 5) {
                                                parameters.responseTime = 1;
                                            } else {
                                                if (e.responseTime < 20) {
                                                    parameters.responseTime = 2;
                                                } else {
                                                    parameters.timeout = 3;
                                                }
                                            }
                                        }
                                    }
                                    r = new Mojo.Service.Request("palm://com.palm.location", {
                                        method: "getCurrentPosition",
                                        parameters: parameters,
                                        onSuccess: function (g) {
                                            f({
                                                timestamp: g.timestamp,
                                                coords: {
                                                    latitude: g.latitude,
                                                    longitude: g.longitude,
                                                    heading: g.heading
                                                }
                                            });
                                        },
                                        onFailure: function (g) {
                                            if (g.errorCode == 1) {
                                                d({
                                                    code: 3,
                                                    message: "Timeout"
                                                });
                                            } else {
                                                if (g.errorCode == 2) {
                                                    d({
                                                        code: 2,
                                                        message: "Position Unavailable"
                                                    });
                                                } else {
                                                    d({
                                                        code: 0,
                                                        message: "Unknown Error: webOS-code" + errorCode
                                                    });
                                                }
                                            }
                                        }
                                    });
                                };
                            } else {
                                if (typeof (device) != "undefined" && typeof (device.getServiceObject) != "undefined") {
                                    a = device.getServiceObject("Service.Location", "ILocation");
                                    b.getCurrentPosition = function (h, f, g) {
                                        function d(l, j, k) {
                                            if (j == 4) {
                                                f({
                                                    message: "Position unavailable",
                                                    code: 2
                                                });
                                            } else {
                                                h({
                                                    timestamp: null,
                                                    coords: {
                                                        latitude: k.ReturnValue.Latitude,
                                                        longitude: k.ReturnValue.Longitude,
                                                        altitude: k.ReturnValue.Altitude,
                                                        heading: k.ReturnValue.Heading
                                                    }
                                                });
                                            }
                                        }
                                        var e = new Object();
                                        e.LocationInformationClass = "BasicLocationInformation";
                                        a.ILocation.GetLocation(e, d);
                                    };
                                } else {
                                    if (typeof (window.blackberry) != "undefined" && blackberry.location.GPSSupported) {
                                        blackberry.location.setAidMode(2);
                                        b.getCurrentPosition = function (f, d, e) {
                                            bb_successCallback = f;
                                            bb_errorCallback = d;
                                            if (parseFloat(navigator.appVersion) >= 4.6) {
                                                blackberry.location.onLocationUpdate(handleBlackBerryLocation);
                                            } else {
                                                blackberry.location.onLocationUpdate("handleBlackBerryLocation()");
                                            }
                                            blackberry.location.refreshLocation();
                                        };
                                        a = blackberry.location;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } catch (c) {
            if (typeof (console) != "undefined") {
                console.log(c);
            }
        }
        return a != null;
    };
    return b;
}();
var getGeoPosition;
(function () {
    var c = false;
    var d;
    var e = [];
    var a = [];
    getGeoPosition = function (j, g)
    {
        function h(l, k)
        {
            while (method = l.pop())
            {
                method(k);
            }
            a = [];
            e = [];
            c = false;
        }
        if (j) {
            e.push(j);
        }
        if (g) {
            a.push(g);
        }
        if (!c) {
            c = true;
            console.debug("GEO REQUESTING");
            d(function (k) {
                console.debug("GEO SUCCESS " + k.coords.latitude + ", " + k.coords.longitude);
                h(e, k);
            }, function (k) {
                console.debug("GEO ERROR " + k);
                h(a, k);
            });
        } else {
            console.debug("GEO IN PROGRESS just adding to the queue");
        }
    };
    
    
    if (device.platform == "native")
    {

        onPositionFound = window.onPositionFound = function (g, h)
        {
            if (g) {
                var j = {
                    coords: {
                        latitude: g,
                        longitude: h
                    }
                };
                onPositionFound.success(j);
            } else {
                onPositionFound.error("position");
            }
        };
        d = function (h, g) {
            onPositionFound.success = h;
            onPositionFound.error = g;
            
            document.addEventListener("deviceready", onDeviceReady, false);

            // Cordova is ready
            //
            function onDeviceReady() {
                navigator.geolocation.getCurrentPosition(onSuccess, onError);
            }
            
            function onSuccess(position)
            {
                var e = paramsToObject(location.hash.substring(1));
                var b = new robotfruit.services.ServiceClient({
                    url: (e.robotfruitApi || config.robotfruitApi) + "/%s",
                    authServer: "RobotfruitNetwork",
                    status: $("<div></div>")
                });
                if (device.is("android"))
                    var deviceTypeId = 2;
                else
                    var deviceTypeId = 1;
                cordova.exec(function(regId) {
                        serverConfig.token = regId;
                        b.GET("user/location", { deviceTypeId: deviceTypeId, token : regId, lat : position.coords.latitude, lon : position.coords.longitude });
                             }, function(error) {}, "GCMRegistrationId", "get", []);
                
                onPositionFound(position.coords.latitude, position.coords.longitude);
            }
            
            /*
            function onError(error) {
                alert('code: '    + error.code    + '\n' +
                      'message: ' + error.message + '\n');
            }
            */
            function onError(error) {
                se.activityIndicator.hide();
                var j = {
                        coords: {
                                latitude: 40.7558624,
                                longitude: -73.5518097
                        }
                };
                h(j);
            }
        };
    } else {
        var f;
        var b = true;
        onPositionFound = window.onPositionFound = function (g, h) {
            //alert(g + " " + h);
            if (g) {
                var j = {
                    coords: {
                        latitude: g,
                        longitude: h
                    }
                };
                onPositionFound.success(j);
            } else {
                onPositionFound.error("position");
            }
        };
        d = function (k, h) {
                        onPositionFound.success = k;
                        onPositionFound.error = h;
			if (device.is("pc")) {
				var j = {
					coords: {
                                            latitude: 40.7558624,
                                            longitude: -73.5518097
					}
				};
				k(j);
			} else {
                                try
                                {
                                    if (navigator.geolocation)
                                    {
                                        navigator.geolocation.getCurrentPosition(
                                            onSuccess,
                                            onError
                                        );
                                        
                                    }
                                    else
                                    {
                                        alert("Geolocation is not supported by this browser.");
                                    }
                                }
                                catch(err)
                                {
                                    alert(err.message);
                                }
                                
                               

                                 
                                function onSuccess(position)
                                {
                                    var e = paramsToObject(location.hash.substring(1));
                                    var b = new robotfruit.services.ServiceClient({
                                        url: (e.robotfruitApi || config.robotfruitApi) + "/%s",
                                        authServer: "RobotfruitNetwork",
                                        status: $("<div></div>")
                                    });
                                    
                                    onPositionFound(position.coords.latitude, position.coords.longitude);
                                    
                                    se.activityIndicator.hide();
                                }
                                
                                function onError(error) {
                                    se.activityIndicator.hide();
                                    var j = {
                                            coords: {
                                                latitude: 40.7558624,
                                                longitude: -73.5518097
                                            }
                                    };
                                    k(j);
                                }
			}
        };
    }
})();
var Geocal = function () {
    function a(b) {
        return (b * (Math.PI / 180));
    }
    return {
        distance: function (j, l, k, n) {
            var o = 6371;
            var g = a(k - j);
            var h = a(n - l);
            var b = Math.sin(g / 2) * Math.sin(g / 2) + Math.cos(a(j)) * Math.cos(a(k)) * Math.sin(h / 2) * Math.sin(h / 2);
            var e = 2 * Math.atan2(Math.sqrt(b), Math.sqrt(1 - b));
            var f = o * e;
            return f;
        },
        angle: function (d, f, e, g) {
            var b = e - d;
            var c = g - f;
            return Math.atan2(c, b);
        }
    };
}();



window.google = window.google || {};
google.maps = google.maps || {};


function getGoogleStaticMap(a, b, d, f, c) {
    f = f || 15;
    var e = "http://maps.google.com/maps/api/staticmap?center=" + a + "," + b + "&zoom=" + f + "&size=" + d + "&sensor=false";
    if (typeof (c) == "string") {
        e += "&markers=icon:" + encodeURIComponent(c) + "|" + a + "," + b;
    } else {
        e += "&markers=color:green|" + a + "," + b;
    }
    return e;
}
function reverseGeocode(c, d, a) {
    var b = getServiceClient(config.googleMapsApi, {
        appendTypeToUrl: false
    });
    b.GET("maps/api/geocode/json", {
        latlng: c + "," + d,
        sensor: false
    }, function (e) {
        a(e.results);
    }, a);
}
