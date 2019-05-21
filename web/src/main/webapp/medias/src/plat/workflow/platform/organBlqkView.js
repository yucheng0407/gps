var blqkVm;
var loginUser = RX.cache(top, "USER");//当前登陆用户信息
var param = RX.page.param;
$(function () {

    $("#title").text(param.organName + "：部门办理情况");

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
                organId: param.organId
            }
        },
        settings: tableSettings
    });

    $("#userView").click(function () {
        RX.page.refresh({
            showReturn: param.showReturn,
            userId: loginUser.id,
            userName: loginUser.name
        }, null, "/workflow/platform/userBlqkView");
    });
    $("#back").click(function () {
        RX.page.back();
    });

    $("#timeType").select2({minimumResultsForSearch: -1});
    $("#timeType").change(function () {
        getData();
    })

    getData();

});

function getData() {
    var timeType = $("#timeType").val();
    $.ajax({
        url: "/workflow/platform/getOrganColumnData",
        data: {timeType: timeType},
        success: function (ar) {
            if (ar.success) {
                initColumn("pie1", ar.data.dbrw, $("#timeType option:selected").text() + "待办工作排名图");
                initColumn("pie2", ar.data.zbrw, $("#timeType option:selected").text() + "在办工作排名图");
                initColumn("pie3", ar.data.ybrw, $("#timeType option:selected").text() + "已办工作排名图");
            }
        }
    })
    blqkVm.set("query.timeType", timeType);
    blqkVm.reloadGrid();
}

function initColumn(id, data, title) {
    var datax = [];
    var datay = [];
    if (data && data.length) {
        $.each(data, function (i, t) {
            datax.push(t.name);
            datay.push(t.value);
        })
    }
    Highcharts.chart(id, {
        chart: {
            type: 'column'
        },
        title: {
            text: title
        },
        legend: {
            enabled: false
        },
        xAxis: {
            categories: datax,
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: '数量 (项)'
            }
        },
        tooltip: {
            // head + 每个 point + footer 拼接成完整的 table
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0"></td>' +
                '<td style="padding:0"><b>{point.y} 项</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                borderWidth: 0
            }
        },
        series: [{
            data: datay
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