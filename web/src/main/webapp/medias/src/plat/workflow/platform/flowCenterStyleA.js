var qkVm, dbVm, zbVm, ybVm;
var historyData = _top.RX.page.getData() || {};
var loginUser = RX.cache(top, "USER");//当前登陆用户信息
$(function () {

    if(!historyData.hadHelp){
        layer.tips('不会操作？点我帮您。', "#helpBtn", {
            tips: [1, '#3595CC'],
            time: 4000
        });
        _top.RX.page.setData({hadHelp:true});
    }

    qkVm = new Rxvm({
        el: '#qkArea',
        data: {
            fqgzNum: 0, wcgzNum: 0, gzwclNum: 0,
            dbybrwNum: 0, ybrwNum: 0, rwbllNum: 0,
            timeType: "month",
            timeName: "一月内"
        },
        methods: {
            changeTime: function (time, timeName) {
                this.set("timeType", time);
                this.set("timeName", timeName);
                reloadQkData();
            },
            clickMore: function () {
                RX.page.goto("/workflow/platform/userBlqkView",
                    {showReturn: true, userId:loginUser.id, userName:loginUser.name});
            }
        }
    });

    dbVm = new Rxvm({
        el: '#dbArea',
        data: {dblist: [], nblist: [], maxNum: 6},
        methods: {
            clickRow: function ($keypath) {
                handleWorkflowByTaskId(this.get($keypath + ".TASK_ID"), {title: this.get($keypath + ".TITLE")});
            },
            clickMore: function () {
                if($("#con_one_1").is(":hidden")){
                    RX.page.open({
                        title: "拟办工作",
                        url: "/workflow/platform/nbList",
                        areaType: "big"
                    });
                }else{
                    RX.page.open({
                        title: "待办任务",
                        url: "/workflow/platform/dbList",
                        areaType: "big",
                        param:{withoutNbrw:"1"}
                    });
                }
            }
        }
    });

    zbVm = new Rxvm({
        el: '#zbArea',
        data: {list: [], maxNum: 6},
        methods: {
            clickRow: function ($keypath) {
                handleWorkflowByTaskId(this.get($keypath + ".LAST_TASK_ID"), {title: this.get($keypath + ".TITLE")});
            },
            clickMore: function () {
                RX.page.open({
                    title: "我发起的工作",
                    url: "/workflow/platform/zbList",
                    areaType: "big"
                });
            }
        }
    });

    ybVm = new Rxvm({
        el: '#ybArea',
        data: {list: [], maxNum: 6},
        methods: {
            clickRow: function ($keypath) {
                handleWorkflowByTaskId(this.get($keypath + ".TASK_ID"), {title: this.get($keypath + ".TITLE")});
            },

            clickMore: function () {
                RX.page.open({
                    title: "我参与的工作",
                    url: "/workflow/platform/ybList",
                    areaType: "big"
                });
            }
        }
    });

    reloadQkData();
    refreshDbData();
    refreshZbData();
    refreshYbData();
});

function reloadQkData() {
    $.ajax({
        url: "/mainPage/getGzqkNum",
        data: {timeType: qkVm.get("timeType")},
        success: function (ar) {
            if (ar.success) {
                var obj = ar.data;
                qkVm.set("fqgzNum", obj.fqgzNum);
                qkVm.set("wcgzNum", obj.wcgzNum);
                qkVm.set("gzwclNum", Math.round(obj.wcgzNum * 100 / (obj.fqgzNum || 1)));
                var dbybrwNum = obj.dbrwNum + obj.ybrwNum;
                qkVm.set("dbybrwNum", dbybrwNum);
                qkVm.set("ybrwNum", obj.ybrwNum);
                qkVm.set("rwbllNum", Math.round(obj.ybrwNum * 100 / (dbybrwNum || 1)));
            } else {
                qkVm.set("fqgzNum", 0);
                qkVm.set("wcgzNum", 0);
                qkVm.set("gzwclNum", 0);
                qkVm.set("dbybrwNum", 0);
                qkVm.set("ybrwNum", 0);
                qkVm.set("rwbllNum", 0);
            }
        }
    })
}

function refreshDbData() {
    $.ajax({
        url: "/mainPage/getDbrwWithoutNbrw",
        success: function (ar) {
            if (ar.success) {
                dbVm.set("dblist", ar.data);
            } else {
                dbVm.set("dblist", []);
            }
        }
    })
    $.ajax({
        url: "/mainPage/getNbrw",
        success: function (ar) {
            if (ar.success) {
                dbVm.set("nblist", ar.data);
            } else {
                dbVm.set("nblist", []);
            }
        }
    })
}

function refreshZbData() {
    $.ajax({
        url: "/mainPage/getZbrw",
        success: function (ar) {
            if (ar.success) {
                zbVm.set("list", ar.data);
            } else {
                zbVm.set("list", []);
            }
        }
    })
}

function refreshYbData() {
    $.ajax({
        url: "/mainPage/getYbrw",
        success: function (ar) {
            if (ar.success) {
                ybVm.set("list", ar.data);
            } else {
                ybVm.set("list", []);
            }
        }
    })
}

RX.page.reload = function () {
    reloadQkData();
    refreshDbData();
    refreshZbData();
    refreshYbData();
}

function chooseFlow(){
    RX.page.open({
        title: "发起工作",
        url: "/workflow/platform/chooseFlow",
        areaType: "tree"
    });
}

function runIntro() {
    $("[data-step='1']").attr("data-intro", "<b>工作情况：</b>区域展示您的基础工作情况统计数据，可在右上角切换统计时间段，点击'<i class='iconfont'>&#xe6a4;</i>'按钮查看更多统计信息。");
    $("[data-step='2']").attr("data-intro", "<b>待办任务：</b>区域展示您待处理的工作任务，点击单条工作进行办理，点击'<i class='iconfont'>&#xe6a4;</i>'按钮查看更多信息。<br/>" +
        "<b>拟办工作：</b>区域展示您未提交的工作草稿，点击单条工作继续发起，点击'<i class='iconfont'>&#xe6a4;</i>'按钮查看更多信息。");
    $("[data-step='3']").attr("data-intro", "<b>我发起的工作：</b>区域展示您发起的工作，点击单条工作了解工作具体进展，点击'<i class='iconfont'>&#xe6a4;</i>'按钮查看更多信息。");
    $("[data-step='4']").attr("data-intro", "<b>我参与的工作：</b>区域展示您已办任务相关的工作，点击单条工作了解工作具体进展，点击'<i class='iconfont'>&#xe6a4;</i>'按钮查看更多信息。");
    $("[data-step='5']").attr("data-intro", "<b>发起工作：</b>点击该按钮后，选择一个工作类型，发起工作。");

    introJs().setOption("tooltipPosition", "auto")
        .setOption("positionPrecedence", ['left', 'right', 'bottom', 'top'])
        .setOption("nextLabel", "下一步")
        .setOption("prevLabel", "上一步")
        .setOption("skipLabel", "跳过")
        .setOption("doneLabel", "完成")
        .start();
}
