var param = RX.page.param;
//搜索部分配置
var SearchConfig = {
    "query.wfName": {
        tagName: "业务名称",
        canClear: !param.showReturn,
        disabled: !!param.showReturn,
        defaultValue: param.wfName,
        maxLength: 25
    },
    "query.startTime": {
        tagName: "发起时间",
        type: "date",
        dateConfig: {
            dateFmt: "yyyy-MM-dd HH:mm:ss",
            maxDate: "query.endTime"
        },
        canClear: true
    },
    "query.endTime": {
        tagName: "至",
        type: "date",
        dateConfig: {
            dateFmt: "yyyy-MM-dd HH:mm:ss",
            minDate: "query.startTime"
        },
        canClear: true
    },
    //是否已经完成
    "query.isFinish": {
        display: false,
        defaultValue: 1
    }
};
if (param.wfId) {
    SearchConfig["query.wfId"] = {
        display: false,
        canClear: !param.showReturn,
        defaultValue: param.wfId
    }
}

if(param.userId){
    SearchConfig["query.userId"] = {
        defaultValue:param.userId,
        display:false
    }
}

//规定表头
var columns = [
    {title: '标题', id: 'TITLE', width: '25%', align: 'left', renderer: "String"},
    {title: '业务名称', id: 'WF_NAME', width: '25%', align: 'left', renderer: "String"},
    {title: '环节的状态', id: 'STATUS', width: '25%', align: 'left', renderer: "String"},
    {
        title: '发起时间',
        id: 'QDSJ',
        width: '25%',
        align: 'left',
        renderer: "Date",
        format: "yyyy-MM-dd HH:mm"
    }
];
//列表视图设置
var tableSettings = {
    url: "/workflow/platform/getZbList",
    autoQueryBox: {
        enable: true,
        cols: [80, 150, 80, 200, 80, 200]
    },
    autoListBox: {
        enable: true,
        columns: columns
    }
};