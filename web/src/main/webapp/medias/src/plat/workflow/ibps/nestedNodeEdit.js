var nestedNodeVm;
var nestedNodeJson = getCurrentBpmnElementData();
$(function () {
    initRxvm(nestedNodeJson);
});

function initRxvm(json) {
    if (bpmnProcessData && bpmnProcessData.id) {
        config.workflowName.layerConfig.param = {myCode: bpmnProcessData.code};
    }
    nestedNodeVm = new Rxvm({
        el: $("[data-tab='nested-settings']")[0],
        config: config,
        widget: RX.Grid,
        data: json,
        methods: {
            selTransactor: function () {
                var ids = getSelectedTransactorIds() || [];
                RX.page.open({
                    title: "选择办理人",
                    url: "/workflow/transactor/transactorSelect",
                    param: {
                        func: "transactorSelectCallback",
                        ids: ids.join(",")
                    }
                });
            },
            delTransactor: function (keypath) {
                this.set(keypath + ".sfyxSt", "UNVALID");
            }
        }
    });
}

// 保存结束环节
function updateNodeAttr(operate) {
    if (!operate || operate !== "remove") {
        updateValue(config, nestedNodeVm.get(), nestedNodeJson);
        nestedNodeJson["transactors"] = nestedNodeVm.get("transactors");
    }
}

//获取选中子流程的id
function getSelectedWorkflowCode() {
    return nestedNodeVm.get("workflowCode");
}

//获取子流程环节
function getSubProcessNodeDict(model) {
    var dNodeDict = [];
    var inTag = false;
    var activityNodes = nestedNodeJson.activityNodes;
    if (activityNodes && activityNodes.length) {
        for (var i = 0; i < activityNodes.length; i++) {
            var tnode = activityNodes[i];
            dNodeDict.push({"code": tnode.ID, "value": tnode.NAME});
            //匹配初始化选中
            if (model.get("rejectedNodeId") == tnode.ID) {
                inTag = true;
            }
        }
    }
    if (!inTag) {
        model.set("rejectedNodeId", "");
    }
    return dNodeDict;
}

//选择流程后回调
function workflowSelectCallback(sels) {
    if (sels && sels.length) {
        nestedNodeVm.set("workflowCode", sels[0].CODE);
        nestedNodeVm.set("workflowName", sels[0].NAME);
    }
}

//获取选中办理人的ids
function getSelectedTransactorIds() {
    var transactorArr = nestedNodeVm.get("transactors");
    var ids = [];
    if (transactorArr && transactorArr.length) {
        for (var i = 0, modelsLength = transactorArr.length; i < modelsLength; i++) {
            if (transactorArr[i].sfyxSt !== "UNVALID") {
                ids.push(transactorArr[i].transactorId);
            }
        }
    }
    return ids;
}

//选择办理人后回调
function transactorSelectCallback(sels) {
    var obj;
    for (var i = 0, maxLength = sels.length; i < maxLength; i++) {
        obj = sels[i];
        nestedNodeVm.append("transactors", {
            transactorId: obj.ID,
            transactorName: obj.NAME,
            sfyxSt: "VALID"
        });
    }
}