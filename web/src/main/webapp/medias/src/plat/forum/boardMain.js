var zyVm, jpVm, scVm, topicVm;
var boardId = RX.page.param.boardId;
var selTabId = 'zy'; //选中的tabId
$(function () {
    // 去除自动resize
    RX.page.resize = function(){};
    // 主页
    zyVm = new Rxvm({
        widget: RX.Grid,
        el: '#tab_zy',
        template: '#topicGrid',
        data: {
            query: {boardId: boardId}
        },
        settings: {
            url: "/forum/getTopicList",
            afterLoad: function () {
                resizeListBox();
                $(".lib_Contentbox").css("height", "auto");
            },
            afterNoData: function () {
                resizeListBox();
                $(".lib_Contentbox").css("height", "auto");
            }
        },
        methods: {
            showTopicDetail: function (keypath) {
                showTopicDetail(this, keypath);
            }
        }
    });

    // 精品
    jpVm = new Rxvm({
        widget: RX.Grid,
        el: '#tab_jp',
        template: '#topicGrid',
        data: {
            query: {boardId: boardId, isBest: "1"}
        },
        settings: {
            url: "/forum/getTopicList",
            afterLoad: resizeListBox,
            afterNoData: resizeListBox
        },
        methods: {
            showTopicDetail: function (keypath) {
                showTopicDetail(this, keypath);
            }
        }
    });

    // 收藏
    scVm = new Rxvm({
        widget: RX.Grid,
        el: '#tab_sc',
        template: '#topicGrid',
        data: {
            query: {boardId: boardId}
        },
        settings: {
            url: "/forum/getCollectTopicList",
            afterLoad: resizeListBox,
            afterNoData: resizeListBox
        },
        methods: {
            showTopicDetail: function (keypath) {
                showTopicDetail(this, keypath);
            }
        }
    });

    // 创建主题帖VM
    topicVm = new Rxvm({
        el: '#topicEdit',
        config: topicConfig
    });

    // 返回按钮点击事件
    $("#btn_return").click(function () {
        RX.page.goto(RX.handlePath("/forum/forumMain"));

    });

    // 发帖按钮点击事件
    $("#btn_post").click(function () {
        topicVm.getElement("title").focus();
        // 跳转到页面底部
        window.scrollTo(0, document.body.scrollHeight);
    });

    // 回车
    $('.searchinput').keyup(function (event) {
        if (event.keyCode == 13) searchTopic();
    })

    // tab切换控制
    $('.forum_tab_ul a').on('click', function () {
        $('#' + selTabId).removeClass('dj');
        $('#tab_' + selTabId).hide();
        selTabId = $(this).attr("id");
        $('#' + selTabId).addClass('dj');
        $('#tab_' + selTabId).show();
        resizeListBox();
    });
});

/**
 * 调整list_box高度
 */
function resizeListBox() {
    $("#tab_" + selTabId + " .list_box").innerHeight($("#tab_" + selTabId + " .forum_title").outerHeight() + $(".rx-paging").outerHeight() + 35);
    $(window).resize(function () {
        $("#tab_" + selTabId + " .list_box").innerHeight($("#tab_" + selTabId + " .forum_title").outerHeight() + $(".rx-paging").outerHeight() + 35);
    });
}


/**
 * 保存主题帖
 */
function saveTopic() {
    if (topicVm.ruleValidate()) {
        topicVm.set("boardId", boardId);
        $.ajax({
            type: "post",
            url: "/forum/saveTopic",
            data: {
                forumTopic: topicVm.getJson()
            },
            dataType: "json",
            success: function (ar) {
                if (ar.success) {
                    RX.msg(RX.SUCCESS_SAVE);
                    zyVm.reloadGrid();
                    topicVm.empty(["title"]);
                    topicVm.getElement("content").val("");
                } else {
                    RX.alert(ar.msg);
                }
            }
        });
    }
}

/**
 * 查询主题帖
 */
function searchTopic() {
    var topicTitle = $(".searchinput").val();
    window[selTabId + "Vm"].$options.data.query.title = topicTitle;
    window[selTabId + "Vm"].reloadGrid();
}

/**
 * 保存帖子查看
 */
function saveTopicView(topicId) {
    $.ajax({
        type: "post",
        url: "/forum/saveForumView",
        data: {objectId: topicId, type: "TOPIC"},
        dataType: "json",
        success: function (ar) {
            if (!ar.success) {
                RX.alert(ar.msg);
            }
        }
    });
}

/**
 * 查看帖子详情
 * @param vm
 * @param keypath
 */
function showTopicDetail(vm, keypath) {
    var topicId = vm.get(keypath).ID;
    var topicTitle = vm.get(keypath).TITLE;
    RX.page.goto(RX.handlePath("/forum/topicDetail"), {
        topicId: topicId,
        boardId: boardId
    });
    saveTopicView(topicId);
}