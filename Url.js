var Url = function () {

    var wrapSearchQuery = function (query) {
        return 'path:' + this.protocolAndDomain + "/_api/search/query?" + query;
    };

    var getParamater = function (paramaterToRetrieve) {
        var paramCheck = document.URL.indexOf("?");
        if (paramCheck != -1) {
            var params = document.URL.split("?")[1].split("&");
            var strParams = "";
            for (var i = 0; i < params.length; i = i + 1) {
                var singleParam = params[i].split("=");
                if (singleParam[0] == paramaterToRetrieve)
                    return singleParam[1];
            }
        } else {
            return null;
        }
    };

    var getAllParamaters = function () {
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
}

module.exports = Url;