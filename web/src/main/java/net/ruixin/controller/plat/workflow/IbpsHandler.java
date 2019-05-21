package net.ruixin.controller.plat.workflow;

import net.ruixin.controller.BaseController;
import net.ruixin.domain.plat.workflow.instance.SysNodeInstance;
import net.ruixin.domain.plat.workflow.instance.SysTask;
import net.ruixin.domain.plat.workflow.structure.frame.SysWorkflow;
import net.ruixin.domain.plat.workflow.instance.SysWorkflowInstance;
import net.ruixin.domain.plat.workflow.structure.node.SysNode;
import net.ruixin.service.plat.workflow.*;
import net.ruixin.util.data.AjaxReturn;
import net.ruixin.util.resolver.JsonModel;
import net.ruixin.util.resolver.SearchModel;
import net.ruixin.util.workflow.model.def.BpmDefLayout;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletResponse;
import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/workflow/ibps")
public class IbpsHandler extends BaseController {
    private static final Logger LOGGER = LoggerFactory.getLogger(IbpsHandler.class);

    @Autowired
    private IWorkflowService workflowService;
    @Autowired
    private IWorkflowInstanceService workflowInstanceService;
    @Autowired
    private IWorkflowTypeService workflowTypeService;
    @Autowired
    private IDiagramService diagramService;
    @Autowired
    private IBpmnService bpmnService;

    /**
     * 获取工作流设计的列表
     *
     * @param map
     * @return
     */
    @ResponseBody
    @RequestMapping("/getWorkflowDefList")
    public AjaxReturn getWorkflowDefList(@SearchModel Object map) {
        return success().setData(workflowService.getWorkflowDefList((Map) map));
    }

    @ResponseBody
    @RequestMapping("/getWorkflowListByCode")
    public AjaxReturn getWorkflowListByCode(String code) {
        Map<String, Object> map = new HashMap<>();
        map.put("code", code);
        return success().setData(workflowService.getWorkflowVersionList(map));
    }

    /**
     * 获取流程类别树
     *
     * @return
     */
    @ResponseBody
    @RequestMapping("/getWfTypeTreeData")
    public List<Map<String, Object>> getWfTypeTreeData() {
        return workflowTypeService.getWfTypeTreeData();
    }


    @ResponseBody
    @RequestMapping("/getBpmnDefXml")
    public String getBpmnDefXml(Long id) {
        return workflowService.getBpmnDefXml(id);
    }

    @ResponseBody
    @RequestMapping("/getBpmnProcess")
    public AjaxReturn getBpmnProcess(Long id) {
        try {
            return new AjaxReturn().setSuccess(true).setData(bpmnService.getBpmnProcess(id));
        } catch (Exception e) {
            LOGGER.error("获取流程定义数据失败", e);
            return new AjaxReturn().setSuccess(false).setMsg("获取流程定义数据失败");
        }
    }

    @ResponseBody
    @RequestMapping("/getBpmnUserTask")
    public Map<String, Object> getBpmnUserTask(Long wfId, String domid) {
        return bpmnService.getBpmnUserTask(wfId, domid);
    }

    @ResponseBody
    @RequestMapping("/getBpmnSimpleNode")
    public SysNode getBpmnSimpleNode(Long wfId, String domid) {
        return bpmnService.getBpmnSimpleNode(wfId, domid);
    }

    @ResponseBody
    @RequestMapping("/getBpmnSimpleRouter")
    public Map<String, Object> getBpmnSimpleRouter(Long wfId, String domid) {
        return bpmnService.getBpmnSimpleRouter(wfId, domid);
    }

