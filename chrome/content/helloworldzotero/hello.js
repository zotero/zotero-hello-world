Zotero.HelloWorldZotero = function() {
	this.DB = null;
};

Zotero.HelloWorldZotero.init = async function() {
	// Connect to (and create, if necessary) helloworld.sqlite in the Zotero directory
	this.DB = new Zotero.DBConnection("helloworld");

	let tableExists = await this.DB.tableExists("changes");
	if (!tableExists) {
		Zotero.log("Creating Table");
		this.DB.queryAsync("CREATE TABLE changes (num INT)");
		this.DB.queryAsync("INSERT INTO changes VALUES (0)");
	}

	// Register the callback in Zotero as an item observer
	let obsID = Zotero.Notifier.registerObserver(this.notifierCallback, ["item"]);

	
	window.addEventListener("unload", function(e) {
		// Unregister callback when the window closes (important to avoid a memory leak)
		Zotero.Notifier.unregisterObserver(obsID);

		//Close database connection to allow graceful shutdown of Zotero
		Zotero.HelloWorldZotero.DB.closeDatabase();
	}, false);

};

Zotero.HelloWorldZotero.insertHello = async function() {

	// Create a new Item and add it to the currently selected Collection
	let pane = Zotero.getActiveZoteroPane();
	let collection = pane.getSelectedCollection();
	
	let item = new Zotero.Item("computerProgram");
	item.libraryID = collection.libraryID;
	item.setCollections([collection.id])

	item.setCreators(
		[
			{
				firstName: "Dan",
				lastName: "Stillman",
				creatorType: "programmer"
			},
			{
				firstName: "Simon",
				lastName: "Kornblith",
				creatorType: "programmer"
			}
		]
	);
	item.setField("title", "Zotero");
	item.setField("url", "http://www.zotero.org");
	item.setField("place", "Fairfax, VA");
	item.setField("version", "5.0.95");
	item.setField("company", "Center for History and Media");

	// Save Item to Zotero and make sure the coroutine is completed
	await item.saveTx();

};


// Callback implementing the notify() method to pass to the Notifier
Zotero.HelloWorldZotero.notifierCallback = {
	notify: function(event, type, ids, extraData) {
		if (event == 'add' || event == 'modify' || event == 'delete') {
			// Increment a counter every time an item is changed
			Zotero.HelloWorldZotero.DB.queryAsync("UPDATE changes SET num = num + 1");
			
			if (event != 'delete') {
				// Retrieve the added/modified items as Item objects
				var items = Zotero.Items.get(ids);
			} else {
				var items = extraData;
			}

			// Loop through array of items and grab titles
			let titles = [];
			for (let item of items) {
				// For deleted items, get title from passed data
				if (event == 'delete') {
					titles.push(item.old.title ? item.old.title : '[No title]');
				} else {
					titles.push(item.getField('title'));
				}
			}

			if (!titles.length){
				return;
			}
			
			// Get the localized string for the notification message and
			// append the titles of the changed items
			var stringName = 'notification.item' + (titles.length==1 ? '' : 's');
			switch (event) {
				case 'add':
					stringName += "Added";
					break;
				
				case 'modify':
					stringName += "Modified";
					break;

				case 'delete':
					stringName += "Deleted";
					break;
			}

			var str  = document.getElementById("hello-world-zotero-strings").getFormattedString(stringName, [titles.length]) + ":\n\n" +
			 			titles.join("\n");
		}

		var ps = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
				 .getService(Components.interfaces.nsIPromptService);
		ps.alert(null, "", str);
	}
};

// Initialize the utility
window.addEventListener('load', function(e) { Zotero.HelloWorldZotero.init(); }, false);
