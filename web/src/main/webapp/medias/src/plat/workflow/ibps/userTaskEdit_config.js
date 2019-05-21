// 活动环节配置
var nodeConfig = {
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
    convergeType: {         //聚合方式
        defaultValue: "2"
    },
    sort: {      //环节序号
        // defaultValue: "" + (bpmnProcessData["nodeMaxSort"] + 1),   //2018-10-11 不在此处生成序号
        rules: {checkValue: ["isIntGteZero"]}
    },
    sfbxscfj: {      //是否必须上传附件
        defaultValue: "0"
    },
    startupProcessSql: {        //前处理程序
    },
    autoHandleSql: {        //自动办理程序
    },
    variableName: {                //辅助字段：变量名称
        ifForm: false
    },
    variableValue: {                //辅助字段：变量值
        ifForm: false
    },
    // roleId: {            //环节角色id
    // },
    // roleName: {            //环节角色id
    //     // rules: {checkSave: ["notNull"]},
    //     type: "layer",
    //     layerConfig: {
    //         title: "选择已有角色",
    //         style: "medium",
    //         url: "/role/sysRoleSelect?flag=workflow&kind=all",
    //         callbackFunc: "roleSelectCallback",
    //         canDelete: true
    //     },
    //     changeFunc: "roleChangeFunc",
    //     ifForm: false
    // },
    // roleCode: {            //环节角色id
    //     disabled: true,
    //     ifForm: false,
    //     spanShow: false
    // },
    // roleType: {
    //     ifForm: false,
    //     spanShow: false
    // },
    // roleMade: {
    //     ifForm: false
    // },
    // roleTypeName: {
    //     disabled: true,
    //     ifForm: false,
    //     spanShow: false
    // },
    disagreeNodeDomid: {        //不同意跳转至
        type: "dict",
        dictConfig: {
            reqInterface: "getDisagreeNodeDict",
            plsSelectName: "默认(退回上一环节)"
        }
    },
    domid: {
        ifForm: false
    },
    ywzt: {  //环节业务状态
        type: "dict",
        dictConfig: {
            dictCode: ""
        }
    },
    nodeCode: {  //环节编码
        type: "dict",
        dictConfig: {
            dictCode: ""
        }
    },
    sfxscg: {       //是否显示草稿按钮
        type: "dict",
        dictConfig: {
            dictCode: "SF",
            checkType: "radio"
        },
        defaultValue: "1"
    },
    sfxscb: {       //是否显示催办按钮
        type: "dict",
        dictConfig: {
            dictCode: "SF",
            checkType: "radio"
        },
        defaultValue: "0"
    },
    sfxstj: {       //是否显示提交按钮，审批环节为同意
        type: "dict",
        dictConfig: {
            dictCode: "SF",
            checkType: "radio"
        },
        defaultValue: "1"
    },
    submitName: {   //提交个性设置名称
        maxLength: 25
    },
    saveName: {    //保存个性设置名称
        maxLength: 25
    },
    //环节类型
    nodeGenre: {
        type: "dict",
        dictConfig: {
            checkType: "radio",
            dictCode: [{code: "0", value: "提交"}, {code: "1", value: "审批"}]
        },
        defaultValue: "0"
    }
};

//办理人设置
var transactorCondig = {
    blrSfkx: { //办理人是否可选
        type: "dict",
        dictConfig: {
            dictCode: [{code: "0", value: "默认"}, {code: "1", value: "可选"}, {code: "2", value: "不可选"}],
            checkType: "radio"
        },
        defaultValue: "0",
        disabled: false
    },
    transactType: {        //多人办理方式
        type: "dict",
        dictConfig: {
            dictCode: "BLFS",
            checkType: "radio"
        },
        defaultValue: "0"//抢占式
    },
    countersignParameter: {      //会签处理参数类型
        type: "dict",
        dictConfig: {
            dictCode: "HQFS",
            showPlsSelect: false
        }
    },
    countersignValue: {     //会签处理参数值
        defaultValue: ""
    },
    "list.*.id": {        //主键ID
        display: false
    },
    "list.*.sfyxSt": {        //是否有效
        disabled: false,
        display: false,
        defaultValue: "VALID"
    },
    "list.*.transactorName": {          //办理人名称
    },
    "list.*.transactorId": {
        display: false
    }
};


// var nodeRoleConfig = {
//     roleId: {            //环节角色id
//     },
//     roleName: {            //环节角色id
//         // rules: {checkSave: ["notNull"]},
//         type: "layer",
//         layerConfig: {
//             title: "选择已有角色",
//             style: "medium",
//             url: "/role/sysRoleSelect?flag=workflow&kind=all",
//             callbackFunc: "roleSelectCallback",
//             canDelete: true
//         },
//         changeFunc: "roleChangeFunc",
//         ifForm: false
//     },
//     roleCode: {            //环节角色id
//         disabled: true,
//         ifForm: false,
//         spanShow: false
//     },
//     roleType: {
//         ifForm: false,
//         spanShow: false
//     },
//     roleMade: {
//         ifForm: false
//     },
//     roleTypeName: {
//         disabled: true,
//         ifForm: false,
//         spanShow: false
//     }
// };

