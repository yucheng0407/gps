/**
 * 系统字典表（主表）配置文件
 */

//搜索区字段配置
var sysDictConfig = {
    "query.dictName": {
        tagName: "字典名称",
        canClear: true
    },
    "query.dictCode": {
        tagName: "字典编码",
        canClear: true
    },
    "query.dictType": {
        type: "dict",
        dictConfig: {
            dictCode: "DICTLX"
        },
        canClear: true,
        tagName: "字典类型"
    }
};

//规定表头
var columns = [
    {title: '字典名称', id: 'DICT_NAME', width: '20%', align: 'left', renderer: "String"},
    {title: '字典编码', id: 'DICT_CODE', width: '20%', align: 'left', renderer: "String"},
    {title: '字典类型', id: 'DICT_TYPE', width: '20%', align: 'left', renderer: "Dict", dictCode: "DICTLX"},
    {title: '描述', id: 'DESCRIPTION', width: '20%', align: 'left', renderer: "String"},
    {title: '修改时间', id: 'XGSJ', width: '20%', align: 'left', renderer: "Date", format: "yyyy-MM-dd HH:mm"}
];

//列表视图设置
var sysDictSettings = {
    url: "/dict/getSysDictListPage",
    autoQueryBox: {
        enable: true,
        cols: [100, 140, 100, 140, 100, 140]
    },
    autoListBox: {
        enable: true,
        columns: columns,
        allPageChose: false //是否开启全页选择
    }
};

//操作按钮的配置
var buttonArr = [
    {
        id: "addSysDict",
        name: "新增",
        icon: "&#xe62a;",
        onClick: "addSysDict",
        code:"ADD_DICT"
    },
    {
        id: "edit",
        name: "修改",
        icon: "&#xe605;",
        onClick: "editSysDict",
        code:"EDIT_DICT"
    },
    {
        id: "delSysDict",
        name: "删除",
        icon: "&#xe605;",
        onClick: "delSysDict",
        code:"DEL_DICT"
    }
];
var buttonsJson = {
    tag: ".operation_box",
    param: {},
    title: null,
    buttons: buttonArr,
    pageCode:"ZDGLYM"
};