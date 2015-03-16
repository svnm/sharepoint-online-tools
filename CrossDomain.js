var CrossDomain = function () {

	var context = SP.ClientContext.get_current();
	var user = context.get_web().get_currentUser();

	/* example use 
	$(document).ready(function () {
		getUserName();
		getListData();
	});
*/

	function getUserName() {
		context.load(user);
		context.executeQueryAsync(function () {
			console.log('Hello ' + user.get_title());	
		}, function () {
			console.log('Failed to get user name. Error:' );			
		});
	}
	
	function getHostUrl () {
    var args = window.location.search.substring(1).split("&");
    var spHostUrl = "";
    for (var i = 0; i < args.length; i++) {
        var n = args[i].split("=");
        if (n[0] == "SPHostUrl") spHostUrl = decodeURIComponent(n[1]);
    }
		return spHostUrl;				
	}
	

	function getAppWebUrl () {
    var appWebUrl = "";
		var args = window.location.search.substring(1).split("&");
    for (var i = 0; i < args.length; i++) {
        var n = args[i].split("=");
        if (n[0] == "SPAppWebUrl") appWebUrl = decodeURIComponent(n[1]);
		}
		return appWebUrl;
	}


	function getListData(listName, callback) {
		var spHostUrl = getHostUrl();
    var appWebUrl = getAppWebUrl();
    var scriptbase = spHostUrl + "/_layouts/15/";

    jQuery.getScript(scriptbase + "MicrosoftAjax.js").then(function (data) {
        return jQuery.getScript(scriptbase + "SP.Runtime.js");
    }).then(function (data) {
        return jQuery.getScript(scriptbase + "SP.js");
    }).then(function (data) {
        return jQuery.getScript(scriptbase + "SP.RequestExecutor.js");
    }).then(function (data) {

			var executor = new SP.RequestExecutor(appWebUrl);
			executor.executeAsync({
        url: appWebUrl + "/_api/SP.AppContextSite(@target)/web/lists/getByTitle('" + listName + "')/items?$select=Title&@target='" +
            spHostUrl + "'",
        method: "GET",
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
        	callback(data.d.results);
				},
				error: function (data) {
					callback('failed to retrieve data from the list');
				}
			});

    });
	}

	
}

module.exports = CrossDomain;