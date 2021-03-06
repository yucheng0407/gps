/**
 * SysUser(用户表)表单
 * 无岗位一人多机构版
 */

var param = RX.page.param;
var id = param.id,
    sysUserFormVm,
    sysUserInfo;

var loginUser = RX.cache(top, "USER");//当前登陆用户信息
var loginUserRoleLevel = loginUser.roleLevel,//当前登陆用户最高角色级别
    loginUserRoleLevelId = loginUser.roleLevelId;//当前登陆用户最高角色级别角色id
$(function () {
    //初始化表单按钮控件
    RX.button.init($("#w_butt"), buttonsJson, "xz");
    //视图初始化
    sysUserFormVm = new Rxvm({
        el: '.user_form',
        template: '#sysUserForm',
        config: config,
        settings: {
            getData: {
                url: id && "/user/getSysUserById",
                param: {id: id},
                defaultData: {
                    sysGlbUser: [],
                    sysGlbRoleList: [],
                    sysOrganRoleList: [],
                    sysUserInfo: {}
                },
                success: function (ar) {
                    if (ar.success) {
                        return ar.data;
                    }
                }
            }
        },
        methods: {
            /**
             * 机构验证：
             * 1.机构为必填项
             * 2.默认机构必须指定
             */
            organValidate: function () {
                var that = this;
                var flag = false;
                //当前有效的的机构
                var validOrgan = that.getValidOrgans();
                if (validOrgan.length === 0) {
                    flag = false;
                    RX.msg(RX.ICON_WARNING, "请设置用户所属机构！");
                    return flag;
                }
                if (validOrgan.length > 0) {
                    $.each(validOrgan, function (i, t) {
                        if (t.organId === that.get("defaultOrganId")) {
                            flag = true;
                        }
                    });
                }
                if (!flag) {
                    RX.msg(RX.ICON_WARNING, "请设置一个机构为默认机构！")
                }
                return flag;
            },
            /**
             * 获取当前有效的机构id拼接
             * @returns {string}
             */
            getValidOrganIds: function () {
                var that = this;
                var validOrganArr = [];
                $.each(that.getValidOrgans(), function (i, t) {
                    validOrganArr.push(t.organId);
                });
                return validOrganArr.join();
            },
            /**
             * 获取当前有效的机构集合
             */
            getValidOrgans: function () {
                var validOrgans = [];
                $.each(sysUserFormVm.get("sysGlbUser"), function (i, t) {
                    if (t.sfyxSt === "VALID") {
                        validOrgans.push(t);
                    }
                });
                return validOrgans;
            },
            /**
             * 获取用户拥有的角色ids
             * @returns {string}
             */
            getExistRoleIds: function () {
                var vm = this;
                var idArr = [];
                //已经单独关联的角色不可选择
                $.each(vm.get("sysGlbRoleList"), function (i, t) {
                    if (t.sfyxSt !== "UNVALID") {
                        idArr.push(t.roleId);
                    }
                });
                //所在机构已经包含的角色，不可选择
                var organRoles = vm.get("sysOrganRoleList");
                $.each(organRoles, function (i, t) {
                    idArr.push(t.roleId);
                });
                return idArr.join();
            }
        },
        //子组件声明
        components: {
            "SysGlbRoleGrid": { //关联角色组件
                widget: RX.Grid,
                template: '#sysGlbRole',
                config: sysGlbRoleConfig,
                methods: {
                    /**
                     * 添加角色
                     *      一个用户只能存在一个管理员角色
                     *      当前用户只能分配自己管理的角色
                     * @returns {boolean}
                     */
                    addSysGlbRole: function () {
                        var glbRoleList = sysUserFormVm.get("sysGlbRoleList");
                        var param = {
                            ifOwn: "owner",
                            func: "sysRoleSelectCallback",
                            selIds: this.$parent.getExistRoleIds(),
                            notShowType:"3",
                            mulchose: true
                        };
                        if (loginUserRoleLevel == '1') { //平台管理员登陆时
                            var hasAdmin = false;
                            //判断是否包含管理员角色
                            $.each(glbRoleList, function (i, t) {
                                if (t.sfyxSt !== "UNVALID" && t.levels === "2") {
                                    hasAdmin = true;
                                    return false;
                                }
                            });
                            param.roleLevel = '2';
                            param.mulchose = false;
                        }
                        if (hasAdmin) {
                            RX.msg(RX.ICON_WARNING, "该用户已经包含管理员角色,无法添加管理员角色!");
                            return false;
                        }
                        RX.page.open({
                            title: "选择角色",
                            areaType: "medium",
                            url: "/role/roleSelect",
                            param: param
                        });
                    },
                    deleteSysGlbRole: function (keypath) {
                        this.set(keypath + ".sfyxSt", "UNVALID");
                    },
                    deleteRole: function (keypath) {
                        this.set(keypath + ".sfyxSt", "UNVALID");
                    }
                }
            },
            "SysGlbUser": { //关联机构岗位组件
                widget: RX.Grid,
                template: '#sysGlbUser',
                config: sysGlbOrganUserPostConfig,
                settings: {
                    selectType: "single"
                },
                methods: {
                    addOrganPost: function () {
                        RX.page.open({
                            title: "选择机构和岗位",
                            areaType: "tree",
                            url: "/organ/organTree",
                            param: {
                                kind: "o",
                                func: "addOrganPost"
                            }
                        });
                    },
                    //添加机构回调
                    addOrganPostCallBack: function (organId, organName) {
                        if (checkIsRepeat(organId)) {
                            var models = sysUserFormVm.get("sysGlbUser");
                            var flag = true;
                            //判断关联表中是否有数据，有数据，默认机构
                            for (var i = 0, maxLength = models.length; i < maxLength; i++) {
                                if (models[i].sfyxSt == "VALID") {
                                    flag = false;
                                    break;
                                }
                            }
                            if (flag) {
                                sysUserFormVm.set("defaultOrganId", organId);
                                sysUserFormVm.set("dftOrganName", organName);
                            }
                            sysUserFormVm.append("sysGlbUser", {
                                organName: organName,
                                organId: organId,
                                sfyxSt: 'VALID'
                            });
                            //改变机构角色的面板
                            renderOrganRoleAfterAddOrgan();
                        } else {
                            RX.msg(RX.ICON_WARNING, "所选机构已存在");
                            return false;
                        }
                    },
                    deleteOrganPost: function (keypath) {
                        //1.当删除的是默认机构，提示"删除的数据已设为默认机构，是否确认删除"
                        //2.当删除的机构不是默认机构直接删除
                        //3.当添加了多个相同机构时，且该机构已经设置为默认机构时，删除直到最后一个改机构删除时，才提示
                        //4.当删除了包括岗位时，需要清除SYS_GLB_ROLE中的信息
                        var that = this;
                        var delOrganId = that.get(keypath + ".organId");
                        var delOrganLength = 0;
                        $.each(sysUserFormVm.get("sysGlbUser"), function (i, t) {
                            if (delOrganId == t.organId && t.sfyxSt === 'VALID') {
                                delOrganLength++;
                            }
                        });
                        var defaultOrganId = sysUserFormVm.get("defaultOrganId");
                        if (delOrganId == defaultOrganId && delOrganLength == 1) {
                            RX.confirm("删除的数据已设为默认机构，是否确认删除", function (index) {
                                that.set(keypath + ".sfyxSt", "UNVALID");
                                sysUserFormVm.set("defaultOrganId", "");
                                sysUserFormVm.set("dftOrganName", "");
                                renderOrganRoleAfterDelOrgan();
                            });
                        } else {
                            that.set(keypath + ".sfyxSt", "UNVALID");
                            renderOrganRoleAfterDelOrgan();
                        }
                    },
                    /**
                     * 设置默认机构
                     * @param keypath
                     */
                    setDefaultOrgan: function (keypath) {
                        var selObj = this.getSelected();
                        if (selObj.length == 1) {
                            sysUserFormVm.set("dftOrganName", selObj[0].organName);
                            sysUserFormVm.set("defaultOrganId", selObj[0].organId);
                            RX.msg(RX.SUCCESS_OPERATE)
                        } else {
                            RX.msg(RX.SELECT_OPERATE);
                        }
                    }
                }
            },
            "OrganRole": {
                widget: RX.Grid,
                template: '#organRole',
                config: organRoleConfig,
                methods: {
                    //角色禁用
                    disabled: function (keypath, $event) {
                        $($event.originalEvent.currentTarget).parent().parent().addClass("disable");
                        this.set(keypath + ".sfqySt", "UNVALID");
                        return false;
                    },
                    //角色启用
                    able: function (keypath, $event) {
                        $($event.originalEvent.currentTarget).parent().parent().removeClass("disable");
                        this.set(keypath + ".sfqySt", "VALID");
                        return false;
                    }
                }
            }
        },
        afterMount: function () {
            //向主对象中添加loginUserRoleLevel
            this.set("loginUserRoleLevel", loginUserRoleLevel);
            //向主对象中添加loginUserRoleLevelId
            this.set("loginUserRoleLevelId", loginUserRoleLevelId);
            addUserInit();
            sysUserInfo = new Rxvm({
                el: '.user_info',
                template: '#userInfoForm',
                config: userInfoConfig,
                data: sysUserFormVm.get("sysUserInfo")
            })
        }
    });

});


