package net.ruixin.dao.plat.workflow;

import net.ruixin.domain.plat.workflow.instance.SysNodeInstance;
import net.ruixin.domain.plat.workflow.instance.SysWorkflowInstance;

import java.util.List;
import java.util.Map;

/**
 * Created by Jealous on 2016-10-25.
 * 环节实例DAO接口
 */
public interface ISysNodeInstanceDao {
    /**
     * 根据流程实例ID获取环节实例
     * @param id 流程实例ID
     * @return 环节实例
     */
    List<SysNodeInstance> getSysNodeInstanceListByWorkflowInstanceId(Long id);

//    /**
//     * 根据流程实例获得环节实例
//     * @param workflowInstance 流程实例
//     * @return 环节实例List
//     */
//    List<SysNodeInstance> findNodeInstancesByWorkflowInstance(SysWorkflowInstance workflowInstance);

    /**
     * 根据流程实例获得活动环节实例
     * @param workflowInstance 流程实例
     * @return 活动环节实例List
     */
    List<SysNodeInstance> findActivityNodeInstanceByWorkflowInstance(SysWorkflowInstance workflowInstance);

    /**
     * 找到运行中的环节
     * @param workflowInstance 流程实例
     * @return 环节实例
     */
    SysNodeInstance findRunningNode(SysWorkflowInstance workflowInstance);

    /**
     * 找到运行中的环节ids
     * @param wiId 流程实例id
     * @return ids
     */
    String getRunningNodeIds(Long wiId);

    /**
     * 根据流程实例ID和环节ID获取环节实例列表
     * @param workflowInstanceId 流程实例ID
     * @param transactNodeid 环节ID
     * @return 环节实例列表
     */
    List<SysNodeInstance> getTransactList(Long workflowInstanceId, Long transactNodeid);

    /**
     * 根据流程实例ID获取嵌套流程实例最新状态
     * @param workflowInstanceId 流程实例ID
     * @return 环节实例列表
     */
    List<Map<String,Object>> getNestedNodeInstanceList(Long workflowInstanceId);
}
