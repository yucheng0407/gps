var param = RX.page.param;
$(function () {
    var ruleVm,
        func = param.func,
        ids = param.ids;
    tableSettings.autoListBox.dischose = true;
    tableSettings.autoListBox.disObject = {
        id: ids
    };
    ruleVm = new Rxvm({
        widget: RX.Grid,
        el: '.form_box',
        template: "loadTpl:noButtonGridTpl",
        settings: tableSettings,
        config: searchConfig
    });
    $("#confirm").click(function () {
        var sel = ruleVm.getSelected();
        if (sel.length > 0) {
            var evalFunc = RX.page.prevWin()[func];
            result = evalFunc(sel);
            if (result || typeof(result) === "undefined") {
                RX.page.close();
            }
        } else {
            RX.msg(RX.msg_warning, "请选择一条数据");
        }
    });
});


