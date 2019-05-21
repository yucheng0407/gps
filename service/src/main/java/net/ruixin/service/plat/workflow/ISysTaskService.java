package net.ruixin.service.plat.workflow;

import net.ruixin.domain.plat.workflow.instance.SysTask;

import java.util.List;
import java.util.Map;

/**
 * 任务实例类操作接口
 *
 * @author wcy
 * @date 2016-8-23
 */
public interface ISysTaskService {

    /**
     * 获取任务实例
     *
     * @param id 实例ID
     * @return 任务实例
     */
    SysTask get(Long id);

    /**
     * 构造流程任务JSON数据
     *
     * @param id     任务id
     * @param userId 当前用户ID
     * @return JSON数据
     */
    Map generateTaskHandleJson(Long id, Long userId);

    /**
     * 根据流程实例和用户，获取流程任务
     *
     * @param wId    流程实例ID
     * @param userId 用户ID
     * @return 流程任务
     */
    SysTask getTaskByWorkflowInstanceAndUser(Long wId, Long userId);

    /**
     * 根据流程任务，判断是否是开始节点
     *
     * @param task 流程任务
     * @return 判断结果
     */
    Boolean isFristNode(SysTask task);

    /**
     * 根据流程实例获取所有的流程任务
     *
     * @param id 流程实例ID
     * @return 流程任务List
     */
    List<SysTask> findTasksByWorkflowInstance(Long id);


    /**
     * 判断是否有环节表单
     *
     * @param task 流程任务
     * @return 判断结果
     */
    Boolean isSheetDrive(SysTask task);

    /**
     * 是否可退回
     *
     * @param task 流程任务
     * @return 判断结果
     */
    Boolean isReturned(SysTask task);

    /**
     * 根据任务查环节页面
     *
     * @param task   流程任务
     * @param userId 当前用户ID
     * @return 页面list
     */
    List<Map<String, Object>> findSheetByTask(SysTask task, Long userId);

    /**
     * 通过环节实例获取任务列表
     *
     * @param nodeInstanceId 环节实例
     * @return 任务列表
     */
    List<SysTask> findTasksByNodeInstanceId(Long nodeInstanceId);

    /**
     * 任务列表
     *
     * @param wfiId  环节实例ID
     * @param nodeId 环节ID
     * @return 任务列表
     */
    List taskPage(Long wfiId, Long nodeId);

    /**
     * 获取动态流程意见
     *
     * @param wiId   流程实例Id
     * @param pageId 页面ID
     * @return 赋值结果
     */
    List getNodePageOpinion(Long wiId, Long pageId);

    /**
     * 将流程意见存入临时表
     *
     * @param auditOpinion 审批意见
     */
    void saveTmpAuditOpinion(String auditOpinion);

    /**
     * 根据流程编码获取josn数据
     *
     * @param flowCode 流程编码
     * @param wfVars 流程启动变量设置
     * @param userId 当前登录人ID
     * @return map
     */
    Map generateTaskHandleJson(String flowCode, String wfVars, Long userId);

    /**
     * 更新草稿数据
     *
     * @param id      任务ID
     * @param tmpJson 草稿数据
     */
    void updateTmpData(Long id, String tmpJson);
}
