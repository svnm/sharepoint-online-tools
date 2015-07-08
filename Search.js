var Search = function () {

    Search.getFn = function () {
    };

    Search.get = function (query, callback) {
        $.ajax({
            url: "/_api/search/postquery",
            type: "POST",
            headers: {
                "Accept": "application/json;odata=verbose",
                "Content-Type": "application/json;odata=verbose",
                "X-RequestDigest": $("#__REQUESTDIGEST").val()
            },
            data: QueryBuilder(query),
            success: callback(data),
            error: callback(error)
        });
    };

    var QueryBuilder = function (query) {
        var requestText = { request: {} };
        if (query.text) {
            requestText.request["Querytext"] = query["text"];
        }
        if (query.select) {
            requestText.request["SelectProperties"] = { results: query["select"] };
        }
        if (query.limit) {
            requestText.request["RowLimit"] = query["limit"];
        }
        if (query.sort) {
            var sort = [];
            for (var x in query.sort) {
                sort.push({ Property: query.sort[x][0], Direction: (query.sort[x][1] === "asc" ? 0 : 1) });
            }
            requestText.request["SortList"] = { results: sort };
        }
        return JSON.stringify(requestText);
    };

    var Converter = function (d) {
        var arr = [];
        var data = d["d"]["postquery"]["PrimaryQueryResult"]["RelevantResults"]["Table"]["Rows"]["results"];
        for (var d in data) {
            var cells = data[d]["Cells"]["results"];
            var obj = {};
            for (var c in cells) {
                var key = cells[c].Key;
                var value = cells[c].Value;
                obj[key] = value;
            }
            arr.push(obj);
        }
        return arr;
    };


module.exports = Search;