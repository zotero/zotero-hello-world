// Only create main object once
const loader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"]
	.getService(Components.interfaces.mozIJSSubScriptLoader);
if (!Zotero.HelloWorldZotero) {
	loader.loadSubScript("chrome://helloworldzotero/content/hello.js");
}
if (!Zotero.ItemSelector) {
	loader.loadSubScript("chrome://helloworldzotero/content/itemselector.js");
}
