var tabPanel,
    param,
    taskId,//任务ID
    sort,//序号
    flowCode,//流程编码
    wfId,//流程ID
    wiId,//流程实例ID
    status,//任务状态
    list,//表单list
    dataId,//业务数据ID
    draft,//是否先存为草稿后提交
    flowViewTag, //是否由流程图查看进入
    toTag,//返回URL
    startWfVars, //流程启动（判断开始环节走向）的变量初值
    reloadFlag = false,   //关闭页面是否刷新
    hasMerge,//是否为聚合环节
    nodeId,//所属环节id
    buttons,
    sourceData,   //初始传入的参数，之后流程不能获取
    isMe,    //是否当前登录人任务
    taskObj,
    buttonArr = [],     //功能按钮数组
//内置按钮类型对应的处理函数
    workflowVarObj,   //流程变量
    nodeSortMap,    //流程环节序号Map（key为nodeCode，value为sort)
    wiStatus;   //流程状态
var btnFunc = {};
//提交按钮
btnFunc[RX.WF_SUBMIT] = "submitWf";
//退回
btnFunc[RX.WF_REFUSE] = "refuseWf";
//保存草稿
btnFunc[RX.WF_SAVEDRAFT] = "saveDraft";
//撤回
btnFunc[RX.WF_CANCEL] = "cancelWf";
//删除
btnFunc[RX.WF_DEL] = "delWf";
//特送退回
btnFunc[RX.WF_SPECBACK] = "specialBack";
//催办
btnFunc[RX.WF_PRESS] = "pressWf";
// 流程办理页面弹出类型
var workFlowType = RX.cache(_top, "WORKFLOW.workFlowType");
//是否需要签收
var isWorkflowSign = RX.cache(_top, "WORKFLOW.isWorkflowSign") === "true";
//是否办理确认时填写意见
var isHasOpinion = RX.cache(_top, "WORKFLOW.isHasOpinion") === "true";
$(function () {
    var diyButton = [];     //自定义按钮而且不是由业务控制的
    //启动流程参数或者流程图页面双击获得弹出的页面
    param = RX.page.param;
    //启动流程时，传入的源数据存入实例
    sourceData = taskId ? null : param.sourceData;
    flowViewTag = param.flowViewTag;
    taskId = param.taskId;
    flowCode = param.flowCode;
    wfId = param.wfId;
    wiId = param.wiId;
    toTag = param.toTag;
    startWfVars = param.startWfVars;
    var url, paramObj;
    if (taskId) {
        url = "/workflow/instance/getTaskHandleJson";
        paramObj = {id: taskId}
    } else if (flowCode) {
        url = "/workflow/instance/getTaskHandleByCode";
        paramObj = {flowCode: flowCode, startWfVars: startWfVars};
    } else {
        RX.alert("流程编码以及任务id不存在！！！，请联系管理员");
        return;
    }
    /**
     * 根据任务id或者没有任务时根据flowCode查找工作流的初始数据，
     * 回调成功后，处理通用逻辑以及页面渲染
     */
    $.ajax({
        type: "post",
        url: url,
        data: paramObj,
        async: false,
        success: function (ar) {
            if (ar.success) {
                taskObj = new WorklfowObj({
                    taskId: taskId
                });
                var data = ar.data;
                flowCode = flowCode || data.flowCode;
                sort = data.sort;
                wiId = data.wiId;
                wiStatus = data.wiStatus;
                dataId = data.ywDataId;
                status = taskId ? data.taskStatus : "";
                list = data.list;
                buttons = data.buttons;
                nodeId = data.nodeId;
                hasMerge = data.hasMerge;
                isMe = taskId ? data.isMe : true;
                workflowVarObj = data.wfVars;
                nodeSortMap = data.nodeSortMap;
                taskId && isConfirmSign(status, taskId, list);//是否弹出签收
                createInitHtml();
                changeBtn(buttons); //控制按钮显示/隐藏
            } else {
                RX.alert(ar.msg);
                closeWf();
            }
        }
    });

    //绑定意见事件
    $(".mod_fixNav").click(function () {
        var $opinionBox = $('.workflow_timeline_box');
        if ($opinionBox.find("iframe").length === 0) {
            $opinionBox.append("<iframe name='opinionIframe' src='" + RX.handlePath('/workflow/instance/workflowOpinion') + "' frameborder='0' width='100%' height='100%'></iframe>");
            RX.page.setChildParam({name: "opinionIframe"}, {
                taskId: taskId,
                wiStatus: wiStatus || "",
                opinionList: [],
                hideBox: function () {
                    $opinionBox.hide();
                }
            });
        }
        $opinionBox.show();
    });

    //事件的绑定，
    bindWorkflowEvent();

    //提供的辅助接口
    RX.page.makeup({
        //表单类型，表示为taskhandle.js
        pageType: "handleWf",
        //表单工具
        util: {
            getFrameWindow: function (index) {
                return RX.page.getWfForm(index);
            },
            /**
             * 退回特定节点
             * @param nodeIds
             */
            selectBackNodeCallback: function (nodeIds) {
                handleSubmit("不同意", false, null, nodeIds);
            },
            /**
             *
             * @param buttonCode
             */
            showButton: function (buttonCode) {
                showButton(buttonCode);
            },
            /**
             *
             * @param buttonCode
             */
            hideButton: function (buttonCode) {
                hideButton(buttonCode)
            },
            /**
             * 判断环节序号是否大于
             * @param compareNodeCode 被比较环节编码
             * @returns {boolean}
             */
            sortBiggerThan: function (compareNodeCode) {
                var compSort = 0;
                if (nodeSortMap && nodeSortMap[compareNodeCode]) {
                    compSort = nodeSortMap[compareNodeCode];
                }
                return (!compSort || sort > compSort);
            }
        },
        //基本功能，表单开发勿用
        _base: {
            /**
             * 在第一个页面加载之后触发button渲染
             * @param win
             */
            firstIframeOnload: function (win) {
                changeDiyBtn(win);
            }
        }
    });

    /**
     * 显示页面具有的button
     */
    function changeDiyBtn(win) {
        var showIdArr = [], hideIdArr = [];
        for (var i = 0, maxLength = diyButton.length; i < maxLength; i++) {
            var button = diyButton[i];
            if (typeof win[button.funcName] === "function") {
                showIdArr.push(button.code);
            } else {
                hideIdArr.push(button.code);
            }
        }
        hideButton(hideIdArr);
        showButton(showIdArr);
    }

    //是否弹出签收框
    function isConfirmSign(status, taskId, sheet) {
        if (status === "待办" && isMe) {
            if (isWorkflowSign) {
                var warn = "签收确认";
                var webOfficeTag = false;
                for (var i = 0; i < sheet.length; i++) {
                    if (sheet[i].url.toString().indexOf("webofficePage") >= 0) {
                        webOfficeTag = true;
                    }
                }
                if (webOfficeTag) {
                    if (confirm(warn)) {
                        taskObj.signTask();
                    } else {
                        RX.page.closeAll();
                        if (workFlowType !== "layer") {
                            RX.page.back();
                        }
                    }
                } else {
                    RX.confirm(warn, function () {
                        taskObj.signTask(function () {
                            if (workFlowType !== "layer") {
                                var main = RX.page.prev();
                                if (main && main.reload) {
                                    main.reload();
                                }
                            }
                        });
                    }, function () {
                        if (workFlowType === "layer") {
                            RX.page.close();
                        } else {
                            RX.page.back();
                        }
                    });
                }
            } else {
                taskObj.signTask();
            }
        }
    }

    /**
     * 初始化流程页面
     */
    function createInitHtml() {
        //获取展示页面编码
        var showPageCode = function () {
            var tParam = $.extend(true, {}, param), tempPageCode = "all";
            if (dataId) {
                tParam.dataId = dataId;
            }
            //tParam.wiStatus = wiStatus;
            tParam.sort = sort;
            tParam.param = param;
            var checkFunc = checkObj[flowCode];
            if (checkFunc && typeof checkFunc === "function") {
                tempPageCode = checkFunc(tParam) || "all";
            }
            return tempPageCode;
        }();

        //获取编辑或查看url
        function getEditOrViewUrl(url, sheetMode) {
            var leftUrl = url.substring(0, url.indexOf('?'));
            var rightUrl = url.substr(url.indexOf('?'));
            var newUrl;
            //status为空新建或者待办和在办
            if (sheetMode != 1 && isMe && (status == "" || status == "待办" || status == "在办")) {
                if (leftUrl.endWith('View')) {
                    leftUrl = leftUrl.substr(0, leftUrl.length - 4) + 'Edit';
                    newUrl = leftUrl;
                }
            } else {//查看
                if (leftUrl.endWith('Edit')) {
                    leftUrl = leftUrl.substr(0, leftUrl.length - 4) + 'View';
                    newUrl = leftUrl;
                }
            }
            var isExisit = true;
            if (newUrl) {
                //判断改变的存不存在
                $.ajax({
                    type: "get",
                    url: "/main/checkHasMapping?url=" + newUrl,
                    async: false,
                    success: function (ar) {
                        if (ar.success) {
                            isExisit = ar.data;
                        } else {
                            RX.alert(ar.msg);
                        }
                    }
                });
            }
            if (isExisit) {
                url = leftUrl + rightUrl;
            }
            return url;
        }

        //验证页面tab是否显示
        function checkPageIfShow(pageCode) {
            var result = true;
            if (showPageCode !== "all" && ("," + showPageCode + ",").indexOf("," + pageCode + ",") == -1) {
                result = false;
            }
            return result;
        }

        //获取需要展示的表单
        function getShowSheets() {
            var showSheets = [];
            // list为表单列表
            if (list && list.length > 0) {
                for (var i = 0; i < list.length; i++) {
                    if (checkPageIfShow(list[i].pageCode)) {
                        showSheets.push(list[i]);
                    }
                }
            }
            return showSheets;
        }

        //表单展示项数据
        var sheetItems = [], frameList = [];
        //拿到需要展示的表单
        var sheets = getShowSheets();
        if (sheets && sheets.length > 0) {
            for (var i = 0; i < sheets.length; i++) {
                var sheetItem = {};
                sheetItem.id = 'sheet_' + sheets[i].sId;
                sheetItem.title = sheets[i].name;
                sheetItem.tabId = "tab_" + i;
                var url = sheets[i].url;
                if (!(url.indexOf("?") > -1)) url += "?";
                url += "&_pageType=wf";
                url = getEditOrViewUrl(url, sheets[i].sheetMode);
                if (!taskId && sourceData) {
                    sheets[i].sourceData = sourceData;
                    for (var key in sourceData) {
                        url += key + "=" + (sourceData[key] ? RX.encode(JSON.stringify(sourceData[key])) : "") + "&";
                    }
                }
                //个性参数，工作流引擎使用
                var gxParam = {
                    tabTitle: sheetItem.title,
                    tabId: sheetItem.tabId,
                    firstPageFlag: i === 0,
                    diyFormId: sheets[i].diyFormId || "",
                    wfVarObj: workflowVarObj
                };
                taskObj.addChildWin({name: sheetItem.id}, sheets[i], param, gxParam);
                sheetItem.url = RX.handlePath(url);
                sheetItem.name = sheetItem.id;
                sheetItems.push(sheetItem);
                frameList.push(sheetItem.name);
            }
        }
        // 初始化对象
        new Rxvm({
            el: "#sheetList",
            data: {list: sheetItems},
            afterMount: function () {
                var tabItems = [], sheets = this.get("list");
                if (sheets.length > 1) {
                    if (sheets && sheets.length > 0) {
                        for (var i = 0; i < sheets.length; i++) {
                            var tabItem = {
                                cId: sheets[i].id,
                                title: sheets[i].title,
                                id: sheets[i].tabId,
                                closable: false
                            };
                            tabItems.push(tabItem);
                        }
                    }
                    tabPanel = new TabPanel({
                        renderTo: 'center-tab',
                        fullTab: true,      //是否打满容器
                        active: 0,       //默认显示页签
                        autoResizable: true,        //自适应尺寸
                        items: tabItems,
                        //click事件
                        clickFunc: function (pos, content) {
                            changeDiyBtn(content.find("iframe")[0].contentWindow);
                        }
                    });
                }
                resizePage();
            }
        });
    }

    //初始化流程意见
    function initOpinionHtml(task) {
        // /**
        //  * 截取字符串,后面多的显示省略号
        //  * @param data
        //  * @param length
        //  * @returns {*}
        //  */
        // function getSubStr(data, length) {
        //     if (data && data.length > length) {
        //         return data.substring(0, length) + "...";
        //     } else {
        //         return data;
        //     }
        // }
        //
        // var tbodyHtml = "";
        // if (task && task.length > 0) {
        //     for (var i = 0; i < task.length; i++) {
        //         var opinion = task[i].pageOpinion || task[i].opinion;
        //         tbodyHtml += "<tr>" +
        //             "<td title=" + task[i].nodeName + ">" + task[i].nodeName + "</td>" +
        //             "<td title=" + task[i].action + ">" + task[i].action + "</td>" +
        //             "<td title=" + task[i].handler + ">" + task[i].handler + "</td>" +
        //             "<td title=" + opinion + " >" + getSubStr(opinion, 5000) + "</td>" +
        //             "<td title=" + task[i].handleDate + ">" + task[i].handleDate + "</td>" +
        //             "<td title=" + task[i].fjs + " onclick=\"lookAttachment('" + (task[i].fj_id || "") + "')\" style=\"cursor: pointer;\"><a>" + task[i].fjs + "</a></td>" +
        //             "</tr>";
        //     }
        // }
        //改造成展开时渲染

    }

    //控制按钮显示/隐藏
    function changeBtn(buttons) {
        //逻辑需要进行修改，因为存在进入页面才判断是否显示，按钮和页面挂钩
        function addButton(buttons) {
            var addHtml = ["<ul class='action_button'>"];
            for (var i = 0, maxLength = buttons.length; i < maxLength; i++) {
                var button = buttons[i];
                addHtml.push('<li id="' + button.code + '" code="' + button.code + '"');
                //自定义按钮，需要和页面挂钩，有就显示，无就不显示，还要经过按钮显示事件控制
                if (button.type === RX.WF_DIY && button.isShowInHandle !== RX.WFBTN_SHOW_DIY) {
                    diyButton.push(button);
                }
                //业务控制或者自定义按钮的暂不显示
                if (button.isShowInHandle === RX.WFBTN_SHOW_DIY || button.type === RX.WF_DIY) {
                    //业务控制
                    addHtml.push(' style="display:none;cursor: pointer;"> ');
                } else {
                    addHtml.push('style="cursor: pointer;">');
                }
                addHtml.push('<a><i class="iconfont ">' + (button.icon ? button.icon : "") + '</i>');
                addHtml.push(button.name);
                addHtml.push("</a></li>");
            }
            addHtml.push("</ul>");
            $("#operation").append(addHtml.join(""));
        }

        //按钮数组
        if (!flowViewTag) {
            buttonArr = buttonArr.concat(buttons);
            buttonArr.push({name: "流程图", code: "viewWf", icon: "&#xe62f;", funcName: "viewWf"});
        }
        buttonArr.push({name: "关闭", code: "closeWf", icon: "&#xe609;", funcName: "closeWf"});
        addButton(buttonArr);
    }

    /**
     * 显示button
     * @param buttonCode：字符串是一个，数组是多个
     */
    function showButton(buttonCode) {
        if (buttonCode) {
            if (typeof  buttonCode === "string") {
                $("#" + buttonCode).show();
            } else if (buttonCode instanceof Array) {
                for (var i = 0, maxLength = buttonCode.length; i < maxLength; i++) {
                    $("#" + buttonCode[i]).show();
                }
            }
        }
    }

    /**
     * 隐藏button
     * @param buttonCode：字符串是一个，数组是多个
     */
    function hideButton(buttonCode) {
        if (buttonCode) {
            if (typeof  buttonCode === "string") {
                $("#" + buttonCode).hide();
            } else if (buttonCode instanceof Array) {
                for (var i = 0, maxLength = buttonCode.length; i < maxLength; i++) {
                    $("#" + buttonCode[i]).hide();
                }
            }
        }
    }

    /**
     * 事件绑定
     */
    function bindWorkflowEvent() {
        //工作流按钮的事件绑定
        buttonsEvent();
        //resize事件
        $(window).resize(function () {
            resizePage();
        });

        /**
         * 工作流按钮的事件绑定
         */
        function buttonsEvent() {
            //从buttons获取button
            function getButtonByCode(code) {
                for (var i = 0, maxLength = buttonArr.length; i < maxLength; i++) {
                    if (buttonArr[i].code == code) {
                        return buttonArr[i];
                    }
                }
            }

            //个性按钮设置
            $("#operation").on("click", "li", function () {
                var button = getButtonByCode(this.getAttribute("code"));
                if (button) {
                    handleWfButton(button);
                }
            });
        }
    }

    //办理任务
    function handleSubmit(opinion, agree, params, backNodeIds, handleOpinion, specialBackFlag) {
        var result;
        //流程办理确认页面关闭回调
        var callBackClose = function () {
            //回滚一些操作，办理确认页面关闭、下一环节无办理人，流程这边进行了流程变量的更新，提交确认
            if (agree) {
                taskObj.varsCallback(workflowVarObj);
            }
            if (workFlowType === "layer") {
                reloadPrevWin();
                RX.page.closeAll();
            } else {
                if (RX.cache(_top, "WORKFLOW._outerSystem")) {
                    postMessgToParent("close");
                } else {
                    RX.page.goto(toTag, null, true);
                    RX.page.closeAll();
                }
            }
        };
        var auditOpinion = "";

        /**
         * 确认提交
         * @param taskOpinion
         * @param fjId
         * @param layerMsg
         * @param flg
         * @private
         */
        function _taskSubmit(taskOpinion, fjId, layerMsg, flg, userIds) {
            taskOpinion = taskOpinion || opinion;
            // todo: handler接口调整，此处待优化
            if(agree) { // 提交
                url = "/workflow/instance/submitTask";
                data = {
                    taskId: taskId,
                    nodeUserIds: userIds,
                    opinion: taskOpinion,
                    fjId: fjId,
                    auditOpinion: auditOpinion,
                    dataId: dataId,
                    draft: draft,
                    title: result.wfTitle || param.wfTitle,
                    dataIds: result.dataIds
                };
            } else { // 退回
                url = "/workflow/instance/backTask";
                data = {
                    taskId: taskId,
                    nodeWfUserIds: backNodeIds,
                    opinion: taskOpinion,
                    fjId: fjId,
                    auditOpinion: auditOpinion,
                    dataId: dataId,
                    title: result.wfTitle || param.wfTitle,
                    dataIds: result.dataIds,
                    isSpecialBack: specialBackFlag
                };
            }
            $.ajax({
                type: "post",
                url: url,
                data: data,
                success: function (ar) {
                    if (ar.success) {
                        var tipMsg;
                        if (layerMsg) {
                            tipMsg = layerMsg;
                        } else {
                            if (opinion === "同意") {
                                tipMsg = "审批通过";
                            } else if (opinion === "提交") {
                                tipMsg = "提交成功";
                            } else if (opinion === "不同意") {
                                tipMsg = "退回成功";
                            } else if (opinion) {
                                tipMsg = opinion + "成功";
                            } else {
                                tipMsg = "办理完成";
                            }
                        }
                        if (workFlowType === "layer") {
                            RX.msg(RX.SUCCESS_OPERATE, tipMsg);
                            reloadPrevWin();
                        } else {
                            if (RX.cache(_top, "WORKFLOW._outerSystem")) {
                                postMessgToParent("close", tipMsg);
                            } else {
                                RX.msg(RX.SUCCESS_OPERATE, tipMsg);
                                RX.page.goto(toTag, null, true);
                            }
                        }
                        RX.page.closeAll();
                    } else {
                        RX.alert(ar.msg);
                    }
                }
            });
        }

        /**
         * 流程前置验证通过的处理
         * 表单提交
         * 流程提交
         */
        //data_id赋值的问题？？？
        function afterCheckWf(retVal) {
            //表单提交，在提交时使用的参数
            result = {flg: true};
            if (agree) {
                var submitResult = taskObj.submitForm(params);
                //result.flg 表单保存是否成功 result.ywDataId 业务数据ID result.wfTitle 流程实例标题
                if (submitResult.flg) {
                    result.ywDataId = submitResult.ywDataId;
                    result.wfTitle = submitResult.wfTitle;
                    result.msg = submitResult.msg;
                    result.dataIds = submitResult.dataIds;
                } else {
                    result.flg = false;
                }
                if (!dataId && result.ywDataId) {
                    dataId = result.ywDataId;
                    draft = true;
                }
            }
            if (result.flg) {
                //获取页面个性定义的opinion，可根据按钮的类型
                handleOpinion = taskObj.getWfOpinion(params) || handleOpinion;
                //提交确认页面
                var buildParam = {
                    id: taskId,
                    transactors: retVal.transactors,
                    nodeName: retVal.nodeName,
                    info: retVal.info,
                    sfbxscfj: retVal.sfbxscfj,
                    agree: agree,
                    opinion: handleOpinion || "",
                    sureFunc: _taskSubmit,
                    callBackCloseFunc: callBackClose,
                    layerMsg: result.msg,
                    isHasOpinion: isHasOpinion
                };
                RX.page.openWin({
                    title: agree?"办理确认":"办理确认(退回)",
                    areaType: ['450px', '380px'],
                    url: "/workflow/instance/handle",
                    param: buildParam
                });
            }
        }

        /**
         * 流程办理人的验证处理
         * @param data
         */
        function checkBlr(data) {
            //保存一份草稿数据，由于页面不关闭，所以直接不同保存草稿，用户自己保存
            // taskObj.tmpDataSave("saveDraft");
            draft = true;
            if ("endNode" === data.info || data.transactors) {
                afterCheckWf(data);
            } else {
                //办理人不存在
                RX.alert("下一环节办理人不存在，请联系管理员。");
                //     , function (index) {
                //     layer.close(index);
                //     callBackClose();
                // }, function () {
                //     callBackClose();
                // });
            }
        }

        /**
         * 设计表单需要进行的处理
         *
         * @param retVal 返回的值
         * @param data 传递参数
         */
        function dynamicGetBlr(retVal, data) {
            //自动表单配置的决策变量计算
            data.wfVars = taskObj.handleVars(retVal.vars);
            //再次提交
            //无需处理与之前相同的逻辑
            data.hasFlag = true;
            $.ajax({
                type: "post",
                url: "/workflow/instance/getHandleData",
                async: false,
                data: data,
                dataType: "json",
                success: function (ar) {
                    if (ar.success) {
                        checkBlr(ar.data);
                    } else {
                        RX.alert(ar.msg);
                    }
                }
            });
        }

        var formVars = "";
        if (agree) {
            //1、提交验证
            var checkResult = taskObj.checkForm(params);
            if (!checkResult.flg) {
                return;
            }
            //获取流程变量
            formVars = taskObj.getWfVars(params);
        }
        //处理意见的验证
        if (param.hasFlowAuditOpinion) {
            if (taskObj.checkAutoOpinion()) {
                auditOpinion = taskObj.getAutoOpinion();
            } else {
                return;
            }
        }
        if (taskId) {
            //获取下一环节的相关信息，办理人。不存在办理人使用。如果是退回操作呢？
            var data = (opinion === "提交" && sort == 1) ? {
                id: taskId,
                agree: agree,
                flowCode: param.flowCode || param.buildParam,
                wfVars: formVars
            } : {
                id: taskId,
                agree: agree,
                wfVars: formVars,
                backNodeIds: backNodeIds
            };
            data.hasFlag = false;
            $.ajax({
                type: "post",
                url: "/workflow/instance/getHandleData",
                async: false,
                data: data,
                dataType: "json",
                success: function (ar) {
                    //处理后置
                    if (ar.success) {
                        if (ar.data.vars) {
                            //需要进行赋值逻辑的处理，再次重新获取办理人信息
                            dynamicGetBlr(ar.data, data);
                        } else {
                            //办理人的验证，以及后续环节的处理
                            checkBlr(ar.data);
                        }
                    } else {
                        RX.alert(ar.msg);
                    }
                }
            });
        } else {
            $.post("/workflow/instance/startWorkflowAndGetHandleData",
                {
                    flowCode: flowCode,
                    wfVars: formVars,
                    sourceData: sourceData ? JSON.stringify(sourceData) : "",
                    dataIds: "",
                    startWfVars: startWfVars
                },
                function (ar) {
                    //逻辑问题，如果不存在动态表单的话，这段逻辑是错误的
                    if (ar.success) {
                        taskId = ar.data.taskId;
                        if (ar.data.vars) {
                            //需要进行赋值逻辑的处理，再次重新获取办理人信息
                            var data = (opinion === "提交" && sort == 1) ? {
                                id: taskId,
                                agree: agree,
                                flowCode: param.flowCode || param.buildParam
                            } : {
                                id: taskId,
                                agree: agree
                            };
                            dynamicGetBlr(ar.data, data);
                        } else {
                            //办理人的验证，以及后续环节的处理
                            checkBlr(ar.data);
                        }
                    } else {
                        RX.alert(ar.msg);
                    }
                });
        }
    }

    /**************************工作流按钮事件的处理******************************************/
    /**
     * 统一处理按钮事件
     * @param buttonConf
     */
    function handleWfButton(buttonConf) {
        //是自定义按钮
        if (buttonConf.type === RX.WF_DIY) {
            //个性按钮
            var funcName = buttonConf.funcName;
            var frameWin;
            if (tabPanel) {
                frameWin = tabPanel.getActiveTab().content.find("iframe")[0].contentWindow;
            } else {
                frameWin = RX.page.getWfForm(0).win;
            }
            frameWin[funcName] && frameWin[funcName](buttonConf.code);
        } else {
            var func;
            if (buttonConf.type) {
                func = btnFunc[buttonConf.type];
            } else {
                func = buttonConf.funcName;
            }
            var handleFunc;
            try {
                handleFunc = eval(func);
            } catch (e) {
            }
            if (typeof handleFunc === "function") {
                handleFunc(buttonConf);
            }
        }
    }

    /**
     * 工作流提交
     * @param buttonConfig
     */
    function submitWf(buttonConfig) {
        handleSubmit(buttonConfig.defOpinion || buttonConfig.name, true, buttonConfig.code, null, buttonConfig.opinion);
    }

    /**
     * 退回
     * @param buttonConfig
     */
    function refuseWf(buttonConfig) {
        if (hasMerge) { //  是聚合环节
            RX.page.openWin({
                title: "选择退回节点",
                areaType: ['280px', '200px'],
                url: "/workflow/instance/selectBackNode?nodeId=" + nodeId +"&wiId=" + wiId
            });
        } else {
            handleSubmit(buttonConfig.defOpinion || "不同意", false, buttonConfig.code, null, buttonConfig.opinion);
        }
    }

    /**
     *  草稿
     * @param buttonConfig
     */
    function saveDraft(buttonConfig) {
        /**
         * 保存每个表单的草稿
         */
        function handleTmpData() {
            if (taskObj.tmpDataSave(buttonConfig.code)) {
                reloadFlag = true;
                if (workFlowType === "layer") {
                    reloadPrevWin();
                    RX.page.close();
                    RX.msg("保存" + buttonConfig.name + "成功");
                } else {
                    if (RX.cache(_top, "WORKFLOW._outerSystem")) {
                        postMessgToParent("close", "保存" + buttonConfig.name + "成功");
                    } else {
                        RX.page.goto(toTag, null, true);
                        RX.msg("保存" + buttonConfig.name + "成功");
                    }
                }
            }
        }

        if (taskId) {
            handleTmpData();
        } else {
            taskObj.startWorkflow(flowCode, param.wfTitle, sourceData ? JSON.stringify(sourceData) : "", startWfVars, function (data) {
                taskId = data;
                handleTmpData();
            });
        }
    }

    /**
     * 撤回
     * @param buttonConfig
     */
    function cancelWf(buttonConfig) {
        RX.page.confirm("确认要撤回该任务吗？", function () {
            taskObj.withdrawWf(function () {
                if (workFlowType === "layer") {
                    RX.msg(RX.SUCCESS_OPERATE, "撤回成功");
                    var main = RX.page.prev();
                    if (main && main.reload) {
                        main.reload();
                    }
                } else {
                    if (RX.cache(_top, "WORKFLOW._outerSystem")) {
                        postMessgToParent("close", "撤回成功");
                    } else {
                        RX.msg(RX.SUCCESS_OPERATE, "撤回成功");
                        RX.page.goto(toTag);
                    }
                }
                RX.page.closeAll();
            });
        });
    }

    /**
     * 删除
     * @param buttonConfig
     */
    function delWf(buttonConfig) {
        RX.page.confirm("确定删除该条记录吗？", function () {
            //记录刷新标志
            reloadFlag = true;
            var result = {flg: true, msg: ""};
            if (dataId) {
                result = taskObj.deleteForm(buttonConfig.code);
            }
            if (result.flg) {
                result = taskObj.deleteFlow(taskId);
            }
            if(!result.flg) {
                RX.alert(result.msg);
            }
            if (workFlowType === "layer") {
                reloadPrevWin();
                RX.page.closeAll();
            } else {
                if (RX.cache(_top, "WORKFLOW._outerSystem")) {
                    postMessgToParent("close", "删除成功");
                } else {
                    RX.page.goto(toTag);
                }
            }
        });
    }

    /**
     * 保存
     * ps：功能暂未提供，保留
     */
    function saveWf(buttonConfig) {
        var checkFlag = taskObj.checkForm(buttonConfig.code);
        if (checkFlag.flag) {
            var saveFlag = taskObj.saveForm(buttonConfig.code);
            if (saveFlag.flag) {
                RX.page.alert(saveFlag.msg || ((buttonConfig.name || "保存") + "成功"));
            }
        }
    }

    /**
     * 查看流程图
     */
    function viewWf() {
        // var url = "/workflow/instance/workflowView?flowCode=" + flowCode;
        // if (wiId)
        //     url += "&id=" + wiId;
        // RX.page.openWin({
        //     title: "流程监控",
        //     areaType: ["850px", "550px"],
        //     url: url
        // });
        RX.page.open({
            title: "流程图",
            areaType: "big",
            url: "/workflow/ibps/flowImage",
            param: {wfId: wfId, instId: wiId}
        });
    }

    /**
     * 特送退回
     */
    function specialBack(buttonConfig) {
        var callBack = function (nodeId) {
            handleSubmit("特送退回", false, null, nodeId, buttonConfig.opinion, true);
        };
        var buildParam = {
            taskId: taskId,
            toTag: toTag,
            callBack: callBack
        };
        RX.page.openWin({
            title: "选择退回环节",
            areaType: [200, 300],
            url: "/workflow/instance/specialBack",
            param: buildParam
        });
    }

    /**
     * 催办
     */
    function pressWf() {
        RX.page.openWin({
            title: "填写催办内容",
            areaType: "small",
            url: "/workflow/instance/pressContent",
            param: {
                postPress: function (content) {
                    $.post("/workflow/instance/pressTask", {taskId: taskId, content: content}, function (ar) {
                        if (ar.success) {
                            RX.msg("催办成功");
                        } else {
                            RX.page.alert(ar.msg);
                        }
                    });
                }
            }
        });
    }

    /**
     * 关闭
     */
    function closeWf() {
        if (!flowViewTag) {
            if (workFlowType === "layer") {
                RX.page.close(null, true);
            } else {
                if (RX.cache(_top, "WORKFLOW._outerSystem")) {
                    postMessgToParent("close");
                } else {
                    RX.page.goto(toTag);
                }
            }
        } else {
            RX.page.close();
        }
    }

    //刷新前一个面板
    function reloadPrevWin() {
        var prev = RX.page.prev();
        if (prev && prev.reload) {
            prev.reload();
        }
    }
});

