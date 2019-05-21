// 配置
var config = {
    id: {display: false},
    code: { // 编码
        rules: {checkSave: ["notNull"]},
        maxLength: 32
    },
    title: { // 标题
        rules: {checkSave: ["notNull"]},
        maxLength: 64
    },
    moderator: { // 版主
        type: "layer",
        layerConfig: {
            url: "/user/sysUserSelect",
            title: "请选择用户",
            callbackFunc: "userSelectCallBack",
            param: {
                multyFlag: "false"
            },
            canDelete: true,
        }
    },
    moderatorId: {display: false},
    icon: { // 图标
        type: "layer",
        layerConfig: {
            url: "/resource/iconfontSelect",
            title: "选择图标",
            callbackFunc: "iconSelectCallBack",
            style: "medium",
            canDelete: true
        }
    },
    description: { // 描述
        type: "textarea",
        textareaConfig: {
            showNum: false
        },
        maxLength: 500
    },
    sfyxSt: { //是否有效
        display: false,
        defaultValue: "VALID"
    }
};

//按钮配置
var buttonArr = [
    {
        id: "save",
        name: "保存",
        onClick: "saveBoard",
        style: "c_button"
    }
];

var buttonsJson = {
    tag: ".w_button_box",
    buttons: buttonArr
};

