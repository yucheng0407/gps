var judgeNodeVm;
/**
 * 变量加上显示名称会不会好点，之后自强流向上选择名称等等
 */
var judgeJson = getCurrentBpmnElementData();
$(function () {
        initRxvm(judgeJson);
});

function initRxvm(json) {
    //todo 查出的sfyx_st = '0'
    judgeNodeVm = new Rxvm({
        el: $("[data-tab='gateway-settings']")[0],
        config: config,
        data: json,
        //子组件声明
        components: {
            "VariablesProc": {
                widget: RX.Grid,
                config: variableConfig,
                methods: {
                    addVariable: function () {
                        this.append("variables", {sfyxSt: "VALID"});
                    },
                    delVariable: function (keypath) {
                        this.set(keypath + ".sfyxSt", "UNVALID");
                    },
                    setAssignLogic: function (keypath) {
                        //获取前一个节点的设计表单id和
                        //注意前一个节点可能是多个
                        //如果无ids，则提示没设计表单，不需要设置
                        var idArr = [];
                        var acticityList = findCurrentSourceUserTask(), maxLength;
                        if (acticityList && (maxLength = acticityList.length) > 0) {
                            for (var i = 0; i < maxLength; i++) {
                                if (acticityList[i].sfyxSt !== "UNVALID") {
                                    //
                                    var sheets = acticityList[i].sheets;
                                    if (sheets) {
                                        for (var j = 0, sheetLength = sheets.length; j < sheetLength; j++) {
                                            if (sheets[j].sfyxSt !== "UNVALID") {
                                                sheets[j].diyFormId && !idArr.contains(sheets[j].diyFormId) && idArr.push(sheets[j].diyFormId);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        var diyFormIds = idArr.join(",");
                        if (diyFormIds) {
                            var viewModel = this;
                            var editorValue = viewModel.get(keypath + ".assignLogic");
                            RX.page.open({
                                title: "赋值逻辑编辑",
                                url: "/workflow/ibps/assignLogic",
                                param: {
                                    formIds: diyFormIds,
                                    editorValue: editorValue,
                                    func: "addAssignLogicCallback",
                                    viewModel: viewModel,
                                    keypath: keypath
                                }
                            });
                        } else {
                            //todo 先这样提示，后期改为根据数据是否显示这块
                            RX.msg("不存在配置表单，无需设置赋值表达式");
                        }
                    }
                }
            }
        }
    });
}


/**
 * 赋值逻辑回调接口
 */
function addAssignLogicCallback(vm, keypath, showName, formula) {
    vm.set(keypath + ".assignLogic", formula);
}

// 保存决策环节
function updateNodeAttr(operate) {
    if (!operate || operate !== "remove") {
        updateValue(config, judgeNodeVm.get(), judgeJson);
        var variables = judgeNodeVm.get("variables");
        if (variables) {
            var gloableVars = getFlowData().variables || [];
            judgeJson["variables"] = judgeNodeVm.get("variables").filter(function (variable) {
                //将变量初始化至全局
                if (variable["name"] && variable["value"]) {
                    //如果code不存在值，将code值填充
                    if (!variable["code"]) {
                        variable["code"] = variable["name"];
                    }
                    //判断当前元素在不在全局变量中存在，存在查看是否变化，如果能纪录此条数据变化了就好了
                    var addFlag = true;
                    $.each(gloableVars, function (i, e) {
                        //已经保存至全局
                        if (e.domid === (judgeJson.domid + "_" + variable["code"])) {
                            addFlag = false;
                            if (variable.sfyxSt === "UNVALID") {
                                //被删除
                                e.sfyxSt = "UNVALID";
                            } else {
                                e.name = variable["name"];
                                e.value = variable["value"];
                            }
                            return false;
                        }

                    });
                    if (addFlag) {
                        //新增，申明至全局的不能查看，无法修改
                        gloableVars.push({
                            name: variable["name"],
                            value: variable["value"],
                            domid: judgeJson.domid + "_" + variable["code"],
                            sfyxSt: variable.sfyxSt
                        });
                    }
                    return true;
                } else {
                    return false;
                }
            });
            getFlowData().variables = gloableVars;
        }
    } else {
        //此节点已经被删除
        //删除决策环节需要清除此决策变量申明至全局的变量
        //获取决策变量的domid
        //遍历流程的变量，删除以domid_开头的数据
        if (getFlowData().variables)
            getFlowData().variables = getFlowData().variables.filter(function (variable) {
                if (variable.domid && variable.domid.indexOf(judgeJson.domid) > -1) {
                    variable.sfyxSt = "UNVALID";
                }
                return variable.sfyxSt === "VALID" || (variable.id && variable.sfyxSt === "UNVALID");
            });
        return;
    }
}