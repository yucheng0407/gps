var textVm;
var param = RX.page.param, dataId = param.page.dataId;
$(function () {
    var formControl = new FormControl($(".form_box"), "ck");
    var url;
    if (dataId) {
        url = "/form/getFormData?id=" + dataId + "&formId=" + param.formId;
    }
    //根据url获取数据
    var data = RX.page.get(url);
    //渲染vm
    textVm = new Rxvm({
        el: '.form_box',
        config: formControl.getConfig(),
        data: data,
        components: formControl.getComponentsConfig()
    });
});