    @ResponseBody
    @RequestMapping("/getBpmDefLayout")
    public BpmDefLayout getBpmDefLayout(Long wfId, Long instId) {
        String bpmnDef;
        if (wfId == null && instId != null) {
            SysWorkflow workflow = workflowInstanceService.get(instId).getWorkflow_id();
            wfId = workflow.getId();
            bpmnDef = workflow.getBpmnDef();
        } else {
            bpmnDef = workflowService.get(wfId).getBpmnDef();
        }
        BpmDefLayout bpmDefLayout = diagramService.buildBpmDefLayout(bpmnDef);
        if (instId != null) {
            bpmDefLayout.setInstId(instId);
        }
        bpmDefLayout.setDefId(wfId);
        return bpmDefLayout;
    }

    @ResponseBody
    @RequestMapping("/getTaskInstance")
    public AjaxReturn getTaskInstance(Long instId, String nodeDomId) {
        try {
            Map<String, Object> data = new HashMap<>();
            List<SysTask> taskList = bpmnService.getTaskInstanceByNode(instId, nodeDomId);
            if (taskList != null && taskList.size() > 0) {
                data.put("list", taskList);
                data.put("latest", bpmnService.getLatestTaskInstance(taskList));
            }
            return new AjaxReturn().setSuccess(true).setData(data);
        } catch (Exception e) {
            LOGGER.error("获取流程实例数据失败", e);
            return new AjaxReturn().setSuccess(false);
        }
    }


    @ResponseBody
    @RequestMapping("/getNestedNodeInstance")
    public AjaxReturn getNestedNodeInstance(Long instId, String nodeDomId) {
        try {
            Map<String, Object> data = new HashMap<>();
            SysNode node = bpmnService.getNodeByWfIns(instId, nodeDomId);
            List<SysNodeInstance> nodeInstanceList = bpmnService.getNestedNodeInstance(instId, node);
            if (nodeInstanceList != null && nodeInstanceList.size() > 0) {
                data.put("nodeInstanceList", nodeInstanceList);
                List<Map<String, Object>> workflowInstanceList = nodeInstanceList.get(0).getWorkflowInstanceList();
                if (workflowInstanceList != null && workflowInstanceList.size() > 0) {
                    data.put("latest", workflowInstanceList);
                }
                data.put("list", bpmnService.getSubWorkflowInstanceList(node,instId));
            }
            return new AjaxReturn().setSuccess(true).setData(data);
        } catch (Exception e) {
            LOGGER.error("获取流程实例数据失败", e);
            return new AjaxReturn().setSuccess(false);
        }
    }

    /**
     * 生成流程图
     *
     * @param instId
     * @param wfId
     * @param reponse
     * @throws Exception
     */
    @RequestMapping("/gen")
    public void gen(Long instId, Long wfId, HttpServletResponse reponse) throws Exception {
        InputStream is = this.diagramService.genImage(instId, wfId);
        this.reInputStream(is, reponse, "image/png");
    }

    /**
     * 切换流程状态
     *
     * @param id
     * @param status
     * @return
     */
    @ResponseBody
    @RequestMapping("/switchWorkflowStatus")
    public AjaxReturn switchWorkflowStatus(Long id, String status) {
        try {
            bpmnService.switchWorkflowStatus(id, status);
            return new AjaxReturn().setSuccess(true);
        } catch (Exception e) {
            LOGGER.error("更改流程定义状态失败", e);
            return new AjaxReturn().setSuccess(false);
        }
    }

    /**
     * 获取环节表单权限
     *
     * @param formId
     * @param pageId
     * @param domId
     * @return
     */
    @ResponseBody
    @RequestMapping("/getNodePageAuth")
    public AjaxReturn getNodePageAuth(Long formId, Long pageId, String domId) {
        return success().setData(bpmnService.getNodePageAuth(formId, pageId, domId));
    }


    /**
     * 保存
     *
     * @param pageId
     * @param domId
     * @param authData
     * @return
     */
    @ResponseBody
    @RequestMapping("/saveNodePageAuth")
    public AjaxReturn saveNodePageAuth(Long pageId, String domId, @JsonModel Object authData) {
        bpmnService.saveNodePageAuth(pageId, domId, (Map<String, Object>) authData);
        return success();
    }
}
