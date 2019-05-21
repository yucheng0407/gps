package net.ruixin.dao.plat.workflow.impl;

import net.ruixin.dao.plat.workflow.ISysTaskDao;
import net.ruixin.dao.plat.workflow.IWorkflowDao;
import net.ruixin.domain.plat.organ.SysOrgan;
import net.ruixin.domain.plat.workflow.instance.SysTask;
import net.ruixin.domain.plat.workflow.instance.SysWorkflowInstance;
import net.ruixin.domain.plat.workflow.structure.frame.SysWorkflow;
import net.ruixin.domain.plat.workflow.structure.node.SysActivityNode;
import net.ruixin.domain.plat.workflow.structure.node.SysNode;
import net.ruixin.util.hibernate.BaseDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * 流程任务类操作接口实现
 *
 * @author wcy
 * @date 2016-8-23
 */
@SuppressWarnings({"SqlDialectInspection", "SqlNoDataSourceInspection"})
@Repository
public class SysTaskDao extends BaseDao<SysTask> implements ISysTaskDao {

    @Autowired
    IWorkflowDao workflowDao;

    @Override
    public SysTask get(Long id) {
        return super.get(id);
    }

    @Override
    public SysTask getTaskByWorkflowInstanceAndUser(Long wId, Long userId) {
        return super.getByHql("from SysTask t where t.workflow_instance_id.id=? and t.user_id.id=?", wId, userId);
    }

    @Override
    public List<SysTask> findTasksByWorkflowInstance(Long id) {
        return super.findListByHql("from SysTask t where t.workflow_instance_id.id=? and " +
                "exists (select 1 from SysUser u where u.id = t.user_id.id and u.sfyxSt<>'0') order by t.id asc", id);
    }

    @Override
    public List<SysTask> findTasksByNodeInstanceId(Long id) {
        return super.findListByHql("from SysTask t where t.node_instance_id.id=? order by t.id desc", id);
    }

    @Override
    public List taskPage(Long wfiId, Long nodeId) {
        String sql = "SELECT T.ID,\n" +
                "       TO_CHAR(T.CJSJ, 'YYYY-MM-DD HH24:MI:SS') AS ALLOT_DATE,\n" +
                "       TO_CHAR(T.ACCEPT_DATE, 'YYYY-MM-DD HH24:MI:SS') AS ACCEPT_DATE,\n" +
                "       TO_CHAR(T.FINISH_DATE, 'YYYY-MM-DD HH24:MI:SS') AS FINISH_DATE,\n" +
                "       GET_DICT_VALUE(T.STATUS,'TASKSTATUS') STATUS,\n" +
                "       GET_DICT_VALUE(T.ACTION,'TASKACTION') ACTION,\n" +
                "       CASE\n" +
                "         WHEN US.ID IS NULL THEN\n" +
                "          '无法找到办理人！'\n" +
                "         ELSE\n" +
                "          US.USER_NAME\n" +
                "       END AS HANDLER\n  " +
                "    FROM SYS_TASK_INSTANCE T, SYS_NODE_INSTANCE N, SYS_USER US\n" +
                "    WHERE US.SFYX_ST = '1'\n" +
                "    AND N.SFYX_ST = '1'\n" +
                "    AND T.SFYX_ST = '1'\n" +
                "    AND US.ID = T.USER_ID\n" +
                "    AND T.NODE_INSTANCE_ID = N.ID\n" +
                "    AND N.NODE_ID = ? " +
                "    AND T.WORKFLOW_INSTANCE_ID = ?\n" +
                "    ORDER BY T.ID DESC";
        return super.getJdbcTemplate().queryForList(sql, nodeId, wfiId);
    }

