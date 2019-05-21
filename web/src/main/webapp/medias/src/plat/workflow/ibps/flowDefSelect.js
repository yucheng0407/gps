var flowDefGridVm,
    param = RX.page.param,
    func = param.func;            //回调函数
$(function () {
    flowDefSettings.autoListBox.dischose = true;
    if (param.code) {
        flowDefSettings.autoListBox.disObject = {CODE: param.code};
    }
    flowDefGridVm = new Rxvm({
        widget: RX.Grid,
        el: '.base_box',
        settings: flowDefSettings,
        config: flowDefConfig,
        afterMount: function () {
            if (param.myCode) {
                flowDefGridVm.autoQuery.set("query.myCode", param.myCode);
            }
        }
    });
    //确认
    $("#confirm").click(function () {
        selectItem();
    });
});

function selectItem() {
    var obj = flowDefGridVm.getSelected();
    if (obj == null || obj == undefined || obj[0] == null) {
        RX.msg(RX.SELECT_DATA);
    } else {
        var evalFunc = RX.page.prevWin()[func];
        var result = evalFunc(obj);
        if (result || typeof(result) == "undefined") {
            RX.page.close();
        }
    }
}