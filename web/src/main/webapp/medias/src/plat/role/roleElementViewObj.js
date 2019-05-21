/**
 * Created by Administrator on 2018-1-9.
 */
function ShowRoleGlObj(roleId, limit) {
    var _initGrid = initGrid();
    if (roleId) {
        $.ajax({
            type: "post",
            url: "/role/getGlxxByRole",
            data: {roleId: roleId, type: "show"},
            success: function (ar) {
                if (ar.success) {
                    $(".glinfo_box").show();
                    $(".glinfo_content").show();
                    $(".glinfo_left_item").on("click", function () {
                        $(".glinfo_left_item").removeClass("glinfo_left_select");
                        $(this).addClass("glinfo_left_select");
                    });
                    var data = ar.data;
                    $("#glinfoOrgan").on("click", function () {
                        _initGrid(data.organs);
                    }).trigger("click");

                    $("#glinfoInUser").on("click", function () {
                        _initGrid(data.inUsers);
                    });

                    $("#glinfoOutUser").on("click", function () {
                        _initGrid(data.outUsers);
                    });
                } else {
                    RX.alert(ar.msg);
                }
            }
        });
    } else {
        return;
    }

    function initGrid() {
        var glinfoGrid = {
            data: [],
            searchData: [],
            searchName: "",
            total: 0,
            limit: 12,
            pageMax: 1,
            pageNum: 1
        }
        var $ul = $(".ulDiv"), $paging = $(".rx-paging");

        function renderPageData() {
            $ul.empty();
            var handleData = glinfoGrid.searchName ? glinfoGrid.searchData : glinfoGrid.data;
            var renderArr = [];
            for (var i = (glinfoGrid.pageNum - 1) * glinfoGrid.limit; i < (glinfoGrid.pageNum) * glinfoGrid.limit && i < glinfoGrid.allTotal; i++) {

                handleData[i]._index = i;
                handleData[i].saveObj = {
                    saveValue: (handleData[i].saveFlag ? (handleData[i].saveValue ? handleData[i].saveValue : "2") : "2"),
                    info: handleData[i].info
                };
                handleData[i].saveObj.saveValue === "2" && renderArr.push(handleData[i]);
            }
            new Rxvm({
                el: $ul[0],
                template: '#glinfoUl',
                settings: {
                    getData: {
                        defaultData: {data: renderArr}
                    }
                }
            });
            $(".paged").text(glinfoGrid.pageNum);
        }

        function renderGrid(searchName) {
            var handleData = glinfoGrid.data;
            $ul.empty();
            $paging.empty();
            if (searchName) {
                if (searchName != glinfoGrid.searchName) {
                    glinfoGrid.searchName = searchName;
                    glinfoGrid.searchData = [];
                    $.each(glinfoGrid.data, function (i, t) {
                        if (t.name.indexOf(searchName) >= 0) {
                            glinfoGrid.searchData.push(t);
                        }
                    })
                }
                handleData = glinfoGrid.searchData;
            } else {
                glinfoGrid.searchName = "";
                glinfoGrid.searchData = [];
            }
            var totlaLength = 0, alllength = 0;
            for (var i = 0, maxLength = handleData.length; i < maxLength; i++) {
                if (!handleData[i].saveValue || handleData[i].saveValue === "2") {
                    totlaLength++;
                }
                alllength++;
            }
            glinfoGrid.total = totlaLength;
            glinfoGrid.allTotal = alllength;
            glinfoGrid.pageNum = 1;
            glinfoGrid.pageMax = Math.floor(glinfoGrid.total / glinfoGrid.limit) + 1;
            new Rxvm({
                el: $paging[0],
                template: '#paging',
                settings: {
                    getData: {
                        defaultData: {
                            total: glinfoGrid.total,
                            pageMax: glinfoGrid.pageMax, pageNum: glinfoGrid.pageNum
                        }
                    }
                }
            });
            renderPageData();
        }

        $("#search").on("click", function () {
            renderGrid($("#searchName").val() || "");
        })
        $paging.on("click", ".rx-first", function () {
            if (glinfoGrid.pageNum === 1) {
                return;
            }
            glinfoGrid.pageNum--;
            renderPageData();
        })
        $paging.on("click", ".rx-last", function () {
            if (glinfoGrid.pageNum === glinfoGrid.pageMax) {
                return;
            }
            glinfoGrid.pageNum++;
            renderPageData();
        })
        return function (data) {
            $("#searchName").val("");
            glinfoGrid.data = data || [];
            glinfoGrid.pageNum = 1;
            glinfoGrid.searchName = "";
            glinfoGrid.searchData = [];
            renderGrid();
        }
    }
}