/**
 * 传递消息，通知父页面的操作
 * @param acction 通知父页面的动作，如：close关闭页面
 * @param msg 弹出消息
 */
function postMessgToParent(acction, msg) {
    RX.config.platformUrl && $("body").append("<iframe src='" + RX.config.platformUrl + "?type=workflow&action=" + acction + "&alertMsg=" + (RX.encode(msg)) + "' style='display: none;'></iframe>");
}

//页面resize
function resizePage() {
    //搜索区布局展示
    $("#sheetList").height($(window).height() - $(".bottomTips").outerHeight() - $(".operation_box").outerHeight());
    tabPanel && tabPanel.resize();
}

RX.page.cancelCheck = function () {
    //判断逻辑错误
    if (!$("#submit").is(":hidden")) {
        var closeTag = true;
        var framesList = RX.page.getWfForm();
        for (var i = 0; i < framesList.length; i++) {
            if (framesList[i].ifChange) {
                if (framesList[i].ifChange()) {
                    closeTag = false;
                    break;
                }
            }
        }
        if (!closeTag) {
            RX.confirm(RX.CANCEL_CHECK, function () {
                RX.page.close();
            });
            return false;
        }
    }
    //刷新页面
    if (workFlowType === "layer" && reloadFlag) {
        //1、是layer风格的，2、保存了通过了
        var main = RX.page.prev();
        if (main && main.reload) {
            main.reload();
        }
    }
    return true;
};

//查看附件(意见区-建委)
function lookAttachment(uuid) {
    RX.page.openWin({
        title: '查看附件',
        areaType: ["550px", "400px"],
        url: "/attachment/wfAttachment?fj_id=" + uuid + "&random=" + Math.random() + "&type=ck"
    });
}
