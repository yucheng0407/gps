//搜索区字段配置
var config = {
    "query.code": {
        tagName: "编码",
        canClear:true
    },
    "query.title": {
        tagName: "标题",
        canClear:true
    }
}

//列配置
var columns = [
    {title: '编码', id: 'CODE', width: '15%', renderer: 'String'},
    {title: '标题', id: 'TITLE', width: '25%', renderer: 'String'},
    {title: '版主', id: 'MODERATOR', width: '20%', renderer: 'String'},
    {title: '创建人', id: 'CJR', width: '20%', renderer: 'String'},
    {title: '创建时间', id: 'CJSJ', width: '20%', renderer: "Date", format: "yyyy-MM-dd",canOrder:true}
];

//列表视图设置
var settings = {
    url: "/forum/getBoardList",
    autoQueryBox:{
        enable:true,
        cols: [60, 160, 60, 160]
    },
    autoListBox:{
        enable: true,
        columns: columns
    }
};

//操作按钮的配置
var buttonArr = [
    {
        id: "add",
        name: "新增",
        icon: "&#xe62a;",
        onClick: "addBoard"
    },
    {
        id: "edit",
        name: "修改",
        icon: "&#xe605;",
        onClick: "editBoard"
    },
    {
        id: "del",
        name: "删除",
        icon: "&#xe605;",
        onClick: "delBoard"
    }
];

var buttonsJson = {
    tag: ".operation_box",
    buttons: buttonArr
};