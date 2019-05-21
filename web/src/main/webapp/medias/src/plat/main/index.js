/**
 * 登录
 */
var menuData;
var selectIndex = 0;
$(function () {
    //初始化内容区域高
    $("#leftMenu").height($(window).height() - 40);
    //初始化用户名
    $("#user_name").html(RX.decode($.cookie('userName')));
    $("#organName").html(RX.decode($.cookie('organName')));
    //获取菜单数据
    menuData = RX.getUserResource("menu", "HTGL");
    //生成一级菜单
    createMenu(true);
    //初始化第一个样式
    $("#menu a:first").addClass("selected");

    var localSkin = RX.config.selectSkin;

    if (localSkin) {
        var $skinbox = $(".skinbox li [class=" + localSkin + "]");
        $skinbox.find("i").html("");
        $skinbox.find("i").html("&#xe620;");
    } else {
        $(".skinbox li [class='default']").find("i").html("&#xe620;")
    }
});
//页面大小改变时，触发jquery的resize方法，自适应拖拽
$(window).resize(function () {
    $("#leftMenu").height($(window).height() - 40);

    createMenu(false);
});

//动态生成菜单
function createMenu(firstRender) {
    var $menu = $('#menu');
    //清空菜单栏
    $menu.empty();
    //计算有效宽度
    var validWidth = $(".top").width() - $(".logo").width() - $(".user").width() - $(".navbar_top_links").width() - 50,
        menuArr = [], moreArr = [], tempWidth = 0, hasMore = false;

    $.each(menuData, function (i, v) {
        var targetArr = menuArr;
        if (!hasMore) {
            //计算菜单项宽度
            var liWidth = 75 + 14 * (v.name || "").length;
            //如果超出有效宽度
            if (tempWidth + Math.max(liWidth, 103) > validWidth) {
                if (menuArr.length) {
                    //将菜单最后一项推至更多栏
                    moreArr.push(menuArr.pop());
                }
                targetArr = moreArr;
                hasMore = true;
            } else {
                tempWidth += liWidth;
            }
        } else {
            targetArr = moreArr;
        }

        //有url
        if (v.url) {
            targetArr.push('<a href="' + RX.handlePath(v.url) + '" id="one"  onclick="setTab(this,\' + i + \')" target="MainIframe" ' + (selectIndex == i ? 'class="selected"' : '') + '>' +
                '<i class="iconfont">' + (v.icon ? v.icon : '') + '</i>' + v.name + '</a>');
            if (i === 0 && firstRender) {
                $("#mainframe").attr("src", RX.handlePath(v.url));
            }
        } else {
            targetArr.push('<a href="' + RX.ctxPath + '/leftMenu.html' + '?index=' + i + '" id="one"  onclick="goMenu(this,' + i + ')" target="MainIframe" ' + (selectIndex == i ? 'class="selected"' : '') + '>' +
                '<i class="iconfont">' + (v.icon ? v.icon : '') + '</i>' + v.name + '</a>');
        }
    });

    //插入菜单栏
    $.each(menuArr, function (k, t) {
        $menu.append('<li class="em">' + t + '</li>');
    });
    $menu.children("li").find("i").addClass("topicon");

    if (moreArr.length) {
        //创建more
        var $more = $('<li class="im"><a id="one" onclick="return false;" ' + (selectIndex >= menuArr.length ? 'class="selected"' : '') + '>' +
            '<i class="iconfont topicon">&#xe6a4;</i>更多</a></li>');
        var $moreUl = $('<ul></ul>');
        //插入more栏
        $.each(moreArr, function (k, t) {
            $moreUl.append('<li>' + t + '</li>');
        });
        //绑定more点击事件
        $moreUl.bind('click', 'a', function (event) {
            $menu.children("li").children(".selected").removeClass("selected");
            $more.children('a').addClass('selected');
            RX.stopBubble(event);
        });
        $more.append($moreUl);
        $menu.append($more);
    }

    //初始化跳转
    if (menuData.length && firstRender) {
        if (menuData[0].url) {
            $("#mainframe").attr("src", RX.handlePath(menuData[0].url));
        } else {
            $("#mainframe").attr("src", RX.handlePath("leftMenu.html?index=0"));
        }
    }
}

//跳转菜单
function goMenu(t, index) {
    setTab(t, index);
}

var objtemp;

//点击设置菜单样式
function setTab(obj, index) {
    $(obj).parent().parent().find(".selected").removeClass("selected");
    obj.className = "selected";
    selectIndex = index;
    objtemp = obj;
}

function gotoUrl(obj, url) {
    var el = obj[0], iframe = el.contentWindow;
    if (iframe != null) {
        if (iframe.closeFunc) {
            iframe.closeFunc();
        }
    }
    if (el) {
        if (isIE) {
            el.src = 'about:blank';
            try {
                iframe.document.write('');
                iframe.close();
            } catch (e) {
            }
        }
        el.src = url;
    }
}

//修改密码
function changePassword() {
    RX.page.open({
        title: "修改密码",
        areaType: "small",
        url: "/main/password"
    });
}

//切换皮肤
function changeSkin() {
    var skin = $($(event)[0].target).attr("class");
    if (RX.config.selectSkin === skin) {
        RX.msg(RX.ICON_WARNING, "皮肤已经采用");
        return false;
    }
    $.cookie("skin", skin);
    RX.msg("皮肤切换成功，请稍等");
    setTimeout(function () {
        location.reload();
    }, 1000);
    // $.ajax({
    //     type: "post",
    //     url: "/main/changeSkin",
    //     data: {skin: skin},
    //     success: function (ar) {
    //         if (ar.success) {
    //             RX.msg("皮肤切换成功，请稍等");
    //             setTimeout(function () {
    //                 location.reload();
    //             }, 1000);
    //         }
    //     }
    // })
}


//个人信息
function personal() {
    var userId = RX.cache(_top, "USER").id;
    RX.page.open({
        title: "个人信息",
        url: "/user/sysUserInfoView",
        param: {
            id: userId
        }
    })
}