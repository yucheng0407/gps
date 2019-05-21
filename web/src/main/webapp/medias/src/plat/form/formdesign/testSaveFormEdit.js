var textVm;
$(function () {
    var param = RX.page.param, dataId = param.id;
    var formControl = new FormControl($(".form_box"));
    //视图初始化
    textVm = new Rxvm({
        el: '.form_box',
        config: formControl.getConfig(),
        settings: {
            getData: {
                url: dataId && "/form/getFormData",
                param: {id: dataId, formId: param.formId},
                defaultData: param.defaultData || {}
            }
        },
        components: formControl.getComponentsConfig()
    });
    //按钮配置
    var buttonArr = [
        {
            id: "save",
            name: "保存",
            onClick: "save",
            style: "c_button"
        }
    ];

    var buttonsJson = {
        tag: ".w_button_box",
        buttons: buttonArr
    };
    RX.button.init($("#w_butt"), buttonsJson, "xz");
});

function save() {
    if (textVm.ruleValidate()) {
        $.ajax({
            type: "post",
            url: "/form/saveFormData",
            data: {
                dataJson: textVm.getJson(),
                formId: RX.page.param.formId
            },
            async: false,
            success: function (ar) {
                if (ar.success) {
                    RX.msg(RX.SUCCESS_SAVE);
                    RX.page.prev().reload();
                    RX.page.close();
                } else {
                    RX.alert(ar.msg);
                }
            }
        });
    }
}


/**
 * 外部接口，设置值
 * @param key
 * @param value
 */
function setFormValue(key, value) {
    textVm.set(key, value);
}

/**
 * 获取值
 * @param key
 */
function getFormValue(key) {
    return textVm.get(key);
}