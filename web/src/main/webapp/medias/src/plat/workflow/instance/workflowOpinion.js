var param = RX.page.param,
    opinionData = [],
    opinionVm,
    sortType = true;  //true顺序，false倒叙
$(function () {
    //任务id
    var taskId = param.taskId;
    if (taskId) {
        $.ajax({
            type: "post",
            url: "/workflow/instance/getWorkflowLzHistory?taskId=" + taskId,
            success: function (ar) {
                if (ar.success) {
                    opinionData = ar.data;
                    createOpinionVm(opinionData);
                } else {
                    RX.alert(ar.msg);
                }
            }
        });
    } else {
        opinionData.push({
            nodeName: "发起",
            userName: "我",
            organName: "",
            action: "SIGN",
            handleDate: new Date().Format("yyyy-MM-dd HH:mm:ss"),
            opinion: ""
        });
        createOpinionVm(opinionData);
    }
    //关闭
    $(".closer").click(function () {
        "function" === typeof param.hideBox && typeof param.hideBox();
    });
    //排序变化
    $(".switch").click(function () {
        sortType = !sortType;
        //反转数据
        opinionData = $.extend(true, [], opinionData.reverse());
        opinionVm.set("data", opinionData);
        opinionVm.set("sortType", sortType);
    });
});

function createOpinionVm(data) {
    handleDate(data);
    opinionVm = new Rxvm({
        el: '.ibox_content_timeline_box',
        settings: {
            getData: {
                defaultData: {data: data, sortType: sortType}
            }
        }
    });
}

/**
 * 数据加工，赋予样式icon图标
 * @param data
 */
function handleDate(data) {
    var iconObj = {
        "SUBMIT": {
            name: "提交",
            icon: "&#xe620;",
            class: "tj"
        },
        "AGREE": {
            name: "通过",
            icon: "&#xe673;",
            class: "ty"
        },
        "RECOVER": {
            name: "撤回",
            icon: "&#xe672;",
            class: "ch"
        },
        "SIGN": {
            name: "在办",
            icon: "&#xe738;",
            class: "zb"
        },
        "BACK": {
            name: "退回",
            icon: "&#xe642;",
            class: "th"
        }
    };
    var iconConfig;
    $.each(data, function (index, d) {
        if (index === 0) {
            //发起人的样式
            d.class = "initiate";
            d.icon = "&#xe674;";
            d.name = "发起";
            d.firstNode = true;
            d.userName = d.userName + " 发起申请";
        } else {
            iconConfig = iconObj[d.action];
            if (iconConfig) {
                d.class = iconConfig.class;
                d.icon = iconConfig.icon;
                d.name = iconConfig.name;
            }
        }
    });
    if ("0" === param.wiStatus) {
        data.push({
            lastNode: true
        });
    }
}