// 版块信息编辑表单
var boardVm;
var param = RX.page.param;
$(function () {
    //初始化表单按钮控件
    RX.button.init($("#w_butt"), buttonsJson, param.type);

    //视图初始化
    boardVm = new Rxvm({
        el: '.form_box',
        config: config,
        settings: {
            getData: {
                url: param.id && "/forum/getForumBoardById",
                param: {id: param.id}
            }
        }
    });

});


/**
 * 保存版块信息
 */
function saveBoard() {
    if (boardVm.ruleValidate()) {
        $.ajax({
            type: "post",
            url: "/forum/saveBoard",
            data: {
                forumBoard: boardVm.getJson()
            },
            dataType: "json",
            async: false,
            success: function (ar) {
                if (ar.success) {
                    RX.msg(RX.SUCCESS_SAVE);
                    RX.page.close();
                    RX.page.prev().reload();
                } else {
                    RX.alert(ar.msg);
                }
            }
        });
    }
}

// 版主选择回调
function userSelectCallBack(id, name) {
    boardVm.set("moderator", name);
    boardVm.set("moderatorId", id);
}

// 版块图标选择回调
function iconSelectCallBack(code) {
    boardVm.set("icon", code);
}

//关闭确认
RX.page.cancelCheck = function () {
    if (boardVm.ifChange()) {
        RX.confirm(RX.CANCEL_CHECK, function (index) {
            RX.page.close();
        });
        return false;
    }
    return true;
};