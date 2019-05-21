//先这样命名
function FormControl($el, type) {
    this.type = type;
    var id = RX.page.param.formId, formData, formConfig;
    if (id) {
        $.ajax({
            type: "get",
            url: '/form/getFormDef?id=' + id + "&ran=" + Math.random(),
            async: false,
            success: function (ar) {
                if (ar.success) {
                    formData = ar.data;
                    formData["extendAttr"] = JSON.parse(formData["extendAttr"]);
                    var fields = formData["fields"];
                    var formExtMap = RX.page.param.formExtAttr;
                    var formExtAttr = formExtMap ? formExtMap[formData.id] : "", subTableAuth;
                    for (var i = 0, maxLength = fields.length; i < maxLength; i++) {
                        fields[i]["fieldOptions"] = JSON.parse(fields[i]["fieldOptions"]);
                        if (fields[i].columns) {
                            subTableAuth = formExtMap ? formExtMap["sub_" + fields[i]["id"]] : "";
                            $.each(fields[i].columns, function (index, childField) {
                                childField["fieldOptions"] = JSON.parse(childField["fieldOptions"]);
                                //子field权限
                                if (subTableAuth) {
                                    var subObj = subTableAuth[childField.code];
                                    if (subObj.read) {
                                        childField["fieldOptions"].read_rights = true;
                                    } else {
                                        //编辑
                                        childField["fieldOptions"].read_rights = false;
                                    }
                                    if (subObj.required) {
                                        childField["fieldOptions"].required = true;
                                    } else {
                                        childField["fieldOptions"].required = false;
                                    }
                                }

                            });
                        }
                        //主field权限s
                        if ("ck" !== type && formExtAttr) {
                            var authObj = formExtAttr[fields[i].code];
                            if (authObj) {
                                //统一，直接添加进去
                                //只读
                                if (authObj.read) {
                                    fields[i]["fieldOptions"].read_rights = true;
                                } else {
                                    //编辑
                                    fields[i]["fieldOptions"].read_rights = false;
                                }
                                if (authObj.required) {
                                    fields[i]["fieldOptions"].required = true;
                                } else {
                                    fields[i]["fieldOptions"].required = false;
                                }
                            }
                        }
                    }
                    formConfig = formData.extendAttr;
                } else {
                    RX.alert(ar.msg);
                }
            }
        });
    } else {
        formData = RX.page.param.data;
        formConfig = formData.extendAttr
    }
    this.formData = formData;
    initTpl();

    //初始化tpl
    function initTpl() {
        //字段属性，注意是有效数据
        var fields = formData["fields"];
        var formTpl = '<script type="text/template">';

        formTpl += '<div><div class="p_box">';
        //表单title
        if (formConfig && !formConfig["hide_name"]) {
            formTpl += '<div class="page_title">';
            formTpl += '<h1>' + formData["name"] + '</h1>';
            formTpl += '</div>';
        }
        //拼接table
        formTpl += '<table class="form" border="0" cellspacing="0" cellpadding="0">';
        //获取col
        formTpl += '<colgroup>' +
            '<col width="120px"/>' +
            '<col/>' +
            '<col width="120px"/>' +
            '<col/>' +
            '<col width="120px"/>' +
            '<col/>' +
            '<col  width="120px"/>' +
            '<col/>' +
            '</colgroup>';
        formTpl += '<tbody>';
        formTpl += '<tr>';
        var index = 0;
        //整体占比，默认是占一行的
        var isEnd = false;
        $.each(fields, function (i, field) {
            if (field["sfyxSt"] !== "UNVALID" && !field["fieldOptions"]["hide_rights"]) {
                if (field["fieldType"] === "table") {
                    //结束表单，开始拼接新的表单html
                    if (!isEnd) {
                        isEnd = true;
                        formTpl += '</tr></tbody>';
                        formTpl += '</table>';
                        formTpl += '</div>';
                    }
                    //创建新的table区域
                    var tagName = getTagName(field.code);
                    formTpl += '<' + tagName.toUpperCase() + ' ref="' + tagName + '" list="{{' + field.code + '}}">';
                    formTpl += '<div class="p_box">  ' +
                        //标题
                        '<div class="page_title"><h1>' + field.label + '</h1>' +
                        //按钮区域
                        '    <ul class="action_button to_right">';
                    //遍历buttons，目前内置的按钮都是查看状态不能使用的
                    if (type !== "ck") {
                        field.fieldOptions.buttons && $.each(field.fieldOptions.buttons, function (index, button) {
                            //标识确认
                            if (button.type !== "del") {
                                formTpl += ' <li><a on-click="' + button.type + '()"><i class="iconfont">{{{"' + button.icon + '"}}}</i>' + button.label + '</a></li>';
                            }
                        });
                    }

                    formTpl += '   </ul>' +
                        '</div>';
                    //遍历columns，不能是选择数据回填的，因为没有适配的格式
                    formTpl += initChildTable(field.columns, type, field.code);
                    formTpl += '</div>' +
                        '</' + tagName.toUpperCase() + '>';

                } else {
                    if (isEnd) {
                        //添加了子table，下面又存在表单字段
                        //添加table
                        formTpl += '<div class="p_box">';
                        //拼接table
                        formTpl += '<table class="form" border="0" cellspacing="0" cellpadding="0">';
                        //获取col
                        formTpl += '<colgroup>' +
                            '<col width="120px"/>' +
                            '<col/>' +
                            '<col width="120px"/>' +
                            '<col/>' +
                            '<col width="120px"/>' +
                            '<col/>' +
                            '<col  width="120px"/>' +
                            '<col/>' +
                            '</colgroup>';
                        formTpl += '<tbody>';
                        formTpl += '<tr>';
                        index = 0;
                        isEnd = false;
                    }
                    var fieldOptions = field["fieldOptions"];
                    var fieldOccupy = parseInt(fieldOptions["grids_to_occupy"] || 4);
                    var fieldColspan = 2 * fieldOccupy - 1;
                    if ((index + fieldColspan + 1) > 8) {
                        formTpl += '</tr><tr>';
                        index = fieldColspan + 1;
                    } else {
                        index += fieldColspan + 1;
                    }
                    //字段在当前环节的相关信息，获取字段的必填信息
                    formTpl += '<th>' + (fieldOptions["required"] ? '<b>*</b>' : '') + field["label"] + (fieldOptions["units"] ? "(" + fieldOptions["units"] + ")" : "") + '</th>';
                    if (type === "ck") {
                        formTpl += '<td colspan="' + fieldColspan + '">' + fieldControl.getViewHtml(field["fieldType"], field["code"], field, field["code"]) + '</td>';
                    } else {
                        formTpl += '<td colspan="' + fieldColspan + '">' + fieldControl.getEditHtml(field["fieldType"], field["code"], field) + '</td>';
                    }
                }
            }
        });
        if (!isEnd) {
            formTpl += '</tr></tbody>';
            formTpl += '</table>';
            formTpl += '</div>';
        }
        formTpl += '</div>';
        formTpl += '</script>';
        $el.append(formTpl);
    }
}

