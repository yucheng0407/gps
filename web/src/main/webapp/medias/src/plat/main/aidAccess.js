$(function () {
    var param = RX.page.param;
    //登录验证，或者其它
    //设置标志位，标志由aid页面进入
    RX.cache(_top, "WORKFLOW._outerSystem", "1");
    var type = param.type;
    //工作流页面
    if (type === "worfklow") {
        //设置流程为iframe平铺模式
        RX.cache(_top, "WORKFLOW.workFlowType", "iframe");
        if (param.wiId && param.wfId) {
            //todo 第三个参数，个性构建，目前设置了一个流程接口
            handleWorkflowByWiId(param.wiId, param.wfId);
        }
    } else {
        //设置url
        // $("#MainIframeR").attr("src", "/xmgl/jcxx/bdxxEdit");
        //设置参数
        // RX.page.setChildParam({name: "aidAccess"}, param);
    }
});


