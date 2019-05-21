var conditionConfig = {
    "id": {        //主键ID
        display: false
    },
    "userCondition": {
        rules: {checkSave: ["notNull"]},
        type: "dict",
        dictConfig: {
            showPlsSelect: false,
            checkType: "radio",
            dictCode: "USERCONDITION"
        },
        defaultValue:1
    },
    "organCondition": {
        type: "dict",
        dictConfig: {
            showPlsSelect: false,
            dictCode: "ORGANCONDITION"
        }
    },
    "selfIncluded": {
        type: "dict",
        dictConfig: {
            dictCode: [{value: "否", code: "0"}, {value: "是", code: "1"}],
            showPlsSelect: false
        }
    },
    "name": {
        rules: {checkSave: ["notNull"]},
        disabled: true,
        spanShow: false,
        maxLength: 20
    },
    "sfyxSt": {        //是否有效
        disabled: false,
        defaultValue: "VALID"
    }
};