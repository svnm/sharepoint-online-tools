/* example use

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
    }).onfailed(function() {
        console.log("Could not retrieve blog data");
    });
}

Apps.Blog.parseBlogPosts = function (rawData) {
    var parsedData = [];
    for(var i = 0; i < rawData.length; i++){
        var item = {};
        item.title = rawData[i].Title;
        item.date = Date.format(rawData[i].DiscussionLastUpdatedDateTime, "d mmm yyyy");
        item.description = rawData[i].DiscussionPost.substring(0, 150);
        item.body = rawData[i].BodyOWSMTXT;             
        parsedData.push(item); 
    }
    return parsedData;
}

*/



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