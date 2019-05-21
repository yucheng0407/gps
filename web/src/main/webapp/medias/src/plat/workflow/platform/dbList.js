var dbVm;
$(function () {
    tableSettings.autoListBox.onRowDblClick = function (rowIndex, rowData, isSelected, event) {
        handleWorkflowByTaskId(rowData.TASK_ID);
    };
    dbVm = new Rxvm({
        widget: RX.Grid,
        template: "loadTpl:noButtonGridTpl",
        el: '.base_box',
        settings: tableSettings,
        config: SearchConfig,
        afterMount: function () {
            if (RX.page.param.showReturn) {
                var $th = $("<th></th>");
                var $input = $('<input class="query_buttonB" type="button" value="返回">');
                $input.click(function () {
                    RX.page.back();
                });
                $th.append($input);
                $(".query_box").find("tr").eq(0).append($th);
            }
            if (RX.page.param.fqlc_id) {
                var $th = $("<th></th>");
                var $input = $('<input class="query_buttonB" type="button" value="发起工作：' + RX.page.param.fqlc_name + '">');
                $input.click(function () {
                    confirmWorkflowStart({
                        title: "发起" + (RX.page.param.fqlc_name || "") + "流程",
                        flowCode: RX.page.param.fqlc_code,
                        type: "xz",
                        wfId: RX.page.param.fqlc_id
                    });
                });
                $th.append($input);
                $(".query_box").find("tr").eq(0).append($th);
            }
        }
    });
});

RX.page.reload = function () {
    dbVm.reloadGrid();
    if (RX.page.prev()) {
        RX.page.prev().reload();
    }
};