/**
 * 保存方法
 */
function save() {
    if (sysUserFormVm.ruleValidate() && sysUserFormVm.organValidate() && sysUserFormVm.ruleValidate) {
        sysUserFormVm.set("sysUserInfo", JSON.parse(sysUserInfo.getJson()));
        $.ajax({
            type: "post",
            url: "/user/saveSysUser",
            data: {sysUser: sysUserFormVm.getJson()},
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

//选择角色回调
function sysRoleSelectCallback(rows) {
    $.each(rows, function (i, t) {
        sysUserFormVm.append("sysGlbRoleList", {
            roleId: t.ID,
            roleName: t.ROLE_NAME,
            roleCode: t.ROLE_CODE,
            glType: '3',
            levels: t.LEVELS,
            roleType: t.ROLE_TYPE,
            roleTypeName: t.ROLE_TYPE_NAME,
            createRoleId: t.CREATE_ROLE_ID,
            levelName:t.ROLE_LEVEL_NAME
        });
    });

}

/**
 * 从机构岗位树中选择机构岗位 render页面
 * 当有岗位时，需要将岗位保存到SYS_GLB_ROLE 中
 * @param organId
 * @param organName
 * @returns {boolean}
 */
function addOrganPost(organId, organName) {
    sysUserFormVm.$refs.sysGlbUser.addOrganPostCallBack(organId, organName);


}

//所属机构验重
function checkIsRepeat(organId) {
    var organList = sysUserFormVm.get("sysGlbUser");
    var result = true;
    $.each(organList, function (i, t) {
        if (t.organId === organId && t.sfyxSt === "VALID") {
            result = false;
        }
    });
    return result;
}


//添加用户初始化操作
function addUserInit() {
    var param = RX.page.param;
    var organId = param.organId; //初始机构id
    var organName = param.organName; //初始机构名称
    if (organId == "undefined" || organId == -1 || !organId) {//初始机构不存在
        organName = null;
        organId = null;
    } else {//初始机构存在
        sysUserFormVm.set("dftOrganName", organName);
        sysUserFormVm.set("defaultOrganId", organId);
        sysUserFormVm.append("sysGlbUser", {
            organName: organName,
            organId: organId
        });
    }
    if (organId) {
        //从树上新增用户时或添加机构时，展示当前要素已经关联的角色
        var organRoleList = getOrgansLinkRole(id);
        renderOrganRoleAfterAddOrgan(organRoleList)
    }
}

/**
 * 渲染用户所属的机构带来的角色
 */
function renderOrganRoleAfterAddOrgan(organRoleList) {
    if (!organRoleList) {
        var oIds = sysUserFormVm.getValidOrganIds();
        organRoleList = getOrgansLinkRole(oIds);
    }
    sysUserFormVm.set("sysOrganRoleList", []);
    $.each(organRoleList, function (i, t) {
        //过滤已经存在的角色
        sysUserFormVm.append("sysOrganRoleList", {
            roleId: t.roleId,
            roleName: t.roleName,
            roleCode: t.roleCode,
            roleType: t.roleType,
            roleTypeName: t.roleTypeName,
            organId: t.organId,
            organName: t.organName,
            glType: '3'
        });

        //当机构中包含用户个性定制的角色，去除用户的个性定制的角色
        var list = sysUserFormVm.get("sysGlbRoleList") || [];
        $.each(list, function (j, k) {
            if (t.roleCode === k.roleCode) {
                sysUserFormVm.$refs.sysGlbRoleGrid.set("list." + j + ".sfyxSt", "UNVALID");
            }
        })
    });
}

/**
 * 删除机构后重新
 * 渲染用户所属的机构带来的角色
 * 当用户已经有角色禁用时，需要判断将禁用信息加上
 */
function renderOrganRoleAfterDelOrgan() {
    //获取有效的机构岗位
    var validOrganPost = sysUserFormVm.getValidOrganIds();
    var organRoleList = getOrgansLinkRole(validOrganPost);
    //1.获取当前已经禁用的角色
    var unValidRole = [];
    $.each(sysUserFormVm.get("sysOrganRoleList"), function (i, t) {
        if (t.sfqySt === "UNVALID") {
            unValidRole.push({roleId: t.roleId});
        }
    });
    //2.将当期的机构角色渲染
    sysUserFormVm.set("sysOrganRoleList", []);
    $.each(organRoleList, function (i, t) {
        sysUserFormVm.append("sysOrganRoleList", {
            roleId: t.roleId,
            roleName: t.roleName,
            roleCode: t.roleCode,
            roleType: t.roleType,
            roleTypeName: t.roleTypeName,
            organName: t.organName
        });
    });
    //3.渲染禁用
    $.each(sysUserFormVm.get("sysOrganRoleList"), function (i, t) {
        $.each(unValidRole, function (j, k) {
            if (t.roleId === k.roleId) {
                sysUserFormVm.$refs.organRole.set("list." + i + ".sfqySt", "UNVALID");
            }
        })
    });
}

/**
 *通过机构的ids获取机构的关联角色
 * @param organIds 机构ids
 */
function getOrgansLinkRole(organIds) {
    var roles = [];
    $.ajax({
        url: "/user/getOrgansLinkRole?ids=" + organIds,
        async: false,
        success: function (ar) {
            if (ar.success) {
                roles = ar.data;
            }
        }
    });
    return roles;
}

//关闭确认
RX.page.cancelCheck = function () {
    if (sysUserFormVm.ifChange()) {
        RX.confirm(RX.CANCEL_CHECK, function (index) {
            RX.page.close();
        });
        return false;
    }
    return true;
};