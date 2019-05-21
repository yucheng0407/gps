//搜索部分配置
var SearchConfig = {
    "query.wfName": {
        tagName: "业务名称",
        canClear: true,
        maxLength: 25
    }
};
var columns = [
    {title: '业务名称', id: 'WF_NAME', width: '25%', align: 'left', renderer: "String"},
    {
        title: '未办数', id: 'DBRW_NUM', width: '25%', align: 'left', renderer: function (v, rowData, rowIndex, showPro) {
        showPro.ifSetTitle = true;
        showPro.replaceSymbols = false;
        v = replaceSymbols(v);
        return "<a href='javascript:void(0)' onclick='gotoDbList(" + rowData.WF_ID + ",\"" + rowData.WF_NAME + "\")'>" + v + "</a>";
    }
    },
    {
        title: '在办数', id: 'ZBLC_NUM', width: '25%', align: 'left', renderer: function (v, rowData, rowIndex, showPro) {
        showPro.ifSetTitle = true;
        showPro.replaceSymbols = false;
        v = replaceSymbols(v);
        return "<a href='javascript:void(0)' onclick='gotoZbList(" + rowData.WF_ID + ",\"" + rowData.WF_NAME + "\")'>" + v + "</a>";
    }
    },
    {
        title: '已办数', id: 'YBRW_NUM', width: '25%', align: 'left', renderer: function (v, rowData, rowIndex, showPro) {
        showPro.ifSetTitle = true;
        showPro.replaceSymbols = false;
        v = replaceSymbols(v);
        return "<a href='javascript:void(0)' onclick='gotoYbList(" + rowData.WF_ID + ",\"" + rowData.WF_NAME + "\")'>" + v + "</a>";
    }

    }
];
//列表视图设置
var tableSettings = {
    url: "/workflow/platform/getUserTjList",
    autoQueryBox: {
        enable: true
    },
    autoListBox: {
        enable: true,
        columns: columns
    }
};

function gotoDbList(wfId, wfName) {
    RX.page.goto("/workflow/platform/dbList", {wfId: wfId, wfName: wfName, showReturn: true})
}

function gotoYbList(wfId, wfName) {
    RX.page.goto("/workflow/platform/ybList", {wfId: wfId, wfName: wfName, showReturn: true})
}

function gotoZbList(wfId, wfName) {
    RX.page.goto("/workflow/platform/zbList", {wfId: wfId, wfName: wfName, showReturn: true})
}