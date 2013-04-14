(function(window, undefined){
	var navigation = responsiveNav("#nav", {customToggle: "#toggle"});

	

 	var init = function() {

		ImagePreloader.moduleMethod("ole");
		var photo = document.querySelector(".gallerySlider");
		var tween = new TWEEN.Tween( { scrollLeft: 50, y: 0 } )
		    .to( { scrollLeft: -1200 }, 2000 )
		    .easing( TWEEN.Easing.Quartic.InOut )
		    .onUpdate( function () {

		        //photo.style.scrollLeft = this.x + 'px';

		    } )
		    .start();
	}

	var animate = function() {
	    window.requestAnimationFrame( animate ); // js/RequestAnimationFrame.js needs to be included too.
	    //TWEEN.update();
	}

	init();
	animate();

})(this);