var resourceVm,
    param = RX.page.param,
    id = param.id;
$(function () {
    var resourceData;
    //视图初始化
    resourceVm = new Rxvm({
            el: '.form_box',
            settings: {
                getData: {
                    url: "/resource/getResourceById?id=" + id + "&r=" + Math.random(),
                    success: function (ar) {
                        var data = ar.data;
                        resourceData = data;
                        if (data && data.parentType) {
                            data.parentName += " (" + getTypeName(data.parentType) + ")";
                        }
                        return data;
                    }
                }
            },
            afterMount: function () {
                if (resourceData.targetName) {
                    $("#targetNameTr").show();
                }
                if (resourceType) {
                    $("#title").text(getTypeName(resourceType) + "基本信息");
                }
                //初始化表单按钮控件
                RX.button.init($(".w_button_box"), buttonsJson, "ck");
            }
        }
    );
});
