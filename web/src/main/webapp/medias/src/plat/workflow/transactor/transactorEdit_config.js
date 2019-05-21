var config = {
    name: {
        rules: {checkSave: ["notNull"]},
        maxLength: 25
    },
    sfyxSt: {
        display: false,
        defaultValue: "VALID"
    }
};
var blrOriginConfig = {
    "list.*.id": {},
    "list.*.transactorId": {},
    //来源类型 1指定用户 2指定机构 3角色 4限定条件 5自定义规则
    "list.*.type": {},
    "list.*.hasExtra": {},
    //是否有效
    "list.*.sfyxSt": {
        display: false,
        defaultValue: "VALID"
    }
};