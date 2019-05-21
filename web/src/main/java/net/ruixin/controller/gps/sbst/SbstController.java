package net.ruixin.controller.gps.sbst;

import net.ruixin.aop.UpdateTimestamp;
import net.ruixin.controller.BaseController;
import net.ruixin.domain.plat.organ.SysOrgan;
import net.ruixin.service.gps.sbst.ISbstService;
import net.ruixin.service.plat.log.aop.BussinessLog;
import net.ruixin.service.plat.organ.IOrganService;
import net.ruixin.util.data.AjaxReturn;
import net.ruixin.util.paginate.FastPagination;
import net.ruixin.util.resolver.FormModel;
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
@RequestMapping("/sbst")
public class SbstController extends BaseController {

    @Autowired
    private ISbstService sbstService;

    @ResponseBody
    @RequestMapping(value = "/getSbbhTree")
    public List getSbbhTree(String sjjg, String sblx) {
        List list=new ArrayList();
        Map map = (Map) getSession().getAttribute("ds");
        if (RxStringUtils.isEmpty(sjjg)) {
            if (map != null) {
                Map pcsMap = new HashMap();
                pcsMap.put("icon","../medias/src/gps/treeImg/pcs.png");
                pcsMap.put("id","jg"+map.get("ID"));
                pcsMap.put("name",map.get("ORGAN_NAME"));
                pcsMap.put("lx","jg");
                pcsMap.put("nocheck","true");
                pcsMap.put("isParent","true");
                list.add(pcsMap);
            }
        } else {
            list=sbstService.getSbbhTree(Integer.valueOf(sjjg.replace("jg", "")), sblx);
        }
        return  list;
    }

    @ResponseBody
    @RequestMapping(value = "/getSbbhList")
    public AjaxReturn getSbbhList(String zyids) {
        return  success().setData(sbstService.getSbbhList(zyids));
    }
}
