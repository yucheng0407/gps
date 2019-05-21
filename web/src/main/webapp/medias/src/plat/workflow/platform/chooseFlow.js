var flTree;

$(function () {
    createFlowDefTree();

    $("#confirm").click(startFlow);
});

function createFlowDefTree() {
    $.get("/workflow/design/getFlowTypeAndFlowTree", {c: Math.random}, function (ar) {
        flTree = $.fn.zTree.init($("#tree"), {
            data: {
                simpleData: {
                    enable: true,
                    idKey: "handleId",
                    pIdKey: "pId",
                    rootPId: 0
                }
            },
            view: {
                selectedMulti: false
            }
        }, ar);
    }, 'json');
}

function startFlow() {
    var nodes = flTree.getSelectedNodes();
    if(!nodes.length || nodes[0].type != "workflow"){
        RX.alert("请选择一项工作");
    }else{
        confirmWorkflowStart({
            title: "发起" + (nodes[0].name || "") + "流程",
            flowCode: nodes[0].code,
            type: "xz",
            wfId: nodes[0].id
        });
    }
}

