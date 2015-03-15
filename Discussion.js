

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