    @Override
    public List getNodePageOpinion(Long wiId, Long spId) {
        String sql = "select n.id,\n" +
                "       np.id npId,\n" +
                "       np.spx_name spxName,\n" +
                "       nvl(tpi.task_page_opinion, '') opinion\n" +
                "  from sys_workflow_instance wi\n" +
                " inner join sys_node n\n" +
                "    on wi.workflow_id = n.workflow_id\n" +
                "   and n.sfyx_st = '1'\n" +
                "   and n.id in (select node_id from sys_node_instance where workflow_instance_id=? and sfyx_st='1')\n" +
                " inner join sys_node_page np\n" +
                "    on n.id = np.node_id\n" +
                "   and np.control = '1'\n" +
                "   and np.spx_name is not null\n" +
                "   and np.spx_name <> 'null'\n" +
                "   and np.sfyx_st = '1'\n" +
                "   and np.page_id =?\n" +
                "  left join (select *\n" +
                "               from (select rank() over(partition by node_page_id order by tpi.id desc) rn,\n" +
                "                            node_page_id,\n" +
                "                            TASK_PAGE_OPINION\n" +
                "                       from SYS_TASK_PAGE_INSTANCE tpi,\n" +
                "                            sys_task_instance         task\n" +
                "                      where tpi.sfyx_st = '1'\n" +
                "                        and task.sfyx_st = '1'\n" +
                "                        and task.id = tpi.task_Instance_id\n" +
                "                        and task.workflow_instance_id = ?\n" +
                "                        and tpi.TASK_PAGE_OPINION is not null\n" +
                "                        and tpi.if_opinion_show = '1') \n" +
                "              where rn = 1) tpi\n" +
                "    on tpi.node_page_id = np.id\n" +
                " where wi.sfyx_st = '1'\n" +
                "   and wi.id = ?\n" +
                " order by np.spx_sort asc\n";
        return super.getJdbcTemplate().queryForList(sql, wiId, spId, wiId, wiId);
    }

    @Override
    public List getPageOpinionWithCode(Long wiId) {
        String sql = "SELECT N.ID,\n" +
                "       NP.ID NPID,\n" +
                "       TPI.PAGE_CODE,\n" +
                "       NP.SPX_NAME SPXNAME,\n" +
                "       NVL(TPI.TASK_PAGE_OPINION, '') OPINION\n" +
                "  FROM SYS_WORKFLOW_INSTANCE WI\n" +
                " INNER JOIN SYS_NODE N\n" +
                "    ON WI.WORKFLOW_ID = N.WORKFLOW_ID\n" +
                "   AND N.SFYX_ST = '1'\n" +
                " INNER JOIN SYS_NODE_PAGE NP\n" +
                "    ON N.ID = NP.NODE_ID\n" +
                "   AND NP.CONTROL = '1'\n" +
                "   AND NP.SPX_NAME IS NOT NULL\n" +
                "   AND NP.SPX_NAME <> 'NULL'\n" +
                "   AND NP.SPX_PRINT = '1'\n" +
                "   AND NP.SFYX_ST = '1'\n" +
                "  LEFT JOIN (SELECT *\n" +
                "               FROM (SELECT RANK() OVER(PARTITION BY NODE_PAGE_ID ORDER BY TPI.ID DESC) RN,\n" +
                "                            NODE_PAGE_ID,\n" +
                "                            TASK_PAGE_OPINION,\n" +
                "                            SP.CODE AS PAGE_CODE\n" +
                "                       FROM SYS_TASK_PAGE_INSTANCE TPI,\n" +
                "                            SYS_TASK_INSTANCE         TASK,\n" +
                "                            SYS_RESOURCE              SP\n" +
                "                      WHERE TPI.SFYX_ST = '1'\n" +
                "                        AND TASK.SFYX_ST = '1'\n" +
                "                        AND SP.SFYX_ST = '1'\n" +
                "                        AND TASK.ID = TPI.TASK_INSTANCE_ID\n" +
                "                        AND SP.ID = TPI.PAGE_ID\n" +
                "                        AND TASK.WORKFLOW_INSTANCE_ID = ?\n" +
                "                        AND TPI.TASK_PAGE_OPINION IS NOT NULL \n" +
                "                        AND TPI.IF_OPINION_SHOW = '1')\n" +
                "              WHERE RN = 1) TPI\n" +
                "    ON TPI.NODE_PAGE_ID = NP.ID\n" +
                " WHERE WI.SFYX_ST = '1'\n" +
                "   AND WI.ID = ?\n" +
                " ORDER BY NP.SPX_SORT ASC \n";
        return super.getJdbcTemplate().queryForList(sql, wiId, wiId);
    }

    @Override
    public void saveTmpAuditOpinion(String auditOpinion) {
        String[] temp = auditOpinion.split("##");
        for (int i = 0; i < temp.length; i = i + 2) {
            String sql = "INSERT INTO temp_TASK_PAGE_BLYJ VALUES (" + temp[i] + ", ?)";
            super.executeSqlUpdate(sql, temp[i + 1]);
        }
    }

