package net.ruixin.service.plat.workflow.impl;

import net.ruixin.dao.plat.form.IFormDao;
import net.ruixin.dao.plat.workflow.*;
import net.ruixin.domain.constant.Workflow;
import net.ruixin.domain.plat.workflow.instance.*;
import net.ruixin.domain.plat.workflow.structure.frame.SysWorkflow;
import net.ruixin.domain.plat.workflow.structure.frame.SysWorkflowProcess;
import net.ruixin.domain.plat.workflow.structure.frame.SysWorkflowVariable;
import net.ruixin.domain.plat.workflow.structure.node.SysNode;
import net.ruixin.domain.plat.workflow.structure.node.SysNodeProcess;
import net.ruixin.domain.plat.workflow.structure.node.SysNodeVariable;
import net.ruixin.domain.plat.workflow.structure.page.SysWorkflowPage;
import net.ruixin.domain.plat.workflow.structure.route.SysRouter;
import net.ruixin.enumerate.plat.NodeType;
import net.ruixin.enumerate.plat.SfyxSt;
import net.ruixin.enumerate.plat.TaskFinishEnum;
import net.ruixin.service.plat.workflow.*;
import net.ruixin.service.plat.workflow.title.IWfInsTitleStrategy;
import net.ruixin.service.plat.workflow.title.WfInsTitleStrategyFactory;
import net.ruixin.util.cache.Cache;
import net.ruixin.util.cache.CacheKit;
import net.ruixin.util.exception.BussinessException;
import net.ruixin.util.http.HttpKit;
import net.ruixin.util.paginate.FastPagination;
import net.ruixin.util.shiro.ShiroKit;
import net.ruixin.util.data.FlowParam;
import net.ruixin.util.tools.JexlCalculate;
import net.ruixin.util.tools.RxStringUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by Jealous on 2016-8-16.
 * 流程实例接口实现
 */
@Service
@Transactional
public class WorkflowInstanceService implements IWorkflowInstanceService, ApplicationContextAware {
    private ApplicationContext applicationContext;

    @Autowired
    private ISysTaskDao sysTaskDao;

    @Autowired
    private ISysWorkflowVariableDao sysWorkflowVariableDao;

    @Autowired
    private ISysWorkflowVariableInstanceDao sysWorkflowVariableInstanceDao;

    @Autowired
    private IWorkflowInstanceDao workflowInstanceDao;

    @Autowired
    private ISysNodeDao sysNodeDao;

    @Autowired
    private ISysWorkflowPageDao sysWorkflowPageDao;

    @Autowired
    private ISysTaskService sysTaskService;

    @Autowired
    private ISysRouterDao routerDao;

    @Autowired
    private ISysNodeInstanceDao sysNodeInstanceDao;

    @Autowired
    private ISysTaskPageInstanceDao sysTaskPageInstanceDao;

    @Autowired
    private IWorkflowService workflowService;

    @Autowired
    private ISysWorkflowPageDataDao workflowPageDataDao;

    @Autowired
    private IWorkflowPageDataService workflowPageDataService;

    @Autowired
    private ISysNodeService nodeService;

    @Autowired
    private ISysNodeVariableDao nodeVariableDao;

    @Autowired
    private IFormDao formDao;

    @Autowired
    private WfInsTitleStrategyFactory factory;

    @Autowired
    private ISysNodeProcessDao nodeProcessDao;

    @Autowired
    private ISysWorkflowProcessDao workflowProcessDao;

    private static final Logger log = LoggerFactory.getLogger(WorkflowInstanceService.class);

    @Override
    public SysWorkflowInstance get(Long id) {
        return workflowInstanceDao.get(id);
    }

    @Override
    public Long startWorkflow(String flowCode, Long dataId, Long startUserId, String title, String type,
                              String startWfVars, String sourceData) {
        // 根据流程编码获取启用流程
        SysWorkflow wf = workflowService.findWorkflowByCode(flowCode);
        if (wf == null) {
            throw new BussinessException("流程不存在");
        }
        // 流程实例标题
        String wfInsTitle = "";
        if (RxStringUtils.isNotEmpty(title)) {//传入流程实例标题
            wfInsTitle = title;
        } else {//未传入流程实例标题
            //草稿默认流程实例标题为流程名称
            if ("draft".equals(type)) {
                wfInsTitle = wf.getName();
            } else {//定制流程实例标题
                IWfInsTitleStrategy wfInsTitleStrategy = factory.getWfInsTitleStrategy(flowCode);
                if (null != wfInsTitleStrategy) {
                    wfInsTitle = wfInsTitleStrategy.getWfInsTitle(dataId, wf);
                } else { //若没定制则取流程上初始的流程实例标题
                    wfInsTitle = wf.getInstanceTitle();
                }
            }
        }
        // 返回信息 流程启动成功,WF_INS_ID
        String result = workflowInstanceDao.startWorkflow(wf.getId(), startUserId, dataId, startWfVars, wfInsTitle, sourceData);
        if (RxStringUtils.isEmpty(result)) {
            throw new BussinessException("流程启动返回参数异常");
        } else {
            String[] msgs = result.split(",");
            if (Workflow.START_SUCCESS.equals(msgs[0])) {
                return Long.valueOf(msgs[1]);
            } else {
                throw new BussinessException(Workflow.START_FAIL);
            }
        }
    }

