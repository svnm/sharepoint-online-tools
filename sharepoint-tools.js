
        var Date = (function () {
            function Date(input) {
                var date = new _native.Date(input);

                if (isNaN(date.getTime())) {
                    if (!(typeof input === "string"))
                        throw "ISODate, convert: input must be a string";
                    var d = input.match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2}):(\d{2}(?:\.\d+)?)(Z|(([+-])(\d{2}):(\d{2})))$/i);
                    if (!d)
                        throw "ISODate, convert: Illegal format";
                    date = new _native.Date(parseInt(d[1]), parseInt(d[2]) - 1, parseInt(d[3]), parseInt(d[4]), parseInt(d[5]), parseInt(d[6]));

                    // Converted Date is UTC date now change it into local
                    var x = new _native.Date();
                    date = new _native.Date(date.getTime() - (60000 * x.getTimezoneOffset()));
                }
                return date;
            }
            Date.format = function (date, mask, utc) {
                /* Date Format 1.2.3 | (c) 2007-2009 Steven Levithan <stevenlevithan.com> | MIT license EDITED By Tommy for support date conversion in IE8 */
                var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g;
                var timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g;
                var timezoneClip = /[^-+\dA-Z]/g;

                function pad(val, len) {
                    val = String(val);
                    len = len || 2;
                    while (val.length < len)
                        val = "0" + val;
                    return val;
                }

                // Some common format strings
                var masks = {
                    "default": "ddd mmm dd yyyy HH:MM:ss",
                    shortDate: "m/d/yy",
                    mediumDate: "mmm d, yyyy",
                    longDate: "mmmm d, yyyy",
                    fullDate: "dddd, mmmm d, yyyy",
search                    shortTime: "h:MM TT",
                    mediumTime: "h:MM:ss TT",
                    longTime: "h:MM:ss TT Z",
                    isoDate: "yyyy-mm-dd",
                    isoTime: "HH:MM:ss",
                    isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
                    isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
                };

                // Internationalization strings
                var i18n = {
                    dayNames: [
                        "Sun",
                        "Mon",
                        "Tue",
                        "Wed",
                        "Thu",
                        "Fri",
                        "Sat",
                        "Sunday",
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday"
                    ],
                    monthNames: [
                        "Jan",
                        "Feb",
                        "Mar",
                        "Apr",
                        "May",
                        "Jun",
                        "Jul",
                        "Aug",
                        "Sep",
                        "Oct",
                        "Nov",
                        "Dec",
                        "January",
                        "February",
                        "March",
                        "April",
                        "May",
                        "June",
                        "July",
                        "August",
                        "September",
                        "October",
                        "November",
                        "December"
                    ]
                };

                if (isNaN(date)) {
                    date = new Date(date);
                }

                if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
                    mask = date;
                    date = undefined;
                }

                mask = String(masks[mask] || mask || masks["default"]);

                if (mask.slice(0, 4) == "UTC:") {
                    mask = mask.slice(4);
                    utc = true;
                }

                var _ = utc ? "getUTC" : "get", 
                    d = date[_ + "Date"](), 
                    D = date[_ + "Day"](), 
                    m = date[_ + "Month"](), 
                    y = date[_ + "FullYear"](), 
                    H = date[_ + "Hours"](), 
                    M = date[_ + "Minutes"](), 
                    s = date[_ + "Seconds"](), 
                    L = date[_ + "Milliseconds"](), 
                    o = utc ? 0 : date.getTimezoneOffset(), 
                    flags = {
                        d: d,
                        dd: pad(d),
                        ddd: i18n.dayNames[D],
                        dddd: i18n.dayNames[D + 7],
                        m: m + 1,
                        mm: pad(m + 1),
                        mmm: i18n.monthNames[m],
                        mmmm: i18n.monthNames[m + 12],
                        yy: String(y).slice(2),
                        yyyy: y,
                        h: H % 12 || 12,
                        hh: pad(H % 12 || 12),
                        H: H,
                        HH: pad(H),
                        M: M,
                        MM: pad(M),
                        s: s,
                        ss: pad(s),
                        l: pad(L, 3),
                        L: pad(L > 99 ? Math.round(L / 10) : L),
                        t: H < 12 ? "a" : "p",
                        tt: H < 12 ? "am" : "pm",
                        T: H < 12 ? "A" : "P",
                        TT: H < 12 ? "AM" : "PM",
                        Z: utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                        o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                        S: ["th", "st", "nd", "rd"][(function () {
                            if (d % 10 > 3) {
                                return 0;
                            } else {
                                return (d % 100 - d % 10 != 10 ? 1 : 0) * d % 10;
                            }
                        })()]
                    };
                
                return mask.replace(token, function ($0) {
                    return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
                });
            };

            Date.ago = function (date) {
                date = isNaN(date) ? new SP.Util.Date(date) : date;
                var now = new _native.Date();
                var seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

                var interval = Math.floor(seconds / 31536000);
                if (interval == 1) {
                    return interval + " year ago";
                }
                if (interval > 1) {
                    return interval + " years ago";
                }

                interval = Math.floor(seconds / 2592000);
                if (interval == 1) {
                    return interval + " month ago";
                }
                if (interval > 1) {
                    return interval + " months ago";
                }

                interval = Math.floor(seconds / 86400);
                if (interval == 1) {
                    return "yesterday";
                }
                if (interval > 1) {
                    return interval + " days ago";
                }

                interval = Math.floor(seconds / 3600);
                if (interval == 1) {
                    return interval + " hour ago";
                }
                if (interval > 1) {
                    return interval + " hours ago";
                }

                interval = Math.floor(seconds / 60);
                if (interval > 1) {
                    return interval + " minutes ago";
                }

                interval = Math.floor(seconds);
                return (interval > 0 ? interval : 2) + " seconds ago";
            };
            return Date;
        })();
        Util.Date = Date;



