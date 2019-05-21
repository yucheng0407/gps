var param = RX.page.param;
var topicVm, gridVm, followVm;
$(function () {
    // 去除自动resize
    RX.page.resize = function(){};

    topicVm = new Rxvm({
        el: "#topic",
        settings: {
            getData: {
                url: "/forum/getTopicDetail?topicId=" + param.topicId + "&boardId=" + param.boardId
            }
        },
        methods: {
            rtnBoardMain: function () { // 返回版块主页
                RX.page.goto(RX.handlePath("/forum/boardMain"), {boardId: param.boardId});
            },
            replyTopic: function () { // 回复主题帖
                window.replyTopic();
            },
            collectTopic: function () { // 收藏帖子
                $.ajax({
                    url: "/forum/collectTopic?topicId=" + param.topicId,
                    success: function (ar) {
                        if (ar.success) {
                            topicVm.set("isCollect", !topicVm.get("isCollect"));
                            RX.msg(RX.ICON_SUCCESS, topicVm.get("isCollect") ? "收藏成功" : "取消收藏成功");
                        } else {
                            RX.alert(ar.msg);
                        }
                    }
                });
            },
            topTopic: function () { //置顶帖子
                $.ajax({
                    url: "/forum/topTopic?topicId=" + param.topicId,
                    success: function (ar) {
                        if (ar.success) {
                            topicVm.set("topic.top", !topicVm.get("topic.top"));
                            RX.msg(RX.ICON_SUCCESS, topicVm.get("topic.top") ? "置顶成功" : "取消置顶成功");
                        } else {
                            RX.alert(ar.msg);
                        }
                    }
                });
            },
            bestTopic: function () { //精品
                $.ajax({
                    url: "/forum/bestTopic?topicId=" + param.topicId,
                    success: function (ar) {
                        if (ar.success) {
                            topicVm.set("topic.best", !topicVm.get("topic.best"));
                            RX.msg(RX.ICON_SUCCESS, topicVm.get("topic.best") ? "设置精品成功" : "取消精品成功");
                        } else {
                            RX.alert(ar.msg);
                        }
                    }
                });
            }
        }
    });

    gridVm = new Rxvm({
        widget: RX.Grid,
        el: '#followList',
        data: {
            query: {topicId: param.topicId}
        },
        settings: {
            url: "/forum/getTopicAndFollowList",
            afterLoad: function () {
                $('#followList').css("height", "auto");
                $(".list_box").innerHeight($(".content_list").outerHeight() + $(".rx-paging").outerHeight() + 35);
                $(window).resize(function () {
                    $(".list_box").innerHeight($(".content_list").outerHeight() + $(".rx-paging").outerHeight() + 35);
                });
            }
        },
        methods: {
            replyTopic: function () {
                window.replyTopic();
            }
        }
    });

    followVm = new Rxvm({
        el: "#followEdit",
        config: followConfig,
        data: {topicId: param.topicId, boardId: param.boardId}
    });

});

/**
 * 保存跟帖
 */
function saveFollow() {
    if (followVm.ruleValidate()) {
        $.ajax({
            type: "post",
            url: "/forum/saveFollow",
            data: {
                forumFollow: followVm.getJson()
            },
            dataType: "json",
            success: function (ar) {
                if (ar.success) {
                    RX.msg(RX.SUCCESS_OPERATE, "回复成功");
                    gridVm.reloadGrid();
                    followVm.getElement("content").val("");
                } else {
                    RX.alert(ar.msg);
                }
            }
        });
    }
}

// 回复主题帖
function replyTopic() {
    // 回帖富文本框获取光标
    var editor = followVm.$richPool["content"];
    editor.focus();
    editor.setTextCursor();
    // 跳转到页面底部
    window.scrollTo(0, document.body.scrollHeight);
}