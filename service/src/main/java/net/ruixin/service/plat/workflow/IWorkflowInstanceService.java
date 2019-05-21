package net.ruixin.service.plat.workflow;

import net.ruixin.domain.plat.workflow.instance.SysTask;
import net.ruixin.domain.plat.workflow.instance.SysWorkflowInstance;
import net.ruixin.domain.plat.workflow.structure.node.SysNode;
import net.ruixin.util.data.FlowParam;
import net.ruixin.util.paginate.FastPagination;

import java.util.List;
import java.util.Map;

/**
 * @author wcy
 * @date 2016-8-16
 * 流程实例接口
 */
@SuppressWarnings("unused")
public interface IWorkflowInstanceService {
    /**
     * 获取流程实例
     *
     * @param id 实例ID
     * @return
     */
    SysWorkflowInstance get(Long id);

    /**
     * 发起流程
     *
     * @param flowCode    流程编码
     * @param dataId      业务数据ID
     * @param startUserId 流程启动人ID
     * @param title       流程实例标题
     * @param type        是否为草稿(draft)标识
     * @param startWfVars 流程启动变量
     * @param sourceData  源数据，用于业务中自已处理
     * @return 流程实例ID
     */
    Long startWorkflow(String flowCode, Long dataId, Long startUserId, String title, String type,
                       String startWfVars, String sourceData);

    /**
     * 发起流程并返回任务
     *
     * @param flowCode    流程编码
     * @param dataId      业务数据ID
     * @param startUserId 流程启动人ID
     * @param title       流程实例标题
     * @param type        是否为草稿(draft)标识
     * @param startWfVars 流程启动变量
     * @param sourceData  源数据，用于业务中自已处理
     * @return 当前用户任务
     */
    SysTask startWorkflowAndReturnTask(String flowCode, Long dataId, Long startUserId, String title, String type,
                                       String startWfVars, String sourceData);

    /**
     * @param flowCode    流程编码
     * @param dataId      业务数据ID
     * @param startUserId 流程启动人
     * @param opinion     办理意见
     * @param title       流程实例标题
     * @param wfVars      流程变量及值
     * @param sourceData  源数据
     * @param dataIds     数据ids，格式dataId:1,pageId:"",formId:"";dataId:1,pageId:"",formId:"";
     * @param startWfVars 流程启动变量设置var1:val1;var2:val2
     * @return 返回提交成功信息
     */
    String startWorkflowAndSubmit(String flowCode, Long dataId, Long startUserId, String opinion, String title, String wfVars,
                                  String sourceData, String dataIds, String startWfVars);

    /**
     * 根据流程编码启动流程,并返回下一环节信息
     *
     * @param flowCode    流程编码
     * @param dataId      业务数据ID
     * @param startUserId 流程启动人
     * @param title       流程实例标题
     * @param wfVars      流程变量及值
     * @param sourceData  源数据
     * @param dataIds     数据ids，格式dataId:1,pageId:"",formId:"";dataId:1,pageId:"",formId:"";
     * @param startWfVars 流程启动变量设置var1:val1;var2:val2
     * @return
     */
    Map<String, Object> startWorkflowAndGetHandleData(String flowCode, Long dataId, Long startUserId, String title, String wfVars,
                                                      String sourceData, String dataIds, String startWfVars);

    /**
     * 签收任务
     *
     * @param taskId 任务id
     * @return 操作结果
     */
    String signTask(Long taskId);

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
    String submitTask(Long taskId, String nodeUserIds, String decision, String opinion, String fjId, String auditOpinion, Long dataId,
                      boolean draft, String title, String wfVars, String dataIds);

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
    String backTask(Long taskId, String nodeWfUserIds, String opinion, String fjId, String auditOpinion, Long dataId, String title,
                    String wfVars, String dataIds, boolean isSpecialBack);

    /**
     * 撤回
     *
     * @param taskId 任务实例ID
     * @return 操作结果
     */
    String recoverTask(Long taskId);

    /**
     * 获取流程确认办理页面的数据
     *
     * @param taskId        任务ID
     * @param agree         1提交 0退回
     * @param wfVars        流程变量及值
     * @param decision      手动决策条件
     * @param backWfNodeIds 指定退回的流程环节IDS N1|W1,N2|W2
     * @param dataIds       数据ids，格式dataId:1,pageId:"",formId:"";dataId:1,pageId:"",formId:"";
     * @param hasFlag       是否已经做过逻辑赋值
     * @return
     */
    Map<String, Object> getHandleData(Long taskId, boolean agree, String wfVars, String decision, String backWfNodeIds,
                                      String dataIds, Boolean hasFlag);

    /**
     * 删除流程实例
     *
     * @param wiId 流程实例ID
     * @return 操作结果
     */
    @SuppressWarnings("UnusedReturnValue")
    String delWorkflowInstance(Long wiId);

    /**
     * 根据流程ID和业务数据ID获取最新的任务ID
     *
     * @param wId    流程ID
     * @param dataId 数据ID
     * @param userId 用户ID
     * @return 任务ID
     */
    Long getLatestTaskIdByDataId(Long wId, Long dataId, Long userId);

