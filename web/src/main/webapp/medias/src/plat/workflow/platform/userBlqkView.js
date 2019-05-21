var blqkVm;
var loginUser = RX.cache(top, "USER");//当前登陆用户信息
var param = RX.page.param;
$(function () {

    if (!param.userId) {
        param.userId = loginUser.id;
        param.userName = loginUser.name;
    }

    $("#title").text(param.userName + "：用户办理情况");

    if (param.showReturn) {
        $("#back").show();
        $("#back").click(function () {
            RX.page.back();
        });
    }

    blqkVm = new Rxvm({
        widget: RX.Grid,
        el: '#dataDiv',
        data: {
            query: {
                userId: param.userId
            }
        },
        settings: tableSettings
    });

    if (!loginUser.dftDeptId) {
        $("#organView").hide();
    } else {
        $("#organView").click(function () {
            RX.page.refresh({
                showReturn: param.showReturn,
                organId: loginUser.dftDeptId,
                organName: loginUser.dftDeptName
            }, null, "/workflow/platform/organBlqkView");
        })
    }


    $("#timeType").select2({minimumResultsForSearch: -1});
    $("#timeType").change(function () {
        getData();
    })

    getData();

});

function getData() {
    var timeType = $("#timeType").val();
    $.ajax({
        url: "/workflow/platform/getUserPieData",
        data: {timeType: timeType, userId: param.userId},
        success: function (ar) {
            if (ar.success) {
                initPie("pie1", ar.data.dbrw, $("#timeType option:selected").text() + "待办工作分布图");
                initPie("pie2", ar.data.zbrw, $("#timeType option:selected").text() + "在办工作分布图");
                initPie("pie3", ar.data.ybrw, $("#timeType option:selected").text() + "已办工作分布图");
            }
        }
    })
    blqkVm.set("query.timeType", timeType);
    blqkVm.reloadGrid();
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
    getData();
};