    @Override
    public SysTask startWorkflowAndReturnTask(String flowCode, Long dataId, Long startUserId, String title, String type,
                                              String startWfVars, String sourceData) {
        // 启动流程
        Long wfInsId = this.startWorkflow(flowCode, dataId, startUserId, title, type, startWfVars, sourceData);
        // 获取当前用户的任务
        SysTask sysTask = sysTaskService.getTaskByWorkflowInstanceAndUser(wfInsId, startUserId);
        if (sysTask == null) {
            throw new BussinessException("当前用户无任务");
        }
        return sysTask;
    }

    @Override
    public String startWorkflowAndSubmit(String flowCode, Long dataId, Long startUserId, String opinion, String title, String wfVars,
                                         String sourceData, String dataIds, String startWfVars) {
        // 启动工作流并获取当前用户任务
        SysTask task = this.startWorkflowAndReturnTask(flowCode, dataId, startUserId, title, null, startWfVars, sourceData);
        // 提交任务
        return this.submitTask(task.getId(), null, null, opinion, null, null, dataId, false, title, wfVars, dataIds);
    }

    @Override
    public Map<String, Object> startWorkflowAndGetHandleData(String flowCode, Long dataId, Long startUserId, String title, String wfVars,
                                                             String sourceData, String dataIds, String startWfVars) {
        //启动流程并返回当前任务
        SysTask task = startWorkflowAndReturnTask(flowCode, dataId, startUserId, title, null, startWfVars, sourceData);
        return this.getHandleData(task.getId(), true, wfVars, null, null, dataIds, false);
    }

    @Override
    public String signTask(Long taskId) {
        return workflowInstanceDao.signTask(taskId);
    }

    @Override
    public String submitTask(Long taskId, String nodeUserIds, String decision, String opinion, String fjId, String auditOpinion, Long dataId,
                             boolean draft, String title, String wfVars, String dataIds) {
        // 提交任务前预处理
        this.preHandleTask(taskId, dataId, draft, title, dataIds, auditOpinion, wfVars);
        // 提交任务
        String result = workflowInstanceDao.submitTask(Arrays.asList(taskId, nodeUserIds, decision, opinion, fjId));
        if (Workflow.SUBMIT_SUCCESS.equals(result)) {
            //提交后处理
            processPost(taskId, decision, opinion, fjId, Workflow.SUBMIT);
            return result;
        } else {
            throw new BussinessException(result);
        }
    }

    @Override
    public String backTask(Long taskId, String nodeWfUserIds, String opinion, String fjId, String auditOpinion, Long dataId, String title,
                           String wfVars, String dataIds, boolean isSpecialBack) {
        // 退回任务前预处理
        this.preHandleTask(taskId, dataId, false, title, dataIds, auditOpinion, wfVars);
        // 退回任务
        String result = workflowInstanceDao.backTask(Arrays.asList(taskId, nodeWfUserIds, opinion, fjId));
        if (Workflow.BACK_SUCCESS.equals(result)) {
            if (isSpecialBack) { // 若是特送退回
                // 特送退回后处理
                processPost(taskId, null, opinion, fjId, Workflow.SPECIAL_BACK);
            } else { // 普通退回
                //退回后处理
                processPost(taskId, null, opinion, fjId, Workflow.BACK);
            }
            return result;
        } else {
            throw new BussinessException(result);
        }
    }

    /**
     * 办理任务前置处理
     *
     * @param taskId       任务ID
     * @param dataId       业务数据ID
     * @param draft        是否草稿后提交
     * @param title        流程实例标题
     * @param dataIds      数据ids，格式dataId:1,pageId:"",formId:"";dataId:1,pageId:"",formId:"";
     * @param auditOpinion 审批意见
     * @param wfVars       流程变量及值
     * @return
     */
    private void preHandleTask(Long taskId, Long dataId, boolean draft, String title, String dataIds, String auditOpinion, String wfVars) {
        //保存草稿后首次提交
        if (null != dataId && draft) {
            //更新业务数据ID
            this.updateWorkflowInstanceData(taskId, Workflow.COLUMN_DATA_ID, dataId);
            sysTaskService.updateTmpData(taskId, null);
        }
        //保存数据id
        workflowPageDataService.saveWorkflowPageData(sysTaskService.get(taskId).getWorkflow_instance_id().getId(), dataIds);
        //更新流程实例标题
        if (RxStringUtils.isNotEmpty(title)) {
            SysWorkflowInstance workflowInstance = sysTaskService.get(taskId).getWorkflow_instance_id();
            String wfTitle = workflowInstance.getTitle();
            if (!title.equals(wfTitle)) {
                this.updateWorkflowInstanceData(taskId, Workflow.COLUMN_TITLE, title);
            }
        }
        //保存审批意见到临时表，存储过程引擎再去读取
        if (RxStringUtils.isNotEmpty(auditOpinion)) {
            sysTaskService.saveTmpAuditOpinion(auditOpinion);
        }
        //更新流程变量
        if (RxStringUtils.isNotEmpty(wfVars)) {
            workflowInstanceDao.initVariable(taskId, wfVars);
        }
    }

