var conditionVm,
    param = RX.page.param,
    id;
$(function () {
    if (param.type !== "xg") {
        $(".secondPos").show();
    }
    var data;
    if (param.data && param.data.glSourceList) {
        //限制条件只有一条
        data = param.data.glSourceList[0];
    } else {
        data = {
            id: "",
            sourceId: "",
            objectId: "",
            //限制条件
            objectType: "4",
            sourceObj: {
                sfyxSt: "VALID"
            },
            sfyxSt: "VALID"
        };
    }
    conditionVm = new Rxvm({
        el: '.p_box',
        config: conditionConfig,
        data: data.sourceObj
    });
    $("#save").click(function () {
        if (conditionVm.ruleValidate()) {
            //先保存数据
            $.ajax({
                type: "post",
                url: "/workflow/transactor/saveCondition",
                data: {nodeAssigneeCondition: conditionVm.getJson()},
                success: function (ar) {
                    if (ar.success) {
                        conditionVm.set("id", ar.data);
                        data.sourceObj = conditionVm.get();
                        data.objectId = ar.data;
                        var evalFunc = RX.page.prev().prev().window.RX.getGlobalFunc(param.callbackFunc);
                        var result = evalFunc({
                            transactorId: "",
                            type: "4",
                            hasExtra: "0",
                            sfyxSt: "VALID",
                            //数据是否重新创建
                            glSourceList: [data]
                        }, param.keypath);
                        if (result || typeof(result) == "undefined") {
                            RX.page.closeAll();
                        }
                    } else {
                        RX.alert(ar.msg);
                    }
                }
            })
        }
    });
});