(function(window, undefined){

	"use strict";

 	var init = function() {

		ImagePreloader.moduleMethod("ole");
		var photo = document.querySelector(".gallerySlider");

        window.addEventListener('load', function() {
			var m = new Delegate(document.body);
			m.on("click", "#toggle", function(){
				if(document.getElementsByTagName("nav")[0].className.split(" ").indexOf("opened") > -1) {
					document.getElementsByTagName("nav")[0].className = "";
				} else {
					document.getElementsByTagName("nav")[0].className = "opened";
				}
				
			})
		}, false);
	}

	init();

})(this);