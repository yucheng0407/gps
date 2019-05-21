var WorkflowReturn = _top.WorkflowReturn;
var SubmitReturn = _top.SubmitReturn;

/**
 * 传入工作流属性
 * @constructor
 */
function WorklfowObj(obj) {
    this.taskId = obj.taskId;
    //默认参数配置
    this.makeUpConfig = {
        //主vm
        _mainVm: null,
        checkWfFlag: true,
        draftWfFlag: true,
        sheetSave: function () {
            return new WorkflowReturn(true);
        },
        //提交验证
        checkWf: function () {
            //暂时无法加载model，先不预处理
            if (this.checkWfFlag && this._mainVm) {
                return new WorkflowReturn(this._mainVm.ruleValidate());
            } else {
                return new WorkflowReturn(true);
            }
        },
        /**
         * 获取流程变量
         * @returns {string}
         */
        setWfVars: function () {
            return "";
        },
        /**
         * 设置流程意见
         * @param param
         * @returns {string}
         */
        setWfOpinion: function (param) {
            return "";
        },
        //保存
        saveFunc: function () {
            return new WorkflowReturn(true);
        },
        //保存草稿
        draftWf: function () {
            if (this.draftWfFlag && this._mainVm) {
                return this._mainVm.getJson();
            }
        },
        //提交
        submitWf: function () {
            return new WorkflowReturn(true);
        },
        //删除
        deleteWf: function () {
            return new WorkflowReturn(true);
        },
        getOpinion: function () {
            return null;
        },
        /**
         * 获取自动意见
         */
        getAutoOpinion: function () {
            return null;
        },
        /**
         * 表单是否改变
         * @returns {*}
         */
        ifChange: function () {
            if (this._mainVm)
                return this._mainVm.ifChange();
        }
    };
    //工作流表单form pool
    var wfFormPool = [];
    RX.page.makeup({
        //提示接口
        alert: function (msg, func) {
            hideFrameOcx();
            RX.alert(msg, function () {
                showFrameOcx();
                if (typeof(func) === "function") {
                    func();
                }
            });
        },
        //重写confirm接口
        confirm: function (msg, func) {
            hideFrameOcx();
            RX.confirm(msg, function () {
                showFrameOcx();
                if (typeof(func) === "function") {
                    func();
                }
            });
        },
        /**
         * RX.page.open添加自己的操作
         */
        openWin: function (obj) {
            hideFrameOcx();
            if (!obj.callbacks) {
                obj.callbacks = {};
            }
            var endFunc = obj.callbacks.end;
            obj.callbacks.end = function () {
                typeof endFunc === "function" && endFunc();
                showFrameOcx();
            };
            RX.page.open(obj);
        },
        /**
         * 获取工作流form
         * @param index 第几个，不传返回全部
         */
        getWfForm: function (index) {
            if (typeof index === "undefined") {
                return wfFormPool;
            } else {
                return wfFormPool[index];
            }
        },
        /**
         *
         * @param form
         * @private
         */
        _pushWfForm: function (form) {
            wfFormPool.push(form);
        }
    });

    /**
     * 隐藏ocx控件
     */
    function hideFrameOcx() {
        $.each(wfFormPool, function (index, form) {
            form._wfObj.isWeboffice && form.win.hideOcx();
        });
    }

    /**
     * 显示ocx控件
     */
    function showFrameOcx() {
        $.each(wfFormPool, function (index, form) {
            form._wfObj.isWeboffice && form.win.showOcx();
        });
    }
}

