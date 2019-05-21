var config = {
    id: {
        display: false
    },
    name: {
        rules: {checkSave: ["notNull"]}
    },
    decisionType: {
        rules: {checkSave: ["notNull"]},
        type: "dict",
        dictConfig: {
            dictCode: [{code: "1", value: "自动决策"}, {code: "0", value: "手动决策"}],
            checkType: "radio"
        },
        spanShow: false,
        defaultValue: "1"
    }
};

var variableConfig = {
    "variables.*.id": {        //主键ID
        display: false
    },
    "variables.*.sfyxSt": {        //是否有效
        display: false,
        defaultValue: "VALID"
    },
    "variables.*.name": {                //名称
        rules: {checkSave: ["notNull"]},
        maxLength: 50
    },
    "variables.*.code": {                //标识
        display: false
    },
    "variables.*.value": {              //默认值
        rules: {checkSave: ["notNull"]},
        maxLength: 50
    },
    "variables.*.assignLogic": {                //赋值逻辑
        display: false
        // type: "layer",
        // layerConfig: {
        //     url: "/workflow/ibps/assignLogic",
        //     title: "赋值逻辑编辑",
        //     checkFunc: "checkAssignLogic",
        //     callbackFunc: "addAssignLogicCallback",
        //     canDelete: true
        // }
    }
};


