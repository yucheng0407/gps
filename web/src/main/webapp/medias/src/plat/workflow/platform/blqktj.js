var blqkVm;
$(function () {
    blqkVm = new Rxvm({
        widget: RX.Grid,
        template: "loadTpl:noButtonGridTpl",
        el: '.base_box',
        settings: tableSettings,
        config: SearchConfig,
        afterMount: function () {
            var $th = $("<th></th>");
            var $input = $('<input class="query_buttonB" type="button" value="图形展示">');
            $input.click(function () {
                RX.page.openStack({
                    openWin: window,
                    url: "/workflow/platform/tjtb"
                });
            });
            $th.append($input);
            $(".query_box").find("tr").eq(0).append($th);
        }
    });
});

RX.page.reload = function () {
    blqkVm.reloadGrid();
};