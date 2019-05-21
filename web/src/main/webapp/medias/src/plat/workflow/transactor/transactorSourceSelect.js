$(function () {
    var sourceType = [{name: "指定用户", code: 1, des: "指定一组固定用户办理", url: "/workflow/transactor/userEdit"},
        {name: "指定机构", code: 2, des: "指定机构下的用户办理，并可追加限定条件", url: "/workflow/transactor/organEdit"},
        {name: "角色", code: 3, des: "指定一个或多个角色办理，并可追加限定条件", url: "/workflow/transactor/roleEdit"},
        {name: "限定条件", code: 4, des: "根据用户类型及机构层级限定办理人", url: "/workflow/transactor/conditionEdit"},
        {name: "流程规则", code: 5, des: "使用流程规则指定办理人", url: "/workflow/transactor/ruleEdit"}
    ];
    var sorceTypeHtml = "";
    $.each(sourceType, function (index, type) {
        var i = index + 1;
        sorceTypeHtml += '<li>' +
            '<label class="label_radio ' + (i === 1 ? "r_on" : "") + '" for="radio-0' + i + '">' +
            '<input id="radio-0' + i + '" type="radio" name="ts" ' + (i === 1 ? "checked=\"checked\"" : "") + ' value="' + type.code + '"/>' +
            '</label>' +
            '<h1>' + type.name + '</h1>' +
            '<p>' + type.des + '</p>' +
            '</li>';
    });
    $(".list_tit").append(sorceTypeHtml);
    //radio个性控制
    $('body').off('click', '.label_radio').on('click', '.label_radio', function (e) {
        $(this).find("input").attr("checked", true);
        $(this).parent().siblings().find('.label_radio').each(function () {
            var $radioLabel = $(this);
            if ($radioLabel.find("input").prop("checked")) {
                $radioLabel.addClass('r_on');
            } else {
                $radioLabel.removeClass('r_on');
            }
        });
        e.stopPropagation();
    });
    $("#confirmBtn").on("click", function () {
        var sel = parseInt($("input[name='ts']:checked").val());
        RX.page.openStack({
            openWin: window,
            url: sourceType[sel - 1].url,
            param: {
                callbackFunc: RX.page.param.callbackFunc
            }
        });
    });
    $("#cancelBtn").on("click", function () {
        RX.page.closeAll();
    });
});