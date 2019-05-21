var config = {
    id: {        //主键ID
        display: false
    },
    sfyxSt: {        //是否有效
        display: false,
        defaultValue: "VALID"
    },
    name: {         //环节名称
        rules: {checkSave: ["notNull"]},
        type: "normal",
        maxLength: 25
    },
    workflowCode: {},
    workflowName: {
        type: "layer",
        rules: {checkSave: ["notNull"]},
        layerConfig: {
            url: "/workflow/ibps/flowDefSelect",
            title: "选择子流程",
            callbackFunc: "workflowSelectCallback",
            canDelete: true,
            deleteProperty: "workflowCode"
        }
        // , ifForm: false
    },
    blrChoose: { //办理人是否可选
        type: "dict",
        dictConfig: {
            dictCode: [{code: "0", value: "默认"}, {code: "1", value: "可选"}, {code: "2", value: "不可选"}],
            checkType: "radio"
        },
        defaultValue: "0",
        disabled: false
    },
    disagreeNodeDomid: {        //不同意跳转至
        type: "dict",
        dictConfig: {
            reqInterface: "getDisagreeNodeDict",
            plsSelectName: "默认(退回上一环节)"
        }
    },
    rejectedNodeId: {      //被退回至子流程
        type: "dict",
        dictConfig: {
            reqInterface: "getSubProcessNodeDict",
            plsSelectName: "默认(子流程最后一个办理环节)"
        }
    },
    "transactors.*.id": {        //主键ID
        display: false
    },
    "transactors.*.sfyxSt": {        //是否有效
        disabled: false,
        display: false,
        defaultValue: "VALID"
    },
    "transactors.*.transactorName": {          //办理人名称
    },
    "transactors.*.transactorId": {
        display: false
    }
};