var organVm, extraVm, param = RX.page.param;
$(function () {
    if (param.type !== "xg") {
        $(".secondPos").show();
    }
    var organList = [], roleList = [];
    param.data && param.data.glSourceList && $.each(param.data.glSourceList, function (index, da) {
        //机构
        if (da.objectType === "2") {
            organList.push(da);
        } else if (da.objectType === "3") {
            //角色
            roleList.push(da);
        }
    });
    //数据需要组织下，分为机构的限定和角色的限定，数据传入时没有区分
    organVm = new Rxvm({
        widget: RX.Grid,
        el: '.form_box',
        data: {
            list: organList
        },
        methods: {
            //选择
            selOrgan: function () {
                RX.page.open({
                    title: "选择机构",
                    url: "/workflow/transactor/organSelect",
                    param: {
                        func: "organSelectCallback",
                        ids: RX.getValidateDataIds(organVm.get("list"), "objectId")
                    }
                });
            },
            delOrgan: function (keypath) {
                this.set(keypath + ".sfyxSt", "UNVALID");
            }
        },
        afterMount: function () {
            extraVm = new Rxvm({
                el: '#extraSource',
                template: "#templateExtra",
                widget: RX.Grid,
                data: {list: roleList, extra: RX.hasValidateData(roleList)},
                methods: {
                    addCondition: function () {
                        this.set("extra", true);
                    },
                    selRole: function () {
                        RX.page.open({
                            title: "选择角色",
                            url: "/role/roleSelect",
                            param: {
                                func: "roleSelectCallback",
                                // roleLevel: "2",
                                selIds: RX.getValidateDataIds(extraVm.get("list"), "objectId"),
                                // ifOwn: "owner",
                                // notShowType: "3",
                                mulchose: true
                            }
                        });
                    },
                    delRole: function (keypath) {
                        this.set(keypath + ".sfyxSt", "UNVALID");
                        var extraArr = this.get("list");
                        var hasExtra = false;
                        if (extraArr && extraArr.length) {
                            for (var i = 0, modelsLength = extraArr.length; i < modelsLength; i++) {
                                if (extraArr[i].sfyxSt !== "UNVALID") {
                                    hasExtra = true;
                                    break;
                                }
                            }
                        }
                        if (!hasExtra) {
                            this.set("extra", false);
                        }
                    }
                }
            })
            ;
        }
    });
    $("#save").click(function () {
        var organs = organVm.get("list");
        if (RX.hasValidateData(organs)) {
            var organData = {
                //指定机构
                type: "2"
            };
            var users = extraVm.get("list");
            if (users && users.length) {
                organs = organs.concat(users);
                organData.hasExtra = "1";
            } else {
                organData.hasExtra = "0";
            }
            organData.glSourceList = organs;
            var evalFunc = RX.page.prev().prev().window.RX.getGlobalFunc(param.callbackFunc);
            var result = evalFunc(organData, param.keypath);
            if (result || typeof(result) == "undefined") {
                RX.page.closeAll();
            }
        } else {
            RX.msg(RX.ICON_WARNING, "请选择至少一个机构");
        }
    });
});

//选择机构后回调
function organSelectCallback(sels) {
    var obj;
    for (var i = 0, maxLength = sels.length; i < maxLength; i++) {
        obj = sels[i];
        organVm.append("list", {
            id: "",
            sourceId: "",
            objectId: obj.ID,
            objectType: "2",
            sourceObj: {
                organName: obj.ORGAN_NAME || "",
                parentOrgan: obj.PARENT_ORG || "",
                fullName: obj.FULL_NAME || ""
            },
            sfyxSt: "VALID"
        });
    }
}

//选择角色后回调
function roleSelectCallback(sels) {
    var obj;
    for (var i = 0, maxLength = sels.length; i < maxLength; i++) {
        obj = sels[i];
        extraVm.append("list", {
            id: "",
            sourceId: "",
            objectId: obj.ID,
            //角色
            objectType: "3",
            sourceObj: {
                roleName: obj.ROLE_NAME || "",
                roleType: obj.ROLE_TYPE || ""
            },
            sfyxSt: "VALID"
        });
    }
}