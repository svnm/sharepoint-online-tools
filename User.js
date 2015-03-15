var User = function(callback) {

    var UserProfiles = {};

    var getUserProperties = function () {

        $.ajax({
            url: "/_api/SP.UserProfiles.PeopleManager/GetMyProperties",
            type: "GET",
            headers: {
                "Accept": "application/json;odata=verbose",
                "Content-Type": "application/json;odata=verbose",
                "X-RequestDigest": $("#__REQUESTDIGEST").val()
            },
            success: function(data) {
                var results = data.d.UserProfileProperties.results;
                for (var r in results) {
                    var key = results[r].Key;
                    var value = results[r].Value;
                    data.d[key] = value;
                }

                callback(data.d)
            },
            error: function(error) {
                callback(error);
            }
        });

    }



    
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


    $scope.getUserByName = function (callback) {
    
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




    return User;
}

module.exports = User;