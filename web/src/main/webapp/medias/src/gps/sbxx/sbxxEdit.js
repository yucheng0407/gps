var roleVm,                 //角色对象
    param = RX.page.param,
    // wfTag = param.wfTag,    //工作流跳转标志
    type = param.type,    //标志位
    id = param.id,    //角色id
    func = param.func,
    roleType,
    canCancel = false;
// wfRoleMade;   //用于流程角色组成类别
$(function () {
    roleVm = new Rxvm({
        el: '.form_box',
        config: roleConfig,
        settings: {
            getData: {
                url:id ? "/sbxx/getSbxx?id=" + id + "&random=" + Math.random() : null
            }
        },
        afterMount: function () {

        }
    });
    //保存
    $("#save").click(function () {
        if (roleVm.ruleValidate()) {
            var param = {sbxx: roleVm.getJson()};
            // //修改状态，流程角色
            // if (roleVm.get("id") && roleVm.get("roleType") === "2" && wfRoleMade !== roleVm.get("wfRoleMade")) {
            //     param.clearFlag = true;
            // } else {
            // param.clearFlag = false;
            // }
            $.ajax({
                type: "post",
                url: "/sbxx/saveSbxx",
                data: param,
                success: function (ar) {
                    if (ar.success) {
                        RX.msg(RX.SUCCESS_SAVE);
                        RX.page.prev().reload();
                        RX.page.close();
                    } else {
                        RX.alert(ar.msg);
                    }
                }
            });
        }
    });
    //关联设置
    $("#chooseOrgan").click(function () {
        gotoChooseOrgan($(this).val());
    });

});
RX.page.cancelCheck = function () {
    if (canCancel) {
        return true;
    } else {
        if (roleVm.ifChange()) {
            RX.confirm(RX.CANCEL_CHECK, function () {
                RX.page.close();
            });
            return false;
        }
        return true;
    }
};