var ybVm;
$(function () {
    tableSettings.autoListBox.onRowDblClick = function (rowIndex, rowData, isSelected, event) {
        handleWorkflowByTaskId(rowData.TASK_ID);
    };
    ybVm = new Rxvm({
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
        }
    });
});

RX.page.reload = function () {
    ybVm.reloadGrid();
    if(RX.page.prev()){
        RX.page.prev().reload();
    }
};