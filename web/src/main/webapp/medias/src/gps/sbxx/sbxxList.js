var sysOrganGridVm;
var mainTree;
$(function () {


    //注册双击事件
    sysOrganSettings.autoListBox.onRowDblClick = function (rowIndex, rowData, isSelected, event) {
        RX.page.open({
            title: "查看机构",
            url: "/sbxx/sbxxView",
            param: {
                id: rowData.ID
            }
        });
    };
    //初始化机构VM
    sysOrganGridVm = new Rxvm({
        widget: RX.Grid,
        el: '#right',
        settings: sysOrganSettings,
        config: sysOrganConfig,
        afterMount: function () {
            //初始化列表按钮控件
            RX.button.init($("#operate"), buttonsJson);
        }
    });
});
function sbxx(node,name) {
    sysOrganGridVm.autoQuery.set("query.sbmc", name);
    RX.msg("添加成功");
}
/**
 * 新增机构
 */
function addSysOrgan(parentOrganId, parentOrganName) {
    RX.page.open({
        title: "新增设备",
        url: "/sbxx/sbxxAdd",
        areaType: [800, 580],
        param: {
            type: "xz",
            parentOrganId: parentOrganId,
            parentOrganName: parentOrganName
        }
    });
}

/**
 * 修改机构
 */
function editSysOrgan() {
    var rowData = sysOrganGridVm.getSelected();
    if (rowData.length === 1) {
        RX.page.open({
            title: "修改设备",
            url: "/sbxx/sbxxAdd",
            areaType: [800, 580],
            param: {
                type: "xg",
                id: rowData[0].ID
            }
        });
    } else {
        RX.msg(RX.SELECT_EDIT);
    }
}

/**
 * 删除机构核心
 */
function delSysOrgan(delOrganId, newOrganId) {
    var rowData = sysOrganGridVm.getSelected();
    if (rowData.length === 1) {
        $.ajax({
            type: "post",
            url: "/sbxx/sbxxDel",
            data: {id:rowData[0].ID},
            success: function (ar) {
                if (ar.success) {
                    RX.msg(RX.SUCCESS_DELETE);
                    RX.page.prev().reload();
                    RX.page.close();
                } else {
                    RX.alert(ar.msg);
                }
            }
        });
    } else {
        RX.msg(RX.SELECT_DELETE);
    }
}
//验证是否拥有权限
var checkHasChildAuth = function () {
    function checkAuth(node) {
        var result = false;
        if (node.hasAuth) {
            result = true;
        } else {
            var parentNode = node.getParentNode();
            if (parentNode) {
                result = checkHasChildAuth(parentNode);
            }
        }
        return result;
    }

    var authPool = {};

    return function (node) {
        if (typeof authPool[node.id] !== "undefined") {
            return authPool[node.id];
        } else {
            var result = checkAuth(node);
            if (node.lx === "jg") {
                authPool[node.id] = result;
            }
            return result;
        }
    }
}();

//权限影响字体样式
function getFont(treeId, node) {
    if (checkHasChildAuth(node)) {
        return {"font-weight": "bold"};
    } else {
        return {color: "#ccc"};
    }
}

//刷新全局接口
RX.page.reload = function (param) {
    sysOrganGridVm.reloadGrid(param);
};