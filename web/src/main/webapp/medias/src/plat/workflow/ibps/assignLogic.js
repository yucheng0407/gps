//获取设计表单ids
//根据ids获取，构建成树，肯定是存在的
//输入
var param = RX.page.param;
$(function () {
    var formulaEditor = new FormulaEditor({
        treeData: getTreeData,
        treeEl: $("#boTree"),
        keywords: [
            "SUM"
        ],
        preFix: "$",
        sufFix: "#",
        //可以由preFix+data+sufFix拼接，中间特殊字符可以是一些指定的数据，不满足可以复写，注意可能是特殊字符$等
        dataRex: "\\$[0-9a-zA-Z\\._]+#",
        getValueName: function (node, parentNode) {
            return node.parentName + "." + node.name;
        },
        getValueCode: function (node, parentNode) {
            return node.parentId + "." + node.key;
        }
    });
    if (param.editorValue) {
        formulaEditor.setEditorValue(param.editorValue);
    }
    $("#save").click(function () {
        /**
         * 保存时的校验规则，如果是一对多的动态表单字段，是不是符合表达式规则
         * 主要验证表达式是否可以转化成值，字段+表达式+字段的形式，不允许不合法的表达式，分母为0整体为0等等。
         */
        var valueObj = formulaEditor.getEditorValue();
        var showNames = valueObj.show;
        var formula = valueObj.formula;
        var func = RX.page.prevWin()[param.func];
        if (typeof func === "function") {
            func(param.viewModel, param.keypath, showNames, formula);
        }
        RX.page.close();
    });
});

/**
 * 获取树节点数据
 * @returns {*}
 */
function getTreeData() {
    var ids = param.formIds;
    var treeData;
    if (ids) {
        $.ajax({
            type: "get",
            url: "/form/getFormFieldTree?ids=" + ids,
            //先改成同步
            async: false,
            success: function (ar) {
                if (ar.success) {
                    treeData = ar.data;
                } else {
                    RX.msg(ar.msg);
                }
            }
        });
    }
    return treeData;
}
