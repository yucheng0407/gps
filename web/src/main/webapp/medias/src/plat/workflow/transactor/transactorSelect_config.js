//搜索区字段配置
var transactorConfig = {
    "query.NAME": {
        tagName: "名称",
        canClear: true
    }
};

//规定表头
var columns = [
    {title: '名称', id: 'NAME', width: '40%', align: 'left', renderer: "String"},
    {title: '来源', id: 'TYPE', width: '30%', align: 'left', renderer: "String"},
    {title: '修改时间', id: 'XGSJ', width:'30%', align: 'left', renderer: "Date",format:"yyyy-MM-dd HH:mm:ss"}
];

//列表视图设置
var transactorSettings = {
    url: "/workflow/transactor/getTransactorList",
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
