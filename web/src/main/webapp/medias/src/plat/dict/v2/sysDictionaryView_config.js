/*********************************************** 字典表单配置 ***********************************************/
//视图字段配置
var config = {

};

//按钮配置
var buttonArr = [
];
var buttonsJson = {
    tag: ".w_button_box",
    buttons: buttonArr,
    pageCode:"ZDGLYM",
    editButton:{
        code: "EDIT_DICT"
    }
};

/*********************************************** 字典项配置 ***********************************************/
// 列配置
var dictItemColumns = [[
    {
        field: 'code',
        title: '字典项编码',
        width: 120,
        align: 'left',
        editor: {type: 'textbox'}
    },
    {
        field: 'value',
        title: '字典项值',
        width: 120,
        align: 'center',
        editor: {type: 'textbox'}
    },
    {
        field: 'sort',
        title: '排序号',
        width: 80,
        align: 'center',
        editor: {type: 'numberbox'}
    },
    {
        field: 'remark',
        title: '备注',
        width: 220,
        align: 'center',
        editor: {type: 'textbox'}
    }
]];

// 搜索区配置
var dictItemConfig = {
    "query.code": {
        tagName: "字典项编码",
        canClear: true
    },
    "query.value": {
        tagName: "字典项值",
        canClear: true
    }
};

// 树列表配置
var dictItemSettings = {
    domId: 'tg',
    pIdField: 'pId',
    idField: 'id',
    treeField: 'code',
    gradeField: 'grade',
    sortField: 'sort',
    columns: dictItemColumns,
    autoQueryBox: {
        enable: true
    },
    onBeforeSelect: function (row) { // 禁用选中
        return false;
    }
};