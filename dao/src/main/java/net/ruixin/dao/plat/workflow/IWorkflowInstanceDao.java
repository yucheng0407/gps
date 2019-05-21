package net.ruixin.dao.plat.workflow;

import net.ruixin.domain.plat.workflow.instance.SysWorkflowInstance;
import net.ruixin.domain.plat.workflow.structure.node.SysNode;
import net.ruixin.enumerate.plat.TaskFinishEnum;
import net.ruixin.util.paginate.FastPagination;

import java.util.List;
import java.util.Map;

/**
 * @author Jealous
 * @date 2016-8-16
 * 流程实例类DAO接口
 */
public interface IWorkflowInstanceDao {
    /**
     * 签收任务
     *
     * @param id 任务ID
     * @return 签收结果
     */
    String signTask(Long id);

    /**
     * 提交任务
     * @param param
     * @return
     */
    String submitTask(List param);

    /**
     * 退回任务
     * @param param
     * @return
     */
    String backTask(List param);

    /**
     * 撤回
     *
     * @param id 任务实例ID
     * @return 返回结果
     */
    String recoverTask(Long id);

    /**
     * 启动流程
     *
     * @param param 启动参数
     * @return 返回结果
     */
    String startWorkflow(List<Object> param);

    /**
     * 启动流程
     * @param wfId 流程ID
     * @param startUserId 启动人ID
     * @param dataId 业务数据ID
     * @param startWfVars 流程启动变量
     * @param wfInsTitle 流程实例标题
     * @param dataSource 源数据
     * @return 返回信息 流程启动成功,WF_INS_ID
     */
    String startWorkflow(Long wfId, Long startUserId, Long dataId, String startWfVars, String wfInsTitle, String dataSource);

    /**
     * 删除流程实例
     *
     * @param wiId 流程实例ID
     * @return 执行结果
     */
    String delWorkflowInstance(Long wiId);

    /**
     * 通过流程ID获取环节表单数
     *
     * @param wid 流程ID
     * @return 环节表单数
     */
    int getNodeSheetcount(Long wid);

    /**
     * 根据流程ID和业务数据ID
     * 获取当前办理人最新的任务
     *
     * @param wId    流程ID
     * @param dataId 业务数据ID
     * @param userId 用户ID
     * @return 任务ID
     */
    Long getLatestTaskIdByDataId(Long wId, Long dataId, Long userId);

    /**
     * 根据流程实例ID获取当前办理人的最新任务
     *
     * @param wiId       流程实例名称
     * @param userId     任务办理人
     * @param taskFinish 任务状态是否完成:0未完成,1完成
     * @return 任务ID
     */
    Long getLatestTaskIdByWiId(Long wiId, Long userId, TaskFinishEnum taskFinish);

    /**
     * 获取办理人
     *
     * @param rwid        任务ID
     * @param agree       是否同意
     * @param decision    决策条件
     * @param backNodeIds 指定退回的环节IDS
     * @return 办理人list
     */
    List getBlrList(Long rwid, Boolean agree, String decision, String backNodeIds);

    void updateWorkflowInstanceData(Long taskId, String columnName, Object columnValue);

    /**
     * 获取特送退回的环节树
     *
     * @param taskId 任务ID
     * @return List
     */
    List<Map<String, Object>> getSpecialBackTree(Long taskId);

    /**
     * 获取流程实例对象
     *
     * @param id 流程实例ID
     * @return 流程实例对象
     */
    SysWorkflowInstance get(Long id);

    /**
     * 流程批量办理
     *
     * @param userId    用户ID
     * @param wfiIds    流程实例ID序列
     * @param opinion   批量办理意见
     * @param handleTag 1 提交 0退回
     * @return str
     */
    String batchProcess(Long userId, String wfiIds, String opinion, String handleTag);

    /**
     * 插入流程涉及人员
     *
     * @param wiId 流程实例Id
     * @param nId  流程环节Id
     * @param ids  人员ids字符串，id以逗号隔开
     */
    void insertWorkflowAdditionUsers(Long wiId, Long nId, String ids);

    /**
     * 根据ID获取流程实例
     *
     * @param id 流程实例ID
     * @return SysWorkflowInstance
     */
    SysWorkflowInstance getById(Long id);

    /**
     * 更新环节页面实例表中path（表SYS_NODE_PAGE_INSTANCE存在时使用）
     *
     * @param path   文件名/路径
     * @param pageId 页面id
     * @param winId  流程实例id
     */
    void updateWordpath(String path, Long pageId, Long winId);

    /**
     * 更新任务页面实例表中签章模板路径（表SYS_NODE_PAGE_INSTANCE不存在时使用）
     *
     * @param path     路径
     * @param pageCode 页面编码
     * @param wfInsId  流程实例ID
     */
    void updateWordPath(String path, String pageCode, Long wfInsId);

    /**
     * 根据任务id查找业务数据id
     *
     * @param id 任务id
     * @return 业务数据id
     */
    Long getDataIdByTaskId(Long id);

    /**
     * 更新流程变量
     *
     * @param taskId 任务ID
     * @param wfVars 流程变量及值
     */
    void initVariable(Object taskId, String wfVars);

    /**
     * 获取环节要退回的环节
     *
     * @param nodeId 环节ID
     * @param wfInsId 流程实例ID
     * @return 要退回的环节
     */
    List<Map<String, Object>> getBackNodes(Long nodeId, Long wfInsId);

    /**
     * 直接执行后置SQL
     *
     * @param sql
     */
    void processSqlPost(String sql);

    /**
     * 执行存储过程后置
     *
     * @param procedureName 存储过程名
     * @param wfInsId       流程实例ID
     */
    void processProcedurePost(String procedureName, Long wfInsId);

    /**
     * 根据流程实例ID获取所有流程变量当前值
     *
     * @param wfInsId 流程实例ID
     * @return
     */
    List<Map<String, Object>> getAllWfVariableIns(Long wfInsId);

    /**
     * 获取流程操作记录
     *
     * @param wiId 流程实例id
     * @return
     */
    List<Map<String, Object>> getWorkflowOperations(Long wiId);

    /**
     * 获取流程待办列表
     *
     * @param map
     * @return
     */
    FastPagination getDbList(Map map);

    /**
     * 获取流程在办列表
     *
     * @param map
     * @return
     */
    FastPagination getZbList(Map map);

    /**
     * 获取流程已办列表
     *
     * @param map
     * @return
     */
    FastPagination getYbList(Map map);

    /**
     * 获取用户流程统计
     *
     * @param map
     * @return
     */
    FastPagination getUserTjList(Map map);

    List<Map<String, Object>> getUserTjList(Long userId, String timeType);

    /**
     * 获取部门流程统计
     *
     * @param map
     * @return
     */
    FastPagination getOrganTjList(Map map);

    List<Map<String, Object>> getOrganTjList(Long userId, String timeType);

    /**
     * 获取流程拟办列表
     *
     * @param map
     * @return
     */
    FastPagination getNbList(Map map);

    /**
     * 获取子流程实例
     * @param nodeInstanceId 环节实例ID
     * @return
     */
    List<Map<String,Object>> getSubWorkflowInstanceList(Long nodeInstanceId);

    /**
     * 获取子流程实例
     * @param node 环节
     * @param wfInsId 流程实例ID
     * @return
     */
    List<Map<String,Object>> getSubWorkflowInstanceList(SysNode node,Long wfInsId);
}
