//搜索区字段配置
var organConfig = {
    // "query.parentId": {
    //     tagName: "上级机构",
    //     canClear: true
    // },
    "query.organName": {
        tagName: "机构名称",
        canClear: true
    }
};

//规定表头
var columns = [
    {title: '机构名称', id: 'ORGAN_NAME', width: '50%', align: 'left', renderer: "String"},
    // {title: '机构全称', id: 'FULL_NAME', width: '25%', align: 'left', renderer: "String"},
    {title: '上级机构', id: 'PARENT_ORG', width: '50%', align: 'left', renderer: "String"}
];

//列表视图设置
var organSettings = {
    url: "/organ/getSysOrganListPage",
    autoQueryBox: {
        enable: true
    },
    autoListBox: {
        enable: true,
        columns: columns,
        allPageChose: true,
        mulchose: true, //是否多选
        checkbox: true //是否显示checkbox
    }
};
