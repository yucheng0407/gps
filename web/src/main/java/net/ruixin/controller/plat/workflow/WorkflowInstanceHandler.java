package net.ruixin.controller.plat.workflow;

import net.ruixin.controller.BaseController;
import net.ruixin.domain.constant.Workflow;
import net.ruixin.domain.plat.workflow.instance.SysEntrust;
import net.ruixin.domain.plat.workflow.instance.SysTask;
import net.ruixin.domain.plat.workflow.structure.frame.SysWorkflow;
import net.ruixin.service.plat.workflow.ISysEntrustService;
import net.ruixin.service.plat.workflow.ISysTaskService;
import net.ruixin.service.plat.workflow.IWorkflowInstanceService;
import net.ruixin.service.plat.workflow.IWorkflowService;
import net.ruixin.util.data.AjaxReturn;
import net.ruixin.util.resolver.FormModel;
import net.ruixin.util.resolver.SearchModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import java.util.Map;

/**
 * @author wcy
 * @date 2016-8-11
 * 工作流实例部分控制层
 */
@Controller
@RequestMapping("/workflow/instance")
public class WorkflowInstanceHandler extends BaseController {
    @Autowired
    private IWorkflowInstanceService workflowInstanceService;
    @Autowired
    private IWorkflowService workflowService;
    @Autowired
    private ISysTaskService sysTaskService;
    @Autowired
    private ISysEntrustService sysEntrustService;

    /**
     * 根据流程编码启动流程(保存草稿时被前端直接调用)
     *
     * @param flowCode    流程编码
     * @param dataId      业务数据id
     * @param sourceData  源数据
     * @param title       流程实例标题
     * @param type        标志位 为draft时表示流程未启动时点击草稿按钮触发
     * @param startWfVars 流程启动变量设置var1:val1;var2:val2
     */
    @ResponseBody
    @RequestMapping(value = "/startWorkflow")
    public AjaxReturn startWorkflow(String flowCode, Long dataId, String sourceData, String title, String type, String startWfVars) {
        // 获取当前登录人
        Long userId = super.getCurrentUserId();
        // 获取当前用户的任务
        SysTask sysTask = workflowInstanceService.startWorkflowAndReturnTask(flowCode, dataId, userId, title, type, startWfVars, sourceData);
        return success().setData(sysTask.getId());
    }

    /**
     * 根据流程编码启动流程（未保存草稿，首次提交时被前端直接调用）
     *
     * @param flowCode    流程编码
     * @param dataId      业务数据ID
     * @param opinion     办理意见
     * @param title       流程实例标题
     * @param wfVars      流程变量及值
     * @param dataIds     数据ids，格式dataId:1,pageId:"",formId:"";dataId:1,pageId:"",formId:"";
     * @param startWfVars 流程启动变量设置var1:val1;var2:val2
     */
    @ResponseBody
    @RequestMapping(value = "/startWorkflowAndSubmit")
    public AjaxReturn startWorkflowAndSubmit(String flowCode, Long dataId, String opinion, String title, String wfVars, String sourceData, String dataIds, String startWfVars) {
        // 获取当前登录人
        Long userId = super.getCurrentUserId();
        // 启动流程并提交
        String result = workflowInstanceService.startWorkflowAndSubmit(flowCode, dataId, userId, opinion, title, wfVars, sourceData, dataIds, startWfVars);
        return error().setMsg(result);
    }

    /**
     * 签收任务
     *
     * @param taskId 任务id
     */
    @ResponseBody
    @RequestMapping(value = "/signTask")
    public String signTask(Long taskId) {
        return workflowInstanceService.signTask(taskId);
    }

