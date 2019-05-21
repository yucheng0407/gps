var id = RX.page.param.id;
var sysDictFormVm;
$(function () {
    //视图初始化
    sysDictFormVm = new Rxvm({
        el: '.form_box',
        template: '#sysDictForm',
        config: config,
        settings: {
            getData: {
                url: id && "/dictionary/getSysDictionaryById",
                param: {id: id}
            }
        },
        methods: {},
        afterMount: function () {
            if (id) {
                sysDictFormVm.setDisabled("dictCode", true);
            }

            //初始化表单按钮控件
            RX.button.init($("#w_butt"), buttonsJson, "ck");
        },
        //子组件声明
        components: {
            "DictItemTreeGrid": {
                widget: RX.TreeGrid,
                template: '#dictItem',
                settings: dictItemSettings,
                config: dictItemConfig
            }
        }
    });
});