function getTagName(fieldCode) {
    //去除下划线等tag不允许的字符
    return fieldCode.replace(/_/g, "");
}

/**
 * 获取配置项
 *  配置包括主table的配置，以及子表单的配置
 * @returns {{}}
 */
FormControl.prototype.getConfig = function () {
    if (!this.tableConfig) {
        this._handleConfig();
    }
    return this.tableConfig["main"];
};

FormControl.prototype.getComponentsConfig = function () {
    if (!this.tableConfig) {
        this._handleConfig();
    }
    var childComponents = {};
    var componentObj = this.tableConfig["components"];
    for (var code in componentObj) {
        var compontConfig = componentObj[code];
        var childConfig = {
            widget: RX.Grid,
            config: compontConfig.config
        };
        var methods = {};
        compontConfig.buttons && $.each(compontConfig.buttons, function (index, button) {
            if (button.type !== "del") {
                methods[button.type] = function (type, refs) {
                    var func;
                    //删除
                    // if (type === "del") {
                    //     func = function () {
                    //         var keyData = this.getSelectedPathObject();
                    //         if (keyData.length > 0) {
                    //             RX.confirm(RX.CONFIRM_DELETE, function (index) {
                    //                 $.each(keyData, function (i, t) {
                    //                     textVm.$refs[refs].set(t.key + ".sfyxSt", "UNVALID");
                    //                 })
                    //             });
                    //         } else {
                    //             RX.msg(RX.SELECT_DELETE);
                    //         }
                    //     }
                    // } else
                    if (type === "add") {
                        func = function () {
                            this.append("list", {sfyxSt: "VALID"});
                        }
                    }
                    return func;
                }(button.type, code);
            }
        });
        methods["deleteProject"] = function (keypath) {
            this.set(keypath + ".sfyxSt", "UNVALID");
        };
        childConfig["methods"] = methods;
        childComponents[code.toUpperCase()] = childConfig;
    }
    return childComponents;
};

