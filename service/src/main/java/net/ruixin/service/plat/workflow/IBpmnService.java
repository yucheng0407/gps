package net.ruixin.service.plat.workflow;

import net.ruixin.domain.plat.workflow.instance.SysNodeInstance;
import net.ruixin.domain.plat.workflow.instance.SysTask;
import net.ruixin.domain.plat.workflow.structure.frame.SysWorkflow;
import net.ruixin.domain.plat.workflow.structure.node.SysNode;
import net.ruixin.domain.plat.workflow.structure.route.SysRouter;

import java.util.List;
import java.util.Map;

public interface IBpmnService {

    /**
     * 获取流程
     *
     * @param id
     * @return
     */
    SysWorkflow getBpmnProcess(Long id);

    /**
     * 获取流程环节
     *
     * @param wfId
     * @return
     */
    List<Map<String, Object>> getBpmnNodeList(Long wfId);

    /**
     * 获取用户任务Json
     *
     * @param wfId  流程ID
     * @param domid DOM元素ID
     * @return
     */
    Map<String, Object> getBpmnUserTask(Long wfId, String domid);

    SysNode getBpmnUserTask(Long sysNodeId);

    SysNode getBpmnUserTask(SysNode sysNode);

    /**
     * 获取嵌套环节Json
     * @param sysNode 环节
     * @return
     */
    Map<String, Object> getBpmnNestedNode(SysNode sysNode);

    /**
     * 获取简单节点
     *
     * @param wfId  流程ID
     * @param domid DOM元素ID
     * @return
     */
    SysNode getBpmnSimpleNode(Long wfId, String domid);

    /**
     * 获取简单流向
     *
     * @param wfId  流程ID
     * @param domid DOM元素ID
     * @return
     */
    Map<String, Object> getBpmnSimpleRouter(Long wfId, String domid);

    /**
     * 获取环节的任务实例
     *
     * @param wfInsId   流程实例id
     * @param domid DOM元素ID
     * @return
     */
    List<SysTask> getTaskInstanceByNode(Long wfInsId,String domid);


    /**
     * 获取最新的环节实例任务
     * @param taskList 任务List
     * @return
     */
    List<SysTask> getLatestTaskInstance(List<SysTask> taskList);

    /**
     * 获取嵌套环节实例
     *
     * @param wfInsId   流程实例id
     * @param node 环节
     * @return
     */
    List<SysNodeInstance> getNestedNodeInstance(Long wfInsId,SysNode node);

    /**
     * 获取环节
     * @param wfInsId
     * @param nodeDomId
     * @return
     */
    SysNode getNodeByWfIns(Long wfInsId, String nodeDomId);


    /**
     * 获取环节所有子流程实例
     * @param node 环节
     * @param wfInsId 流程实例ID
     * @return
     */
    List<Map<String, Object>> getSubWorkflowInstanceList(SysNode node,Long wfInsId);

    /**
     * 切换流程发布状态
     *
     * @param id     流程id
     * @param status 发布状态
     */
    void switchWorkflowStatus(Long id, String status);

    /**
     * 获取流程表单权限数据
     *
     * @param formId
     * @param pageId
     * @param domId
     * @return
     */
    List<Map<String, Object>> getNodePageAuth(Long formId, Long pageId, String domId);

    Map<String, Map<String, Map<String, Object>>> getNodePageAuthMap(Long pageId, String domId);

    /**
     * 保存
     * @param pageId
     * @param domId
     * @param authData
     */
    void saveNodePageAuth(Long pageId, String domId, Map<String, Object> authData);
}
