var config = {
    "list.*.id":{

    },
    "list.*.name":{
        rules: {checkSave: ["notNull"]}
    },
    "list.*.startDate":{
        rules: {checkSave: ["notNull"]},
        type: "date",
        dateConfig: {
            dateFmt: "yyyy-MM-dd",
            maxDate:"endDate"
        }
    },
    "list.*.endDate":{
        rules: {checkSave: ["notNull"]},
        type: "date",
        dateConfig: {
            dateFmt: "yyyy-MM-dd",
            minDate:"startDate"
        }
    },
    "list.*.type":{
        rules: {checkSave: ["notNull"]},
        type: "dict",
        dictConfig: {
            dictCode: "HOBBYSDEMO"
        }
    },
    "list.*.money":{
        rules: {checkSave: ["notNull"]}
    },
    "list.*.unuse":{
        defaultValue: ""
    },
    "list.*.sfyxSt":{
        defaultValue: "VALID"
    }

}