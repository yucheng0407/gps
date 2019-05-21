var mainPage;
$(function () {
    $("#contentGdt").outerHeight($(window).height());
    $(window).resize(function () {
        $("#contentGdt").outerHeight($(window).height());
    });
    var data1 = [
        {
            type: "layout", height: "90px", children: [
            {
                type: "layout",
                width: "50",
                children:
                    [
                        {
                            type: "content",
                            renderType: "gxShow1",
                            renderData: [{name: "治安检查", icon: "&#xe631;", num: 121, color: "#ff6f9f;"},
                                {name: "退回案件", icon: "&#xe621;", num: 57, color: "#0e9aef;"},
                                {name: "监督考察", icon: "&#xe638;", num: 100, color: "#1ecbd9;"},
                                {name: "人口信息", icon: "&#xe612;", num: 9, color: "#ff9974;"}
                            ],
                            code: "code55"
                        }
                    ]
            }
        ]
        },
        {
            type: "layout", height: "300px", children:
            [
                {
                    type: "layout",
                    width: "50",
                    buttons: [{name: "更多", icon: "&#xe6a4;", click: "showMoreDbrw"}],
                    children:
                        [
                            {
                                type: "content",
                                title: "代办任务",
                                renderType: "li",
                                url: "/mainPage/getDbrw",
                                code: "dbrw",
                                click: "dbrwClick"
                            }]
                },
                {
                    type: "layout",
                    width: "50",
                    buttons: [{name: "更多", icon: "&#xe6a4;", click: "showMoreYbrw"}],
                    children:
                        [

                            {
                                type: "content",
                                renderType: "li",
                                title: "已办任务",
                                click: "ybrwClick",
                                code: "ybrw",
                                url: "/mainPage/getYbrw"
                            }
                            // {
                            //     type: "content",
                            //     renderType: "li",
                            //     title: "在办任务",
                            //     click: "zbrwClick",
                            //     code: "zbrw",
                            //     url: "/mainPage/getZbrw"
                            // }
                        ]
                },
                {
                    type: "layout",
                    width: "50",
                    buttons: [{name: "更多", icon: "&#xe6a4;", click: "showMoreZbrw"}],
                    children:
                        [
                            {
                                type: "content",
                                renderType: "li",
                                title: "我发起的流程",
                                click: "zbrwClick",
                                code: "zbrw",
                                url: "/mainPage/getZbrw"
                            }
                        ]
                }
            ]
        },
        {
            type: "layout", height: "200px", children: [
            {
                type: "layout",
                width: "50",
                children:
                    [
                        {
                            type: "content",
                            title: "图标展示代办任务",
                            renderType: "image",
                            limit: "10",
                            url: "/mainPage/getImageDbrw",
                            code: "imageDbrw",
                            click: "showAllDbrw"
                        }
                    ]
            }
        ]
        }
    ];
    mainPage = renderMainPage($("#contentGdt"), data1);
});

RX.page.reload = function () {

};

/**
 * 代办任务点击事件
 * @param data
 */
function dbrwClick(data) {
    handleWorkflowByTaskId(data["TASK_ID"], {title: data["TITLE"]});
}

/**
 * 已办任务点击事件
 * @param data
 */
function ybrwClick(data) {
    handleWorkflowByTaskId(data["TASK_ID"], {title: data["TITLE"]});
}

/**
 * 在办任务点击事件
 * @param data
 */
function zbrwClick(data) {
    handleWorkflowByTaskId(data["LAST_TASK_ID"], {title: data["TITLE"]});
}

/**
 * 更多代办任务
 */
function showMoreDbrw() {
    RX.page.open({title: "代办列表", url: "/workflow/platform/dbList"});
}

/**
 * 更多已办任务
 */
function showMoreYbrw() {
    RX.page.open({title: "已办列表", url: "/workflow/platform/ybList"});
}

/**
 * 更多在办流程
 */
function showMoreZbrw() {
    RX.page.open({title: "我发起的流程列表", url: "/workflow/platform/zbList"});
}

/**
 * 点击图标展示列表数据
 * @param data
 */
function showAllDbrw(data) {
    RX.page.open({
        title: "代办列表", url: "/workflow/platform/dbList", param: {
            wfName: data["name"],
            wfId: data["id"]
        }
    });
}


function showTb(data) {
    RX.alert(data.name);
}


function aaa(data) {
    RX.alert(data.name);
}

/**
 * 个性render
 * @param data
 * @param options
 * @param $el
 */
function gxRender(data, options, $el) {
    $.each(data, function (index, value) {
        $el.append(value.name);
    });
}

/**
 * 个性显示类型1
 */
function gxShow1(data, options, $el) {
    //实例化具体视图
    new Rxvm({
        //视图容器
        el: $el[0],
        //视图模板
        template: "#gxTpl1",
        //基础配置
        settings: {
            //获取数据
            getData: {
                defaultData: {data: data}
            }
        }
    });
}

function gxShow2(data, options, $el) {
    //实例化具体视图
    new Rxvm({
        //视图容器
        el: $el[0],
        //视图模板
        template: "#gxTpl2",
        //基础配置
        settings: {
            //获取数据
            getData: {
                defaultData: {data: data}
            }
        }
    });
}
