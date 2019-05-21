var bpmnConfig = {
    "bpmn:Process": {
        tabs: [{
            id: "proc-general",
            label: "基本信息"
        }, {
            id: "proc-forms",
            label: "表单"
        }, {
            id: "proc-variables",
            label: "变量"
        }, {
            id: "proc-handler",
            label: "后处理"
        }],
        url: "/workflow/ibps/processEdit",
        module: ["zTree",
            "/medias/src/plat/workflow/design/util/flow.property.js",
            "/medias/src/plat/workflow/ibps/processEdit_config.js",
            "/medias/src/plat/workflow/ibps/processEdit.js"]
    },
    "bpmn:StartEvent": {
        tabs: [{
            id: "start-settings",
            label: "设置"
        }],
        url: "/workflow/ibps/startEventEdit",
        module: ["/medias/src/plat/workflow/ibps/startEventEdit_config.js",
            "/medias/src/plat/workflow/ibps/startEventEdit.js"
        ],
        typeValue: "0"
    },
    "bpmn:SequenceFlow": {
        tabs: [{
            id: "seq-settings",
            label: "流向条件设置"
        }],
        url: "/workflow/ibps/sequenceFlowEdit",
        module: [
            "zTree", '/medias/src/plat/form/lib/jquery/plugins/jquery.layout.min.js',
            "/medias/plugin/codemirror/lib/codemirror.min.js",
            "/medias/plugin/codemirror/addon/hint/show-hint.js",
            "/medias/plugin/codemirror/mode/formula/formula-mode.js",
            "/medias/plugin/codemirror/mode/formula/formula-hint.js",
            "/medias/src/plat/workflow/ibps/formulaEditor.js",
            "/medias/src/plat/workflow/ibps/sequenceFlowEdit_config.js",
            "/medias/src/plat/workflow/ibps/sequenceFlowEdit.js"
        ]
    },
    "bpmn:UserTask": {
        tabs: [{
            id: "task-settings",
            label: "设置"
        }, {
            id: "assignee",
            label: "办理"
        }, {
            id: "forms",
            label: "表单"
        }, {
            id: "afterHandler",
            label: "后处理"
        }, {
            id: "extra-settings",
            label: "高级设置"
        }], url: "/workflow/ibps/userTaskEdit",
        module: [
            "/medias/src/plat/workflow/ibps/userTaskEdit_config.js",
            "/medias/src/plat/workflow/ibps/userTaskEdit.js"
        ],
        typeValue: "2"
    },
    "bpmn:CallActivity": {
        tabs: [{
            id: "nested-settings",
            label: "设置"
        }], url: "/workflow/ibps/nestedNodeEdit",
        module: ["/medias/src/plat/workflow/ibps/nestedNodeEdit_config.js",
            "/medias/src/plat/workflow/ibps/nestedNodeEdit.js"
        ],
        typeValue: "5"
    },
    "bpmn:ExclusiveGateway": {
        tabs: [{
            id: "gateway-settings",
            label: "设置"
        }], url: "/workflow/ibps/exclusiveGatewayEdit",
        module: ["/medias/src/plat/workflow/ibps/exclusiveGatewayEdit_config.js",
            "/medias/src/plat/workflow/ibps/exclusiveGatewayEdit.js"
        ],
        typeValue: "4"
    },
    "bpmn:EndEvent": {
        tabs: [{
            id: "end-settings",
            label: "设置"
        }], url: "/workflow/ibps/endEventEdit",
        module: ["/medias/src/plat/workflow/ibps/endEventEdit_config.js",
            "/medias/src/plat/workflow/ibps/endEventEdit.js"
        ],
        typeValue: "1"
    }
};
//为平台所用的bpmn元素
var bpmnNodeShape = ["bpmn:StartEvent", "bpmn:UserTask", "bpmn:CallActivity", "bpmn:ExclusiveGateway", "bpmn:EndEvent"],
    bpmnRoutersShape = ["bpmn:SequenceFlow"];

//缓存数据
var bpmnProcessData = {nodeMaxSort: 0}, bpmnNodesData = {}, bpmnRoutersData = {}, removeShapeStack = {},
    designMode,
    currentBpmnElement;

