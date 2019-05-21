// 论坛动态
var forumVm;
$(function () {

    //视图初始化
    forumVm = new Rxvm({
        el: '.base_box',
        settings: {
            getData: {
                url: "/forum/getForumActivity"
            }
        },
        methods: {
            showBoardMain: function (keypath) {
                var boardId = this.get(keypath).BOARD_ID;
                RX.page.goto(RX.handlePath("/forum/boardMain?boardId=" + boardId));
                saveBoardView(boardId);
            }
        }
    });

});

/**
 * 保存版块查看
 */
function saveBoardView(boardId) {
    $.ajax({
        type: "post",
        url: "/forum/saveForumView",
        data: {objectId: boardId, type: "BOARD"},
        dataType: "json",
        success: function (ar) {
            if (!ar.success) {
                RX.alert(ar.msg);
            }
        }
    });
}