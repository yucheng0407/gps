
var flowConfig = {
    id: {        //主键ID
        display: false
    },
    sfyxSt: {        //是否有效
        display: false,
        defaultValue: "VALID"
    },
    name: {         //流程名称
        rules: {checkSave: ["notNull"]},
        type: "normal",
        maxLength: 25
    },
    version: {          //工作流版本
        rules: {checkValue: ["isIntGteZero"]},
        defaultValue: "",
        disabled: true
    },
    versionName: {             //原始版本流程名称
        type: "layer",
        layerConfig: {
            title: "选择原始流程",
            style: ["300px", "400px"],
            url: "/workflow/design/workflowTypeSelect?selectType=workflow&",
            callbackFunc: "versionWorkflowCallback"
        }
    },
    workflow: {              //原始版本流程id
        display: false
    },
    code: {         //流程编码
        rules: {checkKeyup: ["isCode"], checkSave: ["notNull"]},
        maxLength: 50,
        type: "normal"
    },
    instanceTitle: {            //流程实例标题
        rules: {checkSave: ["notNull"]},
        type: "normal",
        maxLength: 25
    },
    type: {
        disabled: false,
        display: false
    },
    typeName: {
        rules: {checkSave: ["notNull"]},
        type: "layer",
        layerConfig: {
            title: "选择流程类别",
            style: ["300px", "400px"],
            url: "/workflow/design/workflowTypeSelect?",
            callbackFunc: "workflowTypeCallback"
        }
    },
    workflowYwztZd: {  //业务状态字典
        display: false
    },
    workflowYwztZdName: {  //业务状态字典名称
        type: "layer",
        layerConfig: {
            title: "选择字典",
            url: "/dict/sysDictSelect?",
            callbackFunc: "ywzdSelectCallBack",
            canDelete: true
        },
        changeFunc: "clearYwztZd"
    },
    nodeCodeDictCode: { //环节编码字典 编码
        display: false
    },
    nodeCodeDictName: { //环节编码字典 名称
        type: "layer",
        layerConfig: {
            title: "选择字典",
            url: "/dict/sysDictSelect?",
            callbackFunc: "nodeCodeDictSelectCallBack",
            canDelete: true
        },
        changeFunc: "clearnodeCode"
    },
    startupProcessSql: {},
    finishProcessSql: {
        type: "textarea",
        textareaConfig: {
            showNum: true
        },
        maxLength: 500
    },
    autoHandleSql: {},
    description: {}
};

var sheetConfig = {
    "list.*.id": {        //主键ID
        display: false
    },
    "list.*.sfyxSt": {        //是否有效
        disabled: false,
        display: false,
        defaultValue: "VALID"
    },
    "list.*.sort": {         //序号
        rules: {checkSave:["notNull"], checkValue: ["isIntGteZero"]}
    },
    "list.*.title": {          //标题
        rules: {checkSave:["notNull"]},
        maxLength: 25
    },
    "list.*.sheet_id": {              //表单id
        display: false,
        rules: {checkSave:["notNull"]}
    },
    "list.*.name": {
        type: "layer",
        layerConfig: {
            title: "选择表单",
            url: "/workflow/design/sheetSelect",
            callbackFunc: "sheetCallback",
            checkFunc: "setDisabledChoose"
        },
        rules: {checkSave:["notNull"]},
    }
};

var variableConfig = {
    "list.*.id": {        //主键ID
        display: false
    },
    "list.*.sfyxSt": {        //是否有效
        display: false,
        defaultValue: "VALID"
    },
    "list.*.name": {                //名称
        rules: {checkSave: ["notNull"]},
        maxLength: 50
    },
    "list.*.value": {              //默认值
        rules: {checkSave: ["notNull"]},
        maxLength: 50
    }
};


var buttonArr = [
    {
        id: "save",
        name: "保存",
        onClick: "saveWorkflow",
        style: "c_button"
    }
];

var buttonsJson = {
    tag: ".w_button_box",
    buttons: buttonArr
};



