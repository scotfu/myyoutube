Date.CultureInfo = {
    name: "en-US",
    englishName: "English (United States)",
    nativeName: "English (United States)",
    dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    abbreviatedDayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    shortestDayNames: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    firstLetterDayNames: ["S", "M", "T", "W", "T", "F", "S"],
    monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    abbreviatedMonthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    amDesignator: "AM",
    pmDesignator: "PM",
    firstDayOfWeek: 0,
    twoDigitYearMax: 2029,
    dateElementOrder: "mdy",
    formatPatterns: {
        shortDate: "M/d/yyyy",
        longDate: "dddd, MMMM dd, yyyy",
        shortTime: "h:mm tt",
        longTime: "h:mm:ss tt",
        fullDateTime: "dddd, MMMM dd, yyyy h:mm:ss tt",
        sortableDateTime: "yyyy-MM-ddTHH:mm:ss",
        universalSortableDateTime: "yyyy-MM-dd HH:mm:ssZ",
        rfc1123: "ddd, dd MMM yyyy HH:mm:ss GMT",
        monthDay: "MMMM dd",
        yearMonth: "MMMM, yyyy"
    },
    regexPatterns: {
        jan: /^jan(uary)?/i,
        feb: /^feb(ruary)?/i,
        mar: /^mar(ch)?/i,
        apr: /^apr(il)?/i,
        may: /^may/i,
        jun: /^jun(e)?/i,
        jul: /^jul(y)?/i,
        aug: /^aug(ust)?/i,
        sep: /^sep(t(ember)?)?/i,
        oct: /^oct(ober)?/i,
        nov: /^nov(ember)?/i,
        dec: /^dec(ember)?/i,
        sun: /^su(n(day)?)?/i,
        mon: /^mo(n(day)?)?/i,
        tue: /^tu(e(s(day)?)?)?/i,
        wed: /^we(d(nesday)?)?/i,
        thu: /^th(u(r(s(day)?)?)?)?/i,
        fri: /^fr(i(day)?)?/i,
        sat: /^sa(t(urday)?)?/i,
        future: /^next/i,
        past: /^last|past|prev(ious)?/i,
        add: /^(\+|after|from)/i,
        subtract: /^(\-|before|ago)/i,
        yesterday: /^yesterday/i,
        today: /^t(oday)?/i,
        tomorrow: /^tomorrow/i,
        now: /^n(ow)?/i,
        millisecond: /^ms|milli(second)?s?/i,
        second: /^sec(ond)?s?/i,
        minute: /^min(ute)?s?/i,
        hour: /^h(ou)?rs?/i,
        week: /^w(ee)?k/i,
        month: /^m(o(nth)?s?)?/i,
        day: /^d(ays?)?/i,
        year: /^y((ea)?rs?)?/i,
        shortMeridian: /^(a|p)/i,
        longMeridian: /^(a\.?m?\.?|p\.?m?\.?)/i,
        timezone: /^((e(s|d)t|c(s|d)t|m(s|d)t|p(s|d)t)|((gmt)?\s*(\+|\-)\s*\d\d\d\d?)|gmt)/i,
        ordinalSuffix: /^\s*(st|nd|rd|th)/i,
        timeContext: /^\s*(\:|a|p)/i
    },
    abbreviatedTimeZoneStandard: {
        GMT: "-000",
        EST: "-0400",
        CST: "-0500",
        MST: "-0600",
        PST: "-0700"
    },
    abbreviatedTimeZoneDST: {
        GMT: "-000",
        EDT: "-0500",
        CDT: "-0600",
        MDT: "-0700",
        PDT: "-0800"
    }
};
Date.getMonthNumberFromName = function (d) {
    var c = Date.CultureInfo.monthNames,
        b = Date.CultureInfo.abbreviatedMonthNames,
        e = d.toLowerCase();
    for (var a = 0; a < c.length; a++) {
        if (c[a].toLowerCase() == e || b[a].toLowerCase() == e) {
            return a;
        }
    }
    return -1;
};
Date.getDayNumberFromName = function (d) {
    var c = Date.CultureInfo.dayNames,
        b = Date.CultureInfo.abbreviatedDayNames,
        e = Date.CultureInfo.shortestDayNames,
        f = d.toLowerCase();
    for (var a = 0; a < c.length; a++) {
        if (c[a].toLowerCase() == f || b[a].toLowerCase() == f) {
            return a;
        }
    }
    return -1;
};
Date.isLeapYear = function (a) {
    return (((a % 4 === 0) && (a % 100 !== 0)) || (a % 400 === 0));
};
Date.getDaysInMonth = function (b, a) {
    return [31, (Date.isLeapYear(b) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][a];
};
Date.getTimezoneOffset = function (b, a) {
    return (a || false) ? Date.CultureInfo.abbreviatedTimeZoneDST[b.toUpperCase()] : Date.CultureInfo.abbreviatedTimeZoneStandard[b.toUpperCase()];
};
Date.getTimezoneAbbreviation = function (c, a) {
    var b = (a || false) ? Date.CultureInfo.abbreviatedTimeZoneDST : Date.CultureInfo.abbreviatedTimeZoneStandard,
        d;
    for (d in b) {
        if (b[d] === c) {
            return d;
        }
    }
    return null;
};
Date.prototype.clone = function () {
    return new Date(this.getTime());
};
Date.prototype.compareTo = function (a) {
    if (isNaN(this)) {
        throw new Error(this);
    }
    if (a instanceof Date && !isNaN(a)) {
        return (this > a) ? 1 : (this < a) ? -1 : 0;
    } else {
        throw new TypeError(a);
    }
};
Date.prototype.equals = function (a) {
    return (this.compareTo(a) === 0);
};
Date.prototype.between = function (b, a) {
    var c = this.getTime();
    return c >= b.getTime() && c <= a.getTime();
};
Date.prototype.addMilliseconds = function (a) {
    this.setMilliseconds(this.getMilliseconds() + a);
    return this;
};
Date.prototype.addSeconds = function (a) {
    return this.addMilliseconds(a * 1000);
};
Date.prototype.addMinutes = function (a) {
    return this.addMilliseconds(a * 60000);
};
Date.prototype.addHours = function (a) {
    return this.addMilliseconds(a * 3600000);
};
Date.prototype.addDays = function (a) {
    return this.addMilliseconds(a * 86400000);
};
Date.prototype.addWeeks = function (a) {
    return this.addMilliseconds(a * 604800000);
};
Date.prototype.addMonths = function (b) {
    var a = this.getDate();
    this.setDate(1);
    this.setMonth(this.getMonth() + b);
    this.setDate(Math.min(a, this.getDaysInMonth()));
    return this;
};
Date.prototype.addYears = function (a) {
    return this.addMonths(a * 12);
};
Date.prototype.add = function (a) {
    if (typeof a == "number") {
        this._orient = a;
        return this;
    }
    var b = a;
    if (b.millisecond || b.milliseconds) {
        this.addMilliseconds(b.millisecond || b.milliseconds);
    }
    if (b.second || b.seconds) {
        this.addSeconds(b.second || b.seconds);
    }
    if (b.minute || b.minutes) {
        this.addMinutes(b.minute || b.minutes);
    }
    if (b.hour || b.hours) {
        this.addHours(b.hour || b.hours);
    }
    if (b.month || b.months) {
        this.addMonths(b.month || b.months);
    }
    if (b.year || b.years) {
        this.addYears(b.year || b.years);
    }
    if (b.day || b.days) {
        this.addDays(b.day || b.days);
    }
    return this;
};
Date._validate = function (d, b, a, c) {
    if (typeof d != "number") {
        throw new TypeError(d + " is not a Number.");
    } else {
        if (d < b || d > a) {
            throw new RangeError(d + " is not a valid value for " + c + ".");
        }
    }
    return true;
};
Date.validateMillisecond = function (a) {
    return Date._validate(a, 0, 999, "milliseconds");
};
Date.validateSecond = function (a) {
    return Date._validate(a, 0, 59, "seconds");
};
Date.validateMinute = function (a) {
    return Date._validate(a, 0, 59, "minutes");
};
Date.validateHour = function (a) {
    return Date._validate(a, 0, 23, "hours");
};
Date.validateDay = function (b, c, a) {
    return Date._validate(b, 1, Date.getDaysInMonth(c, a), "days");
};
Date.validateMonth = function (a) {
    return Date._validate(a, 0, 11, "months");
};
Date.validateYear = function (a) {
    return Date._validate(a, 1, 9999, "seconds");
};
Date.prototype.set = function (a) {
    var b = a;
    if (!b.millisecond && b.millisecond !== 0) {
        b.millisecond = -1;
    }
    if (!b.second && b.second !== 0) {
        b.second = -1;
    }
    if (!b.minute && b.minute !== 0) {
        b.minute = -1;
    }
    if (!b.hour && b.hour !== 0) {
        b.hour = -1;
    }
    if (!b.day && b.day !== 0) {
        b.day = -1;
    }
    if (!b.month && b.month !== 0) {
        b.month = -1;
    }
    if (!b.year && b.year !== 0) {
        b.year = -1;
    }
    if (b.millisecond != -1 && Date.validateMillisecond(b.millisecond)) {
        this.addMilliseconds(b.millisecond - this.getMilliseconds());
    }
    if (b.second != -1 && Date.validateSecond(b.second)) {
        this.addSeconds(b.second - this.getSeconds());
    }
    if (b.minute != -1 && Date.validateMinute(b.minute)) {
        this.addMinutes(b.minute - this.getMinutes());
    }
    if (b.hour != -1 && Date.validateHour(b.hour)) {
        this.addHours(b.hour - this.getHours());
    }
    if (b.month !== -1 && Date.validateMonth(b.month)) {
        this.addMonths(b.month - this.getMonth());
    }
    if (b.year != -1 && Date.validateYear(b.year)) {
        this.addYears(b.year - this.getFullYear());
    }
    if (b.day != -1 && Date.validateDay(b.day, this.getFullYear(), this.getMonth())) {
        this.addDays(b.day - this.getDate());
    }
    if (b.timezone) {
        this.setTimezone(b.timezone);
    }
    if (b.timezoneOffset) {
        this.setTimezoneOffset(b.timezoneOffset);
    }
    return this;
};
Date.prototype.clearTime = function () {
    this.setHours(0);
    this.setMinutes(0);
    this.setSeconds(0);
    this.setMilliseconds(0);
    return this;
};
Date.prototype.isLeapYear = function () {
    var a = this.getFullYear();
    return (((a % 4 === 0) && (a % 100 !== 0)) || (a % 400 === 0));
};
Date.prototype.isWeekday = function () {
    return !(this.is().sat() || this.is().sun());
};
Date.prototype.getDaysInMonth = function () {
    return Date.getDaysInMonth(this.getFullYear(), this.getMonth());
};
Date.prototype.moveToFirstDayOfMonth = function () {
    return this.set({
        day: 1
    });
};
Date.prototype.moveToLastDayOfMonth = function () {
    return this.set({
        day: this.getDaysInMonth()
    });
};
Date.prototype.moveToDayOfWeek = function (a, c) {
    var b = (a - this.getDay() + 7 * (c || +1)) % 7;
    return this.addDays((b === 0) ? b += 7 * (c || +1) : b);
};
Date.prototype.moveToMonth = function (b, c) {
    var a = (b - this.getMonth() + 12 * (c || +1)) % 12;
    return this.addMonths((a === 0) ? a += 12 * (c || +1) : a);
};
Date.prototype.getDayOfYear = function () {
    return Math.floor((this - new Date(this.getFullYear(), 0, 1)) / 86400000);
};
Date.prototype.getWeekOfYear = function (e) {
    var k = this.getFullYear(),
        f = this.getMonth(),
        a = this.getDate();
    var c = e || Date.CultureInfo.firstDayOfWeek;
    var g = 7 + 1 - new Date(k, 0, 1).getDay();
    if (g == 8) {
        g = 1;
    }
    var b = ((Date.UTC(k, f, a, 0, 0, 0) - Date.UTC(k, 0, 1, 0, 0, 0)) / 86400000) + 1;
    var j = Math.floor((b - g + 7) / 7);
    if (j === c) {
        k--;
        var h = 7 + 1 - new Date(k, 0, 1).getDay();
        if (h == 2 || h == 8) {
            j = 53;
        } else {
            j = 52;
        }
    }
    return j;
};
Date.prototype.isDST = function () {
    console.log("isDST");
    return this.toString().match(/(E|C|M|P)(S|D)T/)[2] == "D";
};
Date.prototype.getTimezone = function () {
    return Date.getTimezoneAbbreviation(this.getUTCOffset, this.isDST());
};
Date.prototype.setTimezoneOffset = function (b) {
    var a = this.getTimezoneOffset(),
        c = Number(b) * -6 / 10;
    this.addMinutes(c - a);
    return this;
};
Date.prototype.setTimezone = function (a) {
    return this.setTimezoneOffset(Date.getTimezoneOffset(a));
};
Date.prototype.getUTCOffset = function () {
    var a = this.getTimezoneOffset() * -10 / 6,
        b;
    if (a < 0) {
        b = (a - 10000).toString();
        return b[0] + b.substr(2);
    } else {
        b = (a + 10000).toString();
        return "+" + b.substr(1);
    }
};
Date.prototype.getDayName = function (a) {
    return a ? Date.CultureInfo.abbreviatedDayNames[this.getDay()] : Date.CultureInfo.dayNames[this.getDay()];
};
Date.prototype.getMonthName = function (a) {
    return a ? Date.CultureInfo.abbreviatedMonthNames[this.getMonth()] : Date.CultureInfo.monthNames[this.getMonth()];
};
Date.prototype._toString = Date.prototype.toString;
Date.prototype.toString = function (a) {
    var c = this;
    var b = function b(d) {
        return (d.toString().length == 1) ? "0" + d : d;
    };
    return a ? a.replace(/dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|zz?z?/g, function (d) {
        switch (d) {
        case "hh":
            return b(c.getHours() < 13 ? c.getHours() : (c.getHours() - 12));
        case "h":
            return c.getHours() < 13 ? c.getHours() : (c.getHours() - 12);
        case "HH":
            return b(c.getHours());
        case "H":
            return c.getHours();
        case "mm":
            return b(c.getMinutes());
        case "m":
            return c.getMinutes();
        case "ss":
            return b(c.getSeconds());
        case "s":
            return c.getSeconds();
        case "yyyy":
            return c.getFullYear();
        case "yy":
            return c.getFullYear().toString().substring(2, 4);
        case "dddd":
            return c.getDayName();
        case "ddd":
            return c.getDayName(true);
        case "dd":
            return b(c.getDate());
        case "d":
            return c.getDate().toString();
        case "MMMM":
            return c.getMonthName();
        case "MMM":
            return c.getMonthName(true);
        case "MM":
            return b((c.getMonth() + 1));
        case "M":
            return c.getMonth() + 1;
        case "t":
            return c.getHours() < 12 ? Date.CultureInfo.amDesignator.substring(0, 1) : Date.CultureInfo.pmDesignator.substring(0, 1);
        case "tt":
            return c.getHours() < 12 ? Date.CultureInfo.amDesignator : Date.CultureInfo.pmDesignator;
        case "zzz":
        case "zz":
        case "z":
            return "";
        }
    }) : this._toString();
};
Date.now = function () {
    return new Date();
};
Date.today = function () {
    return Date.now().clearTime();
};
Date.prototype._orient = +1;
Date.prototype.next = function () {
    this._orient = +1;
    return this;
};
Date.prototype.last = Date.prototype.prev = Date.prototype.previous = function () {
    this._orient = -1;
    return this;
};
Date.prototype._is = false;
Date.prototype.is = function () {
    this._is = true;
    return this;
};
Number.prototype._dateElement = "day";
Number.prototype.fromNow = function () {
    var a = {};
    a[this._dateElement] = this;
    return Date.now().add(a);
};
Number.prototype.ago = function () {
    var a = {};
    a[this._dateElement] = this * -1;
    return Date.now().add(a);
};
(function () {
    var a = Date.prototype,
        b = Number.prototype;
    var e = ("sunday monday tuesday wednesday thursday friday saturday").split(/\s/),
        o = ("january february march april may june july august september october november december").split(/\s/),
        q = ("Millisecond Second Minute Hour Day Week Month Year").split(/\s/),
        c;
    var d = function (j) {
        return function () {
            if (this._is) {
                this._is = false;
                return this.getDay() == j;
            }
            return this.moveToDayOfWeek(j, this._orient);
        };
    };
    for (var g = 0; g < e.length; g++) {
        a[e[g]] = a[e[g].substring(0, 3)] = d(g);
    }
    var n = function (j) {
        return function () {
            if (this._is) {
                this._is = false;
                return this.getMonth() === j;
            }
            return this.moveToMonth(j, this._orient);
        };
    };
    for (var h = 0; h < o.length; h++) {
        a[o[h]] = a[o[h].substring(0, 3)] = n(h);
    }
    var f = function (k) {
        return function () {
            if (k.substring(k.length - 1) != "s") {
                k += "s";
            }
            return this["add" + k](this._orient);
        };
    };
    var p = function (j) {
        return function () {
            this._dateElement = j;
            return this;
        };
    };
    for (var l = 0; l < q.length; l++) {
        c = q[l].toLowerCase();
        a[c] = a[c + "s"] = f(q[l]);
        b[c] = b[c + "s"] = p(c);
    }
}());
Date.prototype.toJSONString = function () {
    return this.toString("yyyy-MM-ddThh:mm:ssZ");
};
Date.prototype.toShortDateString = function () {
    return this.toString(Date.CultureInfo.formatPatterns.shortDatePattern);
};
Date.prototype.toLongDateString = function () {
    return this.toString(Date.CultureInfo.formatPatterns.longDatePattern);
};
Date.prototype.toShortTimeString = function () {
    return this.toString(Date.CultureInfo.formatPatterns.shortTimePattern);
};
Date.prototype.toLongTimeString = function () {
    return this.toString(Date.CultureInfo.formatPatterns.longTimePattern);
};
Date.prototype.getOrdinal = function () {
    switch (this.getDate()) {
    case 1:
    case 21:
    case 31:
        return "st";
    case 2:
    case 22:
        return "nd";
    case 3:
    case 23:
        return "rd";
    default:
        return "th";
    }
};
(function () {
    Date.Parsing = {
        Exception: function (j) {
            this.message = "Parse error at '" + j.substring(0, 10) + " ...'";
        }
    };
    var a = Date.Parsing;
    var b = a.Operators = {
        rtoken: function (j) {
            return function (l) {
                var k = l.match(j);
                if (k) {
                    return ([k[0], l.substring(k[0].length)]);
                } else {
                    throw new a.Exception(l);
                }
            };
        },
        token: function (j) {
            return function (k) {
                return b.rtoken(new RegExp("^s*" + k + "s*"))(k);
            };
        },
        stoken: function (j) {
            return b.rtoken(new RegExp("^" + j));
        },
        until: function (j) {
            return function (o) {
                var l = [],
                    n = null;
                while (o.length) {
                    try {
                        n = j.call(this, o);
                    } catch (k) {
                        l.push(n[0]);
                        o = n[1];
                        continue;
                    }
                    break;
                }
                return [l, o];
            };
        },
        many: function (j) {
            return function (o) {
                var n = [],
                    l = null;
                while (o.length) {
                    try {
                        l = j.call(this, o);
                    } catch (k) {
                        return [n, o];
                    }
                    n.push(l[0]);
                    o = l[1];
                }
                return [n, o];
            };
        },
        optional: function (j) {
            return function (n) {
                var l = null;
                try {
                    l = j.call(this, n);
                } catch (k) {
                    return [null, n];
                }
                return [l[0], l[1]];
            };
        },
        not: function (j) {
            return function (l) {
                try {
                    j.call(this, l);
                } catch (k) {
                    return [null, l];
                }
                throw new a.Exception(l);
            };
        },
        ignore: function (j) {
            return j ? function (l) {
                var k = null;
                k = j.call(this, l);
                return [null, k[1]];
            } : null;
        },
        product: function () {
            var k = arguments[0],
                l = Array.prototype.slice.call(arguments, 1),
                n = [];
            for (var j = 0; j < k.length; j++) {
                n.push(b.each(k[j], l));
            }
            return n;
        },
        cache: function (l) {
            var j = {}, k = null;
            return function (o) {
                try {
                    k = j[o] = (j[o] || l.call(this, o));
                } catch (n) {
                    k = j[o] = n;
                }
                if (k instanceof a.Exception) {
                    throw k;
                } else {
                    return k;
                }
            };
        },
        any: function () {
            var j = arguments;
            return function (o) {
                var n = null;
                for (var l = 0; l < j.length; l++) {
                    if (j[l] == null) {
                        continue;
                    }
                    try {
                        n = (j[l].call(this, o));
                    } catch (k) {
                        n = null;
                    }
                    if (n) {
                        return n;
                    }
                }
                throw new a.Exception(o);
            };
        },
        each: function () {
            var j = arguments;
            return function (p) {
                var o = [],
                    n = null;
                for (var l = 0; l < j.length; l++) {
                    if (j[l] == null) {
                        continue;
                    }
                    try {
                        n = (j[l].call(this, p));
                    } catch (k) {
                        throw new a.Exception(p);
                    }
                    o.push(n[0]);
                    p = n[1];
                }
                return [o, p];
            };
        },
        all: function () {
            var k = arguments,
                j = j;
            return j.each(j.optional(k));
        },
        sequence: function (l, k, j) {
            k = k || b.rtoken(/^\s*/);
            j = j || null;
            if (l.length == 1) {
                return l[0];
            }
            return function (x) {
                var v = null,
                    u = null;
                var w = [];
                for (var t = 0; t < l.length; t++) {
                    try {
                        v = l[t].call(this, x);
                    } catch (n) {
                        break;
                    }
                    w.push(v[0]);
                    try {
                        u = k.call(this, v[1]);
                    } catch (o) {
                        u = null;
                        break;
                    }
                    x = u[1];
                }
                if (!v) {
                    throw new a.Exception(x);
                }
                if (u) {
                    throw new a.Exception(u[1]);
                }
                if (j) {
                    try {
                        v = j.call(this, v[1]);
                    } catch (p) {
                        throw new a.Exception(v[1]);
                    }
                }
                return [w, (v ? v[1] : x)];
            };
        },
        between: function (k, n, l) {
            l = l || k;
            var j = b.each(b.ignore(k), n, b.ignore(l));
            return function (p) {
                var o = j.call(this, p);
                return [[o[0][0], r[0][2]], o[1]];
            };
        },
        list: function (l, k, j) {
            k = k || b.rtoken(/^\s*/);
            j = j || null;
            return (l instanceof Array ? b.each(b.product(l.slice(0, - 1), b.ignore(k)), l.slice(-1), b.ignore(j)) : b.each(b.many(b.each(l, b.ignore(k))), px, b.ignore(j)));
        },
        set: function (l, k, j) {
            k = k || b.rtoken(/^\s*/);
            j = j || null;
            return function (D) {
                var B = null,
                    y = null,
                    z = null,
                    C = null,
                    n = [
                        [], D],
                    x = false;
                for (var v = 0; v < l.length; v++) {
                    z = null;
                    y = null;
                    B = null;
                    x = (l.length == 1);
                    try {
                        B = l[v].call(this, D);
                    } catch (o) {
                        continue;
                    }
                    C = [
                        [B[0]], B[1]
                    ];
                    if (B[1].length > 0 && !x) {
                        try {
                            z = k.call(this, B[1]);
                        } catch (t) {
                            x = true;
                        }
                    } else {
                        x = true;
                    }
                    if (!x && z[1].length === 0) {
                        x = true;
                    }
                    if (!x) {
                        var A = [];
                        for (var w = 0; w < l.length; w++) {
                            if (v != w) {
                                A.push(l[w]);
                            }
                        }
                        y = b.set(A, k).call(this, z[1]);
                        if (y[0].length > 0) {
                            C[0] = C[0].concat(y[0]);
                            C[1] = y[1];
                        }
                    }
                    if (C[1].length < n[1].length) {
                        n = C;
                    }
                    if (n[1].length === 0) {
                        break;
                    }
                }
                if (n[0].length === 0) {
                    return n;
                }
                if (j) {
                    try {
                        z = j.call(this, n[1]);
                    } catch (u) {
                        throw new a.Exception(n[1]);
                    }
                    n[1] = z[1];
                }
                return n;
            };
        },
        forward: function (k, j) {
            return function (l) {
                return k[j].call(this, l);
            };
        },
        replace: function (k, j) {
            return function (n) {
                var l = k.call(this, n);
                return [j, l[1]];
            };
        },
        process: function (k, j) {
            return function (n) {
                var l = k.call(this, n);
                return [j.call(this, l[0]), l[1]];
            };
        },
        min: function (j, k) {
            return function (n) {
                var l = k.call(this, n);
                if (l[0].length < j) {
                    throw new a.Exception(n);
                }
                return l;
            };
        }
    };
    var c = function (j) {
        return function () {
            var k = null,
                o = [];
            if (arguments.length > 1) {
                k = Array.prototype.slice.call(arguments);
            } else {
                if (arguments[0] instanceof Array) {
                    k = arguments[0];
                }
            }
            if (k) {
                for (var l = 0, n = k.shift(); l < n.length; l++) {
                    k.unshift(n[l]);
                    o.push(j.apply(null, k));
                    k.shift();
                    return o;
                }
            } else {
                return j.apply(null, arguments);
            }
        };
    };
    var e = "optional not ignore cache".split(/\s/);
    for (var f = 0; f < e.length; f++) {
        b[e[f]] = c(b[e[f]]);
    }
    var d = function (j) {
        return function () {
            if (arguments[0] instanceof Array) {
                return j.apply(null, arguments[0]);
            } else {
                return j.apply(null, arguments);
            }
        };
    };
    var h = "each any all".split(/\s/);
    for (var g = 0; g < h.length; g++) {
        b[h[g]] = d(b[h[g]]);
    }
}());
(function () {
    var f = function (g) {
        var l = [];
        for (var k = 0; k < g.length; k++) {
            if (g[k] instanceof Array) {
                l = l.concat(f(g[k]));
            } else {
                if (g[k]) {
                    l.push(g[k]);
                }
            }
        }
        return l;
    };
    Date.Grammar = {};
    Date.Translator = {
        hour: function (g) {
            return function () {
                this.hour = Number(g);
            };
        },
        minute: function (g) {
            return function () {
                this.minute = Number(g);
            };
        },
        second: function (g) {
            return function () {
                this.second = Number(g);
            };
        },
        meridian: function (g) {
            return function () {
                this.meridian = g.slice(0, 1).toLowerCase();
            };
        },
        timezone: function (g) {
            return function () {
                var k = g.replace(/[^\d\+\-]/g, "");
                if (k.length) {
                    this.timezoneOffset = Number(k);
                } else {
                    this.timezone = g.toLowerCase();
                }
            };
        },
        day: function (k) {
            var g = k[0];
            return function () {
                this.day = Number(g.match(/\d+/)[0]);
            };
        },
        month: function (g) {
            return function () {
                this.month = ((g.length == 3) ? Date.getMonthNumberFromName(g) : (Number(g) - 1));
            };
        },
        year: function (g) {
            return function () {
                var k = Number(g);
                this.year = ((g.length > 2) ? k : (k + (((k + 2000) < Date.CultureInfo.twoDigitYearMax) ? 2000 : 1900)));
            };
        },
        rday: function (g) {
            return function () {
                switch (g) {
                case "yesterday":
                    this.days = -1;
                    break;
                case "tomorrow":
                    this.days = 1;
                    break;
                case "today":
                    this.days = 0;
                    break;
                case "now":
                    this.days = 0;
                    this.now = true;
                    break;
                }
            };
        },
        finishExact: function (n) {
            n = (n instanceof Array) ? n : [n];
            var k = new Date();
            this.year = k.getFullYear();
            this.month = k.getMonth();
            this.day = 1;
            this.hour = 0;
            this.minute = 0;
            this.second = 0;
            for (var g = 0; g < n.length; g++) {
                if (n[g]) {
                    n[g].call(this);
                }
            }
            this.hour = (this.meridian == "p" && this.hour < 13) ? this.hour + 12 : this.hour;
            if (this.day > Date.getDaysInMonth(this.year, this.month)) {
                throw new RangeError(this.day + " is not a valid value for days.");
            }
            var l = new Date(this.year, this.month, this.day, this.hour, this.minute, this.second);
            if (this.timezone) {
                l.set({
                    timezone: this.timezone
                });
            } else {
                if (this.timezoneOffset) {
                    l.set({
                        timezoneOffset: this.timezoneOffset
                    });
                }
            }
            return l;
        },
        finish: function (s) {
            s = (s instanceof Array) ? f(s) : [s];
            if (s.length === 0) {
                return null;
            }
            for (var l = 0; l < s.length; l++) {
                if (typeof s[l] == "function") {
                    s[l].call(this);
                }
            }
            if (this.now) {
                return new Date();
            }
            var q = Date.today();
            var n = null;
            var g = !! (this.days != null || this.orient || this.operator);
            if (g) {
                var k, o, p;
                p = ((this.orient == "past" || this.operator == "subtract") ? -1 : 1);
                if (this.weekday) {
                    this.unit = "day";
                    k = (Date.getDayNumberFromName(this.weekday) - q.getDay());
                    o = 7;
                    this.days = k ? ((k + (p * o)) % o) : (p * o);
                }
                if (this.month) {
                    this.unit = "month";
                    k = (this.month - q.getMonth());
                    o = 12;
                    this.months = k ? ((k + (p * o)) % o) : (p * o);
                    this.month = null;
                }
                if (!this.unit) {
                    this.unit = "day";
                }
                if (this[this.unit + "s"] == null || this.operator != null) {
                    if (!this.value) {
                        this.value = 1;
                    }
                    if (this.unit == "week") {
                        this.unit = "day";
                        this.value = this.value * 7;
                    }
                    this[this.unit + "s"] = this.value * p;
                }
                return q.add(this);
            } else {
                if (this.meridian && this.hour) {
                    this.hour = (this.hour < 13 && this.meridian == "p") ? this.hour + 12 : this.hour;
                }
                if (this.weekday && !this.day) {
                    this.day = (q.addDays((Date.getDayNumberFromName(this.weekday) - q.getDay()))).getDate();
                }
                if (this.month && !this.day) {
                    this.day = 1;
                }
                return q.set(this);
            }
        }
    };
    var a = Date.Parsing.Operators,
        h = Date.Grammar,
        j = Date.Translator,
        d;
    h.datePartDelimiter = a.rtoken(/^([\s\-\.\,\/\x27]+)/);
    h.timePartDelimiter = a.stoken(":");
    h.whiteSpace = a.rtoken(/^\s*/);
    h.generalDelimiter = a.rtoken(/^(([\s\,]|at|on)+)/);
    var b = {};
    h.ctoken = function (n) {
        var k = b[n];
        if (!k) {
            var g = Date.CultureInfo.regexPatterns;
            var o = n.split(/\s+/),
                p = [];
            for (var l = 0; l < o.length; l++) {
                p.push(a.replace(a.rtoken(g[o[l]]), o[l]));
            }
            k = b[n] = a.any.apply(null, p);
        }
        return k;
    };
    h.ctoken2 = function (g) {
        return a.rtoken(Date.CultureInfo.regexPatterns[g]);
    };
    h.h = a.cache(a.process(a.rtoken(/^(0[0-9]|1[0-2]|[1-9])/), j.hour));
    h.hh = a.cache(a.process(a.rtoken(/^(0[0-9]|1[0-2])/), j.hour));
    h.H = a.cache(a.process(a.rtoken(/^([0-1][0-9]|2[0-3]|[0-9])/), j.hour));
    h.HH = a.cache(a.process(a.rtoken(/^([0-1][0-9]|2[0-3])/), j.hour));
    h.m = a.cache(a.process(a.rtoken(/^([0-5][0-9]|[0-9])/), j.minute));
    h.mm = a.cache(a.process(a.rtoken(/^[0-5][0-9]/), j.minute));
    h.s = a.cache(a.process(a.rtoken(/^([0-5][0-9]|[0-9])/), j.second));
    h.ss = a.cache(a.process(a.rtoken(/^[0-5][0-9]/), j.second));
    h.hms = a.cache(a.sequence([h.H, h.mm, h.ss], h.timePartDelimiter));
    h.t = a.cache(a.process(h.ctoken2("shortMeridian"), j.meridian));
    h.tt = a.cache(a.process(h.ctoken2("longMeridian"), j.meridian));
    h.z = a.cache(a.process(a.rtoken(/^(\+|\-)?\s*\d\d\d\d?/), j.timezone));
    h.zz = a.cache(a.process(a.rtoken(/^(\+|\-)\s*\d\d\d\d/), j.timezone));
    h.zzz = a.cache(a.process(h.ctoken2("timezone"), j.timezone));
    h.timeSuffix = a.each(a.ignore(h.whiteSpace), a.set([h.tt, h.zzz]));
    h.time = a.each(a.optional(a.ignore(a.stoken("T"))), h.hms, h.timeSuffix);
    h.d = a.cache(a.process(a.each(a.rtoken(/^([0-2]\d|3[0-1]|\d)/), a.optional(h.ctoken2("ordinalSuffix"))), j.day));
    h.dd = a.cache(a.process(a.each(a.rtoken(/^([0-2]\d|3[0-1])/), a.optional(h.ctoken2("ordinalSuffix"))), j.day));
    h.ddd = h.dddd = a.cache(a.process(h.ctoken("sun mon tue wed thu fri sat"), function (g) {
        return function () {
            this.weekday = g;
        };
    }));
    h.M = a.cache(a.process(a.rtoken(/^(1[0-2]|0\d|\d)/), j.month));
    h.MM = a.cache(a.process(a.rtoken(/^(1[0-2]|0\d)/), j.month));
    h.MMM = h.MMMM = a.cache(a.process(h.ctoken("jan feb mar apr may jun jul aug sep oct nov dec"), j.month));
    h.y = a.cache(a.process(a.rtoken(/^(\d\d?)/), j.year));
    h.yy = a.cache(a.process(a.rtoken(/^(\d\d)/), j.year));
    h.yyy = a.cache(a.process(a.rtoken(/^(\d\d?\d?\d?)/), j.year));
    h.yyyy = a.cache(a.process(a.rtoken(/^(\d\d\d\d)/), j.year));
    d = function () {
        return a.each(a.any.apply(null, arguments), a.not(h.ctoken2("timeContext")));
    };
    h.day = d(h.d, h.dd);
    h.month = d(h.M, h.MMM);
    h.year = d(h.yyyy, h.yy);
    h.orientation = a.process(h.ctoken("past future"), function (g) {
        return function () {
            this.orient = g;
        };
    });
    h.operator = a.process(h.ctoken("add subtract"), function (g) {
        return function () {
            this.operator = g;
        };
    });
    h.rday = a.process(h.ctoken("yesterday tomorrow today now"), j.rday);
    h.unit = a.process(h.ctoken("minute hour day week month year"), function (g) {
        return function () {
            this.unit = g;
        };
    });
    h.value = a.process(a.rtoken(/^\d\d?(st|nd|rd|th)?/), function (g) {
        return function () {
            this.value = g.replace(/\D/g, "");
        };
    });
    h.expression = a.set([h.rday, h.operator, h.value, h.unit, h.orientation, h.ddd, h.MMM]);
    d = function () {
        return a.set(arguments, h.datePartDelimiter);
    };
    h.mdy = d(h.ddd, h.month, h.day, h.year);
    h.ymd = d(h.ddd, h.year, h.month, h.day);
    h.dmy = d(h.ddd, h.day, h.month, h.year);
    h.date = function (g) {
        return ((h[Date.CultureInfo.dateElementOrder] || h.mdy).call(this, g));
    };
    h.format = a.process(a.many(a.any(a.process(a.rtoken(/^(dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|zz?z?)/), function (g) {
        if (h[g]) {
            return h[g];
        } else {
            throw Date.Parsing.Exception(g);
        }
    }), a.process(a.rtoken(/^[^dMyhHmstz]+/), function (g) {
        return a.ignore(a.stoken(g));
    }))), function (g) {
        return a.process(a.each.apply(null, g), j.finishExact);
    });
    var c = {};
    var e = function (g) {
        return c[g] = (c[g] || h.format(g)[0]);
    };
    h.formats = function (g) {
        if (g instanceof Array) {
            var l = [];
            for (var k = 0; k < g.length; k++) {
                l.push(e(g[k]));
            }
            return a.any.apply(null, l);
        } else {
            return e(g);
        }
    };
    h._formats = h.formats(["yyyy-MM-ddTHH:mm:ss", "ddd, MMM dd, yyyy H:mm:ss tt", "ddd MMM d yyyy HH:mm:ss zzz", "d"]);
    h._start = a.process(a.set([h.date, h.time, h.expression], h.generalDelimiter, h.whiteSpace), j.finish);
    h.start = function (l) {
        try {
            var k = h._formats.call({}, l);
            if (k[1].length === 0) {
                return k;
            }
        } catch (g) {}
        return h._start.call({}, l);
    };
}());
Date._parse = Date.parse;
Date.parse = function (c) {
    var b = null;
    if (!c) {
        return null;
    }
    try {
        b = Date.Grammar.start.call({}, c);
    } catch (a) {
        return null;
    }
    return ((b[1].length === 0) ? b[0] : null);
};
Date.getParseFunction = function (b) {
    var a = Date.Grammar.formats(b);
    return function (f) {
        var d = null;
        try {
            d = a.call({}, f);
        } catch (c) {
            return null;
        }
        return ((d[1].length === 0) ? d[0] : null);
    };
};
Date.parseExact = function (b, a) {
    return Date.getParseFunction(a)(b);
};

function renderEjs(c, a) {
    if (!renderEjs[c]) {
        var b;
        if (c.length < 100) {
            b = $("script#" + c).text();
            b = b.replace(/\s*<!\[CDATA\[\s*|\s*\]\]>\s*|[\r\n\t]/g, "");
        }
        if (!b) {
            b = c;
        }
        var d = "var p=[], print=function() { p.push.apply(p,arguments); };with(obj){p.push('" + b.replace(/[\r\t\n]/g, " ").split("<%").join("\t").replace(/((^|%>)[^\t]*)'/g, "$1\r").replace(/\t=(.*?)%>/g, "',$1,'").split("\t").join("');").split("%>").join("p.push('").split("\r").join("\\'") + "');}return p.join('');";
        renderEjs[c] = new Function("obj", d);
    }
    return a ? renderEjs[c](a) : renderEjs[c];
}
function getMonth(b, c) {
    if (!b) {
        return;
    }
    b = convertDate(b, c);
    var a = new Date(b);
    return a.toString("MMM");
}
function getDay(b, c) {
    if (!b) {
        return;
    }
    b = convertDate(b, c);
    var a = new Date(b);
    return a.toString("dd");
}
function renderTime(k, b, h) {
    try {
        var a = new Date(k);
        var j = new Date();
        if (h) {
            return a.toString(M.timeFormat);
        }
        var l = new Date();
        l.setHours(0, 0, 0, 0);
        var e = Math.ceil(Math.abs(a.getTime() - l.getTime()) / (1000 * 60 * 60 * 24));
        var c = "";
        if (a.getFullYear() === j.getFullYear() && j < a && e < 6) {
            if (a.getMonth() === j.getMonth() && a.getDate() === j.getDate()) {
                c = M.locToday;
            } else {
                c = M.locDayOfWeek[a.getDay()];
            }
        } else {
            if (a.getFullYear() === j.getFullYear() && j >= a && e < 30) {
                if (a.getMonth() === j.getMonth() && a.getDate() === j.getDate()) {
                    var f = Math.abs((a.getTime() - j.getTime()) / (1000 * 60 * 60));
                    var g = Math.abs((a.getTime() - j.getTime()) / (1000 * 60));
                    b = true;
                    if (f >= 1) {
                        c = getMessage("locNHoursAgo", parseInt(f));
                    } else {
                        if (g >= 10) {
                            c = getMessage("locNMinutesAgo", parseInt(g));
                        } else {
                            c = M.justNow;
                        }
                    }
                } else {
                    b = true;
                    if (f <= 12) {
                        c = getMessage("locNHoursAgo", parseInt(f));
                    } else {
                        c = getMessage("locNDaysAgo", parseInt(e));
                    }
                }
            } else {
                c = a.toString(getDateFmt(device.locale.locale));
                b = true;
            }
        }
        if (b || a.atMidnight()) {
            return c;
        } else {
            return c + " " + a.toString(M.timeFormat);
        }
    } catch (d) {
        console.error(d);
    }
}
function createImageNode(a, b) {
    return $(new Image()).load(function () {
        b(true);
    }).error(function () {
        b(false);
    }).attr(a);
}
function evalCss(a) {
    $("head").append('<style type="text/css">' + a + "</style>");
}(function () {
    if (window.google && google.gears) {
        return;
    }
    var b = null;
    if (typeof GearsFactory != "undefined") {
        b = new GearsFactory();
    } else {
        try {
            b = new ActiveXObject("Gears.Factory");
            if (b.getBuildInfo().indexOf("ie_mobile") != -1) {
                b.privateSetGlobalObject(this);
            }
        } catch (a) {
            if ((typeof navigator.mimeTypes != "undefined") && navigator.mimeTypes["application/x-googlegears"]) {
                b = document.createElement("object");
                b.style.display = "none";
                b.width = 0;
                b.height = 0;
                b.type = "application/x-googlegears";
                document.documentElement.appendChild(b);
            }
        }
    }
    if (!b) {
        return;
    }
    if (!window.google) {
        google = {};
    }
    if (!google.gears) {
        google.gears = {
            factory: b
        };
    }
})();