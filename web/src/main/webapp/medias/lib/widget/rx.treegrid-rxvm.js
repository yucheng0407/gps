(function () {

    var settings,$tg;

    // 新增字典项时，设置临时id值
    var tempId = 0, tempIdPrefix = 'ex';

    /**
     * 自动计算下一节点序号
     * @param rows
     * @returns {number}
     */
    function findNextSort(rows, sortField) {
        var max = 0;
        if(rows && rows.length > 0) {
            max = rows[0][sortField];
            for(var i=1;i<rows.length;i++) {
                if(max < rows[i][sortField]) {
                    max = rows[i][sortField];
                }
            }
        }
        return ++max;
    }

    //构建自动搜索区
    function buildAutoQueryBox(instance) {
        var $queryBox = instance.$queryBox;
        if ($queryBox) {
            instance.autoQuery = new Rxvm({
                widget: RX.AutoQuery,
                data: {
                    query: instance.get("query"),
                    openMore: instance.get("openMore")
                },
                el: $queryBox.el,
                config: instance.$options.config,
                settings: instance.$options.settings.autoQueryBox,
                methods: {
                    query: function (event) {
                        instance.query.call(instance, event);
                    },
                    clear: function (event) {
                        instance.clear.call(this, event);
                    },
                    getGridVm: function () {
                        return instance;
                    }
                },
                _afterSetValue: function () {
                    instance.set("query", this.get("query"));
                }
            });
            //是否绑定回车事件，默认绑定
            if (instance.$options.settings.autoQueryBox.canEnter) {
                RX.regEnter(function () {
                    instance.query.call(instance);
                }, $queryBox.el);
            }
        }
    }

    /**
     * 遍历行，符合条件行高亮
     * @param rows
     * @param condition
     */
    function highLightRows(rows, condition) {
        if(rows && rows.length > 0) {
            for(var i=0;i<rows.length;i++) {
                var isFit = true;
                var isEmpty = true;
                if(condition) {
                    for(var key in condition) {
                        var cv = condition[key];
                        var v = rows[i][key];
                        if(!v || (cv && v.indexOf(cv) === -1)) {
                            isFit = false;
                            break;
                        }
                        debugger;
                        if(cv){
                            isEmpty = false;
                        }
                    }
                }

                if(isEmpty || !isFit) {
                    rows[i].highLightFlag = false;
                } else {
                    rows[i].highLightFlag = true;
                    $tg.treegrid('expandTo', rows[i][settings.idField]);
                }
                $tg.treegrid('refreshRow', rows[i][settings.idField]);

                highLightRows(rows[i].children, condition);
            }
        }
    }

    RX.TreeGrid = {
        methods: {
            // 获取行数据
            findRow: function (rowId) {
                return $tg.treegrid('find', rowId);
            },
            // 新增行
            addRow: function (pId, ext) {
                var idField = settings.idField,
                    treeField = settings.treeField,
                    pIdField = settings.pIdField,
                    gradeField = settings.gradeField,
                    sortField = settings.sortField,
                    newId = tempIdPrefix + tempId++,
                    rowData = {};
                if(ext) { //额外参数
                    $.extend(rowData, ext);
                }
                if(pId) {
                    rowData[idField] = newId;
                    rowData[pIdField] = pId;
                    rowData[treeField] = '';
                    rowData['sfyxSt'] = 'VALID';
                    if(gradeField) {
                        rowData[gradeField] = parseInt(this.findRow(pId)[gradeField]) + 1;
                    }
                    if(sortField) {
                        var newSort = findNextSort(this.findRow(pId).children, sortField);
                        rowData[sortField] = newSort;
                    }
                    $tg.treegrid('append', {
                        parent: pId,
                        data: [rowData]
                    });
                } else {
                    rowData[idField] = newId;
                    rowData[treeField] = '';
                    rowData['sfyxSt'] = 'VALID';
                    if(gradeField) {
                        rowData[gradeField] = 1;
                    }
                    if(sortField) {
                        var newSort = findNextSort($tg.treegrid('getRoots'), sortField);
                        rowData[sortField] = newSort;
                    }
                    $tg.treegrid('append', {
                        data: [rowData]
                    });
                }
                this.beginEdit(newId);

                return newId;
            },
            // 删除行(逻辑删除)
            delRow: function (rowId) {
                var row = this.findRow(rowId);
                if(rowId.indexOf(tempIdPrefix) === -1) {
                    row.sfyxSt = 'UNVALID';
                    $tg.treegrid('cancelEdit', rowId)
                        .treegrid('refreshRow', rowId);
                    var children = row.children;
                    if(children && children.length > 0) {
                        for (var i = 0; i < children.length; i++) {
                            this.delRow(children[i][settings.idField]);
                        }
                    }
                } else {
                    $tg.treegrid('remove', row.id);
                }

                this.set("list", $.extend(true, [], $tg.treegrid('getRoots')));
            },
            // 开始行编辑
            beginEdit: function (rowId) {
                $tg.treegrid('beginEdit', rowId);
            },
            // 完成行编辑
            endEdit: function (rowId) {
                if ($tg.treegrid('validateRow', rowId)) {
                    $tg.treegrid('endEdit', rowId);
                    this.set("list", $.extend(true, [], $tg.treegrid('getRoots')));
                    return true;
                } else {
                    return false;
                }
            },
            // 完成所有行编辑
            endEditAll: function () {
                return this.recursionEndEditRows($tg.treegrid('getRoots'));
            },
            recursionEndEditRows: function (rows) {
                if(rows && rows.length > 0) {
                    for(var i=0;i<rows.length;i++) {
                        var r = rows[i];
                        if(!this.endEdit(r[settings.idField]) || !this.recursionEndEditRows(r.children)) {
                            return false;
                        }
                    }
                }
                return true;
            },
            // 取消行编辑
            cancelEdit: function (rowId) {
                $tg.treegrid('cancelEdit', rowId);
            },
            // 获取所有同级兄弟节点(包括自己)
            getSibling: function (rowId) {
                var row = this.findRow(rowId);
                var sibling;
                if(!row[settings.pIdField]) {
                    sibling = $tg.treegrid('getRoots');
                } else {
                    sibling = $tg.treegrid('getParent', row.id).children;
                }

                return sibling;
            },
            getTreeGridData: function () {
                return $tg.treegrid('getRoots');
            },
            /**
             * 内置事件响应：点击查询按钮
             */
            query: function (event) {
                var query = this.get('query');
                highLightRows($tg.treegrid('getRoots'), query);
                event && event.stop();
            },
            /**
             * 内置事件响应：点击清空按钮
             */
            clear: function (event) {
                //执行清空时事件
                var onClearSearch = this.getGridVm ? this.getGridVm().$options.settings.onClearSearch : this.$options.settings.onClearSearch;
                if (typeof onClearSearch === "function") {
                    var result = onClearSearch.call(this,event);
                    if (typeof result === "boolean" && !result) {
                        return false;
                    }
                }

                var config = this.$options.config || {};
                var clearPathArr = [];
                var that = this;
                for (var key in config) {
                    if (config.hasOwnProperty(key) && key.startWith("query.")) {
                        if (config[key].canClear) {
                            clearPathArr.push(key);
                        }
                    }
                }
                if (clearPathArr.length) {
                    this.empty(clearPathArr);
                }

                setTimeout(function () {
                    that.query.call(this);
                }, 100);

                event && event.stop();
            }
        },
        settings: {
            /**************************** 自定义扩展属性 ********************************/
            domId: 'tg',        // table标识属性id值
            pIdField: 'pId',    // 定义父节点id字段
            gradeField: '',     // 定义层级字段
            sortField: '',      // 定义排序字段
            customValidators:{},// 定义校验规则

            autoQueryBox: {         //自动搜索区配置，与视图中".query_box"元素对应
                enable: false,      //是否开启自动搜索区
                canClear: true,      //是否显示清空按钮（若为false则不显示；若为true且显示字段config存在canClear为true，则显示）
                cols: [80, 150, 80, 150, 80, 150],   //搜索区列宽设置
                moreCols: [80, 150, 80, 150, 80, 150, 80, 150],   //更多搜索区列宽设置
                openMore: false,   //初始状态下，是否展开更多搜索区，默认为否
                canEnter: true     //是否添加enter搜索功能，默认为true
            },

            /**************************** 控件原生属性 ********************************/
            idField: 'id',      // 定义标识树节点的主键字段(唯一标识),必需
            treeField: 'name',  // 定义树节点的字段,必需
            columns: [],        // 数据网格的列的配置对象
            rownumbers: true,   // 是否显示序号
            animate: true,      // 定义当节点展开或折叠时是否显示动画效果
            fitColumns: true,   // 自动扩大或缩小列的尺寸以适应网格的宽度并且防止水平滚动
            url: '',            // 从远程站点请求数据的URL
            method: 'post',     // 请求远程数据的方法类型
            queryParams: {},    // 当请求远程数据时,发送的额外参数
            data: [],           // 要加载的数据
            onBeforeLoad: function () { // 远程请求数据前执行，如果return false则禁止请求
            },
            pagination: false,  // 设置为 true，则在数据网格底部显示分页工具栏
            pageNumber: 1,      // 当设置了 pagination 属性时,初始化页码
            pageSize: 10,       // 当设置了 pagination 属性时,初始化页面尺寸
            onBeforeSelect: function (row) {
                var idField = settings.idField;
                // 实现再次点击同一行取消选中效果
                var selectedRow = $tg.treegrid('getSelected');
                if (selectedRow && selectedRow[idField] === row[idField]) {
                    $tg.treegrid('unselect', row[idField]);
                    return false;
                }
            },
            rowStyler: function(row) {
                // 对标志位为UNVALID的行进行隐藏
                if (row && row.sfyxSt === 'UNVALID'){
                    return 'display: none;';
                }

                // 符合条件行高亮
                if(row && row.highLightFlag) {
                    return 'background-color: #ffe48d;';
                }
            }
        },

        // 绘制后置,自动执行渲染列表
        _afterMount: function () {
            var that = this,
                queryBoxNode = that._findNodes(".query_box");
            settings = that.$options.settings;
            $tg = $('#' + settings.domId);

            if(!settings.url){
                var queryList = that.get("list");
                settings.data = queryList;
            }

            // 扩展校验规则
            $.extend($.fn.validatebox.defaults.rules, settings.customValidators);

            $tg.treegrid(settings);

            this.set("list", $.extend(true, [], $tg.treegrid('getRoots')));

            //识别并渲染搜索区
            if (queryBoxNode) {
                that.$queryBox = queryBoxNode[0];
                if (settings.autoQueryBox.enable) {
                    that.set("openMore", settings.autoQueryBox.openMore);
                    buildAutoQueryBox(that);
                }
            }
        }
    };
}).call(window);