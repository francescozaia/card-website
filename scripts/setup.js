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

        KEY_ESC: 'keyEscape',
        KEY_UP: 'keyUp',
        KEY_DOWN: 'keyDown',

        GO_TO_WEBDEVELOPMENT: 'webdevelopment',
        GO_TO_PHOTOGRAPHY: 'photography'
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

    /* ---------------------------------- */

    /* Article */

    $.fn.Article = function () {
        var articleElements = this,
            HEIGHTS = [],
            runningHeight = 0,
            articleIssue = $.Body.attr('data-issue'),
            articleLength = this.length,
            articleActive = 0,
            articleActive_figure = 0;

        /* ---------------------------------- */

        function figureChildren() {
            var $f = {};
            articleElements.each(function (index) {
                if (index === articleActive) {
                    $f = $(this).find('figure ul').children();
                }
            });
            return $f;
        }

        function on_seek(seekdataindex) {
            $.Body.stop().animate({scrollTop: HEIGHTS[seekdataindex].min}, "slow");
        }

        function on_next(e) {
            e.preventDefault();
            articleActive = articleActive + 1;
            if (articleActive >= articleLength) {
                articleActive = articleLength - 1;
            }
            on_seek(articleActive);
        }

        function on_prev(e) {
            e.preventDefault();
            articleActive = articleActive - 1;
            if (articleActive < 0) {
                articleActive = 0;
            }
            on_seek(articleActive);
        }

        function on_keynext(e) {
            e.preventDefault();
            var $figure_children = figureChildren();
            if ($figure_children.length > 1) {
                articleActive_figure = articleActive_figure + 1;
                if (articleActive_figure < $figure_children.length) {
                    $figure_children.each(function (i) {
                        if (i === articleActive_figure) {
                            $.Body.stop().animate({
                                scrollTop: HEIGHTS[articleActive].min + $(this).height() * i
                            }, "slow");
                        }
                    });
                } else {
                    articleActive_figure = 0;
                    on_next(e);
                }
            } else {
                articleActive_figure = 0;
                on_next(e);
            }
        }

        function on_keyprev(e) {
            e.preventDefault();
            var $figure_children = figureChildren();
            if ($figure_children.length > 1) {
                articleActive_figure = articleActive_figure - 1;
                if (articleActive_figure >= 0) {
                    $figure_children.each(function (i) {
                        if (i === articleActive_figure) {
                            $.Body.stop().animate({scrollTop: HEIGHTS[articleActive].min + $(this).height() * i}, "slow");
                        }
                    });
                } else {
                    articleActive_figure = 0;
                    on_prev(e);
                }
            } else {
                articleActive_figure = 0;
                on_prev(e);
            }
        }

        function setBodyHeight() {
            $.Body.css({height: runningHeight});
        }

        function on_resize() {
            runningHeight = 0;
            articleElements.triggerHandler($.Events.RESIZE);
            setBodyHeight();
        }

        function on_gotophotography() {
            on_seek(1);
        }
        function on_gotowebdevelopment() {
            on_seek(5);
        }

        $.Body
            .on($.Events.ARTICLE_NEXT, on_next)
            .on($.Events.ARTICLE_PREV, on_prev)
            .on($.Events.KEY_DOWN, on_keynext)
            .on($.Events.KEY_UP, on_keyprev);

        $.Body
            .on($.Events.GO_TO_PHOTOGRAPHY, on_gotophotography)
            .on($.Events.GO_TO_WEBDEVELOPMENT, on_gotowebdevelopment);

        $.Window
            .on('resize', on_resize);


        /* ---------------------------------- */

        this.each(function (index) {

            var $self = $(this),
                $figure = $self.find('figure'),
                $figure_children = $figure.children(),
                $column = $self.find('.gallery-description'),
                $header = $self.find('header'),
                view = '',
                articleActive_figure = 0,
                withFullscreenImage = $self.hasClass('with-fullscreen-image'),
                dataindex = index,
                fixedHeight = $self.attr('data-height'),
                columnHeight = $column ? $column.height() : 0,
                figureHeight = $figure ? $figure.height() : 0,
                imageRatio = 2 / 3;

            function theFixheight(fixedHeight, sW) {
                if (imageRatio * sW <= 1200) {
                    return 1200;
                }
                if (imageRatio * sW > 1200) {
                    return imageRatio * sW;
                }
                return parseInt(fixedHeight, 10);
            }
            function theSelfHeight() {
                var sH = $.Window.height(),
                    sW = $.Window.width();
                if (fixedHeight) {
                    return theFixheight(fixedHeight, sW, sH);
                }
                return columnHeight + 50 < sH ? sH : columnHeight + 50;
            }
            function theheight() {
                var winHeight = (columnHeight + 50 < $.Window.height()) ? $.Window.height() : columnHeight + 50,
                    sW = $.Window.width();
                if (fixedHeight) {
                    return theFixheight(fixedHeight, sW);
                }
                return figureHeight + winHeight;
            }

            function sizeFunction() {

                columnHeight = $column ? $column.height() : 0;
                figureHeight = $figure ? $figure.height() : 0;

                HEIGHTS[index] = {
                    min: runningHeight,
                    max: runningHeight + theheight()
                };

                runningHeight += theheight();

                if (withFullscreenImage) {
                    $header.css({
                        top: theSelfHeight() < $.Window.height() ? theSelfHeight() / 2 : $.Window.height() / 2
                    });

                    $self.children("img.fullscreen-image").css({
                        left: -(theSelfHeight()/imageRatio - $.Window.width()) / 2
                    });

                }

                //if (!isMobile || ($figure.length === 0)) {
                if (!isMobile || ($figure.length === 0)) {
                    $self.css({
                        height: theSelfHeight(),
                        overflow: 'hidden',
                        zIndex: 1000 - dataindex
                    });
                    $figure.css({
                        height: figureHeight
                    });
                } else {
                    
                }
            }

            function view_status(sTop) {

                var location = HEIGHTS[dataindex];
                if (sTop > location.min && sTop <= location.max) {
                    if (!$self.hasClass('_inview')) {
                        $self.addClass('_inview');
                        if ($self.hasClass('interlude')) {
                            D3()
                        }
                    }
                    return (sTop >= location.min + figureHeight) ? "page" : "inview";
                } else {
                    if ($self.hasClass('_inview')) {
                        $self.removeClass('_inview');
                    }
                }

                if (sTop <= location.min - $.Window.height()) {
                    return 'outofview';
                }

                if (sTop <= location.min) {
                    return 'below';
                }

                if (sTop > location.max) {
                    return 'above';
                }

            }

            function on_scroll(event) {
                var sTop = $.Window.scrollTop(),
                    location = HEIGHTS[dataindex],
                    vS = view_status(sTop);

                switch (vS) {
                case "page":
                    $self.css({ marginTop: -(sTop - (location.min + figureHeight)), display: 'block' });
                    $figure.css({ marginTop: -(sTop - location.min) });
                    $self.triggerHandler($.Events.ARTICLE_SCROLL, sTop - location.min);
                    break;
                case "inview":

                    $figure.css({ marginTop: -(sTop - location.min) });
                    if (view !== vS) {
                        $self.css({ marginTop: 0, display: 'block' });
                    }
                    $self.triggerHandler($.Events.ARTICLE_SCROLL, sTop - location.min);
                    break;
                case "above":
                    if (view !== vS) {
                        $figure.css({ marginTop: -figureHeight - 25 });
                        $self.css({ marginTop: -theheight() - 25, display: 'none' });
                        $self.triggerHandler($.Events.ARTICLE_SCROLL, sTop - location.min);
                    }
                    break;
                case "outofview":
                    if (view !== vS) {
                        $self.triggerHandler($.Events.ARTICLE_SCROLL, 0);
                        $figure.css({ marginTop: 0 });
                        $self.css({ marginTop: 0, display: 'none' });
                    }
                    break;
                default:
                    if (view !== vS) {
                        $self.triggerHandler($.Events.ARTICLE_SCROLL, 0);
                        $figure.css({ marginTop: 0 });
                        $self.css({ marginTop: 0, display: 'block' });
                    }
                    break;
                }
                view = vS;
            }


            $.Android = (navigator.userAgent.match(/Android/i));
            $.iDevices = ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/iPad/i)));
            var isMobile = ($.iDevices || $.Android) ? true : false;

            articleElements.on($.Events.RESIZE, sizeFunction);

            sizeFunction();

            $(".load-overlay").fadeOut("fast", function() {
                $(this).hide();
                $(this).remove();
            });

            if(!isMobile) {
                $.Window.on('scroll', on_scroll);
                setBodyHeight();
            }

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
            
            switch (key) {
            case 27: //escape
                e.preventDefault();
                $.Body.triggerHandler($.Events.KEY_ESC);
                break;
            case 38: //top
                e.preventDefault();
                $.Body.triggerHandler($.Events.KEY_UP);
                break;
            case 40: ///bottom
                e.preventDefault();
                $.Body.triggerHandler($.Events.KEY_DOWN);
                break;
            }
        }

        this.each(function () {
            var $self = $(this);
            $.Document.bind('keydown', on_keydown);

        });
        return this;
    };

    /* ---------------------------------- */

    /* About */

    $.fn.About = function(settings) {
        var config = {};

        if (settings) {
            $.extend(config, settings);
        }

        this.each(function () {
            var $self = $(this),
                active = false,
                scrollActive = 0;

            $.Body.bind($.Events.KEY_ESC, function () {
                if (!active) {
                    active = true;
                    scrollActive = $.Window.scrollTop();
                    $self.css({display: 'block'});
                } else {
                    active = false;
                    $self.css({display: 'none'});
                }
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

    $.Body = $('body');
    $.Window = $(window);
    $.Document = $(document);

    $.Body.Keyboard();

    $('[data-script]').Instantiate();
    $('article').Article();

    


    function supportsTransitions() {
        var s = document.body.style || document.documentElement.style,
            p = 'transition',
            v = ['Moz', 'Webkit', 'Khtml', 'O', 'ms'],
            i = 0;

        if (typeof s[p] === 'string') {
            return true;
        }

        // Tests for vendor specific prop
        p = p.charAt(0).toUpperCase() + p.substr(1);
        for (i = 0; i < v.length; i++) {
            if (typeof s[v[i] + p] === 'string') {
                return true;
            }
        }
        return false;
    }

    window.setTimeout(function (event) {

        var $target = $(".keyboard-animation"),
            $text = $(".text-animation"),
            margin = 50;

        if (supportsTransitions()) {
            $target.css({
                marginTop: margin,
                opacity: 1
            });
            window.setTimeout(function () {
                $text.css({
                    opacity: 1
                });
            }, 1000);
        } else {
            $target.animate({
                marginTop: margin,
                opacity: 1
            }, 1000, function () {
                $text.animate({
                    opacity: 1
                });
            });
        }

    }, 2000);

    $(".section-photography").on("click", function (event) {
        event.preventDefault();
        $.Body.triggerHandler($.Events.GO_TO_PHOTOGRAPHY);
    });
    $(".section-webdevelopment").on("click", function (event) {
        event.preventDefault();
        $.Body.triggerHandler($.Events.GO_TO_WEBDEVELOPMENT);
    });
    $(".gallery-list ul").on("mouseover", "li[itemprop='photography']", function (event) {
        $(this).children("figcaption").animate({opacity: 1}, 200);
    }).on("mouseout", "li[itemprop='photography']", function (event) {
        $(this).children("figcaption").animate({opacity: 0}, 200);
    })
});