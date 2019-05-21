package net.ruixin.controller.plat.workflow;

import net.ruixin.controller.BaseController;
import net.ruixin.service.plat.workflow.IWorkflowInstanceService;
import net.ruixin.util.data.AjaxReturn;
import net.ruixin.util.paginate.FastPagination;
import net.ruixin.util.resolver.SearchModel;
import net.ruixin.util.tools.RxStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Map;

@Controller
@RequestMapping("/workflow/platform")
public class WorkPlatformHandler extends BaseController {

    @Autowired
    private IWorkflowInstanceService workflowInstanceService;

    /**
     * 获取待办列表
     *
     * @param map
     * @return
     */
    @ResponseBody
    @RequestMapping("/getDbList")
    public AjaxReturn getDbList(@SearchModel Object map) {
        Map mp = (Map) map;
        if(RxStringUtils.isEmpty(mp.get("userId"))){
            mp.put("userId", getCurrentUserId());
        }
        FastPagination fastPagination = workflowInstanceService.getDbList(mp);
        return new AjaxReturn().setSuccess(true).setData(fastPagination);
    }

    /**
     * 获取在办列表
     *
     * @param map
     * @return
     */
    @ResponseBody
    @RequestMapping("/getZbList")
    public AjaxReturn getZbList(@SearchModel Object map) {
        Map mp = (Map) map;
        if(RxStringUtils.isEmpty(mp.get("userId"))){
            mp.put("userId", getCurrentUserId());
        }
        FastPagination fastPagination = workflowInstanceService.getZbList((Map) map);
        return new AjaxReturn().setSuccess(true).setData(fastPagination);
    }

    /**
     * 获取已办列表
     *
     * @param map
     * @return
     */
    @ResponseBody
    @RequestMapping("/getYbList")
    public AjaxReturn getYbList(@SearchModel Object map) {
        Map mp = (Map) map;
        if(RxStringUtils.isEmpty(mp.get("userId"))){
            mp.put("userId", getCurrentUserId());
        }
        FastPagination fastPagination = workflowInstanceService.getYbList((Map) map);
        return new AjaxReturn().setSuccess(true).setData(fastPagination);
    }

    /**
     * 获取拟办列表
     *
     * @param map
     * @return
     */
    @ResponseBody
    @RequestMapping("/getNbList")
    public AjaxReturn getNbList(@SearchModel Object map) {
        Map mp = (Map) map;
        mp.put("userId", getCurrentUserId());
        FastPagination fastPagination = workflowInstanceService.getNbList(mp);
        return new AjaxReturn().setSuccess(true).setData(fastPagination);
    }

    /**
     * 获取用户业务统计
     *
     * @param map
     * @return
     */
    @ResponseBody
    @RequestMapping("/getUserTjList")
    public AjaxReturn getUserTjList(@SearchModel Object map) {
        Map mp = (Map) map;
        if (RxStringUtils.isEmpty(mp.get("userId"))) {
            mp.put("userId", getCurrentUserId());
        }
        FastPagination fastPagination = workflowInstanceService.getUserTjList((Map) map);
        return new AjaxReturn().setSuccess(true).setData(fastPagination);
    }

    /**
     * 获取部门业务统计
     *
     * @param map
     * @return
     */
    @ResponseBody
    @RequestMapping("/getOrganTjList")
    public AjaxReturn getOrganTjList(@SearchModel Object map) {
        Map mp = (Map) map;
        if (RxStringUtils.isEmpty(mp.get("organId"))) {
            mp.put("organId", getShiroUser().getDftDeptId());
        }
        FastPagination fastPagination = workflowInstanceService.getOrganTjList((Map) map);
        return new AjaxReturn().setSuccess(true).setData(fastPagination);
    }

    @ResponseBody
    @RequestMapping("/getUserPieData")
    public AjaxReturn getUserPieData(Long userId, String timeType) {
        if (null == userId) {
            userId = getCurrentUserId();
        }
        return new AjaxReturn().setSuccess(true).setData(workflowInstanceService.getUserPieData(userId, timeType));
    }

    @ResponseBody
    @RequestMapping("/getOrganColumnData")
    public AjaxReturn getOrganColumnData(Long organId, String timeType) {
        if (null == organId) {
            organId = getShiroUser().getDftDeptId();
        }
        return new AjaxReturn().setSuccess(true).setData(workflowInstanceService.getOrganColumnData(organId, timeType));
    }
}
