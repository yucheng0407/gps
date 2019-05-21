//获取参数
var param = RX.page.param;
$(function () {
    //树配置
    function config() {
        var url = "/workflow/instance/getSpecialBackTree?taskId=" + param.taskId;
        return {
            data: {simpleData: {enable: true}},
            async: {enable: true, type: "post", url: url}
        };
    }

    //初始化树
    var treeObj = $.fn.zTree.init($("#tree"), config());
    //确定事件
    $("#yes").click(function () {
        var nodes = treeObj.getSelectedNodes();
        if (nodes && nodes.length) {
            param.callBack(nodes[0].id);
        } else {
            RX.alert("请选择退回到的环节");
        }
    });
});