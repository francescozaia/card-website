(function(window, undefined){

	"use strict";

	// [TODO: avoid window pollution]
 	var m = new Delegate(document.body);
	m.on("click", ".toggleButton", function() {
		var element = document.getElementsByTagName("section")[0];
		element.className = (element.className.split(" ").indexOf("opened") > -1) ? "" : "opened";
	})

})(this);