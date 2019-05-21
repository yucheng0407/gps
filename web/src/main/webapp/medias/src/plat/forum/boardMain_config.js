// 主题帖编辑配置
var topicConfig = {
    id: {display: false},
    title: { // 标题
        rules: {checkSave: ["notNull"]},
        maxLength: 160
    },
    content: {//内容
        type: "textarea",
        textareaConfig: {
            rich: true,
            richConfig: {
                width: '100%',
                height: '200px'
            }
        },
        rules: {checkSave: ["notNull"]},
        spanShow: true
    },
    boardId: {display: false},
    sfyxSt: { //是否有效
        display: false,
        defaultValue: "VALID"
    }
};