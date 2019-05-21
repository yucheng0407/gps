var param = RX.page.param,
    func = param.func,     //回调函数
    hideClose = param.hideClose,
    frameName = param.frameName,     //调用树的窗口名
    id = param.id,       //第一次树展开的数据id
    lx = param.lx,       //第一次树展开的数据类型    机构（jg）、岗位（gw）、用户（ry）
    multiTag = false || param.multiTag, //多选标志
    cascadeSel = param.cascadeSel,//  Y:级联选择  N:非级联选择  默认：Y
    mainTree,     //树
    selectType = param.selectType, //选择类型  （备注：选用户时加上的，可以考虑代码重构，具有三个（选择用户、岗位、或三者都可以选））
    multiType = param.multiType;  //多选类型 ("ry",只能选择用户，“jg”只能机构多选，“gw”只能岗位多选)
$(function () {
    if (!hideClose) {
        $("#close").show()
    }
    mainTree = $.fn.zTree.init($("#tree"), config());
    //保存按钮事件
    $("#confirm").click(function () {
        var nodes = mainTree.getCheckedNodes();
        if (nodes.length > 0) {
            //RX.page.prevWin()
            var evalFunc = eval("_searchMapWindow('" + (frameName ? frameName : 'MainIframe') + "')." + func);
            var a = selectNodes(nodes);
            var result = evalFunc(a.sbbh, a.name);
            if (result || typeof(result) == "undefined") {
                RX.page.close();
            }
        } else {
            RX.alert("请选择设备名称");
        }
    });
});

function _searchMapWindow(frameName) {
    function _eachWin(frame) {
        if (frame.name === frameName) {
            return frame;
        }
        for (var i = 0; i < frame.frames.length; i++) {
            var win = _eachWin(frame.frames[i]);
            if (win) return win;
        }
    }

    return _eachWin(top);
}

function selectNodes(nodes) {

    var sbbh = [];
    var name = [];
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].lx == "jl") {
            sbbh.push(nodes[i].zyid);
            name.push(nodes[i].name);
        }
    }
    return {sbbh: sbbh.join(","), name: name.join(",")}
}

/**
 * 异步勾选之后展开全部节点
 * @param event
 * @param treeId  树对象
 * @param treeNode 树节点
 */
function onCheck(event, treeId, treeNode) {
    var treeObj = $.fn.zTree.getZTreeObj(treeId);
    if (treeNode.checked) {
        expandNodes(treeId, treeNode, true);//展开
    }
    else {
        if (treeNode.pId === 0) {//根节点
            for (var i = 0; i < treeNode.children.length; i++) {
                treeObj.expandNode(treeNode.children[i], false, true, true);//折叠
            }
        } else
            treeObj.expandNode(treeNode, false, true, true);//折叠
    }
}

/**
 * 全部展示和局部展示
 * @param event
 * @param treeId  树对象
 * @param node 树节点
 */
function expandNodes(treeId, node, all) {
    if (!node) return;
    var treeObj = $.fn.zTree.getZTreeObj(treeId);
    if (node.isParent && node.checked) {
        if (!node.zAsync) {
            treeObj.reAsyncChildNodes(node, "refresh", false, function () {//异步
                if (all) treeObj.checkNode(node, true, true);
                for (var i = 0, l = node.children.length; i < l; i++) {
                    expandNodes(treeId, node.children[i], all);
                }
            });
        } else {
            treeObj.expandNode(node, true, false, false);//展开一级
            for (var i = 0, l = node.children.length; i < l; i++) {
                expandNodes(treeId, node.children[i], all);
            }
        }
    }
}

//获取机构子节点的第一个机构父节点
function getJgNode(node) {
    var parentNode = node.getParentNode();
    if (parentNode.lx == 'jg') {
        return parentNode;
    } else {
        return getJgNode(parentNode);
    }
}

/**
 * 数据过滤
 * @param treeId
 * @param parentNode
 * @param responseData
 * @returns {Array}
 */
function ajaxDataFilter(treeId, parentNode, responseData) {
    var resultData = [];
    $.each(responseData, function (i, t) {
        if (t.lx == 'jg' && t.isParent == "true") {
            t.nocheck = false;
        }
    });
    return responseData;
}
var isFirst = true;

function onAsyncSuccess(event, treeid, treeNode, msg) {
    if (isFirst) {
        var treeObj = $.fn.zTree.getZTreeObj("tree");
        var nodes = treeObj.getNodes();
//            treeObj.expandNode(node,true);
//            setTimeout(function () {
//                treeObj.checkAllNodes(true);
//            },1000);
        treeObj.expandNode(nodes[0], true);
        isFirst = false
    }
}
// //异步加载树默认展开节点
// var firstAsyncSuccessFlag = 0;
//
// function zTreeOnAsyncSuccess(event, treeId, msg) {
//     if (firstAsyncSuccessFlag == 0) {
//         try {
//             //调用默认展开第一个结点
//             var nodes = mainTree.getNodes();
//             if (nodes.length == 0) {
//                 RX.alert("数据不存在", function (index) {
//                     RX.page.close();
//                 });
//             } else {
//                 mainTree.expandNode(nodes[0], true);
//                 firstAsyncSuccessFlag = 1;
//                 $("#loadingGif").remove();
//             }
//         } catch (err) {
//         }
//     }
// }
function config() {
    var url = "/sbst/getSbbhTree";
    var sblx = [];
    $("#sblx input:checked").each(function (i, e) {
        sblx.push($(this).val())
    });
    // var url = "/tree/getOrganPostUserTree?kind=op&includeNoOrgan=true"
    var asyncConfig = {
        enable: true, type: "post", url: url,
        autoParam: ["id=sjjg"],
        otherParam: ["sblx", sblx.join(",")]
    };
    if (multiTag) {
        asyncConfig.dataFilter = ajaxDataFilter;
    }
    var setting = {
            data: {
                simpleData: {
                    enable: true
                }
            },
            async: asyncConfig,
            callback: {
                onAsyncSuccess: onAsyncSuccess,
                onCheck: onCheck
            },
            view: {
                expandSpeed: "",
                selectedMulti: false
            },
            check: {
                enable: true,
                chkStyle: "radio"
            }
        }
    ;
    if (multiTag) {
        if (cascadeSel == "N") {
            setting.check = {
                enable: true,
                chkboxType: {"Y": "", "N": ""}
            };
        } else {
            setting.check = {
                enable: true
            };
        }

        setting.view.notShowClass = true;
    }
    return setting;
}

$("#sblx").on("click", "input", function (e) {
    if ($("#sblx input:checked").length == 0) {
        $(this).attr("checked", "checked")
    }
    mainTree = $.fn.zTree.init($("#tree"), config());
})