    /**
     * 提交任务
     *
     * @param taskId       任务ID
     * @param nodeUserIds  指定环节和办理人 N1|USER11,USER12;N2|USER21
     * @param decision     手动决策条件
     * @param opinion      办理意见
     * @param fjId         附件id
     * @param auditOpinion 审批意见
     * @param dataId       业务数据ID
     * @param draft        是否草稿后提交
     * @param title        流程实例标题
     * @param wfVars       流程变量及值
     * @param dataIds      数据ids，格式dataId:1,pageId:"",formId:"";dataId:1,pageId:"",formId:"";
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/submitTask")
    public AjaxReturn submitTask(Long taskId, String nodeUserIds, String decision, String opinion, String fjId, String auditOpinion, Long dataId,
                                 boolean draft, String title, String wfVars, String dataIds) {
        // 提交任务
        String result = workflowInstanceService.submitTask(taskId, nodeUserIds, decision, opinion, fjId, auditOpinion, dataId, draft, title, wfVars, dataIds);
        return success().setMsg(result);
    }

    /**
     * 退回任务
     *
     * @param taskId        任务ID
     * @param nodeWfUserIds 指定退回环节、流程实例和办理人 格式:N1|W1|U1,U2;..或N1|W1;..
     * @param opinion       办理意见
     * @param fjId          附件id
     * @param auditOpinion  审批意见
     * @param dataId        业务数据ID
     * @param title         流程实例标题
     * @param wfVars        流程变量及值
     * @param dataIds       数据ids，格式dataId:1,pageId:"",formId:"";dataId:1,pageId:"",formId:"";
     * @param isSpecialBack 是否为特送退回
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/backTask")
    public AjaxReturn backTask(Long taskId, String nodeWfUserIds, String opinion, String fjId, String auditOpinion, Long dataId,
                               String title, String wfVars, String dataIds, boolean isSpecialBack) {
        // 退回任务
        String result = workflowInstanceService.backTask(taskId, nodeWfUserIds, opinion, fjId, auditOpinion, dataId, title, wfVars, dataIds, isSpecialBack);
        return success().setMsg(result);
    }

    /**
     * 撤回任务
     *
     * @param taskId 任务ID
     */
    @ResponseBody
    @RequestMapping(value = "/recoverTask")
    public AjaxReturn recoverTask(Long taskId) {
        return success().setMsg(workflowInstanceService.recoverTask(taskId));
    }

    /**
     * 删除流程相关数据
     *
     * @param taskId 任务实例ID
     */
    @ResponseBody
    @RequestMapping(value = "/deleteWorkflowInstance")
    public AjaxReturn deleteWorkflowInstance(Long taskId) {
        workflowInstanceService.delWorkflowInstance(sysTaskService.get(taskId).getWorkflow_instance_id().getId());
        return success();
    }

    /**
     * 获取最新的任务实例ID
     *
     * @param flowCode 流程编码
     * @param dataId   数据ID
     */
    @ResponseBody
    @RequestMapping(value = "/getNewestTaskId")
    public AjaxReturn getNewestTaskId(String flowCode, Long dataId) {
        AjaxReturn ajaxReturn = new AjaxReturn();
        //以流程编码获取流程，并填入id参数
        SysWorkflow wf = workflowService.findWorkflowByCode(flowCode);
        if (wf == null) {
            return new AjaxReturn(false, null, Workflow.WF_NOT_FOUND);
        }
        Long taskId = workflowInstanceService.getLatestTaskIdByDataId(wf.getId(), dataId, super.getCurrentUserId());
        if (taskId == null) {
            ajaxReturn.setSuccess(true).setMsg("未找到最新的任务实例ID");
        } else {
            ajaxReturn.setSuccess(true).setData(taskId);
        }
        return ajaxReturn;
    }

    /**
     * 通过流程实例获取最新的任务实例ID
     *
     * @param wiId 流程实例ID
     */
    @ResponseBody
    @RequestMapping(value = "/getNewestTaskIdByWiId")
    public AjaxReturn getNewestTaskIdByWiId(Long wiId) {
        Long taskId = workflowInstanceService.getLatestTaskIdByWiId(wiId, super.getCurrentUserId());
        return success().setData(taskId);
    }

    /**
     * 获取工作流中的流程表单URL
     *
     * @param flowCode 流程编码
     * @param dataId   数据ID
     */
    @ResponseBody
    @RequestMapping(value = "/getWorkflowSheetUrl")
    public AjaxReturn getWorkflowSheetUrl(String flowCode, Long dataId) {
        return success().setData(workflowInstanceService.getWorkflowSheetUrl(flowCode, dataId));
    }

