var List = function () {

    var GetAllItemsByListId = function(listId, fields, callback) {

        var clientContext = new SP.ClientContext.get_current();
        var list = clientContext.get_web().get_lists().getById(listId); // TODO: Or title?
        var listItems = list.getItems('');
        clientContext.load(listItems);   

        clientContext.executeQueryAsync(
            function (sender, args) {
                var listItemEnumerator = listItems.getEnumerator();
                var items = [];

                while (listItemEnumerator.moveNext()) {
                    var listItem = listItemEnumerator.get_current();
                    var item = {};            
                    item.id = listItem.get_id(),
                    item.created = listItem.get_item('Created'),
                    item.author = listItem.get_item('Author')
                    item.authorId = item.author.$1E_1;
                    item.author = item.author.$2e_1;

                    // additional user specified fields            
                    for(var i = 0; i < fields.length; i++){
                        item[fields[i]] = listItem.get_item(fields[i])
                    }
                    items.push(item);
                }

                callback(items);
            }, 
            function (sender, args) {
                console.log("failed to get items from list");    
            }
        );

    }


    var updateListItemByTitle = function (listTitle, results, listItemId, callback) {

        // results is an array of fields and values

        var clientContext = new SP.ClientContext();
        var list = clientContext.get_web().get_lists().getByTitle(listTitle);
        var listItem = list.getItemById(listItemId);
        
        for(var i = 0; i < results.length; i++){
            results.set_item(results[i].field, results[i].value);
            // e.g. listItem.set_item("Title", "this is a new title");
        }

        listItem.update();                
        clientContext.executeQueryAsync(
            function (sender, args) {
                callback(true);
            }, 
            function (sender, args) {
                callback(false);
            }
        );
    };        


    var AddItems = function (query) {
        // lets use Client Object Model
    };

    var deleteItems = function (query) {
        // lets use Client Object Model
    };


}

module.exports = List;