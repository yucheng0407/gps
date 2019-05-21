/**
 * 不同表单的字段颜色需要又不同的标注，易于区分
 *
 * 布局要求，左右布局，class都一样。通用在有需要的情况下使用
 *
 * @param formulaObj 对象
 *          treeData：tree数据，可以是接口，接口是同步
 *          el:jquery对象，布局区域，默认为$(".form_box")
 *          treeEl：构建ztree位置
 *          dataPattern：
 *          keywords：arr
 *
 */
function FormulaEditor(formulaObj) {
    //需要的数据机构
    //构建树的数据会
    this.treeData = formulaObj.treeData;
    this.$el = formulaObj.el || $(".form_box");
    this.$treeEl = formulaObj.treeEl || this.$el.find(".tree_box");
    //数据格式，包裹着的数据
    this.dataPattern = formulaObj.dataPattern;
    this.keywords = formulaObj.keywords;
    //编辑器
    this.editor = null;
    //获取字段的显示名称
    this.getValueName = formulaObj.getValueName;
    //获取字段的code
    this.getValueCode = formulaObj.getValueCode;
    this.preFix = formulaObj.preFix;
    this.sufFix = formulaObj.sufFix;
    this.dataRex = formulaObj.dataRex;
    this.init();
}

FormulaEditor.prototype = {
    /**
     * 初始化
     */
    init: function () {
        var that = this;
        that._initLayout();
        // setTimeout(function(){
        that._initTree();
        that._initEditor();
        // },1);
    },
    /**
     * 初始化布局
     * @private
     */
    _initLayout: function () {
        //默认为form_box
        this.$el.layout({
                applyDefaultStyles: true,
                south__closable: false,
                south__spacing_open: 0,
                south__resizable: false
            }
        );
        this.$el.find(".niceScroll").height(this.$el.find(".ui-layout-west").height() - this.$el.find(".layout-header").height() - 2);
    },
    /**
     * 初始化编辑树
     * @private
     */
    _initTree: function () {
        var that = this;
        var setting = {
            data: {
                key: {
                    name: "name"
                },
                simpleData: {
                    enable: true,
                    idKey: "handleId",
                    pIdKey: "handleParentId",
                    rootPId: null
                }
            },
            view: {
                selectedMulti: false,
                showIconFont: true
            },
            callback: {
                onClick: function (e, treeId, treeNode) {
                    //标志位
                    if (!treeNode.type || treeNode.type === "field") {
                        //插入字段
                        var start = that.editor.getCursor();
                        var parentNode = treeNode.getParentNode();
                        //对于动态列表多对多，或者一对一的子节点数据，默认采用sum（可以改为average等等）或者average
                        that.editor.replaceSelection("​" + that.getValueName(treeNode) + "​");
                        var end = that.editor.getCursor();
                        that.editor.markText(start, end, {
                            className: "cm-field-value",
                            attr: {
                                "data-field": that.getValueCode(treeNode)
                            }
                        });
                    }
                }
            }
        };
        if ("function" === typeof this.treeData) {
            this.treeData = this.treeData();
        }
        if (this.treeData) {
            $.fn.zTree.init(this.$treeEl, setting, this.treeData);
        }
    },
    _initEditor: function () {
        this.editor =
            CodeMirror.fromTextArea(document.getElementById("formula"), {
                //关键字，大写会有输入提示（支持的公式）
                keywords: this.keywords,
                textWrapping: true,
                lineWrapping: true, //是否自动换行
                lineNumbers: false,//是否显示行数
                specialChars: /[\u0000-\u001f\u007f\u00ad\u200c-\u200f\u2028\u2029\ufeff]/,
                mode: "formula"
            });

        this.editor.on("change", function (editor, b) {
            CodeMirror.showHint(editor, CodeMirror.formulaHint, {
                completeSingle: false
            });
        });

        this.editor.addKeyMap({
            //删除
            Backspace: function (map) {
                var token = map.getTokenAt(map.getCursor());
                if ("field" === token.type) {//删除字段 ||  "keyword" == token.type
                    var line = map.getCursor().line;
                    map.setSelection(new CodeMirror.Pos(line, token.start), new CodeMirror.Pos(line, token.end));
                    map.replaceSelection("", null, "+delete");
                } else {
                    map.execCommand("delCharBefore");
                }
            }
        });
        this.initEditorHeight();
    },
    /**
     * 设置100%的高度
     */
    initEditorHeight: function () {
        this.editor.setSize('100%', this.$el.height() - this.$el.find(".formula-head").height() - this.$el.find(".formula-foot").height() - 2);
    },
    /**
     * 获取编辑器的值
     * @returns {{formula: string, show: string}}
     */
    getEditorValue: function () {
        var b = [],
            d = $(this.editor.display.lineDiv).find(".CodeMirror-line-content"),
            k = [], that = this;
        $.each(d, function (d, e) {
            var f = [], j = [];
            $.each($(e).children("span"), function (b, d) {
                var me = $(d),
                    e = me.attr("data-field")
                    , g = me.attr("data-entry");
                if (me.hasClass("cm-field-name"))
                    f.push(that.preFix + e + that.sufFix + g);
                else if (me.hasClass("cm-field-value"))
                    f.push(that.preFix + e + that.sufFix);
                else {
                    if (me.hasClass("cm-deprecate"))
                        return;
                    f.push(me.text())
                }
                j.push(me.text());
            });
            var g = f.join("").replace(/\u200b/g, "").replace(/\u00a0/g, " ");
            b.push(g);
            var t = j.join("").replace(/\u200b/g, "").replace(/\u00a0/g, " ");
            k.push(t);
        });
        return {
            formula: b.join("\n"),
            show: k.join("\n")
        };
    },
    /**
     * 设置编辑器的值
     * @param val
     */
    setEditorValue: function (val) {
        var c = [],
            d = [],
            that = this;
        if (val) {
            var valAry = val.split("\n");
            $.each(valAry, function (a, b) {
                //拆分
                //f = b.split(/(\$[0-9a-zA-Z\._]+#[0-9A-Fa-f]*)/g)
                var e = "",
                    f = b.split(new RegExp("(" + that.dataRex + "[0-9A-Fa-f]*)", "g")),
                    fieldRex = new RegExp("^" + that.dataRex + "$");
                $.each(f, function (b, c) {
                    //dataRex
                    ///^\$[\w]+.[\w]+#$/.test(c)
                    if (fieldRex.test(c)) {
                        var f = c.startWith("$ext") ? "扩展字段" : that.getBoLabel(c);
                        //todo
                        var g = c.replace(that.preFix, "").split(that.sufFix),
                            h = g[0]
                            , i = g[1]
                            , j = CodeMirror.Pos(a, e.length);
                        e += "​" + f + "​";
                        var k = CodeMirror.Pos(a, e.length);
                        d.push({
                            from: j,
                            to: k,
                            field: h,
                            entry: i
                        });
                    } else {
                        e += c
                    }

                }),
                    c.push(e)
            });
        }
        that.editor.setValue(c.join("\n")),
            $.each(d, function (a, c) {
                c.entry ? that._markFieldName(c.from, c.to, c.field, c.entry) : that._markFieldValue(c.from, c.to, c.field);
            });
    },
    /**
     *
     * @param start
     * @param end
     * @param key
     * @param id
     * @private
     */
    _markFieldName: function (start, end, key, id) {
        this.editor.markText(start, end, {
            className: "cm-field-name",
            attr: {
                "data-field": key,
                "data-entry": id
            }
        });
    },
    /**
     *
     * @param start
     * @param end
     * @param key
     * @private
     */
    _markFieldValue: function (start, end, key) {
        this.editor.markText(start, end, {
            className: "cm-field-value",
            attr: {
                "data-field": key
            }
        });
    },
    /**
     * 获取树节点数据对应的显示值
     * @param key
     * @returns {string}
     */
    getBoLabel: function (key) {
        var bo = this.treeData, label = "", that = this;
        $.each(bo, function (i, n) {
            //如果需要不同表单的字段渲染不同的样式，需要读取父节点的信息
            if ((that.preFix + that.getValueCode(n) + that.sufFix) === key) {
                label = that.getValueName(n);
                return false;
            }
        });
        return label;
    }
};
