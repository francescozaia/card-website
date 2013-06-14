$(function () {

    "use strict";

    /* ---------------------------------- */

    /* Events */

    $.Events = {
        LOAD: 'siteLoad',

        RESIZE: 'browserResize',

        ARTICLE_SCROLL: 'articleScroll',
        ARTICLE_ENTER: 'articleEnter',
        ARTICLE_EXIT: 'articleExit',
        ARTICLE_NEXT: 'articleNext',
        ARTICLE_PREV: 'articlePrev',

        MODAL: 'modalEnter',
        ABOUT: 'modalAbout',

        KEY_ESC: 'keyEscape',
        KEY_ENTER: 'keyEnter',
        KEY_SPACE: 'keySpace',
        KEY_UP: 'keyUp',
        KEY_DOWN: 'keyDown',
        KEY_RIGHT: 'keyRight',
        KEY_LEFT: 'keyLeft'
    };

    /* ---------------------------------- */

    /* Instantiate */

    $.fn.Instantiate = function (settings) {
        var config = {};

        if (settings) {
            $.extend(config, settings);
        }

        this.each(function () {
            var $self = $(this),
                $controller = $self.attr('data-script');
            if ($self[$controller]) {
                $self[$controller]();
            }
        });
    };

    $.Body = $('body');
    $.Window = $(window);
    $.Document = $(document);

    $.Body.Keyboard();

    $('[data-script]').Instantiate();
    $('article').Article();

     /* /////////////////////////////////////////////////////////// */
    var NS = {
        successCallback: function(position) {
            NS.init(position.coords.latitude, position.coords.longitude);
        },
        errorCallback: function(error) {
            alert(":(");
            NS.init(45, 10);
        },
        init: function (lat, lon){
            var mapOptions = {
                center: new google.maps.LatLng(lat, lon),
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                streetViewControl: false,
                panControl: false,
                mapTypeControl: false,
                zoomControl: false
            };
            var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

            

            var styles = [
            {
                stylers: [
                    { hue: "#FF7BAC" },
                    { saturation: -20 }
                ]
            }, {
                featureType: "road",
                elementType: "geometry",
                stylers: [
                    { lightness: 70 },
                    { visibility: "simplified" }
                ]
            },{
                featureType: "road",
                elementType: "labels",
                stylers: [
                    { visibility: "off" }
                ]
            }, {
                featureType: "water",
                elementType : "geometry.fill",
                stylers: [
                    { color: "#56828b"}
                ]

            }
            ];
            map.setOptions({styles: styles});

        }
    }
    //navigator.geolocation.getCurrentPosition(NS.successCallback, NS.errorCallback);
});


