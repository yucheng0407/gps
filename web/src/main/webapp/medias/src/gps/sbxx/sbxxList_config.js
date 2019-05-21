/**
 * 机构配置文件
 */

//搜索区字段配置
var sysOrganConfig = {
    "query.sbmc": {
        tagName: "设备名称",
        canClear: true
    },
    "query.ssjg": {
        tagName: "所属机构",
        canClear: true
    },
    "query.zyid": {
        tagName: "设备编号",
        canClear: true
    }
};

//规定表头
var columns = [
    // {
    //     title: '机构名称',
    //     id: 'ORGAN_NAME',
    //     width: '20%',
    //     align: 'left',
    //     renderer: function (v, rowData, rowIndex, showPro) {
    //         var rhtml = v;
    //         if (rowData.UTYPE ==="1") {
    //             showPro.stitle = v;
    //             showPro.ifSetTitle = true;
    //             showPro.replaceSymbols = false;
    //             rhtml = "<img src='" + RX.handlePath("/medias/style/plat/image/resource/home_resource.png") + "'" +
    //                 " style='margin:-4px 5px 0px 0px;' align='absmiddle'/>" + rhtml;
    //         }
    //         return rhtml;
    //     }
    // },
    {title: '设备名称', id: 'SBMC', width: '100', align: 'left', renderer: "String"},
    {title: '设备编号', id: 'ZYID', width: '100', align: 'left', renderer: "String"},
    {title: '单位名称', id: 'SSPCSMC', width: '30%', align: 'left', renderer: "String"},
    {title: '最后在线时间', id: 'GXSJ', width: '200', align: 'left', renderer: "Date", format: "yyyy-MM-dd HH:mm:ss"},
    {title: '在线状态', id: 'ZT', width: '60', align: 'left', renderer: function (v, rowData, rowIndex, showPro) {
        showPro.stitle = v;
        showPro.ifSetTitle = true;
        showPro.replaceSymbols = false;
       var  rhtml ="<span"+(v=='在线'?" style='color:#29bb06'":"")+">"+v+"</span>";
    return rhtml;
}}
];


//列表视图设置
var sysOrganSettings = {
    url: "/sbxx/getSbxxList",
    autoQueryBox: {
        enable: true,
        cols: [100, 140, 100, 140, 100, 140]

    },
    autoListBox: {
        enable: true,
        columns: columns,
        allPageChose: true, //是否开启全页选择
        mulchose: true, //是否多选
        checkbox: true //是否显示checkbox
    }
};

//操作按钮的配置
var buttonArr = [
    {
        id: "addSysOrgan",
        name: "新增",
        icon: "&#xe62a;",
        onClick: "addSysOrgan"
    },
    {
        id: "edit",
        name: "修改",
        icon: "&#xe605;",
        onClick: "editSysOrgan"
    },
    {
        id: "del",
        name: "删除",
        icon: "&#xe606;",
        onClick: "delSysOrgan"
    }
];
var buttonsJson = {
    tag: ".operation_box",
    tpl: null,
    param: {},
    title: null,
    buttons: buttonArr,
    pageCode:"JGGLYM"
};