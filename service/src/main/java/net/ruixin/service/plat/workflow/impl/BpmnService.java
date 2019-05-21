package net.ruixin.service.plat.workflow.impl;

import net.ruixin.dao.plat.workflow.*;
import net.ruixin.domain.plat.form.FormDef;
import net.ruixin.domain.plat.form.FormField;
import net.ruixin.domain.plat.workflow.instance.SysNodeInstance;
import net.ruixin.domain.plat.workflow.instance.SysTask;
import net.ruixin.domain.plat.workflow.instance.SysWorkflowInstance;
import net.ruixin.domain.plat.workflow.structure.frame.SysWorkflow;
import net.ruixin.domain.plat.workflow.structure.node.SysActivityNode;
import net.ruixin.domain.plat.workflow.structure.node.SysNestedNode;
import net.ruixin.domain.plat.workflow.structure.node.SysNode;
import net.ruixin.domain.plat.workflow.structure.page.SysNodePageAuth;
import net.ruixin.enumerate.plat.NodeType;
import net.ruixin.enumerate.plat.SfyxSt;
import net.ruixin.enumerate.plat.WorkflowSaveStatus;
import net.ruixin.service.plat.common.BaseService;
import net.ruixin.service.plat.workflow.IBpmnService;
import net.ruixin.util.json.JacksonUtil;
import net.ruixin.util.support.BeanKit;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.beans.Transient;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class BpmnService extends BaseService implements IBpmnService {
    @Autowired
    private IWorkflowDao workflowDao;

    @Autowired
    private IWorkflowInstanceDao workflowInstanceDao;

    @Autowired
    private ISysWorkflowPageDao workflowPageDao;

    @Autowired
    private ISysWorkflowVariableDao workflowVariableDao;

    @Autowired
    private ISysNodeDao nodeDao;

    @Autowired
    private ISysNodeInstanceDao nodeInstanceDao;

    @Autowired
    private ISysNodePageDao nodePageDao;

    @Autowired
    private ISysNodeTransactorDao nodeTransactorDao;

    @Autowired
    private ISysNodeButtonDao nodeButtonDao;

    @Autowired
    private ISysRouterDao routerDao;

    @Autowired
    private ISysTaskDao taskDao;

    @Autowired
    private ISysNodeVariableDao nodeVariableDao;

    @Autowired
    private ISysNodeProcessDao nodeProcessDao;

    @Autowired
    private ISysNodePageAuthDao nodePageAuthDao;

    @Autowired
    private ISysWorkflowProcessDao workflowProcessDao;

    @Override
    public SysWorkflow getBpmnProcess(Long id) {
        SysWorkflow workflow = workflowDao.get(id);
        workflow.setSheets(workflowPageDao.querySheetsByWorkflow(id));
        workflow.setWorkflowVariables(workflowVariableDao.findVariableByWorkflow(workflow));
        workflow.setProcesses(workflowProcessDao.listWorkflowProcess(id));
        workflow.setNodeMaxSort(nodeDao.getNodeMaxSort(id));
        //获取node
        workflow.setNodes(this.getBpmnNodeList(id));
        //获取router
        workflow.setRouters(routerDao.findRoutersByWorkflow(workflow));
        return workflow;
    }

    @Override
    public List<Map<String, Object>> getBpmnNodeList(Long wfId) {
        List<SysNode> sysNodeList = nodeDao.findNodeListByWorkflow(wfId);
        List<Map<String, Object>> mapList = new ArrayList<>();
        if (sysNodeList != null && sysNodeList.size() > 0) {
            for (SysNode sysNode : sysNodeList) {
                //活动环节
                if (sysNode.getType().equals(NodeType.ACTIVITY_NODE)) {
                    SysActivityNode sysActivityNode = nodeDao.getActivityNode(sysNode.getId());
                    mapList.add(BeanKit.fillMapWithBean(BeanKit.beanToMap(this.getBpmnUserTask(sysNode), "sysWorkflow"), sysActivityNode, "sysWorkflow"));
                } else if (sysNode.getType().equals(NodeType.NESTED_NODE)) {
                    mapList.add(this.getBpmnNestedNode(sysNode));
                } else {
                    mapList.add(BeanKit.fillMapWithBean(BeanKit.beanToMap(this.getBpmnSimpleNode(wfId, sysNode.getDomid()), "sysWorkflow"), sysNode, "sysWorkflow"));
                }
            }
        }
        return mapList;
    }


    @Override
    public Map<String, Object> getBpmnUserTask(Long wfId, String domid) {
        SysNode sysNode = nodeDao.getNodeByWorkflowAndDomid(wfId, domid);
        if (sysNode != null) {
            SysActivityNode sysActivityNode = nodeDao.getActivityNode(sysNode.getId());
            return BeanKit.fillMapWithBean(BeanKit.beanToMap(this.getBpmnUserTask(sysNode)), sysActivityNode);
        }
        return null;
    }

    @Override
    public SysNode getBpmnUserTask(Long sysNodeId) {
        return this.getBpmnUserTask(nodeDao.get(sysNodeId));
    }

    @Override
    public SysNode getBpmnUserTask(SysNode sysNode) {
        //办理人
        sysNode.setTransactors(nodeTransactorDao.queryTransactorByNode(sysNode.getId()));
        //表单
        sysNode.setSheets(nodePageDao.querySheetsByNode(sysNode.getId()));
        //按钮
        sysNode.setButtons(nodeButtonDao.queryButtonsByNode(sysNode.getId()));
        // 后处理
        sysNode.setProcesses(nodeProcessDao.listNodeProcess(sysNode.getId()));
        //办理人是否可选
        if (sysNode.getType().equals(NodeType.ACTIVITY_NODE)) {
            SysActivityNode activityNode = nodeDao.getActivityNode(sysNode.getId());
            sysNode.setBlrSfkx(activityNode.getBlrChoose());
        }
        return sysNode;
    }

    @Override
    public Map<String, Object> getBpmnNestedNode(SysNode sysNode) {
        if (sysNode != null) {
            SysNestedNode sysNestedNode = nodeDao.getNestedNode(sysNode.getId());
            Map<String, Object> map = BeanKit.fillMapWithBean(BeanKit.beanToMap(this.getBpmnUserTask(sysNode), "sysWorkflow"), sysNestedNode, "sysWorkflow");
            String workflowCode = sysNestedNode.getWorkflowCode();
            if (workflowCode != null) {
                //获取发布的嵌套子流程
                SysWorkflow workflow = workflowDao.getReleasedWorkflowByCode(workflowCode);
                if (workflow != null) {
                    map.put("workflowName", workflow.getName());
                    map.put("activityNodes", nodeDao.getActivityNodesByWorkflow(workflow.getId()));
                }
            }
            map.put("transactors", nodeTransactorDao.queryTransactorByNode(sysNestedNode.getId()));
            return map;
        }
        return null;
    }

    @Override
    public SysNode getBpmnSimpleNode(Long wfId, String domid) {
        SysWorkflow workflow = workflowDao.get(wfId);
        SysNode node = null;
        if (workflow != null) {
            node = nodeDao.getNodeByWorkflowAndDomid(workflow.getId(), domid);
            if (NodeType.DECISION_NODE.equals(node.getType())) {
                //决策的环节，查询该节点下的变量
                node.setVariables(nodeVariableDao.getNodeVariable(node));
            }
        }
        return node;
    }

    @Override
    public Map<String, Object> getBpmnSimpleRouter(Long wfId, String domid) {
        SysWorkflow workflow = workflowDao.get(wfId);
        if (workflow != null) {
            return routerDao.getRouterMapByWorkflowAndDomid(workflow.getId(), domid);
        }
        return null;
    }

    @Override
    public List<SysTask> getTaskInstanceByNode(Long wfInsId, String nodeDomId) {
        return taskDao.getTaskInstanceByNode(wfInsId, nodeDomId);
    }

    @Override
    public List<SysTask> getLatestTaskInstance(List<SysTask> taskList) {
        int i = 0;
        Long latestNodeInstanceId = null;
        List<SysTask> latestTaskList = new ArrayList<>();
        for (SysTask task : taskList) {
            if (i == 0) {
                latestNodeInstanceId = task.getNode_instance_id().getId();
                latestTaskList.add(task);
            } else if (task.getNode_instance_id().getId().equals(latestNodeInstanceId)) {
                latestTaskList.add(task);
            }
            i++;
        }
        return latestTaskList;
    }

    @Override
    public SysNode getNodeByWfIns(Long wfInsId, String nodeDomId){
        SysWorkflowInstance workflowInstance = workflowInstanceDao.get(wfInsId);
        //获取node
        return nodeDao.getNodeByWorkflowAndDomid(workflowInstance.getWorkflow_id().getId(), nodeDomId);
    }

    @Override
    public List<SysNodeInstance> getNestedNodeInstance(Long wfInsId,SysNode node) {
        //获取环节实例
        List<SysNodeInstance> nodeInstanceList = nodeInstanceDao.getTransactList(wfInsId, node.getId());
        //获取子流程实例
        if (nodeInstanceList.size() > 0) {
            SysNodeInstance latest = nodeInstanceList.get(0);
            latest.setWorkflowInstanceList(workflowInstanceDao.getSubWorkflowInstanceList(latest.getId()));
        }
        return nodeInstanceList;
    }

    @Override
    public List<Map<String, Object>> getSubWorkflowInstanceList(SysNode node,Long wfInsId) {
        return workflowInstanceDao.getSubWorkflowInstanceList(node,wfInsId);
    }


    @Override
    @Transactional
    public void switchWorkflowStatus(Long id, String status) {
        SysWorkflow workflow = workflowDao.get(id);
        if (workflow != null) {
            if (status.equals(String.valueOf(WorkflowSaveStatus.RELEASE.getId()))) {
                //若启用该版本，则停用当前主版本
                workflowDao.batchHandleWorkflowStatus(workflow.getCode());
            }
            workflow.setStatus(status);
            workflowDao.update(workflow);
        }
    }

    @Override
    public List<Map<String, Object>> getNodePageAuth(Long formId, Long pageId, String domId) {
        List<Map<String, Object>> list = new ArrayList<>();
        List<Map<String, Object>> childList = new ArrayList<>();

//        if (null == nodePageAuths || nodePageAuths.size() == 0) {
        //没有设置权限，采用默认权限
        FormDef formDef = this.get(FormDef.class, formId);
        Map<String, Object> tableMap = new HashMap<>();
        tableMap.put("name", formDef.getName());
        tableMap.put("id", formDef.getId());
        List<Map<String, Object>> fields = new ArrayList<>();
        Map<String, Map<String, Map<String, Object>>> formAuthMap = this.getNodePageAuthMap(pageId, domId);
        Map<String, Map<String, Object>> saveFieldAuthMap = formAuthMap.get(formDef.getId().toString());
        for (FormField field : formDef.getFields()) {
            if (SfyxSt.UNVALID != field.getSfyxSt()) {
                if ("table".equals(field.getFieldType())) {
                    //获取子表单的buttons和fields
                    Map<String, Object> childTable = new HashMap<>();
                    childTable.put("name", field.getLabel());
                    childTable.put("type", "sub");
                    childTable.put("id", field.getId());
                    List<Map<String, Object>> childFields = new ArrayList<>();
                    Map<String, Map<String, Object>> saveSubFieldAuthMap = formAuthMap.get("sub_" + field.getId().toString());
                    //遍历columns
                    for (FormField childField : field.getColumns()) {
                        Map<String, Object> childAuth = new HashMap<>();
                        //显示名称
                        childAuth.put("label", childField.getLabel());
                        //字段code
                        childAuth.put("code", childField.getCode());
                        //设置类型,字类型使用subfield
                        childAuth.put("type", "subField");
                        //设置formId
                        childAuth.put("formId", childField.getParentId());
                        if (null != saveSubFieldAuthMap && null != saveSubFieldAuthMap.get(childField.getCode())) {
                            childAuth.putAll(saveSubFieldAuthMap.get(childField.getCode()));
                        } else {
                            Map<String, Object> fieldAttr = JacksonUtil.readValue(childField.getFieldOptions(), Map.class);
                            //必填
                            if (null != fieldAttr.get("required") && Boolean.valueOf(fieldAttr.get("required").toString())) {
                                childAuth.put("required", true);
                            }
                            //只读
                            if (null != fieldAttr.get("read_rights") && Boolean.valueOf(fieldAttr.get("read_rights").toString())) {
                                childAuth.put("read", true);
                            } else {
                                //编辑
                                childAuth.put("edit", true);
                            }
                        }
                        childFields.add(childAuth);
                    }
                    childTable.put("fields", childFields);
                    childList.add(childTable);
                } else {
                    Map<String, Object> fieldAuth = new HashMap<>();
                    //显示名称
                    fieldAuth.put("label", field.getLabel());
                    //字段code
                    fieldAuth.put("code", field.getCode());
                    //设置类型,字类型使用subfield
                    fieldAuth.put("type", "field");
                    //设置formId
                    fieldAuth.put("formId", formId);
                    if (null != saveFieldAuthMap && null != saveFieldAuthMap.get(field.getCode())) {
                        fieldAuth.putAll(saveFieldAuthMap.get(field.getCode()));
                    } else {
                        Map<String, Object> fieldAttr = JacksonUtil.readValue(field.getFieldOptions(), Map.class);
                        //必填
                        if (null != fieldAttr.get("required") && Boolean.valueOf(fieldAttr.get("required").toString())) {
                            fieldAuth.put("required", true);
                        }
                        //只读
                        if (null != fieldAttr.get("read_rights") && Boolean.valueOf(fieldAttr.get("read_rights").toString())) {
                            fieldAuth.put("read", true);
                        } else {
                            //编辑
                            fieldAuth.put("edit", true);
                        }
                    }
                    fields.add(fieldAuth);
                }
            }
        }
        tableMap.put("fields", fields);
        list.add(tableMap);
//        } else {
//            //数据
//            /**
//             * [{
//             *     name:"",
//             *     id:"",
//             *     fields:[
//             *      {lable,code,type,formId,权限keyvalue}
//             *     ]
//             *
//             * }]
//             */
//            //顺序的问题等等
//            Map<String, Map<String, Object>> authMap = new HashMap<>();
//            for (int i = 0; i < nodePageAuths.size(); i++) {
//                Map<String, Object> nodePageAuth = nodePageAuths.get(i);
//                Map<String, Object> tableMap = authMap.get(nodePageAuth.get("FORM_ID").toString());
//                if (null == tableMap) {
//                    tableMap = new HashMap<>();
//                    tableMap.put("name", nodePageAuth.get("NAME"));
//                    tableMap.put("id", nodePageAuth.get("FORM_ID"));
//                    authMap.put(nodePageAuth.get("FORM_ID").toString(), tableMap);
//                }
//                List<Map<String, Object>> auths;
//                if (null == tableMap.get(nodePageAuth.get("TYPE") + "s")) {
//                    auths = new ArrayList<>();
//                    tableMap.put(nodePageAuth.get("TYPE") + "s", auths);
//                } else {
//                    auths = (List<Map<String, Object>>) tableMap.get(nodePageAuth.get("TYPE") + "s");
//                }
//                Map<String, Object> field = new HashMap<>();
//                field.put("label", nodePageAuth.get("LABEL"));
//                field.put("code", nodePageAuth.get("CODE"));
//                field.put("type", nodePageAuth.get("TYPE"));
//                field.put("formId", nodePageAuth.get("FORM_ID"));
//                field.putAll(JacksonUtil.readValue(nodePageAuth.get("AUTH_ATTR").toString(), Map.class));
//                auths.add(field);
//            }
//            for (Map<String, Object> value : authMap.values()) {
//                list.add(value);
//            }
//        }
        list.addAll(childList);
        return list;
    }

    @Override
    public Map<String, Map<String, Map<String, Object>>> getNodePageAuthMap(Long pageId, String domId) {
        List<Map<String, Object>> nodePageAuths = nodePageAuthDao.getAuths(pageId, domId);
        //按照form封装权限数据 nodePageAuths  注意formid和fieldid可能会重复
        //处理时需要查出所有字段，权限封装时以查询出来的字段权限为准，无则采用默认的权限
        //数据处理bug，新增加的数据字段无法显示。
        //这样才能确保之后无版本的时候无需修改
        //没有处理buttons权限
        Map<String, Map<String, Map<String, Object>>> formAuthMap = new HashMap<>();
        if (nodePageAuths.size() > 0) {
            for (Map<String, Object> pageAuth : nodePageAuths) {
                Map<String, Map<String, Object>> authFields;
                if ("subField".equals(pageAuth.get("TYPE"))) {
                    authFields = formAuthMap.get("sub_" + pageAuth.get("FORM_ID").toString());
                } else {
                    authFields = formAuthMap.get(pageAuth.get("FORM_ID").toString());
                }
                //目前只有两种权限，field和subField，后期可能会加上button
                //目前没有处理formid和fieldid重复的情况，默认不重复，需要修改
                if (null == authFields) {
                    authFields = new HashMap<>();
                    formAuthMap.put(("subField".equals(pageAuth.get("TYPE")) ? "sub_" : "") + pageAuth.get("FORM_ID").toString(), authFields);
                }
                //塞入权限
                Map<String, Object> fieldAuth = JacksonUtil.readValue(pageAuth.get("AUTH_ATTR").toString(), Map.class);
                authFields.put(pageAuth.get("CODE").toString(), fieldAuth);
            }
        }
        return formAuthMap;
    }

    @Transient
    @Override
    public void saveNodePageAuth(Long pageId, String domId, Map<String, Object> authData) {
        //遍历authData
        List<SysNodePageAuth> nodePageAuths = new ArrayList<>();
        for (Map.Entry<String, Object> entry : authData.entrySet()) {
            System.out.println("Key = " + entry.getKey() + ", Value = " + entry.getValue());
            List<Map<String, Object>> list = JacksonUtil.readValue(entry.getValue().toString(), List.class);
            for (Map<String, Object> map : list) {
                SysNodePageAuth nodePageAuth = new SysNodePageAuth();
                nodePageAuth.setCode(map.get("code").toString());
                nodePageAuth.setFormId(Long.parseLong(map.get("formId").toString()));
                nodePageAuth.setAuthAttr(map.get("authAttr").toString());
                //设置类型
                nodePageAuth.setType(entry.getKey());
                nodePageAuth.setDomId(domId);
                nodePageAuth.setPageId(pageId);
                nodePageAuth.setSfyxSt(SfyxSt.VALID);
                nodePageAuths.add(nodePageAuth);
            }
        }
        nodePageAuthDao.saveNodePageAuth(nodePageAuths, pageId, domId);
    }

}