    /**
     * 根据流程实例ID获取最新的任务ID
     *
     * @param wiId   工作流实例ID
     * @param userId 用户ID
     * @return 任务ID
     */
    Long getLatestTaskIdByWiId(Long wiId, Long userId);

    /**
     * 获取工作流表单地址
     *
     * @param flowCode 流程实例ID
     * @param dataId   数据ID
     * @return 表单地址
     */
    String getWorkflowSheetUrl(String flowCode, Long dataId);

    /**
     * 获取办理人列表
     *
     * @param rwid        任务ID
     * @param agree       是否同意
     * @param decision    决策条件
     * @param backNodeIds 指定退回的环节IDS
     * @return 办理人List
     */
    Map<String, Object> getTransactor(Long rwid, Boolean agree, String decision, String backNodeIds);

    /**
     * 更新流程实例数据接口
     *
     * @param param  流程办理参数
     * @param dataId 数据ID
     * @param title  标题
     */
    void updateWorkflowInstanceData(FlowParam param, Long dataId, String title);

    /**
     * 根据任务ID更新流程实例数据
     *
     * @param taskId      任务ID
     * @param columnName  列名
     * @param columnValue 值
     */
    void updateWorkflowInstanceData(Long taskId, String columnName, Object columnValue);

    /**
     * 更新任务表单实例数据接口
     *
     * @param param  流程办理参数
     * @param dataId 数据ID
     */
    void updateTaskPageInstanceData(FlowParam param, Long dataId);

    /**
     * 更新任务表单tmpData
     *
     * @param taskId     任务ID
     * @param nodePageId 环节表单ID
     * @param tmpData    临时保存数据
     */
    void updateTmpData(Long taskId, Long nodePageId, String tmpData);

    /**
     * 清空任务表单tmpData
     *
     * @param taskId 任务ID
     */
    void emptyTmpData(Long taskId);

    /**
     * 获取特送退回的环节树
     *
     * @param taskId 任务ID
     * @return 环节list
     */
    List getSpecialBackTree(Long taskId);

    /**
     * 获取环节实例列表数据
     *
     * @param id       流程实例ID
     * @param flowCode 流程编码
     * @return 结构json数据
     */
    Object getSimpleWorkflowJSON(Long id, String flowCode);

    /**
     * 流程批量办理
     *
     * @param userId    用户ID
     * @param wfiIds    流程实例ID序列
     * @param opinion   批量办理意见
     * @param handleTag 办理结果标识
     * @return 结果
     */
    String batchProcess(Long userId, String wfiIds, String opinion, String handleTag);

    /**
     * 初始化一个环节中需要的变量
     *
     * @param param 流程办理参数
     * @param name  变量名称
     * @param value 变量的值
     * @return 赋值结果
     */
    boolean initVariable(FlowParam param, String name, String value);

    /**
     * 获取流程意见（暂为实现打印，包含页面编码）
     *
     * @param wiId 流程实例Id
     * @return 赋值结果
     */
    List getPageOpinionWithCode(Long wiId);

    /**
     * 插入流程涉及人员
     *
     * @param param 流程参数
     * @param ids   人员ids字符串，id以逗号隔开
     */
    void insertWorkflowAdditionUsers(FlowParam param, String ids);

    /**
     * 根据ID获取单个流程实例实体
     *
     * @param id 流程实例ID
     * @return 流程实例实体
     */
    SysWorkflowInstance getById(Long id);

    /**
     * 根据流程实例查找运行中的环节
     *
     * @param win 流程实例
     * @return sysNode
     */
    SysNode findRunningNode(SysWorkflowInstance win);

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
     * @param id     任务ID
     * @param wfVars 流程变量及值
     */
    void initVariable(Long id, String wfVars);

    /**
     * 获取要退回的环节
     *
     * @param nodeId  环节ID
     * @param wfInsId 流程实例ID
     * @return 要退回的环节
     */
    List<Map<String, Object>> getBackNodes(Long nodeId, Long wfInsId);

    /**
     * 催办响应
     *
     * @param taskId 发起催办任务id
     */
    void pressTask(Long taskId, String content);

    /**
     * 处理决策环节的变量，
     *
     * @param workflowInstance
     * @param wfVars           变量
     * @return
     */
    String handleVars(SysWorkflowInstance workflowInstance, SysNode sysNode, String wfVars, Map<String, Map<String, Object>> dataMap);

    /**
     * 获取决策变量赋值表达式
     *
     * @param node
     * @return
     */
    Map<String, Object> getAssignLogic(SysNode node);

    /**
     * 获取流程流转历史
     *
     * @param taskId 任务id
     * @return
     */
    List<Map<String, Object>> getWorkflowLzHistory(Long taskId);

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
     * 获取用户业务的统计
     *
     * @param map
     * @return
     */
    FastPagination getUserTjList(Map map);

    /**
     * 获取部门业务的统计
     *
     * @param map
     * @return
     */
    FastPagination getOrganTjList(Map map);

    /**
     * 获取流程拟办列表
     *
     * @param map
     * @return
     */
    FastPagination getNbList(Map map);

    Map getUserPieData(Long userId, String timeType);

    Map getOrganColumnData(Long userId, String timeType);
}
