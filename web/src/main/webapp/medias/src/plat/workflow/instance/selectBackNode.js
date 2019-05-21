var nodeTree;
$(function () {
    $.ajax({
        url: "/workflow/instance/getBackNodes",
        data: {nodeId: RX.page.param.nodeId, wfInsId: RX.page.param.wiId},
        success: function (ar) {
            if (ar.success) {
                // var list = ar.data,
                //     $nodes = $("#nodes");
                // for (var i = 0; i < list.length; i++) {
                //     $nodes.append('<label class="label_check" for="check' + i + '"><input id="check' + i + '" value="' + list[i].NODE_ID + '|' + list[i].WF_INS_ID + '" type="checkbox">' + list[i].NODE_NAME + '</label><br/>');
                // }
                nodeTree = $.fn.zTree.init($("#tree"), {
                    data: {
                        simpleData: {
                            enable: true,
                            idKey: "id",
                            pIdKey: "pId"
                        }
                    },
                    check: {
                        enable: true,
                        chkStyle: "checkbox",
                        nocheckInherit: false
                    }
                }, ar.data);
            } else {
                RX.alert(ar.msg);
            }
        }
    });

    $("#save").click(function () {
        selectItem();
    })
});

function selectItem() {
    var idArr = [];
    var selNodes = nodeTree.getCheckedNodes(true);
    if (selNodes && selNodes.length) {
        $.each(selNodes, function (i, e) {
            idArr.push(e.objectId);
        });
        result = RX.page.prev().util.selectBackNodeCallback(idArr.join(';'));
        RX.page.close();
    } else {
        RX.alert("请选择至少一个环节");
    }
}