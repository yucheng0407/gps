//按钮配置
var param = RX.page.param;
var buttonArr = [];
var buttonsJson = {
    tag: ".w_button_box",
    buttons: buttonArr,
    editButton: roleLevel <= 2 ? {
        enable: true,
        editUrl: {url: "/resource/resourceEdit?resourceType="+param.resourceType, param: {id: param.id }}, //默认采用查看页面的View替换Edit,并将id传入
        editTitle: "修改" + getTypeName(param.resourceType) //默认将当前页面标题的"查看"改为"修改",
    }: false
};

function getTypeName(code) {
    var name = "";
    $.each(resourceDict, function (i, t) {
        if (t.code == code) {
            name = t.value;
            return false;
        }
    });
    return name;
}
