var handleVm;
var param = RX.page.param;
$(function () {
    // if(param.blrList && param.blrList.length > 0) {
    //     // 分组办理人
    //     var nodeMap = {};
    //     param.blrList.forEach(function (value) {
    //         if (nodeMap[value.NEXT_NODE_ID]) {
    //             nodeMap[value.NEXT_NODE_ID].blrList.push({
    //                 "USER_ID": value.USER_ID,
    //                 "USER_NAME": value.USER_NAME,
    //                 "ORGAN_NAME": value.ORGAN_NAME,
    //                 "TAG": value.TAG
    //             });
    //         } else {
    //             nodeMap[value.NEXT_NODE_ID] = {
    //                 "NEXT_NODE_ID": value.NEXT_NODE_ID,
    //                 "NEXT_NODE_NAME": value.NEXT_NODE_NAME,
    //                 "BLR_CHOOSE": value.BLR_CHOOSE,
    //                 "blrList": [{
    //                     "USER_ID": value.USER_ID,
    //                     "USER_NAME": value.USER_NAME,
    //                     "ORGAN_NAME": value.ORGAN_NAME,
    //                     "TAG": value.TAG
    //                 }]
    //             };
    //         }
    //     });
    //     var nodeBlrList = [], nodeNames = [];
    //     for (var key in nodeMap) {
    //         nodeBlrList.push(nodeMap[key]);
    //         nodeNames.push(nodeMap[key].NEXT_NODE_NAME);
    //     }
    //     // 分支环节时取多个环节名称
    //     if (nodeNames.length > 0) {
    //         param.nodeName = nodeNames.join(", ");
    //     }
    //     param.nodeBlrList = nodeBlrList;
    // }
    //初始化按钮
    RX.button.init($('.w_button_box'), buttonsJson);
    // 初始化vm组件
    handleVm = new Rxvm({
        el: ".form_box",
        config: config,
        data: param,
        components: {
            "BlrList": {
                widget: RX.Grid,
                template: "loadTpl:noPaddingGridTpl",
                settings: settings,
                afterCreate: function () {
                    if (this.get("choose") == '1') {
                        //办理人可选
                        this.$options.settings.selectType = "multi";
                        this.$options.settings.autoListBox.checkbox = true;
                        this.$options.settings.autoListBox.selected = true;
                    } else {
                        //办理人不可选
                        this.$options.settings.selectType = "none";
                        this.$options.settings.autoListBox.selected = false;
                    }
                }
            }
        }
    });
});

// 提交任务
function submitTask() {
    if (handleVm.ruleValidate()) {
        var nodeUsers = '';
        var isAssign = false; // 是否含有指定办理人的情况
        if (handleVm.$children && handleVm.$children.length > 0) {
            for (var i = 0; i < handleVm.$children.length; i++) {
                var child = handleVm.$children[i];
                var nodeName = child.get("name");
                nodeUsers += child.get("nextNodeId") + "|";
                var userIds = [];
                /*验证环节办理人是否为空*/
                if (child.get("list").length == 0) {
                    RX.alert(nodeName + "环节办理人为空，请联系管理员");
                    return;
                }
                var choose = child.$options.settings.autoListBox.checkbox;
                /*若办理人可选需要校验是否为空*/
                if (choose) {
                    var selectedRows = child.getSelected();
                    if (!selectedRows || selectedRows.length == 0) {
                        RX.alert("请选择" + nodeName + "环节办理人");
                        return;
                    }
                    $.each(selectedRows, function (index, value) {
                        userIds.push(value.USER_ID);
                    });
                    // 若选择的人与总人数不相等则存在指定人办理人的情况
                    if (selectedRows.length != child.get("list").length) {
                        isAssign = true;
                    }
                } else {
                    $.each(child.get("list"), function (index, value) {
                        userIds.push(value.USER_ID);
                    });
                }
                // nodeUsers格式:n1|user11,user12;n2|user21
                nodeUsers += userIds.join(",") + ";";
            }
        }
        if (isAssign) {
            param.sureFunc(handleVm.get("opinion"), handleVm.get("fj_id"), param.layerMsg, true, nodeUsers);
        } else {
            param.sureFunc(handleVm.get("opinion"), handleVm.get("fj_id"), param.layerMsg, true);
        }
    } else {
        RX.alert("请填写办理意见！");
    }
}

//上传/查看附件
function uploadOrViewFile() {
    var fjId = handleVm.get("fj_id");
    if (!fjId) {
        fjId = RX.uuid();
        handleVm.set("fj_id", fjId);
    }
    RX.page.open({
        title: "资料附件上传",
        areaType: ["550px", "400px"],
        url: "/attachment/wfAttachment?fj_id=" + fjId
    });
}


RX.page.cancelCheck = function () {
    RX.confirm("是否取消提交?", function () {
        param.callBackCloseFunc();
    })
}
