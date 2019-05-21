var roleVm, extraVm, param = RX.page.param
$(function () {
    if (param.type !== "xg") {
        $(".secondPos").show();
    }
    var extraData = {
        objectType: "4",
        sourceObj: {
            sfyxSt: "UNVALID"
        },
        sfyxSt: "UNVALID"
    };
    var roleList = [];
    param.data && param.data.glSourceList && $.each(param.data.glSourceList, function (index, da) {
        //角色
        if (da.objectType === "3") {
            roleList.push(da);
        } else if (da.objectType === "4") {
            //限定条件
            extraData = da;
        }
    });
    //数据筛选
    roleVm = new Rxvm({
        el: '.form_box',
        widget: RX.Grid,
        data: {list: roleList},
        methods: {
            selRole: function () {
                RX.page.open({
                    title: "选择角色",
                    url: "/role/roleSelect",
                    param: {
                        func: "roleSelectCallback",
                        selIds: RX.getValidateDataIds(roleVm.get("list"), "objectId"),
                        // ifOwn: "owner",
                        mulchose: true
                    }
                });
            },
            delRole: function (keypath) {
                this.set(keypath + ".sfyxSt", "UNVALID");
            }
        },
        afterMount: function () {
            extraVm = new Rxvm({
                el: '#extraSource',
                template: "#templateExtra",
                //根据数据是否存在
                data: extraData.sourceObj,
                config: conditionConfig,
                methods: {
                    addCondition: function () {
                        this.set("sfyxSt", "VALID");
                    },
                    delCondition: function () {
                        this.set("sfyxSt", "UNVALID");
                    }
                }
            });
        }
    });

    $("#save").click(function () {
        //如果存在extraVm则先保存限定条件，在保存数据
        var roleList = roleVm.get("list");
        if (RX.hasValidateData(roleList)) {
            if (extraVm.get("sfyxSt") === "UNVALID" || extraVm.ruleValidate()) {
                if (extraVm.get("id") || extraVm.get("sfyxSt") !== "UNVALID") {
                    //保存数据
                    $.ajax({
                        type: "post",
                        url: "/workflow/transactor/saveCondition",
                        data: {nodeAssigneeCondition: extraVm.getJson()},
                        async: false,
                        success: function (ar) {
                            if (ar.success) {
                                extraVm.set("id", ar.data);
                            } else {
                                RX.alert(ar.msg);
                            }
                        }
                    })
                }
                extraData.sourceObj = extraVm.get();
                extraData.objectId = extraVm.get("id");
                extraData.sfyxSt = extraVm.get("sfyxSt");
                extraData && (extraData.id || extraVm.get("sfyxSt") !== "UNVALID") && roleList.push(extraData);
                var evalFunc = RX.page.prev().prev().window.RX.getGlobalFunc(param.callbackFunc);
                var result = evalFunc({
                    transactorId: "",
                    type: "3",
                    hasExtra: extraVm.get("sfyxSt") !== "UNVALID" ? "1" : "0",
                    sfyxSt: "VALID",
                    //数据是否重新创建
                    glSourceList: roleList
                }, param.keypath);
                if (result || typeof(result) == "undefined") {
                    RX.page.closeAll();
                }
            }
        } else {
            RX.msg(RX.ICON_WARNING, "请选择至少一个角色");
        }
    });
});

//选择角色后回调
function roleSelectCallback(sels) {
    var obj;
    for (var i = 0, maxLength = sels.length; i < maxLength; i++) {
        obj = sels[i];
        roleVm.append("list", {
            id: "",
            sourceId: "",
            objectId: obj.ID,
            objectType: "3",
            sourceObj: {
                roleName: obj.ROLE_NAME || "",
                roleType: obj.ROLE_TYPE || ""
            },
            sfyxSt: "VALID"
        });
    }
}