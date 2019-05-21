var columns = [
    {
        title: '部门用户',
        id: 'USER_NAME',
        width: '25%',
        align: 'left',
        renderer: function (v, rowData, rowIndex, showPro) {
            showPro.ifSetTitle = true;
            showPro.replaceSymbols = false;
            v = replaceSymbols(v);
            return "<a href='javascript:void(0)' onclick='gotoUserView(" + rowData.USER_ID + ",\"" + rowData.USER_NAME + "\")'>" + v + "</a>";
        }
    },
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
    url: "/workflow/platform/getOrganTjList",
    autoListBox: {
        enable: true,
        columns: columns
    }
};

function gotoUserView(userId, userName) {
    RX.page.refresh({userId:userId, userName: userName},null,"/workflow/platform/userBlqkView");
}

function gotoDbList(userId, userName) {
    RX.page.open({
        title: "待办列表：" + wfName,
        url: "/workflow/platform/dbList",
        areaType: "big",
        param: {userId: userId, userName: userName}
    });
}

function gotoYbList(userId, userName) {
    RX.page.open({
        title: "已办列表：" + wfName,
        url: "/workflow/platform/ybList",
        areaType: "big",
        param: {userId: userId, userName: userName}
    });
}

function gotoZbList(userId, userName) {
    RX.page.open({
        title: "在办列表：" + wfName,
        url: "/workflow/platform/zbList",
        areaType: "big",
        param: {userId: userId, userName: userName}
    });
}