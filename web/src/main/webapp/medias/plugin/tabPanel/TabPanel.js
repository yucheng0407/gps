var ___tab_content_num = 0;
Fader = function (config) {
    this.element = config.element;
    this.elementID = config.elementID;
    this.style = config.style;
    this.num = config.num;
    this.maxMove = config.maxMove;
    this.finishNum = "string";
    this.interval = config.interval || 10;
    this.step = config.step || 20;
    this.onFinish = config.onFinish;
    this.isFinish = false;
    this.timer = null;
    this.method = this.num >= 0;
    this.c = this.elementID ? $("#" + this.elementID) : this.element;
    this.run = function () {
        clearInterval(this.timer);
        this.fade();
        if (this.isFinish) {
            this.onFinish && this.onFinish();
        } else {
            var f = this;
            this.timer = setInterval(function () {
                f.run();
            }, this.interval);
        }
    };
    this.fade = function () {
        if (this.finishNum == "string") {
            this.finishNum = (parseInt(this.c.css(this.style)) || 0) + this.num;
        }
        var a = parseInt(this.c.css(this.style)) || 0;
        if (this.finishNum > a && this.method) {
            a += this.step;
            if (a >= 0) {
                this.finishNum = a = 0;
            }
        } else {
            if (this.finishNum < a && !this.method) {
                a -= this.step;
                if (a * -1 >= this.maxMove) {
                    this.finishNum = a = this.maxMove * -1;
                }
            }
        }
        if (this.finishNum <= a && this.method || this.finishNum >= a && !this.method) {
            this.c.css(this.style, this.finishNum + "px");
            this.isFinish = true;
            this.finishNum = "string";
        } else {
            this.c.css(this.style, a + "px");
        }
    };
};
/**
 * @description {Class} TabPanel
 * This is the main class of tab panel.
 */
TabPanel = function (config) {
    /**
     * @description {Config} renderTo
     * {String or JQuery object} To specify where tab panel will be placed. It could be a DOM id or jquery object.
     */
    this.jbStyle = config.jbStyle,
        this.renderTo = config.renderTo || $(document.body);
    this.ie6 = (!!window.ActiveXObject && !window.XMLHttpRequest);
    this.contentScroll = typeof(config.contentScroll) == "boolean" ? config.contentScroll : null;
    /**
     * @description {Config} border
     * {Boolean} To show border or not.
     */
    this.border = config.border;
    this.render = typeof this.renderTo == 'string' ? $('#' + this.renderTo) : this.renderTo;
    /**
     * @description {Config} widthResizable
     * {Boolean} Whether end user can change panel width by mouse dragging.
     */
    this.widthResizable = config.widthResizable;
    /**
     * @description {Config} heightResizable
     * {Booean} Whether end user can change panel height by mouse dragging.
     */
    this.heightResizable = config.heightResizable;
    /**
     * @description {Config} autoResizable
     * {Boolean} Whether panel resizes itself according to content.
     */
    this.autoResizable = config.autoResizable ? true : false;
    /**
     * @description {Config} width
     * {String} Initialization width.
     * @sample // width config, in px or percentage.
     * width : '200px'// or '100%'.
     */
    this.width = config.width || '100%';
    /**
     * @description {Config} height
     * {String} Initialization height.
     * @sample //heigh config
     * height : '200px'// or '100%'.
     */
    this.height = config.height || '100%';
    /**
     * @description {Config} items
     * {Array} Tab items array.
     */
    this.items = config.items || [];
    this.closeCallback = config.closeCallback;
    /**
     * @description {Config} active
     * {Number} Active tab index. Base on 0.
     */
    this.active = config.active || 0;
    //this is tab array.
    this.tabs = [];
    this.scrolled = false;
    this.fullTab = config.fullTab ? config.fullTab : false;
    this.tabWidth = config.tabWidth ? config.tabWidth : 40 + 4;
    this.fixNum = 2;
    this.scrollFinish = true;
    this.maxLength = config.maxLength || -1;
    this.maxzindex = 0;
    //add by mrq tab右击事件
    this.contextmenu = config.contextmenu;
    //click触发函数,触发的是当前页面不是tabpanel的子页面，子页面触发可以配置item时增加clickFunc配置，子item配置高于此配置
    this.clickFunc = config.clickFunc;

    this.init();
};