/* Cookie */


    (function (Util) {
        var Cookie = (function () {
            function Cookie() {
            }
            Cookie.read = function (c_name) {
                var i, x, y, ARRcookies = document.cookie.split(";");
                for (i = 0; i < ARRcookies.length; i++) {
                    x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
                    y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
                    x = x.replace(/^\s+|\s+$/g, "");
                    if (x == c_name) {
                        return unescape(y);
                    }
                }
                return "";
            };
            Cookie.add = function (c_name, value, exdays) {
                var exdate = new _native.Date();
                exdate.setDate(exdate.getDate() + exdays);
                var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
                document.cookie = c_name + "=" + c_value;
            };

            Cookie.remove = function (key) {
                var date = new _native.Date();
                date.setDate(date.getDate() - 1);
                document.cookie = escape(key) + '=;expires=' + date;
            };
            return Cookie;
        })();
        Util.Cookie = Cookie;




/* URL */

    (function (Network) {
        var URL = (function () {
            function URL() {
            }
            URL.wrapSearchQuery = function (Query) {
                return 'path:' + this.protocolAndDomain + "/_api/search/query?" + Query;
            };
            URL.getParam = function (paramToRetrieve) {
                var paramCheck = document.URL.indexOf("?");
                if (paramCheck != -1) {
                    var params = document.URL.split("?")[1].split("&");
                    var strParams = "";
                    for (var i = 0; i < params.length; i = i + 1) {
                        var singleParam = params[i].split("=");
                        if (singleParam[0] == paramToRetrieve)
                            return singleParam[1];
                    }
                } else {
                    return null;
                }
            };
            URL.getAllParams = function () {
                var paramCheck = document.URL.indexOf("?");
                if (paramCheck != -1) {
                    var params = document.URL.split("?")[1].split("&");
                    var strParams = "";
                    for (var i = 0; i < params.length; i = i + 1) {
                        params[i] = params[i].split("=")[1];
                    }
                    return params;
                } else {
                    return null;
                }
            };
            URL.getDomainWithProtocol = function () {
                return this.protocolAndDomain;
            };
            URL.protocol = document.location.protocol;
            URL.domain = document.location.host;
            URL.protocolAndDomain = document.location.protocol + "//" + document.location.host;
            return URL;
        })();
        Network.URL = URL;
    })(SP.Network || (SP.Network = {}));
    var Network = SP.Network;


/* User */
/* Search */
/* List */
/* ListModel */


(function(SP) {
        var User = (function() {
            function User() {
                this.fn = new Array();
                this.done = false;
                var self = this;
                if (sessionStorage && sessionStorage.user) {
                    var user = JSON.parse(sessionStorage.user);
                    self.properties = user.properties;
                    self.done = true;
                    self.allDone();
                } else {
                    $.ajax({
                        url: "/_api/SP.UserProfiles.PeopleManager/GetMyProperties",
                        type: "GET",
                        headers: {
                            "Accept": "application/json;odata=verbose",
                            "Content-Type": "application/json;odata=verbose",
                            "X-RequestDigest": $("#__REQUESTDIGEST").val()
                        },
                        success: function(data) {
                            var x = data.d.UserProfileProperties.results;
                            for (var i in x) {
                                var key = x[i].Key;
                                var value = x[i].Value;
                                data.d[key] = value;
                            }
                            self.properties = data.d;
                            sessionStorage.user = JSON.stringify({
                                properties: self.properties
                            });
                            self.done = true;
                            self.allDone();
                        },
                        error: function(err) {
                            console.log("Unable to get user profile", err);
                        }
                    });
                }
            }
            User.prototype.allDone = function() {
                for (var x in this.fn) {
                    this.fn[x]();
                }
            };
            User.prototype.ready = function(aFn) {
                if (this.done) {
                    aFn();
                } else {
                    this.fn.push(aFn);
                }
            };
            User._getUserById = function _getUserById(id) {};
            return User;
        })();
        SP.User = User;

        var Search = (function () {
            function Search() {
            }
            Search.getFn = function () {
            };
            Search.get = function (query) {
                var self = this;
                this.getFn = function () {
                    $.ajax({
                        url: "/_api/search/postquery",
                        type: "POST",
                        headers: {
                            "Accept": "application/json;odata=verbose",
                            "Content-Type": "application/json;odata=verbose",
                            "X-RequestDigest": $("#__REQUESTDIGEST").val()
                        },
                        data: Search.QueryBuilder(query),
                        success: self.success,
                        error: self.fail
                    });
                };
                return this;
            };

            Search.success = function (data) {
                console.log(data);
            };

            Search.fail = function (err) {
                console.log(err);
            };

            Search.onsuccess = function (fn) {
                this.success = fn;
                return this;
            };

            Search.onfailed = function (fn) {
                this.fail = fn;
                this.getFn();
                return this;
            };

            Search.getData = function (config) {
                var XHR = new XMLHttpRequest();
                var URL = config["url"] || "/_api/search/postquery";

                XHR.open("POST", URL, true);
                XHR.setRequestHeader("Accept", "application/json;odata=verbose");
                XHR.setRequestHeader("Content-Type", "application/json;odata=verbose");
                XHR.setRequestHeader("X-RequestDigest", $("#__REQUESTDIGEST").val());

                XHR.onreadystatechange = function () {
                    if (XHR.readyState == 4 && XHR.status == 200) {
                        config.onsuccess(Search.Converter(JSON.parse(XHR.responseText), "news"));
                    }
                };

                XHR.send(Search.QueryBuilder(config["query"]));
            };

            Search.QueryBuilder = function (c) {
                var requestText = { request: {} };
                if (c.text) {
                    requestText.request["Querytext"] = c["text"];
                }
                if (c.select) {
                    requestText.request["SelectProperties"] = { results: c["select"] };
                }
                if (c.limit) {
                    requestText.request["RowLimit"] = c["limit"];
                }
                if (c.sort) {
                    var sort = [];
                    for (var x in c.sort) {
                        sort.push({ Property: c.sort[x][0], Direction: (c.sort[x][1] === "asc" ? 0 : 1) });
                    }
                    requestText.request["SortList"] = { results: sort };
                }
                return JSON.stringify(requestText);
            };

            Search.Converter = function (d, type) {
                if (type == "news") {
                    var arr = [];
                    var data = d["d"]["postquery"]["PrimaryQueryResult"]["RelevantResults"]["Table"]["Rows"]["results"];
                    for (var x in data) {
                        var cells = data[x]["Cells"]["results"];
                        var obj = {};
                        for (var y in cells) {
                            var key = cells[y].Key;
                            var value = cells[y].Value;
                            if (key == "PublishingImage") {
                                value = $(value).attr("src");
                            }
                            if (key == "HitHighlightedSummary") {
                                value = value.replace(/ <ddd\/>/gi, "...");
                            }

                            obj[key] = value;
                        }
                        arr.push(obj);
                    }
                    return arr;
                }
            };
            return Search;
        })();
        SP.Search = Search;

        var List = (function () {
            function List() {
            }
            List.request = function (c) {
                var _url = c["siteUrl"] || _spPageContextInfo["webServerRelativeUrl"];

                var requestJSON = {
                    url: c["url"],
                    type: c["type"],
                    headers: c["headers"],
                    success: function (data) {
                        return c["success"](data);
                    },
                    error: function (err) {
                        return c["error"](err);
                    }
                };

                if (c['data']) {
                    requestJSON["data"] = c['data'];
                }

                $.ajax(requestJSON);
            };

            List.QueryBuilderGET = function (c) {
                var queryStr = "?";

                function and() {
                    return queryStr == "?" ? "" : "&";
                }

                if (c["select"]) {
                    queryStr += and() + "$select=" + c["select"].replace(/'/g, "''");
                }

                if (c["orderby"]) {
                    queryStr += and() + "$orderBy=" + c["orderby"];
                }

                if (c["expand"]) {
                    queryStr += and() + "$expand=" + c["expand"];
                }

                if (c["filter"]) {
                    queryStr += and() + "$filter=" + c["filter"];
                }

                if (c["top"]) {
                    queryStr += and() + "$top=" + c["top"];
                }

                if (c["limit"]) {
                    queryStr += and() + "$top=" + c["limit"];
                }

                if (c["skip"]) {
                    queryStr += and() + "$skip=" + c["skip"];
                }

                return queryStr;
            };

            List.required = function (obj, paramnames) {
                for (var x in paramnames) {
                    if (!obj[paramnames[x]]) {
                        throw paramnames[x] + " is undefined";
                    }
                }
            };

            List.getItems = function (c) {
                List.required(c, ["listname", "success", "error"]);

                var query = "";
                if (c["query"]) {
                    query = List.QueryBuilderGET(c["query"]);
                }
                var subsite = c["subsite"] || "";
                var requestJSON = {
                    url: subsite + "/_api/web/lists/getByTitle('" + c["listname"] + "')/items" + query,
                    type: "GET",
                    headers: {
                        "Accept": "application/json;odata=verbose",
                        "Content-Type": "application/json;odata=verbose"
                    },
                    success: c["success"],
                    error: c["error"]
                };

                if (c["siteUrl"]) {
                    requestJSON['siteUrl'] = c["siteUrl"];
                }

                List.request(requestJSON);
            };

            List.deleteItems = function (c) {
                List.required(c, ["listname", "id", "success", "error"]);
                var subsite = c["subsite"] || "";
                var requestJSON = {
                    url: subsite + "/_api/web/lists/getByTitle('" + c["listname"] + "')/getItemByStringId('" + c["id"] + "')",
                    type: "DELETE",
                    headers: {
                        "Accept": "application/json;odata=verbose",
                        "Content-Type": "application/json;odata=verbose",
                        "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                        "IF-MATCH": "*"
                    },
                    success: c["success"],
                    error: c["error"]
                };

                if (c["siteUrl"]) {
                    requestJSON['siteUrl'] = c["siteUrl"];
                }

                List.request(requestJSON);
            };

            List.updateItems = function (c) {
                List.required(c, ["listname", "id", "success", "error", "data"]);
                var dataJSON = { '__metadata': { 'type': 'SP.Data.' + c["listname"] + 'ListItem' } };
                if (c["type"]) {
                    dataJSON = { '__metadata': { 'type': c["type"] } };
                }

                for (var x in c["data"]) {
                    dataJSON[x] = c["data"][x];
                }
                var subsite = c["subsite"] || "";
                var requestJSON = {
                    url: subsite + "/_api/web/lists/getByTitle('" + c["listname"] + "')/getItemByStringId('" + c["id"] + "')",
                    type: "POST",
                    headers: {
                        "Accept": "application/json;odata=verbose",
                        "Content-Type": "application/json;odata=verbose",
                        "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                        "IF-MATCH": "*",
                        "X-Http-Method": "PATCH"
                    },
                    data: JSON.stringify(dataJSON),
                    success: c["success"],
                    error: c["error"]
                };

                if (c["siteUrl"]) {
                    requestJSON['siteUrl'] = c["siteUrl"];
                }

                List.request(requestJSON);
            };

            List.addItems = function (c) {
                List.required(c, ["listname", "success", "error", "data"]);
                var dataJSON = { '__metadata': { 'type': 'SP.Data.' + c["listname"] + 'ListItem' } };
                if (c["type"]) {
                    dataJSON = { '__metadata': { 'type': c["type"] } };
                }

                for (var x in c["data"]) {
                    dataJSON[x] = c["data"][x];
                }
                var subsite = c["subsite"] || "";
                var requestJSON = {
                    url: subsite + "/_api/web/lists/getByTitle('" + c["listname"] + "')/items",
                    type: "POST",
                    headers: {
                        "Accept": "application/json;odata=verbose",
                        "Content-Type": "application/json;odata=verbose",
                        "X-RequestDigest": $("#__REQUESTDIGEST").val()
                    },
                    data: JSON.stringify(dataJSON),
                    success: c["success"],
                    error: c["error"]
                };

                if (c["siteUrl"]) {
                    requestJSON['siteUrl'] = c["siteUrl"];
                }

                List.request(requestJSON);
            };
            return List;
        })();
        SP.List = List;

        var ListModel = (function () {
            function ListModel(c, s, m, t) {
                if (c) {
                    this.listname = c || "";
                    this.subsite = s || "";
                    this.model = m || false;
                    this.type = t || "";
                }
                return this;
            }
            ListModel.prototype.name = function (c, s) {
                this.listname = c;
                this.subsite = s || "";
                return this;
            };

            ListModel.prototype.add = function (data) {
                var self = this;
                this.fn = function () {
                    SP.SP.List.addItems({
                        "subsite": self.subsite,
                        "listname": self.listname,
                        "success": self.success,
                        "error": self.fail,
                        "data": data,
                        "type": self.type
                    });
                };
                if (this.model) {
                    this.fn();
                    return;
                }
                return this;
            };

            ListModel.prototype.read = function (c) {
                var self = this;
                this.fn = function () {
                    var query = {
                        "subsite": self.subsite,
                        "listname": self.listname,
                        "success": self.success,
                        "error": self.fail
                    };
                    if (c) {
                        query['query'] = c;
                    }
                    SP.SP.List.getItems(query);
                };

                if (this.model) {
                    this.fn();
                    return;
                }

                return this;
            };

            ListModel.prototype.remove = function (id) {
                var self = this;
                this.fn = function () {
                    SP.SP.List.deleteItems({
                        "subsite": self.subsite,
                        "listname": self.listname,
                        "id": id,
                        "success": self.success,
                        "error": self.fail
                    });
                };
                if (this.model) {
                    this.fn();
                    return;
                }
                return this;
            };

            ListModel.prototype.update = function (id, data) {
                var self = this;
                this.fn = function () {
                    SP.SP.List.updateItems({
                        "subsite": self.subsite,
                        "listname": self.listname,
                        "id": id,
                        "success": self.success,
                        "error": self.fail,
                        "data": data,
                        "type": self.type
                    });
                };
                if (this.model) {
                    this.fn();
                    return;
                }
                return this;
            };

            ListModel.prototype.success = function (data) {
                console.log("Please define fail condition", data);
            };

            ListModel.prototype.fail = function (err) {
                console.log("Please define fail condition", err);
            };

            ListModel.prototype.onsuccess = function (n) {
                if (n) {
                    this.success = n;
                }

                return this;
            };

            ListModel.prototype.onfailed = function (n) {
                if (n) {
                    this.fail = n;
                }
                if (!this.model) {
                    this.fn();
                }
                return this;
            };
            return ListModel;
        })();
        SP.ListModel = ListModel;



// Initialize User
var User = {};
(function () {
    User = new SP.SP.User();
})();


/* TermStore */

        var TermStore = (function() {
            function TermStore(SSPIDManagedMetadataService, GUIDParent, TermName, isAtGroupLevel) {
                this.SSPIDManagedMetadataService = SSPIDManagedMetadataService;
                this.GUIDParent = GUIDParent;
                this.TermName = TermName;
                this.termSet = {};
                this.dataDone = false;
                this.connectionThread = 0;
                try {
                    if (typeof this.SSPIDManagedMetadataService !== "undefined" && typeof this.GUIDParent !== "undefined") {
                        (isAtGroupLevel == true) ? this.getTermSets(this.GUIDParent, this) : this.getFirstTerm(this.GUIDParent, this);
                    } else {
                        console.log("Please make sure you are passing parameters : SSPIDManagedMetadataService , GUIDParent , TermName");
                    }
                } catch (err) {
                    console.log("Something went wrong on executeTermStore. TermStore.js: " + err);
                }
            }
            TermStore.prototype.getTermSets = function(QueryID, self) {
                self.termSet['name'] = self.name;
                self.termSet['id'] = QueryID;
                self.termSet['child'] = [];
                var XHR = new XMLHttpRequest();
                this.query = '{"sspId":"' + this.SSPIDManagedMetadataService + '","lcid":1033,"includeDeprecated":true,"includeNoneTaggableTermset":true,"webId":"00000000-0000-0000-0000-000000000000","listId":"00000000-0000-0000-0000-000000000000","guid":"' + QueryID + '","termsetId":"' + QueryID + '","includeCurrentChild":true,"currentChildId":"00000000-0000-0000-0000-000000000000","pagingForward":true,"pageLimit":100}';
                this.url = document.location.protocol + "//" + document.location.host + "/_vti_bin/taxonomyinternalservice.json/GetTermSets";
                XHR.open("POST", this.url, true);
                XHR.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                XHR.setRequestHeader("X-RequestDigest", $("#__REQUESTDIGEST").val());
                XHR.onreadystatechange = function() {
                    if (XHR.readyState == 4 && XHR.status == 200) {
                        var obj = jQuery.parseJSON(XHR.responseText);
                        var results = obj.d.Content;
                        for (var result in results) {
                            var child = {
                                name: results[result].Nm.replace(/＆/gi, "&"),
                                id: results[result].Id
                            };
                            self.termSet.child.push(child); {
                                self.getFirstTermForRoot(results[result].Id, child);
                            }
                        }
                        self.connectionThread--;
                    }
                };
                XHR.send(this.query);
                this.connectionThread++;
            };
            TermStore.prototype.getFirstTermForRoot = function(QueryID, self) {
                var mainObj = this;
                self['name'] = self.name;
                self['id'] = QueryID;
                self['child'] = [];
                var XHR = new XMLHttpRequest();
                this.query = '{"sspId":"' + this.SSPIDManagedMetadataService + '","lcid":1033,"includeDeprecated":true,"includeNoneTaggableTermset":true,"webId":"00000000-0000-0000-0000-000000000000","listId":"00000000-0000-0000-0000-000000000000","guid":"' + QueryID + '","termsetId":"' + QueryID + '","includeCurrentChild":true,"currentChildId":"00000000-0000-0000-0000-000000000000","pagingForward":true,"pageLimit":100}';
                this.url = document.location.protocol + "//" + document.location.host + "/_vti_bin/taxonomyinternalservice.json/GetChildTermsInTermSetWithPaging";
                XHR.open("POST", this.url, true);
                XHR.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                XHR.setRequestHeader("X-RequestDigest", $("#__REQUESTDIGEST").val());
                XHR.onreadystatechange = function() {
                    if (XHR.readyState == 4 && XHR.status == 200) {
                        var obj = jQuery.parseJSON(XHR.responseText);
                        console.log(obj);
                        var results = obj.d.Content;
                        for (var result in results) {
                            if (result > 0) {
                                var child = {
                                    name: results[result].Nm.replace(/＆/gi, "&"),
                                    id: results[result].Id
                                };
                                self.child.push(child);
                                if (results[result].Cc) {
                                    mainObj.getChildTerm(results[result].Id, child, QueryID);
                                }
                            }
                        }
                        mainObj.connectionThread--;
                        if (mainObj.connectionThread == 0) {
                            mainObj.done();
                        }
                    }
                };
                XHR.send(this.query);
                this.connectionThread++;
            };
            TermStore.prototype.getFirstTerm = function(QueryID, self) {
                self.termSet['name'] = self.name;
                self.termSet['id'] = QueryID;
                self.termSet['child'] = [];
                var XHR = new XMLHttpRequest();
                this.query = '{"sspId":"' + this.SSPIDManagedMetadataService + '","lcid":1033,"includeDeprecated":true,"includeNoneTaggableTermset":true,"webId":"00000000-0000-0000-0000-000000000000","listId":"00000000-0000-0000-0000-000000000000","guid":"' + QueryID + '","termsetId":"' + QueryID + '","includeCurrentChild":true,"currentChildId":"00000000-0000-0000-0000-000000000000","pagingForward":true,"pageLimit":100}';
                this.url = document.location.protocol + "//" + document.location.host + "/_vti_bin/taxonomyinternalservice.json/GetChildTermsInTermSetWithPaging";
                XHR.open("POST", this.url, true);
                XHR.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                XHR.setRequestHeader("X-RequestDigest", $("#__REQUESTDIGEST").val());
                XHR.onreadystatechange = function() {
                    if (XHR.readyState == 4 && XHR.status == 200) {
                        var obj = jQuery.parseJSON(XHR.responseText);
                        var results = obj.d.Content;
                        for (var result in results) {
                            if (result > 0) {
                                var child = {
                                    name: results[result].Nm.replace(/＆/gi, "&"),
                                    id: results[result].Id
                                };
                                self.termSet.child.push(child);
                                if (results[result].Cc) {
                                    self.getChildTerm(results[result].Id, child, QueryID);
                                }
                            }
                        }
                        self.connectionThread--;
                    }
                };
                XHR.send(this.query);
                this.connectionThread++;
            };
            TermStore.prototype.getChildTerm = function(QueryID, self, QuerypParentID) {
                var mainObj = this;
                self['name'] = self.name;
                self['id'] = QueryID;
                self['child'] = [];
                var XHR = new XMLHttpRequest();
                this.query = '{"sspId":"' + this.SSPIDManagedMetadataService + '","lcid":1033,"includeDeprecated":true,"includeNoneTaggableTermset":true,"webId":"00000000-0000-0000-0000-000000000000","listId":"00000000-0000-0000-0000-000000000000","guid":"' + QueryID + '","termsetId":"' + QuerypParentID + '","includeCurrentChild":true,"currentChildId":"00000000-0000-0000-0000-000000000000","pagingForward":true,"pageLimit":100}';
                this.url = document.location.protocol + "//" + document.location.host + "/_vti_bin/taxonomyinternalservice.json/GetChildTermsInTermWithPaging";
                XHR.open("POST", this.url, true);
                XHR.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                XHR.setRequestHeader("X-RequestDigest", $("#__REQUESTDIGEST").val());
                XHR.onreadystatechange = function() {
                    if (XHR.readyState == 4 && XHR.status == 200) {
                        var obj = jQuery.parseJSON(XHR.responseText);
                        var results = obj.d.Content;
                        for (var result in results) {
                            if (result > 0) {
                                var child = {
                                    name: results[result].Nm.replace(/＆/gi, "&"),
                                    id: results[result].Id,
                                    parentId: QueryID
                                };
                                self.child.push(child);
                                if (results[result].Cc) {
                                    mainObj.getChildTerm(results[result].Id, child, QuerypParentID);
                                }
                            }
                        }
                        mainObj.connectionThread--;
                        if (mainObj.connectionThread == 0) {
                            mainObj.done();
                        }
                    }
                };
                XHR.send(this.query);
                this.connectionThread++;
            };
            TermStore.prototype.done = function() {
                this.dataDone = true;
                return this.termSet;
            };
            return TermStore;
        })();
        SP.TermStore = TermStore;



/* Page */
/* PageModel */

        var Page = (function () {
            function Page() {
            }
            Page.request = function (c) {
                var requestJSON = {
                    url: c["url"],
                    type: c["type"],
                    headers: c["headers"],
                    success: function (data) {
                        return c["success"](data);
                    },
                    error: function (err) {
                        return c["error"](err);
                    }
                };
                if (c['data']) {
                    requestJSON["data"] = c['data'];
                }

                $.ajax(requestJSON);
            };

            Page.QueryBuilderGET = function (c) {
                var queryStr = "?";

                function and() {
                    return queryStr == "?" ? "" : "&";
                }

                if (c["select"]) {
                    queryStr += and() + "$select=" + c["select"];
                }

                if (c["orderby"]) {
                    queryStr += and() + "$orderBy=" + c["orderby"];
                }

                if (c["expand"]) {
                    queryStr += and() + "$expand=" + c["expand"];
                }

                if (c["filter"]) {
                    queryStr += and() + "$filter=" + c["filter"];
                }

                if (c["top"]) {
                    queryStr += and() + "$top=" + c["top"];
                }

                if (c["limit"]) {
                    queryStr += and() + "$top=" + c["limit"];
                }

                if (c["skip"]) {
                    queryStr += and() + "$skip=" + c["skip"];
                }

                return queryStr;
            };

            Page.required = function (obj, paramnames) {
                for (var x in paramnames) {
                    if (!obj[paramnames[x]]) {
                        throw paramnames[x] + " is undefined";
                    }
                }
            };

            Page.getItems = function (c) {
                Page.required(c, ["serverRequestPath", "success", "error"]);

                var query = "";
                if (c["query"]) {
                    query = Page.QueryBuilderGET(c["query"]);
                }
                var webAbsoluteUrl = c["webAbsoluteUrl"] || "";
                var requestJSON = {
                    url: webAbsoluteUrl + "/_api/web/getFileByServerRelativeUrl('" + c["serverRequestPath"] + "')/ListItemAllFields" + query,
                    type: "GET",
                    headers: {
                        "Accept": "application/json;odata=verbose",
                        "Content-Type": "application/json;odata=verbose"
                    },
                    success: c["success"],
                    error: c["error"]
                };

                if (c["siteUrl"]) {
                    requestJSON['siteUrl'] = c["siteUrl"];
                }

                Page.request(requestJSON);
            };

            Page.deleteItems = function (c) {
                Page.required(c, ["listname", "id", "success", "error"]);
                var subsite = c["subsite"] || "";
                var requestJSON = {
                    url: subsite + "/_api/web/lists/getByTitle('" + c["listname"] + "')/getItemByStringId('" + c["id"] + "')",
                    type: "DELETE",
                    headers: {
                        "Accept": "application/json;odata=verbose",
                        "Content-Type": "application/json;odata=verbose",
                        "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                        "IF-MATCH": "*"
                    },
                    success: c["success"],
                    error: c["error"]
                };

                if (c["siteUrl"]) {
                    requestJSON['siteUrl'] = c["siteUrl"];
                }

                Page.request(requestJSON);
            };
            return Page;
        })();
        SP.Page = Page;

        var PageModel = (function () {
            function PageModel(c, s, m, t) {
                if (c) {
                    this.serverRequestPath = c || "";
                    this.webAbsoluteUrl = s || "";
                    this.model = m || false;
                    this.type = t || "";
                }
                return this;
            }
            PageModel.prototype.name = function (c, s) {
                this.serverRequestPath = c;
                this.webAbsoluteUrl = s || "";
                return this;
            };

            PageModel.prototype.read = function (c) {
                var self = this;
                this.fn = function () {
                    var query = {
                        "webAbsoluteUrl": self.webAbsoluteUrl,
                        "serverRequestPath": self.serverRequestPath,
                        "success": self.success,
                        "error": self.fail
                    };
                    if (c) {
                        query['query'] = c;
                    }
                    SP.SP.Page.getItems(query);
                };

                if (this.model) {
                    this.fn();
                    return;
                }

                return this;
            };

            PageModel.prototype.remove = function (id) {
                var self = this;
                this.fn = function () {
                    SP.SP.List.deleteItems({
                        "webAbsoluteUrl": self.webAbsoluteUrl,
                        "serverRequestPath": self.serverRequestPath,
                        "id": id,
                        "success": self.success,
                        "error": self.fail
                    });
                };
                if (this.model) {
                    this.fn();
                    return;
                }
                return this;
            };

            PageModel.prototype.success = function (data) {
                console.log("Please define success condition - PageModel", data);
            };

            PageModel.prototype.fail = function (err) {
                console.log("Please define fail condition - PageModel", err);
            };

            PageModel.prototype.onsuccess = function (n) {
                if (n) {
                    this.success = n;
                }

                return this;
            };

            PageModel.prototype.onfailed = function (n) {
                if (n) {
                    this.fail = n;
                }
                if (!this.model) {
                    this.fn();
                }
                return this;
            };
            return PageModel;
        })();
        SP.PageModel = PageModel;
    })(SP.SP || (SP.SP = {}));
    var SP = SP.SP;
    
    
    
    
    
    
    
var AU;
(function (AU) {

    var Utils = (function () {   
                
        function Utils() {
        }
        
        Utils.getAuthorUrl = function () {
        	return "http://my.aurecongroup.com/person.aspx?accountname=i%3A0%23%2Ew%7Caurecon%5C";
        };

        Utils.arrayRemove = function(array,value) {        
			var index = array.indexOf(value);
			if (index > -1) {
			    array.splice(index, 1);
			}
        };
       
        Utils.replaceAll = function(find, replace, str) {
        	return str.replace(new RegExp(find, 'g'), replace);
        };
                
        Utils.removeObjectFromArray = function(array, property, value) {        
	    	var indexToDelete = 0;
			$.each(array, function(index, result) {
		    	if(result[property] == value) {
		        	indexToDelete = index;
		      	}    
			});		   
			if(array.length){
		    	array.splice(indexToDelete,1);
			}        
        };
        
        Utils.getObjectFromArray = function(array, property, opts) {        

	        // get a property from a given value in the object
	        if(typeof(opts['value']) !== "undefined" && typeof(opts['propertyToFind']) !== "undefined" ){
	        	$.each(array, function(index, result) {
			    	if(result[propertyToFind] == value) {
			        	return result[property];
			      	}
				});
	        }
	        
	        // get by index on the array
	        if(typeof(opts['index']) !== "undefined" ){
	        	return array[opts.index][property];
	        }			
        };
        
        Utils.dateDiffInDays = function(a, b) {
        	var msPerDay = 1000 * 60 * 60 * 24;        	
        	var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
			var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
			return Math.floor((utc2 - utc1) / msPerDay);
        };
        
        Utils.sortObject = function (property) {
           var sortOrder = 1;
		    if(property[0] === "-") {
		        sortOrder = -1;
		        property = property.substr(1);
		    }
		    return function (a,b) {
		        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
		        return result * sortOrder;
		    }
        };
        
        return Utils;
    })();
    AU.Utils= Utils;


    var App = (function () { 
                     
        function App() {
        }
        
        App.findWebPartId = function ($element) {
        	var id = $($element).parent().parent().attr('webpartid');
        	return id;
        };
                                
        App.getAppProperties = function (id, appName) {        
	        var settingsArray = [];
	        var appSettingsFieldView = $("#AppSettings");
			var appSettingsFieldEdit = $("#AppSettings").find("textarea");
			var appSettings, appSettingsString;
			
			if(appSettingsFieldView.length){
				appSettingsString = appSettingsFieldView.text().replace(/\s+/g, ' ');
			}					
			if(appSettingsFieldEdit.length){
				appSettingsString = appSettingsFieldEdit.text().replace(/\s+/g, ' ');
			}

			// parse app settings String if not empty
			if(appSettingsString !== "" && appSettingsString !== " " && typeof appSettingsString !== "undefined"){
				appSettings = JSON.parse(appSettingsString);					
			}
			
			if(typeof appSettings === "undefined"){
				return;
			}	
			if(typeof appSettings.apps === "undefined"){
				return;
			}
			
			for(var i = 0; i < appSettings.apps.length; i++){
				var app = appSettings.apps[i];						
				if(typeof app.appName === "undefined" || app.id === "undefined"){
					return;
				}
				// loop through settings and add them
				if(appName === app.appName && id === app.id){
					for(var j = 0; j < app.settings.length; j++){
						var setting = { name : app.settings[j].name, 
										value : app.settings[j].value
						};
						settingsArray.push(setting);							
					}
				}
			}
			          
			return settingsArray;  
        };
        
        App.getAppProperty = function (id, appName, propertyName) {
        
        	var appProperties = AU.App.getAppProperties(id, appName, propertyName),
			property = "";

            if(typeof appProperties !== "undefined"){
            	if(appProperties.length){
            		for(var i = 0; i < appProperties.length; i++){
               		 	if(appProperties[i].name === propertyName){
                			property = appProperties[i].value;
                		}                    		
                	}
               	}
            }
            return property;      
        };
        
        return App;
    })();
    AU.App = App;
    
    
    
    
    
    
    
Apps.Search.GetMasterItems = function (callback) {

	var clientContext = new SP.ClientContext.get_current();
    var list = clientContext.get_web().get_lists().getById("849b12a9-7036-495d-a8fd-293db302431d");
    var listItems = list.getItems('');
    /*
    var camlQuery = new SP.CamlQuery();
    camlQuery.Query = "<Where><Contains><FieldRef Name='AlphaCode' /><Value Type='Text'>AAH</Value></Contains></Where>";
	var listItems = list.getItems(camlQuery);
	*/
    clientContext.load(listItems);    
	clientContext.executeQueryAsync(Function.createDelegate(this, function (sender, args) {
	    var listItemEnumerator = listItems.getEnumerator();
        var items = [];
        while (listItemEnumerator.moveNext()) {
	        var listItem = listItemEnumerator.get_current();
	        var item = { 
	        	'AureconProjectNumber': listItem.get_item('AureconProjectNumber'),
	        	'AlphaCode': listItem.get_item('AlphaCode'),
	        	'WorkOrderName': listItem.get_item('WorkOrderName'),
	        	'WOStatus': listItem.get_item('WOStatus'),
	        	'id': listItem.get_id(),
	        	'date': listItem.get_item('Created'),
	        	'author': listItem.get_item('Author')
	        };   
	        item.authorId = item.author.$1E_1;
	        item.author = item.author.$2e_1;
	        item.AlphaCode = item.AlphaCode.$2e_1

	        items.push(item);
	    }
	    		
        callback(items);		
		
	}), Function.createDelegate(this, function (sender, args) {
		console.log("failed to get items from Master list");
	}));
}





Apps.Search.IsCurrentUserMemberOfGroup = function(groupName, OnComplete) {

        var currentContext = new SP.ClientContext.get_current();
        var currentWeb = currentContext.get_web();
        var currentUser = currentContext.get_web().get_currentUser();
        currentContext.load(currentUser);
        var allGroups = currentWeb.get_siteGroups();
        currentContext.load(allGroups);
        var group = allGroups.getByName(groupName);
        currentContext.load(group);
        var groupUsers = group.get_users();
        currentContext.load(groupUsers);
        
        currentContext.executeQueryAsync(OnSuccess,OnFailure);

        function OnSuccess(sender, args) {
            var userInGroup = false;
            var groupUserEnumerator = groupUsers.getEnumerator();
            while (groupUserEnumerator.moveNext()) {
                var groupUser = groupUserEnumerator.get_current();
                if (groupUser.get_id() == currentUser.get_id()) {
                    userInGroup = true;
                    break;
                }
            }  
            OnComplete(userInGroup);
        }

        function OnFailure(sender, args) {
            OnComplete(false);
        }    
}




Apps.Search.checkUserGroup = function () {

  Apps.Search.IsCurrentUserMemberOfGroup("Power Users", function (isCurrentUserInGroup) {
	  if(isCurrentUserInGroup){
        Apps.Search.PowerUser = true;
      } else {
        Apps.Search.PowerUser = true; // change to true to debug edit forms
      }
  });
}





/// <reference path="../../References/JS/spDefinition.ts" />
/// <reference path="../../References/TSDefinitions/jquery/jquery.d.ts" />
/// <reference path="../../CTCore/CTCore/CT.ts" />
var Apps;
(function (Apps) {
    var ManageSubscriptions = (function () {
        function ManageSubscriptions() {
        }
        
        ManageSubscriptions.result = function ($scope, $http) {
            ManageSubscriptions.resultScope = $scope;
            $scope.parent = self;
            // A JSON string of subscriptions set as CTValue in MyPreferences list
            $scope.subscriptions = "";            
            $scope.userName = ""; // e.g. steven.martin
            $scope.userValid = false;
            var users = { 'users': ['steven.martin', 'markus.krebs', 'cameron.irvine', 'blake.crawford', 'barry.honey' ] }
        	$scope.userList = JSON.stringify(users, null,"    ");
			$scope.multiUser = false;

			$scope.toggleUserManagement = function () {
				$scope.multiUser = !$scope.multiUser;							
			};
			

			/* 
			  Query MyPreferences list by user name.  On success load their subscriptions
			*/
            $scope.getUserSubscriptions = function (callback) {

                var query = location.origin + "/_api/web/lists/GetByTitle('MyPreferences')/items";
            	query += "?$select=Id,Title,CTValue,Author/Id,Author/Title,Author/Name,Author/UserName&$expand=Author";
            	query += "&$filter=substringof('" + $scope.userName + "', Author/Name)";
            	var xhr = new CT.Ajax("GET", query);
            	xhr.run();
            
                xhr.onSuccess = function (obj) {

                    var rawData = obj.d.results;
                    
                    // if a user is found, load their subscriptions
                    if(rawData.length) {
		            	var subscriptionsArray = $scope.loadSubscriptionsFromList(rawData);
		            	$scope.subscriptions = JSON.stringify(subscriptionsArray, null,"    ");
                    } else {
                    	// else just give them the default, they are a valid user
		            	var subscriptionsArray = $scope.createSubscriptions();
		            	$scope.subscriptions = JSON.stringify(subscriptionsArray, null,"    ");                    
                    }

					// users subscriptions are loaded
                    $scope.$apply();                 
                    
                    if(callback !== undefined){
						callback();
					}
                }
            };
            
                
            $scope.resetSubscriptions = function () {
            	$scope.subscriptions = "";
            	// timeout is just to show user the subscriptions have been updated
            	setTimeout(function () {
	            	var subscriptionsArray = $scope.createSubscriptions();
	            	$scope.subscriptions = JSON.stringify(subscriptionsArray, null,"    ");
	            	$scope.$apply();         	
            	}, 500)
            };
            
            $scope.showSuccess = function () {
            	$(".subscriptions-success").fadeIn().delay(500).fadeOut();
            };

            $scope.showFail = function () {
            	$(".subscriptions-fail").fadeIn().delay(500).fadeOut();
            };
            
            
            /* 
              returns subscriptions as an array
            */
            $scope.createSubscriptions = function () {
        		// Create a static list of subscriptions. This is just the 'CTValue' copied from a user in production, 
        		// parsed from a JSON string to a Js object.
        		var CTObject = [
	        		{ "GUID": "0a8068bf-5aba-4284-a71d-9a7140911ed2", "Title": "Aurecon Methodology", "AlertMe": "No", "CreatedDt": 1425351095329, "CreatedTs": 1425351095329 },
	        		{ "GUID": "afd9901d-1617-42c2-bfa8-eebbd3cc14c7", "Title": "Build expertise", "AlertMe": "No", "CreatedDt": 1425351095330, "CreatedTs": 1425351095330 },
	        		{ "GUID": "4db05021-ec84-4c73-8b57-365d7a1f62ed", "Title": "Business development", "AlertMe": "No", "CreatedDt": 1425351095331, "CreatedTs": 1425351095331 },
	        		{ "GUID": "1e55cf8e-83df-4a13-975e-553e16640e84", "Title": "Business support", "AlertMe": "No", "CreatedDt": 1425351095332, "CreatedTs": 1425351095332 }, 
	        		{ "GUID": "4211c89e-9455-42a5-b1ee-310a208abc93", "Title": "CEO", "AlertMe": "No", "CreatedDt": 1425351095333, "CreatedTs": 1425351095333 }, 
	        		{ "GUID": "7deb5832-4679-4b08-ab63-a92addb5de96", "Title": "Culture & social responsibility", "AlertMe": "No", "CreatedDt": 1425351095334, "CreatedTs": 1425351095334 },
	        		{ "GUID": "ec358281-0fde-40d4-9240-8da9fc355086", "Title": "Deliver projects", "AlertMe": "No", "CreatedDt": 1425351095335, "CreatedTs": 1425351095335 },
	        		{ "GUID": "09de0ffe-c4ac-451f-b382-064fbe568145", "Title": "Expertise", "AlertMe": "No", "CreatedDt": 1425351095336, "CreatedTs": 1425351095336 },
	        		{ "GUID": "2445f61d-9e69-4e90-b03e-f312d5e392fc", "Title": "Implementing our strategy", "AlertMe": "No", "CreatedDt": 1425351095337, "CreatedTs": 1425351095337 },
	        		{ "GUID": "3da72575-af6f-4737-bab9-3fba1f0b90cd", "Title": "Industries", "AlertMe": "No", "CreatedDt": 1425351095338, "CreatedTs": 1425351095338 },
	        		{ "GUID": "ef38ac43-8e6f-4f8c-906d-dec703492a95", "Title": "Innovation Culture", "AlertMe": "No", "CreatedDt": 1425351095339, "CreatedTs": 1425351095339 },
	        		{ "GUID": "afc45f7a-3fe1-4c27-a773-68daaa8caa4b", "Title": "Integrity Management", "AlertMe": "No", "CreatedDt": 1425351095340, "CreatedTs": 1425351095340 },
	        		{ "GUID": "62bbe177-f7d9-48f2-8a12-570f969e9bad", "Title": "Intranet", "AlertMe": "No", "CreatedDt": 1425351095341, "CreatedTs": 1425351095341 },
	        		{ "GUID": "128f9472-b319-4ac6-865b-2c7b2b176ea4", "Title": "Service groups", "AlertMe": "No", "CreatedDt": 1425351095342, "CreatedTs": 1425351095342 },
	        		{ "GUID": "7a34b645-b404-4f44-bf23-ac2b90b47bd0", "Title": "Services", "AlertMe": "No", "CreatedDt": 1425351095343, "CreatedTs": 1425351095343 },
	        		{ "GUID": "84f96c0d-c8dd-4fb8-b579-196c393451ca", "Title": "Workday Project", "AlertMe": "No", "CreatedDt": 1425351095344, "CreatedTs": 1425351095344 }
        		]
                return CTObject;
			};
			
			$scope.setListItemId = function (id) {
				$scope.listItemID = id;
			};
			
			
            /* 
              returns subscriptions as an array
              Also sets the list item Id, so when an update occurs, it will not create a new item
            */
			$scope.loadSubscriptionsFromList = function (rawData) {
				var subscriptions = [];
				
				for (var r in rawData) {
					
					// set list item id
					var id = rawData[r].Id;
                    $scope.setListItemId(id);
                    
                    var obj = jQuery.parseJSON(rawData[r].CTValue);
                                      
                    for (var i in obj) {            
                        var subscription = { 
                            GUID: obj[i].GUID,
                            Title: obj[i].Title, 
                            AlertMe: obj[i].AlertMe, 
                            CreatedDt: obj[i].CreatedDt, 
                        	CreatedTs: obj[i].CreatedTs                              
                        };
                    	subscriptions.push(subscription);
                    }
                 }
                 
                 return subscriptions;
			};
                    

			
			$scope.getUserId = function (userName, callback) {
				var clientContext = SP.ClientContext.get_current();
			    var web = clientContext.get_web();
			    $scope.currentUser = web.ensureUser(userName);
			    clientContext.load(web);
			    clientContext.load($scope.currentUser);
			    clientContext.executeQueryAsync(function () {
			       var userid = $scope.currentUser.get_id();
			       callback(userid);
			    }, function (sender, args) {
			       console.log('failed to get the current user');
   			       callback('could not find user');
			    });	
			};

			$scope.loadUserSubscriptions = function () {
				$scope.getUser(function () {
					// get user then load their subscriptions
					$scope.getUserSubscriptions();
				});
			};


            $scope.getUser = function (callback) {
            
            	// callback for getting user id will give the id, and allow us to set the user field.
            	$scope.getUserId($scope.userName, function (id) {

					var context = new SP.ClientContext();
	             	var user = context.get_web().getUserById(id);
	             	context.load(user);
	             	
	             	context.executeQueryAsync(
				        function () {
				           	$scope.userField = user.get_id() + ";#" + user.get_loginName();
				           	$scope.userValid = true;
				            console.log($scope.userField);
		                    $scope.$apply();
		                    // now we have a valid user, get their subscriptions
		                    callback();
				        },
				        function (sender, args) {
				            console.log('Error getting user properties');
			                $scope.showFail();				            
				           	$scope.userValid = false;
		                    $scope.$apply();
				        }
				    );

            	});            
             	                	    
    		};
            
            $scope.updateSubscriptions = function () {
                if($scope.userField === undefined){
                  return;
                }

                var clientContext = new SP.ClientContext("/");
                var list = clientContext.get_web().get_lists().getByTitle("MyPreferences");
                var listItem = {};
                
	            if (typeof($scope.listItemID) === "undefined") {
	                listItem = list.addItem(new SP.ListItemCreationInformation());
	                listItem.set_item('Title', "MyPreferences");
             	} else {
                 	listItem = list.getItemById($scope.listItemID);
             	}
             	
             	// flatten json string
             	var subscriptionsArray = JSON.parse($scope.subscriptions);
             	var subscriptions = JSON.stringify(subscriptionsArray);
             	
                listItem.set_item("Author", $scope.userField);
                listItem.set_item('CTValue', subscriptions);
                listItem.update();                
                clientContext.executeQueryAsync(
                	function (sender, args) {
		                console.log('successfully updated subscriptions');
		                $scope.showSuccess();
					}, 
					function (sender, args) {
		                console.log('Request failed, adding new subscriptions');	
		                $scope.showFail();		                				
					}
				);
            };        

            
            
            $scope.resetAllUsersSubscriptions = function () {
            	var usersList = JSON.parse($scope.userList);
            	console.log(usersList.users);
            	var users = usersList.users;

				var index = 0;				
				// just doing this with a setInterval... ran out of time :(.
				var intervalID = setInterval(function() {
				    if (index == users.length) {
				        clearInterval(intervalID );
				    
				    } else {
				    	console.log(users[index]);			    
				    	$scope.setUserSubscriptions(users[index]);
				    }
				    index++;
				    
				}, 2000);
				            
            };
            
            
            $scope.setUserSubscriptions = function (userName ) {
            	$scope.userName = userName;
            	
				$scope.getUser(function () {
					// get user then load their subscriptions
					$scope.getUserSubscriptions(function () {
						$scope.updateSubscriptions();
					});
				});
            	
            }

            

        };
        return ManageSubscriptions;
    })();
    Apps.ManageSubscriptions = ManageSubscriptions;
})(Apps || (Apps = {}));





/** 
 * main.js
**/

'use strict';


var Apps = Apps || {}; 

Apps.Blog = Apps.Blog || {};

Apps.Blog.buildQuery = function (searchText) {
	if(searchText === undefined || searchText === null){
		searchText = "";
	}
	var text = ' path:"http://intranet.stg.aurecongroup.com/BuildExpertise/QAD" ContentTypeID:0x01200* owstaxIdQuestionAndDiscussionCategory:4211c89e-9455-42a5-b1ee-310a208abc93 ' + searchText;
	var select = ['Title', 'DiscussionBestAnswerID', 'DiscussionLastUpdatedDateTime', 'DiscussionPost', 'AuthorOWSUSER', 'ViewsLifeTime', 'LikesCount', 'Path', 'ReplyCount', 'BodyOWSMTXT', 'owstaxIdQuestionAndDiscussionCategory'];
	var sort = [["Created", "desc"]];
	
	var query = {
		text: text,
		select: select,
		sort: sort,
		limit: 4
	};	
	return query;
}


Apps.Blog.searchBlogPosts = function (searchText) {
	var query = Apps.Blog.buildQuery(searchText);
	CT.SP.Search.get(query).onsuccess(function(data) {
	    var rawData = CT.SP.Search.Converter(data, "news");
	    var data = Apps.Blog.parseBlogPosts(rawData);

	    Apps.Blog.blogData = data;
	    Apps.Blog.RenderBlogPosts(data);
	    Apps.Blog.hideLoader();  
	}).onfailed(function() {
		console.log("Could not retrieve blog data");
	});
}

Apps.Blog.parseBlogPosts = function (rawData) {
	var parsedData = [];
	for(var i = 0; i < rawData.length; i++){
		var item = {};
		item.title = rawData[i].Title;
		item.date = CT.Util.Date.format(rawData[i].DiscussionLastUpdatedDateTime, "d mmm yyyy");
		item.description = rawData[i].DiscussionPost.substring(0, 150);
		item.body = rawData[i].BodyOWSMTXT;
		
		if(i === 0) {
			item.image = location.origin + "/ceo-blog/PublishingImages/blog-image1.png";
		}
		if(i === 1){
			item.image = location.origin + "/ceo-blog/PublishingImages/blog-image2.png";
		}
		
		parsedData.push(item); 
	}
	return parsedData;
}

Apps.Blog.hideLoader = function () {
	document.getElementById("blog-modal").className = "modal hidden";
}

Apps.Blog.showLoader = function () {
	document.getElementById("blog-modal").className = "modal"
}

Apps.Blog.RenderBlogPosts = function (data) {
	React.render(
	  <BlogPosts data={data} />,
	  document.getElementById('blog-posts')
	);	
}

Apps.Blog.RenderTwitter = function () {
	React.render(
	  <TwitterFooter />,
	  document.getElementById('twitter-footer')
	);
	
	React.render(
	  <TwitterHeader />,
	  document.getElementById('twitter-header')
	);
}

Apps.Blog.RenderSearch = function () {
	React.render(
	  <SearchBox />,
	  document.getElementById('search-box')
	);

}

Apps.Blog.convertToHeirarchy = function (data) {
  var newData = [];	      
  var replies = [];

  for (var i = 0; i < data.length; i++) {
    if(data[i].parentId === null){
      // parent comments
      newData.push(data[i]);
    } else {
      // replies
      replies.push(data[i]);
    }
  }

  // push replies in as children
  for(var i in replies){
    for(var j in newData){
      if(newData[j].replies === undefined){
        newData[j].replies = [];
      }

      if(replies[i].parentId === newData[j].id){
        newData[j].replies.push(replies[i]);
      }
    }
  }      
  return newData;  
}


Apps.Blog.likePost = function (listId, itemId, likeStatus) {
	// List ID (without the curly-braces)
	// List item ID
	// like Status true or false
	
	EnsureScriptFunc('reputation.js', 'Microsoft.Office.Server.ReputationModel.Reputation', function () {
		var context = new SP.ClientContext("/ContentDiscussions");
		Microsoft.Office.Server.ReputationModel.Reputation.setLike(context, listId, itemId, true);		
		context.executeQueryAsync(
			function () {
			  // success update like count and like status to liked
			  //console.log("item liked");			  			  
			}, function (sender, args) {
			  //console.log("error liking page");
		});
	});
}


Apps.Blog.addComment = function (ListName, itemId, title, body) {
	// itemId comes in for replies
	
	var clientContext = new SP.ClientContext("/ContentDiscussions");
    var web = clientContext.get_web();
	var list = web.get_lists().getByTitle(ListName);
	var listItem = "";
    if (itemId === "") {
        listItem = SP.Utilities.Utility.createNewDiscussion(clientContext, list, title);
    } else {
        listItem = SP.Utilities.Utility.createNewDiscussionReply(clientContext, list.getItemById(itemId));
    }

	// update comment list
	listItem.set_item("Title", title);
    listItem.set_item("Body", body);
    listItem.set_item("IsQuestion", "false");
    listItem.set_item("SourceURL", title);
    //listItem.set_item("PageContentOwner", contentOwnerId);
    listItem.update();
    clientContext.load(listItem);
    clientContext.executeQueryAsync(Function.createDelegate(this, function(sender, args) {
    	console.log('success upating comment');
    }), Function.createDelegate(this, function(sender, args) {
    	console.log('failed to upate comment');    
    }));   
}


Apps.Blog.loadCommentsAndReplies = function (commentTitle, callback) {

	// using caml query as it is the only way to get likedBy and likeCount fields.	

	var clientContext = new SP.ClientContext('/ContentDiscussions');
    var list = clientContext.get_web().get_lists().getById("d2b5a470-48b9-474a-8918-10b90586f05f");
    var camlQuery = new SP.CamlQuery();
    var query = '<View><Query><Where><Eq>';
    	query += '<FieldRef Name=\'SourceURL\'/><Value Type=\'Text\'>' + commentTitle + '</Value></Eq>';
    	query += '</Where><OrderBy><FieldRef Name="SortOrder" Ascending="True" /></OrderBy></Query>';    	
		query += '<ViewFields>'+ '<FieldRef Name=\'Title\'/>' + '<FieldRef Name=\'Created\'/>' + '<FieldRef Name=\'Body\'/>' + '<FieldRef Name=\'ParentItemID\'/>' + '<FieldRef Name=\'LikedBy\'/>' + '<FieldRef Name=\'LikesCount\'/>' + '<FieldRef Name=\'Author\'/>' + '</ViewFields>';    	
    	query += '<RowLimit>100</RowLimit></View>';
    	
	camlQuery.set_viewXml(query);
    var listItems = list.getItems(camlQuery);
    clientContext.load(listItems);
    
	clientContext.executeQueryAsync(Function.createDelegate(this, function (sender, args) {
	    var listItemEnumerator = listItems.getEnumerator();
        var items = [];
        while (listItemEnumerator.moveNext()) {
	        var listItem = listItemEnumerator.get_current();
	        var item = { 
	        	'Title': listItem.get_item('Title'),
	        	'body': listItem.get_item('Body'),
	        	'id': listItem.get_id(),
	        	'date': listItem.get_item('Created'),
	        	'parentId': listItem.get_item('ParentItemID'),
	        	'likes': listItem.get_item('LikesCount'),
	        	'likedBy': listItem.get_item('LikedBy'),
	        	'author': listItem.get_item('Author')
	        };        
	        item.authorId = item.author.$1E_1;
	        item.author = item.author.$2e_1;
	      	item.image = Apps.Blog.userToThumbnail(item.author);
	      	item.date = CT.Util.Date.format(item.date, "d mmm yyyy")
	        
      		item.likedByYou = false;
	      	if(item.likedBy !== null){
	      		var likedByJSON = JSON.stringify(item.likedBy);
	      		if(likedByJSON.contains(User.properties.DisplayName)){
	      			item.likedByYou = true;
	      		}
	      	}
	      	// why are we using window.items
	        items.push(item);
	    }
	    
	    // have our items, now have to get replies
		var clientContext = new SP.ClientContext('/ContentDiscussions');
	    var list = clientContext.get_web().get_lists().getById("d2b5a470-48b9-474a-8918-10b90586f05f");
	    var camlQuery = new SP.CamlQuery();											                						        
	    var query = '<View Scope="Recursive"><Query><Where><Eq>';
	    	query += '<FieldRef Name=\'SourceURL\'/><Value Type=\'Text\'>' + commentTitle + '</Value></Eq>';
	    	query += '</Where><OrderBy><FieldRef Name="SortOrder" Ascending="True" /></OrderBy></Query>';    	
			query += '<ViewFields>'+ '<FieldRef Name=\'Title\'/>' + '<FieldRef Name=\'Created\'/>' + '<FieldRef Name=\'Body\'/>' + '<FieldRef Name=\'ParentItemID\'/>' + '<FieldRef Name=\'LikedBy\'/>' + '<FieldRef Name=\'LikesCount\'/>' + '<FieldRef Name=\'Author\'/>' + '</ViewFields>';    	
	    	query += '<RowLimit>100</RowLimit></View>';
		camlQuery.set_viewXml(query);
	    var listReplies = list.getItems(camlQuery);
	    clientContext.load(listReplies);
	    
		clientContext.executeQueryAsync(Function.createDelegate(this, function (sender, args) {
		    var listItemEnumerator = listReplies.getEnumerator();
	        while (listItemEnumerator.moveNext()) {
		        var listItem = listItemEnumerator.get_current();
		        var reply = { 
		        	'Title': listItem.get_item('Title'),
		        	'body': listItem.get_item('Body'),
		        	'id': listItem.get_id(),
		        	'date': listItem.get_item('Created'),
		        	'parentId': listItem.get_item('ParentItemID'),
		        	'likes': listItem.get_item('LikesCount'),
		        	'likedBy': listItem.get_item('LikedBy'),
		        	'author': listItem.get_item('Author')
		        };
		        reply.authorId = reply.author.$1E_1;
		        reply.author = reply.author.$2e_1;
		      	reply.image = Apps.Blog.userToThumbnail(reply.author);
		      	reply.date = CT.Util.Date.format(reply.date, "d mmm yyyy")
		      	
	      		reply.likedByYou = false;
		      	if(reply.likedBy !== null){
		      		var likedByJSON = JSON.stringify(reply.likedBy);
		      		if(likedByJSON.contains(User.properties.DisplayName)){
		      			reply.likedByYou = true;
		      		}
		      	}
		        
		       // push the replies to the items array, which is similar to in the REST list results
		       items.push(reply);
	    	}
	    	
	    	// fire off success callback
	        var commentsAndReplies = Apps.Blog.convertToHeirarchy(items);	    		        
	        callback(commentsAndReplies);
	    
	    }), Function.createDelegate(this, function (sender, args) {
			console.log("failed to get Discussion replies");
		}));
		
	}), Function.createDelegate(this, function (sender, args) {
		console.log("failed to get Discussion items");
	}));    	
}

Apps.Blog.userToThumbnail = function(title) {
    var title = title.toLowerCase().replace(" ","_");
	var thumbnail = "/_layouts/15/images/person.gif";               
    var testThumbnail = "http://my.dev.aurecongroup.com/User%20Photos/Profile%20Pictures/Intranet_Test_MThumb.jpg";
    if (title) {
      thumbnail = "http://my.dev.aurecongroup.com/User%20Photos/Profile%20Pictures/" + title + "_MThumb.jpg";
    }
    return thumbnail;
};


// init
Apps.Blog.RenderTwitter();
Apps.Blog.RenderSearch();
Apps.Blog.searchBlogPosts("");


// polyfill for console.log errors in IE10
/*
(function (con) {
	"use strict";
	con.log = con.profile = con.profileEnd = con.timeStamp = con.trace =
		con.debug = con.log = con.info = con.warn = con.error = con.dir = con.dirxml =
		con.group = con.groupCollapsed = con.groupEnd = con.time = con.timeEnd =
		con.assert = con.count = con.clear = function(){};
})(window.console = window.console || {});

*/







/** 
 * FullPost.jsx
**/

'use strict';

var FullPost = React.createClass({
  getInitialState: function () {
    return {
      comments: [],
      title: this.props.data[0].title.stripNonAscii()
    }
  },
  back: function(){

  	$('#full-post').hide();
  	$('#blog-posts').show();

  },
  loadComments: function() {
	
	Apps.Blog.loadCommentsAndReplies(this.state.title, function (data) {
      // now set the comments and replies state;
      // for some reason the state update seems a bit flaky updating especially on likes.
      this.setState({ comments: data });
      this.setState({ comments: data });
      this.setState({ comments: data });
	}.bind(this));
	  
  },
  likeItem: function() { 	
  	this.loadComments();
  },
  componentDidMount: function () {
 	this.loadComments();
  },
  render: function() { 
 	var nodes = this.props.data.map(function (post) {
      return (      
		<div className="full-post">      
				
		      	<div className='post-content'>
		      	
		      		<span className="ms-iconouter" onClick={this.back}>
			      	  <img src="/_layouts/15/images/spcommon.png?rev=23" className="ms-icon-back" />
			    	</span>
			    	
				    <h1 id="post-title" className="title">
			        {post.title}
			        </h1>
			        <h5 className="date">
			        {post.date}
			        </h5>
					<span className="body" dangerouslySetInnerHTML={{__html: post.body}} />
					
					<CommentBox onReload={this.loadComments} title={this.state.title} onLike={this.likeItem} data={this.state.comments} showResults={true} />		        

		        </div>
		        
		        <div id="end-comments"></div>		        
		        
        </div>
      );
    }.bind(this));
    return (
	  <div>
        {nodes}
      </div>
      
    );
  }
});

