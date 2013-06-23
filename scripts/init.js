yepnope([{
    load: '//ajax.googleapis.com/ajax/libs/jquery/2.0.2/jquery.min.js',
    complete: function () {

        "use strict";
        if (!window.jQuery) yepnope('./scripts/libs/jquery-2.0.2.min.js');
    }
}, {
    load: ["./scripts/setup.js", "./scripts/libs/d3.v3.min.js", "./scripts/d3setup.js"],
    complete: function () {
        $.Android = (navigator.userAgent.match(/Android/i));
        $.iDevices = ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/iPad/i)));
        if($.iDevices || $.Android)
            yepnope(["./stylesheets/mobile.css", "./scripts/mobile.js"]);
    }
}]);
