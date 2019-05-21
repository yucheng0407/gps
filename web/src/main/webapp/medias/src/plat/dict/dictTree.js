/**
 *字典选择树
 * @type {*}
 */
var param = RX.page.param;

var mainTree;    //机构树
$(function () {
    //树默认配置
    var setting = {
        data: {
            key: {
                name: "value"
            },
            simpleData: {
                enable: true,
                idKey: "code", //节点数据中保存其父节点唯一标识的属性名称
                pIdKey: "pcode",//节点数据中保存唯一标识的属性名称
                rootPId: ""   //用于修正根节点父节点数据
            }
        },
        view: {
            // dblClickExpand: false
        },
        check: {},
        callback: {
            onClick: function (e, treeId, treeNode) {
                mainTree.checkNode(treeNode, !treeNode.checked, true);
                return false;
            }
        }
    };
    //实现多选
    if (param.multiSelect) {
        setting.check = {
            enable: true,
            chkStyle: "checkbox",
            chkboxType: {"Y":"","N":""},
            radioType: "all"
        };
    } else {
        setting.check = {
            enable: true,
            chkStyle: "radio",
            radioType: "all"
        };
    }
    //渲染字典图标与禁选字典项
    if (param.zdx && param.zdx.length) {
        param.zdx[0].open = true;
        var iconpath = RX.handlePath("/medias/plugin/ztree/css/img/flowType.png");
        var selectDictCode = param.selectDictCode ? "+" + param.selectDictCode + "+" : "";
        var dfValue = RX.page.param.defaultValue && "," + RX.page.param.defaultValue + ",";
        $.each(param.zdx, function (i, t) {
            t.icon = iconpath;
            if (selectDictCode && selectDictCode.indexOf("+" + t.dictCode + "+") === -1) {
                t.nocheck = true;
            }
            if (dfValue && dfValue.indexOf("," + t.code + ",") > -1) {
                t.checked = true;
            }
        })
    }

    //初始化字典树
    mainTree = $.fn.zTree.init($("#tree"), setting, param.zdx || []);

    //确认操作
    $("#confirm").bind("click", function () {
        if (typeof param.callback === "function") {
            var nodes = [], id = [], name = [];
            nodes = mainTree.getCheckedNodes(true);
            if (!nodes || !nodes.length) {
                RX.msg("请选择项");
                return false;
            }
            if (param.multiSelect && typeof param.minNum === "number" && nodes.length < param.minNum) {
                RX.msg("请选择至少" + param.minNum + "项");
                return false;
            }
            if (param.multiSelect) {
                $.each(nodes, function (i, t) {
                    id.push(t.code);
                    name.push(t.value);
                })
            } else {
                id.push(nodes[0].code);
                name.push(nodes[0].value);
            }
            param.callback(id.join(), name.join());
            RX.page.close();
        }
    });
});