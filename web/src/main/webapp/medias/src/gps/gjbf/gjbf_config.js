var zbxxConfig = {
    id: { // 主键
    },
    kssj: { // 值班日期
        rules: {checkSave: ["notNull"]}
        // type: "date",
        // dateConfig: {
        //     canDelete:true,
        //     dateFmt: "yyyy-MM-dd HH:mm:ss",
        //     maxDate: "sysdate"
        // }
    },
    jssj: { // 值班日期
        rules: {checkSave: ["notNull"]}
        // type: "date",
        // dateConfig: {
        //     canDelete:true,
        //     dateFmt: "yyyy-MM-dd HH:mm:ss",
        //     minDate:"kssj",
        //     maxDate:"kssj",
        //     maxDateExtend:{date:1}
        // }
    },
    sbmc: { // 值班领导姓名
        rules: {checkSave: ["notNull"]},
        canThink: true,
        thinkFunc: "think",
        changeFunc: "thinkChange",
        type: "layer",
        layerConfig: {
            canDelete:true,
            url: "/main/sbbhTree",
            title: "选择设备名称",
            callbackFunc: "sbbhTreeFun",
            style: "tree",
            canInput: true
        }
    }
};