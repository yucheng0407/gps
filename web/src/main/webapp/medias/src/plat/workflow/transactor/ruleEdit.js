var ruleVm,
    param = RX.page.param;
$(function () {
    if (param.type !== "xg") {
        $(".secondPos").show();
    }
    ruleVm = new Rxvm({
        widget: RX.Grid,
        el: '.form_box',
        data: {
            list: param.data ? param.data.glSourceList : []
        },
        methods: {
            //选择
            selRule: function () {
                //选择没有分配过管理员的用户
                RX.page.open({
                    title: "请选择规则",
                    url: "/rule/ruleSelect",
                    param: {
                        func: "ruleSelectCallback",
                        ids: RX.getValidateDataIds(ruleVm.get("list"), "objectId"),
                        mulchose: true
                    }
                });
            },
            delRule: function (keypath) {
                this.set(keypath + ".sfyxSt", "UNVALID");
            }
        }
    });

    $("#save").click(function () {
        var ruleList = ruleVm.get("list");
        if (RX.hasValidateData(ruleList)) {
            var evalFunc = RX.page.prev().prev().window.RX.getGlobalFunc(param.callbackFunc);
            var result = evalFunc({
                transactorId: "",
                type: "5",
                hasExtra: "0",
                sfyxSt: "VALID",
                glSourceList: ruleList
            }, param.keypath);
            if (result || typeof(result) == "undefined") {
                RX.page.closeAll();
            }
        } else {
            RX.msg(RX.ICON_WARNING, "请选择至少一个规则");
        }
    });
});

//选择规则后回调
function ruleSelectCallback(sels) {
    var obj;
    for (var i = 0, maxLength = sels.length; i < maxLength; i++) {
        obj = sels[i];
        ruleVm.append("list", {
            id: "",
            sourceId: "",
            objectId: obj.GL_RULE_ID,
            objectType: "5",
            sourceObj: {
                rule_name: obj.RULE_NAME,
                sxfs: obj.GZSXFS
            },
            sfyxSt: "VALID"
        });
    }
}