    /**
     * 流程启动后根据任务ID获取任务办理页面数据
     *
     * @param id 任务ID
     */
    @ResponseBody
    @RequestMapping(value = "/getTaskHandleJson")
    public AjaxReturn getTaskHandleJson(Long id) {
        return success().setData(sysTaskService.generateTaskHandleJson(id, super.getCurrentUserId()));
    }

    /**
     * 流程启动前根据流程编码获取办理页面数据
     *
     * @param flowCode    流程编码
     * @param startWfVars 流程启动变量var1::val1;var2:val2
     */
    @ResponseBody
    @RequestMapping(value = "/getTaskHandleByCode")
    public AjaxReturn getTaskHandleByCode(String flowCode, String startWfVars) {
        return success().setData(sysTaskService.generateTaskHandleJson(flowCode, startWfVars, super.getCurrentUserId()));
    }

    /**
     * 获取流程确认办理页面的数据
     *
     * @param id          任务ID
     * @param dataId      业务数据ID
     * @param agree       1提交 0退回
     * @param flowCode    流程编码
     * @param wfVars      流程变量及值
     * @param title       流程实例标题
     * @param backNodeIds 指定退回的环节IDS
     * @param dataIds     数据ids，格式dataId:1,pageId:"",formId:"";dataId:1,pageId:"",formId:"";
     * @param hasFlag     已经做过逻辑赋值
     */
    @ResponseBody
    @RequestMapping(value = "/getHandleData")
    public AjaxReturn getHandleData(Long id, Long dataId, boolean agree, String flowCode,
                                    String wfVars, String title, String backNodeIds, String dataIds, Boolean hasFlag) {
        Map result = workflowInstanceService.getHandleData(id, agree, wfVars, "", backNodeIds, dataIds, hasFlag);
        return success().setData(result);
    }

    /**
     * 根据流程编码启动流程,并返回下一环节信息
     *
     * @param flowCode    流程编码
     * @param dataId      业务数据ID
     * @param title       流程实例标题
     * @param wfVars      流程变量及值
     * @param dataIds     数据ids，格式dataId:1,pageId:"",formId:"";dataId:1,pageId:"",formId:"";
     * @param startWfVars 流程启动变量设置var1:val1;var2:val2
     */
    @ResponseBody
    @RequestMapping(value = "/startWorkflowAndGetHandleData")
    public AjaxReturn startWorkflowAndGetHandleData(String flowCode, Long dataId, String title, String wfVars, String sourceData,
                                                    String dataIds, String startWfVars) {
        // 获取当前登录人
        Long userId = super.getCurrentUserId();
        Map result = workflowInstanceService.startWorkflowAndGetHandleData(flowCode, dataId, userId, title, wfVars, sourceData, dataIds, startWfVars);
        return success().setData(result);
    }

    /**
     * 获取环节实例列表数据
     *
     * @param id       流程实例ID
     * @param flowCode 流程编码
     */
    @ResponseBody
    @RequestMapping(value = "/getSimpleWorkflowJSON")
    public AjaxReturn getSimpleWorkflowJSON(Long id, String flowCode) {
        return success().setData(workflowInstanceService.getSimpleWorkflowJSON(id, flowCode));
    }

    /**
     * 任务列表
     *
     * @param wfiId  流程实例ID
     * @param nodeId 环节ID
     */
    @ResponseBody
    @RequestMapping(value = "/taskPage")
    public AjaxReturn taskPage(Long wfiId, Long nodeId) {
        return success().setData(sysTaskService.taskPage(wfiId, nodeId));
    }

    /**
     * 获取流程意见
     *
     * @param wiId 流程实例ID
     */
    @ResponseBody
    @RequestMapping(value = "/getFlowOpinion")
    public AjaxReturn getFLowOpinion(Long wiId) {
        return success().setData(workflowInstanceService.getPageOpinionWithCode(wiId));
    }

    /**
     * 保存表单草稿数据
     *
     * @param taskId     任务ID
     * @param nodePageId 环节页面ID
     * @param tmpData    草稿数据
     * @return ar
     */
    @ResponseBody
    @RequestMapping(value = "/saveTmpData")
    public AjaxReturn saveTmpData(Long taskId, Long nodePageId, String tmpData) {
        workflowInstanceService.updateTmpData(taskId, nodePageId, tmpData);
        return success();
    }

