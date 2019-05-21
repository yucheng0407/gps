//todo 将这种左右布局，公式式的交互风格抽成公共模板
//变量可以从全局中获取variables
var routerJson = getCurrentBpmnElementData(),
    startNode = findExclusiveNode(), formulaEditor;
$(function () {
    if (routerJson.fromServer) {
        $.ajax({
            url: "/workflow/ibps/getBpmnSimpleRouter",
            type: "post",
            data: {wfId: bpmnProcId, domid: routerJson.domid},
            success: function (data) {
                routerJson.id = data.id;
                initRxvm(data);
            }
        });
    } else {
        initRxvm(routerJson);
    }
});

function initRxvm(json) {
    formulaEditor = new FormulaEditor({
        treeData: getVarData,
        el: $("[data-tab='seq-settings']").find('.form_box'),
        treeEl: $("#variableTree"),
        preFix: "[WF:",
        sufFix: "]",
        dataRex: "\\[WF:[0-9a-zA-Z\\._]+\\]",
        getValueName: function (node, parentNode) {
            return node.name;
        },
        getValueCode: function (node, parentNode) {
            return node.key;
        }
    });
    json.branch && formulaEditor.setEditorValue(json.branch);
}

function getVarData() {
    var variables = getFlowData().variables;
    //先默认数据
    var obj, variable, treeData = [];
    treeData.push({
        name: "全局变量",
        icon: RX.ctxPath + "/medias/style/plat/image/resource/res_page.png",
        handleId: "gloable",
        open: true,
        type: "type"
    });
    treeData.push({
        name: "决策变量",
        icon: RX.ctxPath + "/medias/style/plat/image/resource/res_page.png",
        handleId: "part",
        open: true,
        type: "type"
    });
    treeData.push({
        name: "流程变量",
        icon: RX.ctxPath + "/medias/style/plat/image/resource/res_page.png",
        handleId: "flow",
        open: true,
        type: "type"
    });
    if (variables) {
        for (var i = 0, maxLength = variables.length; i < maxLength; i++) {
            variable = variables[i];
            //只能是上一环决策环节+全局初始的变量
            if (variable.sfyxSt !== "UNVALID" && (!variable.domid || "null" === variable.domid || variable.domid.startWith(startNode.domid))) {
                obj = {
                    name: variable.name,
                    key: variable.name,
                    icon: RX.ctxPath + "/medias/style/plat/image/resource/res_page.png",
                    handleId: variable.name
                };
                if (!variable.domid || "null" === variable.domid) {
                    obj.handleParentId = "gloable";
                } else if (variable.domid.startWith(startNode.domid)) {
                    obj.handleParentId = "part";
                }
                treeData.push(obj);
            }
        }
    }
    //获取流程变量，塞入流程分类中

    return treeData;
}

// 保存流向
function updateNodeAttr(operate) {
    if (!operate || operate !== "remove") {
        if (formulaEditor) {
            routerJson.branch = formulaEditor.getEditorValue().formula;
        }
        if (routerJson.fromServer) {
            routerJson.fromServer = false;
        }
    }
}