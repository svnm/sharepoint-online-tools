(function () {
	
	'use strict';

	var context = SP.ClientContext.get_current();
	var user = context.get_web().get_currentUser();

	// This code runs when the DOM is ready and creates a context object which is 
	// needed to use the SharePoint object model
	$(document).ready(function () {
		getUserName();
		getHostWebTitle();
	});

	// This function prepares, loads, and then executes a SharePoint query to get 
	// the current users information
	function getUserName() {
		context.load(user);
		context.executeQueryAsync(function () {
			$('#message').text('Hello ' + user.get_title());			
		}, function () {
			console.log('Failed to get user name. Error:' );			
		});
	}
	
    //Get SPHostUrl
	function getHostUrl () {
        var args = window.location.search.substring(1).split("&");
        var spHostUrl = "";
        for (var i = 0; i < args.length; i++) {
            var n = args[i].split("=");
            if (n[0] == "SPHostUrl")
                spHostUrl = decodeURIComponent(n[1]);
        }
		return spHostUrl;				
	}
	
    //Get AppWebUrl
	function getAppWebUrl () {
        var appWebUrl = "";
		var args = window.location.search.substring(1).split("&");
        for (var i = 0; i < args.length; i++) {
            var n = args[i].split("=");
            if (n[0] == "SPAppWebUrl")
                appWebUrl = decodeURIComponent(n[1]);
		}
		return appWebUrl;
	}

	// Get Host web title
	function getHostWebTitle() {
		var spHostUrl = getHostUrl();
        var appWebUrl = getAppWebUrl();

        //Load Libraries
        var scriptbase = spHostUrl + "/_layouts/15/";
		var list = "Links";		

        jQuery.getScript(scriptbase + "MicrosoftAjax.js").then(function (data) {
            return jQuery.getScript(scriptbase + "SP.Runtime.js");
        }).then(function (data) {
            return jQuery.getScript(scriptbase + "SP.js");
        }).then(function (data) {
            return jQuery.getScript(scriptbase + "SP.RequestExecutor.js");
        }).then(function (data) {

			var executor = new SP.RequestExecutor(appWebUrl);
			executor.executeAsync(
			        {
			            url:
			                appWebUrl +
			                "/_api/SP.AppContextSite(@target)/web/lists/getByTitle('" + list + "')/items?$select=Title&@target='" +
			                spHostUrl + "'",
			            method: "GET",
			            headers: { "Accept": "application/json; odata=verbose" },
			            success: function (data) {
							console.log('success');
						},
			            error: function (data) {
							console.log('fail');
						}
			        }
			    );

        });

	}
	


}());
