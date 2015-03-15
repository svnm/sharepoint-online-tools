var List = function () {



/* get list by id CAML */

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



    /* Update item CAML query */

    var updateSubscriptions = function () {
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


    /* get list items REST */
    /* with CT.Ajax... */

    var getList = function (callback) {

        var query = location.origin + "/_api/web/lists/GetByTitle('MyPreferences')/items";
        query += "?$select=Id,Title,CTValue,Author/Id,Author/Title,Author/Name,Author/UserName&$expand=Author";
        query += "&$filter=substringof('" + $scope.userName + "', Author/Name)";
        var xhr = new CT.Ajax("GET", query);
        xhr.run();
    
        xhr.onSuccess = function (obj) {

            if(callback !== undefined){
                callback(obj.d.results);
            }
        
        }
    };



    var AddItems = function (query) {
        // lets use Client Object Model
    };

    var GetItems = function (qry, callback) {
        // lets use Client Object Model
    };

    List.updateItems = function (query) {
        // lets use Client Object Model
    };

    List.deleteItems = function (query) {
        // lets use Client Object Model
    };


}

module.exports = List;