    @Override
    public List<Map<String, Object>> getSheetByNodeId(Long nodeId) {
        String sql = "SELECT NVL(NP.TITLE, P.NAME) \"name\", P.URL \"url\", N.CODE \"nodeCode\", P.CODE \"pageCode\", " +
                "       NP.CONTROL \"sheetMode\", NP.PAGE_ID \"pageId\", NP.SORT \"sId\", NP.ID \"npId\",N.SORT \"sort\",N.DOM_ID \"domId\",NP.DIY_FORM_ID \"formId\" " +
                "  FROM SYS_NODE_PAGE NP, SYS_RESOURCE P, SYS_NODE N\n" +
                " WHERE NP.PAGE_ID = P.ID\n" +
                "   AND N.ID = ?\n" +
                "   AND NP.NODE_ID = N.ID\n" +
                "   AND N.SFYX_ST = '1'\n" +
                "   AND NP.SFYX_ST = '1'\n" +
                "   AND P.SFYX_ST = '1'" +
                "   ORDER BY NP.SORT";
        return jdbcTemplate.queryForList(sql, nodeId);
    }

    @Override
    public SysNode getFirstActivityNode(String flowCode, String startWfVars, Long userId) {
        // 根据流程编码获取发布版本的流程
        SysWorkflow sysWorkflow = workflowDao.getReleasedWorkflowByCode(flowCode);
        Object rtnObj = super.callFuncAndReturn("{?=call PKG_WF.F_WF_GET_FIRST_ACT_NODE(?,?,?)}", sysWorkflow.getId(), startWfVars, userId);
        if(rtnObj != null) {
            return (SysActivityNode) getSession().get(SysActivityNode.class, Long.parseLong(rtnObj.toString()));
        }
        return null;
    }

    @Override
    public String getHandleTypes(Long taskId, Long nodeId, Long userId) {
        return super.prepareCallAndReturn("{CALL PKG_TASK.P_BUTTON_IFSHOW(?,?,?,?,?)}", taskId, nodeId, userId);
    }

    @Override
    public SysOrgan getOrganById(Long organId) {
        return (SysOrgan) super.getSession().get(SysOrgan.class, organId);
    }

    @Override
    public void updateTmpData(Long id, String tmpJson) {
        super.executeSqlUpdate("UPDATE SYS_TASK_PAGE_INSTANCE SET TMP_DATA_JSON=? WHERE TASK_INSTANCE_ID=? AND SFYX_ST='1' ", tmpJson, id);
    }

    @Override
    public List<SysTask> getRunningTasks(SysWorkflowInstance workflowInstance) {
        return super.findListByHql("from SysTask t where (t.status='0' or t.status = '1') and t.workflow_instance_id=?", workflowInstance);
    }

    @Override
    public List<SysTask> getTaskInstanceByNode(Long wfInsId, String nodeDomId) {
        return super.findListByHql("select ti from SysTask ti,SysNodeInstance ni,SysNode n where\n" +
                "ti.node_instance_id.id=ni.id and ti.sfyxSt='1'\n" +
                "and ni.node_id.id=n.id and ni.workflow_instance_id.id=? and ni.sfyxSt='1'\n" +
                "and n.domid=? and n.sysWorkflow=ni.workflow_instance_id.workflow_id and n.sfyxSt='1' \n" +
                "order by greatest(nvl(ti.cjsj, to_date('190001', 'yyyymm')), nvl(ti.accept_date,to_date('190001', 'yyyymm'))," +
                " nvl(ti.finish_date, to_date('190001', 'yyyymm'))) desc", wfInsId, nodeDomId);
    }

    @Override
    public List<Map<String, Object>> getLatestTaskInstanceList(Long wfInstId) {
        return super.getJdbcTemplate().queryForList("SELECT G.*\n" +
                "  FROM (SELECT T.*,\n" +
                "               ROW_NUMBER() OVER(PARTITION BY NODE_ID ORDER BY CJSJ DESC) AS ROW_ID\n" +
                "           FROM (SELECT TI.*, NI.STATUS NI_STATUS, NI.NODE_ID, N.DOM_ID,AN.TRANSACT_TYPE\n" +
                "                  FROM SYS_TASK_INSTANCE TI, SYS_NODE_INSTANCE NI, SYS_NODE N,SYS_ACTIVITY_NODE AN\n" +
                "                 WHERE TI.WORKFLOW_INSTANCE_ID = ?\n" +
                "                   AND TI.NODE_INSTANCE_ID = NI.ID\n" +
                "                   AND NI.NODE_ID = N.ID\n" +
                "                   AND TI.SFYX_ST = '1'\n" +
                "                   AND NI.SFYX_ST = '1') T) G\n" +
                " WHERE G.ROW_ID = 1", wfInstId);
    }
}
