//搜索区字段配置
var flowDefConfig = {
    "query.name": {
        tagName: "流程名称",
        canClear: true
    },
    "query.code": {
        tagName: "流程编码",
        canClear: true
    }
};

//规定表头
var columns = [
    {title: '名称', id: 'NAME', width: '50%', align: 'left', renderer: "String"},
    {title: '流程编码', id: 'CODE', width: '30%', align: 'left', renderer: "String"},
    {title: '版本号', id: 'VERSION', width: '20%', align: 'left', renderer: "String"}
];

//列表视图设置
var flowDefSettings = {
    url: "/workflow/design/getValidWorkflowList",
    autoQueryBox: {
        enable: true
    },
    autoListBox: {
        enable: true,
        columns: columns,
        allPageChose: true,
        mulchose: false, //是否多选
        checkbox: true //是否显示checkbox
    }
};