    /**
     * 催办
     *
     * @param taskId 任务ID
     * @return ar
     */
    @ResponseBody
    @RequestMapping(value = "/pressTask")
    public AjaxReturn pressTask(Long taskId, String content) {
        workflowInstanceService.pressTask(taskId, content);
        return success();
    }

    /**
     * 批量办理流程
     *
     * @param wfiIds    流程实例IDS
     * @param opinion   办理意见
     * @param handleTag 1：提交 0：退回
     * @return ar
     */
    @ResponseBody
    @RequestMapping(value = "/batchProcessWf")
    public AjaxReturn batchProcessWf(String wfiIds, String opinion, String handleTag) {
        return success().setData(workflowInstanceService.batchProcess(super.getCurrentUserId(), wfiIds, opinion, handleTag));
    }

    /**
     * 获取流程意见
     *
     * @param wiId   流程实例ID
     * @param pageId 页面ID
     * @return ar
     */
    @ResponseBody
    @RequestMapping(value = "/getNodePageOpinion")
    public AjaxReturn getNodePageOpinion(Long wiId, Long pageId) {
        return success().setData(sysTaskService.getNodePageOpinion(wiId, pageId));
    }

    /**
     * 获取特送退回的环节树
     *
     * @param taskId 任务ID
     */
    @ResponseBody
    @RequestMapping(value = "/getSpecialBackTree", method = RequestMethod.POST)
    public List getSpecialBackTree(@RequestParam("taskId") Long taskId) {
        return workflowInstanceService.getSpecialBackTree(taskId);
    }

    /**
     * 是否能退回任务(暂未使用)
     *
     * @param id 任务ID
     */
    @ResponseBody
    @RequestMapping(value = "/isBackTask")
    public AjaxReturn isBackTask(Long id) {
        return success().setData(sysTaskService.isReturned(sysTaskService.get(id)));
    }


    /**
     * 委办列表
     *
     * @param map 搜索条件
     */
    @ResponseBody
    @RequestMapping(value = "/getEntrustList")
    public AjaxReturn getEntrustList(@SearchModel Object map) {
        return success().setData(sysEntrustService.getEntrustList((Map) map, super.getCurrentUserId()));
    }

    /**
     * 获取委办实体
     */
    @ResponseBody
    @RequestMapping(value = "/getEntrustById")
    public AjaxReturn getEntrustById(Long id) {
        return success().setData(sysEntrustService.getEntrustById(id));
    }

    /**
     * 保存委托
     */
    @ResponseBody
    @RequestMapping(value = "/saveEntrust")
    public AjaxReturn saveEntrust(@FormModel SysEntrust sysEntrust) {
        Boolean isCanSave = sysEntrustService.checkTime(sysEntrust, super.getCurrentUserId());
        if (isCanSave) {
            sysEntrust.setUserId(super.getCurrentUserId());
            return success().setData(sysEntrustService.saveEntrust(sysEntrust));
        } else {
            return error().setMsg("时间有误");
        }
    }

    /**
     * 停止委办
     */
    @ResponseBody
    @RequestMapping(value = "/stopEntrust")
    public AjaxReturn stopEntrust(Long id) {
        sysEntrustService.stopEntrust(id);
        return success();
    }

    /**
     * 获取聚合环节要退回的环节
     */
    @ResponseBody
    @RequestMapping(value = "/getBackNodes")
    public AjaxReturn getBackNodes(Long nodeId, Long wfInsId) {
        return success().setData(workflowInstanceService.getBackNodes(nodeId, wfInsId));
    }

    /**
     * 流程变量更新
     *
     * @param taskId 任务id
     * @param wfVars 流程变量，变量名称:值，多个逗号隔开
     * @return
     */
    @ResponseBody
    @RequestMapping("/updateWorkflowVars")
    public AjaxReturn updateWorkflowVars(Long taskId, String wfVars) {
        workflowInstanceService.initVariable(taskId, wfVars);
        return success();
    }

    /**
     * 获取流程流转历史
     *
     * @param taskId 任务id
     * @return
     */
    @ResponseBody
    @RequestMapping("/getWorkflowLzHistory")
    public AjaxReturn getWorkflowLzHistory(Long taskId) {
        return success().setData(workflowInstanceService.getWorkflowLzHistory(taskId));
    }
}
