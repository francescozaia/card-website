var ImagePreloader = (function (window, undefined){
	var ret = {},
		privateVariable = 1;

	var arrImages = new Array();
	var imagesLoaded = 0;

	function loadImage(arr, where) {
		arrImages[imagesLoaded] = new Image();
		arrImages[imagesLoaded].src = arr[imagesLoaded];
		arrImages[imagesLoaded].onload = function(){
			imagesLoaded++;
			where.appendChild(this);
			if(imagesLoaded<arr.length)
				loadImage(arr, where);
	    }
	    arrImages[imagesLoaded].onerror = function(){
	    	alert("errore");
	    }
	}
	
	function privateMethod(arr, where) {
		var arrLength = arr.length;
		loadImage(arr, where);
		where.style.width = arrLength*520 + "px";
	}

	ret.moduleProperty = 1;

	ret.moduleMethod = function (json) {
		var gallery = document.createElement("div");
 		//var newContent = document.createTextNode("Hi there and greetings!");
 		//gallery.appendChild(newContent); 
 		gallery.className = "gallerySlider";

		
		privateMethod(
			["http://24.media.tumblr.com/73df2ab210d3ef60be5ff79c4b374304/tumblr_mi8gh5oTb61qzmntao1_500.jpg",
			"http://24.media.tumblr.com/062e56d6f384b7360ce5fe3cb39db7b8/tumblr_mi8ggtUAri1qzmntao1_500.jpg",
			"http://25.media.tumblr.com/66cfcc19364de87932497734d4b63311/tumblr_mgqd8w0qhV1qzmntao1_500.jpg",
			"http://24.media.tumblr.com/73df2ab210d3ef60be5ff79c4b374304/tumblr_mi8gh5oTb61qzmntao1_500.jpg",
			"http://24.media.tumblr.com/062e56d6f384b7360ce5fe3cb39db7b8/tumblr_mi8ggtUAri1qzmntao1_500.jpg",
			"http://25.media.tumblr.com/66cfcc19364de87932497734d4b63311/tumblr_mgqd8w0qhV1qzmntao1_500.jpg"],
			gallery
		)
		document.querySelector(".gallery").appendChild(gallery);
	};

	return ret;
}(this));