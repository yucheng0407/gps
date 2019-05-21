package net.ruixin.controller.gps.map;


import net.ruixin.controller.BaseController;
import net.ruixin.util.mapUtil.GeometryModel;
import oracle.spatial.geometry.JGeometry;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.List;

/**
 * 查询配置Mapping
 */
@Controller
@RequestMapping("/map")
public class MapMapping extends BaseController {
    //次地图
    @RequestMapping("map2")
    public String map2() {
        return "gps/map/map2";
    }

    //主地图
    @RequestMapping("map")
    public String map() {
        return "gps/map/map";
    }

    //轨迹移动
    @RequestMapping("pointMove")
    public String pointMove() {
        return "gps/map/pointMove";
    }

    //基本绘制
    @RequestMapping("buttonTemplate")
    public String buttonTemplate() {
        return "gps/map/buttonTemplate";
    }

    //基本绘制
    @RequestMapping("mapSpatial")
    public String mapSpatial() {
        return "gps/map/mapSpatial";
    }

    //基本绘制
    @RequestMapping("mapDraw")
    public String mapDraw() {
        return "gps/map/mapDraw";
    }

    //军事标绘
    @RequestMapping("militaryDraw")
    public String militaryDraw() {
        return "gps/map/militaryDraw";
    }

    //主地图
    @ResponseBody
    @RequestMapping("/geometry")
    public List geometry(@GeometryModel JGeometry geometry) {
        List list = new ArrayList();
        return list;
    }

}


