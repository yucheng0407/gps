var config = {
    opinion: {
        maxLength: 250,
        rules: {checkSave: ["notNull"]}
    }
};

//列配置
var columns = [
    {title: '办理人', id: 'USER_NAME', width: '50px', renderer: "String", align: "center"},
    {title: '所在机构', id: 'ORGAN_NAME', width: '100px', renderer: "String", align: "center"}
];

//列表视图设置
var settings = {
    paged: false, //是否分页
    selectType: "multi",
    autoListBox: {
        enable: true,
        columns: columns, //配置为方法，则根据方法执行结果动态获取columns
        ordinal: false, //是否有序号
        checkbox: false, //是否显示checkbox
        mulchose: true, //是否多选
        allPageChose: true //是否开启全页选择
    },
    afterLoad: function (rows) {
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].TAG == '0') {
                $(this).find("tr:nth-child(" + (i + 1) + ")").addClass("disabledRow").find("td").prop("title", "原办理人不存在");
            }
        }
    }
};

var buttonArr = [
    {
        id: "view",
        name: "上传/查看附件",
        onClick: "uploadOrViewFile",
        style: "c_button"
    },
    {
        id: "sure",
        name: "确定",
        onClick: "submitTask",
        style: "c_button"
    }
];

var buttonsJson = {
    tag: ".w_button_box",
    buttons: buttonArr
};