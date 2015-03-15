

Apps.Blog.likeItem = function (listId, itemId, likeStatus, callback) {
	// List ID (without the curly-braces)
	// List item ID
	// like Status true or false
	
	EnsureScriptFunc('reputation.js', 'Microsoft.Office.Server.ReputationModel.Reputation', function () {
		var context = new SP.ClientContext("/ContentDiscussions");
		Microsoft.Office.Server.ReputationModel.Reputation.setLike(context, listId, itemId, true);		
		context.executeQueryAsync(
			function () {
        callback();
			}, function (sender, args) {
			  console.log("error liking page");
		});
	});
}