//环节表单配置
var nodeSheetConfig = {
    "sheets.*.id": {        //主键ID
        display: false
    },
    "sheets.*.sfyxSt": {        //是否有效
        disabled: false,
        display: false,
        defaultValue: "VALID"
    },
    "sheets.*.title": {          //标题
        rules: {checkSave: ["notNull"]},
        maxLength: 25
    },
    "sheets.*.name": {          //名称
    },
    "sheets.*.sheet_id": {              //表单id
        type: "dict",
        dictConfig: {
            reqInterface: "getNodePageDict"
        },
        changeFunc: "sheetIdChangeFunc",
        rules: {checkSave: ["notNull"]}
    },
    "sheets.*.diyFormId": {         //设计表单id
        display: false
    },
    "sheets.*.sort": {         //序号
        rules: {checkSave: ["notNull"], checkKeyup: ["isIntGteZero"]}
    },
    "sheets.*.showCondition": {        //表单显示条件
        type: "dict",
        defaultValue: "0",
        dictConfig: {
            dictCode: [{code: "0", value: "显示"}, {code: "1", value: "有实例显示"}, {code: "2", value: "无实例显示"}],
            showPlsSelect: false
        },
        rules: {checkSave: ["notNull"]}
    },
    "sheets.*.control": {           //表单操作方式
        type: "dict",
        defaultValue: "EDIT",
        dictConfig: {
            dictCode: [{code: "EDIT", value: "编辑"}, {code: "VIEW", value: "查看"}],
            showPlsSelect: false
        },
        //changeFunc: "sheetModeChangeFunc",
        rules: {checkSave: ["notNull"]}
    },
    "sheets.*.sheetMode": {           //表单操作方式
    },
    "sheets.*.spxName": {         //审批项名称
        maxLength: 50
    },
    "sheets.*.spxSort": {         //审批项序号
        rules: {checkKeyup: ["isIntGteZero"]}
    },
    "sheets.*.spxPrint": {         //审批项是否打印
        type: "dict",
        dictConfig: {
            dictCode: "SF",
            showPlsSelect: false
        },
        defaultValue: "0"//否
    }
};

//环节按钮配置
var nodeButtonConfig = {
    "buttons.*.id": {
        display: false
    },
    "buttons.*.name": {                //名称
        rules: {checkSave: ["notNull"]},
        maxLength: 25
    },
    "buttons.*.code": {
        rules: {checkSave: ["notNull"]},
        maxLength: 25
    },
    "buttons.*.icon": {
        maxLength: 25
    },
    "buttons.*.flag": {
        maxLength: 25
    },
    "buttons.*.funcName": {
        maxLength: 25
    },
    /*"btns.*.nodeId": {},*/
    "buttons.*.sort": {
        rules: {checkKeyup: ["isIntGte"], checkSave: ["notNull"]},
        maxLength: 2
    },
    "buttons.*.isShowInHandle": {
        type: "dict",
        dictConfig: {
            dictCode: [{value: "办理中", code: RX.WFBTN_SHOW_IN}, {value: "办理后", code: RX.WFBTN_SHOW_AFTER},
                {value: "业务控制", code: RX.WFBTN_SHOW_DIY}, {value: "所有时段", code: RX.WFBTN_SHOW_All}],
            plsSelectName: "程序控制"
        }
    },
    "buttons.*.type": {        //按钮类型
        rules: {checkSave: ["notNull"]},
        type: "dict",
        dictConfig: {
            dictCode: RX.cache(_top, "WFBTNDICT")
        },
        changeFunc: "changeButtonType"
    },
    "buttons.*.opinion": {       //默认意见
        length: 200
    },
    "buttons.*.sfyxSt": {        //是否有效
        display: false,
        defaultValue: "VALID"
    }
};


//环节后置配置
var nodeProcessConfig = {
    "processes.*.id": {
        display: false
    },
    "processes.*.type": {  // 类型
        type: "dict",
        defaultValue: "SQL",
        dictConfig: {
            dictCode: [{code: "SQL", value: "SQL"}, {code: "JAVA", value: "JAVA"}, {code: "PROCEDURE", value: "PROCEDURE"}],
            showPlsSelect: false
        },
        rules: {checkSave: ["notNull"]}
    },
    "processes.*.action": { // 动作
        type: "dict",
        defaultValue: "SUBMIT",
        dictConfig: {
            dictCode: [{code: "SUBMIT", value: "提交"}, {code: "BACK", value: "退回"}, {code: "RECOVER", value: "撤回"}, {code: "SPECIAL_BACK", value: "特送退回"}, {code: "ALL", value: "所有动作"}],
            showPlsSelect: false
        },
        rules: {checkSave: ["notNull"]}
    },
    "processes.*.content": { // 内容
        maxLength: 1000
    },
    "processes.*.sort": { // 排序号
        rules: {checkKeyup: ["isIntGte"], checkSave: ["notNull"]},
    },
    "processes.*.sfyxSt": {        //是否有效
        display: false,
        defaultValue: "VALID"
    }
};