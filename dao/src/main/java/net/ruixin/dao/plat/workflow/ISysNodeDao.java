package net.ruixin.dao.plat.workflow;


import net.ruixin.domain.plat.workflow.structure.frame.SysWorkflow;
import net.ruixin.domain.plat.workflow.structure.node.*;

import java.util.List;
import java.util.Map;

/**
 * Created by Jealous on 2016-8-9.
 * 环节DAO接口
 */
public interface ISysNodeDao {
    /**
     * 获取工作流的所有环节
     *
     * @param workflow 工作流
     * @return 环节List
     */
    List<SysNode> findNodesByWorkflow(SysWorkflow workflow);

    /**
     * 获取流程某个domid对应的环节
     * @param workflow
     * @param domid
     * @return
     */
    SysNode getNodeByWorkflowAndDomid(Long workflow,String domid);

    /**
     * 获取流程下所有环节
     * @param wfId
     * @return
     */
    List<SysNode> findNodeListByWorkflow(Long wfId);

    List<SysNode> findNodeListByWorkflowAndDomids(Long wfId, String[] domidArray);

    /**
     * 获取活动环节
     *
     * @param id 活动环节id
     * @return 活动环节
     */
    SysTransactNode getTransactNode(Long id);

    /**
     * 获取节点最大序号
     * @param wfId 流程id
     * @return
     */
    Integer getNodeMaxSort(Long wfId);

    /**
     * 获取流程的活动环节、嵌套环节
     * @param workflowId 流程ID
     * @return
     */
    List<Map<String,Object>> getActivityNodesByWorkflow(Long workflowId);

    /**
     * 保存环节
     *
     * @param node 环节对象
     */
    void save(SysNode node);

    /**
     * 获取活动环节
     *
     * @param id 活动环节ID
     * @return 活动环节
     */
    SysActivityNode getActivityNode(Long id);

    /**
     * 获取嵌套环节
     *
     * @param id 嵌套环节ID
     * @return 嵌套环节
     */
    SysNestedNode getNestedNode(Long id);

    /**
     * 获取决策环节
     *
     * @param id 决策环节ID
     * @return 决策环节
     */
    SysDecisionNode getDecisionNode(Long id);

    /**
     * 获得环节
     *
     * @param id 环节ID
     * @return 环节
     */
    SysNode get(Long id);

    /**
     * 获取后面的活动环节
     *
     * @param nodeId 节点ID
     * @param branch 决策条件
     * @param wid    流程实例ID
     * @return 活动环节List
     */
    List findNextTransactNodes(Long nodeId, String branch, Long wid);

    /**
     * 拷贝节点关联对象
     * @param sourceNode 源节点
     * @param targetNode 目标节点
     */
    String copyNodesRelatedObjects(SysNode sourceNode, SysNode targetNode);

    /**
     * 获取流程所有环节
     * @param workflowId 流程id
     */
    List<SysNode> findNodesByWorkflowId(Long workflowId);
}
