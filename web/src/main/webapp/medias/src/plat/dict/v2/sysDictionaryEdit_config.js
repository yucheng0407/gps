/*********************************************** 字典表单配置 ***********************************************/
var config = {
    id: { // 主键
    },
    dictCode: { // 字典编码
        rules: {checkSave: ["notNull", "isUpperCase", "isCode"]},
        maxLength: 25
    },
    dictName: { // 字典名称
        rules: {checkSave: ["notNull"]},
        maxLength: 50
    },
    description: { // 描述
        type: "textarea",
        textareaConfig: {
            showNum: true
        },
        maxLength: 100
    },
    cjrId: { // 创建人ID
    },
    xgrId: { // 修改人ID
    },
    xgsj: { // 修改时间
        type: "date",
        dateConfig: {
            dateFmt: "yyyy-MM-dd"
        }
    },
    cjsj: { // 创建时间
        type: "date",
        dateConfig: {
            dateFmt: "yyyy-MM-dd"
        }
    },
    sfyxSt: { // 有效状态 0无效 1有效
        display: false,
        defaultValue: "VALID"
    }
};

//按钮配置
var buttonArr = [
    {
        id: "save",
        name: "保存",
        onClick: "save",
        style: "c_button"
    }
];

var buttonsJson = {
    tag: ".w_button_box",
    buttons: buttonArr
};

/*********************************************** 字典项配置 ***********************************************/
// 列配置
var dictItemColumns = [[
    {
        field: 'code',
        title: '字典项编码',
        width: 120,
        align: 'left',
        editor: {
            type: 'textbox',
            options: {required: true, missingMessage: '不可为空', validType: ['length[1,30]', 'isCodeRepeat']}
        }
    },
    {
        field: 'value',
        title: '字典项值',
        width: 120,
        align: 'center',
        editor: {
            type: 'textbox',
            options: {required: true, missingMessage: '不可为空', validType: ['length[1,50]', 'isValueRepeat']}
        }
    },
    {
        field: 'sort',
        title: '排序号',
        width: 80,
        align: 'center',
        editor: {
            type: 'numberbox',
            options: {required: true, missingMessage: '不可为空', min: 1, validType: ['length[1,10]', 'isSortRepeat']}
        }
    },
    {
        field: 'remark',
        title: '备注',
        width: 220,
        align: 'center',
        editor: {type: 'textbox', options: {validType: ['length[0,100]']}}
    },
    {
        field: 'operation',
        title: '操作',
        width: 120,
        align: 'center',
        formatter: function (value, row, index) {
            return '<a class="green-btn" style="display: none;" id="end-btn-' + row.id + '" onclick="endEditRow(\'' + row.id + '\')">完成</a> ' +
                '<a class="blue-btn" id="edit-btn-' + row.id + '" onclick="editRow(\'' + row.id + '\')">编辑</a> ' +
                '<a class="red-btn" onclick="deleteRow(\'' + row.id + '\')">删除</a>' +
                ' <a class="blue-btn" onclick="addChildRow(\'' + row.id + '\')">新增子项</a>';
        }
    }
]];

// 自定义验证配置
var dictItemValidators = {
    isCodeRepeat: {
        validator: function (value, param) {
            if (validatingRowId) {
                if (isCodeRepeat(validatingRowId, value)) {
                    return false;
                }
            }
            return true;
        },
        message: '字典项编码已存在'
    },
    isValueRepeat: {
        validator: function (value, param) {
            if (validatingRowId) {
                if (isValueRepeat(validatingRowId, value)) {
                    return false;
                }
            }
            return true;
        },
        message: '字典项值已存在'
    },
    isSortRepeat: {
        validator: function (value, param) {
            if (validatingRowId) {
                if (isSortRepeat(validatingRowId, value)) {
                    return false;
                }
            }
            return true;
        },
        message: '字典项序号已存在'
    }
};

// 搜索区配置
var dictItemConfig = {
    "query.code": {
        tagName: "字典项编码",
        canClear: true
    },
    "query.value": {
        tagName: "字典项值",
        canClear: true
    }
};

// 树列表配置
var dictItemSettings = {
    domId: 'tg',
    pIdField: 'pId',
    idField: 'id',
    treeField: 'code',
    gradeField: 'grade',
    sortField: 'sort',
    columns: dictItemColumns,
    autoQueryBox: {
        enable: true
    },
    onBeforeLoad: function () {
        if (!id) { // 如果没有id，则表示为新增字典，无需加载字典项
            return false;
        }
    },
    onBeforeSelect: function (row) { // 禁用选中
        return false;
    },
    customValidators: dictItemValidators
};