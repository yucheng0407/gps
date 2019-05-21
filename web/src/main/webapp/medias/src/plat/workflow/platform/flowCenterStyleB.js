var flowVm, timeVm, numVm;
var historyData = _top.RX.page.getData() || {};
var loginUser = RX.cache(top, "USER");//当前登陆用户信息
var timeType = "month";
$(function () {

    numVm = new Rxvm({
        el: "#numArea",
        data: {flowNum: 0, dbrwNum: 0, zblcNum: 0, ybrwNum: 0},
        methods: {
            chooseFlow: function () {
                RX.page.open({
                    title: "发起工作",
                    url: "/workflow/platform/chooseFlow",
                    areaType: "tree"
                });
            },
            dbList: function () {
                RX.page.open({
                    title: "待办任务",
                    url: "/workflow/platform/dbList",
                    areaType: "big"
                });
            },
            zbList: function () {
                RX.page.open({
                    title: "在办工作",
                    url: "/workflow/platform/zbList",
                    areaType: "big"
                });
            },
            ybList: function () {
                RX.page.open({
                    title: "已办工作",
                    url: "/workflow/platform/ybList",
                    areaType: "big"
                });
            }
        }
    })

    timeVm = new Rxvm({
        el: '#timeArea',
        data: {
            timeType: "month",
            timeName: "一月内"
        },
        methods: {
            changeTime: function (time, timeName) {
                this.set("timeType", time);
                this.set("timeName", timeName);
                getPieData();
            }
        }
    });

    flowVm = new Rxvm({
        el: '#flowArea',
        data: {
            list: []
        },
        methods: {
            clickItem: function ($keypath) {
                var obj = this.get($keypath);
                if (obj.DBRW_NUM && obj.DBRW_NUM != "0") {
                    RX.page.open({
                        title: "待办列表：" + loginUser.name,
                        url: "/workflow/platform/dbList",
                        areaType: "big",
                        param: {
                            wfId: obj.WF_ID, wfName: obj.WF_NAME, userId: loginUser.id, userName: loginUser.name,
                            fqlc_id: obj.WF_ID, fqlc_code: obj.WF_CODE, fqlc_name: obj.WF_NAME
                        }
                    });
                } else {
                    RX.confirm("确认发起" + (obj.WF_NAME || "") + "流程？", function () {
                        confirmWorkflowStart({
                            title: "发起" + (obj.WF_NAME || "") + "流程",
                            flowCode: obj.WF_CODE,
                            type: "xz",
                            wfId: obj.WF_ID
                        });
                    })

                }
            }
        }
    });

    getUserTjNum();
    reloadFlowData();
    getPieData();
});

function getUserTjNum() {
    $.ajax({
        url: "/mainPage/getUserTj",
        success: function (ar) {
            if (ar.success) {
                numVm.set("dbrwNum", ar.data.DBRW_NUM);
                numVm.set("zblcNum", ar.data.ZBLC_NUM);
                numVm.set("ybrwNum", ar.data.YBRW_NUM);
            } else {
                numVm.set("dbrwNum", 0);
                numVm.set("zblcNum", 0);
                numVm.set("ybrwNum", 0);
            }
        }
    })
}

function reloadFlowData() {
    $.ajax({
        url: "/mainPage/getWorkflowTjWithFlowType",
        success: function (ar) {
            if (ar.success) {
                flowVm.set("list", ar.data);
                numVm.set("flowNum", ar.data.length);
            } else {
                flowVm.set("list", []);
            }
        }
    })
}

function getPieData() {
    $.ajax({
        url: "/workflow/platform/getUserPieData",
        data: {timeType: timeVm.get("timeType"), userId: loginUser.id},
        success: function (ar) {
            if (ar.success) {
                initPie("pie1", ar.data.dbrw, timeVm.get("timeName") + "待办工作分布图");
                initPie("pie2", ar.data.zbrw, timeVm.get("timeName") + "在办工作分布图");
                initPie("pie3", ar.data.ybrw, timeVm.get("timeName") + "已办工作分布图");
            }
        }
    })
}

function initPie(id, data, title) {
    Highcharts.chart(id, {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: title
        },
        tooltip: {
            pointFormat: '数量: <b>{point.y}</b><br/>占比: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer'
            }
        },
        series: [{
            name: '占比',
            colorByPoint: true,
            data: data
        }],
        //没有数据提示相关代码
        lang: {
            noData: "没有相关数据"
        },
        noData: {
            style: {
                fontWeight: 'bold',
                fontSize: '15px',
                color: '#303030'
            }
        }
    });
}


RX.page.reload = function () {
    reloadFlowData();
    getPieData();
}
