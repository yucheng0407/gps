//视图对象
var gridVm;
$(function () {

    //配置双击事件响应
    settings.autoListBox.onRowDblClick = function (rowIndex, rowData, isSelected, event) {
        RX.page.open({title: "查看版块信息", url: "/forum/boardView?id=" + rowData.ID});
    };

    //视图对象初始化
    gridVm = new Rxvm({
        widget: RX.Grid,
        el: '.base_box',
        settings: settings,
        config: config,
        afterMount: function () {
            RX.button.init($("#operate"), buttonsJson);
        }
    });

});

// 新增模块
function addBoard() {
    var url = "/forum/boardEdit";
    RX.page.open({title: "新增版块", url: url, param: {type: "xz"}});
}

// 修改版块
function editBoard() {
    var rowData = gridVm.getSelected();
    if (rowData.length === 1) {
        RX.page.open(
            {
                title: "修改版块",
                url: "/forum/boardEdit",
                param: {
                    type: "xg",
                    id: rowData[0].ID
                }
            });
    } else {
        RX.msg(RX.SELECT_EDIT);
    }
}

// 删除board
function delBoard() {
    var rowData = gridVm.getSelected();//获取选中行的数据
    if (rowData == null || rowData == undefined || rowData[0] == null) {
        RX.msg(RX.SELECT_DELETE);
    } else {
        RX.confirm(RX.CONFIRM_DELETE, function (index) {
            $.ajax({
                url: "/forum/deleteBoard?boardId=" + rowData[0].ID,
                success: function (ar) {
                    if (ar.success) {
                        RX.msg(RX.SUCCESS_DELETE);
                        RX.page.prev().reload();
                    } else {
                        RX.alert(ar.msg);
                    }
                }
            });
        });
    }
}

//刷新全局接口
RX.page.reload = function () {
    gridVm.reloadGrid();
};