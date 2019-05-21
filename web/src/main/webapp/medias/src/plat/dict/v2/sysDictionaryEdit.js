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
            RX.button.init($("#w_butt"), buttonsJson, "xz");
        },
        //子组件声明
        components: {
            "DictItemTreeGrid": {
                widget: RX.TreeGrid,
                template: '#dictItem',
                settings: dictItemSettings,
                config: dictItemConfig,
                methods: {
                    // 在根节点新增行
                    addRootRow: function () {
                        var rowId = this.addRow();
                        $('#end-btn-' + rowId).show();
                        $('#edit-btn-' + rowId).hide();
                    }
                }
            }
        }
    });
});

// 记录正在进行验证的行id
var validatingRowId;

/**
 * 保存字典
 */
function save() {
    var itemGrid = sysDictFormVm.$refs.dictItemTreeGrid;
    if(itemGrid.endEditAll()) {
        var sysDictionary = sysDictFormVm.getData();
        var dictItemList = sysDictionary.sysDictionaryItemList;
        formatTreeGridData(dictItemList);
        $.ajax({
            type: "post",
            url: "/dictionary/saveSysDictionary",
            data: {
                sysDictionary: JSON.stringify(sysDictionary)
            },
            success: function (ar) {
                if (ar.success) {
                    RX.msg(RX.SUCCESS_SAVE);
                    RX.page.close();
                    RX.page.prev().reload();
                } else {
                    RX.alert(ar.msg);
                }
            }
        });
    }
}



/**
 * 对将要传输的字典项树列表数据进行处理
 * @param data
 * @param parent
 */
function formatTreeGridData(data, parent) {
    if(data && data.length > 0) {
        for(var i=0;i<data.length;i++) {
            var r = data[i];
            // 设置字典项所属字典code和name
            r.dictCode = sysDictFormVm.get('dictCode');
            r.dictName = sysDictFormVm.get('dictName');

            // 设置字典项所属上级code
            if(r.grade > 1) {
                r.pCode = parent.code;
            }

            // 对于新增行的临时id进行清空
            if(r.id.indexOf('ex') > -1) {
                r.id = null;
            }
            if(r.pId && r.pId.indexOf('ex') > -1) {
                r.pId = null;
            }

            formatTreeGridData(r.children, r);
        }
    }
}

/**
 * 行编辑
 * @param rowId
 */
function editRow(rowId) {
    var itemGrid = sysDictFormVm.$refs.dictItemTreeGrid;
    itemGrid.beginEdit(rowId);
    $('#end-btn-' + rowId).show();
    $('#edit-btn-' + rowId).hide();
}

/**
 * 完成行编辑
 * @param rowId
 * @returns {*|boolean}
 */
function endEditRow(rowId) {
    validatingRowId = rowId;

    var itemGrid = sysDictFormVm.$refs.dictItemTreeGrid;
    var r = itemGrid.endEdit(rowId);
    if(r) {
        validatingRowId = null;
        $('#end-btn-' + rowId).hide();
        $('#edit-btn-' + rowId).show();
    }

    return r;
}

/**
 * 删除一行
 * @param rowId
 */
function deleteRow(rowId) {
    RX.confirm(RX.CONFIRM_DELETE, function () {
        var itemGrid = sysDictFormVm.$refs.dictItemTreeGrid;
        itemGrid.delRow(rowId);
    });
}

/**
 * 新增子节点
 * @param pId 父节点id
 */
function addChildRow(pId) {
    var itemGrid = sysDictFormVm.$refs.dictItemTreeGrid;
    var rowId = itemGrid.addRow(pId, {
        pCode: itemGrid.findRow(pId).code
    });
    $('#end-btn-' + rowId).show();
    $('#edit-btn-' + rowId).hide();
}

/**
 * 验证是否字典项code重复
 * @param rowId
 * @param code
 * @returns {boolean}
 */
function isCodeRepeat(rowId, code) {
    var itemGrid = sysDictFormVm.$refs.dictItemTreeGrid;
    var sibling = itemGrid.getSibling(rowId);
    for(var i=0;i<sibling.length;i++) {
        if(sibling[i].id != rowId && sibling[i].sfyxSt != 'UNVALID' && sibling[i].code == code) {
            return true;
        }
    }

    return false;
}

/**
 * 验证是否字典项value重复
 * @param rowId
 * @param value
 * @returns {boolean}
 */
function isValueRepeat(rowId, value) {
    var itemGrid = sysDictFormVm.$refs.dictItemTreeGrid;
    var sibling = itemGrid.getSibling(rowId);
    for(var i=0;i<sibling.length;i++) {
        if(sibling[i].id != rowId && sibling[i].sfyxSt != 'UNVALID' && sibling[i].value == value) {
            return true;
        }
    }

    return false;
}

/**
 * 验证是否字典项sort重复
 * @param rowId
 * @param sort
 * @returns {boolean}
 */
function isSortRepeat(rowId, sort) {
    var itemGrid = sysDictFormVm.$refs.dictItemTreeGrid;
    var sibling = itemGrid.getSibling(rowId);
    for(var i=0;i<sibling.length;i++) {
        if(sibling[i].id != rowId && sibling[i].sfyxSt != 'UNVALID' && sibling[i].sort == sort) {
            return true;
        }
    }

    return false;
}