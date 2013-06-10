$(function () {

    "use strict";

    /* ---------------------------------- */

    /* Articles */

    $.fn.Articles = function (settings) {
        var config = {};
        if (settings) {
            $.extend(config, settings);
        }
        this.each(function () {
            var $self = $(this),
                $articles = $self.find('article');
            $articles.Article();
        });
        return this;
    };

    /* Article */

    $.fn.Article = function () {
        var $parent = this,
            HEIGHTS = [],
            runningHeight = 0,
            articleIssue = $.Body.attr('data-issue'),
            articleLength = this.length,
            enumeratedArticles = 0,
            articleActive = 0,
            articleActive_figure = 0;

        /* ---------------------------------- */

        function figureChildren() {
            var $f = {};
            $parent.each(function (index) {
                if (index === articleActive) {
                    $f = $(this).find('figure').children();
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



        function on_enter(e, issue, id, index) {
            //articleActive = index;
        }

        function setBodyHeight() {
            $.Body.css({height: runningHeight});
        }

        function on_resize() {
            runningHeight = 0;
            $parent.triggerHandler($.Events.RESIZE);
            setBodyHeight();
        }

        function on_orientation_change() {
            var orientation = window.orientation;
            $parent.triggerHandler($.Events.ORIENT, orientation);
        }

        $.Body
            .on($.Events.ARTICLE_NEXT, on_next)
            .on($.Events.ARTICLE_PREV, on_prev)
            .on($.Events.ARTICLE_ENTER, on_enter)
            .on($.Events.KEY_RIGHT, on_keynext)
            .on($.Events.KEY_DOWN, on_keynext)
            .on($.Events.KEY_LEFT, on_keyprev)
            .on($.Events.KEY_UP, on_keyprev);

        $.Window
            .on('resize', on_resize);

        window.onorientationchange = on_orientation_change;

        /* ---------------------------------- */

        this.each(function (index) {

            var $self = $(this),
                $figure = $self.find('figure'),
                $figure_children = $figure.children(),
                $column = $self.find('.column'),
                $header = $self.find('header'),
                $numeral = $self.find('.numeral'),
                $extras = $self.find('.modal-extras'),
                $videos = $self.find('[data-video]'),
                view = '',
                articleActive_figure = 0,
                dataid = $self.attr('data-google'),
                titlePage = $self.hasClass('title-page'),
                chapter = $self.hasClass('chapter'),
                fullscreen = $self.hasClass('fullscreen'),
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

                if (chapter) {
                    $header.css({top: theSelfHeight() < $.Window.height() ? theSelfHeight() / 2 : $.Window.height() / 2});
                    $extras.css({top: theSelfHeight() < $.Window.height() ? theSelfHeight() / 2 : $.Window.height() / 2});
                }
                $figure.css({height: figureHeight});
                $self.css({height: theSelfHeight(), overflow: 'hidden', zIndex: 1000 - dataindex});
            }

            $parent.on($.Events.RESIZE, sizeFunction);
            $parent.on($.Events.ORIENT, sizeFunction);

            sizeFunction();

            if (!titlePage) {
                enumeratedArticles = enumeratedArticles + 1;
                $numeral.html('No. ' + enumeratedArticles);
            }

            function view_status(sTop) {

                var location = HEIGHTS[dataindex];
                if (sTop > location.min && sTop <= location.max) {
                    if (!$self.hasClass('_inview')) {
                        $self.addClass('_inview');
                        $.Body.triggerHandler($.Events.ARTICLE_ENTER, [articleIssue, dataid, index]);
                    }
                    return (sTop >= location.min + figureHeight) ? "page" : "inview";
                } else {
                    if ($self.hasClass('_inview')) {
                        $self.removeClass('_inview');
                    }
                }

                if (sTop <= location.min - $.Window.height()) {
                    $self.triggerHandler($.Events.ARTICLE_EXIT, [articleIssue, dataid, index]);
                    return 'outofview';
                }

                if (sTop <= location.min) {
                    return 'below';
                }

                if (sTop > location.max) {
                    $self.triggerHandler($.Events.ARTICLE_EXIT, [articleIssue, dataid, index]);
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


            $.Window.on('scroll', on_scroll);

            /*

            function _keyright(e) {
                e.preventDefault();
                if (articleActive == index) {
                    if ($figure_children.length > 1) {
                        articleActive_figure++;
                        if (articleActive_figure < $figure_children.length) {
                            $figure_children.each(function (i) {
                                if (i == articleActive_figure) {
                                    $.Body.stop().animate({
                                            scrollTop: $(this).offset().top - 250
                                        }, "slow")
                                }
                            })
                        } else {
                            articleActive_figure = 0;
                            setTimeout(function () {
                                $.Body.triggerHandler($.Events.ARTICLE_NEXT)
                            }, 100)
                        }
                    } else {
                        articleActive_figure = 0;
                        setTimeout(function () {
                            $.Body.triggerHandler($.Events.ARTICLE_NEXT)
                        }, 100)
                    }
                }
            }

            function _keyleft(e) {
                e.preventDefault();
                if (articleActive == index) {
                    if ($figure_children.length > 1) {
                        articleActive_figure--;
                        if (articleActive_figure >= 0) {
                            $figure_children.each(function (i) {
                                if (i == articleActive_figure) {
                                    $.Body.stop().animate({
                                            scrollTop: $(this).offset().top - 250
                                        }, "slow")
                                }
                            })
                        } else {
                            articleActive_figure = 0;
                            setTimeout(function () {
                                $.Body.triggerHandler($.Events.ARTICLE_PREV)
                            }, 100)
                        }
                    } else {
                        articleActive_figure = 0;
                        setTimeout(function () {
                            $.Body.triggerHandler($.Events.ARTICLE_PREV)
                        }, 100)
                    }
                }
            }

            */
        });

        setBodyHeight();

        return this;
    };

});