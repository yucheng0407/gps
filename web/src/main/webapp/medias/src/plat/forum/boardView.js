// 版块信息查看
var boardVm;
var id = RX.page.param.id;
$(function () {

    //初始化表单按钮控件
    buttons = RX.button.init($("#w_butt"), buttonsJson, "ck");

    //视图初始化
    boardVm = new Rxvm({
        el: '.form_box',
        config: config,
        settings: {
            getData: {
                url: "/forum/getForumBoardById?id=" + id
            }
        }
    });
});