WorklfowObj.prototype = {
    /**
     * 表单是否可编辑
     * @param targetForm 目标form
     * @returns {boolean}
     * @private
     */
    _isCanEdit: function (targetForm) {
        return targetForm._wfObj.sheetMode != 1;
    },
    /**
     * 遍历form，处理函数
     * @param func 处理函数，返回false跳出循环
     * 条件可能变化，根据不同需求返回form
     */
    eachForm: function (func) {
        if (typeof func === "function") {
            var framePool = RX.page.getWfForm(),
                i = 0, framePoolLength = framePool.length, flag;
            for (; i < framePoolLength; i++) {
                flag = func(framePool[i], framePoolLength);
                if (flag === false) break;
            }
        }
    },
    /**
     * 工作流子form的创建，以及处理流程参数
     * @param childWin
     * @param wfParam
     * @param buildParam
     * @param gxParam
     *
     * */
    addChildWin: function (childWin, wfParam, buildParam, gxParam) {
        var workflowParam = {
            node: {
                //环节id
                id: wfParam.nId,
                //环节编码
                code: wfParam.nodeCode,
                //环节序号
                sort: wfParam.sort
            },
            page: {
                //环节页面id
                nodePageId: wfParam.npId,
                //页面id
                pageId: wfParam.pageId,
                //数据id
                dataId: wfParam.dataId || "",
                //页面标题
                name: "",
                //任务表单id
                taskPageId: "",
                //草稿数据
                tmpData: wfParam.tmpData,
                //页面是否可编辑
                editFlag: wfParam.editFlag,
                //是不是webOffice
                isWeboffice: wfParam.isWeboffice
            },
            workflow: {
                //工作流实例id
                insId: wfParam.wiId,
                //code
                code: wfParam.flowCode,
                //任务id
                taskId: wfParam.taskId,
                //任务状态
                taskStatus: wfParam.taskStatus,
                //数据id
                dataId: wfParam.ywDataId,
                //正在运行的环节
                runNodeSort: wfParam.runNodeSort,
                //源数据
                sourceData: wfParam.sourceData
            },
            //流程变量
            wfVars: gxParam.workflowVarObj,
            //流程表单附件信息
            formExtAttr: wfParam.formAuthExt
        };
        var form = RX.page.setChildParam(childWin, $.extend(true, workflowParam, buildParam));
        form.makeup(this.makeUpConfig);
        //装饰一些私有属性，本对象使用的
        form.makeup({
            _wfObj: {
                sheetMode: wfParam.sheetMode,
                tabId: gxParam && gxParam.tabId,
                tabTitle: gxParam && gxParam.tabTitle,
                npId: wfParam.npId,
                isWeboffice: wfParam.isWeboffice,
                //第一个显示页面标志
                firstPageFlag: gxParam && gxParam.firstPageFlag,
                //自定义form标识
                diyFormId: gxParam.diyFormId
            }
        });
        //添加入工作流表单池子
        RX.page._pushWfForm(form);
    },
    //根据formId获取form
    getDiyFormById: function (formId) {
        var wfForm;
        var forms = RX.page.getWfForm();
        forms && $.each(forms, function (index, form) {
            if (form._wfObj.diyFormId == formId) {
                wfForm = form;
                return false;
            }
        });
        return wfForm;
    },
    /**
     * 处理变量，计算值
     * @param obj obj，变量名+表单式
     */
    handleVars: function (obj) {
        /*  解析表达式，替换数据
         *  格式： $form_id.字段#
         *  将表达式替换成值，传入解析器中进行解析
        */
        var vars = [];
        var that = this;
        for (var key in obj) {
            //如果是子表单的数据，替换成1，1，2，3，41。子表单的都是函数来计算值的
            var valAry = obj[key].split("\n");
            var resStr = "";
            $.each(valAry, function (a, b) {
                //拆分
                //f = b.split(/(\$[0-9a-zA-Z\._]+#[0-9A-Fa-f]*)/g)
                var e = "",
                    f = b.split(new RegExp("(" + "\\$[0-9a-zA-Z\\._]+#" + "[0-9A-Fa-f]*)", "g")),
                    fieldRex = new RegExp("^" + "\\$[0-9a-zA-Z\\._]+#" + "$");
                $.each(f, function (b, c) {
                    if (fieldRex.test(c)) {
                        var arr = c.substring(1, c.length - 1).split(".");
                        var diyForm = that.getDiyFormById(arr[0]);
                        //todo 值不存在时的逻辑，还是由表单接口提供，是字符串""，数字0？？？，还是由计算公式中决定？？
                        //平均值值会存在影响
                        //增加标志位，标志位空值，各接口进行处理
                        if (diyForm) {
                            resStr += diyForm.getValueByCode(arr[1]);
                        }
                    } else {
                        resStr += c;
                    }
                });
            });
            //处理公式
            var formulaValue = this.evalFormula(resStr);
            //空值不进行变量表达式的赋值
            if ("" !== formulaValue && null !== formulaValue ) {
                vars.push(key + ":" + formulaValue);
            }
        }
        return vars.join(",");
    },
    /**
     * 公式计算
     * @param str
     * @returns {*}
     */
    evalFormula: function (str) {
        //处理字符串中的公式，计算值
        var c;
        if (str) {
            var env = [];
            try {
                for (var f in FormulaUtil) {
                    env.push("var " + f + "=FormulaUtil." + f);
                }
                c = new Function(env.join(";") + "; return " + str + ";")();
            } catch (e) {
                //todo 计算错误的处理
                RX.log(env.join(";") + "; return " + str + ";");
                c = "";
            }
        } else {
            c = str;
        }
        return c;
    },
    /**
     * 签收任务
     */
    signTask: function (func) {
        $.post("/workflow/instance/signTask", {taskId: this.taskId}, function () {
            typeof func === "function" && func();
        });
    },
    /**
     *  验证表单
     * @param params 传递的个性参数
     * @returns {{flg: boolean}} flg（是否通过）:true,false
     *
     * ps:表单多个tabTitle属性，用于提示
     */
    checkForm: function (params) {
        var wfObj = this, resObj = {flg: true}, returnObj = {flg: true};
        wfObj.eachForm(function (form, formLength) {
            if (wfObj._isCanEdit(form)) {
                if (form.checkWf) {
                    var result = form.checkWf(params);
                    if (typeof result === "boolean") {
                        result = {flg: result};
                    }
                    resObj.flg = result.flg;
                    if (!resObj.flg) {
                        var msg;
                        if (formLength === 1) {
                            msg = resObj.msg || "保存验证不通过";
                        } else {
                            wfObj._moveToTab(form);
                            msg = resObj.msg || (form._wfObj.tabTitle + "保存验证不通过");
                        }
                        RX.page.alert(msg);
                        returnObj.flg = false;
                        return false;
                    }
                }
            }
        });
        return returnObj;
    },
    /**
     * 获取表单流程变量
     */
    getWfVars: function (params) {
        var vars = "", wfObj = this;
        wfObj.eachForm(function (form, formLength) {
            if (form.setWfVars) {
                vars += form.setWfVars(params);
            }
        });
        return vars;
    },
    /**
     * 保存表单（保存业务数据，不提交，一直在此环节）
     * ps：目前taskhandle不提供此功能，放着可能有项目需要此功能
     * @param params
     * @returns {{flg: boolean, msg: null}}
     */
    saveForm: function (params) {
        var wfObj = this, result = {flg: true, msg: null};
        wfObj.eachForm(function (form, formLength) {
            if (wfObj._isCanEdit(form)) {
                if (form.saveFunc) {
                    var saveResult = form.saveFunc(params);
                    if (typeof saveResult === "boolean") {
                        saveResult = {
                            flg: saveResult
                        };
                    }
                    if (!saveResult.flg) {
                        result.flg = false;
                        if (formLength > 1) {
                            wfObj._moveToTab(form);
                        }
                        return false;
                    } else {
                        dataId = result.ywDataId || saveResult.ywDataId;
                        result.wfTitle = result.wfTitle || saveResult.wfTitle;
                        result.wfVars = result.wfVars || saveResult.wfVars;
                    }
                }
            }
        });
        return result;
    },
    /**
     * 获取按钮事件的自定义意见
     *
     * @param param
     */
    getWfOpinion: function (param) {
        var opinion = "", wfObj = this;
        wfObj.eachForm(function (form, formLength) {
            if (form.setWfOpinion) {
                opinion += form.setWfOpinion(param);
            }
        });
        return opinion;
    },
    /**
     * tab移动到指定的form
     * @param form
     * @private
     */
    _moveToTab: function (form) {
        //目前是这种，考虑重构`
        $("#" + form._wfObj.tabId).click();
    },
    /**
     * 调用表单提交接口
     * @param params
     * @returns {{flg: boolean, msg: null}}
     */
    submitForm: function (params) {
        var dataArr = [], dataId;
        var wfObj = this, result = {flg: true, msg: null};
        wfObj.eachForm(function (form, formLength) {
            if (wfObj._isCanEdit(form)) {
                if (form.submitWf) {
                    var saveResult = form.submitWf(params);
                    if (!saveResult.flg) {
                        RX.page.alert(saveResult.msg ? saveResult.msg : "办理失败");
                        result.flg = false;
                        if (formLength > 1) {
                            wfObj._moveToTab(form);
                        }
                        return false;
                    } else {
                        result.ywDataId = result.ywDataId || saveResult.ywDataId;
                        result.wfTitle = result.wfTitle || saveResult.wfTitle;
                        result.wfVars = result.wfVars || saveResult.wfVars;
                        result.msg = result.msg || saveResult.msg;
                        //表单id ： form.param.formId;
                        //todo
                        //资源页面id param.page.pageId
                        dataArr.push({
                            dataId: saveResult.ywDataId || saveResult.dataId,
                            pageId: form.param.page.pageId,
                            formId: form.param.formId || ""
                        });
                        dataId = dataId || saveResult.ywDataId || saveResult.dataId;
                    }
                }
            }
        });
        result.ywDataId = result.ywDataId || dataId;
        result.dataIds = JSON.stringify(dataArr);
        return result;
    },
    /**
     * 表单验证并调用表单提交接口
     * @param params
     * @returns {{flg: boolean, msg: null}}
     */
    checkAndSubmit: function (params) {
        var result = {flg: true, msg: null};
        var checkResult = this.checkForm(params);

        if (!checkResult.flg) {
            result.flg = false;
            return result;
        }

        var submitResult = this.submitForm(params);
        if (submitResult.flg) {
            result.ywDataId = submitResult.ywDataId;
            result.wfTitle = submitResult.wfTitle;
            result.wfVars = submitResult.wfVars;
            result.msg = submitResult.msg;
            result.dataIds = submitResult.dataIds;
            return result;
        } else {
            result.flg = false;
            return result;
        }
    },
    /**
     * 调用保存草稿接口
     *  todo ：taskId成全局变量了
     * @returns {boolean}
     */
    tmpDataSave: function (params) {
        var wfObj = this, saveflg = true;
        wfObj.eachForm(function (form, formLength) {
            if (wfObj._isCanEdit(form)) {
                if (form.draftWf) {
                    var saveResult = form.draftWf(params);
                    if (typeof(saveResult) === "object") {
                        saveResult = JSON.stringify(saveResult);
                    }
                    // wfObj._moveToTab(form);
                    $.ajax({
                        type: "post",
                        url: "/workflow/instance/saveTmpData",
                        async: false,
                        data: {taskId: taskId, nodePageId: form._wfObj.npId, tmpData: saveResult},
                        dataType: "json",
                        success: function (ar) {
                            if (!ar.success) {
                                saveflg = false;
                            }
                        }
                    });
                    return saveflg;
                }
            }
        });
        return saveflg;
    },
    /**
     *  调用页面方法，删除业务数据
     * @returns {boolean}
     */
    deleteForm: function (params) {
        var wfObj = this, resultObj = {
            flg: true,
            msg: ""
        };
        wfObj.eachForm(function (form) {
            if (form.deleteWf) {
                var delResult = form.deleteWf(params);
                if (!delResult.flg) {
                    resultObj.flg = false;
                    resultObj.msg = delResult.msg || "调用删除方法，删除失败";
                    return false;
                }
            }
        });
        return resultObj;
    },

    /**
     * 删除流程实例
     * @returns {boolean}
     */
    deleteFlow: function (taskId) {
        var deleteSuccess = {flg: false, msg: ""};
        $.ajax({
            type: "post",
            url: "/workflow/instance/deleteWorkflowInstance",
            async: false,
            data: {taskId: this.taskId},
            success: function (ar) {
                if (ar.success) {
                    deleteSuccess.flg = true;
                } else {
                    deleteSuccess.msg = ar.msg;
                }
            }
        });
        return deleteSuccess;
    },
    /**
     * 校验自动意见
     * ps：获取接口可以修改，将自动意见的获取接口挂载在form对象上
     * @returns {boolean}
     */
    checkAutoOpinion: function () {
        var wfObj = this, result = true;
        wfObj.eachForm(function (form) {
            var obj = $(".flowEditOpinion", form.win.document);
            if (obj.length > 0) {
                if (!obj.val()) {
                    wfObj._moveToTab(form);
                    notNull(obj);
                    RX.page.alert("请填写审批意见");
                    result = false;
                    return false;
                }
            }
        });
        return result
    },
    /**
     * 获取自动意见
     * @returns {string}
     */
    getAutoOpinion: function () {
        var wfObj = this, opinionArr = [];
        wfObj.eachForm(function (form, formLength) {
            var obj = form.getAutoOpinion();
            if (obj) {
                opinionArr.push(obj.npId);
                opinionArr.push(obj.val);
            }
        });
        return opinionArr.join("##");
    },
    /**
     * 撤回任务
     * @param successFunc 成功之后执行的函数
     * @param errorFunc 失败之后执行的函数
     */
    withdrawWf: function (successFunc, errorFunc) {
        var taskObj = this;
        $.post("/workflow/instance/recoverTask", {taskId: taskObj.taskId}, function (ar) {
            if (ar.success) {
                typeof successFunc === "function" ? successFunc() : RX.page.alert("撤回成功！！！");
            } else {
                typeof errorFunc === "function" ? errorFunc() : RX.page.alert(ar.msg);
            }
        });
    },
    /**
     * 发起工作流
     * @param flowCode
     * @param wfTitle
     * @param sourceData
     * @param startWfVars
     * @param successFunc
     */
    startWorkflow: function (flowCode, wfTitle, sourceData, startWfVars, successFunc) {
        var taskObj = this;
        $.ajax({
            type: "post",
            url: "/workflow/instance/startWorkflow",
            data: {
                flowCode: flowCode,
                title: wfTitle,
                sourceData: sourceData,
                startWfVars: startWfVars,
                type: "draft"
            },
            success: function (ar) {
                if (ar.success) {
                    //记录taskId
                    taskObj.taskId = ar.data;
                    typeof successFunc === "function" && successFunc(ar.data);
                } else {
                    RX.page.alert(ar.msg);
                }
            }
        });
    },
    /**
     * 变量回滚操作
     *
     * @param workflowVarObj 流程变量初始值
     */
    varsCallback: function (workflowVarObj) {
        if (workflowVarObj) {
            var wfVars = [];
            for (var obj in workflowVarObj) {
                if (workflowVarObj.hasOwnProperty(obj)) {
                    wfVars.push(obj + ":" + workflowVarObj[obj]);
                }
            }
            if (wfVars.length) {
                $.ajax({
                    type: "post",
                    url: "/workflow/instance/updateWorkflowVars",
                    data: {
                        taskId: taskId,
                        wfVars: wfVars.join(",")
                    },
                    success: function (ar) {
                        if (!ar.success) {
                            RX.alert(ar.msg)
                        }
                    }
                });
            }
        }
    }
};

