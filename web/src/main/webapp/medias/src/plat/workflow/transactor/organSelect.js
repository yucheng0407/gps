var organGridVm,
    param = RX.page.param,
    func = param.func;            //回调函数
$(function () {
    organSettings.autoListBox.dischose = true;
    organSettings.autoListBox.disObject = {ID: param.ids};
    organGridVm = new Rxvm({
        widget: RX.Grid,
        el: '.base_box',
        settings: organSettings,
        config: organConfig
    });
    //确认
    $("#confirm").click(function () {
        selectItem();
    });
});

function selectItem() {
    var obj = organGridVm.getSelected();
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