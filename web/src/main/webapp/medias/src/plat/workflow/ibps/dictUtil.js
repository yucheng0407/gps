function getWfInstStatus() {
    return [{code: "0", value: "完成"}, {code: "1", value: "挂起"}, {code: "2", value: "运行"}, {code: "3", value: "终止"},
        {code: "4", value: "未正常启动"}, {code: "5", value: "未提交"}, {code: "6", value: "撤回终止"}, {code: "7", value: "退回终止"}];
}