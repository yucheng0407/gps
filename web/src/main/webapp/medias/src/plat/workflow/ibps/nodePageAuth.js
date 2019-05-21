//参数
var param = RX.page.param;
$(function () {
    $.ajax({
        type: "post",
        url: "/workflow/ibps/getNodePageAuth",
        data: {
            formId: param.formId,
            pageId: param.sheetId,
            domId: param.domId
        },
        success: function (ar) {
            if (ar.success) {
                new Rxvm({
                    el: '.form_box',
                    settings: {
                        getData: {
                            defaultData: {
                                tables: ar.data
                            }
                        }
                    }
                });
            } else {
                RX.alert(ar.msg);
            }
        }
    });
    $("#save").click(function () {
        var params = {};
        var fields = [],
            subFields = [];
        $(".field").each(function () {
            var field = {};
            var $this = $(this);
            field.formId = $this.data("id");
            field.code = $this.data("code");
            var authAttr = {};
            //以下是权限获取
            $(this).find(".field-rights").each(function () {
                var _self = $(this);
                //权限类型
                var rightsType = _self.data("type");
                //获取权限值
                authAttr[rightsType] = getFieldRight(_self);
            });
            field.authAttr = JSON.stringify(authAttr);
            fields.push(field);
        });
        params.field = JSON.stringify(fields);
        $(".subField").each(function () {
            var field = {};
            var $this = $(this);
            field.formId = $this.data("id");
            field.code = $this.data("code");
            var authAttr = {};
            //以下是权限获取
            $(this).find(".field-rights").each(function () {
                var _self = $(this);
                //权限类型
                var rightsType = _self.data("type");
                //获取权限值
                authAttr[rightsType] = getFieldRight(_self);
            });
            field.authAttr = JSON.stringify(authAttr);
            subFields.push(field);
        });
        params.subField = JSON.stringify(subFields);
        $.ajax({
            type: "post",
            url: "/workflow/ibps/saveNodePageAuth",
            data: {
                pageId: param.sheetId,
                domId: param.domId,
                authData: JSON.stringify(params)
            },
            success: function (ar) {
                if (ar.success) {
                    RX.msg("保存成功");
                    RX.page.close();
                } else {
                    RX.alert(ar.msg);
                }
            }
        });
    });
});

/**
 * 获取权限值
 * @param $el
 * @returns {string}
 */
function getFieldRight($el) {
    //数据默认是all
    return $el.find("input").attr("checked") ? true : ""
}