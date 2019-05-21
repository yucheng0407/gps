var userVm;
$(function () {
    //传入数据
    //按传入的数据构建
    var param = RX.page.param;
    if (param.type !== "xg") {
        $(".secondPos").show();
    }
    userVm = new Rxvm({
        widget: RX.Grid,
        el: '.form_box',
        data: {
            list: param.data ? param.data.glSourceList : []
        },
        methods: {
            //选择
            selUser: function () {
                //选择没有分配过管理员的用户
                RX.page.open({
                    title: "请选择用户",
                    url: "/role/noAdminUserSelect",
                    param: {
                        func: "userSelectCallback",
                        bizAdminAllowed: true,
                        ids: RX.getValidateDataIds(userVm.get("list"), "objectId")
                    }
                });
            },
            delUser: function (keypath) {
                this.set(keypath + ".sfyxSt", "UNVALID");
            }
        }
    });
    $("#save").click(function () {
        //回到办理人页面，将选择的数据传入，选择回调时封装办理热人来源+办理人来源关联表数据
        //怎么将数据回传到主vm中
        var userList = userVm.get("list");
        if (RX.hasValidateData(userList)) {
            var evalFunc = RX.page.prev().prev().window.RX.getGlobalFunc(param.callbackFunc);
            var result = evalFunc({
                transactorId: "",
                type: "1",
                hasExtra: "0",
                sfyxSt: "VALID",
                glSourceList: userList
            }, param.keypath);
            if (result || typeof(result) == "undefined") {
                RX.page.closeAll();
            }
        } else {
            RX.msg(RX.ICON_WARNING, "请选择至少一个用户");
        }
    });
});

//选择用户后回调
function userSelectCallback(sels) {
    var obj;
    //构建关联关系
    for (var i = 0, maxLength = sels.length; i < maxLength; i++) {
        obj = sels[i];
        userVm.append("list", {
            id: "",
            sourceId: "",
            objectId: obj.ID,
            objectType: "1",
            sourceObj: {
                //用户的显示信息
                userName: obj.USER_NAME,
                sex: obj.SEX,
                dftOrganName: obj.ORGAN_NAME || ""
            },
            sfyxSt: "VALID"
        });
    }
}