FormControl.prototype._handleConfig = function () {
    var that = this;
    var mainConfig = {
        id: {
            display: false
        }
    }, fields = this.formData["fields"], formConfig = this.formData.extendAttr, type = this.type;
    var config = {}, componentsConfig = {};
    //解析config设置
    fields && $.each(fields, function (i, field) {
        if (field["sfyxSt"] !== "UNVALID") {
            //插入个性状态控制，已经处理之后的代码
            if (field["fieldType"] === "table") {
                //子表单配置
                componentsConfig[getTagName(field["code"])] = that._getChildConfig(field);
            } else {
                $.extend(mainConfig, fieldControl.getConfig(field["fieldType"], field["code"], field["fieldOptions"], formConfig, type));
            }
        }
    });
    config["main"] = mainConfig;
    config["components"] = componentsConfig;
    this.tableConfig = config;
};

/**
 * 获取子表单的config
 * @param parField
 * @private
 */
FormControl.prototype._getChildConfig = function (parField) {
    var mainConfig = {}, fields = parField.columns, formConfig = this.formData.extendAttr, type = this.type,
        pre = getTagName(parField["code"]);
    mainConfig["list.*id"] = {display: false};
    fields && $.each(fields, function (i, field) {
        if (field["sfyxSt"] !== "UNVALID") {
            $.extend(mainConfig, fieldControl.getConfig(field["fieldType"], "list.*." + field["code"], field["fieldOptions"], formConfig, type));
        }
    });
    return {
        config: mainConfig,
        buttons: parField.fieldOptions.buttons
    };
};

function initChildTable(columns, type, parentCode) {
    var childHtml = '<table cellpadding="0" cellspacing="0" border="0" class="list"><thead><tr>';
    //拼接thead
    //序号
    childHtml += '<th style="width:45px">序号</th>';
    var i = 1;
    var tbodyHtml = '<tr class="rx-grid-tr"><td align="center" class="orderTag"></td>';
    columns && $.each(columns, function (index, field) {
        if (field.sfyxSt !== "UNVALID") {
            i++;
            var fieldOptions = field["fieldOptions"];
            childHtml += '<th>' + (fieldOptions["required"] ? '<b>*</b>' : '') + field["label"] + (fieldOptions["units"] ? "(" + fieldOptions["units"] + ")" : "") + '</th>';
            //主体html
            if (type === "ck") {
                tbodyHtml += '<td>' + fieldControl.getViewHtml(field["fieldType"], field["code"], field, parentCode + field["code"]) + '</td>';
            } else {
                tbodyHtml += '<td>' + fieldControl.getEditHtml(field["fieldType"], field["code"], field) + '</td>';
            }
        }
    });
    if (type !== "ck") {
        childHtml += '<th>操作</th>';
        tbodyHtml += '  <td style="text-align:center"><a href="javascript:void(0);" class="active_2"\n' +
            '                                                             on-click="deleteProject($keypath)">删除</a>\n' +
            '                            </td>';
        i++;
    }
    tbodyHtml += '</tr>';
    childHtml += '</tr></thead>';
    childHtml += '<tbody>' +
        '{{#if list.length>0}}\n' +
        '{{#each list :index}}\n' +
        '{{#if sfyxSt !== "UNVALID"}}';
    //拼接column
    childHtml += tbodyHtml;
    childHtml += '{{/if}}' +
        '{{/each}}' +
        '{{else}}' +
        '<tr><td align="center" colspan="' + i + '" class="no_data">无数据</td></tr>' +
        '{{/if}}' +
        '</tbody>';
    childHtml += '</table>';
    return childHtml;
}
