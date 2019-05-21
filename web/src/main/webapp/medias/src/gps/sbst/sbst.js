var interval;
var graphicTool;//上图工具
var dragCircle;//周边查询
var layerControl;//图层控制层
var intervalNum;//定时器更新次数
var policeForceOptions = window.parent.policeForceOptions;
var commonOpt = { //
    layerName: "policeForceLayer",
    size: 25,
    hasLabel: true, //是否添加注记
    column: [{
        name: "设备名称",
        type: "SBMC", isClick: true, isMove: true, isLabel: true
    },
        {
            name: "所属派出所名称",
            type: "SSPCSMC", isClick: true, isMove: true
        },
        {
            name: "在线状态",
            type:
                "ZXZT", isClick:
            true, isMove:
            true
        }
        ,
        {
            name: "最后在线时间",
            type:
                "GXSJ", isClick:
            true, isMove:
            true
        }
    ],
    buttons: [{
        id: "gjbf",
        alias: "轨迹播放"
    }
    ],
    clickInfoWindowHeight: 200
}
var options = {
    'jc': addOption(commonOpt, "imgUrl", RX.handlePath("/medias/src/gps/gpsImg/jc.png")),
    'lxjc': addOption(commonOpt, "imgUrl", RX.handlePath("/medias/src/gps/gpsImg/jc_lx.png"))
}

function addOption(option, attrName, attr) {
    var newOpt = JSON.parse(JSON.stringify(option));
    newOpt[attrName] = attr;
    return newOpt;
}

getMap({
    list: ["RXMap/dragCircle", "RXMap/graphicTool", "RXMap/layerControl"],
    callBack: function (global) {
        graphicTool = global.GraphicTool;
        dragCircle = global.DragCircle;
        layerControl = global.LayerControl;
        graphicTool.clearCallBack(function () {
            clearPoliceForceMap()
        })
    }
});

function st(zyids) {
    clearPoliceForceMap();
    timeJob(zyids);
   // interval = setInterval(timeJob, 1000 * 30, zyids);
}
/**
 * 清除警力警情图层
 */
function clearPoliceForceMap() {
    if (interval) {
        clearInterval(interval);
        interval = null;
    }
    intervalNum = 1;
    layerControl.clearLayerByGroup("policeForce");
}
function timeJob(zyids) {
    $.ajax({
        type: "post",
        url: "/sbst/getSbbhList",
        data: {zyids: zyids},
        dataType: "json",
        success: function (ar) {
            graphicTool.addGeometrysByLevel(ar.data, 11, "LXMC", null, options);
        }
    });
}

/**
 * 按钮绑定
 */
// $(function () {
//     window.parent.$(".cjjl_tit i").click(closeCjjl);
//
//     //推送值班长
//     $("#report").on('click', function () {
//         window.parent.frames[2].sendZbz(jjjqId);
//         $("#report").hide();
//     });
//
//     //警力资源类型绑定事件
//     $('#checkbox').find('input[type=checkbox]').on('click', function () {
//         $('#checkbox').find('input[type=checkbox]').not(this).attr("checked", false);
//         if (!$(this).attr("checked")) {
//             $('#checkbox').find('input[type=checkbox]').not(this).attr("checked", true);
//         }
//         addPoints(singleRowData, isDispatchAgain);
//     });
//
//     //再次调度绑定事件
//     $("#dispatchAgain").on('click', function () {
//         isDispatchAgain = true;
//         jlzyList(singleRowData, isDispatchAgain);
//     })
// })
function gjbf(graphicAttr) {
    var $m = window.parent.$('[href="/gps/main/gjbf"]');
    $m.click();
    window.location.href = $m.prop("href") + "?sbmc=" + RX.encode(graphicAttr.SBMC)+ "&zyid=" + graphicAttr.ZYID;
}