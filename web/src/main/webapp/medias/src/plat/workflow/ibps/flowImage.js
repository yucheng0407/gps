//页面传参获取
var wfId = RX.page.param.wfId, instId = RX.page.param.instId;
var flowVm;
//视图初始化
$(function () {
    RX.page.resize = function () {
    };
    //暂使用弹出层layer避免遮罩全局页面
    var loadingIndex = layer.load(0);
    var bpmnDefUrl = "/workflow/ibps/getBpmDefLayout?";
    var urlBuilder = [];
    if (wfId) {
        urlBuilder.push("wfId=" + wfId);
    }
    if (instId) {
        urlBuilder.push("instId=" + instId);
    }
    flowVm = new Rxvm({
        el: '.flowImage',
        settings: {
            getData: {
                url: bpmnDefUrl + urlBuilder.join("&")
            }
        }, afterMount: function () {
            var $img = $("#img-workflow");
            var originalWidth = $img.outerWidth();
            $img.load(
                function () {
                    layer.close(loadingIndex);
                }
            );
            //预留100px边距给Qtip
            $(".flowImage").css({
                width: originalWidth + 200,
                position: "absolute",
                top: $(window).height() > $img.outerHeight() ? ($(window).height() - $img.outerHeight()) / 2 - 50 : 10,
                left: $(window).width() > originalWidth + 200 ? ($(window).width() - originalWidth - 200) / 2 : 0
            });
            if (instId) {
                //存在流程实例
                RX.makeQtip($('div[data-node-type="userTask"]'), {
                    content: {
                        text: function (event, api) {
                            $.ajax({
                                url: '/workflow/ibps/taskInstanceView',
                                success: function (html) {
                                    var domNode = $(html);
                                    var taskVm = new Rxvm({
                                        el: domNode[0],
                                        settings: {
                                            getData: {
                                                url: "/workflow/ibps/getTaskInstance",
                                                param: $.extend({}, RX.page.param,
                                                    {nodeDomId: api.target.data("node-domid")})
                                            }
                                        },
                                        afterMount: function () {
                                            var data = this.get("latest");
                                            var list = this.get("list");
                                            if (data) {
                                                api.set({
                                                    'content.title': api.target.data("node-name") + "详情",
                                                    'content.text': domNode.html()
                                                });
                                                //多人办理切换
                                                if (data.length > 1) {
                                                    var $select = api.tooltip.find(".i_select");
                                                    //绑定change事件
                                                    $select.on("change", function () {
                                                        api.tooltip.find(".form_view").hide();
                                                        api.tooltip.find(".transactor" + this.value).show();
                                                    });
                                                    //翻页按钮点击事件
                                                    var length = $select.find("option").length;
                                                    api.tooltip.find("a.prev").on("click", function () {
                                                        var $selected = $select.find("option:selected");
                                                        if ($selected.val() == "0") {//第一页翻至最后一页
                                                            $select.find("option:last").attr("selected", true);
                                                        } else {
                                                            $selected.prev().attr("selected", true);
                                                        }
                                                        $("select").trigger("change");
                                                    });
                                                    api.tooltip.find("a.next").on("click", function () {
                                                        var $selected = $select.find("option:selected");
                                                        if ($selected.val() == ("" + (length - 1))) {//最后一页翻至第一页
                                                            $select.find("option:first").attr("selected", true);
                                                        } else {
                                                            $selected.next().attr("selected", true);
                                                        }
                                                        $("select").trigger("change");
                                                    });
                                                }
                                                //查看更多历史
                                                if (list && list.length && list.length > 1) {
                                                    api.tooltip.find(".more-history").on("click", function () {
                                                        RX.page.open({
                                                            title: api.target.data("node-name") + "历史",
                                                            url: "/workflow/ibps/taskInstanceList",
                                                            param: {list: list}
                                                        });
                                                    });
                                                }
                                            } else {
                                                api.set({
                                                    'content.title': api.target.data("node-name"),
                                                    'content.text': '暂无运行数据'
                                                });
                                            }
                                        }
                                    });
                                }
                            });
                            return '正在加载...';
                        }
                    },
                    position: {
                        container: $(".flowCanvas"),
                        my: 'center left',
                        at: 'center right',
                        effect: false
                    },
                    style: {
                        classes: 'qtip-default qtip qtip-bootstrap qtip-shadow'
                    }
                });
                //嵌套环节
                RX.makeQtip($('div[data-node-type="callActivity"]'), {
                    content: {
                        text: function (event, api) {
                            $.ajax({
                                url: '/workflow/ibps/nestedNodeInstanceView',
                                success: function (html) {
                                    var domNode = $(html);
                                    var nestedNodeVm = new Rxvm({
                                        el: domNode[0],
                                        settings: {
                                            getData: {
                                                url: "/workflow/ibps/getNestedNodeInstance",
                                                param: $.extend({}, RX.page.param,
                                                    {nodeDomId: api.target.data("node-domid")})
                                            }
                                        },
                                        afterMount: function () {
                                            var _this = this;
                                            var data = _this.get("latest");
                                            var list = _this.get("list");
                                            if (data) {
                                                _this.set("pageNo", 0);
                                                api.set({
                                                    'content.title': api.target.data("node-name") + "详情",
                                                    'content.text': domNode.html()
                                                });
                                                if (data.length > 1) {
                                                    //翻页按钮点击事件
                                                    api.tooltip.find("a.prev").on("click", function () {
                                                        api.tooltip.find(".form_view").hide();
                                                        var pageNo = _this.get("pageNo");
                                                        if (pageNo === 0) {
                                                            _this.set("pageNo", data.length - 1);
                                                        } else {
                                                            _this.set("pageNo", pageNo - 1);
                                                        }
                                                        api.tooltip.find(".wfInst" + _this.get("pageNo")).show();
                                                    });
                                                    api.tooltip.find("a.next").on("click", function () {
                                                        api.tooltip.find(".form_view").hide();
                                                        var pageNo = _this.get("pageNo");
                                                        if (pageNo === data.length - 1) {
                                                            _this.set("pageNo", 0);
                                                        } else {
                                                            _this.set("pageNo", pageNo + 1);
                                                        }
                                                        api.tooltip.find(".wfInst" + _this.get("pageNo")).show();
                                                    });
                                                }
                                                //查看流程图
                                                api.tooltip.find(".viewFlowImage").on("click", function () {
                                                    RX.page.open({
                                                        title: "流程图",
                                                        areaType: "big",
                                                        url: "/workflow/ibps/flowImage",
                                                        param: {instId: $(this).data("wfinstid")}
                                                    });
                                                });
                                                //查看更多历史
                                                if (list && list.length && list.length > 1) {
                                                    api.tooltip.find(".more-history").on("click", function () {
                                                        RX.page.open({
                                                            title: api.target.data("node-name") + "历史",
                                                            url: "/workflow/ibps/workflowInstanceList",
                                                            param: {list: list}
                                                        });
                                                    });
                                                }
                                            } else {
                                                api.set({
                                                    'content.title': api.target.data("node-name"),
                                                    'content.text': '暂无运行数据'
                                                });
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    },
                    position: {
                        container: $(".flowCanvas"),
                        my: 'center left',
                        at: 'center right',
                        effect: false
                    },
                    style: {
                        classes: 'qtip-default qtip-w qtip-bootstrap qtip-shadow'
                    }
                });
            }
        }
    });
});