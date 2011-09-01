Zotero.ItemSelector = {
	
	getSelectedItems: function() {
	this.alertItems(Zotero.getActiveZoteroPane().getSelectedItems());
	},

	alertItems: function(items) {
	var results =  items.length + " items Selected\n"
		for (i in items) {
		var item = items[i]
		results = results +  "* " + item.getField('title') + "\n";
		}
	alert(results);
	},
	

	getCollectionItems: function() {
	var collection= Zotero.getActiveZoteroPane().getSelectedCollection();
	var items = collection.getChildItems();
	this.alertItems(items);
	},

	helloWorld: function() {
	alert ("Hello World");
	},

};





