var jqzt = RX.page.param.type;
var zyid = RX.page.param.zyid;
var sbmc = RX.page.param.sbmc;
var jlzyVm;
var interval;
var graphicTool;//上图工具
var dragCircle;//周边查询
var layerControl;//图层控制层
var policeForceOptions = window.parent.policeForceOptions;
var MoveTool;//轨迹播放工具
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
    clickInfoWindowHeight: 180
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
    list: ["RXMap/dragCircle", "RXMap/graphicTool", "RXMap/layerControl","RXMap/pointMoveNew"],
    callBack: function (global) {
        graphicTool = global.GraphicTool;
        dragCircle = global.DragCircle;
        layerControl = global.LayerControl;
        MoveTool = global.PointMoveNew;
        graphicTool.clearCallBack(function () {
            clearPoliceForceMap()
        })
    }
});

//视图初始化
zbxxVm = new Rxvm({
    el:'.lsgj',
    template: '#zbxxZbForm',
    config: zbxxConfig
});
zbxxVm.set("sbmc", sbmc);
zbxxVm.set("zyid", zyid);
function sbbhTreeFun(node,name) {
    zbxxVm.set("sbmc", name);
    zbxxVm.set("zyid", node);
}
/**
 * 联想输入改变触发事件
 * @param model
 * @param linkName
 * @param linkId
 * @param keypath
 * @param linkPhone
 */
function thinkChange(model, linkName, linkId, keypath, linkPhone) {
    model.set("zyid", linkId);
}

/**
 * 联想
 * @param keyword
 * @param instance
 * @param cid
 * @returns {*}
 */
function think(keyword, instance, cid) {
    var list;
    $.ajax({
        type: "post",
        url: "/gjbf/getSbbh",
        data: {sbmc: keyword},
        async: false,
        success: function (ar) {
            list = ar.data;
        }
    });
    return list;
}
function cxgj() {
    // new MoveTool([{X:118.2,Y:31.1},{X:118.3,Y:31.1},{X:118.3,Y:31.2},{X:118.2,Y:31.2},{X:118.2,Y:31.1}], null, null, true)
    zbxxVm.set("kssj", $("#kssj").val())
    zbxxVm.set("jssj", $("#jssj").val())
    if (zbxxVm.ruleValidate()) {
        MoveTool.clearMove();
        $.ajax({
            type: "post",
            url: "/gjbf/searchSbbh",
            data: {map: zbxxVm.getJson()},
            dataType: "json",
            async: false,
            success: function (ar) {
                if (ar.success && ar.data) {
                    if (ar.data.length > 1) {
                       new MoveTool(ar.data, null, null, true)
                    }
                    else {
                        RX.alert("没有轨迹数据！");
                    }
                }
            }
        });
    }
}
$(".auto_ico_box .date,.auto_ico_box .eliminate").click(function () {
    var $input = $(this).parents(".query_element_box").find("input");
    if (this.className == 'date') {
        $input.focus()
    } else if (this.className == 'eliminate') {
        var name = $input.attr("rx-path");
        zbxxVm.set($input.attr("rx-path"), "");
        $input.val("");
        if (name == 'kssj') clearedFunc();
    }
});

var md = "'#F{\'new Date()\'}'"; //第二个输入框最大值的全局变量
var kssj;

//第一个输入框选择好日期的时候操作
function pickedFunc() {
    var day = 1;//相隔天数
    kssj = $dp.cal.getDateStr();
    var Y = $dp.cal.getP('y'); //用内置方法获取到选中的年月日
    var M = $dp.cal.getP('M');
    var D = $dp.cal.getP('d');
    M = parseInt(M, 10) - 1;
    D = parseInt(D, 10) + day; //字符串的数字转换成int再运算。并且如果超过30天，也能自动处理。
    var d = new Date($dp.cal.getDateStr());
    d.setFullYear(Y, M, D);//设置时间
    var nowDate = new Date();
    if (nowDate <= d) { //现在的时间比较，如果算出来的值大于现在时间，修改全局变量md为现在时间。
        md = "'#F{\'new Date()\'}'";
    } else { //全局变量设置为算出来的值得
        //  md = '#F{$dp.$D(\'kssj\',{d:' + day + '})}';
        var month = d.getMonth() + 1; //月份的范围是（0到11）;
        md = d.getFullYear() + "-" + month + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds(); //直接把d给过去会有问题，所以拼成字符串发过去
    }
}

//第一个清空的时候的操作
function clearedFunc() {
    md = "'#F{\'new Date()\'}'";
}

//给第一个输入框定义规则
function picker1rule(ele) {
    WdatePicker({
        el: ele,
        dateFmt: 'yyyy-MM-dd HH:mm:ss',
        maxDate: '#F{$dp.$D(\'jssj\')||\'new Date()\'}',
        minDate: '#F{$dp.$D(\'jssj\',{d:-1})}',
        onpicked: pickedFunc,
        oncleared: clearedFunc
    });
}

//给第二个输入框定义规则
function picker2rule(ele) {
    WdatePicker({el: ele, dateFmt: 'yyyy-MM-dd HH:mm:ss', minDate: '#F{$dp.$D(\'kssj\')}', maxDate: md})
}