    /**
     * 处理后置
     * @param taskId     任务ID
     * @param decision   手动决策分支条件
     * @param opinion    办理意见
     * @param fjId       附件ID
     * @param postAction 后置动作
     */
    @SuppressWarnings("ConstantConditions")
    private void processPost(Long taskId, String decision, String opinion, String fjId, String postAction) {
        SysTask task = sysTaskService.get(taskId);
        // 若环节还在运行不走后置程序
        if (!"2".equals(task.getNode_instance_id().getStatus())) return;
        // 后置程序容器
        List processList = new ArrayList();
        // 获取环节后置
        List<SysNodeProcess> nodeProcessList = nodeProcessDao.listNodeProcess(task.getNode_instance_id().getNode_id().getId());
        if (nodeProcessList != null && nodeProcessList.size() > 0) {
            processList.addAll(nodeProcessList);
        }
        // 若流程已完成加上流程后置
        if ("0".equals(task.getWorkflow_instance_id().getStatus())) {
            List<SysWorkflowProcess> workflowProcessList = workflowProcessDao.listWorkflowProcess(task.getWorkflow_instance_id().getWorkflow_id().getId());
            if (workflowProcessList != null && workflowProcessList.size() > 0) {
                processList.addAll(workflowProcessList);
            }
        }
        // 无后置程序直接返回
        if (processList.size() == 0) return;
        String action = "", type = "", content = "", msg = "";
        try {
            // 循环处理后置程序
            for (Object process : processList) {
                if (process instanceof SysNodeProcess) {
                    msg = "环节";
                    action = ((SysNodeProcess) process).getAction();
                    type = ((SysNodeProcess) process).getType();
                    content = ((SysNodeProcess) process).getContent();
                } else if (process instanceof SysWorkflowProcess) {
                    msg = "流程";
                    action = Workflow.ALL; //所有动作
                    type = ((SysWorkflowProcess) process).getType();
                    content = ((SysWorkflowProcess) process).getContent();
                }
                if (content == null && content.trim() == "") {
                    throw new BussinessException(msg + "后置程序内容为空");
                }
                content = content.trim();
                // 后置动作匹配的执行
                if (action == Workflow.ALL || (postAction != null && postAction.equals(action))) {
                    if ("JAVA".equals(type)) { // java程序
                        SupportProgram supportProgram = (SupportProgram) applicationContext.getBean(content);
                        supportProgram.setNodeInstance(task.getNode_instance_id());
                        supportProgram.setWorkflowInstance(task.getWorkflow_instance_id());
                        supportProgram.setSysTask(task);
                        switch (postAction) {
                            case Workflow.BACK:
                                supportProgram.postBack(opinion, decision, fjId);
                                break;
                            case Workflow.RECOVER:
                                supportProgram.postRecover();
                                break;
                            case Workflow.SUBMIT:
                                supportProgram.postSubmit(opinion, decision, fjId);
                                break;
                            case Workflow.SPECIAL_BACK:
                                supportProgram.postSpecialBack(opinion, fjId);
                                break;
                            default:
                                log.error("暂不支持类型为[" + postAction + "]的后置程序");
                        }
                    } else if ("SQL".equals(type)) { // SQL程序
                        // 获取所有流程变量
                        List<Map<String, Object>> varList = workflowInstanceDao.getAllWfVariableIns(task.getWorkflow_instance_id().getId());
                        if (varList != null && varList.size() > 0) {
                            Map<String, String> varMap = new HashMap();
                            for (Map<String, Object> map : varList) {
                                varMap.put(RxStringUtils.toEmptyString(map.get("NAME")), RxStringUtils.toEmptyString(map.get("VALUE")));
                            }
                            String varRegex = "\\[WF:([\\w]+)\\]";
                            Matcher m = Pattern.compile(varRegex).matcher(content);
                            while (m.find()) {
                                // 替换流程变量的值
                                content = content.replaceAll(varRegex, "'" + varMap.get(m.group(1)) + "'");
                                System.out.println(m.group(1));
                            }
                        }
                        workflowInstanceDao.processSqlPost(content);
                    } else if ("PROCEDURE".equals(type)) { // 存储过程
                        workflowInstanceDao.processProcedurePost(content, task.getWorkflow_instance_id().getId());
                    }
                }
            }
        } catch (Throwable t) {
            throw new BussinessException("处理" + msg + "后置程序[" + type + "][" + content + "]异常：" + t.getMessage());
        }
    }

    @Override
    public String recoverTask(Long taskId) {
        String result = workflowInstanceDao.recoverTask(taskId);
        if (Workflow.RECOVER_SUCCESS.equals(result)) {
            processPost(taskId, null, null, null, Workflow.RECOVER);
            return result;
        } else {
            throw new BussinessException(result);
        }
    }

