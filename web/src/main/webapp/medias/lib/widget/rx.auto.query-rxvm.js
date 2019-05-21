/**
 * rx.yox.grid
 * gird组件封装
 * 创建时间：2018-05-21
 * 创建人：Zp
 * 创建内容：新增文件，简单实现
 */
(function () {

    function getQueryDom(keypath, config) {
        var domStr = "<th o-tag='" + keypath + "'></th><td colspan='" + (config.colLength || 1) + "'>";
        if (config.type === "dict") {
            if (config.dictConfig.checkType && config.dictConfig.checkType !== "multiSelect") {
                domStr += "<div class='query_element_box'><div model='" + keypath + "'></div>";
            } else {
                domStr += "<div class='query_element_box ele_0'><select class='i_query_select' model='" + keypath + "'></select>";
            }
        } else if (config.type === "date") {
            domStr += "<div class='query_element_box'><input class='i_query_date' model='" + keypath + "'/>";
        } else if (config.type === "layer") {
            domStr += "<div class='query_element_box'><input class='i_query_layer' model='" + keypath + "'/>";
        } else if (config.type === "textarea") {
            domStr += "<div class='query_element_box'><textarea class='i_query_textarea' model='" + keypath + "'></textarea>";
        } else {
            domStr += "<div class='query_element_box'><input class='i_query_text' model='" + keypath + "'/>";
        }
        domStr += "</div></td>";
        return domStr;
    }

    var hasMore = false;

    function compileQueryTbody(config, settings, openMore) {
        var items = [],
            cols = settings.cols || [],
            // property = settings.property || [],
            arr = [],
            rowNum = 0,
            canClear = false;

        function buildItems() {
            var tempColLength = 0;
            $.each(arr, function (i, t) {
                var proConfig = config[t];
                if (proConfig) {
                    CR.checkPropertyJson(proConfig);
                    if (proConfig.canClear) {
                        canClear = true;
                    }

                    if (!proConfig.display) {
                        return true;
                    }
                    if (proConfig.moreSearch &&
                        (typeof proConfig.moreSearch === "boolean" || proConfig.moreSearch === "true")) {
                        hasMore = true;
                        return true;
                    }
                    var item = {
                        path: t,
                        type: "",
                        dom: getQueryDom(t, proConfig),
                        colLength: proConfig.colLength || 1,
                        endRow: true
                    };

                    tempColLength = tempColLength + item.colLength + 1;
                    if (tempColLength < cols.length) {
                        item.endRow = false;
                    } else if (tempColLength === cols.length) {
                        item.endRow = true;
                        rowNum++;
                        tempColLength = 0;
                    } else if (items.length) {
                        var lastItem = items.last();
                        lastItem.endRow = true;
                        rowNum++;
                        lastItem.dom += "<td colspan='" + (cols.length - tempColLength - lastItem.colLength - 1) + "'></td>";
                        tempColLength = item.colLength + 1;
                        if (tempColLength >= cols.length) {
                            item.endRow = true;
                            rowNum++;
                            tempColLength = 0;
                        } else {
                            item.endRow = false;
                        }
                    }
                    items.push(item);
                }
            });
            if (items.length) {
                items.last().endRow = false;
                if (tempColLength && rowNum && tempColLength < cols.length) {
                    items.last().dom += "<td colspan='" + (cols.length - tempColLength) + "'></td>";
                }
            }
        }

        // if (property.length) {
        //     $.each(property, function (i, t) {
        //         arr.push("query." + t);
        //     });
        //     arr.uniquelize();
        //     buildItems();
        // } else {
        for (var key in config) {
            if (config.hasOwnProperty(key) && key.startWith("query.")) {
                arr.push(key);
            }
        }
        arr.uniquelize();
        buildItems();
        // }

        if (items.length) {
            var domArr = ["<tbody><tr>"];
            $.each(items, function (i, t) {
                domArr.push(t.dom);
                if (t.endRow) {
                    domArr.push("</tr><tr>");
                }
            });
            domArr.push('<th style="width: 60px">' +
                '<input class="query_button" type="button" value="查询" on-click="query()"/>' +
                '</th>');
            if (canClear && settings.canClear) {
                domArr.push('<th style="width: 60px">' +
                    '<input class="query_buttonB" type="button" value="清空" on-click="clear()"/>' +
                    '</th>');
            }
            if (hasMore) {
                domArr.push('<th style="width:160px;">' +
                    '<div class="slide2">' +
                    '<a href="javascript:void(0);" class="btn-slide2 active2">' + (openMore ? '隐藏' : '展开') + '查询条件</a>' +
                    '</div>' +
                    '</th>');
            }
            domArr.push('</tr></tbody>');
            return domArr.join("");
        } else {
            return "<tbody></tbody>"
        }
    }

    function compileColgroup(cols) {
        var colArr = ["<colgroup>"];
        $.each(cols || [], function (i, t) {
            colArr.push("<col width='" + t + "px'>");
        });
        colArr.push("<col></colgroup>");
        return colArr.join("");
    }

    function compileQueryMore(config, settings, openMore) {
        var colHtml = "",
            tbodyHtml = "";

        var items = [],
            cols = settings.moreCols || [],
            arr = [],
            rowNum = 0;

        function buildItems() {
            var tempColLength = 0;
            $.each(arr, function (i, t) {
                var proConfig = config[t];
                if (proConfig) {
                    CR.checkPropertyJson(proConfig);
                    if (!proConfig.display) {
                        return true;
                    }
                    if (!proConfig.moreSearch || proConfig.moreSearch === "false") {
                        return true;
                    }
                    var item = {
                        path: t,
                        type: "",
                        dom: getQueryDom(t, proConfig),
                        colLength: proConfig.colLength || 1,
                        endRow: true
                    };

                    tempColLength = tempColLength + item.colLength + 1;
                    if (tempColLength < cols.length) {
                        item.endRow = false;
                    } else if (tempColLength === cols.length) {
                        item.endRow = true;
                        rowNum++;
                        tempColLength = 0;
                    } else if (items.length) {
                        var lastItem = items.last();
                        lastItem.endRow = true;
                        rowNum++;
                        lastItem.dom += "<td colspan='" + (cols.length - tempColLength - lastItem.colLength - 1) + "'></td>";
                        tempColLength = item.colLength + 1;
                        if (tempColLength >= cols.length) {
                            item.endRow = true;
                            rowNum++;
                            tempColLength = 0;
                        } else {
                            item.endRow = false;
                        }
                    }
                    items.push(item);
                }
            });
            if (items.length) {
                items.last().endRow = false;
                if (tempColLength && rowNum && tempColLength < cols.length) {
                    items.last().dom += "<td colspan='" + (cols.length - tempColLength) + "'></td>";
                }
            }
        }

        if (!hasMore) {
            return "";
        }

        colHtml = compileColgroup(settings.moreCols);

        for (var key in config) {
            if (config.hasOwnProperty(key) && key.startWith("query.")) {
                arr.push(key);
            }
        }
        arr.uniquelize();
        buildItems();

        if (items.length) {
            var domArr = ["<tbody><tr>"];
            $.each(items, function (i, t) {
                domArr.push(t.dom);
                if (t.endRow) {
                    domArr.push("</tr><tr>");
                }
            });
            domArr.push('</tr></tbody>');
            tbodyHtml = domArr.join("");
        } else {
            tbodyHtml = "<tbody></tbody>"
        }

        return '<div class="slide2_box" ' + (openMore ? '' : 'style="display:none;"') + '>' +
            '<table cellpadding="0" cellspacing="0" border="0" class="query_form">' +
            colHtml +
            tbodyHtml +
            '</table>' +
            '</div>';
    }

    RX.AutoQuery = {
        template: '<div>' +
            '<table cellpadding="0" cellspacing="0" border="0" class="query_form" style="width:auto;">' +
            '{{> queryColgroup}}' +
            '{{> queryTbody}}' +
            '</table>' +
            '{{> queryMore}}' +
            '</div>',
        data: {
            query: {},
            cols: [],
            items: []
        },
        partials: {
            queryColgroup: "<colgroup><col></colgroup>",
            queryTbody: "<tbody></tbody>",
            queryMore: ""
        },
        // settings: {
        //     property: [],                      //搜索区显示字段与排序
        //     cols: [80, 150, 80, 150, 80, 150]    //搜索区列宽设置
        // },
        initOptions: function (widgetOptions, options) {
            var tempOptions = $.extend(true, {}, widgetOptions, options);
            tempOptions.partials.queryColgroup = compileColgroup((tempOptions.settings || {}).cols);
            tempOptions.partials.queryTbody = compileQueryTbody(tempOptions.config || {}, tempOptions.settings || {}, tempOptions.data.openMore);
            tempOptions.partials.queryMore = compileQueryMore(tempOptions.config || {}, tempOptions.settings || {}, tempOptions.data.openMore);
            return tempOptions;
        },
        methods: {},
        _afterMount: function () {
            var that = this;
            var $moreSlide = $(that.$el).find(".btn-slide2");
            if ($moreSlide.length) {
                $moreSlide.click(function () {
                    var $this = $(this);
                    if ($this.hasClass("active2")) {
                        $this.text("隐藏查询条件");
                        that.getGridVm().set("openMore", true);
                    } else {
                        $this.text("展开查询条件");
                        that.getGridVm().set("openMore", false);
                    }

                    $this.toggleClass("active2");
                    //搜索区展开时，进行字段重新渲染。
                    setTimeout(function () {
                        if (that.getGridVm().get("openMore")) {
                            that.setConfig();
                        }}, 0);
                    $(that.$el).find(".slide2_box").slideToggle("fast", function () {
                        RX.page.resize();
                    });
                    return false;
                });
            }
        }
    };
}).call(window);