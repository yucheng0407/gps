package net.ruixin.controller.gps.gjbf;

import net.ruixin.controller.BaseController;
import net.ruixin.service.gps.gjbf.IGjbfService;
import net.ruixin.util.data.AjaxReturn;
import net.ruixin.util.resolver.JsonModel;
import net.ruixin.util.tools.RxStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 组织机构控制层
 *
 * @author Pitcher
 */
@Controller
@RequestMapping("/gjbf")
public class GjbfController extends BaseController {

    @Autowired
    private IGjbfService gjbfService;

    @ResponseBody
    @RequestMapping(value = "/getSbbh")
    public AjaxReturn getSbbh(String sbmc) {
        return success().setData(gjbfService.getSbbh(sbmc));
    }

    @ResponseBody
    @RequestMapping(value = "/searchSbbh")
    public AjaxReturn searchSbbh(@JsonModel Object map) {
        return success().setData(gjbfService.searchSbbh(((Map) map).get("sbmc").toString(), RxStringUtils.isNotEmpty(((Map) map).get("zyid")) ? ((Map) map).get("zyid").toString() : null, ((Map) map).get("kssj").toString(), ((Map) map).get("jssj").toString()));
    }
}