// /**
//  * 获取所有的节点
//  * @returns {{}}
//  */
// function getAllNodes() {
//     var arr = [], extraDomArray = [];
//     for (var node in bpmnNodesData) {
//         var nodeData = bpmnNodesData[node];
//         if (nodeData.fromServer && nodeData.type && (nodeData.type === bpmnConfig["bpmn:UserTask"].typeValue || nodeData.type === bpmnConfig["bpmn:CallActivity"].typeValue)) {
//             extraDomArray.push(nodeData.domid);
//         } else {
//             arr.push(bpmnNodesData[node]);
//         }
//     }
//     //需要从服务端获取的节点数据
//     if (extraDomArray.length) {
//         RX.loading();
//         $.ajax({
//             type: "post",
//             async: false,
//             url: "/workflow/ibps/getNodesFromServer",
//             data: {wfId: bpmnProcId, domid: extraDomArray},
//             success: function (ar) {
//                 RX.closeLoading();
//                 if (ar && ar.success && ar.data && ar.data.length) {
//                     $.each(ar.data, function (i, e) {
//                         bpmnNodesData[e.domid] = e;
//                         if (e.type == bpmnConfig["bpmn:UserTask"]) {
//                             //前后端属性对应
//                             e.finishProcessSql = e.finishProcess;
//                         }
//                         arr.push(e);
//                     });
//                 }
//                 return arr;
//             }
//         });
//     } else {
//         return arr;
//     }
// }

/**
 * 获取工作流配置
 */
function getFlowData() {
    return bpmnProcessData;
}

//构造退回环节
// function getDisAgreeNode(vm) {
//     var options = [{id: 0, "text": "默认(退回上一环节)"}];
//     for (var k in bpmnNodesData) {
//         var nodeData = bpmnNodesData[k];
//         if (k !== vm.get("domid")) {
//             if (nodeData.type == bpmnConfig["bpmn:UserTask"].typeValue) {
//                 //活动环节
//                 options.push({"id": k, "text": nodeData.name});
//             } else if (nodeData.type == bpmnConfig["bpmn:CallActivity"].typeValue) {
//                 //嵌套环节
//                 //遍历嵌套子流程的环节
//                 var activityNodes = nodeData.activityNodes;
//                 if (activityNodes && activityNodes.length) {
//                     var group = {"text": nodeData.name};
//                     var children = [];
//                     for (var c = 0; c < activityNodes.length; c++) {
//                         children.push({"id": activityNodes[c].DOM_ID, "text": activityNodes[c].NAME});
//                     }
//                     group.children = children;
//                 }
//                 options.push(group);
//             }
//         }
//     }
//     return options;
// }

//获取退回环节编码
function getDisagreeNodeDict(model) {
    var dNodeDict = [];
    var inTag = false;
    for (var k in bpmnNodesData) {
        var tnode = bpmnNodesData[k];
        if (tnode.domid && tnode.sfyxSt != "UNVALID" && model.get("domid") != tnode.domid
            && (tnode.type == bpmnConfig["bpmn:UserTask"].typeValue || tnode.type == bpmnConfig["bpmn:CallActivity"].typeValue) && tnode.name) {
            dNodeDict.push({"code": tnode.domid, "value": tnode.name});
            //匹配初始化选中
            if (model.get("disagreeNodeDomid") == tnode.domid) {
                inTag = true;
            }
        }
    }
    if (!inTag) {
        model.set("disagreeNodeDomid", "");
    }
    return dNodeDict;
}

/**
 * 复制为新版本
 * @param id
 */
function copyAsNewVersion(id) {
    RX.page.goto("/workflow/ibps/designer", {id: id, operatingStatus: OperatingStatus.NEWVERSION});
}

// 操作状态
var OperatingStatus = {
    CREATED: '1', // 新建
    MODIFY: '2', // 修改
    NEWVERSION: '3', // 新版本
    COPYSTRUCTURE: '4', // 复制结构
    SAVEAS: '5', // 另存：新版本+复制结构
    IMPORTING: '6'// 导入
};

/**
 * 保存状态
 * @type {{Draft: string, Release: string, Disabled: string}}
 */
var SaveStatus = {
    Draft: "0",
    Release: "1",
    Disabled: "2"
};
