/*
* 父系统跨域处理页面，由postParentMsg.html处理的参数，调用对应的接口
* */
function workflowHandler(obj) {
    if (obj.action === "close") {
        //关闭页面
    }
    obj.alertMsg && RX.msg(param.alertMsg);
}