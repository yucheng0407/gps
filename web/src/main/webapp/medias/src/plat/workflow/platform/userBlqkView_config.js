var param = RX.page.param;
var columns = [
    {title: '业务名称', id: 'WF_NAME', width: '25%', align: 'left', renderer: "String"},
    {
        title: '待办数', id: 'DBRW_NUM', width: '25%', align: 'left', renderer: function (v, rowData, rowIndex, showPro) {
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
    autoListBox: {
        enable: true,
        columns: columns
    }
};

function gotoDbList(wfId, wfName) {
    RX.page.open({
        title: "待办列表："+param.userName,
        url: "/workflow/platform/dbList",
        areaType: "big",
        param: {wfId: wfId, wfName: wfName, userId: param.userId, userName: param.userName}
    });
}

function gotoYbList(wfId, wfName) {
    RX.page.open({
        title: "已办列表："+wfName,
        url: "/workflow/platform/ybList",
        areaType: "big",
        param: {wfId: wfId, wfName: wfName, userId: param.userId, userName: param.userName}
    });
}

function gotoZbList(wfId, wfName) {
    RX.page.open({
        title: "在办列表："+wfName,
        url: "/workflow/platform/zbList",
        areaType: "big",
        param: {wfId: wfId, wfName: wfName, userId: param.userId, userName: param.userName}
    });
}