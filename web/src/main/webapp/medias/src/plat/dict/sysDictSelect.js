var id = RX.page.param.func;
var sysDictGridVm;
$(function () {
    sysDictGridVm = new Rxvm({
        widget: RX.Grid,
        el: '.base_box',
        settings: sysDictSettings,
        config: sysDictConfig

    });
    $("#confirm").click(function () {
        selectItem();
    });
});

function selectItem() {
    var obj = sysDictGridVm.getSelected();//获取选中行的数据
    if (obj == null || obj.length != 1) {
        RX.alert("请选一条数据");
    } else {
        var evalFunc = RX.page.prevWin().RX.getGlobalFunc(RX.page.param.func);
        var result = evalFunc(obj[0].DICT_CODE, obj[0].DICT_NAME, obj[0].IS_EMPTY);
        if (result || typeof(result) == "undefined") {
            RX.page.close();
        }
    }
}


