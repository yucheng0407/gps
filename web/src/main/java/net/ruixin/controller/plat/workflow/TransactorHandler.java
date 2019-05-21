package net.ruixin.controller.plat.workflow;

import net.ruixin.controller.BaseController;
import net.ruixin.domain.plat.workflow.transactor.SysNodeAssigneeCondition;
import net.ruixin.domain.plat.workflow.transactor.SysWorkflowTransactor;
import net.ruixin.service.plat.workflow.ITransactorService;
import net.ruixin.util.data.AjaxReturn;
import net.ruixin.util.paginate.FastPagination;
import net.ruixin.util.resolver.FormModel;
import net.ruixin.util.resolver.SearchModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Map;

@Controller
@RequestMapping("/workflow/transactor")
public class TransactorHandler extends BaseController {
    @Autowired
    private ITransactorService transactorService;

    /**
     * 保存
     *
     * @param transactor
     * @return
     */
    @ResponseBody
    @RequestMapping("/saveTransactor")
    public AjaxReturn saveTransactor(@FormModel SysWorkflowTransactor transactor) {
        return success().setData(transactorService.saveTransactor(transactor));
    }

    /**
     * 通过id获取
     *
     * @param id
     * @return
     */
    @ResponseBody
    @RequestMapping("/getTransactorById")
    public AjaxReturn getTransactorById(Long id) {
        return success().setData(transactorService.getTransactorById(id));
    }

    /**
     * 保存
     *
     * @param nodeAssigneeCondition
     * @return
     */
    @ResponseBody
    @RequestMapping("/saveCondition")
    public AjaxReturn saveCondition(@FormModel SysNodeAssigneeCondition nodeAssigneeCondition) {
        return success().setData(transactorService.saveCondition(nodeAssigneeCondition));
    }

    /**
     * 分页查询
     *
     * @param map
     * @return
     */
    @ResponseBody
    @RequestMapping("/getTransactorList")
    public AjaxReturn getTransactorList(@SearchModel Object map) {
        FastPagination fastPagination = transactorService.getTransactorList((Map) map);
        return new AjaxReturn().setSuccess(true).setData(fastPagination);
    }

    /**
     * 删除
     *
     * @param id
     * @return
     */
    @ResponseBody
    @RequestMapping("/delTransactor")
    public AjaxReturn delTransactor(Long id) {
        transactorService.delTransactor(id);
        return success();
    }
}
