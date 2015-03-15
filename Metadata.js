var Metadata = function(MetadataService, parent, name) {
        var termSet = {};

        if (typeof MetadataService !== "undefined" && typeof parent !== "undefined") {
            (isAtGroupLevel == true) ? this.getTermSets(this.GUIDParent, this) : this.getFirstTerm(this.GUIDParent, this);
        } else {
            console.log("Please pass the correct metadata fields");
        }
    }

    var getTerms = function(QueryID, self) {
        self.termSet['name'] = self.name;
        self.termSet['id'] = QueryID;
        self.termSet['child'] = [];
        var XHR = new XMLHttpRequest();
        this.query = '{"sspId":"' + this.SSPIDManagedMetadataService + '","lcid":1033,"includeDeprecated":true,"includeNoneTaggableTermset":true,"webId":"00000000-0000-0000-0000-000000000000","listId":"00000000-0000-0000-0000-000000000000","guid":"' + QueryID + '","termsetId":"' + QueryID + '","includeCurrentChild":true,"currentChildId":"00000000-0000-0000-0000-000000000000","pagingForward":true,"pageLimit":100}';
        this.url = document.location.protocol + "//" + document.location.host + "/_vti_bin/taxonomyinternalservice.json/GetTermSets";
        XHR.open("POST", this.url, true);
        XHR.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        XHR.setRequestHeader("X-RequestDigest", $("#__REQUESTDIGEST").val());
        XHR.onreadystatechange = function() {
            if (XHR.readyState == 4 && XHR.status == 200) {
                var obj = jQuery.parseJSON(XHR.responseText);
                var results = obj.d.Content;
                for (var result in results) {
                    var child = {
                        name: results[result].Nm.replace(/＆/gi, "&"),
                        id: results[result].Id
                    };
                    self.termSet.child.push(child); {
                        self.getFirstTermForRoot(results[result].Id, child);
                    }
                }
                self.connectionThread--;
            }
        };
        XHR.send(this.query);
        this.connectionThread++;
    };
}

module.exports = Metadata;