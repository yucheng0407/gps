/**
 * SysOrgan(机构)表单
 */
var param = RX.page.param;
var id = param.id, parentOrganId = param.parentOrganId, //上级机构ID
    parentOrganName = param.parentOrganName,//上级机构名称
    sysOrganFormVm;

var loginUser = RX.cache(top, "USER");//当前登陆用户信息
var loginUserRoleLevel = loginUser.roleLevel,//当前登陆用户最高角色级别
    loginUserRoleLevelId = loginUser.roleLevelId;//当前登陆用户最高角色级别角色id
$(function () {
    //初始化表单按钮控件
    RX.button.init($("#w_butt"), buttonsJson, "xz");
    //视图初始化
    sysOrganFormVm = new Rxvm({
        el: '.form_box',
        template: '#sysOrganForm',
        config: config,
        settings: {
            getData: {
                url: id && "/organ/getSysOrganById",
                param: {id: id},
                defaultData: {sysGlbRoleList: [], sysGlbPostList: []}
            }
        },
        //子组件声明
        components: {
            "SysGlbRoleGrid": {
                widget: RX.Grid,
                template: '#sysGlbRole',
                config: sysGlbRoleConfig,
                methods: {
                    addSysGlbRole: function () {
                        RX.page.open({
                            title: "查找",
                            url: "/role/roleSelect",
                            param: {
                                ifOwn: "owner",
                                func: "sysRoleSelectCallback",
                                selIds: this.getExistRoleIds(),
                            }
                        });
                    },
                    deleteSysGlbRole: function (keypath) {
                        this.set(keypath + ".sfyxSt", "UNVALID");
                    },
                    getExistRoleIds: function () {
                        var idArr = [];
                        $.each(this.get("list"), function (i, t) {
                            if (t.sfyxSt !== "UNVALID") {
                                idArr.push(t.roleId);
                            }
                        });
                        return idArr.join();
                    }
                }
            }
        },
        afterMount: function () {
            if (parentOrganId) {
                sysOrganFormVm.set("parentName", parentOrganName);
                sysOrganFormVm.set("parentOrg", parentOrganId);
            }
            //向主对象中添加loginUserRoleLevel
            this.set("loginUserRoleLevel", loginUserRoleLevel);
            //向主对象中添加loginUserRoleLevelId
            this.set("loginUserRoleLevelId", loginUserRoleLevelId);
        }
    });
});


/**
 * 保存方法
 */
function save() {
    if (sysOrganFormVm.ruleValidate()) {
        $.ajax({
            type: "post",
            url: "/organ/saveSysOrgan",
            data: {sysOrgan: sysOrganFormVm.getJson()},
            dataType: "json",
            async: false,
            success: function (ar) {
                if (ar.success) {
                    RX.msg(RX.SUCCESS_SAVE);
                    RX.page.prev().window.reloadParentNode();
                    RX.page.prev().reload();
                    RX.page.close();
                } else {
                    RX.alert(ar.msg);
                }
            }
        });
    }
}

//选择角色回调
function sysRoleSelectCallback(rows) {
    $.each(rows, function (i, t) {
        sysOrganFormVm.append("sysGlbRoleList", {
            roleId: t.ID,
            roleName: t.ROLE_NAME,
            roleCode: t.ROLE_CODE,
            roleTypeName: t.ROLE_TYPE_NAME,
            roleType: t.ROLE_TYPE,
            glType: '2',
            levels: t.LEVELS,
            createRoleId: t.CREATE_ROLE_ID
        });
    });
}

//添加树类型，过滤id
function addOrganId() {
    var organId = sysOrganFormVm.get("id");
    var str = "&filterId=" + organId + "&treeType=" + 1 + "&filterLx=jg";
    return str;
}

//选择上级机构机构回调函数
function parentOrganSelectCallback(id, name) {
    sysOrganFormVm.set("parentName", name);
    sysOrganFormVm.set("parentOrg", id);
}
