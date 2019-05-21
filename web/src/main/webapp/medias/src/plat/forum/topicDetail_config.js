// 跟帖配置
var followConfig = {
    id: {display: false},
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
    topicId: {display: false},
    boardId: {display: false},
    sfyxSt: { //是否有效
        display: false,
        defaultValue: "VALID"
    }
};