TabPanel.prototype = {
    //initialization
    init: function () {
        var tabEntity = this;
        if (this.autoResizable) {
            this.widthResizable = this.heightResizable = true;
            this.render.css('overflow', 'hidden');
            $(window).resize(function () {
                window.setTimeout(function () {
                    tabEntity.resize();
                }, 200);
            });
        }
        this.render.width(this.width);
        this.render.height(this.height);
        var hwFix = this.border != 'none' ? 2 : 0;
        this.tabpanel = $('<DIV></DIV>');
        this.tabpanel.addClass('tabpanel');
        this.tabpanel.width(this.render.width() - hwFix);
        this.tabpanel.height(this.render.height() - hwFix);
        this.render.append(this.tabpanel);

        //construct container
        this.tabpanel_tab_content = $('<DIV></DIV>');
        this.tabpanel_tab_content.addClass('tabpanel_tab_content');
        this.tabpanel_tab_content.appendTo(this.tabpanel);

        //construct left scroll button
        this.tabpanel_left_scroll = $('<DIV></DIV>');
        this.tabpanel_left_scroll.bind('click', function () {
            tabEntity.moveLeft();
        });
        this.tabpanel_left_scroll.addClass('tabpanel_left_scroll');
        this.tabpanel_left_scroll.addClass('display_none');
        this.tabpanel_left_scroll.bind('mouseover', function () {
            var l = $(this);
            l.addClass('tabpanel_scroll_over');
            l.bind('mouseout', function () {
                l.unbind('mouseout');
                l.removeClass('tabpanel_scroll_over');
            });
        });
        this.tabpanel_left_scroll.appendTo(this.tabpanel_tab_content);

        //construct right scroll button
        this.tabpanel_right_scroll = $('<DIV></DIV>');
        this.tabpanel_right_scroll.bind('click', function () {
            tabEntity.moveRight();
        });
        this.tabpanel_right_scroll.addClass('tabpanel_right_scroll');
        this.tabpanel_right_scroll.addClass('display_none');
        this.tabpanel_right_scroll.bind('mouseover', function () {
            var r = $(this);
            r.addClass('tabpanel_scroll_over');
            r.bind('mouseout', function () {
                r.unbind('mouseout');
                r.removeClass('tabpanel_scroll_over');
            });
        });
        this.tabpanel_right_scroll.appendTo(this.tabpanel_tab_content);

        this.tabpanel_move_content = $('<DIV></DIV>');
        this.tabpanel_move_content.addClass('tabpanel_move_content');
        this.tabpanel_move_content.appendTo(this.tabpanel_tab_content);

        this.tabpanel_mover = $('<UL></UL>');
        this.tabpanel_mover.addClass('tabpanel_mover');
        this.tabpanel_mover.appendTo(this.tabpanel_move_content);

        if (!this.jbStyle) {
            this.tabpanel_tab_spacer = $('<DIV></DIV>');
            this.tabpanel_tab_spacer.addClass('tabpanel_tab_spacer');
            this.tabpanel_tab_spacer.appendTo(this.tabpanel_tab_content);
        }
        //content div
        this.tabpanel_content = $('<DIV></DIV>');
        this.tabpanel_content.addClass('tabpanel_content');
        this.tabpanel_content.appendTo(this.tabpanel);

        var t_w = this.tabpanel.width();
        var t_h = this.tabpanel.height();

        if (this.border == 'none') {
            this.tabpanel.css('border', 'none');
        }

        this.tabpanel_tab_content.width(t_w);
        this.tabpanel_content.width(t_w);
        this.tabpanel_content.height(t_h - this.tabpanel_tab_content.get(0).offsetHeight);

        this.update();

        for (var i = 0; i < this.items.length; i++) {
            this.items[i].notExecuteMoveSee = true;
            this.addTab(this.items[i]);
        }
        //activate tab
        if (this.active >= 0) {
            var temp = this;
//        window.onload=function(){
            temp.show(temp.active, false);
            if (this.ie6) {
                window.onload = function () {
                    for (var i = 0; i < temp.tabs.length; i++) {
                        var t = temp.tabs[i];
                        if (i == temp.active) {
                            t.content.find("select").each(function (si, st) {
                                st = $(st);
                                if (st.hasClass("_zbtabselect")) {
                                    st.removeClass("_zbtabselect").show();
                                }
                            })
                        } else {
                            t.content.find("select").each(function (si, st) {
                                st = $(st);
                                if (!st.is(":hidden")) {
                                    st.addClass("_zbtabselect").hide();
                                }
                            })
                        }
                    }
                }
            }

//        }
        }
        var panel = this;
        this._createContentMenu();
        $(window).resize(function () {
            var twidth = panel.render.parent().width();
            var theight = panel.render.parent().height();
            panel.render.width(twidth);
            panel.render.height(theight);
            panel.tabpanel.width(twidth - hwFix);
            panel.tabpanel.height(theight - hwFix);
            panel.render.find(".tabpanel_tab_content").width(twidth - hwFix);
            panel.render.find(".tabpanel_move_content").width(twidth - hwFix);
            if (!this.jbStyle) {
                panel.render.find(".tabpanel_tab_spacer").width(twidth - hwFix);
            }
        })
    },
    _createContentMenu: function () {
        if (!this.contextmenu)
            return;
        var tabPanel = this;

        //创建右击菜单
        function createMenu($el, menuConfig) {
            var $ul = $('<ul class="om-menu om-corner-all" style="display: none"></ul>');
            $.each(menuConfig.dataSource, function (i, t) {
                var $li = $('<li id="' + t.id + '"class=""><a href="javascript:void(0)" class="om-corner-all om-menu-indicator">' + t.label + '</a></li>');
                $li.data("item", t);
                $ul.append($li);
            });
            $el.append($ul);
            $ul.on("click", "li:not(.tabDisabled)", function () {
                var item = $(this).data("item");
                if (item === undefined) return;
                var $el = item.$el;
                var clickEl = $el.data("clickEl");
                var tabpanel = item.tabPanel;
                var clickPos = tabpanel.getTabPosision(clickEl.getAttribute("id"));
                switch (item.id) {
                    //关闭当前
                    case "close":
                        tabpanel.getClosable(clickPos) && tabpanel.kill(clickPos);
                        break;
                    //关闭其它
                    case "closeOther":
                        var tabLength = tabpanel.getTabsCount(), closeIndex = 0;
                        for (var i = 0; i < tabLength; i++) {
                            if (i === clickPos) {
                                closeIndex++;
                            } else {
                                if (tabpanel.getClosable(closeIndex)) {
                                    tabpanel.kill(closeIndex);
                                } else {
                                    closeIndex++;
                                }
                            }
                        }
                        break;
                    //关闭所有
                    case "closeAll":
                        var tabLength = tabpanel.getTabsCount(), closeIndex = 0;
                        for (var i = 0; i < tabLength; i++) {
                            if (tabpanel.getClosable(closeIndex)) {
                                tabpanel.kill(closeIndex);
                            } else {
                                closeIndex++;
                            }
                        }
                        break;
                    //取消
                    case "cancel":
                        break;
                }
                $el.hide();
            });
        }

        /**
         * 对于按钮的控制，不满足条件的不可点击
         * @param condition 条件
         * @param $el 位置
         */
        function hideOrShowLi(condition, $el) {
            if (condition) {
                $el.addClass("tabDisabled");
                $el.hover(function () {
                    $(this).removeClass("om-menu-item-hover");
                });
                $el.find("a").css("color", "#d6d6d6");
            } else {
                $el.removeClass("tabDisabled");
                $el.hover(function () {
                    $(this).addClass("om-menu-item-hover");
                }, function () {
                    $(this).removeClass("om-menu-item-hover");
                });
                $el.find("a").css("color", "#000");
            }
        }

        var $menuPanel = $('<div style=" width: 130px;display: none;position:absolute;z-index:9999999;" ' +
            'class="om-menu-container om-menu-content om-corner-all"></div>');
        $("body").append($menuPanel);
        //创建流向右击菜单
        //流向菜单
        var closeMenu = {
            dataSource: [
                {id: 'close', label: '关闭', $el: $menuPanel, tabPanel: this},
                {id: 'closeOther', label: '关闭其它', $el: $menuPanel, tabPanel: this},
                {id: 'closeAll', label: '关闭所有', $el: $menuPanel, tabPanel: this}
            ]
        };
        createMenu($menuPanel, closeMenu);
        var $closeOther = $("#closeOther"), $close = $("#close");
        this.tabpanel_move_content.on("contextmenu", "li", function (e) {
            stopDefault(e);
            //记录点击的位置
            $menuPanel.data("clickEl", this);
            //关闭其它
            hideOrShowLi(tabPanel.getTabsCount() === 1, $closeOther);
            //关闭自己
            hideOrShowLi(!tabPanel.getClosable(tabPanel.getTabPosision(this.getAttribute("id"))), $close);
            $menuPanel.css({"top": e.pageY, 'left': e.pageX}).show();
            $menuPanel.find(".om-menu").show();
            $menuPanel.bind("mouseenter.tabpanelmouse", function () {
                $menuPanel.bind("mouseleave.tabpanelmouse", function () {
                    $menuPanel.hide();
                    $menuPanel.unbind(".tabpanelmouse");
                });
            });
        });
    },
    updateTabTotalLength: function () {
        var tabTotalLength = 0;
        $.each(this.tabs, function (i, t) {
            tabTotalLength += t.tab.outerWidth();
        });
        this.tabTotalLength = tabTotalLength;
    },
    //scroll left
    moveLeft: function () {
        if (this.scrollFinish) {
            this.disableScroll();
            this.scrollFinish = false;
            Fader.apply(this, new Array({
                element: this.tabpanel_mover,
                style: 'marginLeft',
                num: (this.tabTotalLength - this.maxMove),
                maxMove: this.maxMove,
                onFinish: this.useableScroll
            }));
            this.run();
        }
    },
    //scroll right
    moveRight: function () {
        if (this.scrollFinish) {
            this.disableScroll();
            this.scrollFinish = false;
            Fader.apply(this, new Array({
                element: this.tabpanel_mover,
                style: 'marginLeft',
                num: (this.tabTotalLength - this.maxMove) * -1,
                maxMove: this.maxMove,
                onFinish: this.useableScroll
            }));
            this.run();
        }
    },
    //scroll to end of left side
    moveToLeft: function () {
        //no scroll button show
        if (this.scrolled && this.scrollFinish) {
            this.disableScroll();
            this.scrollFinish = false;
            var marginLeft = parseInt(this.tabpanel_mover.css('marginLeft')) * -1;
            Fader.apply(this, new Array({
                element: this.tabpanel_mover,
                style: 'marginLeft',
                num: marginLeft,
                maxMove: this.maxMove,
                interval: 20,
                step: (marginLeft / 10) < 10 ? 10 : marginLeft / 10,
                onFinish: this.useableScroll
            }));
            this.run();
        }
    },

    //scroll to end of left side
    moveToRight: function () {
        if (this.scrolled && this.scrollFinish) {
            this.disableScroll();
            this.scrollFinish = false;
            var marginLeft = parseInt(this.tabpanel_mover.css('marginLeft')) * -1;
            var liWidth = this.tabpanel_mover.children().length * this.tabWidth;
            var cWidth = this.tabpanel_move_content.width();
            var num = (liWidth - cWidth - marginLeft + this.fixNum) * -1;
            Fader.apply(this, new Array({
                element: this.tabpanel_mover,
                style: 'marginLeft',
                num: num,
                maxMove: this.maxMove,
                step: (num * -1 / 10) < 10 ? 10 : num * -1 / 10,
                onFinish: this.useableScroll
            }));
            this.run();
        }
    },

    //move to visible position/////////////////////////////////////////////////////////
    moveToSee: function (position) {
        if (this.scrolled) {
            var liTarget = 0;
            var liWidth = 0;
            $.each(this.tabs, function (i, t) {
                if (i < position) {
                    liTarget += t.tab.outerWidth();
                } else if (i == position) {
                    liWidth = t.tab.outerWidth();
                    return false;
                } else {
                    return false;
                }
            })
            var ulWhere = parseInt(this.tabpanel_mover.css('marginLeft'));
            var cWidth = this.tabpanel_tab_content.width();
            if (this.scrolled)
                cWidth -= (this.tabpanel_left_scroll.width() + this.tabpanel_right_scroll.width());

            this.disableScroll();
            var moveNum = (liTarget - parseInt((cWidth - liWidth) / 2) + ulWhere) * -1;
            this.scrollFinish = false;
            Fader.apply(this, new Array({
                element: this.tabpanel_mover,
                style: 'marginLeft',
                num: moveNum,
                maxMove: this.maxMove,
                step: (moveNum / 10) < 10 ? 10 : moveNum / 10,
                onFinish: this.useableScroll
            }));
            this.run();
        }
    },
    //disable scroll buttons
    disableScroll: function () {
        this.tabpanel_left_scroll.addClass('tabpanel_left_scroll_disabled');
        this.tabpanel_left_scroll.attr('disabled', true);
        this.tabpanel_right_scroll.addClass('tabpanel_right_scroll_disabled');
        this.tabpanel_right_scroll.attr('disabled', true);
    },

    //to determin whether we can still scroll
    useableScroll: function () {
        var tabEntity = this;
        if (this.scrolled) {
            //we came to the end of left side
            if (parseInt(tabEntity.tabpanel_mover.css('marginLeft')) == 0) {
                //disble left scroll button
                tabEntity.tabpanel_left_scroll.addClass('tabpanel_left_scroll_disabled');
                tabEntity.tabpanel_left_scroll.attr('disabled', true);
                //
                tabEntity.tabpanel_right_scroll.removeClass('tabpanel_right_scroll_disabled');
                tabEntity.tabpanel_right_scroll.removeAttr('disabled');
            }
            //we came to the end of right side
            else if (parseInt(tabEntity.tabpanel_mover.css('marginLeft')) * -1 == tabEntity.maxMove) {
                tabEntity.tabpanel_left_scroll.removeClass('tabpanel_left_scroll_disabled');
                tabEntity.tabpanel_left_scroll.removeAttr('disabled', true);
                tabEntity.tabpanel_right_scroll.addClass('tabpanel_right_scroll_disabled');
                tabEntity.tabpanel_right_scroll.attr('disabled');
            }
            else {
                tabEntity.tabpanel_left_scroll.removeClass('tabpanel_left_scroll_disabled');
                tabEntity.tabpanel_left_scroll.removeAttr('disabled', true);
                tabEntity.tabpanel_right_scroll.removeClass('tabpanel_right_scroll_disabled');
                tabEntity.tabpanel_right_scroll.removeAttr('disabled');
            }
        }

        tabEntity.scrollFinish = true;
    },
    //update style
    update: function () {
        var cWidth = this.tabpanel_tab_content.width();
        if (this.scrolled)
            cWidth -= (this.tabpanel_left_scroll.width() + this.tabpanel_right_scroll.width());
        this.tabpanel_move_content.width(cWidth);
        this.maxMove = this.tabTotalLength - cWidth;
    },
    //to show scroll button if needed.
    showScroll: function () {
        if (this.tabTotalLength > this.tabpanel_tab_content.innerWidth()) {
            this.tabpanel_move_content.addClass('tabpanel_move_content_scroll');
            this.tabpanel_left_scroll.removeClass('display_none');
            this.tabpanel_right_scroll.removeClass('display_none');
            this.scrolled = true;
        } else {
            this.moveToLeft();
            this.tabpanel_move_content.removeClass('tabpanel_move_content_scroll');
            this.tabpanel_left_scroll.addClass('display_none');
            this.tabpanel_right_scroll.addClass('display_none');
            this.scrolled = false;
            this.scrollFinish = true;
        }
        // var liWidth = this.tabpanel_mover.children().length * this.tabWidth;
        // var tabContentWidth = this.tabpanel_tab_content.width();
        // if (liWidth > tabContentWidth && !this.scrolled) {
        //     this.tabpanel_move_content.addClass('tabpanel_move_content_scroll');
        //     this.tabpanel_left_scroll.removeClass('display_none');
        //     this.tabpanel_right_scroll.removeClass('display_none');
        //     this.scrolled = true;
        // }
        // else if (liWidth < tabContentWidth && this.scrolled) {
        //     this.moveToLeft();
        //     this.tabpanel_move_content.removeClass('tabpanel_move_content_scroll');
        //     this.tabpanel_left_scroll.addClass('display_none');
        //     this.tabpanel_right_scroll.addClass('display_none');
        //     this.scrolled = false;
        //     this.scrollFinish = true;
        // }
    },

    /**
     * @description {Method} addTab To add a new tab.
     * @param {Object} item Object for item profile.
     * @sample  //to add a new tab
     * addTab({id:"newtabid",
   *    title:"I am new" ,
   *    html:"some new message goes here",
   *    closable: true,
   *    disabled:false,
   *    icon:"image/new.gif"
   * });
     */
    addTab: function (tabitem) {

        if (this.maxLength != -1 && this.maxLength <= this.tabs.length) {
            return false;
        }

        tabitem.id = tabitem.id || RX.uuid();

        //if id exist, switch to that one
        if ($('#' + tabitem.id).length > 0) {
            this.show(tabitem.id, false);
        }
        else if (this.scrollFinish) {
            var tabEntity = this;

            var tab = $('<LI></LI>');
            tab.attr('id', tabitem.id);
            tab.width(this.tabWidth);
            tab.appendTo(this.tabpanel_mover);
            var title;
            if (this.jbStyle) {
                var tab1 = $('<LI class="Xfg"></LI>');
                tab1.appendTo(this.tabpanel_mover);
                title = $('<a href="javascript:void(0);"></a>');
                title.text(tabitem.title);
                title.appendTo(tab);
            } else {
                title = $('<DIV></DIV>');
                title.text(tabitem.title);
                title.appendTo(tab);
            }
            var wFix = tabitem.closable == false ? 0 : 5;
            if (tabitem.icon) {
                title.addClass('icon_title');
                title.css('background-image', 'url("' + tabitem.icon + '")');
                if (title.width() > (this.tabWidth - 35 - wFix)) {
                    if (this.fullTab) {
                        tab.width(title.width() + 35);
                    } else {
                        title.width((this.tabWidth - 50 - wFix));
                        title.attr('title', tabitem.title);
                        tab.append('<DIV>...</DIV>');
                    }
                }
            } else {
                title.addClass('tabtitle');
                if (title.width() > (this.tabWidth - 19 - wFix)) {
                    if (this.fullTab) {
                        tab.width(title.width() + 15);
                    } else {
                        title.width((this.tabWidth - 30 - wFix));
                        title.attr('title', tabitem.title);
                        tab.append('<DIV>...</DIV>');
                    }
                }
            }

            var closer = $('<i class="iconfont">&#xe6a2;</i>');
            closer.addClass('closer');
            closer.attr('title', 'Close tab');
            closer.appendTo(tab);

            var content = $('<DIV></DIV>');
            content.addClass('html_content');

            content.appendTo(this.tabpanel_content);

            var child_frame = content.find('iframe');
            /*
             if(child_frame.length==1)
             {
             child_frame.attr('id', tabitem.id+'Frame');
             child_frame.attr('name', tabitem.id+'Frame');
             }*/

            var activedTabIndex = this.tabpanel_mover.children().index(this.tabpanel_mover.find('.tabactive')[0]);

            if (activedTabIndex < 0)
                activedTabIndex = 0;
            if (this.tabs.length > activedTabIndex)
                tabitem.preTabId = this.tabs[activedTabIndex].id
            else
                tabitem.preTabId = '';
            tabitem.tab = tab;
            tabitem.title = title;
            tabitem.closer = closer;
            tabitem.content = content;
            tabitem.disable = tabitem.disable == undefined ? false : tabitem.disable;
            tabitem.closable = tabitem.closable == undefined ? false : tabitem.closable;
            tabitem.clickFunc = tabitem.clickFunc;
            if (tabitem.closable == false)
                closer.addClass('display_none');
            if (tabitem.disabled == true) {
                tab.attr('disabled', true);
                title.addClass('.disabled');
            }

            this.tabs.push(tabitem);

            tab.bind('click', function (position) {
                return function () {
                    if (tabEntity.getActiveIndex() !== position) {
                        var func = tabEntity.tabs[position].clickFunc;
                        var clickContent = tabEntity.tabs[position].content;
                        if (typeof func === "function") {
                            func(position, clickContent);
                        } else if (typeof tabEntity.clickFunc === "function") {
                            //点击不是当前显示的位置
                            tabEntity.clickFunc(position, clickContent);
                        }
                    }
                    tabEntity.show(position, false);
                };
            }(this.tabs.length - 1));

            closer.bind('click', function (position) {
                return function () {
                    tabEntity.kill(position);
                };
            }(this.tabs.length - 1));

            if (tabitem.closable) {
                tab.bind('dblclick', function (position) {
                    return function () {
                        tabEntity.kill(position);
                    };
                }(this.tabs.length - 1));
            }

            if (!tabitem.lazyload) {
                this.show(this.tabs.length - 1, tabitem.notExecuteMoveSee);
            }

            this.updateTabTotalLength();
            this.showScroll();
            this.update();

            if (!tabitem.lazyload && !tabitem.notExecuteMoveSee) {
                this.moveToRight();
            }
        }
    },
    /**
     * @description {Method} getTabPosision To get tab index.
     * @param {String} id item id.
     * @return {Number} index of tab.
     */
    getTabPosision: function (tabId) {
        if (typeof tabId == 'string') {
            for (var i = 0; i < this.tabs.length; i++) {
                if (tabId == this.tabs[i].id) {
                    tabId = i;
                    break;
                }
            }
        }
        return tabId;
    },
    /**
     * @description {Method} refresh To refresh tab content.
     * @param {String} id item id.
     */
    refresh: function (position) {
        position = this.getTabPosision(position);
        if (typeof position == 'string')
            return false;
        else {
            //if IFRAME exists, refresh the sub frames
            var iframes = this.tabs[position].content.find('iframe');
            if (iframes.length > 0) {
                var frameId = this.tabs[position].id + 'Frame';
                this.iterateFlush(window.frames[frameId]);
            }
        }
    },

    iterateFlush: function (iframeObj) {

        if (iframeObj.window.frames.length > 0) {
            for (var i = 0; i < iframeObj.window.frames.length; i++) {
                this.iterateFlush(iframeObj.window.frames[i]);
            }
        }
        else {
            if (iframeObj.document.forms.length > 0) {
                for (var i = 0; i < iframeObj.document.forms.length; i++) {
                    try {
                        iframeObj.document.forms[i].submit();
                    }
                    catch (e) {
                        iframeObj.location.reload();
                    }
                }
            }
            else {
                iframeObj.location.reload();
            }
        }
    },
    show: function (position, notExecuteMoveSee) {
        if (this.tabs.length < 1)
            return false;
        position = this.getTabPosision(position);
        if (typeof position == 'string')
            position = 0;
        if (this.scrollFinish) {
            if (position >= this.tabs.length) {
                position = 0;
            }
            this.tabs[position].content.css('z-index', ++this.maxzindex);
            if (this.tabs[position].tab.hasClass('tabactive')) {
                if (!notExecuteMoveSee) {
                    this.moveToSee(position);
                }
            }
            else {
                //load those never loaded
                if (this.tabs[position].content.html() == '') {
                    if (this.tabs[position].cId) { //已有html方式，id元素迁移
                        this.tabs[position].content.append($("#" + this.tabs[position].cId));
                        // this.tabs[position].content.css('overflow', 'hidden');
                        if (typeof (this.contentScroll) == "boolean") {
                            this.tabs[position].content.css('overflow', this.contentScroll ? "auto" : "hidden");
                        }
                    } else if (this.tabs[position].src) {   //iframe方式，使用src注册iframe
                        var fName = "tabContent"+(___tab_content_num++);
                        var frameStr = '<iframe src="' + this.tabs[position].src + '" id="' + fName + '"' +
                            ' name="' + fName + '' +
                            //                    '" tabid="' + this.tabs[position].id + '' +
                            '" width="100%" height="100%" frameborder="0"></iframe>';
                        this.tabs[position].content.append(frameStr);
                        this.tabs[position].content.css('overflow', 'hidden');
                    } else {    //通用方式，使用html注册content
                        this.tabs[position].content.html(this.tabs[position].html);
                        // this.tabs[position].content.css('overflow', 'auto');
                        if (typeof (this.contentScroll) == "boolean") {
                            this.tabs[position].content.css('overflow', this.contentScroll ? "auto" : "hidden");
                        }
                    }
                }

                this.tabpanel_mover.find('.tabactive').removeClass('tabactive');
                this.tabs[position].tab.addClass('tabactive');
                if (!notExecuteMoveSee) {
                    if (this.ie6) {
                        for (var i = 0; i < this.tabs.length; i++) {
                            var t = this.tabs[i];
                            if (i == position) {
                                t.content.find("select").each(function (si, st) {
                                    st = $(st);
                                    if (st.hasClass("_zbtabselect")) {
                                        st.removeClass("_zbtabselect").show();
                                    }
                                })
                            } else {
                                t.content.find("select").each(function (si, st) {
                                    st = $(st);
                                    if (!st.is(":hidden")) {
                                        st.addClass("_zbtabselect").hide();
                                    }
                                })
                            }
                        }
                    }
                    this.moveToSee(position);
                }
            }
        }
    },
    /**
     * @description {Method} kill To close tab.
     * @param {String} id item id.
     */
    kill: function (position) {

        var tabEntity = this;

        //get tab index
        position = this.getTabPosision(position);

        var preTabId = this.tabs[position].preTabId;
        var activePos = tabEntity.getActiveIndex();

        if (tabEntity.closeCallback && typeof tabEntity.closeCallback == "function") tabEntity.closeCallback(this.tabs[position].id);

        //detroy DOM
        this.tabs[position].closer.remove();
        this.tabs[position].title.remove();
        this.tabs[position].tab.remove();
        this.tabs[position].content.remove();
        //remove from tabs
        this.tabs.splice(position, 1);

        //rebind event handler because index changed.
        for (var i = 0; i < this.tabs.length; i++) {
            this.tabs[i].tab.unbind('click');
            this.tabs[i].tab.bind('click', function (i) {
                return function () {
                    tabEntity.show(i, false);
                };
            }(i));
            this.tabs[i].closer.unbind('click');
            this.tabs[i].closer.bind('click', function (i) {
                return function () {
                    tabEntity.kill(i);
                };
            }(i));
            if (this.tabs[i].closable) {
                this.tabs[i].tab.unbind('dblclick');
                this.tabs[i].tab.bind('dblclick', function (i) {
                    return function () {
                        tabEntity.kill(i);
                    };
                }(i));
            }
        }
        // //update width
        // this.update();
        // //to scroll bar
        // this.showScroll();
        this.updateTabTotalLength();
        this.showScroll();
        this.update();
        //show last
        if (position === activePos) {
            this.show(preTabId, false);
        }
    },

    /**
     * @description {Method} getTabsCount To get how many tabs are in the panel.
     * @return {Number} Number of tabs .
     */
    getTabsCount: function () {
        return this.tabs.length;
    },

    /**
     * @description {Method} setTitle To set tab title.
     * @param {String} id Item id.
     * @param {String} title Tab title.
     */
    setTitle: function (position, title) {
        position = this.getTabPosision(position);
        if (position < this.tabs.length)
            this.tabs[position].title.text(title);
    },

    /**
     * @description {Method} getTitle To get tab title.
     * @param {String} id item id.
     */
    getTitle: function (position) {
        position = this.getTabPosision(position);
        return this.tabs[position].title.text();
    },

    /**
     * @description {Method} setContent To set tab title.
     * @param {String} id Item id.
     * @param {String} title Tab inner html.
     */
    setContent: function (position, content) {
        position = this.getTabPosision(position);
        if (position < this.tabs.length)
            this.tabs[position].content.html(content);
    },

    /**
     * @description {Method} getContent To get tab inner html.
     * @param {String} id item id.
     */
    getContent: function (position) {
        position = this.getTabPosision(position);
        return this.tabs[position].content.html();
    },

    /**
     * @description {Method} setDisable To enable or disable tab.
     * @param {String} id Item id.
     * @param {Booleaan} True for disabled, false for enabled.
     */
    setDisable: function (position, disable) {
        position = this.getTabPosision(position);
        if (position < this.tabs.length) {
            this.tabs[position].disable = disable;
            if (disable) {
                this.tabs[position].tab.attr('disabled', true);
                this.tabs[position].title.addClass('.disabled');
            } else {
                this.tabs[position].tab.removeAttr('disabled');
                this.tabs[position].title.removeClass('.disabled');
            }
        }
    },

    /**
     * @description {Method} getDisable To determine whether tab is disabled or not.
     * @param {String} id item id.
     */
    getDisable: function (position) {
        position = this.getTabPosision(position);
        return this.tabs[position].disable;
    },

    /**
     * @description {Method} setClosable To enable or disable end user to close tab.
     * @param {String} id Item id.
     * @param {Booleaan} True for closable, false for not.
     */
    setClosable: function (position, closable) {
        position = this.getTabPosision(position);
        if (position < this.tabs.length) {
            this.tabs[position].closable = closable;
            if (closable) {
                this.tabs[position].closer.addClass('display_none');
            } else {
                this.tabs[position].closer.addClass('closer');
                this.tabs[position].closer.removeClass('display_none');
            }
        }
    },

    /**
     * @description {Method} getClosable To determine whether tab is closable or not.
     * @param {String} id item id.
     */
    getClosable: function (position) {
        position = this.getTabPosision(position);
        return this.tabs[position].closable;
    },

    /**
     * @description {Method} getActiveIndex To get index of active tab.
     * @return {Number} index of active tab.
     */
    getActiveIndex: function () {
        return this.tabpanel_mover.children().index(this.tabpanel_mover.find('.tabactive')[0]);
    },

    /**
     * @description {Method} getActiveTab To get active tab.
     * @return {Object} Profile of active tab.
     */
    getActiveTab: function () {
        var activeTabIndex = this.tabpanel_mover.children().index(this.tabpanel_mover.find('.tabactive')[0]);
        if (this.tabs.length > activeTabIndex)
            return this.tabs[activeTabIndex];
        else
            return null;
    },
    resize: function () {
        var hwFix = this.border == 'none' ? 0 : 2;

        if (this.widthResizable) {

            this.width = this.render.width();
            this.tabpanel.width(this.width - hwFix);
            this.tabpanel_tab_content.width(this.width - hwFix);
            this.tabpanel_content.width(this.width - hwFix);
        }
        if (this.heightResizable) {
            this.height = this.render.height();
            this.tabpanel.height(this.height - hwFix);
            this.tabpanel_content.height(this.height - this.tabpanel_tab_content.get(0).offsetHeight);
        }

        // this.showScroll();
        // this.useableScroll();
        // this.update();

        this.updateTabTotalLength();
        this.showScroll();
        this.update();

        var entity = this;
        setTimeout(function () {
            entity.moveToSee(entity.getActiveIndex());
        }, 200);

    },

    /**
     * @description {Method} setRenderWH To set width and height of the panel.
     * @param {Object} wh width and height.
     * @sample //To set tab height and width
     * setRenderWH({width:'200px', height:'400px'});
     */
    setRenderWH: function (wh) {
        if (wh) {
            if (wh.width != undefined) {
                this.render.width(wh.width);
            }
            if (wh.height != undefined) {
                this.render.height(wh.height);
            }
            this.resize();
        }
    },
    hideTab: function (positions) {
        if (positions) {
            if (typeof(positions) == "object") {
                for (var i = 0; i < positions.length; i++) {
                    this.hideTab(positions[i]);
                }
            } else {
                this.tabs[positions].tab.hide();
                $(this.tabs[positions].tab).next(".Xfg").hide();
            }
        }

    },
    showTab: function (positions) {
        if (positions) {
            if (typeof(positions) == "object") {
                for (var i = 0; i < positions.length; i++) {
                    this.showTab(positions[i]);
                }
            } else {
                this.tabs[positions].tab.show();
                $(this.tabs[positions].tab).next(".Xfg").show();
            }
        }

    }
};


//阻止浏览器的默认行为
function stopDefault(e) {
    //阻止默认浏览器动作(W3C)
    if (e && e.preventDefault)
        e.preventDefault();
    //IE中阻止函数器默认动作的方式
    else
        window.event.returnValue = false;
    return false;
}