    @Override
    public Map<String, Object> getHandleData(Long taskId, boolean agree, String wfVars, String decision, String backWfNodeIds,
                                             String dataIds, Boolean hasFlag) {
        Map<String, Object> result = new HashMap<>();
        //不能直接获取办理人，根据下一环节类型来处理，如果存在决策环节的话，看存不存在动态赋值逻辑，存在就将逻辑返回前端
        //不存在进行正常的操作逻辑。这段逻辑是动态表单附加的，不存在这段逻辑可以去除
        Map<String, Object> assignLogic = new HashMap<>();
        //退回不需要处理
        if (!hasFlag && agree) {
            //退回时不需要进行查询
            assignLogic = this.getAssignLogic(sysTaskService.get(taskId).getNode_instance_id().getNode_id());
        }
        if (hasFlag || assignLogic.isEmpty()) {
            //保存数据id
            workflowPageDataService.saveWorkflowPageData(sysTaskService.get(taskId).getWorkflow_instance_id().getId(), dataIds);
            if (RxStringUtils.isNotEmpty(wfVars)) {
                this.initVariable(taskId, wfVars);
            }
            Map<String, Object> transactorMap = this.getTransactor(taskId, agree, decision, backWfNodeIds);
            result.putAll(transactorMap);
            //是否显示附件按钮
            result.put("sfbxscfj", Objects.equals(sysTaskService.get(taskId).getNode_instance_id().getNode_id().getSfbxscfj(), "1"));
            //任务ID
            result.put("taskId", taskId);
        } else {
            result.put("taskId", taskId);
            result.put("vars", assignLogic);
        }
        return result;
    }

    @Transactional
    @Override
    public String delWorkflowInstance(Long wiId) {
        //删除关联data表中的数据
        workflowPageDataDao.delDate(wiId);
        return workflowInstanceDao.delWorkflowInstance(wiId);
    }

    @Override
    public Long getLatestTaskIdByWiId(Long wiId, Long userId) {
        if (wiId == null) {
            throw new RuntimeException("获取最新任务时流程实例ID不能为空");
        }
        Long taskId = null;
        if (userId != null) {
            //若用户ID不为空首先获取当前用户的未完成任务
            taskId = workflowInstanceDao.getLatestTaskIdByWiId(wiId, userId, TaskFinishEnum.NO);
        }
        //若未获取到任何任务获取当前流程实例的最新任务
        if (taskId == null) {
            taskId = workflowInstanceDao.getLatestTaskIdByWiId(wiId, null, null);
        }
        return taskId;
    }

    @Override
    public Long getLatestTaskIdByDataId(Long wId, Long dataId, Long userId) {
        if (wId == null || dataId == null) {
            throw new RuntimeException("获取最新任务时流程ID和业务数据ID不能为空");
        }
        Long taskId = workflowInstanceDao.getLatestTaskIdByDataId(wId, dataId, userId);
        if (taskId == null) {
            taskId = workflowInstanceDao.getLatestTaskIdByDataId(wId, dataId, null);
        }
        return taskId;
    }

    @Override
    public String getWorkflowSheetUrl(String flowCode, Long dataId) {
        SysWorkflow wf = workflowService.findWorkflowByCode(flowCode);
        if (wf != null && wf.getId() != null) {
            List<SysWorkflowPage> list = sysWorkflowPageDao.findWorkflowSheetsByWorkflow(wf.getId());
            if (list.size() > 0) {
                return list.get(0).getResource().getUrl() + "?edit=false&id=" + dataId;
            }
        }
        return null;
    }

    @SuppressWarnings("unchecked")
    @Override
    public Map<String, Object> getTransactor(Long rwid, Boolean agree, String decision, String backNodeIds) {
        List nextNodeUserList = workflowInstanceDao.getBlrList(rwid, agree, decision, backNodeIds);
        Map<String, Object> result = new HashMap<>();
        if (nextNodeUserList.size() > 0) {
            String r = nextNodeUserList.get(1).toString();
            if (!"取出失败".equals(r)) {
                if ("下一环节是结束环节".equals(r)) {
                    result.put("info", "endNode");
                } else {
                    String[] rs = r.split(",");
//                    if (rs.length > 1) {
//                        result.put("nodeName", rs[1]);
//                    }
                    List<Map<String, Object>> tempList = (List<Map<String, Object>>) nextNodeUserList.get(0);
                    if (tempList == null || tempList.size() == 0) {
                        result.put("info", "noPeople");
                    } else {
                        List<String> nodeNames = new ArrayList<>();
                        Map<String, Object> transcatorGroup = new HashMap<>();
                        for (Map<String, Object> temp : tempList) {
                            String groupKey;
                            if (temp.containsKey("WF_INS_ID")) {
                                //子流程环节
                                groupKey = "WI" + temp.get("WF_INS_ID");
                            } else {
                                //主流程环节
                                groupKey = "N" + temp.get("NEXT_NODE_ID");
                            }
                            List children;
                            if (transcatorGroup.containsKey(groupKey)) {
                                children = (List) ((Map<String, Object>) transcatorGroup.get(groupKey)).get("children");
                                children.add(temp);
                            } else {
                                children = new ArrayList();
                                children.add(temp);
                                Map<String, Object> transactor = new HashMap<>();
                                transactor.put("children", children);
                                if (temp.containsKey("WF_INS_ID")) {
                                    transactor.put("name", temp.get("NEXT_NODE_NAME"));
                                    transactor.put("subName", "由[" + temp.get("START_USER_NAME") + "]启动的[" + temp.get("WF_TITLE") + "]");
                                } else {
                                    transactor.put("name", temp.get("NEXT_NODE_NAME"));
                                }
                                nodeNames.add(temp.get("NEXT_NODE_NAME").toString());
                                transactor.put("choose", temp.get("BLR_CHOOSE"));
                                transactor.put("nextNodeId", temp.get("NEXT_NODE_ID"));
                                transcatorGroup.put(groupKey, transactor);
                            }
                        }
                        result.put("nodeName", StringUtils.join(nodeNames, ","));
                        result.put("transactors", transcatorGroup.values());
                    }
                }
            }
        }
        return result;
    }

