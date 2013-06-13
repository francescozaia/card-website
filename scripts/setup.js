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
    //$('article').Article();

});