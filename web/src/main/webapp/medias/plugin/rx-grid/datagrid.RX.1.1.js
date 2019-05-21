// 替换title中的特殊符号
function replaceTitle(s) {
    if (s) {
        s = s.toString().replace(/"/g, '&quot;');
    }
    return s;
}

// 替换html中的特殊符号
function replaceSymbols(s) {
    if (s) {
        s = s.toString().replace(/</g, "&lt;");
        s = s.toString().replace(/>/g, "&gt;");
    }
    return s;
}

(function ($) {
    //缓冲池类
    var TempPagePool = function () {
        return {
            renderSuccess: true,
            lastPageJson: {firstRender: true, rows: []},
            curIndex: 0,
            pages: [],
            tempPageSize: 10,
            queryNo: 0,
            total: -1,
            startPage: 0,
            endPage: 0,
            freshTempPool: function () {
                this.renderSuccess = true;
                this.lastPageJson = {firstRender: true, rows: []};
                this.curIndex = 0;
                this.pages = [];
                this.queryNo = 0;
                this.total = -1;
                this.startPage = 0;
                this.endPage = 0;
            },
            addPage: function (pageNo, pageData, hasNext) {
                if (hasNext == null) {
                    hasNext = true;
                }
                var pages = this.pages;
                if (pages.length == 0) {
                    pages.push({pageNo: pageNo, pageData: pageData, hasNext: hasNext});
                } else {
                    var addNo = -1;
                    for (var i = 0; i < pages.length; i++) {
                        if (pages[i].pageNo == pageNo) {
                            return false;
                        } else if (pages[i].pageNo > pageNo) {
                            addNo = i;
                            break;
                        }
                    }
                    if (addNo == -1) {
                        addNo = pages.length;
                    }
                    pages.splice(addNo, 0, {pageNo: pageNo, pageData: pageData, hasNext: hasNext});
                    if (pages.length > this.tempPageSize) {
                        if (addNo < this.tempPageSize / 2) {
                            pages.pop();
                        } else {
                            pages.shift();
                        }
                    }
                }
                return true;
            },
            setTotal: function (total) {
                this.total = total;
            },
            getPage: function (pageNo) {
                pageNo = parseInt(pageNo);
                var pages = this.pages;
                var total = this.total;
                var result =
                    {
                        inTempPool: false,
                        needSearch: true,
                        startPage: pageNo - 1,
                        endPage: pageNo + 1,
                        queryPage: pageNo,
                        queryData: [],
                        hasNext: true,
                        total: total
                    };
                if (pageNo == 1) {
                    result.startPage = null;
                }
                if (pages.length > 0) {
                    if (pageNo == pages[pages.length - 1].pageNo) {
                        if (!pages[pages.length - 1].hasNext) {
                            result.endPage = null;
                        }
                    }
                    for (var i = 0; i < pages.length; i++) {
                        if (pages[i].pageNo == pageNo) {
                            var page = pages[i];
                            result.inTempPool = true;
                            result.queryData = page.pageData;
                            result.hasNext = page.hasNext;
                            if (i == pages.length - 1) {
                                if (!pages[i].hasNext) {
                                    result.endPage = null;
                                }
                            } else if (pages[i + 1].pageNo == pageNo + 1) {
                                result.endPage = null;
                            }
                            break;
                        } else if (pages[i].pageNo == pageNo - 1) {
                            result.startPage = null;
                        } else if (pages[i].pageNo == pageNo + 1) {
                            result.endPage = null;
                            break;
                        }
                    }
                }
                if (result.inTempPool && result.startPage == null && result.endPage == null) {
                    result.needSearch = false;
                } else {
                    result.needSearch = true;
                    if (result.inTempPool) {
                        if (result.startPage == null) {
                            result.startPage = result.endPage;
                        }
                        if (result.endPage == null) {
                            result.endPage = result.startPage;
                        }
                    } else {
                        if (result.startPage == null) {
                            result.startPage = pageNo;
                        }
                        if (result.endPage == null) {
                            result.endPage = pageNo;
                        }
                    }
                }
                this.queryNo = pageNo;
                this.startPage = result.startPage;
                this.endPage = result.endPage;
                if (this.total < 0) {
                    result.needGetTotal = true;
                }
                return result;
            }
        }
    }

    var pools = {};

    var renderSelObject = function (o, options) {
        var $panel = $(o[0]);
        var arrDataRows = [];
        var oDataRow = {};
        var options = $panel.data("datagrid").options;
        // if (options.selObject.length > 1 && !options.mulchose) {
        //     alert("该列表设置为单选列表,不可选中多行数据!");
        //     return null;
        // }

        $("tbody tr", $panel).each(function (index) {
            var $tr = $(this);
            var tId = $tr.data("rowData");
            if (tId) {
                for (key in options.selObject) {
                    if (!options.selObject[key]) {
                        continue;
                    }
                    if (tId[key]) {
                        if (typeof options.selObject[key] == "object" && $.inArray(tId[key].toString(), options.selObject[key]) > -1) {
                            $tr.addClass("selectRow");
                            if ($("td.grid-opt-chk input", $tr).size())
                                $("td.grid-opt-chk input", $tr).prop("checked", true);
                            oDataRow = $(this).data("rowData");
                            arrDataRows.push(oDataRow);
                        } else if (typeof options.selObject[key] == "string" && ("," + options.selObject[key] + ",").indexOf("," + tId[key].toString() + ",") > -1) {
                            $tr.addClass("selectRow");
                            if ($("td.grid-opt-chk input", $tr).size())
                                $("td.grid-opt-chk input", $tr).prop("checked", true);
                            oDataRow = $(this).data("rowData");
                            arrDataRows.push(oDataRow);
                        }
                    }
                }
            }
        });

        return arrDataRows;
    }

    var setAllChooseSelect = function (panel, curNum) {
        var selectedRows = panel.data("selectedRowsInfo");
        //选中数据行选中状态适配
        $(selectedRows).each(function () {
            var oSelectedRowInfo = $(this).get(0);
            if (oSelectedRowInfo.pageNum == curNum) {
                $(".list tbody tr").each(function () {
                    var $tr = $(this);
                    var tempIndex = $tr.data("index");
                    var rtn = $.inArray(tempIndex, oSelectedRowInfo.selectedRowsIds);
                    if (rtn != "-1") {
                        $tr.addClass("selectRow");
                        if ($("td.grid-opt-chk input", $tr).size())
                            $("td.grid-opt-chk input", $tr).prop("checked", true);
                    }
                })
            }
        })
        //全选选中状态适配
        var selAll = true;
        $(".list tbody tr").each(function () {
            if (!$(this).hasClass("selectRow")) {
                selAll = false;
                return false;
            }
        })
        if (selAll) {
            $(".list thead .chkAll").prop("checked", true);
        }
    }
    var getZdDict = function (dictCode, pcode) {
        return RX.getDictByCode(dictCode, pcode);
    }
    var getData = function (url, postPage, postData, o) {
        if (url == '') {
            return null;
        }
        var $panel = o;
        var json = null;
        var timeoutId;
        if (postPage != null) //正常请求表体数据
        {
            /*var dataSource = (url.split("?")[0] == undefined) ? "" : url.split("?")[0];
             var pram = (url.split("?")[1] == undefined) ? "" : url.split("?")[1];
             var strPagenate = "startPage=" + postPage.startPage + "&" + "limit=" + postPage.limit+"&oldPage="+postPage.oldPage+"&onePage="+postPage.onePage + "&totalNum=" + (postPage.totalNum || 0);
             if (pram != ""){
             pram = pram + "&" + strPagenate;
             }else{
             pram = strPagenate;
             }*/
            if (url.indexOf("?") > 0) {
                dataSource = url + "&random=" + Math.random();
            } else {
                dataSource = url + "?random=" + Math.random();
            }

            var pram = {};
            pram.startPage = postPage.startPage;
            pram.limit = postPage.limit;
            pram.oldPage = postPage.oldPage;
            pram.onePage = postPage.onePage;
            pram.totalNum = postPage.totalNum;
            if (typeof postData == "string") {
                pram.params = postData;
            } else if (typeof postData == "object") {
                pram.params = JSON.stringify(postData);
            }
        }
        else  //请求动态表头数据
        {
            var dataSource = url + "?random=" + Math.random();
            var pram = {};
        }
        try {
            $.ajax({
                url: dataSource,
                data: pram,
                async: false,
                beforeSend: function (xhr) {
                },
                success: function (data) {
                    if (typeof data == "string") {
                        json = RX.parseJson(data);
                    } else {
                        var nullData = {pageCurrent: 0, pageSize: 10, hasNext: false, rows: [], errmsg: ""}
                        if (data.hasOwnProperty("data") && data.hasOwnProperty("success")) {
                            if (data.success) {
                                json = data.data;
                            } else {
                                if (typeof data.msg != "undefined" && data.msg != null && data.msg != "") {
                                    nullData.errmsg = data.msg;
                                }
                                if (nullData.errmsg == "") {
                                    nullData.errmsg = "请求数据出错";
                                }
                                json = nullData;
                            }
                        } else {
                            json = nullData;
                        }

                    }
                },
                error: function () {
                    var nullData = {pageCurrent: 0, pageSize: 10, hasNext: false, rows: [], errmsg: ""}
                    nullData.errmsg = "请求数据出错";
                    json = nullData;
                },
                type: 'POST'
            });
        }
        catch (ex) {
            json = null;
        }
        return json;
    };

    var getAsyncData = function (url, postPage, postData, o, options, parm, result) {
        if (url == '') {
            return null;
        }
        var $panel = o;
        var json = null;
        var timeoutId;
        var pram = {};
        if (url.indexOf("?") > 0) {
            dataSource = url + "&random=" + Math.random();
        } else {
            dataSource = url + "?random=" + Math.random();
        }
        if (postPage != null) //正常请求表体数据
        {

            pram.startPage = postPage.startPage;
            pram.limit = postPage.limit;
            pram.oldPage = postPage.oldPage;
            pram.onePage = postPage.onePage;
            pram.totalNum = postPage.totalNum;
            // if(postPage.needGetTotal){
            pram.needGetTotal = 1;
            // }
            //增加排序的字段
            pram.ascIds = postPage.ascIds || "";
            pram.descIds = postPage.descIds || "";

        }
        if (typeof postData == "string") {
            pram.params = postData;
        } else if (typeof postData == "object") {
            pram.params = JSON.stringify(postData);
        }
        $.ajax({
            url: dataSource,
            data: pram,
            //async: false,
            beforeSend: function (xhr) {
            },
            success: function (data) {
//                    $(".zbcDiv").hide("fast");
                if (typeof data == "string") {
                    json = RX.parseJson(data);
                } else {
                    var nullData = {pageCurrent: 0, pageSize: 10, hasNext: false, rows: [], errmsg: ""}
                    if (data.hasOwnProperty("data") && data.hasOwnProperty("success")) {
                        if (data.success) {
                            json = data.data;
                            if (json) {
                                if (json.rows == null) {
                                    if (options.pagination) {
                                        json.rows = [];
                                    } else {
                                        var total = json.length;
                                        json.rows = json;
                                        json.total = total;
                                    }
                                }
                                var newData = json;
                                if (options.pagination) {
                                    if (json.total) {
                                        pools[options.ModelName].setTotal(json.total);
                                    } else {
                                        json.total = (result.total == -1 ? 0 : result.total);
                                    }
                                    var hasDataJson = false;
                                    for (var i = 0; i <= result.endPage - result.startPage; i++) {
                                        var tempRows = newData.rows.slice(i * options.limit, (i + 1) * options.limit);
                                        var hasNext = true;
                                        var total = newData.total;
                                        if ((result.endPage - result.startPage) == i) {
                                            hasNext = newData.hasNext;
                                        } else if (tempRows.length < options.limit) {
                                            hasNext = false;
                                        } else if (tempRows.length == options.limit && !newData.rows[(i + 1) * options.limit]) {
                                            hasNext = false;
                                        }
                                        pools[options.ModelName].addPage(result.startPage + i, tempRows, hasNext);

                                        //Zp.20180911.刷新时出现当前页无数据的情况，取最后一页有数据的页面为查询页
                                        if(!hasDataJson && tempRows.length > 0 && !hasNext && result.queryPage > result.startPage + i){
                                            json = {
                                                rows: tempRows,
                                                pageCurrent: result.startPage + i,
                                                pageSize: options.limit,
                                                hasNext: hasNext,
                                                total: total
                                            };
                                            pools[options.ModelName].lastPageJson = json;
                                            var gridVm = Rxvm.getViewModel(options.ModelName);
                                            if(gridVm){
                                                gridVm.set("pageNo", json.pageCurrent);
                                            }
                                            hasDataJson = true;
                                        }

                                        if (!hasDataJson && result.queryPage == result.startPage + i) {
                                            json = {
                                                rows: tempRows,
                                                pageCurrent: result.queryPage,
                                                pageSize: options.limit,
                                                hasNext: hasNext,
                                                total: total
                                            };
                                            pools[options.ModelName].lastPageJson = json;
                                            hasDataJson = true;
                                        }
                                        // if (!hasNext && (result.endPage - result.startPage) != i) {
                                        //     break;
                                        // }
                                    }
                                }
                            }
                            if (options.pagination) {
                                pools[options.ModelName].renderSuccess = true;
                                if (!result.inTempPool) {
                                    var $table = _buildAsyncDataGrid(o, options, pram, json);
                                    var $tableWrap = $("<div class='outTwrap'></div>").html($table);
                                    $panel.html($tableWrap);  //调用初始化函数，生成table主体
                                    //处理已选数据
                                    if (options.allPageChose && result) {
                                        setAllChooseSelect($panel, result.queryPage);
                                    }
                                    if (options.columnResize) {//调用列宽拖动的函数
                                        $table.colResizable({minWidth: options.columnMinWidth});
                                    }
                                    //table渲染后执行的方法
                                    if (typeof(options.afterLoad) === "function") {
                                        options.afterLoad.call(o, $table.data("rows"));
                                    }
                                }
                            } else {
                                var $table = _buildAsyncDataGrid(o, options, pram, json);
                                var $tableWrap = $("<div class='outTwrap'></div>").html($table);
                                $panel.html($tableWrap);  //调用初始化函数，生成table主体
                                //处理已选数据
                                if (options.allPageChose && result) {
                                    setAllChooseSelect($panel, result.queryPage);
                                }
                                if (options.columnResize) {//调用列宽拖动的函数
                                    $table.colResizable({minWidth: options.columnMinWidth});
                                }
                                //table渲染后执行的方法
                                if (typeof(options.afterLoad) === "function") {
                                    options.afterLoad.call(o, $table.data("rows"));
                                }
                            }
                            options.total = json.total;
                            if (options.pagination) {
                                if (options.fastPagenate) {
                                    _setFastPagenate($panel, options);
                                    _setFastPagenate(o, options);
                                } else {
                                    _setPagenate($panel, options);
                                }
                            }
                            renderSelObject(o, options);
                        } else {
                            if (typeof data.msg != "undefined" && data.msg != null && data.msg != "") {
                                nullData.errmsg = data.msg;
                            }
                            if (nullData.errmsg == "") {
                                nullData.errmsg = "请求数据出错";
                            }
                            json = nullData;
                            var $table = _buildAsyncDataGrid(o, options, pram, json);
                            var $tableWrap = $("<div class='outTwrap'></div>").html($table);
                            $panel.html($tableWrap);  //调用初始化函数，生成table主体
                            //table渲染后执行的方法
                            if (typeof(options.afterLoad) === "function") {
                                options.afterLoad.call(o);
                            }
                        }
                    } else {
                        json = nullData;
                    }
                }
            },
            error: function () {
                var nullData = {pageCurrent: 0, pageSize: 10, hasNext: false, rows: [], errmsg: ""}
                nullData.errmsg = "请求数据出错";
                json = nullData;
//                    $(".zbcDiv").hide("fast");
                var $table = _buildAsyncDataGrid(o, options, pram, json);
                var $tableWrap = $("<div class='outTwrap'></div>").html($table);
                $panel.html($tableWrap);  //调用初始化函数，生成table主体
                //table渲染后执行的方法
                if (typeof(options.afterLoad) === "function") {
                    options.afterLoad.call(o);
                }
            },
            type: 'POST'
        });
        return json;
    };


    var getLocalData = function (data, o) {

        var $panel = o;
        var jsonData = {pageCurrent: 1, pageSize: data.length, hasNext: false, rows: data};

        return jsonData;
    };


    //生成table主体
    //var tempPageData={pageNo:0,pageData:[]};//用于存放零时页数据
    var _buildDataGrid = function (o, options, pram, needSetting) {
        var $panel = o;
        var headUrl = options.columns;
        var bodyUrl = options.url;
        var localData = options.localData;
        var autoColumn = options.autoColumn;
        var local;
        var columns;
        var json;
        var errmsg;
        var colLength;
        var $table, $thead, $tbody;
        //用于拼接头部th,表体td和定义列宽col的字符串;
        var sTb, sTh, sTd, sHdCol, sTemp;
        var ordNum;
        var rows;
        var total;
        var arrRstr = [];// 用于存放表体结构字符串的对象数组;
        if (options.pagination == false) {
            options.fastPagenate = false;
        }
//        if($(".zbcDiv").length == 0){
//            $(document.body).append("<div class='zbcDiv'></div>")
//        }
        //搜索验证不通过，需要先设置搜索条件
        if (needSetting) {
            sTb = "<table cellpadding='0' cellspacing='0' border='0'  class='list'>" +
                "<tbody><tr><td align='center' class='no_data'>" + "请先设置搜索条件" +
                "</td></tr></tbody>" +
                "</table>";
            $table = $(sTb);
            $panel.data("getedData", false);
            total = 0;
            $panel.data("datagrid").options.total = total;
            return $table;
        }

        //初始化
        sTb = "";
        sTd = "";
        sTemp = "";
        if(!options.pagination){
            o.data("curOrdNum", 1);
        }else{
            o.data("curOrdNum", ((options.pageNo || 1) - 1) * options.limit + 1);
        }
        ordNum = o.data("curOrdNum");
        //add dynamic tableHead
        if (typeof(headUrl) === "string") {
            columns = getData(headUrl, null, options.postData, o);
            if ($.isArray(columns)) {
                $.each(columns, function (i, n) {
                    if (typeof n['renderer'] == "string") {
                        try {
                            n['renderer'] = eval("(" + n['renderer'] + ")");
                        } catch (e) {
                        }
                    }
                });
                //add by zl 2013-08-13
                options.columns = columns;
                //end add
            } else {
                $table = $("<table cellpadding='0' cellspacing='0' border='0' class='list'>" +
                    "<tbody><tr class='errortr'><td align='center' style='font-weight:bold;color:red'>" +
                    "动态列模型请求有误</td>" +
                    "</tr></tbody></table>");
                $panel.data("getedData", false);
                return $table;
            }
        } else {
            columns = headUrl;

        }
        //end add
        if (localData != null && localData.length > 0 && typeof(localData) === "object") {
            local = true;
            json = getLocalData(localData);
        }
        var result;
        //add dynamic tableHead
        if (!local && typeof(bodyUrl) === "string") {
            if (options.pagination) {//新型分页 不传总数，
                result = pools[options.ModelName].getPage(pram.startPage);
                var jsonData = {rows: [], pageCurrent: result.queryPage, pageSize: options.limit, hasNext: true};
                if (result.inTempPool) {
                    jsonData.rows = result.queryData;
                    jsonData.hasNext = result.hasNext;
                    json = jsonData;
                    pools[options.ModelName].lastPageJson = json;
                } else if (result.needSearch && result.hasNext) {
                    if (options.fastPagenate) {
                        result.needGetTotal = false;
                    }
                    var newParma = {
                        startPage: result.startPage,
                        oldPage: result.endPage,
                        limit: options.limit,
                        ascIds: options.ascIds,
                        descIds: options.descIds
                    };
                    pools[options.ModelName].renderSuccess = false;
                    if (!result.inTempPool) {
                        json = pools[options.ModelName].lastPageJson;
//                        $(".zbcDiv").show("fast");
                    }
                    var newData = getAsyncData(bodyUrl, newParma, options.postData, o, options, pram, result);
                } else {
                    json = {rows: []};
                }
            } else {//原始的分页模式 带total总数
                var newData = getAsyncData(bodyUrl, null, options.postData, o, options, pram, result);
                json = {rows: []};
            }
        } else {
            //json = bodyUrl;
        }
        //end add
        options.startPage = pram.startPage;
        if (json != null) {
            //存储用于分页的总条数
            var total = json.total;
            var hasNext = json.hasNext;
            var pageCurrent = json.pageCurrent;
            var pageSize = json.pageSize;
            $panel.data("datagrid").options.total = total;
            $panel.data("datagrid").options.hasNext = hasNext;
            $panel.data("datagrid").options.pageCurrent = pageCurrent;
            $panel.data("datagrid").options.pageSize = pageSize;
            rows = json.rows;
            errmsg = json.errmsg;


            /**
             * 自动生成表头
             */

            if (autoColumn) {
                var r1data = rows[0];
                columns = [];
                var yb = 0;
                for (var key in r1data) {
                    yb++;
                    var col = {title: "", id: "", width: 100, align: "center", renderer: "String"};
                    col.title = key;
                    col.id = key;
                    columns.push(col);
                    //暂定只显示5列
                    if (yb == 5) {
                        break;
                    }
                }

            }

            var sThFilter = "";//表头过滤

            /**
             * 生成table结构优化
             * @type {*|HTMLElement}
             */

            //生成列宽标签，表头结构，表体结构拼接字符串
            //初始化sTh，sHdCol
            if (options.checkbox && options.stretch) {
                if (options.mulchose)   //多选
                {
                    if (options.showchkAll) {
                        sTh = "<tr><th></th><th class='grid-opt-chkAll'><input type='checkbox' class='chkAll'/></th>";
                        sThFilter = "<tr><th></th><th></th>"
                    } else {
                        sTh = "<tr><th></th><th class='grid-opt-chkAll'></th>";
                        sThFilter = "<tr><th></th><th></th>"
                    }

                }
                else                    //单选
                {
                    sTh = "<tr><th></th><th></th>";
                    sThFilter = "<tr><th></th><th></th>"
                }
                sHdCol = "<col width='30px'/><col width='25px'/>";
                colLength = 2;
            }
            else if (options.checkbox) {
                if (options.mulchose)           //多选
                {
                    if (options.showchkAll) {
                        sTh = "<tr><th class='grid-opt-chkAll'><input type='checkbox'  class='chkAll'/></th>";
                        sThFilter = "<tr><th></th>"
                    } else {
                        sTh = "<tr><th class='grid-opt-chkAll'></th>";
                        sThFilter = "<tr><th></th>"
                    }


                }
                else                         //单选
                {
                    sTh = "<tr><th></th>";
                    sThFilter = "<tr><th></th>"
                }
                sHdCol = "<col width='30px'/>";
                colLength = 1;
            }
            else if (options.stretch) {
                sTh = "<tr><th></th>";
                sThFilter = "<tr><th></th>";
                sHdCol = "<col width='25px'/>";
                colLength = 1;
            }
            else {
                sTh = "<tr>";
                sThFilter = "<tr>"
                sHdCol = "";
                colLength = 0;
            }

            if (options.ordinal) {
                sTh += "<th>序号</th>";
                sThFilter += "<th></th>"
                sHdCol += "<col width='50px'/>";
                colLength++;
            }
            if (options.fastPagenate) {
                if (!pools[options.ModelName].renderSuccess) {
                    $('ul.rx-pagenate', o).find('li.rx-next').addClass("disabled");
                    $('ul.rx-pagenate', o).find('li.rx-prev').addClass("disabled");
                    $('span.page-input', o).children().prop("disabled", true);
                    //$('span.grid-load').show("fast");
                } else {
                    $('span.page-input', o).children().prop("disabled", false);
                    //$('span.grid-load').hide("fast");
                    if (options.hasNext) {
                        $('ul.rx-pagenate', o).find('li.rx-next').removeClass("disabled");
                    } else {
                        $('ul.rx-pagenate', o).find('li.rx-next').addClass("disabled");
                    }
                    if (options.pageCurrent <= 1) {
                        $('ul.rx-pagenate', o).find('li.rx-prev').addClass("disabled");
                    } else {
                        $('ul.rx-pagenate', o).find('li.rx-prev').removeClass("disabled");
                    }
                }
            }
            //开始拼接表体结构字符串
            for (var i = 0; i < columns.length; i++) {
                //拼接表头
                var oColCell = columns[i]; //列对象
                //生成col和thead中的th
                var sColLen = ""; //列宽长度
                if (oColCell.width != undefined)
                    sColLen = oColCell.width;
                sHdCol += "<col width='" + sColLen + "px'/>";
                /* 列头加操作按钮
                 sTh += "<th>" + oColCell.title + "<button></button></th>";
                 */
                sTh += "<th>";
                if (oColCell.canOrder) {
                    sTh += "<div class='sorting_desc_box' dataId='" + oColCell.id + "'><i class='iconfont sorting_desc_top' " + (oColCell.orderByType === "asc" ? "style='color:#888;' " : "") + " title='升序'>&#xe61f;</i>" +
                        "<i class='iconfont sorting_desc_bottom' title='降序' " + (oColCell.orderByType === "desc" ? "style='color:#888;'" : "") + ">&#xe8ac;</i>" + oColCell.title + "</div></th>";
                } else {
                    sTh += "<div class='sorting_desc_box'>" + oColCell.title + "</div></th>";
                }
                var isFilter = oColCell.isFilter == null ? true : false;
                if (isFilter) {
                    sThFilter += "<th><input type='text' class='txt' style='width:" + sColLen + "px' name='" + oColCell.id + "'/></th>";
                } else {
                    sThFilter += "<th></th>";
                }
                if (Object.prototype.toString.call(rows) === '[object Array]' && rows.length > 0)  //判断是否是数组
                {
                    //处理数据
                    for (var j = 0; j < rows.length; j++) {
                        var key = oColCell.id;
                        var oRowData = rows[j];
                        if (arrRstr[j] === undefined) {
                            if (options.checkbox && options.stretch) {
                                if (options.dischose) {
                                    /*
                                     * 根据传入的cids将其中id对应的行加上不可选的样式
                                     * */
                                    //var cids = options.cids;
                                    var dobj = options.disObject;
                                    var dkey = "";
                                    for (var d in dobj) {
                                        dkey = d;
                                        break;
                                    }
                                    var sid = oRowData[dkey.toLocaleLowerCase()] || oRowData[dkey.toLocaleUpperCase()];
                                    var cids = dobj[dkey];
                                    if (!cids) {
                                        arrRstr[j] = "<tr class='trhover'><td class='grid-opt-stretch'>+</td><td class='grid-opt-chk' style='text-align: left'><input type='checkbox' /></td>";
                                    } else {
                                        if (typeof cids == "object" && $.inArray(sid, cids) >= 0) {
                                            arrRstr[j] = "<tr class='trhover disabledRow'><td class='grid-opt-stretch'>+</td><td class='grid-opt-chk' style='text-align: left'><input type='checkbox' disabled class='disabledRow'/></td>";
                                        } else if (typeof cids == "string" && ("," + cids + ',').indexOf("," + sid + ",") >= 0) {
                                            arrRstr[j] = "<tr class='trhover disabledRow'><td class='grid-opt-stretch'>+</td><td class='grid-opt-chk' style='text-align: left'><input type='checkbox' disabled class='disabledRow'/></td>";
                                        } else {
                                            arrRstr[j] = "<tr class='trhover'><td class='grid-opt-stretch'>+</td><td class='grid-opt-chk' style='text-align: left'><input type='checkbox' /></td>";
                                        }
                                    }
                                } else {
                                    arrRstr[j] = "<tr class='trhover'><td class='grid-opt-stretch'>+</td><td class='grid-opt-chk' style='text-align: left'><input type='checkbox' /></td>";
                                }
                            } else if (options.checkbox) {
                                if (options.dischose) {
                                    var dobj = options.disObject;
                                    var dkey = "";
                                    for (var d in dobj) {
                                        dkey = d;
                                        break;
                                    }
                                    var sid = oRowData[dkey.toLocaleLowerCase()] || oRowData[dkey.toLocaleUpperCase()];
                                    var cids = dobj[dkey];
                                    if (!cids) {
                                        arrRstr[j] = "<tr class='trhover'><td class='grid-opt-chk' style='text-align: left'><input type='checkbox' /></td>";
                                    } else {
                                        if (typeof cids == "object" && $.inArray(sid, cids) >= 0) {
                                            arrRstr[j] = "<tr class='trhover disabledRow'><td class='grid-opt-chk' style='text-align: left'><input type='checkbox' disabled class='disabledRow'/></td>";
                                        } else if (typeof cids == "string" && ("," + cids + ',').indexOf("," + sid + ",") >= 0) {
                                            arrRstr[j] = "<tr class='trhover disabledRow'><td class='grid-opt-chk' style='text-align: left'><input type='checkbox' disabled class='disabledRow'/></td>";
                                        } else {
                                            arrRstr[j] = "<tr class='trhover'><td class='grid-opt-chk' style='text-align: left'><input type='checkbox' /></td>";
                                        }
                                    }
                                } else {
                                    arrRstr[j] = "<tr class='trhover'><td class='grid-opt-chk' style='text-align: left'><input type='checkbox' /></td>";
                                }
                            } else if (options.stretch) {
                                arrRstr[j] = "<tr class='trhover'><td class='grid-opt-stretch'>+</td>";
                            } else {
                                if (options.dischose) {
                                    var dobj = options.disObject;
                                    var dkey = "";
                                    for (var d in dobj) {
                                        dkey = d;
                                        break;
                                    }
                                    var sid = oRowData[dkey.toLocaleLowerCase()] || oRowData[dkey.toLocaleUpperCase()];
                                    var cids = dobj[dkey];
                                    if (!cids) {
                                        arrRstr[j] = "<tr class='trhover'>";
                                    } else {
                                        if (typeof cids == "object" && $.inArray(sid, cids) >= 0) {
                                            arrRstr[j] = "<tr class='trhover disabledRow'>";
                                        } else if (typeof cids == "string" && ("," + cids + ',').indexOf("," + sid + ",") >= 0) {
                                            arrRstr[j] = "<tr class='trhover disabledRow'>";
                                        } else {
                                            arrRstr[j] = "<tr class='trhover'>";
                                        }
                                    }
                                } else {
                                    arrRstr[j] = "<tr class='trhover'>";
                                }
                            }
                            if (options.ordinal) {
                                arrRstr[j] += "<td class='grid-opt-ordinal' align='left'" +
                                    (options.canCopy ? "" : "\" onselectstart=\"return false\" style=\"-moz-user-select:none;\"") +">" + ordNum + "</td>";
                            }
                            ordNum++;
                        }
                        //mofify by zl  2013-07-15  列模型中含有“.”分割对象属性，用于处理返回的对象数据
                        //var sTemp = oRowData[key]==null?"":oRowData[key];
                        var sTemp, oTemp;
                        var arrKey = key.split(".");
                        if (arrKey[0] != undefined) {
                            oTemp = oRowData[arrKey[0]] == undefined ? "" : oRowData[arrKey[0]];
                            if (typeof(oTemp) != "object") {
                                sTemp = oTemp;
                            } else if (arrKey[1] != undefined) {
                                sTemp = oTemp[arrKey[1]] ? oTemp[arrKey[1]] : "";
                            }
                        }
                        //end modify

                        //add增加列渲染功能 2013-07-10
                        var f = oColCell.renderer;
                        var format = oColCell.format;
                        var showPro = {};
                        showPro.stitle = sTemp;
                        showPro.ifSetTitle = false;
                        showPro.replaceSymbols = true;
                        if (typeof f === "function") {
                            try {
                                showPro.replaceSymbols = true;
                                sTemp = f(sTemp, rows[j], j, showPro, arrKey)
                                if (!showPro.ifSetTitle) {
                                    showPro.stitle = sTemp;
                                }
                            } catch (e) {
                                sTemp = '';
                                if (window.console && window.console.error) {
                                    window.console.error(e);
                                }
                            }
                        }
                        if (typeof f === "string") {
                        }
                        //日期数据格式化处理
                        if (f === "Date") {
                            var date = null;
                            if (null == sTemp || sTemp == "") {
                                date = sTemp
                            } else {
                                if ((new Date(sTemp).toString() == "Invalid Date") || (new Date(sTemp).toString() == "NaN")) {
                                    date = sTemp;
                                } else {
                                    date = new Date(sTemp).Format(format);
                                }
                            }

                            sTemp = date;
                            showPro.stitle = date;
                        }
                        //字典项处理
                        if (f === "Dict") {
                            var dictCode = oColCell.dictCode;
                            var zdJson;
                            if (dictCode) {
                                if (typeof(dictCode) == "string") {
                                    zdJson = getZdDict(dictCode);
                                } else if (typeof(dictCode) == "object") {
                                    zdJson = dictCode;
                                }
                            }
                            if (zdJson && zdJson.length) {
                                if (sTemp != null) {
                                    var dataNos = sTemp.toString().trim().split(",");
                                    var tempNames = [];
                                    for (var z = 0; z < zdJson.length; z++) {
                                        if ($.inArray(zdJson[z].code, dataNos) >= 0) {
                                            tempNames.push(zdJson[z].value);
                                        }
                                    }
                                    sTemp = tempNames.join();
                                    showPro.stitle = tempNames.join();
                                }
                            }
                        }
                        //布尔值
                        if (f === "Boolean") {
                            showPro.replaceSymbols = false;
                            if (sTemp && parseInt(sTemp) > 0) {
                                sTemp = "<img src='" + RX.handlePath("/medias/style/plat/image/common/grid_yes.png") + "'/>";
                                showPro.stitle = "是";
                            } else {
                                sTemp = "<img src='" + RX.handlePath("/medias/style/plat/image/common/grid_no.png") + "'/>";
                                showPro.stitle = "否";
                            }
                        }
                        //数字数据格式化处理
                        if (f === "Number") {
                            //todo
                        }
                        //end add
                        if (oColCell.replaceNull && (sTemp === "" || sTemp === null)) {
                            sTemp = "/";
                        }
                        var sAlign = "left";
                        if (oColCell.align != undefined)
                            sAlign = oColCell.align;
                        arrRstr[j] += "<td align=" + sAlign + " title=\"" + replaceTitle(showPro.stitle)+"\" "+
                            + (options.canCopy ? "" : "\" onselectstart=\"return false\" style=\"-moz-user-select:none;\"") +">"
                            + (showPro.replaceSymbols ? replaceSymbols(sTemp) : sTemp) + "</td>";
                        if (i === columns.length - 1)
                            arrRstr[j] += "</tr>";
                    }
                    o.data("getedData", true);
                } else {
                    if (result && !result.inTempPool) {
                        msg = "";//数据加载中
                        arrRstr[0] = "<tr class='trhover errortr'><td colspan='" + (colLength + columns.length) + "' align='center'><span style='font-size:12px;color:red;font-weight:bold'>" + msg + "</span></td></tr>";
                    } else {
                        msg = "";
                        arrRstr[0] = "<tr class='trhover errortr'><td colspan='" + (colLength + columns.length) + "' align='center'><span style='font-size:12px;color:red;font-weight:bold'>" + msg + "</span></td></tr>";
                    }
                    $panel.data("getedData", false);
                }

                //o.data("curOrdNum",ordNum);

            }
            //生成表体标签拼接字符串
            sTh = sTh + "</tr>";
            sThFilter = sThFilter + "</tr>";
            sTd = arrRstr.join("");

            /*sTb = "<table border='0' class='list'>" + sHdCol
             + "<thead>" + sTh + "</thead><tbody>" + sTd + "</tbody></table>";*/
            if (options.newThead && options.newThead != null) {
                sTb = "<table cellpadding='0' cellspacing='0' border='0' class='list'>" + sHdCol
                    + "<thead>" + options.newThead + "</thead><tbody>" + sTd + "</tbody></table>";
            } else if (options.filterThead) {
                sTb = "<table cellpadding='0' cellspacing='0' border='0' class='list'>" + sHdCol
                    + "<thead>" + sTh + sThFilter + "</thead><tbody>" + sTd + "</tbody></table>";
            } else {
                sTb = "<table cellpadding='0' cellspacing='0' border='0' class='list'>" + sHdCol
                    + "<thead>" + sTh + "</thead><tbody>" + sTd + "</tbody></table>";
            }


            //jq对象
            $table = $(sTb);
            $thead = $table.find("thead");
            $tbody = $table.find("tbody");

            //给domElement设置数据缓存
            if (rows.length > 0) {
                $("tr", $tbody).each(function (index) {
                    var $tr = $(this);
                    $tr.data("rowData", rows[index]).data("index", index);
                })
            }
            else {
                $("tr", $tbody).data("rowData", null).data("index", 0);
            }

            //table载入前执行的方法
            if (typeof(options.onLoad) === "function") {
                options.onLoad.call(o, rows);
            }

            //绑定事件
            _buildEvent(o, $table, options);

            renderSelObject(o, options);
            return $table;
        }
        else {
            var msg = "";
            if (options.url == "") {
                sTb = "";
            } else {
                msg = "列表数据请求有误";
                sTb = "<table cellpadding='0' cellspacing='0' border='0' class='list'>" +
                    "<tbody><tr><td align='center' style='color:red;font-weight:bold'>" + msg +
                    "</td></tr></tbody>" +
                    "</table>";
            }
            $table = $(sTb);
            $panel.data("getedData", false);
            total = 0;
            $panel.data("datagrid").options.total = total;
            return $table;
        }

    };

    var _buildAsyncDataGrid = function (o, options, pram, json) {
        var $panel = o;
        var headUrl = options.columns;
        var bodyUrl = options.url;
        var localData = options.localData;
        var autoColumn = options.autoColumn;
        var local;
        var columns;
        var errmsg;
        var colLength;
        var $table, $thead, $tbody;
        //用于拼接头部th,表体td和定义列宽col的字符串;
        var sTb, sTh, sTd, sHdCol, sTemp;
        var ordNum;
        var rows;
        var total;
        var arrRstr = [];// 用于存放表体结构字符串的对象数组;
        if (options.pagination == false) {
            options.fastPagenate = false;
        }

        //出现错误
        if (json && json.errmsg != null && json.errmsg != "") {
            sTb = "<table cellpadding='0' cellspacing='0' border='0' class='list'>" +
                "<tbody><tr><td align='center' style='color:red;font-weight:bold'>" + json.errmsg +
                "</td></tr></tbody>" +
                "</table>";
            $table = $(sTb);
            $panel.data("getedData", false);
            total = 0;
            $panel.data("datagrid").options.total = total;
            return $table;
        } else if (!json) {
            sTb = "<table cellpadding='0' cellspacing='0' border='0' class='list'>" +
                "<tbody><tr><td align='center' style='color:red;font-weight:bold'>无数据" +
                "</td></tr></tbody>" +
                "</table>";
            $table = $(sTb);
            $panel.data("getedData", false);
            total = 0;
            $panel.data("datagrid").options.total = total;
            return $table;
        }

        //初始化
        sTb = "";
        sTd = "";
        sTemp = "";
        if (!o.data("curOrdNum"))
            o.data("curOrdNum", 1)
        ordNum = o.data("curOrdNum");
        //add dynamic tableHead
        if (typeof(headUrl) === "string") {
            columns = getData(headUrl, null, options.postData, o);
            if ($.isArray(columns)) {
                $.each(columns, function (i, n) {
                    if (typeof n['renderer'] == "string") {
                        try {
                            n['renderer'] = eval("(" + n['renderer'] + ")");
                        } catch (e) {
                        }
                    }
                });
                //add by zl 2013-08-13
                options.columns = columns;
                //end add
            } else {
                $table = $("<table cellpadding='0' cellspacing='0' border='0' class='list'>" +
                    "<tbody><tr class='errortr'><td align='center' style='font-weight:bold;color:red'>" +
                    "动态列模型请求有误</td>" +
                    "</tr></tbody></table>");
                $panel.data("getedData", false);
                return $table;
            }
        } else {
            columns = headUrl;

        }
        //end add
        //options.startPage = pram.startPage;
        if (json != null) {
            //存储用于分页的总条数
            var total = json.total;
            var hasNext = json.hasNext;
            var pageCurrent = json.pageCurrent;
            var pageSize = json.pageSize;
            options.startPage = json.pageCurrent;
            $panel.data("datagrid").options.total = total;
            $panel.data("datagrid").options.hasNext = hasNext;
            $panel.data("datagrid").options.pageCurrent = pageCurrent;
            $panel.data("datagrid").options.pageSize = pageSize;
            rows = json.rows;
            errmsg = json.errmsg;
            /**
             * 自动生成表头
             */

            if (autoColumn) {
                var r1data = rows[0];
                columns = [];
                var yb = 0;
                for (var key in r1data) {
                    yb++;
                    var col = {title: "", id: "", width: 100, align: "center", renderer: "String"};
                    col.title = key;
                    col.id = key;
                    columns.push(col);
                    //暂定只显示5列
                    if (yb == 5) {
                        break;
                    }
                }
            }

            var sThFilter = "";//表头过滤
            /**
             * 生成table结构优化
             * @type {*|HTMLElement}
             */

            //生成列宽标签，表头结构，表体结构拼接字符串
            //初始化sTh，sHdCol
            if (options.checkbox && options.stretch) {
                if (options.mulchose)   //多选
                {
                    if (options.showchkAll) {
                        sTh = "<tr><th></th><th class='grid-opt-chkAll'><input type='checkbox' class='chkAll'/></th>";
                        sThFilter = "<tr><th></th><th></th>"
                    } else {
                        sTh = "<tr><th></th><th class='grid-opt-chkAll'></th>";
                        sThFilter = "<tr><th></th><th></th>"
                    }

                }
                else                    //单选
                {
                    sTh = "<tr><th></th><th></th>";
                    sThFilter = "<tr><th></th><th></th>"
                }
                sHdCol = "<col width='30px'/><col width='25px'/>";
                colLength = 2;
            }
            else if (options.checkbox) {
                if (options.mulchose)           //多选
                {
                    if (options.showchkAll) {
                        sTh = "<tr><th class='grid-opt-chkAll'><input type='checkbox'  class='chkAll'/></th>";
                        sThFilter = "<tr><th></th>"
                    } else {
                        sTh = "<tr><th class='grid-opt-chkAll'></th>";
                        sThFilter = "<tr><th></th>"
                    }


                }
                else                         //单选
                {
                    sTh = "<tr><th></th>";
                    sThFilter = "<tr><th></th>"
                }
                sHdCol = "<col width='30px'/>";
                colLength = 1;
            }
            else if (options.stretch) {
                sTh = "<tr><th></th>";
                sThFilter = "<tr><th></th>";
                sHdCol = "<col width='25px'/>";
                colLength = 1;
            }
            else {
                sTh = "<tr>";
                sThFilter = "<tr>";
                sHdCol = "";
                colLength = 0;
            }

            if (options.ordinal) {
                sTh += "<th>序号</th>";
                sThFilter += "<th></th>";
                sHdCol += "<col width='50px'/>";
                colLength++;
            }
            if (options.pagination) {
                if (options.hasNext) {
                    $('ul.rx-pagenate', o).find('li.rx-next').removeClass("disabled");
                } else {
                    $('ul.rx-pagenate', o).find('li.rx-next').addClass("disabled");

                }
                if (options.pageCurrent <= 1) {
                    $('ul.rx-pagenate', o).find('li.rx-prev').addClass("disabled");
                } else {
                    $('ul.rx-pagenate', o).find('li.rx-prev').removeClass("disabled");
                }

            }
            //开始拼接表体结构字符串
            for (var i = 0; i < columns.length; i++) {
                var oColCell = columns[i]; //列对象

                //生成col和thead中的th
                var sColLen = ""; //列宽长度
                if (oColCell.width != undefined)
                    sColLen = oColCell.width;
                sHdCol += "<col width='" + sColLen + "px'/>";
                /* 列头加操作按钮
                 sTh += "<th>" + oColCell.title + "<button></button></th>";
                 */
                sTh += "<th>";
                if (oColCell.canOrder) {
                    sTh += "<div class='sorting_desc_box' dataId='" + oColCell.id + "'><i class='iconfont sorting_desc_top' " + (oColCell.orderByType === "asc" ? "style='color:#888;' " : "") + " title='升序'>&#xe61f;</i>" +
                        "<i class='iconfont sorting_desc_bottom' title='降序' " + (oColCell.orderByType === "desc" ? "style='color:#888;'" : "") + ">&#xe8ac;</i>" + oColCell.title + "</div></th>";
                } else {
                    sTh += "<div class='sorting_desc_box'>" + oColCell.title + "</div></th>";
                }
                var isFilter = oColCell.isFilter == null ? true : false;
                if (isFilter) {
                    sThFilter += "<th><input type='text' class='txt' style='width:" + sColLen + "px' name='" + oColCell.id + "'/></th>";
                } else {
                    sThFilter += "<th></th>";
                }

                if (Object.prototype.toString.call(rows) === '[object Array]' && rows.length > 0)  //判断是否是数组
                {
                    for (var j = 0; j < rows.length; j++) {
                        var key = oColCell.id;
                        var oRowData = rows[j];
                        if (arrRstr[j] === undefined) {
                            if (options.checkbox && options.stretch) {
                                if (options.dischose) {
                                    /*
                                     * 根据传入的cids将其中id对应的行加上不可选的样式
                                     * */
                                    //var cids = options.cids;
                                    var dobj = options.disObject;
                                    var inTag = false;
                                    for (var d in dobj) {
                                        var sid = oRowData[d.toLocaleLowerCase()] || oRowData[d.toLocaleUpperCase()];
                                        var cids = dobj[d];
                                        if ($.inArray(sid, cids) >= 0) {
                                            inTag = true;
                                            break;
                                        }
                                    }
                                    if (inTag) {
                                        arrRstr[j] = "<tr class='trhover disabledRow'><td class='grid-opt-chk' style='text-align: left'><input type='checkbox' disabled class='disabledRow'/></td>";
                                    } else {
                                        arrRstr[j] = "<tr class='trhover'><td class='grid-opt-chk' style='text-align: left'><input type='checkbox' /></td>";
                                    }
                                } else {
                                    arrRstr[j] = "<tr class='trhover'><td class='grid-opt-stretch'>+</td><td class='grid-opt-chk' style='text-align: left'><input type='checkbox' /></td>";
                                }
                            } else if (options.checkbox) {
                                if (options.dischose) {
                                    var dobj = options.disObject;
                                    var inTag = false;
                                    for (var d in dobj) {
                                        var sid = oRowData[d.toLocaleLowerCase()] || oRowData[d.toLocaleUpperCase()];
                                        var cids = dobj[d];
                                        if (!cids) {
                                            continue;
                                        }
                                        if (typeof cids == "object" && $.inArray(sid, cids) >= 0) {
                                            inTag = true;
                                            break;
                                        } else if (typeof cids == "string" && ("," + cids + ',').indexOf("," + sid + ",") >= 0) {
                                            inTag = true;
                                            break;
                                        }
                                    }
                                    if (inTag) {
                                        arrRstr[j] = "<tr class='trhover disabledRow'><td class='grid-opt-chk' style='text-align: left'><input type='checkbox' disabled class='disabledRow'/></td>";
                                    } else {
                                        arrRstr[j] = "<tr class='trhover'><td class='grid-opt-chk' style='text-align: left'><input type='checkbox' /></td>";
                                    }
                                } else {
                                    arrRstr[j] = "<tr class='trhover'><td class='grid-opt-chk' style='text-align: left'><input type='checkbox' /></td>";
                                }
                            } else if (options.stretch) {
                                arrRstr[j] = "<tr class='trhover'><td class='grid-opt-stretch'>+</td>";
                            } else {
                                if (options.dischose) {
                                    var dobj = options.disObject;
                                    var inTag = false;
                                    for (var d in dobj) {
                                        var sid = oRowData[d.toLocaleLowerCase()] || oRowData[d.toLocaleUpperCase()];
                                        var cids = dobj[d];
                                        if (!cids) {
                                            continue;
                                        }
                                        if (typeof cids == "object" && $.inArray(sid, cids) >= 0) {
                                            inTag = true;
                                            break;
                                        } else if (typeof cids == "string" && ("," + cids + ',').indexOf("," + sid + ",") >= 0) {
                                            inTag = true;
                                            break;
                                        }
                                    }
                                    if (inTag) {
                                        arrRstr[j] = "<tr class='trhover disabledRow'>";
                                    } else {
                                        arrRstr[j] = "<tr class='trhover'>";
                                    }
                                } else {
                                    arrRstr[j] = "<tr class='trhover'>";
                                }
                            }
                            if (options.ordinal) {
                                arrRstr[j] += "<td class='grid-opt-ordinal' align='left'" +
                                    (options.canCopy ? "" : "\" onselectstart=\"return false\" style=\"-moz-user-select:none;\"") +">" + ordNum + "</td>";
                            }
                            ordNum++;
                        }
                        //mofify by zl  2013-07-15  列模型中含有“.”分割对象属性，用于处理返回的对象数据
                        //var sTemp = oRowData[key]==null?"":oRowData[key];
                        var sTemp, oTemp;
                        var arrKey = key.split(".");
                        if (arrKey[0] != undefined) {
                            oTemp = oRowData[arrKey[0]] == undefined ? "" : oRowData[arrKey[0]];
                            if (typeof(oTemp) != "object") {
                                sTemp = oTemp;
                            } else if (arrKey[1] != undefined) {
                                sTemp = oTemp[arrKey[1]] ? oTemp[arrKey[1]] : "";
                            }
                        }
                        //end modify

                        //add增加列渲染功能 2013-07-10
                        var f = oColCell.renderer;
                        var format = oColCell.format;
                        var showPro = {};
                        showPro.stitle = sTemp;
                        showPro.ifSetTitle = false;
                        showPro.replaceSymbols = true;
                        if (typeof f === "function") {
                            try {
                                showPro.replaceSymbols = true;
                                sTemp = f(sTemp, rows[j], j, showPro, arrKey)
                                if (!showPro.ifSetTitle) {
                                    showPro.stitle = sTemp;
                                }
                            } catch (e) {
                                sTemp = '';
                                if (window.console && window.console.error) {
                                    window.console.error(e);
                                }
                            }
                        }
                        if (typeof f === "string") {
                        }
                        //日期数据格式化处理
                        if (f === "Date") {
                            var date = null;
                            if (null == sTemp || sTemp == "") {
                                date = sTemp
                            } else {
                                if ((new Date(sTemp).toString() == "Invalid Date") || (new Date(sTemp).toString() == "NaN")) {
                                    date = sTemp;
                                } else {
                                    date = new Date(sTemp).Format(format);
                                }
                            }

                            sTemp = date;
                            showPro.stitle = date;
                        }
                        //字典项处理
                        if (f === "Dict") {
                            var dictCode = oColCell.dictCode;
                            var zdJson;
                            if (dictCode) {
                                if (typeof(dictCode) == "string") {
                                    zdJson = getZdDict(dictCode);
                                } else if (typeof(dictCode) == "object") {
                                    zdJson = dictCode;
                                }
                            }
                            if (zdJson && zdJson.length) {
                                if (sTemp != null) {
                                    var dataNos = sTemp.toString().trim().split(",");
                                    var tempNames = [];
                                    for (var z = 0; z < zdJson.length; z++) {
                                        if ($.inArray(zdJson[z].code, dataNos) >= 0) {
                                            tempNames.push(zdJson[z].value);
                                        }
                                    }
                                    sTemp = tempNames.join();
                                    showPro.stitle = tempNames.join();
                                }
                            }
                        }
                        //布尔值
                        if (f === "Boolean") {
                            showPro.replaceSymbols = false;
                            if (sTemp && parseInt(sTemp) > 0) {
                                sTemp = "<img src='" + RX.handlePath("/medias/style/plat/image/common/grid_yes.png") + "'/>";
                                showPro.stitle = "是";
                            } else {
                                sTemp = "<img src='" + RX.handlePath("/medias/style/plat/image/common/grid_no.png") + "'/>";
                                showPro.stitle = "否";
                            }
                        }
                        //数字数据格式化处理
                        if (f === "Number") {
                            //todo
                        }
                        //end add
                        if (oColCell.replaceNull && (sTemp === "" || sTemp === null)) {
                            sTemp = "/";
                        }
                        var sAlign = "left";
                        if (oColCell.align != undefined)
                            sAlign = oColCell.align;
                        arrRstr[j] += "<td align=" + sAlign + " title=\"" + replaceTitle(showPro.stitle)+"\" "+
                            +(options.canCopy ? "" : "\" onselectstart=\"return false\" style=\"-moz-user-select:none;\"") +">"
                            + (showPro.replaceSymbols ? replaceSymbols(sTemp) : sTemp) + "</td>";
                        if (i === columns.length - 1)
                            arrRstr[j] += "</tr>";
                    }
                    o.data("getedData", true);
                    //o.data("curOrdNum",ordNum);
                }
                else {
                    var msg = "无数据";
                    if (typeof errmsg != "undefined" && errmsg != null && errmsg != "") {
                        msg = errmsg;
                    }
                    arrRstr[0] = "<tr class='trhover errortr'><td colspan='" + (colLength + columns.length) + "' align='center'><span style='width: 100%;color: #999;font-size: 14px;text-align: center;'>" + msg + "</span></td></tr>";
                    $panel.data("getedData", false);
                }
            }

            //生成表体标签拼接字符串
            sTh = sTh + "</tr>";
            sThFilter = sThFilter + "</tr>";
            sTd = arrRstr.join("");
            /*sTb = "<table cellpadding='0' cellspacing='0' border='0' class='list'>" + sHdCol
             + "<thead>" + sTh + "</thead><tbody>" + sTd + "</tbody></table>";*/
            if (options.newThead && options.newThead != null) {
                sTb = "<table cellpadding='0' cellspacing='0' border='0' class='list'>" + sHdCol
                    + "<thead>" + options.newThead + "</thead><tbody>" + sTd + "</tbody></table>";
            } else if (options.filterThead) {
                sTb = "<table cellpadding='0' cellspacing='0' border='0' class='list'>" + sHdCol
                    + "<thead>" + sTh + sThFilter + "</thead><tbody>" + sTd + "</tbody></table>";
            } else {
                sTb = "<table cellpadding='0' cellspacing='0' border='0' class='list'>" + sHdCol
                    + "<thead>" + sTh + "</thead><tbody>" + sTd + "</tbody></table>";
            }

            //jq对象
            $table = $(sTb);
            $thead = $table.find("thead");
            $tbody = $table.find("tbody");

            //给domElement设置数据缓存
            if (rows.length > 0) {
                $("tr", $tbody).each(function (index) {
                    var $tr = $(this);
                    $tr.data("rowData", rows[index]).data("index", index);
                })
                $table.data("rows", rows);
            }
            else {
                $table.data("rows", []);
                $("tr", $tbody).data("rowData", null).data("index", 0);
            }

            //table载入前执行的方法
            if (typeof(options.onLoad) === "function") {
                options.onLoad.call(o, rows);
            }

            //绑定事件
            _buildEvent(o, $table, options);
            return $table;
        }
        else {
            var msg = "";
            if (options.url == "") {
                sTb = "";
            } else {
                msg = "列表数据请求有误";
                sTb = "<table cellpadding='0' cellspacing='0' border='0' class='list'>" +
                    "<tbody><tr><td align='center' style='color:red;font-weight:bold'>" + msg +
                    "</td></tr></tbody>" +
                    "</table>";
            }
            $table = $(sTb);
            $panel.data("getedData", false);
            total = 0;
            $panel.data("datagrid").options.total = total;
            return $table;
        }

    };
    var _buildReloadDataGrid = function (o, options, pram) {
        var $panel = o;
        var headUrl = options.columns;
        var bodyUrl = options.url;
        var localData = options.localData;
        var autoColumn = options.autoColumn;
        var local;
        var columns;
        var json;
        var errmsg;
        var colLength;
        var $table, $thead, $tbody;
        //用于拼接头部th,表体td和定义列宽col的字符串;
        var sTb, sTh, sTd, sHdCol, sTemp;
        var ordNum;
        var rows;
        var total;
        var arrRstr = [];// 用于存放表体结构字符串的对象数组;
        if (options.pagination == false) {
            options.fastPagenate = false;
        }

        //初始化
        sTb = "";
        sTd = "";
        sTemp = "";
        if (!o.data("curOrdNum"))
            o.data("curOrdNum", 1)
        ordNum = o.data("curOrdNum");
        //add dynamic tableHead
        if (typeof(headUrl) === "string") {
            columns = getData(headUrl, null, options.postData, o);
            if ($.isArray(columns)) {
                $.each(columns, function (i, n) {
                    if (typeof n['renderer'] == "string") {
                        try {
                            n['renderer'] = eval("(" + n['renderer'] + ")");
                        } catch (e) {
                        }
                    }
                });
                //add by zl 2013-08-13
                options.columns = columns;
                //end add
            } else {
                $table = $("<table cellpadding='0' cellspacing='0' border='0' class='list'>" +
                    "<tbody><tr class='errortr'><td align='center' style='font-weight:bold;color:red'>" +
                    "动态列模型请求有误</td>" +
                    "</tr></tbody></table>");
                $panel.data("getedData", false);
                return $table;
            }
        } else {
            columns = headUrl;

        }
        //end add
        if (localData != null && localData.length > 0 && typeof(localData) === "object") {
            local = true;
            json = getLocalData(localData);
        }
        //add dynamic tableHead
        if (!local && typeof(bodyUrl) === "string") {
            //{startPage: curNum, limit: options.limit, totalNum: total || 0}
            if (options.fastPagenate) {//新型分页 不传总数，
                if ((tempPageData.pageNo > 0) && (tempPageData.pageNo == pram.startPage)) {//去缓存的页数据并取下页的数据放入缓存
                    var jsonData = {rows: [], pageCurrent: tempPageData.pageNo, pageSize: options.limit, hasNext: true};
                    jsonData.rows = tempPageData.pageData;
                    jsonData.hasNext = tempPageData.pageData.length < options.limit ? false : true;
                    json = jsonData;
                    var oldPage = parseInt(options.startPage, 10);
                    var curPage = parseInt(pram.startPage, 10);
                    var newPage = 0;
                    if (oldPage <= curPage) {//向后翻页则请求下一页数据
                        newPage = curPage + 1;
                    } else {//向前翻页请求前一页数据
                        newPage = curPage - 1;
                    }
                    var newParma = {startPage: newPage, oldPage: oldPage, limit: options.limit, onePage: true}
                    var newData = getData(bodyUrl, newParma, options.postData, o);
                    tempPageData.pageNo = newParma.startPage;
                    tempPageData.pageData = newData.rows;
                    if (newPage > oldPage) {
                        json.hasNext = tempPageData.pageData.length == 0 ? false : true;
                    }
                } else {
                    var oldPage = parseInt(options.startPage, 10);
                    var curPage = parseInt(pram.startPage, 10);
                    pram.oldPage = oldPage;
                    pram.onePage = false;
                    json = getData(bodyUrl, pram, options.postData, o);
                    //zhan add 20160418
                    //start mh处渲染问题，初始不render，无法reload
                    if (json == null) {
                        json = {};
                        json.rows = [];
                    }
                    //end
                    if (json.rows.length > options.limit) {//当返回的数据大于pageSize则大出的部分作为零时数据存放
                        if (oldPage <= curPage) {//向后翻页缓存当前页+1的数据
                            tempPageData.pageData = json.rows.slice(options.limit, json.rows.length);
                            json.rows.splice(options.limit, json.rows.length);
                            tempPageData.pageNo = parseInt(pram.startPage, 10) + 1;
                        } else {//向前翻页 缓存当前页-1的数据
                            tempPageData.pageData = json.rows.slice(0, options.limit);
                            json.rows.splice(0, options.limit);
                            tempPageData.pageNo = parseInt(pram.startPage, 10) - 1;
                        }

                    }
                    if (oldPage > curPage && json.rows.length == options.limit) {
                        json.hasNext = true;
                    }
                }
            } else {//原始的分页模式 带total总数
                json = getData(bodyUrl, pram, options.postData, o);
            }

        } else {
            //json = bodyUrl;
        }
        //end add
        options.startPage = pram.startPage;
        if (json != null) {
            //存储用于分页的总条数
            var total = json.total;
            var hasNext = json.hasNext;
            var pageCurrent = json.pageCurrent;
            var pageSize = json.pageSize;
            $panel.data("datagrid").options.total = total;
            $panel.data("datagrid").options.hasNext = hasNext;
            $panel.data("datagrid").options.pageCurrent = pageCurrent;
            $panel.data("datagrid").options.pageSize = pageSize;
            rows = json.rows;
            errmsg = json.errmsg;
            /**
             * 自动生成表头
             */

            if (autoColumn) {
                var r1data = rows[0];
                columns = [];
                var yb = 0;
                for (var key in r1data) {
                    yb++;
                    var col = {title: "", id: "", width: 100, align: "center", renderer: "String"};
                    col.title = key;
                    col.id = key;
                    columns.push(col);
                    //暂定只显示5列
                    if (yb == 5) {
                        break;
                    }
                }

            }


            var sThFilter = "";//表头过滤

            /**
             * 生成table结构优化
             * @type {*|HTMLElement}
             */

            //生成列宽标签，表头结构，表体结构拼接字符串
            //初始化sTh，sHdCol
            if (options.checkbox && options.stretch) {
                if (options.mulchose)   //多选
                {
                    if (options.showchkAll) {
                        sTh = "<tr><th></th><th class='grid-opt-chkAll'><input type='checkbox' class='chkAll'/></th>";
                        sThFilter = "<tr><th></th><th></th>"
                    } else {
                        sTh = "<tr><th></th><th class='grid-opt-chkAll'></th>";
                        sThFilter = "<tr><th></th><th></th>"
                    }

                }
                else                    //单选
                {
                    sTh = "<tr><th></th><th></th>";
                    sThFilter = "<tr><th></th><th></th>"
                }
                sHdCol = "<col width='30px'/><col width='25px'/>";
                colLength = 2;
            }
            else if (options.checkbox) {
                if (options.mulchose)           //多选
                {
                    if (options.showchkAll) {
                        sTh = "<tr><th class='grid-opt-chkAll'><input type='checkbox'  class='chkAll'/></th>";
                        sThFilter = "<tr><th></th>"
                    } else {
                        sTh = "<tr><th class='grid-opt-chkAll'></th>";
                        sThFilter = "<tr><th></th>"
                    }


                }
                else                         //单选
                {
                    sTh = "<tr><th></th>";
                    sThFilter = "<tr><th></th>"
                }
                sHdCol = "<col width='30px'/>";
                colLength = 1;
            }
            else if (options.stretch) {
                sTh = "<tr><th></th>";
                sThFilter = "<tr><th></th>";
                sHdCol = "<col width='25px'/>";
                colLength = 1;
            }
            else {
                sTh = "<tr>";
                sThFilter = "<tr>"
                sHdCol = "";
                colLength = 0;
            }

            if (options.ordinal) {
                sTh += "<th>序号</th>";
                sThFilter += "<th></th>"
                sHdCol += "<col width='50px'/>";
                colLength++;
            }
            if (options.fastPagenate) {
                if (options.hasNext) {
                    $('ul.rx-pagenate', o).find('li.rx-next').removeClass("disabled");
                } else {
                    $('ul.rx-pagenate', o).find('li.rx-next').addClass("disabled");

                }
                if (options.pageCurrent <= 1) {
                    $('ul.rx-pagenate', o).find('li.rx-prev').addClass("disabled");
                } else {
                    $('ul.rx-pagenate', o).find('li.rx-prev').removeClass("disabled");
                }

            }

            //开始拼接表体结构字符串
            for (var i = 0; i < columns.length; i++) {
                var oColCell = columns[i]; //列对象

                //生成col和thead中的th
                var sColLen = ""; //列宽长度
                if (oColCell.width != undefined)
                    sColLen = oColCell.width;
                sHdCol += "<col width='" + sColLen + "px'/>";
                /* 列头加操作按钮
                 sTh += "<th>" + oColCell.title + "<button></button></th>";
                 */
                sTh += "<th>";
                if (oColCell.canOrder) {
                    sTh += "<div class='sorting_desc_box' dataId='" + oColCell.id + "'><i class='iconfont sorting_desc_top' " + (oColCell.orderByType === "asc" ? "style='color:#888;' " : "") + " title='升序'>&#xe61f;</i>" +
                        "<i class='iconfont sorting_desc_bottom' title='降序' " + (oColCell.orderByType === "desc" ? "style='color:#888;'" : "") + ">&#xe8ac;</i>" + oColCell.title + "</div></th>";
                } else {
                    sTh += "<div class='sorting_desc_box'>" + oColCell.title + "</div></th>";
                }
                var isFilter = oColCell.isFilter == null ? true : false;
                if (isFilter) {
                    sThFilter += "<th><input type='text' class='txt' style='width:" + sColLen + "px' name='" + oColCell.id + "'/></th>";
                } else {
                    sThFilter += "<th></th>";
                }


                if (Object.prototype.toString.call(rows) === '[object Array]' && rows.length > 0)  //判断是否是数组
                {
                    for (var j = 0; j < rows.length; j++) {
                        var key = oColCell.id;
                        var oRowData = rows[j];
                        if (arrRstr[j] === undefined) {
                            if (options.checkbox && options.stretch) {
                                if (options.dischose) {
                                    /*
                                     * 根据传入的cids将其中id对应的行加上不可选的样式
                                     * */
                                    //var cids = options.cids;
                                    var dobj = options.disObject;
                                    var inTag = false;
                                    for (var d in dobj) {
                                        var sid = oRowData[d.toLocaleLowerCase()] || oRowData[d.toLocaleUpperCase()];
                                        var cids = dobj[d];
                                        if (!cids) {
                                            continue;
                                        }
                                        if (typeof cids == "object" && $.inArray(sid, cids) >= 0) {
                                            inTag = true;
                                            break;
                                        } else if (typeof cids == "string" && ("," + cids + ',').indexOf("," + sid + ",") >= 0) {
                                            inTag = true;
                                            break;
                                        }
                                    }
                                    if (inTag) {
                                        arrRstr[j] = "<tr class='trhover disabledRow'><td class='grid-opt-chk'><input type='checkbox' disabled class='disabledRow'/></td>";
                                    } else {
                                        arrRstr[j] = "<tr class='trhover'><td class='grid-opt-chk'><input type='checkbox' /></td>";
                                    }
                                } else {
                                    arrRstr[j] = "<tr class='trhover'><td class='grid-opt-stretch'>+</td><td class='grid-opt-chk'><input type='checkbox' /></td>";
                                }
                            } else if (options.checkbox) {
                                if (options.dischose) {
                                    var dobj = options.disObject;
                                    var inTag = false;
                                    for (var d in dobj) {
                                        var sid = oRowData[d.toLocaleLowerCase()] || oRowData[d.toLocaleUpperCase()];
                                        var cids = dobj[d];
                                        if (!cids) {
                                            continue;
                                        }
                                        if (typeof cids == "object" && $.inArray(sid, cids) >= 0) {
                                            inTag = true;
                                            break;
                                        } else if (typeof cids == "string" && ("," + cids + ',').indexOf("," + sid + ",") >= 0) {
                                            inTag = true;
                                            break;
                                        }
                                    }
                                    if (inTag) {
                                        arrRstr[j] = "<tr class='trhover disabledRow'><td class='grid-opt-chk'><input type='checkbox' disabled class='disabledRow'/></td>";
                                    } else {
                                        arrRstr[j] = "<tr class='trhover'><td class='grid-opt-chk'><input type='checkbox' /></td>";
                                    }
                                } else {
                                    arrRstr[j] = "<tr class='trhover'><td class='grid-opt-chk'><input type='checkbox' /></td>";
                                }
                            } else if (options.stretch) {
                                arrRstr[j] = "<tr class='trhover'><td class='grid-opt-stretch'>+</td>";
                            } else {
                                if (options.dischose) {
                                    var dobj = options.disObject;
                                    var inTag = false;
                                    for (var d in dobj) {
                                        var sid = oRowData[d.toLocaleLowerCase()] || oRowData[d.toLocaleUpperCase()];
                                        var cids = dobj[d];
                                        if (!cids) {
                                            continue;
                                        }
                                        if (typeof cids == "object" && $.inArray(sid, cids) >= 0) {
                                            inTag = true;
                                            break;
                                        } else if (typeof cids == "string" && ("," + cids + ',').indexOf("," + sid + ",") >= 0) {
                                            inTag = true;
                                            break;
                                        }
                                    }
                                    if (inTag) {
                                        arrRstr[j] = "<tr class='trhover disabledRow'>";
                                    } else {
                                        arrRstr[j] = "<tr class='trhover'>";
                                    }
                                } else {
                                    arrRstr[j] = "<tr class='trhover'>";
                                }
                            }
                            if (options.ordinal) {
                                arrRstr[j] += "<td class='grid-opt-ordinal' align='left'" +
                                    (options.canCopy ? "" : "\" onselectstart=\"return false\" style=\"-moz-user-select:none;\"") +">" + ordNum + "</td>";
                            }
                            ordNum++;
                        }
                        //mofify by zl  2013-07-15  列模型中含有“.”分割对象属性，用于处理返回的对象数据
                        //var sTemp = oRowData[key]==null?"":oRowData[key];
                        var sTemp, oTemp;
                        var arrKey = key.split(".");
                        if (arrKey[0] != undefined) {
                            oTemp = oRowData[arrKey[0]] == undefined ? "" : oRowData[arrKey[0]];
                            if (typeof(oTemp) != "object") {
                                sTemp = oTemp;
                            } else if (arrKey[1] != undefined) {
                                sTemp = oTemp[arrKey[1]] ? oTemp[arrKey[1]] : "";
                            }
                        }
                        //end modify

                        //add增加列渲染功能 2013-07-10
                        var f = oColCell.renderer;
                        var format = oColCell.format;
                        var showPro = {};
                        showPro.stitle = sTemp;
                        showPro.ifSetTitle = false;
                        showPro.replaceSymbols = true;
                        if (typeof f === "function") {
                            try {
                                showPro.replaceSymbols = true;
                                sTemp = f(sTemp, rows[j], j, showPro, arrKey);
                                if (!showPro.ifSetTitle) {
                                    showPro.stitle = sTemp;
                                }
                            } catch (e) {
                                sTemp = '';
                                if (window.console && window.console.error) {
                                    window.console.error(e);
                                }
                            }
                        }
                        if (typeof f === "string") {
                        }
                        //日期数据格式化处理
                        if (f === "Date") {
                            var date = null;
                            if (null == sTemp || sTemp == "") {
                                date = sTemp
                            } else {
                                if ((new Date(sTemp).toString() == "Invalid Date") || (new Date(sTemp).toString() == "NaN")) {
                                    date = sTemp;
                                } else {
                                    date = new Date(sTemp).Format(format);
                                }
                            }

                            sTemp = date;
                            showPro.stitle = date;
                        }
                        //字典项处理
                        if (f === "Dict") {
                            var dictCode = oColCell.dictCode;
                            var zdJson;
                            if (dictCode) {
                                if (typeof(dictCode) == "string") {
                                    zdJson = getZdDict(dictCode);
                                } else if (typeof(dictCode) == "object") {
                                    zdJson = dictCode;
                                }
                            }
                            if (zdJson && zdJson.length) {
                                if (sTemp != null) {
                                    var dataNos = sTemp.toString().trim().split(",");
                                    var tempNames = [];
                                    for (var z = 0; z < zdJson.length; z++) {
                                        if ($.inArray(zdJson[z].code, dataNos) >= 0) {
                                            tempNames.push(zdJson[z].value);
                                        }
                                    }
                                    sTemp = tempNames.join();
                                    showPro.stitle = tempNames.join();
                                }
                            }
                        }
                        //布尔值
                        if (f === "Boolean") {
                            showPro.replaceSymbols = false;
                            if (sTemp && parseInt(sTemp) > 0) {
                                sTemp = "<img src='" + RX.handlePath("/medias/style/plat/image/common/grid_yes.png") + "'/>";
                                showPro.stitle = "是";
                            } else {
                                sTemp = "<img src='" + RX.handlePath("/medias/style/plat/image/common/grid_no.png") + "'/>";
                                showPro.stitle = "否";
                            }
                        }
                        //数字数据格式化处理
                        if (f === "Number") {
                            //todo
                        }
                        //end add
                        if (oColCell.replaceNull && (sTemp === "" || sTemp === null)) {
                            sTemp = "/";
                        }
                        var sAlign = "left";
                        if (oColCell.align != undefined)
                            sAlign = oColCell.align;
                        arrRstr[j] += "<td align=" + sAlign + " title=\"" + replaceTitle(showPro.stitle)+"\" "+
                            + (options.canCopy ? "" : "\" onselectstart=\"return false\" style=\"-moz-user-select:none;\"") +">"
                            + (showPro.replaceSymbols ? replaceSymbols(sTemp) : sTemp) + "</td>";
                        if (i === columns.length - 1)
                            arrRstr[j] += "</tr>";
                    }
                    o.data("getedData", true);
                    //o.data("curOrdNum",ordNum);
                }
                else {
                    var msg = "无数据";
                    if (typeof errmsg != "undefined" && errmsg != null && errmsg != "") {
                        msg = errmsg;
                    }
                    arrRstr[0] = "<tr class='trhover errortr'><td colspan='" + (colLength + columns.length) + "' align='center'><span style='font-size:12px;color:red;font-weight:bold'>" + msg + "</span></td></tr>";
                    $panel.data("getedData", false);
                }
            }

            //生成表体标签拼接字符串
            sTh = sTh + "</tr>";
            sThFilter = sThFilter + "</tr>";
            sTd = arrRstr.join("");
            /*sTb = "<table cellpadding='0' cellspacing='0' border='0' class='list'>" + sHdCol
             + "<thead>" + sTh + "</thead><tbody>" + sTd + "</tbody></table>";*/
            if (options.filterThead) {
                sTb = "<table cellpadding='0' cellspacing='0' border='0' class='list'>" + sHdCol
                    + "<thead>" + sTh + sThFilter + "</thead><tbody>" + sTd + "</tbody></table>";
            } else {
                sTb = "<table cellpadding='0' cellspacing='0' border='0' class='list'>" + sHdCol
                    + "<thead>" + sTh + "</thead><tbody>" + sTd + "</tbody></table>";
            }

            //jq对象
            $table = $(sTb);
            $thead = $table.find("thead");
            $tbody = $table.find("tbody");

            //给domElement设置数据缓存
            if (rows.length > 0) {
                $("tr", $tbody).each(function (index) {
                    var $tr = $(this);
                    $tr.data("rowData", rows[index]).data("index", index);
                })
            }
            else {
                $("tr", $tbody).data("rowData", null).data("index", 0);
            }

            //table载入前执行的方法
            if (typeof(options.onLoad) === "function") {
                options.onLoad.call(o, rows);
            }

            //绑定事件
            _buildEvent(o, $table, options);
            return $table;
        }
        else {
            var msg = "";
            if (options.url == "") {
                sTb = "";
            } else {
                msg = "列表数据请求有误";
                sTb = "<table cellpadding='0' cellspacing='0' border='0' class='list'>" +
                    "<tbody><tr><td align='center' style='color:red;font-weight:bold'>" + msg +
                    "</td></tr></tbody>" +
                    "</table>";
            }
            $table = $(sTb);
            $panel.data("getedData", false);
            total = 0;
            $panel.data("datagrid").options.total = total;
            return $table;
        }
    }
    var getReloadData = function (url, postPage, postData, o) {
        if (url == '') {
            return null;
        }
        var $panel = o;
        var json = null;
        var timeoutId;
        if (postPage != null) //正常请求表体数据
        {
            /*var dataSource = (url.split("?")[0] == undefined) ? "" : url.split("?")[0];
             var pram = (url.split("?")[1] == undefined) ? "" : url.split("?")[1];
             var strPagenate = "startPage=" + postPage.startPage + "&" + "limit=" + postPage.limit+"&oldPage="+postPage.oldPage+"&onePage="+postPage.onePage + "&totalNum=" + (postPage.totalNum || 0);
             if (pram != ""){
             pram = pram + "&" + strPagenate;
             }else{
             pram = strPagenate;
             }*/
            if (url.indexOf("?") > 0) {
                dataSource = url + "&random=" + Math.random();
            } else {
                dataSource = url + "?random=" + Math.random();
            }

            var pram = {};
            pram.startPage = postPage.startPage;
            pram.limit = postPage.limit;
            pram.oldPage = postPage.oldPage;
            pram.onePage = postPage.onePage;
            pram.totalNum = postPage.totalNum;
            if (typeof postData == "string") {
                pram.params = postData;
            } else if (typeof postData == "object") {
                pram.params = JSON.stringify(postData);
            }
        }
        else  //请求动态表头数据
        {
            var dataSource = url + "?random=" + Math.random();
            var pram = {};
        }
        try {
            $.ajax({
                url: dataSource,
                data: pram,
                async: false,
                beforeSend: function (xhr) {
                },
                success: function (data) {
                    if (typeof data == "string") {
                        json = RX.parseJson(data);
                    } else {
                        var nullData = {pageCurrent: 0, pageSize: 10, hasNext: false, rows: [], errmsg: ""}
                        if (data.hasOwnProperty("data") && data.hasOwnProperty("success")) {
                            if (data.success) {
                                json = data.data;
                            } else {
                                if (typeof data.msg != "undefined" && data.msg != null && data.msg != "") {
                                    nullData.errmsg = data.msg;
                                }
                                if (nullData.errmsg == "") {
                                    nullData.errmsg = "请求数据出错";
                                }
                                json = nullData;
                            }
                        } else {
                            json = nullData;
                        }

                    }
                },
                error: function () {
                },
                type: 'POST'
            });
        }
        catch (ex) {
            json = null;
        }
        return json;
    };
    var getReloadLocalData = function (data, o) {

        var $panel = o;
        var jsonData = {pageCurrent: 1, pageSize: data.length, hasNext: false, rows: data};

        return jsonData;
    };
    var _renderReloadDataGrid = function (o, options, pram, json) {

    }


    var _buildEvent = function (o, tb, options) {
        var $table = tb;
        var $trs = $("tbody tr", $table);
        var TimeFn = null;

        var hasSelected = false;

        //全选
        $table.on("click", "thead .chkAll", function () {
            $chk = $(this);
            if ($chk.attr("checked")) {
                $("tbody input[type='checkbox']", $table).not($(".disabledRow")).prop("checked", true);
                $trs.not($(".selectRow")).not($(".disabledRow")).addClass("selectRow");
            }
            else {
                $("tbody input[type='checkbox']", $table).prop("checked", false);
                $trs.removeClass("selectRow");
            }
        });
        if (options.columnMenu) {
            $table.on("mouseenter mouseleave ", "thead th", function (event) {
                var $th = $(this);
                if (event.type === "mouseenter") {
                    $th.find("button").css("opacity", "1")
                } else if (event.type === "mouseleave") {
                    $th.find("button").css("opacity", "0")
                }
            });
        }

        $table.on("click", "thead th button", function (event) {
            if (event.type === "click") {
            }
        });
        $table.on("keydown", "thead th input", function (event) {
            if (event.keyCode == 13) {
                $ipt = $(this);
                var postData = [];
                var param = {"zdName": $ipt.attr("name"), "value": $ipt.val()};
                postData.push(param);
                options.postData = postData;
                _reloadDataGrid(o, options);
            }
        });
        $table.on("click mouseenter mouseleave", "tbody tr.trhover", function (event) {
            var $tr = $(this);
            if (event.type === "mouseenter") {
                if (!$tr.hasClass("selectRow") && !$tr.hasClass("disabledRow"))
                    $tr.addClass("hover");
            } else if (event.type === "mouseleave") {
                $tr.removeClass("hover");
            } else if (event.type === "click") {
                //$tr.removeClass("hover");
                var index = $tr.data("index");
                var rowDate = $tr.data("rowData");
                var $curTag = $(event.target);
                if ($curTag.hasClass("grid-opt-stretch")) {
                    if (typeof(options.onStretchRowDetail) === "function") {
                        var $detailTr = $tr.next(".otherTd");
                        var detailStr = options.onStretchRowDetail.call(o, index, rowDate);
                        if ($detailTr.length === 0) {
                            var colSpan = options.columns.length;
                            if (options.checkbox)
                                colSpan = colSpan + 1;
                            if (options.ordinal)
                                colSpan = colSpan + 1;
                            detailStr = "<tr class='otherTd'><td colspan='" + colSpan + "'>" + detailStr + "</td></tr>";
                            $tr.after(detailStr);
                            $curTag.attr("rowspan", "2");
                            $curTag.html("-");
                        }
                        else {
                            if ($curTag.html() === "-") {
                                $curTag.html("+");
                                $tr.next(".otherTd").hide();
                                $curTag.attr("rowspan", "1");
                            }
                            else {
                                $curTag.html("-");
                                $tr.next(".otherTd").show();
                                $curTag.attr("rowspan", "2");
                            }
                        }
                        //  $table.off("click mouseenter mouseleave","tbody tr");
                    }
                }
                else {
                    if (!options.mulchose) //单选，去除其他选中
                    {
                        $("tr.selectRow", $table).not($tr).removeClass("selectRow");
                        $trs.not($tr).find("input[type='checkbox']").prop("checked", false);
                    }
                    if ($tr.hasClass("selectRow")) {    //已选中，出除选中
                        $tr.removeClass("selectRow");
                        $("input[type='checkbox']", $tr).prop("checked", false);
                        hasSelected = false;
                    }
                    else {   //未选中，增加选中
                        if (!$tr.hasClass("disabledRow")) {
                            $tr.addClass("selectRow");
                            $("input[type='checkbox']", $tr).prop("checked", true);
                            hasSelected = true;
                        }

                    }
                    if (options.mulchose) //全选，感知行变化，切换全选状态
                    {
                        var ifAll = true;
                        $trs.each(function (i, t) {
                            if (!$(t).hasClass("selectRow")) {
                                ifAll = false;
                                return false;
                            }
                        })
                        if (ifAll) {
                            $table.find("thead .chkAll").prop("checked", true);
                        } else {
                            $table.find("thead .chkAll").prop("checked", false);
                        }
                    }
                    if (typeof(options.onRowClick) === "function")
                        options.onRowClick.call(o, index, rowDate, hasSelected, event);
                }
                $tr.addClass("hover");
            }
        });
        $table.on("dblclick", "tbody tr.trhover", function (event) {
            // 取消上次延时未执行的方法
            clearTimeout(TimeFn);

            var $tr = $(this);
            var index = $tr.data("index");
            var rowData = $tr.data("rowData");
            if ($tr.hasClass("errortr")) {
                return;
            }
            if (!options.mulchose) //单选
            {
                hasSelected = true;
                $tr.addClass("selectRow");
                $("input[type='checkbox']", $tr).prop("checked", true);
            }
            if (!$tr.hasClass("disabledRow")) {
                if (typeof options.onRowDblClick === "function") {
                    options.onRowDblClick.call(o, index, rowData, event);
                }
            }
        });

        $("tr.trhover:nth-child(odd)", $table).addClass("se");

    }

    var _setPagenate = function (o, options) {
        if (options.limit == 0) {
            return;
        }
        var $panel = o;
        var total = options.total;
        var limit = options.limit;
        var selectedRows = [];   //定义选中数据行数据结构  [{pageNum:"",selectedRowsIds,[]}]
        var selectedRowIndex = []; //定义选中数据行index
        var selectedRowData = []; //定义选中数据行数据[{},{},{}]

        var $tabelWrap = $("div.outTwrap", $panel);
        if (total != null && total != 0) {
            var pageTotal = Math.ceil(total / options.limit); //页数
            var $paging, $pageUl, $pageDiv, $fristLi, $lastLi, $rollLis;//jq对象
            var parm = {}; //请求数据发送参数，用于分页
            var curNum = 1;
            var sLi = "";//分页li拼接字符串

            function buildPages(current) {
                sLi = "";
                //构造pagenate结构拼接字符串
                var sPageing = "<div class='rx-paging'>" +
                    "<ul class='rx-pagenate'><li class='rx-first paged'>首页</li>" +
                    "<li class='rx-pageRoll'>" +
                    "<div class='rx-pRoll' style='width: 175px;'>" +
                    "<ul class='rx-pRollUl'>";
                current = current || 1;
                current = parseInt(current, 10);
                var start = 1;
                var end = pageTotal;
                if (pageTotal <= 7) {
                    start = 1;
                    end = pageTotal;
                } else if (pageTotal - current <= 3) {
                    start = pageTotal - 6;
                    end = pageTotal;
                } else {
                    start = Math.max(1, current - 3);
                    end = Math.min(pageTotal, Math.max(current + 3, 7));
                }
                if (start > 1) {
                    sLi += "<li class='pagedn'>...</li>";
                }
                for (var i = start; i <= end; i++) {
                    if (i == (current || options.startPage || 1))
                        sLi += "<li class='clicked paged'>" + i + "</li>";
                    else
                        sLi += "<li class='paged'>" + i + "</li>";
                }
                if (end < pageTotal) {
                    sLi += "<li class='pagedn'>...</li>";
                }
                sPageing += sLi + "</ul></div></li>" +
                    "<li class='rx-last paged'>末页</li></ul>" +
                    "<span class='page_size'>" +
                    "共<b >" + Math.ceil(total / limit) + "</b>页" +
                    "<b>" + total + "</b>条数据</span>" +
                    "</div><div style='clear:both'></div>";
                $paging = $(sPageing);
                $tabelWrap.siblings().remove();
                $tabelWrap.after($paging);
                $pageUl = $('ul.rx-pagenate ', $paging);
                $pageDiv = $('div.rx-pRoll', $paging);
                $fristLi = $("li.rx-first", $paging);
                $lastLi = $("li.rx-last", $paging);
                if (current > 1) {
                    $fristLi.removeClass("disabled");
                } else {
                    $fristLi.addClass("disabled");
                }
                if (current < pageTotal) {
                    $lastLi.removeClass("disabled");
                } else {
                    $lastLi.addClass("disabled");
                }
                var width = $paging.find(".rx-pRollUl").find("li.paged").length * 29
                    + $paging.find(".rx-pRollUl").find("li.pagedn").length * 28;
                $pageUl.css("width", "auto");
                $pageDiv.css('width', width);
            }

            buildPages(options.startPage);

            function _bindBigLisEvents() {
                $pageUl.on("click mouseenter mouseleave", "li.paged", function (event) {
                    var $clkedLi = $(this);
                    if (event.type === "mouseenter") {
                        if (!$clkedLi.hasClass("clicked") && !$clkedLi.hasClass("disabled"))
                            $clkedLi.addClass("hover");
                    } else if (event.type === "mouseleave") {
                        $clkedLi.removeClass("hover");
                    } else if (!$clkedLi.hasClass("disabled")) {
                        //add by zl
                        var tempPageNum = $(".clicked", $pageDiv).text();
                        if ($clkedLi.hasClass("rx-first")) {
                            curNum = 1;
                        } else if ($clkedLi.hasClass("rx-last")) {
                            curNum = pageTotal;
                        } else {
                            curNum = $clkedLi.text();
                        }

                        //Zp.20180910.更新vm中页码
                        var vm = Rxvm.getViewModel(options.ModelName);
                        if(vm){
                            vm.set("pageNo", curNum);
                        }

                        parm = {startPage: curNum, limit: options.limit, totalNum: total || 0}; //请求数据发送参数，用于分页点击重载grid
                        $panel.data("curOrdNum", (parm.startPage - 1) * parm.limit + 1);

                        /* edit by zp 20171226 增加选中行保留功能 */
                        if (options.allPageChose) {
                            //数据存储
                            selectedRows = $panel.data("selectedRowsInfo") || [];
                            if (selectedRows.length > 0) {
                                selectedRows = $.grep(selectedRows, function (a, i) {   //过滤数组操作
                                    var oSelectedRowInfo = a;
                                    if (oSelectedRowInfo.pageNum == tempPageNum) {
                                        return true;
                                    }
                                }, true);
                            }
                            selectedRowIndex = [];
                            selectedRowData = [];
                            var $tempSelectedRows = $(".selectRow", $panel);
                            if ($tempSelectedRows.size()) {
                                $tempSelectedRows.each(function () {
                                    var tempIndex = $(this).data("index");
                                    var tempData = $(this).data("rowData");
                                    selectedRowIndex.push(tempIndex);
                                    selectedRowData.push(tempData);
                                });
                                var tempO = {
                                    "pageNum": tempPageNum,
                                    "selectedRowsIds": selectedRowIndex,
                                    "selectedRowsData": selectedRowData
                                };

                                if (!options.mulchose) {
                                    selectedRows = [];
                                }
                                selectedRows.push(tempO);
                            }
                            //数据存储
                            $panel.data("selectedRowsInfo", selectedRows);
                        }

                        //发送数据请求，重载grid
                        $table = _buildDataGrid($panel, options, parm)

                        $("div.outTwrap", $panel).html($table);
                        if (options.columnResize) {
                            $table.colResizable({minWidth: options.columnMinWidth});
                        }
                        buildPages(curNum);
                        _bindBigLisEvents();

                        if (options.allPageChose) {
                            setAllChooseSelect($panel, curNum);
                        }
                        renderSelObject($panel, options);
                        //end by zp

                        //table渲染后执行的方法
                        if (typeof(options.afterLoad) === "function") {
                            options.afterLoad.call(o, $table.data("rows"));
                        }

                        return;
                    }
                });
            }

            _bindBigLisEvents();
        }
        else {
            $tabelWrap.siblings().remove();
        }
    }
    var _setFastPagenate = function (o, options) {
        if (options.limit == 0) {
            return;
        }
        var $panel = o;
        var total = options.total;
        var selectedRows = $panel.data("selectedRowsInfo") || [];   //定义选中数据行数据结构  [{pageNum:"",selectedRowsIds,[]}]
        var selectedRowIndex = []; //定义选中数据行index
        var selectedRowData = []; //定义选中数据行数据[{},{},{}]
        var $tabelWrap = $("div.outTwrap", $panel);

        var pageTotal = Math.ceil(total / options.limit); //页数
        var $paging, $pageUl, $pageDiv, $fristLi, $lastLi, $rollLis;//jq对象
        var parm = {}; //请求数据发送参数，用于分页
        var curNum = 1;
        var sLi = "";//分页li拼接字符串

        function buildPages(current) {
            sLi = "";
            //构造pagenate结构拼接字符串
            var sPageing = "<div class='rx-paging' style='text-align:right'>" +
                //"<span class='grid-load'>数据加载中...</span>"+
                "<ul class='rx-pagenate'  style='float:left;'>" +
                /*"<li class='rx-pagecurrent disabled'>#pageCurrent#</li>"+*/
                "<li class='rx-prev' title='上一页'>上一页</li>" +
                "<li class='rx-next' title='下一页'>下一页</li>" +
                "</ul>" +
                "<span class='page-input'><input type='text' value='#pageCurrent#' title='输入跳转页码' style='width: 32px;'><button title='跳转'>GO</button></span>" +
                "</div>";
            current = current || 1;
            current = parseInt(current, 10);
            sPageing = sPageing.replace('#pageCurrent#', current);

            $paging = $(sPageing);
            $tabelWrap.siblings().remove();
            $tabelWrap.after($paging);
            $pageUl = $('ul.rx-pagenate ', $paging);

        }

        buildPages(options.startPage);

        if (options.hasNext) {
            $('ul.rx-pagenate', o).find('li.rx-next').removeClass("disabled");
        } else {
            $('ul.rx-pagenate', o).find('li.rx-next').addClass("disabled");

        }
        if (options.pageCurrent == null) {
            $('ul.rx-pagenate', o).find('li.rx-prev').addClass("disabled");
        } else if (options.pageCurrent <= 1) {
            $('ul.rx-pagenate', o).find('li.rx-prev').addClass("disabled");
        } else {
            $('ul.rx-pagenate', o).find('li.rx-prev').removeClass("disabled");
        }

        function _bindLisEvents() {

            $pageUl.on("click mouseenter mouseleave", "li", function (event) {
                var $clkedLi = $(this);
                if ($clkedLi.hasClass("disabled")) {
                    return;
                }
                if ($clkedLi.hasClass("runDisabled")) {
                    return;
                }
                if (event.type === "mouseenter") {
                    $clkedLi.addClass("hover");
                } else if (event.type === "mouseleave") {
                    $clkedLi.removeClass("hover");
                } else {
                    $clkedLi.addClass("runDisabled");
                    $clkedLi.prop("disabled", true);
                    setTimeout(function () {
                        var tempPageNum = options.startPage;
                        /*  $(".clicked", $pageUl).removeClass("clicked");*/
                        /* $clkedLi.removeClass("hover")*/

                        if ($clkedLi.hasClass("rx-prev")) {
                            curNum = parseInt(options.startPage, 10) - 1;
                            $('ul.rx-pagenate', o).find('li.rx-pagecurrent').html(curNum);
                            $('span.page-input', o).find('input').val(curNum);
                            if ($('ul.rx-pagenate', o).find('li.rx-next').hasClass("hover")) {
                                $('ul.rx-pagenate', o).find('li.rx-next').removeClass("hover");
                            }
                        } else {
                            curNum = parseInt(options.startPage, 10) + 1;
                            $('ul.rx-pagenate', o).find('li.rx-pagecurrent').html(curNum);
                            $('span.page-input', o).find('input').val(curNum);
                            if ($('ul.rx-pagenate', o).find('li.rx-prev').hasClass("hover")) {
                                $('ul.rx-pagenate', o).find('li.rx-prev').removeClass("hover");
                            }
                        }

                        /* edit by zp 20171226 增加选中行保留功能 */
                        if (options.allPageChose) {
                            //数据存储
                            selectedRows = $panel.data("selectedRowsInfo") || [];
                            if (selectedRows.length > 0) {
                                selectedRows = $.grep(selectedRows, function (a, i) {   //过滤数组操作
                                    var oSelectedRowInfo = a;
                                    if (oSelectedRowInfo.pageNum == tempPageNum) {
                                        return true;
                                    }
                                }, true);
                            }
                            selectedRowIndex = [];
                            selectedRowData = [];
                            var $tempSelectedRows = $(".selectRow", $panel);
                            if ($tempSelectedRows.size()) {
                                $tempSelectedRows.each(function () {
                                    var tempIndex = $(this).data("index");
                                    var tempData = $(this).data("rowData");
                                    selectedRowIndex.push(tempIndex);
                                    selectedRowData.push(tempData);
                                });
                                var tempO = {
                                    "pageNum": tempPageNum,
                                    "selectedRowsIds": selectedRowIndex,
                                    "selectedRowsData": selectedRowData
                                };

                                selectedRows.push(tempO);
                            }
                            //数据存储
                            $panel.data("selectedRowsInfo", selectedRows);
                        }

                        parm = {startPage: curNum, limit: options.limit, totalNum: total || 0}; //请求数据发送参数，用于分页
                        $panel.data("curNum", curNum);
                        $panel.data("curOrdNum", (parm.startPage - 1) * parm.limit + 1);

                        //发送数据请求
                        $table = _buildDataGrid($panel, options, parm);
                        $("div.outTwrap", $panel).html($table);
                        //渲染已选的数据
                        if (options.allPageChose) {
                            setAllChooseSelect($panel, curNum);
                        }
                        if (options.columnResize) {
                            $table.colResizable({minWidth: options.columnMinWidth});
                        }
                        //end by zp
                        $clkedLi.removeClass("runDisabled");
                        $clkedLi.prop("disabled", false);
                        //table渲染后执行的方法
                        if (typeof(options.afterLoad) === "function") {
                            options.afterLoad.call(o, $table.data("rows"));
                        }
                    }, 10);
                }
            });
            $pageGo = $('span.page-input', o);
            $pageGo.on("keyup", "input", function (event) {
                var val = $(this).val();
                if (val != "") {
                    var result1 = val.match(/^[-\+]?\d+$/);
                    if (result1 == null || parseInt(val) <= 0) {
                        $(this).val(pools[options.ModelName].queryNo);
                    }
                }
            });
            $pageGo.on("blur", "input", function (event) {
                var val = $(this).val();
                var result1 = val.match(/^[-\+]?\d+$/);
                if (val == "" || result1 == null) {
                    $(this).val(pools[options.ModelName].queryNo);
                }
            });
            $pageGo.on("click", "button", function (event) {
                var $clkedBt = $(this);
                var pageGo = $("span.page-input input").val();
                curNum = pageGo;
                var tempPageNum = options.startPage;
                /*  $(".clicked", $pageUl).removeClass("clicked");*/
                /* $clkedLi.removeClass("hover")*/

                /*if($clkedLi.hasClass("rx-prev")){
                 curNum = parseInt(options.startPage,10)-1;
                 $('ul.rx-pagenate',o).find('li.rx-pagecurrent').html(curNum);
                 $('span.page-input',o).find('input').val(curNum);
                 if($('ul.rx-pagenate',o).find('li.rx-next').hasClass("hover")){
                 $('ul.rx-pagenate',o).find('li.rx-next').removeClass("hover");
                 }
                 }else{
                 curNum = parseInt(options.startPage,10)+1;
                 $('ul.rx-pagenate',o).find('li.rx-pagecurrent').html(curNum);
                 $('span.page-input',o).find('input').val(curNum);
                 if($('ul.rx-pagenate',o).find('li.rx-prev').hasClass("hover")){
                 $('ul.rx-pagenate',o).find('li.rx-prev').removeClass("hover");
                 }
                 }*/


                /* edit by zp 20171226 增加选中行保留功能 */
                if (options.allPageChose) {
                    //数据存储
                    selectedRows = $panel.data("selectedRowsInfo") || [];
                    if (selectedRows.length > 0) {
                        selectedRows = $.grep(selectedRows, function (a, i) {   //过滤数组操作
                            var oSelectedRowInfo = a;
                            if (oSelectedRowInfo.pageNum == tempPageNum) {
                                return true;
                            }
                        }, true);
                    }
                    selectedRowIndex = [];
                    selectedRowData = [];
                    var $tempSelectedRows = $(".selectRow", $panel);
                    if ($tempSelectedRows.size()) {
                        $tempSelectedRows.each(function () {
                            var tempIndex = $(this).data("index");
                            var tempData = $(this).data("rowData");
                            selectedRowIndex.push(tempIndex);
                            selectedRowData.push(tempData);
                        });
                        var tempO = {
                            "pageNum": tempPageNum,
                            "selectedRowsIds": selectedRowIndex,
                            "selectedRowsData": selectedRowData
                        };

                        selectedRows.push(tempO);
                    }
                    //数据存储
                    $panel.data("selectedRowsInfo", selectedRows);
                }

                parm = {startPage: curNum, limit: options.limit, totalNum: total || 0}; //请求数据发送参数，用于分页
                $panel.data("curOrdNum", (parm.startPage - 1) * parm.limit + 1);
                //发送数据请求
                $table = _buildDataGrid($panel, options, parm);
                $("div.outTwrap", $panel).html($table);
                if (options.columnResize) {
                    $table.colResizable({minWidth: options.columnMinWidth});
                }
                //渲染已选的数据
                if (options.allPageChose) {
                    setAllChooseSelect($panel, curNum);
                }

                //table渲染后执行的方法
                if (typeof(options.afterLoad) === "function") {
                    options.afterLoad.call(o, $table.data("rows"));
                }
                //end by zl
                return;
            });
        }

        _bindLisEvents();


    }

    var _reloadDataGrid = function (o, options) {
        var $panel = $(o[0]);
        var options = $panel.data("datagrid").options;
        $panel.data("curOrdNum", 1);
        var postPage = {startPage: options.startPage, limit: options.limit};
        var $table = _buildReloadDataGrid($panel, options, postPage);
        $(".outTwrap", $panel).html($table);
        if (options.columnResize) {
            $table.colResizable({minWidth: options.columnMinWidth});
        }
        if (options.pagination) {
            if (options.fastPagenate) {
                _setFastPagenate($panel, options);
            } else {
                _setPagenate($panel, options);
            }
        }

    }
    $.fn.datagrid = function (p1, p2) {
        if (typeof p1 == "string")   //扩展方法
        {
            var fun = methods[p1];
            if (fun != null) {
                return fun(this, p2);
            }
        }
        else {
            var defaults = //默认option参数
                {
                    title: "标题",
                    width: "500px",
                    height: "200px",
                    url: "",
                    postData: {},//
                    pagination: true,
                    fastPagenate: false,
                    mulchose: true, //多选
                    checkbox: false, //checkbox
                    stretch: false, //展开详细内容
                    ordinal: true, //是否有序号
                    columns: [],
                    limit: 10,
                    startPage: 1,
                    allPageChose: false,//是否开启全页选择
                    dischose: false,//是否开启禁用某行的选择（根据 disObject 配置的数据进行筛选）
                    //cids:[],
                    disObject: {},//配合dischose 实现根据配置的字段及字段值去禁止对应数据的可选性 如：{id:[11209,11208]}，{htlb:[1,4]}
                    columnResize: false,//列宽个可拖动
                    columnMinWidth: 100,//设置可拖动表头最小宽度
                    autoColumn: false,//自动生成表头
                    filterThead: false,//表头筛选
                    columnMenu: false,//表头菜单//还没实现 //todo
                    showchkAll: true,//是否显示全选框,
                    tempPageSize: 5, //数据缓冲区大小
                    newThead: null, //自定义表头
                    canCopy: false, //列表数据是否可选中复制
                    /**
                     *
                     * @param rowIndex
                     * @param rowData
                     */
                    onRowClick: function (rowIndex, rowData, isSelected, event) {
                    },
                    onRowDblClick: function (rowIndex, rowData, event) {
                    },
                    /**
                     *
                     * @param rowIndex
                     * @param rowData
                     */
                    onStretchRowDetail: function (rowIndex, rowData, event) {
                    },
                    /**
                     *
                     */
                    onLoad: function (data) {
                    },
                    afterLoad: function (data) {
                    }
                }
        }

        return this.each
        (
            function () {
                var options = $.extend({}, defaults, p1);  //合并默认方法和自定义方法
                options.ModelName = p1.ModelName;
                pools[options.ModelName] = new TempPagePool();
                var $panel = $(this);
                $panel.data("datagrid", {options: options});  //缓存option方法
                //try {
                var pageNo = options.pageNo || 1;
                $panel.data("curOrdNum", pageNo);
                var postPage = {startPage: pageNo, limit: options.limit};
                var $table = _buildDataGrid($panel, options, postPage, p2);
                var $tableWrap = $("<div class='outTwrap'></div>").html($table);
                $panel.html($tableWrap);  //调用初始化函数，生成table主体
                if (options.columnResize) {//调用列宽拖动的函数
                    $table.colResizable({minWidth: options.columnMinWidth});
                }
                if (options.pagination) {
                    if (options.fastPagenate) {
                        _setFastPagenate($panel, options);
                    } else {
                        _setPagenate($panel, options);
                    }
                }
                //table渲染后执行的方法
                if (typeof(options.afterLoad) === "function") {
                    options.afterLoad.call($panel, $table.data("rows"));
                }

                function reloadByOrderType(clickTr, orderType) {
                    var $this = $(clickTr);
                    //哪个字段
                    var dataId = $this.parent().attr("dataId");
                    //获取colums中对应的字段
                    var options = $panel.data("datagrid").options;
                    var columns = options.columns, targetColumn;
                    for (var i = 0, maxLength = columns.length; i < maxLength; i++) {
                        if (!targetColumn && (columns[i].id == dataId)) {
                            targetColumn = columns[i];
                        } else {
                            columns[i].orderByType = "";
                        }
                    }
                    var ascIds, descIds;
                    //重复点击还原
                    if (targetColumn.orderByType === orderType) {
                        targetColumn.orderByType = "";
                    } else {
                        targetColumn.orderByType = orderType;
                        if (orderType === "asc") {
                            ascIds = dataId;
                        } else if (orderType === "desc") {
                            descIds = dataId;
                        }
                    }
                    $panel.datagrid('freshTempPool');
                    options.ascIds = ascIds;
                    options.descIds = descIds;
                    options.startPage = 1;
                    methods.reload($panel);
                }

                //升序
                $panel.on("click", ".sorting_desc_top", function () {
                    reloadByOrderType(this, "asc");
                })
                //降序
                $panel.on("click", ".sorting_desc_bottom", function () {
                    reloadByOrderType(this, "desc");
                })
            }
        )

    };

    var methods = //扩展方法对象
        {
            options: function (o, option) {
                var $panel = $(o[0]);
                if (option == undefined) {
                    var options = $panel.data("datagrid").options;
                    return options
                } else {
                    return null;
                }
            },

            setDataSource: function (o, datasource) {
                var $panel = $(o[0]);
                var options = $panel.data("datagrid").options;
                options.url = datasource;
                $panel.data("curOrdNum", 1);
                $panel.data("selectedRowsInfo", null);
                /*
                 惠民项目定制功能
                 &$20$
                 */
                //add by zl
                if (datasource.indexOf("$") > 0) {
                    options.limit = $.trim(datasource.split("$")[1]);
                    $panel.data("datagrid", {options: options});  //重新缓存option方法
                }
                //end add
                var postPage = {startPage: 1, limit: options.limit};
                var $table = _buildDataGrid($panel, options, postPage);
                //$(".outTwrap", $panel).html(_buildDataGrid($panel, options, postPage));
                $(".outTwrap", $panel).html($table);
                if (options.columnResize) {
                    $table.colResizable({minWidth: options.columnMinWidth});
                }
                if (options.pagination) {
                    if (options.fastPagenate) {
                        _setFastPagenate($panel, options);
                    } else {
                        _setPagenate($panel, options);
                    }
                }
                //table渲染后执行的方法
                if (typeof(options.afterLoad) === "function") {
                    options.afterLoad.call($panel, $table.data("rows"));
                }
                return $panel;
            },

            reload: function (o, needSetting) {
                var $panel = $(o[0]);
                var options = $panel.data("datagrid").options;
                $panel.data("curOrdNum", 1);
                $panel.data("selectedRowsInfo", []);
                var postPage = {startPage: options.startPage, limit: options.limit};
                var $table = _buildDataGrid($panel, options, postPage, needSetting);
                $(".outTwrap", $panel).html($table);
                if (options.columnResize) {
                    $table.colResizable({minWidth: options.columnMinWidth});
                }
                if (options.pagination) {
                    if (options.fastPagenate) {
                        _setFastPagenate($panel, options);
                    } else {
                        _setPagenate($panel, options);
                    }
                }

                //table渲染后执行的方法
                if (typeof(options.afterLoad) === "function") {
                    options.afterLoad.call($panel, $table.data("rows"));
                }

                return $panel;
            },
            freshTempPool: function (o) {
                var $panel = $(o[0]);
                var options = $panel.data("datagrid").options;
                if (options.pagination) {
                    pools[options.ModelName].freshTempPool();
                }
                return $panel;
            },
            getAllData: function (o) {
                var $panel = $(o[0]);
                var options = $panel.data("datagrid").options;
                var arrDataRows = [];
                var oDataRow = {};
                var selectedRows = $(".trhover", $panel);
                selectedRows.each(function (index) {
                    oDataRow = $(this).data("rowData");
                    arrDataRows.push(oDataRow);
                });
                return arrDataRows;
            },
            getSelected: function (o, checkTag) {
                var $panel = $(o[0]);
//            try {
                var options = $panel.data("datagrid").options;
                var arrDataRows = [];
                var oDataRow = {};
                if (checkTag) {
                    var selectedRows = $(".selectRow", $panel);
                    selectedRows.each(function (index) {
                        oDataRow = $(this).data("rowData");
                        if (oDataRow) arrDataRows.push(oDataRow);
                    });
                    if (options.mulchose && options.allPageChose) {
                        var storedData = $panel.data("selectedRowsInfo");
                        if (storedData != undefined && storedData != null) {
                            storedData = $.grep(storedData, function (a, i) {   //过滤数组操作
                                var oSelectedRowInfo = a;
                                if (oSelectedRowInfo.pageNum == options.startPage) {
                                    return true;
                                }
                            }, true);
                            $(storedData).each(function () {
                                var tempInfo = $(this).get(0);
                                var tempData = tempInfo.selectedRowsData;
                                if ($(tempData).size()) {
                                    for (var i = 0; i < tempData.length; i++) {
                                        arrDataRows.push(tempData[i]);
                                    }
                                }
                            })
                        }
                    }
                } else {
                    var selectedRows = $("tbody tr", $panel);
                    selectedRows.each(function (index) {
                        if (!$(this).hasClass("selectRow")) {
                            oDataRow = $(this).data("rowData");
                            if (oDataRow) arrDataRows.push(oDataRow);
                        }
                    });
                }
//            }
//            catch (ex) {
//                arrDataRows = [];
//            }
                return arrDataRows;
            },
            setSelected: function (o, arr) {
                var $panel = $(o[0]);
                var rtn;
                var srtn;
                var arrDataRows = [];
                var oDataRow = {};
                var options = $panel.data("datagrid").options;
                if ($panel.data("getedData")) {
                    if (arr.length > 1 && !options.mulchose) {
                        alert("改列表设置为单选列表,不可选中多行数据!");
                        return null;
                    }

                    $(".list tbody tr").each(function (index) {
                        var $tr = $(this);
                        var tId = $tr.data("rowData");
                        tId = tId.id || tId.ID;
                        if (!tId) {
                            return null;
                        }
                        else {
                            rtn = $.inArray(tId, arr);
                            srtn = $.inArray(tId.toString(), arr);
                            if (rtn != "-1" || srtn != "-1") {
                                $tr.addClass("selectRow");
                                if ($("td.grid-opt-chk input", $tr).size())
                                    $("td.grid-opt-chk input", $tr).prop("checked", true);
                                oDataRow = $(this).data("rowData");
                                arrDataRows.push(oDataRow);
                            }
                        }
                    });
                    if (options.allPageChose) {

                    }
                    return arrDataRows;
                }
                else {
                    return null;
                }
            },
            hasGetedData: function (o) {
                var $panel = $(o[0]);
                var isSuccess = $panel.data("getedData");
                return isSuccess;
            }
        };
})(jQuery);

/**可拖动列宽**/
(function ($) {
    var d = $(document);
    var h = $("head");
    var drag = null;
    var tables = [];
    var count = 0;

    //common strings for packing
    var ID = "id";
    var PX = "px";
    var SIGNATURE = "JColResizer";
    var FLEX = "JCLRFlex";

    //short-cuts
    var I = parseInt;
    var M = Math;
    var ie = navigator.userAgent.indexOf('Trident/4.0') > 0;
    var S;
    try {
        S = sessionStorage;
    } catch (e) {
    }	//Firefox crashes when executed as local file system

    //append required CSS rules
    h.append("<style type='text/css'>  .JColResizer{table-layout:fixed;} .JColResizer td, .JColResizer th{overflow:hidden;padding-left:0!important; padding-right:0!important;}  .JCLRgrips{ height:0px; position:relative;} .JCLRgrip{margin-left:-5px; position:absolute; z-index:5; } .JCLRgrip .JColResizer{position:absolute;background-color:red;filter:alpha(opacity=1);opacity:0;width:10px;height:100%;cursor: e-resize;top:0px} .JCLRLastGrip{position:absolute; width:1px; } .JCLRgripDrag{ border-left:1px dotted black;	} .JCLRFlex{width:auto!important;}</style>");

    var init = function (tb, options) {
        var t = $(tb);										//the table object is wrapped
        t.opt = options;
        if (t.opt.disable) return destroy(t);				//the user is asking to destroy a previously colResized table
        var id = t.id = t.attr(ID) || SIGNATURE + count++;	//its id is obtained, if null new one is generated
        t.p = t.opt.postbackSafe; 							//short-cut to detect postback safe
        if (!t.is("table") || tables[id] && !t.opt.partialRefresh) return; 		//if the object is not a table or if it was already processed then it is ignored.
        t.addClass(SIGNATURE).attr(ID, id).before('<div class="JCLRgrips"/>');	//the grips container object is added. Signature class forces table rendering in fixed-layout mode to prevent column's min-width
        t.g = [];
        t.c = [];
        t.w = t.width();
        t.gc = t.prev();
        t.f = t.opt.fixed;	//t.c and t.g are arrays of columns and grips respectively
        if (options.marginLeft) t.gc.css("marginLeft", options.marginLeft);  	//if the table contains margins, it must be specified
        if (options.marginRight) t.gc.css("marginRight", options.marginRight);  	//since there is no (direct) way to obtain margin values in its original units (%, em, ...)
        t.cs = I(ie ? tb.cellSpacing || tb.currentStyle.borderSpacing : t.css('border-spacing')) || 2;	//table cellspacing (not even jQuery is fully cross-browser)
        t.b = I(ie ? tb.border || tb.currentStyle.borderLeftWidth : t.css('border-left-width')) || 1;	//outer border width (again cross-browser issues)
        // if(!(tb.style.width || tb.width)) t.width(t.width()); //I am not an IE fan at all, but it is a pity that only IE has the currentStyle attribute working as expected. For this reason I can not check easily if the table has an explicit width or if it is rendered as "auto"
        tables[id] = t; 	//the table object is stored using its id as key
        createGrips(t);		//grips are created

    };
    var destroy = function (t) {
        var id = t.attr(ID), t = tables[id];		//its table object is found
        if (!t || !t.is("table")) return;			//if none, then it wasn't processed
        t.removeClass(SIGNATURE + " " + FLEX).gc.remove();	//class and grips are removed
        delete tables[id];						//clean up data
    };

    var createGrips = function (t) {
        var th = t.find(">thead>tr>th,>thead>tr>td");	//if table headers are specified in its semantically correct tag, are obtained
        if (!th.length) th = t.find(">tbody>tr:first>th,>tr:first>th,>tbody>tr:first>td, >tr:first>td");	 //but headers can also be included in different ways
        th = th.filter(":visible");					//filter invisible columns
        t.cg = t.find("col"); 						//a table can also contain a colgroup with col elements
        t.ln = th.length;							//table length is stored
        if (t.p && S && S[t.id]) memento(t, th);		//if 'postbackSafe' is enabled and there is data for the current table, its coloumn layout is restored
        th.each(function (i) {						//iterate through the table column headers
            var c = $(this); 						//jquery wrap for the current column
            var g = $(t.gc.append('<div class="JCLRgrip"></div>')[0].lastChild); //add the visual node to be used as grip
            g.append(t.opt.gripInnerHtml).append('<div class="' + SIGNATURE + '"></div>');
            if (i == t.ln - 1) {
                g.addClass("JCLRLastGrip");
                if (t.f) g.html("");
            }
            g.bind('touchstart mousedown', onGripMouseDown); //bind the mousedown event to start dragging

            g.t = t;
            g.i = i;
            g.c = c;
            c.w = c.width();		//some values are stored in the grip's node data
            t.g.push(g);
            t.c.push(c);						//the current grip and column are added to its table object
            c.width(c.w).removeAttr("width");				//the width of the column is converted into pixel-based measurements
            g.data(SIGNATURE, {i: i, t: t.attr(ID), last: i == t.ln - 1});	 //grip index and its table name are stored in the HTML
        });
        t.cg.removeAttr("width");	//remove the width attribute from elements in the colgroup
        syncGrips(t); 				//the grips are positioned according to the current table layout
        //there is a small problem, some cells in the table could contain dimension values interfering with the
        //width value set by this plugin. Those values are removed
        t.find('td, th').not(th).not('table th, table td').each(function () {
            $(this).removeAttr('width');	//the width attribute is removed from all table cells which are not nested in other tables and dont belong to the header
        });
        if (!t.f) {
            t.removeAttr('width').addClass(FLEX); //if not fixed, let the table grow as needed
        }
    };


    var memento = function (t, th) {
        var w, m = 0, i = 0, aux = [], tw;
        if (th) {										//in deserialization mode (after a postback)
            t.cg.removeAttr("width");
            if (t.opt.flush) {
                S[t.id] = "";
                return;
            } 	//if flush is activated, stored data is removed
            w = S[t.id].split(";");					//column widths is obtained
            tw = w[t.ln + 1];
            if (!t.f && tw) t.width(tw);			//it not fixed and table width data available its size is restored
            for (; i < t.ln; i++) {						//for each column
                aux.push(100 * w[i] / w[t.ln] + "%"); 	//width is stored in an array since it will be required again a couple of lines ahead
                th.eq(i).css("width", aux[i]); 	//each column width in % is restored
            }
            for (i = 0; i < t.ln; i++)
                t.cg.eq(i).css("width", aux[i]);	//this code is required in order to create an inline CSS rule with higher precedence than an existing CSS class in the "col" elements
        } else {							//in serialization mode (after resizing a column)
            S[t.id] = "";				//clean up previous data
            for (; i < t.c.length; i++) {	//iterate through columns
                w = t.c[i].width();		//width is obtained
                S[t.id] += w + ";";		//width is appended to the sessionStorage object using ID as key
                m += w;					//carriage is updated to obtain the full size used by columns
            }
            S[t.id] += m;							//the last item of the serialized string is the table's active area (width),
            //to be able to obtain % width value of each columns while deserializing
            if (!t.f) S[t.id] += ";" + t.width(); 	//if not fixed, table width is stored
        }
    };


    var syncGrips = function (t) {
        t.gc.width(t.w);			//the grip's container width is updated
        for (var i = 0; i < t.ln; i++) {	//for each column
            var c = t.c[i];
            t.g[i].css({			//height and position of the grip is updated according to the table layout
                left: c.offset().left - t.offset().left + c.outerWidth(false) + t.cs / 2 + PX,
                height: t.opt.headerOnly ? t.c[0].outerHeight(false) : t.outerHeight(false)
            });
        }
    };

    var syncCols = function (t, i, isOver) {
        var inc = drag.x - drag.l, c = t.c[i], c2 = t.c[i + 1];
        var w = c.w + inc;
        var w2 = c2.w - inc;	//their new width is obtained
        c.width(w + PX);
        t.cg.eq(i).width(w + PX);
        if (t.f) { //if fixed mode
            c2.width(w2 + PX);
            t.cg.eq(i + 1).width(w2 + PX);
        }
        if (isOver) {
            c.w = w;
            c2.w = t.f ? w2 : c2.w;
        }
    };

    var applyBounds = function (t) {
        var w = $.map(t.c, function (c) {			//obtain real widths
            return c.width();
        });
        t.width(t.width()).removeClass(FLEX);	//prevent table width changes
        $.each(t.c, function (i, c) {
            c.width(w[i]).w = w[i];				//set column widths applying bounds (table's max-width)
        });
        t.addClass(FLEX);						//allow table width changes
    };

    var onGripDrag = function (e) {
        if (!drag) return;
        var t = drag.t;		//table object reference
        var oe = e.originalEvent.touches;
        var ox = oe ? oe[0].pageX : e.pageX;    //original position (touch or mouse)
        var x = ox - drag.ox + drag.l;	        //next position according to horizontal mouse position increment
        var mw = t.opt.minWidth, i = drag.i;	//cell's min width
        var l = t.cs * 1.5 + mw + t.b;
        var last = i == t.ln - 1;                 			//check if it is the last column's grip (usually hidden)
        var min = i ? t.g[i - 1].position().left + t.cs + mw : l;	//min position according to the contiguous cells
        var max = t.f ? 	//fixed mode?
            i == t.ln - 1 ?
                t.w - l :
                t.g[i + 1].position().left - t.cs - mw :
            Infinity; 								//max position according to the contiguous cells
        x = M.max(min, M.min(max, x));				//apply bounding
        drag.x = x;
        drag.css("left", x + PX); 	//apply position increment
        if (last) {									//if it is the last grip
            var c = t.c[drag.i];					//width of the last column is obtained
            drag.w = c.w + x - drag.l;
        }
        if (t.opt.liveDrag) { 			//if liveDrag is enabled
            if (last) {
                c.width(drag.w);
                t.w = t.width();
            } else {
                syncCols(t, i); 			//columns are synchronized
            }
            syncGrips(t);
            var cb = t.opt.onDrag;							//check if there is an onDrag callback
            if (cb) {
                e.currentTarget = t[0];
                cb(e);
            }		//if any, it is fired
        }
        return false; 	//prevent text selection while dragging
    };

    var onGripDragOver = function (e) {

        d.unbind('touchend.' + SIGNATURE + ' mouseup.' + SIGNATURE).unbind('touchmove.' + SIGNATURE + ' mousemove.' + SIGNATURE);
        $("head :last-child").remove(); 				//remove the dragging cursor style
        if (!drag) return;
        drag.removeClass(drag.t.opt.draggingClass);		//remove the grip's dragging css-class
        var t = drag.t;
        var cb = t.opt.onResize; 	    //get some values
        var i = drag.i;                 //column index
        var last = i == t.ln - 1;         //check if it is the last column's grip (usually hidden)
        var c = t.g[i].c;               //the column being dragged
        if (last) {
            c.width(drag.w);
            c.w = drag.w;
        } else {
            syncCols(t, i, true);	//the columns are updated
        }
        if (!t.f) applyBounds(t);	//if not fixed mode, then apply bounds to obtain real width values
        syncGrips(t);				//the grips are updated
        if (cb) {
            e.currentTarget = t[0];
            cb(e);
        }	//if there is a callback function, it is fired
        if (t.p && S) memento(t); 						//if postbackSafe is enabled and there is sessionStorage support, the new layout is serialized and stored
        drag = null;									//since the grip's dragging is over
    };

    var onGripMouseDown = function (e) {
        var o = $(this).data(SIGNATURE);			//retrieve grip's data
        var t = tables[o.t], g = t.g[o.i];			//shortcuts for the table and grip objects
        var oe = e.originalEvent.touches;           //touch or mouse event?
        g.ox = oe ? oe[0].pageX : e.pageX;            //the initial position is kept
        g.l = g.position().left;
        d.bind('touchmove.' + SIGNATURE + ' mousemove.' + SIGNATURE, onGripDrag).bind('touchend.' + SIGNATURE + ' mouseup.' + SIGNATURE, onGripDragOver);	//mousemove and mouseup events are bound
        h.append("<style type='text/css'>*{cursor:" + t.opt.dragCursor + "!important}</style>"); 	//change the mouse cursor
        g.addClass(t.opt.draggingClass); 	//add the dragging class (to allow some visual feedback)
        drag = g;							//the current grip is stored as the current dragging object
        if (t.c[o.i].l) for (var i = 0, c; i < t.ln; i++) {
            c = t.c[i];
            c.l = false;
            c.w = c.width();
        } 	//if the colum is locked (after browser resize), then c.w must be updated
        return false; 	//prevent text selection
    };

    var onResize = function () {
        for (t in tables) {
            var t = tables[t], i, mw = 0;
            // t.removeClass(SIGNATURE);						//firefox doesn't like layout-fixed in some cases
            if (t.f && t.w != t.width()) {					//if the the table's width has changed and it is in fixed mode
                t.w = t.width();							//its new value is kept the active cells area is obtained
                for (i = 0; i < t.ln; i++) mw += t.c[i].w;
                //cell rendering is not as trivial as it might seem, and it is slightly different for
                //each browser. In the beginning i had a big switch for each browser, but since the code
                //was extremely ugly now I use a different approach with several re-flows. This works
                //pretty well but it's a bit slower. For now, lets keep things simple...
                for (i = 0; i < t.ln; i++) t.c[i].css("width", M.round(1000 * t.c[i].w / mw) / 10 + "%").l = true;
                //c.l locks the column, telling us that its c.w is outdated
            }
            try {
                asyncGrips(t.addClass(SIGNATURE));
            }
            catch (e) {
            }
        }

    };
    //bind resize event, to update grips position
    $(window).bind('resize.' + SIGNATURE, onResize);

    $.fn.extend({
        colResizable: function (options) {
            var defaults = {
                draggingClass: 'JCLRgripDrag',	//css-class used when a grip is being dragged (for visual feedback purposes)
                gripInnerHtml: '',				//if it is required to use a custom grip it can be done using some custom HTML
                liveDrag: true,				//enables table-layout updating while dragging
                fixed: true,                    //table width does not change if columns are resized
                minWidth: 30, 					//minimum width value in pixels allowed for a column
                headerOnly: false,				//specifies that the size of the the column resizing anchors will be bounded to the size of the first row
                hoverCursor: "e-resize",  		//cursor to be used on grip hover
                dragCursor: "e-resize",  		//cursor to be used while dragging
                postbackSafe: false, 			//when it is enabled, table layout can persist after postback or page refresh. It requires browsers with sessionStorage support (it can be emulated with sessionStorage.js).
                flush: false, 					//when postbakSafe is enabled, and it is required to prevent layout restoration after postback, 'flush' will remove its associated layout data
                marginLeft: null,				//in case the table contains any margins, colResizable needs to know the values used, e.g. "10%", "15em", "5px" ...
                marginRight: null, 				//in case the table contains any margins, colResizable needs to know the values used, e.g. "10%", "15em", "5px" ...
                disable: false,					//disables all the enhancements performed in a previously colResized table
                partialRefresh: false,			//can be used in combination with postbackSafe when the table is inside of an updatePanel

                //events:
                onDrag: null, 					//callback function to be fired during the column resizing process if liveDrag is enabled
                onResize: null					//callback function fired when the dragging process is over
            }
            var options = $.extend(defaults, options);
            return this.each(function () {
                init(this, options);
            });
        }
    });
})(jQuery);