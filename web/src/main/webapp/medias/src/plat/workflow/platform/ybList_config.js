var param = RX.page.param;
//搜索部分配置
var SearchConfig = {
    "query.wfName": {
        tagName: "业务名称",
        canClear: !param.showReturn,
        maxLength: 25,
        disabled: !!param.showReturn,
        defaultValue: param.wfName
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
/**
 * 需不需要加上状态？退回的等等
 * 发起人（负责人）
 *
 *
 */
var columns = [
    {title: '标题', id: 'TITLE', width: '15%', align: 'left', renderer: "String"},
    {title: '业务名称', id: 'WF_NAME', width: '15%', align: 'left', renderer: "String"},
    {title: '环节状态', id: 'STATUS', width: '10%', align: 'left', renderer: "String"},
    {
        title: '派发时间',
        id: 'CJSJ',
        width: '20%',
        align: 'left',
        renderer: "Date",
        format: "yyyy-MM-dd HH:mm"
    },
    {
        title: '签收时间',
        id: 'CJSJ',
        width: '20%',
        align: 'left',
        renderer: "Date",
        format: "yyyy-MM-dd HH:mm"
    },
    {
        title: '完成时间',
        id: 'CJSJ',
        width: '20%',
        align: 'left',
        renderer: "Date",
        format: "yyyy-MM-dd HH:mm"
    }

];
//列表视图设置
var tableSettings = {
    url: "/workflow/platform/getYbList",
    autoQueryBox: {
        enable: true
    },
    autoListBox: {
        enable: true,
        columns: columns
    }
};