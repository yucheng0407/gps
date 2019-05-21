package net.ruixin.controller.gps.sbxx;

import net.ruixin.controller.BaseController;
import net.ruixin.domain.gps.Sbxx;
import net.ruixin.domain.plat.auth.SysRole;
import net.ruixin.service.gps.sbxx.ISbxxService;
import net.ruixin.service.plat.log.aop.BussinessLog;
import net.ruixin.util.data.AjaxReturn;
import net.ruixin.util.paginate.FastPagination;
import net.ruixin.util.resolver.FormModel;
import net.ruixin.util.resolver.JsonModel;
import net.ruixin.util.resolver.SearchModel;
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
@RequestMapping("/sbxx")
public class SbxxController extends BaseController {

    @Autowired
    private ISbxxService SbxxService;

    /**
     * 查询组织机构列表
     *
     * @param map 查询条件
     * @return AjaxReturn
     */
    @ResponseBody
    @RequestMapping(value = "/getSbxxList")
    public AjaxReturn getSbxxList(@SearchModel Object map) {
        Map dsmap = (Map) getSession().getAttribute("ds");
        Map a = (Map) map;
        if (dsmap != null) a.put("ds", dsmap.get("ds"));
        FastPagination fastPagination = SbxxService.getSbxxList(a);
        return success().setData(fastPagination);
    }

    @RequestMapping(value = "/sbxxAdd")
    public String sbxxAdd() {
        return "/gps/sbxx/sbxxEdit";
    }

    @RequestMapping(value = "/sbxxView")
    public String sbxxView() {
        return "/gps/sbxx/sbxxView";
    }

    @ResponseBody
    @RequestMapping(value = "/getSbxx")
    public AjaxReturn getSbxx(Long id) {
        return success().setData(SbxxService.getSbxx(id));
    }

    @ResponseBody
    @RequestMapping(value = "/sbxxDel")
    public AjaxReturn sbxxDel(Long id) {
        return success().setData(SbxxService.sbxxDel(id));
    }

    @ResponseBody
    @RequestMapping("/saveSbxx")
    public AjaxReturn saveSbxx(@FormModel Sbxx sbxx) {
        SbxxService.saveSbxx(sbxx);
        return new AjaxReturn().setSuccess(true).setData(sbxx.getId());
    }
}
