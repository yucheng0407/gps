var param = RX.page.param;
//搜索部分配置
var SearchConfig = {};
if (param.wfId) {
    SearchConfig["query.wfId"] = {
        display: false,
        canClear: !param.showReturn,
        defaultValue: param.wfId
    }
    SearchConfig["query.wfName"] = {
        tagName: "业务名称",
        maxLength: 25,
        canClear: !param.showReturn,
        disabled: !!param.showReturn,
        defaultValue: param.wfName
    }
} else {
    SearchConfig["query.wfName"] = {
        tagName: "业务名称",
        canClear: true,
        maxLength: 25
    }
}
//规定表头
/**
 * 需不需要加上状态？退回的等等
 *
 *
 */
var columns = [
    {title: '标题', id: 'TITLE', width: '35%', align: 'left', renderer: "String"},
    {title: '业务名称', id: 'WF_NAME', width: '35%', align: 'left', renderer: "String"},
    {
        title: '创建时间',
        id: 'CJSJ',
        width: '30%',
        align: 'left',
        renderer: "Date",
        format: "yyyy-MM-dd HH:mm"

    }
];
//列表视图设置
var tableSettings = {
    url: "/workflow/platform/getNbList",
    autoQueryBox: {
        enable: true
    },
    autoListBox: {
        enable: true,
        columns: columns
    }
};