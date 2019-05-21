//按钮配置
var buttonArr = [
    {
        id: "add",
        name: "新增",
        code: "ADDTRANSACTOR",
        icon: "&#xe62a;",
        onClick: "add"              //可以是方法引用，也可以是方法字符串名称
    },
    {
        id: "edit",
        name: "修改",
        code: "EDITTRANSACTOR",
        icon: "&#xe605;",
        onClick: "edit"
    },
    {
        id: "del",
        name: "删除",
        code: "DELTRANSACTOR",
        icon: "&#xe606;",
        onClick: "del"
    }
];
var buttonsJson = {
    pageCode: "transactorList",     //当前页面code
    buttons: buttonArr
};
//搜索部分配置
var searchConfig = {
    "query.NAME": {
        tagName: "名称",
        maxLength: 100,
        canClear: true
    }
};
//规定表头
var columns = [
    {title: '名称', id: 'NAME', width: '40%', align: 'left', renderer: "String"},
    {title: '来源', id: 'TYPE', width: '30%', align: 'left', renderer: "String"},
    {
        title: '修改时间',
        id: 'XGSJ',
        width: '30%',
        align: 'left',
        renderer: "Date",
        format: "yyyy-MM-dd HH:mm"
    }
];
//列表视图设置
var tableSettings = {
    url: "/workflow/transactor/getTransactorList",
    autoQueryBox: {
        enable: true
    },
    autoListBox: {
        enable: true,
        columns: columns
    }
};

