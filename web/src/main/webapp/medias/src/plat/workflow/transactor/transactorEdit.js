var transactorVm,
    param = RX.page.param;
$(function () {
    var sourceType = [{name: "指定用户", code: 1, des: "指定一组固定用户办理", url: "/workflow/transactor/userEdit"},
        {name: "指定机构", code: 2, des: "指定机构下的用户办理，并可追加限定条件", url: "/workflow/transactor/organEdit"},
        {name: "角色", code: 3, des: "指定一个或多个角色办理，并可追加限定条件", url: "/workflow/transactor/roleEdit"},
        {name: "限定条件", code: 4, des: "根据用户类型及机构层级限定办理人", url: "/workflow/transactor/conditionEdit"},
        {name: "自定义规则", code: 5, des: "使用自定义流程规则指定办理人", url: "/workflow/transactor/ruleEdit"}
    ];
    //根据id获取数据，各个子项进入时获取
    var id = param.id;
    transactorVm = new Rxvm({
        el: '.base_box',
        template: '#mainInfo',
        config: config,
        settings: {
            getData: {
                url: id && "/workflow/transactor/getTransactorById",
                param: {id: id},
                defaultData: {sourceList: []}
            }
        },
        components: {
            "SourceListGrid": {
                widget: RX.Grid,
                template: '#sourceList',
                config: blrOriginConfig,
                methods: {
                    addSource: function () {
                        RX.page.openStack({
                            openWin: window,
                            url: "/workflow/transactor/transactorSourceSelect",
                            param: {
                                callbackFunc: "addBlrSource"
                            }
                        })
                    },
                    editGlSource: function (keypath) {
                        //获取类型，进入不同的修改页面
                        var selData = this.get(keypath);
                        //获取数据，根据类型直接进入修改页面
                        RX.page.openStack({
                            openWin: window,
                            url: sourceType[parseInt(selData.type) - 1].url,
                            param: {
                                data: selData,
                                keypath: keypath,
                                type: "xg",
                                callbackFunc: "addBlrSource"
                            }
                        })

                    },
                    deleteGlSource: function (keypath) {
                        this.set(keypath + ".sfyxSt", "UNVALID");
                    }
                }
            }
        }
    });
    $("#save").click(function () {
        if (transactorVm.ruleValidate()) {
            //直接保存数据
            $.ajax({
                type: "post",
                url: "/workflow/transactor/saveTransactor",
                data: {transactor: transactorVm.getJson()},
                success: function (ar) {
                    if (ar.success) {
                        RX.msg(RX.SUCCESS_SAVE);
                        RX.page.back();
                    } else {
                        RX.alert(ar.msg);
                    }
                }
            })
        }
    });
});

function getTransactorType() {
    return [{code: "1", value: "指定用户"}, {code: "2", value: "指定机构"}, {code: "3", value: "角色"}, {
        code: "4",
        value: "限定条件"
    }, {code: "5", value: "流程规则"}];
}

/**
 * 提供callback接口，统一在这边进行保存
 */
function addBlrSource(data, keyPath) {
    if (keyPath) {
        transactorVm.$refs["sourceListGrid"].set(keyPath + ".type", data.type);
        transactorVm.$refs["sourceListGrid"].set(keyPath + ".hasExtra", data.hasExtra);
        transactorVm.$refs["sourceListGrid"].set(keyPath + ".glSourceList", data.glSourceList);
    } else {
        //新增
        transactorVm.append("sourceList", {
            transactorId: "",
            type: data.type,     //不固定
            hasExtra: data.hasExtra,   //不固定
            sfyxSt: "VALID",
            glSourceList: data.glSourceList
        });
    }
}

/**
 * 关闭验证
 * @returns {boolean}
 */
RX.page.cancelCheck = function () {
    if (transactorVm.ifChange()) {
        RX.confirm(RX.CANCEL_CHECK, function () {
            RX.page.back();
        });
        return false;
    }
    return true;
};

