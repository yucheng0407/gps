/**
 * 地图配置
 */
define([], function () {
    var mapConfig = {
        //底图
        baseMap: [
            // {
            //     id: "PGIS",
            //     name: "矢量",
            //     origin: {
            //         "x": -180,
            //         "y": 90
            //     },
            //     url: "http://10.172.1.190/PGIS_S_FlexClient/",
            //     type: "PGISLayer",
            //     imgUrl: "/gps/medias/src/gps/map/mapCss/img/map.png"
            // },
            // {
            //     id: "dark",
            //     name: "影像",
            //     origin: {
            //         "x": -180,
            //         "y": 90
            //     },
            //     url: "http://53.80.0.241:8080/tdtimg/",
            //     type: "PGISLayer",
            //     imgUrl: "/gps/medias/src/gps/map/mapCss/img/wxmap.png"
            // }
            //下面两种是安顺地图，安顺项目把这两个加上
            // {
            //     id: "ASVec",
            //     name: "矢量",
            //     origin: {
            //         "x": -180,
            //         "y": 90
            //     },
            //     url: "http://10.164.0.84:7001/PGIS_S_TileMapServer/Maps/sl",
            //     type: "ASLayer",
            //     imgUrl: "/gps/medias/src/gps/map/mapCss/img/map.png"
            // }
            // , {
            //     id: "ASImg",
            //     name: "影像",
            //     origin: {
            //         "x": -180,
            //         "y": 90
            //     },
            //     url: "http://10.164.0.84:7001/PGIS_S_TileMapServer/Maps/sy",
            //     type: "ASLayer",
            //     imgUrl: "/gps/medias/src/gps/map/mapCss/img/wxmap.png"
            // }
            //下面两种是陕西地图，陕西项目把这两个加上
{
    id: "SXVec",
    name: "矢量",
    origin: {
        "x": -180,
        "y": 90
    },
    url: "http://10.172.1.190/PGIS_S_TileMapServer/Maps/stsl",
    // type: "SXLayer",
    type: "TestLayer",
    imgUrl: "/gps/medias/src/gps/map/mapCss/img/map.png"
}
, {
    id: "SXImg",
    name: "影像",
    origin: {
        "x": -180,
        "y": 90
    },
    url: "http://10.172.1.190/PGIS_S_TileMapServer/Maps/stslyx",
    type: "SXLayer",
    imgUrl: "/gps/medias/src/gps/map/mapCss/img/wxmap.png"
}


        ],
        //中心点
        // centerX: 118.386,//芜湖
        // centerY: 31.336,
        // centerX:108.14288311767578,//芜湖
        // centerY: 34.20180481445311,
        // centerX: 108.93218,//陕西
        // centerY: 34.3515,
        centerX: RX.getCookie("center_x"),//陕西
        centerY: RX.getCookie("center_y"),
        // centerX: 105.9503,//安顺
        // centerY: 26.2364,
        //MBR
        MBR: [105.0064, 32.6424, 111.821, 35.579],
       // MBR: [117.42, 30.668, 118.821, 31.579],
        //是否有从属地图
        hasSubMap: false,
        //地图聚类开始层级
        levelSegmentation: 13,
        //扩展工具
        extentTools: [
            // {
            //     tool:"export",
            //     icon:"&#xe664;"
            // },
            // {
            //     tool:"print",
            //     icon:"&#xe66e;"
            // }
        ],
        //graphic图层
        graphicLayers: [
            {
                id: "gl_hl"   //高亮图层
            },
            {
                id: "pointMove",    //绘制
                showMoveInfoWindow: true
            },
            {
                id: "pcsLayer",   //派出所图层
                showMoveInfoWindow: true
            },
            {
                id: "dragCircle",    //绘制
                showMoveInfoWindow: true
            },
            {
                id: "label"    //注记
            },
            {
                id: "sp"    //注记
            },
            {
                id: "notClear"    //不清除图层
            },
            {
                id: "draw",    //绘制
                showMoveInfoWindow: true,
                showClickInfoWindow: true
            }
        ],
        //graphicLayerGroups
        graphicLayerGroups:
            {
                "around": [
                    {
                        id: "aroundResource",   //绘制
                        showMoveInfoWindow: true,
                        showClickInfoWindow: true
                    }
                ],
                "jqmx": [
                    {
                        id: "zdjq",   //重点警情
                        showMoveInfoWindow: true,
                        showClickInfoWindow: true
                    },
                    {
                        id: "hj",    //火警
                        showMoveInfoWindow: true,
                        showClickInfoWindow: true
                    },
                    {
                        id: "jtsg",    //交通事故
                        showMoveInfoWindow: true,
                        showClickInfoWindow: true
                    },
                    {
                        id: "ybjq",    //一般警情
                        showMoveInfoWindow: true,
                        showClickInfoWindow: true
                    }
                ],
                "jjy": [
                    {
                        id: "jjyLayer",   //绘制
                        showMoveInfoWindow: true
                    }
                ],
                "policeForce": [ //警力警情
                    {
                        id: "policeForceLayer",   //绘制
                        showMoveInfoWindow: true,
                        showClickInfoWindow: true
                    }
                ],
                "fastSearch": [ //快速搜索
                    {
                        id: "fastSearchLayer",   //绘制
                        showMoveInfoWindow: true,
                        showClickInfoWindow: true
                    }
                ],
                // "aroundResource": [ //周边资源
                //     {
                //         id: "aroundResource",   //绘制
                //         showMoveInfoWindow: true,
                //         showClickInfoWindow:true
                //     }
                // ],
                "xfjl": [
                    {
                        id: "xfjl",   //绘制
                        showMoveInfoWindow: true
                    }
                ],
                "lxjk": [
                    {
                        id: "lxjk",   //绘制
                        showMoveInfoWindow: true,
                        showClickInfoWindow: true,
                        clickInfoWindowWidth: 300,
                        clickInfoWindowHeight: 100
                    }
                ]

            }
    }
    return mapConfig;
});