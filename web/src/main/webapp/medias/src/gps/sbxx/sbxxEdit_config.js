//model渲染方案配置
var roleConfig = {
    id: {        //主键ID
        display: false
    },
    sbmc: {        //角色名称
        rules: {checkSave: ["notNull"]},
        maxLength: 25
    },
    zyid: {        //角色编码
        rules: {checkSave: ["notNull"]},
        maxLength: 20
    },
    sspcsmc: {        //角色编码
        rules: {checkSave: ["notNull"]},
        maxLength: 20
    },
    sspcsdm: {        //角色编码
        rules: {checkSave: ["notNull"]},
        maxLength: 20
    },
    bz: {   //描述
        type: "textarea",
        textareaConfig: {
            showNum: true
        },
        maxLength: 100
    },
    sblx: {        //角色类型
        rules: {checkSave: ["notNull"]},
        type: "dict",
        // defaultValue:1,
        dictConfig: {
            reqInterface: "getSblx"
        }
    },
    jc: {        //角色级别
        rules: {checkSave: ["notNull"]},
        maxLength: 20
    },
    czbs: {        //是否有效
        display: false,
        defaultValue: "1"
    },
    authType: {     //数据规则类型
        type: "dict",
        dictConfig: {
            dictCode: "SJQXLX"
        }
    },
    isCombine: {   //是否组合
        rules: {checkSave: ["notNull"]},
        type: "dict",
        dictConfig: {
            dictCode: "SF",
            checkType: "radio"
        },
        defaultValue: "0",
        changeFunc: "combineChange"
    },
    sfyxSt: {        //是否有效
        display: false,
        defaultValue: "VALID"
    }
};

function getSblx() {
    return [{code: 1, value: '手台'}, {code: 2, value: '警车'}, {code: 3, value: '警务通'}]
}