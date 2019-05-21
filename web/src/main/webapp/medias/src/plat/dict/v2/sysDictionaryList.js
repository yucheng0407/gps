var sysDictGridVm;
$(function () {

    //注册双击事件
    sysDictSettings.autoListBox.onRowDblClick = function (rowIndex, rowData, isSelected, event) {
        RX.page.open({
            title: "查看系统字典",
            areaType: [1100, 700],
            url: "/dictionary/sysDictionaryView",
            param: {id: rowData.ID}
        });
    };

    sysDictGridVm = new Rxvm({
        widget: RX.Grid,
        el: '.base_box',
        settings: sysDictSettings,
        config: sysDictConfig,
        afterMount: function () {
            //初始化列表按钮控件
            RX.button.init($("#operate"), buttonsJson);
        }
    });

});

/**
 * 新增系统字典表
 */
function addSysDict() {
    RX.page.open({
        title: "新增系统字典",
        areaType: [1100, 700],
        url: "/dictionary/sysDictionaryEdit"
    });
}

/**
 * 修改系统字典表
 */
function editSysDict() {
    var rowData = sysDictGridVm.getSelected();
    if (rowData.length === 1) {
        RX.page.open({
            title: "修改系统字典",
            areaType: [1100, 700],
            url: "/dictionary/sysDictionaryEdit",
            param: {
                id: rowData[0].ID
            }
        });
    } else {
        RX.msg(RX.SELECT_EDIT);
    }
}

/**
 * 删除系统字典表
 */
function delSysDict() {
    var obj = sysDictGridVm.getSelected();//获取选中行的数据
    if (obj == undefined || obj == null || obj[0] == null) {
        RX.msg(RX.SELECT_DELETE);
    } else {
        RX.confirm(RX.CONFIRM_DELETE, function () {
            $.ajax({
                url: "/dictionary/deleteDictionary?id=" + obj[0].ID,
                success: function () {
                    RX.msg(RX.SUCCESS_DELETE);
                    RX.page.reload();
                }
            });
        });
    }
}

//刷新全局接口
RX.page.reload = function (param) {
    sysDictGridVm.reloadGrid(param);
};