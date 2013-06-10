$(function () {

    "use strict";

    /* ---------------------------------- */

    /* Events */

    $.Events = {
        LOAD: 'siteLoad',

        MOBILE_COVER: 'mobileCover',

        RESIZE: 'browserResize',
        ORIENT: 'browserOrientation',
        MOBILE: 'mobileInit',

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

    $.fn.Pioneer = function(settings) {
        var config = {};

        if (settings) {
            $.extend(config, settings);
        }

        this.each(function () {
            var $self = $(this),
                $craft = $self.find('#interlude-pioneer-craft');

            $self.bind($.Events.ARTICLE_SCROLL, function (e, distance) {
                $craft.css({width: distance});
            });
        });
        return this;
    }

    $.fn.Cover = function(settings) {
        var config = { threshold: 0, offset_scroll: 0, offset_intertia: 0 };

        if (settings) {
            $.extend(config, settings);
        }

        this.each(function () {
            var $self = $(this);
        });
        return this;
    };

    /* ---------------------------------- */

    /* Contact */

    $.fn.Contact = function(settings) {
        var config = {};

        if (settings) {
            $.extend(config, settings);
        }

        this.each(function () {
            var $self = $(this),
                active = false,
                scrollActive = 0;

            function toggleContact() {
                if (!active) {
                    active = true;
                    scrollActive = $.Window.scrollTop();
                    $.Body.triggerHandler($.Events.ABOUT);
                    $self.css({display: 'block'});
                } else {
                    active = false;
                    $self.css({display: 'none'});
                }
            }

            $.Body.bind($.Events.KEY_ESC, toggleContact);
            $.Body.bind($.Events.MODAL, function () {
                active = false;
                $self.css({display: 'none'});
            });

            $.Window.bind('scroll', function () {
                if (active && Math.abs($.Window.scrollTop() - scrollActive) > 125) {
                    active = false;
                }
                $self.css({display: 'none'});
            });
        });
        return this;
    };

    /* ---------------------------------- */

    /* Modal */

    $.fn.Modal = function(settings) {
        var config = {};

        if (settings) {
            $.extend(config, settings);
        }

        this.each(function () {
            var $self = $(this),
                $details = $('.modal-details'),
                $a = $('a[data-camera],a[data-location]'),
                offsetTop = 0;

            function displayModal($element) {
                offsetTop = $.Window.scrollTop();
                $self.removeClass().addClass($element.attr('data-modal-id')).addClass('_active');
                if ($element.attr('data-camera')) {
                    if ($element.attr('data-film')) {
                        $details.html('<ul><li><h1>Camera</h1><p>' + $element.attr('data-camera') + '</p></li><li><h1>Film</h1><p>' + $element.attr('data-film') + '</p></li></ul>');
                    } else {
                        $details.html('<ul><li><h1>Camera</h1><p>' + $element.attr('data-camera') + '</p></li><li><h1>Lens</h1><p>' + $element.attr('data-lens') + '</p></li></ul>');
                    }
                } else {
                    $details.html('<ul><li><h1>Location</h1><p>' + $element.attr('data-location') + '</p></li><li><h1>Year</h1><p>' + $element.attr('data-year') + '</p></li></ul>');
                }
            }

            function hideModal() {
                $self.removeClass('_active');
            }

            $.Body.bind($.Events.ABOUT, hideModal);

            $.Window.bind('scroll', function (e) {
                e.preventDefault();
                if ($self.hasClass('_active') && Math.abs($.Window.scrollTop() - offsetTop) > 50) {
                    hideModal();
                }
            });

            $a.bind('click', function (e) {
                e.preventDefault();
            });
            $a.bind('mouseenter', function (e) {
                $.Body.triggerHandler($.Events.MODAL);
                e.preventDefault();
                displayModal($(this));
            });
            $a.bind('mouseleave', function (e) {
                e.preventDefault();
                hideModal();
            });
        });
        return this;
    };

    /* ---------------------------------- */

    /* Keyboard */

    $.fn.Keyboard = function(settings) {
        var config = {};

        if (settings) {
            $.extend(config, settings);
        }

        function on_keydown(e) {
            var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
            e.preventDefault();
            switch (key) {
            case 13: //enter
                $.Body.triggerHandler($.Events.KEY_ENTER);
                break;
            case 27: //escape
                $.Body.triggerHandler($.Events.KEY_ESC);
                break;
            case 32: //space
                $.Body.triggerHandler($.Events.KEY_SPACE);
                break;
            case 38: //top
                $.Body.triggerHandler($.Events.KEY_UP);
                break;
            case 39: //right
                $.Body.triggerHandler($.Events.KEY_RIGHT);
                break;
            case 40: ///bottom
                $.Body.triggerHandler($.Events.KEY_DOWN);
                break;
            case 37: //left
                $.Body.triggerHandler($.Events.KEY_LEFT);
                break;
            }
        }

        this.each(function () {
            var $self = $(this);
            $.Document.bind('keydown', on_keydown);

            
        });
        return this;
    };

    $.Body = $('body');
    $.Window = $(window);
    $.Document = $(document)
    $('[data-script]').Instantiate();
    $.Body.Keyboard();

});