    @Override
    public void updateWorkflowInstanceData(FlowParam param, Long dataId, String title) {
        workflowInstanceDao.updateWorkflowInstanceData(param.getTaskId(), Workflow.COLUMN_DATA_ID, dataId);
        workflowInstanceDao.updateWorkflowInstanceData(param.getTaskId(), Workflow.COLUMN_TITLE, title);
    }

    @Override
    public void updateWorkflowInstanceData(Long taskId, String columnName, Object columnValue) {
        workflowInstanceDao.updateWorkflowInstanceData(taskId, columnName, columnValue);
    }

    @Override
    public void updateTaskPageInstanceData(FlowParam param, Long dataId) {
        sysTaskPageInstanceDao.updateTaskPageInstanceData(dataId, param.getTaskId(), param.getNpId());
    }

    @Override
    public void updateTmpData(Long taskId, Long nodePageId, String tmpData) {
        sysTaskPageInstanceDao.updateTmpData(taskId, nodePageId, tmpData);
    }

    @Override
    public void emptyTmpData(Long taskId) {
        sysTaskPageInstanceDao.emptyTmpData(taskId);
    }

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        this.applicationContext = applicationContext;
    }

    /**
     * 获取特送退回的环节树
     *
     * @param taskId 任务ID
     */
    @Override
    public List getSpecialBackTree(Long taskId) {
        List<Map<String, Object>> specialBackTreeList = new ArrayList<>();
        List<Map<String, Object>> getSpecialBackTreeList = workflowInstanceDao.getSpecialBackTree(taskId);
        Object icon = HttpKit.handleCtxPath(CacheKit.get(Cache.CONFIG, "flowType"));
        for (Map map : getSpecialBackTreeList) {
            Map<String, Object> result = new HashMap<>();
            result.put("id", map.get("NODE_ID") + "|" + map.get("WF_INS_ID"));
            result.put("pId", 0);
            result.put("name", map.get("NAME").toString());
            result.put("isParent", false);
            result.put("open", false);
            result.put("icon", icon);
            specialBackTreeList.add(result);
        }
        return specialBackTreeList;
    }

    @Override
    public Object getSimpleWorkflowJSON(Long id, String flowCode) {
        Map<String, Object> result = new HashMap<>();
        SysWorkflow workflow = null;
        if (id != null) {
            SysWorkflowInstance wfInstance = workflowInstanceDao.get(id);
            workflow = wfInstance.getWorkflow_id();
        } else {
            workflow = workflowService.findWorkflowByCode(flowCode);//获取流程
        }
        List<SysNode> nodes = sysNodeDao.findNodesByWorkflow(workflow);  //获取环节
        List<SysRouter> routers = routerDao.findRoutersByWorkflow(workflow);  //获取流向
        Map<String, Object> workflowStructure = new HashMap<>();
        workflowStructure.put("workflow", workflow);
        workflowStructure.put("nodes", nodes);
        workflowStructure.put("routers", routers);
        result.put("Workflow", workflowStructure);
        if (null != id) { //获取实例数据
            SysWorkflowInstance workflowInstance = workflowInstanceDao.get(id);
            List<SysNodeInstance> nodeInstances = sysNodeInstanceDao.getSysNodeInstanceListByWorkflowInstanceId(workflowInstance.getId());
            result.put("WorkflowInstance", nodeInstances);
            result.put("instance", workflowInstance);
            // 找到运行中的环节ID
            String nodeIds = sysNodeInstanceDao.getRunningNodeIds(workflowInstance.getId());
            if (RxStringUtils.isNotEmpty(nodeIds)) {
                result.put("nodeIds", nodeIds);
            }
        }
        return result;
    }

    @Override
    public String batchProcess(Long userId, String wfiIds, String opinion, String handleTag) {
        return workflowInstanceDao.batchProcess(userId, wfiIds, opinion, handleTag);
    }

    @Override
    public boolean initVariable(FlowParam param, String name, String value) {
        // 通过任务获得流程实例
        Long taskId = param.getTaskId();
        if (taskId != null) {
            SysTask task = sysTaskDao.get(taskId);
            SysWorkflowInstance workflowInstance = task.getWorkflow_instance_id();
            SysWorkflowVariable workflowVariable = sysWorkflowVariableDao.getByNameAndWfi(name, workflowInstance.getWorkflow_id());
            SysWorkflowVariableInstance swvi = sysWorkflowVariableInstanceDao.getByVariableAndWfi(workflowVariable, workflowInstance);
            if (swvi == null) {
                swvi = new SysWorkflowVariableInstance();
            }
            swvi.setWorkflow_instance_id(workflowInstance);
            swvi.setVariable_id(workflowVariable);
            swvi.setValue(value);
            swvi.setSfyxSt(SfyxSt.VALID);
            sysWorkflowVariableInstanceDao.save(swvi);
            return true;
        } else {
            return false;
        }
    }

    @Override
    public List getPageOpinionWithCode(Long wiId) {
        return sysTaskDao.getPageOpinionWithCode(wiId);
    }

    @Override
    public void insertWorkflowAdditionUsers(FlowParam param, String ids) {
        workflowInstanceDao.insertWorkflowAdditionUsers(param.getWiId(), param.getnId(), ids);
    }

    @Override
    public SysWorkflowInstance getById(Long id) {
        return workflowInstanceDao.getById(id);
    }

    @Override
    public SysNode findRunningNode(SysWorkflowInstance win) {
        // 找到运行中的环节ID
        SysNodeInstance node = sysNodeInstanceDao.findRunningNode(win);
        if (null != node) {
            return node.getNode_id();
        } else {
            return null;
        }
    }

    @Override
    public void updateWordpath(String path, Long pageId, Long winId) {
        workflowInstanceDao.updateWordpath(path, pageId, winId);
    }

    @Override
    public void updateWordPath(String path, String pageCode, Long wfInsId) {
        workflowInstanceDao.updateWordPath(path, pageCode, wfInsId);
    }

    @Override
    public Long getDataIdByTaskId(Long id) {
        return workflowInstanceDao.getDataIdByTaskId(id);
    }

    @Override
    public void initVariable(Long id, String wfVars) {
        workflowInstanceDao.initVariable(id, wfVars);
    }

    @Override
    public List<Map<String, Object>> getBackNodes(Long nodeId, Long wfInsId) {
        List<Map<String, Object>> backNodes = workflowInstanceDao.getBackNodes(nodeId, wfInsId);
        if (backNodes != null && backNodes.size() > 0) {
            List<Map<String, Object>> treeNodes = new ArrayList<>();
            List<Object> pNodes = new ArrayList<>();
            for (Map<String, Object> backNode : backNodes) {
                Map<String, Object> treeNode = new HashMap<>();
                String pNodeId = "";
                if (backNode.containsKey("NEST_NODE_ID")) {
                    //嵌套环节实例处理
                    pNodeId = backNode.get("NEST_NODE_ID").toString();
                }
                if (StringUtils.isNotEmpty(pNodeId)) {
                    if (!pNodes.contains(pNodeId)) {
                        Map<String, Object> pNode = new HashMap<>();
                        pNode.put("id", "NN_" + pNodeId);
                        pNode.put("pId", null);
                        pNode.put("name", backNode.get("NEST_NODE_NAME"));
                        pNode.put("objectId", pNodeId);
                        pNode.put("nocheck", true);
                        pNode.put("open", true);
                        pNode.put("icon", "/plat/medias/plugin/ztree/css/img/flow.gif");
                        treeNodes.add(pNode);
                        pNodes.add(pNodeId);
                    }
                    treeNode.put("id", "WF_" + backNode.get("WF_INS_ID"));
                    treeNode.put("pId", "NN_" + pNodeId);
                    treeNode.put("name", backNode.get("NODE_NAME") + "(由" + backNode.get("USER_NAME") + "启动)");
                    treeNode.put("objectId", backNode.get("NODE_ID") + "|" + backNode.get("WF_INS_ID"));
                } else {
                    //活动环节
                    treeNode.put("id", "AN_" + backNode.get("NODE_ID"));
                    treeNode.put("pId", null);
                    treeNode.put("name", backNode.get("NODE_NAME"));
                    treeNode.put("objectId", backNode.get("NODE_ID") + "|" + backNode.get("WF_INS_ID"));
                }
                treeNode.put("icon", "/plat/medias/plugin/ztree/css/img/node.gif");
                treeNodes.add(treeNode);
            }
            return treeNodes;
        } else {
            return null;
        }
    }

    @Override
    public void pressTask(Long taskId, String content) {
        //发起催办任务
        SysTask fromTask = sysTaskDao.get(taskId);
        Long currentUserId = ShiroKit.getUser().getId();
        if (!currentUserId.equals(fromTask.getUser_id().getId())) {
            log.debug("当前登录用户不是催办任务的办理人");
            taskId = workflowInstanceDao.getLatestTaskIdByWiId(fromTask.getWorkflow_instance_id().getId(), currentUserId, TaskFinishEnum.YES);
            if (taskId == null) {
                throw new RuntimeException("当前用户不存在要催办的任务");
            }
            fromTask = sysTaskDao.get(taskId);
        }
        //被催办任务集合
        List<SysTask> toTasks = sysTaskDao.getRunningTasks(fromTask.getWorkflow_instance_id());
        for (SysTask toTask : toTasks) {
            System.out.println("催办信息:" + fromTask.getUser_id().getUserName() + "催办了" +
                    toTask.getUser_id().getUserName() + "(" + fromTask.getWorkflow_instance_id().getTitle() + ")。" + content);
        }
    }

    @Override
    public String handleVars(SysWorkflowInstance workflowInstance, SysNode sysNode, String wfVars, Map<String, Map<String, Object>> dataMap) {
        //判断变量存不存在
        if (RxStringUtils.isEmpty(wfVars)) {
            wfVars = "";
        } else if (!",".equals(wfVars.substring(wfVars.length() - 1))) {
            wfVars += ",";
        }
        //查找下一环节节点
        List<SysNode> nodes = nodeService.findNextNodes(sysNode);
        for (SysNode node : nodes) {
            //决策环节
            if (NodeType.DECISION_NODE.equals(node.getType())) {
                /*
                 *  1、流程实例id查询sys_workflow_page_data_ins获取数据，构建form_id+数据的map结构
                 *  数据格式没有进行转化
                 *  dataMap = workflowPageDataDao.getWorkflowPageDatas(sysTask.getWorkflow_instance_id().getId());
                 *
                 *  2、根据流程实例id查找workflowPageData数据，类似于实体查询
                 *   workflowPageDataDao.getWorkflowPageData(wiId)
                 *
                 *   待考虑：
                 *      数据的话，如果字段是选择器，==某个人的话怎么办？？？
                 *      数据获取的位置，以及数据获取的格式等等，要不要转化成对应的数据会格式？？？？
                 *      要不要将级联数据一起查出，而且决策的下一环节可能也是决策，接口需要递归
                 */
                //没有查询过，先查询关联数据
                if (null == dataMap) {
                    dataMap = getFlowFormData(workflowInstance.getId());
                }
                //根据节点查找变量
                List<SysNodeVariable> variables = nodeVariableDao.getNodeVariable(node);
                for (SysNodeVariable variable : variables) {
                    // 变量是否存在赋值表达式，存在的话赋值，
                    if (RxStringUtils.isNotEmpty(variable.getAssignLogic())) {
                        /*  解析表达式，替换数据
                         *  格式： $form_id.字段#
                         *  将表达式替换成值，传入解析器中进行解析
                         */
                        // 创建 Pattern 对象
                        Pattern r = Pattern.compile("(\\$[0-9a-zA-Z._]+#[0-9A-Fa-f]*)");
                        String assignLogic = variable.getAssignLogic();
                        // 现在创建 matcher 对象
                        Matcher m = r.matcher(variable.getAssignLogic());
                        while (m.find()) {
                            //匹配
                            String rexStr = m.group(0);
                            //单表使用“.”来拆，前一个表单id，后一个字段id，
                            //如果是多的表的话，再加上一些其它判断，查询关联数据 $数据#
                            String[] arr = rexStr.substring(1, rexStr.length() - 1).split("\\.");
                            if (arr.length == 2) {
                                String formId = arr[0];
                                String columnCode = arr[1];
                                /*
                                 * 思考：
                                 *    formId如果有一些其它标志位，表示这个数据是子数据，需要查询同级别的数据
                                 *      如果是关联查询出来的话，直接从关联数据中读取
                                 */
                                //数据集中获取数据
                                Map<String, Object> tableData = dataMap.get("form_" + formId);
                                if (null != tableData) {
                                    //替换值，计算值
                                    Object codeValue = tableData.get(columnCode);
                                    //todo 空值替换成什么？？？
                                    if (null == codeValue) {
                                        codeValue = "0";
                                    }
                                    //需要判断是不是字符串，是的话需要转
                                    assignLogic = assignLogic.replace(m.group(0), "\"" + codeValue.toString() + "\"");
                                }
                            } else {
                                //错误
                                //赋值表达式格式错误
                                throw new BussinessException("流程决策变量解析失败，请联系管理员!");
                            }
                        }
                        //计算替换值的表达式assignLogic
                        Object evaluateValue = JexlCalculate.evaluateVars(assignLogic);
                        if (null != evaluateValue) {
                            //根据值老返回表达式的值
                            wfVars += variable.getName() + ":" + evaluateValue + ",";
                        }
                    }
                }
                wfVars = handleVars(workflowInstance, node, wfVars, dataMap);
            }
        }
        return "".equals(wfVars) ? "" : (",".equals(wfVars.substring(wfVars.length() - 1)) ? wfVars.substring(0, wfVars.length() - 1) : wfVars);
    }

    @Override
    public Map<String, Object> getAssignLogic(SysNode node) {
        Map<String, Object> assignLogics = new HashMap<>();
        List<SysNode> nodes = nodeService.findNextNodes(node);
        handleLogic(assignLogics, nodes);
        return assignLogics;
    }

    @Override
    public List<Map<String, Object>> getWorkflowLzHistory(Long taskId) {
        List<Map<String, Object>> taskList = new ArrayList<>();
        if (null != taskId) {
            SysWorkflowInstance workflowInstance = sysTaskDao.get(taskId).getWorkflow_instance_id();
            List<Map<String, Object>> wfOperations = workflowInstanceDao.getWorkflowOperations(workflowInstance.getId());
            Map<String, Object> taskMap;
            for (Map<String, Object> wfOperation : wfOperations) {
                taskMap = new HashMap<>();
                //任务id
                taskMap.put("id", wfOperation.get("TASK_ID"));
                //办理人
                taskMap.put("userName", wfOperation.get("USER_NAME"));
                //组织机构
                taskMap.put("organName", wfOperation.get("ORGAN_NAME"));
                //节点名称
                taskMap.put("nodeName", wfOperation.get("NODE_NAME"));
                //操作action
                taskMap.put("action", wfOperation.get("OPERATION"));
                //时间
                taskMap.put("handleDate", new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(wfOperation.get("CJSJ")));
                // 环节意见
                taskMap.put("opinion", null != wfOperation.get("OPINION") ? wfOperation.get("OPINION").toString().replace("\n", "") : "");
                taskList.add(taskMap);
            }
        }
        return taskList;
    }

    @Override
    public FastPagination getDbList(Map map) {
        return workflowInstanceDao.getDbList(map);
    }

    @Override
    public FastPagination getZbList(Map map) {
        return workflowInstanceDao.getZbList(map);
    }

    @Override
    public FastPagination getYbList(Map map) {
        return workflowInstanceDao.getYbList(map);
    }

    @Override
    public FastPagination getUserTjList(Map map) {
        return workflowInstanceDao.getUserTjList(map);
    }

    @Override
    public FastPagination getOrganTjList(Map map) {
        return workflowInstanceDao.getOrganTjList(map);
    }

    private void handleLogic(Map<String, Object> assignLogics, List<SysNode> nodes) {
        for (SysNode nod : nodes) {
            if (NodeType.DECISION_NODE.equals(nod.getType())) {
                List<SysNodeVariable> nodeVariables = nodeVariableDao.getNodeVariable(nod);
                //
                for (SysNodeVariable nodeVariable : nodeVariables) {
                    if (null != nodeVariable.getAssignLogic() && !"null".equals(nodeVariable.getAssignLogic())) {
                        assignLogics.put(nodeVariable.getName(), nodeVariable.getAssignLogic());
                    }
                }
                handleLogic(assignLogics, nodeService.findNextNodes(nod));
            }
        }
    }

    /**
     * 根据流程实例id查询form数据
     *
     * @param wiId 流程实例id
     * @return map <form_表单id,map<字段,值>>
     */
    private Map<String, Map<String, Object>> getFlowFormData(Long wiId) {
        Map<String, Map<String, Object>> dataMap = new HashMap<>();
        //先获取和流程实例关联的数据id和formid
        List<SysWorkflowPageData> workflowPageDatas = workflowPageDataDao.getWorkflowPageData(wiId);
        for (SysWorkflowPageData flowPageData : workflowPageDatas) {
            //如果表单数据过多的话，查询数据会不会慢？？？
            if (null != flowPageData.getFormId()) {
                Map<String, Object> data = formDao.getFormData(flowPageData.getFormId(), flowPageData.getDataId());
                dataMap.put("form_" + flowPageData.getFormId(), data);
            }
        }
        return dataMap;
    }

    @Override
    public FastPagination getNbList(Map map) {
        return workflowInstanceDao.getNbList(map);
    }

    @Override
    public Map getUserPieData(Long userId, String timeType) {
        Map<String, Object> data = new HashMap<>();
        List<Map<String, Object>> dbrwData = new ArrayList<>();
        List<Map<String, Object>> zbrwData = new ArrayList<>();
        List<Map<String, Object>> ybrwData = new ArrayList<>();
        List<Map<String, Object>> base = workflowInstanceDao.getUserTjList(userId, timeType);
        for (Map flow : base) {
            Integer dbrwNum = Integer.valueOf(flow.get("DBRW_NUM").toString());
            Integer zbrwNum = Integer.valueOf(flow.get("ZBLC_NUM").toString());
            Integer ybrwNum = Integer.valueOf(flow.get("YBRW_NUM").toString());
            if (dbrwNum > 0) {
                Map item = new HashMap();
                item.put("name", flow.get("WF_NAME"));
                item.put("y", dbrwNum);
                dbrwData.add(item);
            }
            if (zbrwNum > 0) {
                Map item2 = new HashMap();
                item2.put("name", flow.get("WF_NAME"));
                item2.put("y", zbrwNum);
                zbrwData.add(item2);
            }
            if (ybrwNum > 0) {
                Map item3 = new HashMap();
                item3.put("name", flow.get("WF_NAME"));
                item3.put("y", ybrwNum);
                ybrwData.add(item3);
            }
        }
        data.put("dbrw", dbrwData);
        data.put("zbrw", zbrwData);
        data.put("ybrw", ybrwData);
        return data;
    }

    @Override
    public Map getOrganColumnData(Long organId, String timeType) {
        Map<String, Object> data = new HashMap<>();
        List<Map<String, Object>> dbrwData = new ArrayList<>();
        List<Map<String, Object>> zbrwData = new ArrayList<>();
        List<Map<String, Object>> ybrwData = new ArrayList<>();
        List<Map<String, Object>> base = workflowInstanceDao.getOrganTjList(organId, timeType);
        for (Map flow : base) {
            Map item = new HashMap();
            item.put("name", flow.get("USER_NAME"));
            item.put("value", Integer.valueOf(flow.get("DBRW_NUM").toString()));
            dbrwData.add(item);
            Map item2 = new HashMap();
            item2.put("name", flow.get("USER_NAME"));
            item2.put("value", Integer.valueOf(flow.get("ZBLC_NUM").toString()));
            zbrwData.add(item2);
            Map item3 = new HashMap();
            item3.put("name", flow.get("USER_NAME"));
            item3.put("value", Integer.valueOf(flow.get("YBRW_NUM").toString()));
            ybrwData.add(item3);
        }
        data.put("dbrw", dbrwData);
        data.put("zbrw", zbrwData);
        data.put("ybrw", ybrwData);
        return data;
    }
}
