/*! layer-v2.1 弹层组件 License LGPL  http://layer.layui.com/ By 贤心 */
/*
* 2018-04-23 个性add 记录msgIndex（alert和confirm的index），和closeMsgWin的接口
*
* 2018-06-07 add by mrq 增加rxWindowHeight、rxWindowWidth用于记录当前窗口大小，ie8浏览器兼容性bug（layer弹出层位置位于左上角）
*               getFontWidth计算一行的字体宽度，基于现在的样式计算的（字体14px，padding 20），样式改变需要进行调整
* */
;
var rxWindowHeight = $(window).height();
var rxWindowWidth = $(window).width();
$(window).resize(function () {
    rxWindowHeight = $(window).height();
    rxWindowWidth = $(window).width();
});
!function (a, b) {
    "use strict";
    var msgIndex;   //记录confirm和alert的弹窗index
    var c, d, e = {
        getPath: function () {
            var a = document.scripts, b = a[a.length - 1], c = b.src;
            if (!b.getAttribute("merge")) return c.substring(0, c.lastIndexOf("/") + 1)
        }(),
        enter: function (a) {
            13 === a.keyCode && a.preventDefault()
        },
        config: {},
        end: {},
        btn: ["&#x786E;&#x5B9A;", "&#x53D6;&#x6D88;"],
        type: ["dialog", "page", "iframe", "loading", "tips"]
    }, f = {
        v: "2.1", ie6: !!a.ActiveXObject && !a.XMLHttpRequest, index: 0, path: e.getPath, config: function (a, b) {
            var d = 0;
            //fixme: 兼容平台皮肤
            var skin = RX.config.selectSkin;
            if (skin === "dark" || skin === "gray") {
                skin = "skin/" + skin + "/layer_" + skin + ".css";
            } else {
                skin = "skin/default/layer.css";
            }
            return a = a || {},
                f.cache = e.config = c.extend(e.config, a),
                f.path = e.config.path || f.path,
            "string" == typeof a.extend && (a.extend = [a.extend]),
                f.use(skin, a.extend && a.extend.length > 0 ? function g() {
                    var c = a.extend;
                    f.use(c[c[d] ? d : d - 1], d < c.length ? function () {
                        return ++d, g
                    }() : b)
                }() : b), this
        }, use: function (a, b, d) {
            var e = c("head")[0], a = a.replace(/\s/g, ""), g = /\.css$/.test(a),
                h = document.createElement(g ? "link" : "script"), i = "layui_layer_" + a.replace(/\.|\//g, "");
            return f.path ? (g && (h.rel = "stylesheet"), h[g ? "href" : "src"] = /^http:\/\//.test(a) ? a : f.path + a, h.id = i, c("#" + i)[0] || e.appendChild(h), function j() {
                (g ? 1989 === parseInt(c("#" + i).css("width")) : f[d || i]) ? function () {
                    b && b();
                    try {
                        g || e.removeChild(h)
                    } catch (a) {
                    }
                }() : setTimeout(j, 100)
            }(), this) : void 0
        }, ready: function (a, b) {
            var d = "function" == typeof a;
            return d && (b = a), f.config(c.extend(e.config, function () {
                return d ? {} : {path: a}
            }()), b), this
        }, alert: function (a, b, d) {
            var e = "function" == typeof b;
            e && (d = b);
            msgIndex = f.open(c.extend({content: a, yes: d}, e ? {} : b));
            return msgIndex;
        }, closeMsgWin: function () {
            //关闭消息的弹窗，目前为confirm和alert
            var flg = false;
            if (msgIndex) {
                f.close(msgIndex);
                flg = true;
            }
            return flg;
        }, confirm: function (a, b, d, g) {
            var h = "function" == typeof b;
            h && (g = d, d = b);
            msgIndex = f.open(c.extend({content: a, btn: e.btn, yes: d, cancel: g}, h ? {} : b));
            return msgIndex;
        }, msg: function (a, d, g) {
            var i = "function" == typeof d, j = e.config.skin, k = (j ? j + " " + j + "-msg" : "") || "layui-layer-msg",
                l = h.anim.length - 1;
            return i && (g = d), f.open(c.extend({
                content: a,
                time: 3e3,
                shade: !1,
                skin: k,
                title: !1,
                closeBtn: !1,
                btn: !1,
                end: g
            }, i && !e.config.skin ? {skin: k + " layui-layer-hui", shift: l} : function () {
                return d = d || {}, (-1 === d.icon || d.icon === b && !e.config.skin) && (d.skin = k + " " + (d.skin || "layui-layer-hui")), d
            }()))
        }, load: function (a, b) {
            return f.open(c.extend({type: 3, icon: a || 0, shade: .01}, b))
        }, tips: function (a, b, d) {
            return f.open(c.extend({type: 4, content: [a, b], closeBtn: !1, time: 3e3, maxWidth: 210}, d))
        }
    }, g = function (a) {
        var b = this;
        b.index = ++f.index, b.config = c.extend({}, b.config, e.config, a), b.creat()
    };
    g.pt = g.prototype;
    var h = ["layui-layer", ".layui-layer-title", ".layui-layer-main", ".layui-layer-dialog", "layui-layer-iframe", "layui-layer-content", "layui-layer-btn", "layui-layer-close"];
    h.anim = ["layui-anim", "layui-anim-01", "layui-anim-02", "layui-anim-03", "layui-anim-04", "layui-anim-05", "layui-anim-06"], g.pt.config = {
        type: 0,
        shade: .7,
        fix: !0,
        move: h[1],
        title: "&#x4FE1;&#x606F;",
        offset: "auto",
        area: "auto",
        closeBtn: 1,
        time: 0,
        zIndex: 19891014,
        maxWidth: 360,
        shift: 0,
        icon: -1,
        scrollbar: !0,
        tips: 2
    }, g.pt.vessel = function (a, b) {
        var c = this, d = c.index, f = c.config, g = f.zIndex + d, i = "object" == typeof f.title,
            j = f.maxmin && (1 === f.type || 2 === f.type),
            k = f.title ? '<div class="layui-layer-title" style="' + (i ? f.title[1] : "") + '">' + (i ? f.title[0] : f.title) + "</div>" : "";
        return f.zIndex = g, b([f.shade ? '<div class="layui-layer-shade" id="layui-layer-shade' + d + '" times="' + d + '" style="' + ("z-index:" + (g - 1) + "; background-color:" + (f.shade[1] || "#000") + "; opacity:" + (f.shade[0] || f.shade) + "; filter:alpha(opacity=" + (100 * f.shade[0] || 100 * f.shade) + ");") + '"></div>' : "", '<div class="' + h[0] + " " + (h.anim[f.shift] || "") + (" layui-layer-" + e.type[f.type]) + (0 != f.type && 2 != f.type || f.shade ? "" : " layui-layer-border") + " " + (f.skin || "") + '" id="' + h[0] + d + '" type="' + e.type[f.type] + '" times="' + d + '" showtime="' + f.time + '" conType="' + (a ? "object" : "string") + '" style="z-index: ' + g + "; width:" + f.area[0] + ";height:" + f.area[1] + (f.fix ? "" : ";position:absolute;") + '">' + (a && 2 != f.type ? "" : k) + '<div class="layui-layer-content' + (0 == f.type && -1 !== f.icon ? " layui-layer-padding" : "") + (3 == f.type ? " layui-layer-loading" + f.icon : "") + '">' + (0 == f.type && -1 !== f.icon ? '<i class="layui-layer-ico iconfont layui-layer-ico' + f.icon + '">' + function () {
            switch (f.icon) {
                case 0: {
                    return "&#xe653;"
                }
                case 1: {
                    return "&#xe65a;"
                }
                case 2: {
                    return "&#xe659;"
                }
                case 3: {
                    return "&#xe67f;"
                }
                case 4: {
                    return "&#xe65b;"
                }
            }
        }() + '</i>' : "") + (1 == f.type && a ? "" : f.content || "") + '</div><span class="layui-layer-setwin">' + function () {
            var a = j ? '<cite></cite></a><a class="layui-layer-ico layui-layer-max" href="javascript:;"></a>' : "";
            //<a class="layui-layer-min" href="javascript:;">
            return f.closeBtn && (a += '<a class="layui-layer-ico ' + h[7] + " " + h[7] + (f.title ? f.closeBtn : 4 == f.type ? "1" : "2") + '" href="javascript:;"></a>'), a
        }() + "</span>" + (f.btn ? function () {
            var a = "";
            "string" == typeof f.btn && (f.btn = [f.btn]);
            for (var b = 0, c = f.btn.length; c > b; b++) a += '<a class="' + h[6] + b + '">' + f.btn[b] + "</a>";
            return '<div class="' + h[6] + '">' + a + "</div>"
        }() : "") + "</div>"], k), c
    }, g.pt.creat = function () {
        var a = this, b = a.config, g = a.index, i = b.content, j = "object" == typeof i;
        switch ("string" == typeof b.area && (b.area = "auto" === b.area ? ["", ""] : [b.area, ""]), b.type) {
            case 0:
                b.btn = "btn" in b ? b.btn : e.btn[0], f.closeAll("dialog");
                if (_top.hasLayerManager) {
                    _top.hasLayerAlert = true;
                    _top.handleSelect(null, false);
                }
                break;
            case 2:
                var i = b.content = j ? b.content : [b.content || "http://layer.layui.com", "auto"];
                if (_top.hasLayerManager) {
                    _top.pushStackWin({name: h[4] + g}, a.config.parentWin);
                    _top.handleSelect(a.config.parentWin, false);
                    _top.winData(h[4] + g, "param", a.config.param);
                }
                b.content = '<iframe scrolling="' + (b.content[1] || "auto") + '" allowtransparency="true" id="' + h[4] + g + '" name="' + h[4] + g + '" onload="this.className=\'\';"  frameborder="0" src="' + b.content[0] + '"></iframe>';
                break;
            case 3:
                b.title = !1, b.closeBtn = !1, -1 === b.icon && 0 === b.icon, f.closeAll("loading");
                break;
            case 4:
                j || (b.content = [b.content, "body"]), b.follow = b.content[1], b.content = b.content[0] + '<i class="layui-layer-TipsG"></i>', b.title = !1, b.shade = !1, b.fix = !1, b.tips = "object" == typeof b.tips ? b.tips : [b.tips, !0], b.tipsMore || f.closeAll("tips")
        }
        a.vessel(j, function (d, e) {
            c("body").append(d[0]), j ? function () {
                2 == b.type || 4 == b.type ? function () {
                    c("body").append(d[1])
                }() : function () {
                    i.parents("." + h[0])[0] || (i.show().addClass("layui-layer-wrap").wrap(d[1]), c("#" + h[0] + g).find("." + h[5]).before(e))
                }()
            }() : c("body").append(d[1]), a.layero = c("#" + h[0] + g), b.scrollbar || h.html.css("overflow", "hidden").attr("layer-full", g)
        }).auto(g), 2 == b.type && f.ie6 && a.layero.find("iframe").attr("src", i[0]);
        if (0 == b.type && (!!window.ActiveXObject && !!document.documentMode)) {
            var titleWidth = a.layero.find(".layui-layer-btn").innerWidth();
            if (titleWidth < 260 && !d.width()) {
                // //出错的情况下d.width会为0
                //目前一个字14px，小于260px为260px，大于260 -- 360，计算的值，大于360换行为360px
                var titleContent = a.config.content;
                //字体大小不是css赋值无法获取，所以定死
                var width1 = getFontWidth(titleContent);
                if (width1 <= 260) {
                    titleWidth = 260
                } else if (width1 <= 360) {
                    titleWidth = width1;
                } else {
                    titleWidth = 360;
                }
                a.layero.width(titleWidth);
            }
            a.layero.find(".layui-layer-title").width(titleWidth - 90);
        }
        c(document).off("keydown", e.enter).on("keydown", e.enter), a.layero.on("keydown", function (a) {
            c(document).off("keydown", e.enter)
        }), 4 == b.type ? a.tips() : a.offset(), b.fix && d.on("resize", function () {
            a.offset(), (/^\d+%$/.test(b.area[0]) || /^\d+%$/.test(b.area[1])) && a.auto(g), 4 == b.type && a.tips()
        }), b.time <= 0 || setTimeout(function () {
            f.close(a.index)
        }, b.time), a.move().callback()
    }, g.pt.auto = function (a) {
        function b(a) {
            a = g.find(a), a.height(i[1] - j - k - 2 * (0 | parseFloat(a.css("padding"))))
        }

        var e = this, f = e.config, g = c("#" + h[0] + a);
        "" === f.area[0] && f.maxWidth > 0 && (/MSIE 7/.test(navigator.userAgent) && f.btn && g.width(g.innerWidth()), g.outerWidth() > f.maxWidth && g.width(f.maxWidth));
        var i = [g.innerWidth(), g.innerHeight()], j = g.find(h[1]).outerHeight() || 0,
            k = g.find("." + h[6]).outerHeight() || 0;
        switch (f.type) {
            case 2:
                b("iframe");
                break;
            default:
                "" === f.area[1] ? f.fix && i[1] >= (d.height() || rxWindowHeight) && (i[1] = (d.height() || rxWindowHeight), b("." + h[5])) : b("." + h[5])
        }
        return e
    }, g.pt.offset = function () {
        var a = this, b = a.config, c = a.layero, e = [c.outerWidth(), c.outerHeight()],
            f = "object" == typeof b.offset;
        var _height = d.height() || rxWindowHeight;
        var _width = d.width() || rxWindowWidth;
        a.offsetTop = (_height - e[1]) / 2, a.offsetLeft = (_width - e[0]) / 2, f ? (a.offsetTop = b.offset[0], a.offsetLeft = b.offset[1] || a.offsetLeft) : "auto" !== b.offset && (a.offsetTop = b.offset, "rb" === b.offset && (a.offsetTop = _height - e[1], a.offsetLeft = _width - e[0])), b.fix || (a.offsetTop = /%$/.test(a.offsetTop) ? _height * parseFloat(a.offsetTop) / 100 : parseFloat(a.offsetTop), a.offsetLeft = /%$/.test(a.offsetLeft) ? _width * parseFloat(a.offsetLeft) / 100 : parseFloat(a.offsetLeft), a.offsetTop += d.scrollTop(), a.offsetLeft += d.scrollLeft()), c.css({
            top: a.offsetTop,
            left: a.offsetLeft
        });
    }, g.pt.tips = function () {
        var a = this, b = a.config, e = a.layero, f = [e.outerWidth(), e.outerHeight()], g = c(b.follow);
        g[0] || (g = c("body"));
        var i = {
            width: g.outerWidth(),
            height: g.outerHeight(),
            top: g.offset().top,
            left: g.offset().left
        }, j = e.find(".layui-layer-TipsG"), k = b.tips[0];
        b.tips[1] || j.remove(), i.autoLeft = function () {
            i.left + f[0] - d.width() > 0 ? (i.tipLeft = i.left + i.width - f[0], j.css({
                right: 12,
                left: "auto"
            })) : i.tipLeft = i.left
        }, i.where = [function () {
            i.autoLeft(), i.tipTop = i.top - f[1] - 10, j.removeClass("layui-layer-TipsB").addClass("layui-layer-TipsT").css("border-right-color", b.tips[1])
        }, function () {
            i.tipLeft = i.left + i.width + 10, i.tipTop = i.top, j.removeClass("layui-layer-TipsL").addClass("layui-layer-TipsR").css("border-bottom-color", b.tips[1])
        }, function () {
            i.autoLeft(), i.tipTop = i.top + i.height + 10, j.removeClass("layui-layer-TipsT").addClass("layui-layer-TipsB").css("border-right-color", b.tips[1])
        }, function () {
            i.tipLeft = i.left - f[0] - 10, i.tipTop = i.top, j.removeClass("layui-layer-TipsR").addClass("layui-layer-TipsL").css("border-bottom-color", b.tips[1])
        }], i.where[k - 1](), 1 === k ? i.top - (d.scrollTop() + f[1] + 16) < 0 && i.where[2]() : 2 === k ? d.width() - (i.left + i.width + f[0] + 16) > 0 || i.where[3]() : 3 === k ? i.top - d.scrollTop() + i.height + f[1] + 16 - d.height() > 0 && i.where[0]() : 4 === k && f[0] + 16 - i.left > 0 && i.where[1](), e.find("." + h[5]).css({
            "background-color": b.tips[1],
            "padding-right": b.closeBtn ? "30px" : ""
        }), e.css({left: i.tipLeft, top: i.tipTop})
    }, g.pt.move = function () {
        var a = this, b = a.config, e = {
            setY: 0, moveLayer: function () {
                var a = e.layero, b = parseInt(a.css("margin-left")), c = parseInt(e.move.css("left"));
                0 === b || (c -= b), "fixed" !== a.css("position") && (c -= a.parent().offset().left, e.setY = 0), a.css({
                    left: c,
                    top: parseInt(e.move.css("top")) - e.setY
                })
            }
        }, f = a.layero.find(b.move);
        return b.move && f.attr("move", "ok"), f.css({cursor: b.move ? "move" : "auto"}), c(b.move).on("mousedown", function (a) {
            if (a.preventDefault(), "ok" === c(this).attr("move")) {
                e.ismove = !0, e.layero = c(this).parents("." + h[0]);
                var f = e.layero.offset().left, g = e.layero.offset().top, i = e.layero.outerWidth() - 6,
                    j = e.layero.outerHeight() - 6;
                c("#layui-layer-moves")[0] || c("body").append('<div id="layui-layer-moves" class="layui-layer-moves" style="left:' + f + "px; top:" + g + "px; width:" + i + "px; height:" + j + 'px; z-index:2147483584"></div>'), e.move = c("#layui-layer-moves"), b.moveType && e.move.css({visibility: "hidden"}), e.moveX = a.pageX - e.move.position().left, e.moveY = a.pageY - e.move.position().top, "fixed" !== e.layero.css("position") || (e.setY = d.scrollTop())
            }
        }), c(document).mousemove(function (a) {
            if (e.ismove) {
                var c = a.pageX - e.moveX, f = a.pageY - e.moveY;
                if (a.preventDefault(), !b.moveOut) {
                    e.setY = d.scrollTop();
                    var g = d.width() - e.move.outerWidth(), h = e.setY;
                    0 > c && (c = 0), c > g && (c = g), h > f && (f = h), f > d.height() - e.move.outerHeight() + e.setY && (f = d.height() - e.move.outerHeight() + e.setY)
                }
                e.move.css({left: c, top: f}), b.moveType && e.moveLayer(), c = f = g = h = null
            }
        }).mouseup(function () {
            try {
                e.ismove && (e.moveLayer(), e.move.remove(), b.moveEnd && b.moveEnd()), e.ismove = !1
            } catch (a) {
                e.ismove = !1
            }
        }), a
    }, g.pt.callback = function () {
        function a() {
            var a = g.cancel && g.cancel(b.index);
            a === !1 || f.close(b.index)
        }

        var b = this, d = b.layero, g = b.config;
        b.openLayer(), g.success && (2 == g.type ? d.find("iframe").on("load", function () {
            g.success(d, b.index)
        }) : g.success(d, b.index)), f.ie6 && b.IE6(d), d.find("." + h[6]).children("a").on("click", function () {
            var e = c(this).index();
            g["btn" + (e + 1)] && g["btn" + (e + 1)](b.index, d);
            if (0 === e) {
                if (g.yes) {
                    try {
                        g.yes(b.index, d)
                    } catch (e) {
                    }

                } else {
                    f.close(b.index)
                }
            } else {
                if (1 === e) {
                    a();
                } else {
                    g["btn" + (e + 1)] || f.close(b.index);
                }
            }
//            0 === e ? g.yes ? g.yes(b.index, d) : f.close(b.index) : 1 === e ? a() : g["btn" + (e + 1)] || f.close(b.index)
        }), d.find("." + h[7]).on("click", a), g.shadeClose && c("#layui-layer-shade" + b.index).on("click", function () {
            f.close(b.index)
        }), d.find(".layui-layer-min").on("click", function () {
            f.min(b.index, g), g.min && g.min(d)
        }), d.find(".layui-layer-max").on("click", function () {
            c(this).hasClass("layui-layer-maxmin") ? (f.restore(b.index), g.restore && g.restore(d)) : (f.full(b.index, g), g.full && g.full(d))
        }), g.end && (e.end[b.index] = g.end)
    }, e.reselect = function () {
        c.each(c("select"), function (a, b) {
            var d = c(this);
            d.parents("." + h[0])[0] || 1 == d.attr("layer") && c("." + h[0]).length < 1 && d.removeAttr("layer").show(), d = null
        })

    }, g.pt.IE6 = function (a) {
        function b() {
            a.css({top: f + (e.config.fix ? d.scrollTop() : 0)})
        }

        var e = this, f = a.offset().top;
        b(), d.scroll(b), c("select").each(function (a, b) {
            var d = c(this);
            d.parents("." + h[0])[0] || "none" === d.css("display") || d.attr({layer: "1"}).hide(), d = null
        })
    }, g.pt.openLayer = function () {
        var a = this;
        f.zIndex = a.config.zIndex, f.setTop = function (a) {
            var b = function () {
                f.zIndex++, a.css("z-index", f.zIndex + 1)
            };
            return f.zIndex = parseInt(a[0].style.zIndex), a.on("mousedown", b), f.zIndex
        }
    }, e.record = function (a) {
        var b = [a.outerWidth(), a.outerHeight(), a.position().top, a.position().left + parseFloat(a.css("margin-left"))];
        a.find(".layui-layer-max").addClass("layui-layer-maxmin"), a.attr({area: b})
    }, e.rescollbar = function (a) {
        h.html.attr("layer-full") == a && (h.html[0].style.removeProperty ? h.html[0].style.removeProperty("overflow") : h.html[0].style.removeAttribute("overflow"), h.html.removeAttr("layer-full"))
    }, a.layer = f, f.getChildFrame = function (a, b) {
        return b = b || c("." + h[4]).attr("times"), c("#" + h[0] + b).find("iframe").contents().find(a)
    }, f.getFrameIndex = function (a) {
        return c("#" + a).parents("." + h[4]).attr("times")
    }, f.iframeAuto = function (a) {
        if (a) {
            var b = f.getChildFrame("html", a).outerHeight(), d = c("#" + h[0] + a),
                e = d.find(h[1]).outerHeight() || 0, g = d.find("." + h[6]).outerHeight() || 0;
            d.css({height: b + e + g}), d.find("iframe").css({height: b})
        }
    }, f.iframeSrc = function (a, b) {
        c("#" + h[0] + a).find("iframe").attr("src", b)
    }, f.style = function (a, b) {
        var d = c("#" + h[0] + a), f = d.attr("type"), g = d.find(h[1]).outerHeight() || 0,
            i = d.find("." + h[6]).outerHeight() || 0;
        (f === e.type[1] || f === e.type[2]) && (d.css(b), f === e.type[2] && d.find("iframe").css({height: parseFloat(b.height) - g - i}))
    }, f.min = function (a, b) {
        var d = c("#" + h[0] + a), g = d.find(h[1]).outerHeight() || 0;
        e.record(d), f.style(a, {
            width: 180,
            height: g,
            overflow: "hidden"
        }), d.find(".layui-layer-min").hide(), "page" === d.attr("type") && d.find(h[4]).hide(), e.rescollbar(a)
    }, f.restore = function (a) {
        var b = c("#" + h[0] + a), d = b.attr("area").split(",");
        b.attr("type");
        f.style(a, {
            width: parseFloat(d[0]),
            height: parseFloat(d[1]),
            top: parseFloat(d[2]),
            left: parseFloat(d[3]),
            overflow: "visible"
        }), b.find(".layui-layer-max").removeClass("layui-layer-maxmin"), b.find(".layui-layer-min").show(), "page" === b.attr("type") && b.find(h[4]).show(), e.rescollbar(a)
        //var twin = _top.window[b.find('iframe')[0]['name']];
        //if(twin){
        //    if(twin.resizeTab){
        //        twin.resizeTab();
        //    }
        //}
    }, f.full = function (a) {
        var b, g = c("#" + h[0] + a);
        e.record(g), h.html.attr("layer-full") || h.html.css("overflow", "hidden").attr("layer-full", a), clearTimeout(b), b = setTimeout(function () {
            var b = "fixed" === g.css("position");
            f.style(a, {
                top: b ? 0 : d.scrollTop(),
                left: b ? 0 : d.scrollLeft(),
                width: d.width(),
                height: d.height()
            }), g.find(".layui-layer-min").hide()
            //var twin = _top.window[g.find('iframe')[0]['name']];
            //if(twin){
            //    if(twin.resizeTab){
            //        twin.resizeTab();
            //    }
            //}
        }, 100)
    }, f.title = function (a, b) {
        var d = c("#" + h[0] + (b || f.index)).find(h[1]);
        d.html(a)
    }, f.close = function (a) {
        //关闭时清空
        msgIndex = null;
        var b = c("#" + h[0] + a), d = b.attr("type");
        if (b[0]) {
            if (d === e.type[1] && "object" === b.attr("conType")) {
                b.children(":not(." + h[5] + ")").remove();
                for (var g = 0; 2 > g; g++) b.find(".layui-layer-wrap").unwrap().hide();

            } else {
                if (d === e.type[2]) {
                    if (_top.hasLayerManager) {
                        _top.handleSelect(null, true);
                    }
                    try {
                        var i = c("#" + h[4] + a)[0];
                        i.contentWindow.document.write(""), i.contentWindow.close(), b.find("." + h[5])[0].removeChild(i)
                    } catch (j) {
                    }
                } else {
                    if (_top.hasLayerManager) {
                        _top.hasLayerAlert = false;
                        _top.handleSelect(null, true);
                    }
                }
                b[0].innerHTML = "", b.remove()
            }

            c("#layui-layer-moves, #layui-layer-shade" + a).remove(), f.ie6 && e.reselect(), e.rescollbar(a), c(document).off("keydown", e.enter), "function" == typeof e.end[a] && e.end[a](), delete e.end[a]
        }
    }, f.callCancel = function (a) {
        var b = c("#" + h[0] + a), d = b.attr("type");
        if (b[0]) {
            b.find("." + h[7]).trigger("click");
        }
    }, f.closeAll = function (a) {
        c.each(c("." + h[0]), function () {
            var b = c(this), d = a ? b.attr("type") === a : 1;
            d && f.close(b.attr("times")), d = null
        })
    },
        f.RXLayerVersion = 1,  //用来判断当前使用的layer版本是否和模型需要的layer版本相同
        e.run = function () {
            c = jQuery, d = c(a), h.html = c("html"), f.open = function (a) {
                var b = new g(a);
                return b.index
            }
        }, "function" == typeof define ? define(function () {
        return e.run(), f
    }) : function () {
        //fixme: 兼容平台皮肤
        var skin = RX.config.selectSkin;
        if (skin === "dark" || skin === "gray") {
            skin = "skin/" + skin + "/layer_" + skin + ".css";
        } else {
            skin = "skin/default/layer.css";
        }
        e.run(), f.use(skin)
    }()

    /**
     * 计算text的宽度，大于360之后不计算
     */
    function getFontWidth(text) {
        var width = 40;
        if (text) {
            var length = text.length;
            //全中文、全英文
            if (text.length <= 15) {
                width = 260;
            } else if (text.length > 46) {
                width = 360;
            } else {
                for (var i = 0, maxLength = length; i < maxLength || width >= 360; i++) {
                    if (text.charCodeAt(i) > 255) {
                        width += 14;
                    } else {
                        width += 7;
                    }
                }
            }
        }
        return width;
    }
}(window);