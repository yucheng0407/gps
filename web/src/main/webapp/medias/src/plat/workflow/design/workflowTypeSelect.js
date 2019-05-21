var znode;
var func = RX.page.param.func;
var selectType = RX.page.param.selectType;

var url = "/workflow/design/"+(selectType == "workflow" ? "createWorkflowTypeAndWorkflowTree":"createWorkflowTypeTree")+"?ran=" + Math.random();

//树节点点击事件
function zTreeOnClick(event, treeId, treeNode) {
    znode = treeNode;
}

//初始化tree参数
var setting = {
    data:{
        simpleData:{
            enable:true,
            idKey:"id",
            pIdKey:"pId",
            rootPId:0
        }
    },
    async:{
        type:"get",
        enable:true,
        autoParam:["id"],
        url:url
    },
    view:{
        selectedMulti:false
    },
    callback:{
        onClick:zTreeOnClick,
        onAsyncSuccess: function() {
            var treeObj = $.fn.zTree.getZTreeObj("tree");
            var nodes = treeObj.getNodes();
            //设置节点展开
            for (var i = 0; i < nodes.length; i++) {
                treeObj.expandNode(nodes[i], true, false, true);
            }
        }
    }
};

//初始化tree参数
function initTreeParm(treename) {
    var setting = {
        data:{
            simpleData:{
                enable:true,
                idKey:"id",
                pIdKey:"pId",
                rootPId:0
            }
        },
        async:{
            type:"get",
            enable:true,
            autoParam:["id", "name", "pId", "children"],
            url:url
        },
        callback:{
            onClick:function (event, treeId, treeNode, clickFlag) {
                $("[name=parentCategory]").val(treeNode.name);
                $("#parentId").val(treeNode.id);
                tempTreeNode = mainTree.getNodeByParam("id", treeNode.id, null);
            }
        }
    };
    treename += "流程类别树";
    var treePam = {setting:setting};
    return treePam;
}

$(function(){
    //初始化mainTree
    mainTree = $.fn.zTree.init($("#tree"), setting);
    //挂载保存方法
    $("#yes").click(function () {
        if(znode.id && znode.name){
            if(selectType == "workflow" && znode.type == "workflowtype"){
                RX.alert("请选择流程");
                return;
            }
            var evalFunc = RX.page.prevWin().RX.getGlobalFunc(func);
            result = evalFunc(selectType == "workflow"?znode.id.split("_").pop():znode.id, znode.name);
            if(result || typeof(result) == "undefined"){
                RX.page.close();
            }
        }else{
            if(znode.type == "workflowtype"){
                RX.alert("未选择流程");
            }else{
                RX.alert("未选择流程类别");
            }
        }
    });
})