var transactorVm;         //规则列表对象
$(function () {
    transactorVm = new Rxvm({
        widget: RX.Grid,
        el: '#dataDiv',
        settings: tableSettings,
        config: searchConfig,
        afterMount: function () {
            RX.button.init($("#operate"), buttonsJson);
        }
    });
});

//新增
function add() {
    RX.page.goto(
        "/workflow/transactor/transactorEdit",
        {
            type: "xz"
        }
    );
}

//修改
function edit() {
    var row = transactorVm.getSelected();
    if (row.length > 0) {
        RX.page.goto("/workflow/transactor/transactorEdit",
            {
                type: "xg",
                id: row[0].ID
            });
    } else {
        RX.msg(RX.SELECT_EDIT);
    }
}

//删除
function del() {
    var obj = transactorVm.getSelected();//获取选中行的数据
    if (obj == null || obj == undefined || obj[0] == null) {
        RX.msg(RX.SELECT_DELETE);
    } else {
        RX.confirm(RX.CONFIRM_DELETE, function () {
            $.ajax({
                type: "post",
                url: "/workflow/transactor/delTransactor",
                data: {id: obj[0].ID},
                async: false,
                success: function (ar) {
                    if (ar.success) {
                        RX.page.reload();
                        RX.msg(RX.SUCCESS_DELETE);
                    } else {
                        RX.alert(ar.msg);
                    }
                }
            });
        });
    }
}

RX.page.reload = function () {
    transactorVm.reloadGrid();
};

