(function(window, undefined){

	"use strict";

 	var init = function() {

		//ImagePreloader.moduleMethod("ole");
		//var photo = document.querySelector(".gallerySlider");

        window.addEventListener('load', function() {
			var m = new Delegate(document.body);
			m.on("click", ".toggleButton", function(){
				var element = document.getElementsByTagName("section")[0];
				if(element.className.split(" ").indexOf("opened") > -1) {
					element.className = "";
				} else {
					element.className = "opened";
				}
				
			})
		}, false);
	}

	init();

})(this);