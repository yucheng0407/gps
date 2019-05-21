package net.ruixin.dao.plat.workflow.impl;

import net.ruixin.dao.plat.workflow.IWorkflowInstanceDao;
import net.ruixin.domain.plat.workflow.instance.SysWorkflowInstance;
import net.ruixin.domain.plat.workflow.structure.node.SysNode;
import net.ruixin.enumerate.plat.SfyxSt;
import net.ruixin.enumerate.plat.TaskFinishEnum;
import net.ruixin.util.hibernate.BaseDao;
import net.ruixin.util.paginate.FastPagination;
import net.ruixin.util.tools.RxStringUtils;
import oracle.jdbc.OracleTypes;
import org.springframework.stereotype.Repository;

import java.util.*;

/**
 * Created by Jealous on 2016-8-16.
 * 流程实例类DAO接口实现
 */
@SuppressWarnings({"SqlDialectInspection", "SqlNoDataSourceInspection"})
@Repository
public class WorkflowInstanceDao extends BaseDao<SysWorkflowInstance> implements IWorkflowInstanceDao {

    @Override
    public String signTask(Long id) {
        return super.prepareCallAndReturn("{call PKG_TASK.P_TASK_SIGN(?,?,?)}", id);
    }

    @Override
    public String submitTask(List param) {
        String result = super.prepareCallAndReturn("{call PKG_TASK.P_TASK_SUBMIT(?,?,?,?,?,?,?)}", param.toArray());
        super.getSession().clear();
        return result;
    }

    @Override
    public String backTask(List param) {
        String result = super.prepareCallAndReturn("{call PKG_TASK.P_TASK_BACK(?,?,?,?,?,?)}", param.toArray());
        super.getSession().clear();
        return result;
    }

    @Override
    public String recoverTask(Long id) {
        String result = super.prepareCallAndReturn("{call PKG_TASK.P_TASK_RECOVER(?,?,?)}", id);
        super.getSession().clear();
        return result;
    }

    @Override
    public String startWorkflow(List<Object> param) {
        return super.prepareCallAndReturn("{call PKG_WF.P_WORKFLOW_START(?,?,?,?,?,?,?,?,?,?)}", param.toArray());
    }

    @Override
    public String startWorkflow(Long wfId, Long startUserId, Long dataId, String startWfVars, String wfInsTitle, String dataSource) {
        List params = Arrays.asList(wfId, startUserId, "0", startWfVars, null, dataId, wfInsTitle, dataSource);
        return super.prepareCallAndReturn("{call PKG_WF.P_WORKFLOW_START(?,?,?,?,?,?,?,?,?,?)}", params.toArray());
    }

    @Override
    public String delWorkflowInstance(Long wiId) {
        return super.prepareCallAndReturn("{call PKG_WF.P_WORKFLOW_INSTANCE_DELETE(?,?,?)}", wiId);
    }

    @Override
    public int getNodeSheetcount(Long wid) {
        return super.getJdbcTemplate().queryForObject("SELECT COUNT(1) AS NUM FROM SYS_NODE_PAGE_INSTANCE P, " +
                "SYS_NODE_INSTANCE N WHERE P.NODE_INSTANCE_ID = N.ID AND P.DATA_ID IS NOT NULL " +
                "AND N.WORKFLOW_INSTANCE_ID = ?", Integer.class, wid);
    }

    @Override
    public Long getLatestTaskIdByWiId(Long wiId, Long userId, TaskFinishEnum taskFinish) {
        List paramList = new ArrayList();
        StringBuilder sb = new StringBuilder("SELECT MAX(TI.ID) AS ID FROM SYS_TASK_INSTANCE TI WHERE TI.SFYX_ST = '1' ");
        if (wiId != null) {
            sb.append("AND TI.WORKFLOW_INSTANCE_ID = ? ");
            paramList.add(wiId);
        }
        if (userId != null) {
            sb.append("AND TI.USER_ID = ? ");
            paramList.add(userId);
        }
        if (taskFinish != null) {
            sb.append("AND TI.IS_FINISH = ? ");
            paramList.add(taskFinish.value);
        }
        return jdbcTemplate.queryForObject(sb.toString(), Long.class, paramList.toArray());
    }

    @Override
    public Long getLatestTaskIdByDataId(Long wId, Long dataId, Long userId) {
        StringBuilder sb = new StringBuilder("SELECT MAX(STI.ID) AS SID " +
                "FROM SYS_WORKFLOW SW, SYS_WORKFLOW_INSTANCE SWI, SYS_TASK_INSTANCE STI " +
                "WHERE SW.ID = SWI.WORKFLOW_ID " +
                "AND SWI.ID = STI.WORKFLOW_INSTANCE_ID " +
                "AND SWI.DATA_ID = ? " +
                "AND SW.WORKFLOW_ID = ? ");
        List<Long> paramList = Arrays.asList(dataId, wId);
        if (userId != null) {
            sb.append("AND STI.USER_ID = ?");
            paramList.add(userId);
        }
        return jdbcTemplate.queryForObject(sb.toString(), Long.class, paramList.toArray());
    }

    @Override
    public List getBlrList(Long rwid, Boolean agree, String decision, String backNodeIds) {
        List<Object> param = new ArrayList<>();
        param.add(rwid);
        param.add(decision);
        param.add(agree ? "1" : "0");
        param.add(backNodeIds);
        List<Integer> data = new ArrayList<>();
        data.add(OracleTypes.CURSOR);
        data.add(OracleTypes.VARCHAR);
        return super.prepareCallAndReturnCustom("{call PKG_WF.P_WF_NEXT_NODE_USER(?,?,?,?,?,?,?)}", param, data);
    }

    @Override
    public void updateWorkflowInstanceData(Long taskId, String columnName, Object columnValue) {
        if (RxStringUtils.isNotEmpty(columnName)) {
            String sql = "UPDATE SYS_WORKFLOW_INSTANCE WI SET WI." + columnName + "=?" +
                    " WHERE WI.SFYX_ST = '1' " +
                    "      AND WI.ID = (SELECT TI.WORKFLOW_INSTANCE_ID " +
                    "                     FROM SYS_TASK_INSTANCE TI " +
                    "                     WHERE TI.ID = ? AND TI.SFYX_ST = '1')";
            super.executeSqlUpdate(sql, columnValue, taskId);
        }
    }

    /**
     * 获取特送退回的环节树
     *
     * @param taskId 任务ID
     */
    @Override
    public List<Map<String, Object>> getSpecialBackTree(Long taskId) {
        String sql = "select distinct f_node_id node_id, wiId wf_ins_id, f_node_name name \n" +
                "  from (select ni.node_id,\n" +
                "               fn.id               f_node_id,\n" +
                "               fn.name             f_node_name,\n" +
                "               ti.node_instance_id task_node_id,\n" +
                "               ni.WORKFLOW_INSTANCE_ID wiId\n" +
                "          from sys_node_instance ni,\n" +
                "               sys_node_instance fni,\n" +
                "               sys_node          fn,\n" +
                "               sys_task_instance ti\n" +
                "         where ni.type = 'SUBMIT'\n" +
                "           and ni.workflow_instance_id = ti.workflow_instance_id\n" +
                "           and ti.id = ? \n" +
                "           and ni.sfyx_st = '1'\n" +
                "           and fni.id = ni.from_node_ins_id\n" +
                "           and fn.id = fni.node_id\n" +
                "           and fni.sfyx_st = '1'\n" +
                "           and fn.sfyx_st = '1') p\n" +
                " start with p.node_id = (select nn.node_id\n" +
                "                           from sys_node_instance nn\n" +
                "                          where nn.id = task_node_id\n" +
                "                            and nn.sfyx_st = '1')\n" +
                "connect by prior p.f_node_id = p.node_id\n ";
        return super.getJdbcTemplate().queryForList(sql, taskId);
    }

    @Override
    public SysWorkflowInstance get(Long id) {
        return super.get(id);
    }

    @Override
    public String batchProcess(Long userId, String wfiIds, String opinion, String handleTag) {
        return super.prepareCallAndReturn("{call PKG_WF.P_WORKFLOW_BATCH_HANDLE(?,?,?,?,?,?)}", wfiIds, userId, opinion, handleTag);
    }

    @Override
    public void insertWorkflowAdditionUsers(Long wiId, Long nId, String ids) {
        String sql = "insert into sys_wf_auto_handle_user(WORKFLOW_INSTANCE_ID,NODE_ID,USER_ID)\n" +
                "select ?,?,x\n" +
                "from (select column_value x from table( splitstr('" + ids + "',',')))\n";
        super.getJdbcTemplate().update(sql, wiId, nId);
    }

    @Override
    public SysWorkflowInstance getById(Long id) {
        return super.get(id);
    }

    @Override
    public void updateWordpath(String path, Long pageId, Long winId) {
        String sql = "UPDATE SYS_NODE_PAGE_INSTANCE NPI SET NPI.PATH=? WHERE NPI.NODE_INSTANCE_ID IN " +
                "(SELECT NI.ID FROM SYS_NODE_INSTANCE NI WHERE NI.WORKFLOW_INSTANCE_ID=?) " +
                "AND NPI.PAGE_ID=? ";
        super.executeSqlUpdate(sql, path, winId, pageId);
    }

    @Override
    public void updateWordPath(String path, String pageCode, Long wfInsId) {
        String sql = "UPDATE SYS_TASK_PAGE_INSTANCE TPI\n" +
                "   SET TPI.PATH = ?\n" +
                " WHERE TPI.TASK_INSTANCE_ID IN\n" +
                "       (SELECT TI.ID\n" +
                "          FROM SYS_TASK_INSTANCE TI\n" +
                "         WHERE TI.WORKFLOW_INSTANCE_ID = ?\n" +
                "           AND TI.SFYX_ST = '1')\n" +
                "   AND TPI.PAGE_ID = (SELECT R.ID FROM SYS_RESOURCE R WHERE R.CODE=? AND R.SFYX_ST='1')\n" +
                "   AND TPI.SFYX_ST = '1' ";
        super.executeSqlUpdate(sql, path, wfInsId, pageCode);
    }

    @Override
    public Long getDataIdByTaskId(Long id) {
        String sql = "SELECT WI.DATA_ID\n" +
                "  FROM SYS_WORKFLOW_INSTANCE WI, SYS_TASK_INSTANCE TI\n" +
                " WHERE WI.ID = TI.WORKFLOW_INSTANCE_ID\n" +
                "   AND WI.SFYX_ST = '1'\n" +
                "   AND TI.SFYX_ST = '1' " +
                "   AND TI.ID=? ";
        return Long.valueOf(super.getJdbcTemplate().queryForMap(sql, id).get("DATA_ID").toString());
    }

    @Override
    public void initVariable(Object taskId, String wfVars) {
        super.prepareCallNoReturn("{call PKG_WF.P_WF_INIT_VARIABLE(?,?,?)}", taskId, wfVars);
    }

    @Override
    public List<Map<String, Object>> getBackNodes(Long nodeId, Long wfInsId) {
        return super.callFuncAndReturnList("{?=call PKG_WF.F_WF_GET_BACK_NODES(?, ?)}", nodeId, wfInsId);
    }

    @Override
    public void processSqlPost(String sql) {
        super.getJdbcTemplate().execute(sql);
    }

    @Override
    public void processProcedurePost(String procedureName, Long wfInsId) {
        super.prepareCallNoReturn("{call " + procedureName + "(?, ?)}", wfInsId);
    }

    @Override
    public List<Map<String, Object>> getAllWfVariableIns(Long wfInsId) {
        return super.getJdbcTemplate().queryForList(
                "SELECT V.NAME, VI.VALUE\n" +
                        "                 FROM SYS_WORKFLOW_VARIABLE          V,\n" +
                        "                      SYS_WORKFLOW_VARIABLE_INSTANCE VI\n" +
                        "                WHERE V.ID = VI.VARIABLE_ID\n" +
                        "                  AND V.SFYX_ST = '1'\n" +
                        "                  AND VI.SFYX_ST = '1'\n" +
                        "                  AND VI.WORKFLOW_INSTANCE_ID = ?", wfInsId);
    }

    @Override
    public List<Map<String, Object>> getWorkflowOperations(Long wiId) {
        if (null != wiId) {
            return super.getJdbcTemplate().queryForList("SELECT O.TASK_ID,\n" +
                    "       O.USER_ID,\n" +
                    "       NODE.NAME NODE_NAME,\n" +
                    "       U.USER_NAME,\n" +
                    "       (SELECT WM_CONCAT(DISTINCT(ORGAN.ORGAN_NAME))\n" +
                    "          FROM SYS_GLB_USER US, SYS_ORGAN ORGAN\n" +
                    "         WHERE US.ORGAN_ID = ORGAN.ID\n" +
                    "           AND US.USER_ID = U.ID) ORGAN_NAME,\n" +
                    "       O.OPERATION,\n" +
                    "       T.OPINION,\n" +
                    "       O.CJSJ\n" +
                    "  FROM SYS_WORKFLOW_OPERATION O, SYS_TASK_INSTANCE T, SYS_USER U,SYS_NODE NODE,SYS_NODE_INSTANCE NODEINS\n" +
                    " WHERE T.ID = O.TASK_ID\n" +
                    "   AND U.ID = O.USER_ID\n" +
                    "   AND NODE.ID = NODEINS.NODE_ID\n" +
                    "   AND NODEINS.ID = T.NODE_INSTANCE_ID\n" +
                    "   AND (O.OPERATION != 'SIGN' OR (O.OPERATION = 'SIGN' AND T.OPINION IS NULL))\n" +
                    "   AND T.WORKFLOW_INSTANCE_ID = ?\n" +
                    " ORDER BY O.ID ASC", wiId);
        } else {
            return Collections.emptyList();
        }
    }

    @Override
    public FastPagination getDbList(Map map) {
        StringBuilder sql = new StringBuilder();
        List<Object> params = new ArrayList<>();
        if ("1".equals(map.get("withoutNbrw"))) {
            sql.append("SELECT * FROM V_WF_DBRW_NO_NBRW D WHERE 1=1 ");
        } else {
            sql.append("SELECT * FROM V_WF_DBRW D WHERE 1=1 ");
        }
        //办理人
        if (RxStringUtils.isNotEmpty(map.get("userId"))) {
            sql.append(" AND USER_ID = ? ");
            params.add(map.get("userId"));
        }
        if (RxStringUtils.isNotEmpty(map.get("wfId"))) {
            sql.append(" AND WF_ID = ? ");
            params.add(map.get("wfId"));
        } else if (RxStringUtils.isNotEmpty(map.get("wfName"))) {
            sql.append(" AND WF_NAME like ? ");
            params.add("%" + map.get("wfName") + "%");
        }
        //流程code
        if (RxStringUtils.isNotEmpty(map.get("wfCode"))) {
            sql.append(" AND WF_CODE = ? ");
            params.add(map.get("wfCode"));
        }
        //时间
        return super.getPaginationBySql(sql, params, map);
    }

    @Override
    public FastPagination getZbList(Map map) {
        StringBuilder sql = new StringBuilder("SELECT * FROM V_WF_ZBLC D WHERE 1=1 ");
        List<Object> params = new ArrayList<>();
//        //办理人
        if (RxStringUtils.isNotEmpty(map.get("userId"))) {
            sql.append(" AND QDR_ID = ? ");
            params.add(map.get("userId"));
        }
        //流程名称
        if (RxStringUtils.isNotEmpty(map.get("wfId"))) {
            sql.append(" AND WF_ID = ? ");
            params.add(map.get("wfId"));
        } else if (RxStringUtils.isNotEmpty(map.get("wfName"))) {
            sql.append(" AND WF_NAME like ? ");
            params.add("%" + map.get("wfName") + "%");
        }
        if (RxStringUtils.isNotEmpty(map.get("startTime"))) {
            sql.append(" AND QDSJ >=to_date( ?,'YYYY-MM-DD hh24:mi:ss')");
            params.add(map.get("startTime"));
        }
        if (RxStringUtils.isNotEmpty(map.get("endTime"))) {
            sql.append(" AND QDSJ <=to_date( ? ,'YYYY-MM-DD hh24:mi:ss')");
            params.add(map.get("endTime"));
        }

//        ///是否已经完成
//        if (RxStringUtils.isNotEmpty(map.get("isFinish"))) {
//            sql.append(" AND WF_STATUS != 0 ");
//        }
        //时间
        return super.getPaginationBySql(sql, params, map);
    }

    @Override
    public FastPagination getYbList(Map map) {
        StringBuilder sql = new StringBuilder("SELECT * FROM V_WF_YBRW D WHERE 1=1 ");
        List<Object> params = new ArrayList<>();
        //流程名称
        if (RxStringUtils.isNotEmpty(map.get("wfId"))) {
            sql.append(" AND WF_ID = ? ");
            params.add(map.get("wfId"));
        } else if (RxStringUtils.isNotEmpty(map.get("wfName"))) {
            sql.append(" AND WF_NAME like ? ");
            params.add("%" + map.get("wfName") + "%");
        }
        //办理人
        if (RxStringUtils.isNotEmpty(map.get("userId"))) {
            sql.append(" AND USER_ID = ? ");
            params.add(map.get("userId"));
        }
        return super.getPaginationBySql(sql, params, map);
    }

    @Override
    public FastPagination getUserTjList(Map map) {
        List<Object> params = new ArrayList<>();
        Long userId = Long.valueOf(map.get("userId").toString());
        Integer time = 0;
        if (RxStringUtils.isNotEmpty(map.get("timeType"))) {
            String timeType = map.get("timeType").toString();
            if (timeType.equals("week")) {
                time = 7;
            } else if (timeType.equals("day")) {
                time = 1;
            } else if (timeType.equals("month")) {
                time = 31;
            } else if (timeType.equals("year")) {
                time = 365;
            }
        }
        params.add(userId);
        params.add(time);
        params.add(userId);
        params.add(time);
        String sql = "SELECT T.USER_ID \"USER_ID\",\n" +
                "       T.WORKFLOW_ID \"WF_ID\",\n" +
                "       T.NAME \"WF_NAME\",\n" +
                "       SUM(CASE\n" +
                "             WHEN (T.STATUS = '0' OR T.STATUS = '1') THEN\n" +
                "              1\n" +
                "             ELSE\n" +
                "              0\n" +
                "           END) AS \"DBRW_NUM\", --待办任务数目(含草稿)\n" +
                "       SUM(CASE\n" +
                "             WHEN T.STATUS = '2' THEN\n" +
                "              1\n" +
                "             ELSE\n" +
                "              0\n" +
                "           END) AS \"YBRW_NUM\", --已办任务数目\n" +
                "       (SELECT COUNT(1)\n" +
                "          FROM SYS_WORKFLOW_INSTANCE SWI\n" +
                "         WHERE SWI.STARTUP_TYPE = '0'\n" +
                "           AND SWI.SFYX_ST = '1'\n" +
                "           AND SWI.WORKFLOW_ID = T.WORKFLOW_ID\n" +
                "           AND SWI.STARTUP_USER_ID = ?\n" +
                "           AND SWI.CJSJ > sysdate - ?) \"ZBLC_NUM\" --在办流程数目(我发起的流程)\n" +
                "  FROM (SELECT TI.USER_ID, WI.WORKFLOW_ID, W.NAME, TI.STATUS\n" +
                "          FROM SYS_TASK_INSTANCE     TI,\n" +
                "               SYS_WORKFLOW_INSTANCE WI,\n" +
                "               SYS_WORKFLOW          W\n" +
                "         WHERE TI.WORKFLOW_INSTANCE_ID = WI.ID\n" +
                "           AND TI.USER_ID = ?\n" +
                "           AND TI.CJSJ > sysdate - ?\n" +
                "           AND WI.WORKFLOW_ID = W.ID\n" +
                "           AND TI.SFYX_ST = '1'\n" +
                "           AND WI.SFYX_ST = '1'\n" +
                "           AND W.SFYX_ST = '1') T\n" +
                " GROUP BY T.USER_ID, T.WORKFLOW_ID, T.NAME\n" +
                " ORDER BY USER_ID, T.WORKFLOW_ID\n";
        return super.getPaginationBySql(sql, params, map);
    }

    @Override
    public List<Map<String, Object>> getUserTjList(Long userId, String timeType) {
        Integer time = 0;
        if (timeType.equals("week")) {
            time = 7;
        } else if (timeType.equals("day")) {
            time = 1;
        } else if (timeType.equals("month")) {
            time = 31;
        } else if (timeType.equals("year")) {
            time = 365;
        }
        String sql = "SELECT T.USER_ID \"USER_ID\",\n" +
                "       T.WORKFLOW_ID \"WF_ID\",\n" +
                "       T.NAME \"WF_NAME\",\n" +
                "       SUM(CASE\n" +
                "             WHEN (T.STATUS = '0' OR T.STATUS = '1') THEN\n" +
                "              1\n" +
                "             ELSE\n" +
                "              0\n" +
                "           END) AS \"DBRW_NUM\", --待办任务数目(含草稿)\n" +
                "       SUM(CASE\n" +
                "             WHEN T.STATUS = '2' THEN\n" +
                "              1\n" +
                "             ELSE\n" +
                "              0\n" +
                "           END) AS \"YBRW_NUM\", --已办任务数目\n" +
                "       (SELECT COUNT(1)\n" +
                "          FROM SYS_WORKFLOW_INSTANCE SWI\n" +
                "         WHERE SWI.STARTUP_TYPE = '0'\n" +
                "           AND SWI.SFYX_ST = '1'\n" +
                "           AND SWI.WORKFLOW_ID = T.WORKFLOW_ID\n" +
                "           AND SWI.STARTUP_USER_ID = ?\n" +
                "           AND SWI.CJSJ > sysdate - ?) \"ZBLC_NUM\" --在办流程数目(我发起的流程)\n" +
                "  FROM (SELECT TI.USER_ID, WI.WORKFLOW_ID, W.NAME, TI.STATUS\n" +
                "          FROM SYS_TASK_INSTANCE     TI,\n" +
                "               SYS_WORKFLOW_INSTANCE WI,\n" +
                "               SYS_WORKFLOW          W\n" +
                "         WHERE TI.WORKFLOW_INSTANCE_ID = WI.ID\n" +
                "           AND TI.USER_ID = ?\n" +
                "           AND TI.CJSJ > sysdate - ?\n" +
                "           AND WI.WORKFLOW_ID = W.ID\n" +
                "           AND TI.SFYX_ST = '1'\n" +
                "           AND WI.SFYX_ST = '1'\n" +
                "           AND W.SFYX_ST = '1') T\n" +
                " GROUP BY T.USER_ID, T.WORKFLOW_ID, T.NAME\n" +
                " ORDER BY USER_ID, T.WORKFLOW_ID\n";
        return getJdbcTemplate().queryForList(sql, userId, time, userId, time);
    }

    @Override
    public FastPagination getOrganTjList(Map map) {
        List<Object> params = new ArrayList<>();
        Long organId;
        try {
            organId = Long.valueOf(map.get("organId").toString());
        } catch (Exception e) {
            return new FastPagination();
        }
        Integer time = 0;
        if (RxStringUtils.isNotEmpty(map.get("timeType"))) {
            String timeType = map.get("timeType").toString();
            if (timeType.equals("week")) {
                time = 7;
            } else if (timeType.equals("day")) {
                time = 1;
            } else if (timeType.equals("month")) {
                time = 31;
            } else if (timeType.equals("year")) {
                time = 365;
            }
        }
        params.add(time);
        params.add(time);
        params.add(organId);
        String sql = "SELECT U.USER_NAME, U.ID USER_ID, \n" +
                "       NVL(B.DBRW_NUM, 0) DBRW_NUM,\n" +
                "       NVL(B.YBRW_NUM, 0) YBRW_NUM,\n" +
                "       NVL(B.ZBLC_NUM, 0) ZBLC_NUM\n" +
                " FROM SYS_USER U \n" +
                " LEFT JOIN (SELECT T.USER_ID \"USER_ID\",\n" +
                "       SUM(CASE\n" +
                "             WHEN (T.STATUS = '0' OR T.STATUS = '1') THEN\n" +
                "              1\n" +
                "             ELSE\n" +
                "              0\n" +
                "           END) AS \"DBRW_NUM\", --待办任务数目(含草稿)\n" +
                "       SUM(CASE\n" +
                "             WHEN T.STATUS = '2' THEN\n" +
                "              1\n" +
                "             ELSE\n" +
                "              0\n" +
                "           END) AS \"YBRW_NUM\", --已办任务数目\n" +
                "       (SELECT COUNT(1)\n" +
                "          FROM SYS_WORKFLOW_INSTANCE SWI\n" +
                "         WHERE SWI.STARTUP_TYPE = '0'\n" +
                "           AND SWI.SFYX_ST = '1'\n" +
                "           AND SWI.STARTUP_USER_ID = T.USER_ID\n" +
                "           AND SWI.CJSJ > sysdate - ?) \"ZBLC_NUM\" --在办流程数目(我发起的流程)\n" +
                "  FROM (SELECT TI.USER_ID, WI.WORKFLOW_ID, W.NAME, TI.STATUS\n" +
                "          FROM SYS_TASK_INSTANCE     TI,\n" +
                "               SYS_WORKFLOW_INSTANCE WI,\n" +
                "               SYS_WORKFLOW          W\n" +
                "         WHERE TI.WORKFLOW_INSTANCE_ID = WI.ID\n" +
                "           AND TI.CJSJ > sysdate - ?\n" +
                "           AND WI.WORKFLOW_ID = W.ID\n" +
                "           AND TI.SFYX_ST = '1'\n" +
                "           AND WI.SFYX_ST = '1'\n" +
                "           AND W.SFYX_ST = '1') T\n" +
                " GROUP BY T.USER_ID\n" +
                " ORDER BY USER_ID) B ON U.ID = B.USER_ID\n" +
                "   WHERE U.DEFAULT_ORGAN_ID = ? AND (U.SFYX_ST = '1' OR U.SFYX_ST = '3')\n";
        return super.getPaginationBySql(sql, params, map);
    }

    @Override
    public List<Map<String, Object>> getOrganTjList(Long organId, String timeType) {
        if (null == organId) {
            return new ArrayList<>();
        }
        Integer time = 0;
        if (timeType.equals("week")) {
            time = 7;
        } else if (timeType.equals("day")) {
            time = 1;
        } else if (timeType.equals("month")) {
            time = 31;
        } else if (timeType.equals("year")) {
            time = 365;
        }
        String sql = "SELECT U.USER_NAME, U.ID USER_ID, \n" +
                "       NVL(B.DBRW_NUM, 0) DBRW_NUM,\n" +
                "       NVL(B.YBRW_NUM, 0) YBRW_NUM,\n" +
                "       NVL(B.ZBLC_NUM, 0) ZBLC_NUM\n" +
                " FROM SYS_USER U \n" +
                " LEFT JOIN (SELECT T.USER_ID \"USER_ID\",\n" +
                "       SUM(CASE\n" +
                "             WHEN (T.STATUS = '0' OR T.STATUS = '1') THEN\n" +
                "              1\n" +
                "             ELSE\n" +
                "              0\n" +
                "           END) AS \"DBRW_NUM\", --待办任务数目(含草稿)\n" +
                "       SUM(CASE\n" +
                "             WHEN T.STATUS = '2' THEN\n" +
                "              1\n" +
                "             ELSE\n" +
                "              0\n" +
                "           END) AS \"YBRW_NUM\", --已办任务数目\n" +
                "       (SELECT COUNT(1)\n" +
                "          FROM SYS_WORKFLOW_INSTANCE SWI\n" +
                "         WHERE SWI.STARTUP_TYPE = '0'\n" +
                "           AND SWI.SFYX_ST = '1'\n" +
                "           AND SWI.STARTUP_USER_ID = T.USER_ID\n" +
                "           AND SWI.CJSJ > sysdate - ?) \"ZBLC_NUM\" --在办流程数目(我发起的流程)\n" +
                "  FROM (SELECT TI.USER_ID, WI.WORKFLOW_ID, W.NAME, TI.STATUS\n" +
                "          FROM SYS_TASK_INSTANCE     TI,\n" +
                "               SYS_WORKFLOW_INSTANCE WI,\n" +
                "               SYS_WORKFLOW          W\n" +
                "         WHERE TI.WORKFLOW_INSTANCE_ID = WI.ID\n" +
                "           AND TI.CJSJ > sysdate - ?\n" +
                "           AND WI.WORKFLOW_ID = W.ID\n" +
                "           AND TI.SFYX_ST = '1'\n" +
                "           AND WI.SFYX_ST = '1'\n" +
                "           AND W.SFYX_ST = '1') T\n" +
                " GROUP BY T.USER_ID\n" +
                " ORDER BY USER_ID) B ON U.ID = B.USER_ID\n" +
                "   WHERE U.DEFAULT_ORGAN_ID = ? AND (U.SFYX_ST = '1' OR U.SFYX_ST = '3')\n";
        return getJdbcTemplate().queryForList(sql, time, time, organId);
    }

    @Override
    public FastPagination getNbList(Map map) {
        StringBuilder sql = new StringBuilder("SELECT * FROM V_WF_NBRW D WHERE 1=1 ");
        List<Object> params = new ArrayList<>();
        //办理人
        if (RxStringUtils.isNotEmpty(map.get("userId"))) {
            sql.append(" AND USER_ID = ? ");
            params.add(map.get("userId"));
        }
        if (RxStringUtils.isNotEmpty(map.get("wfId"))) {
            sql.append(" AND WF_ID = ? ");
            params.add(map.get("wfId"));
        } else if (RxStringUtils.isNotEmpty(map.get("wfName"))) {
            sql.append(" AND WF_NAME like ? ");
            params.add("%" + map.get("wfName") + "%");
        }
        //流程code
        if (RxStringUtils.isNotEmpty(map.get("wfCode"))) {
            sql.append(" AND WF_CODE = ? ");
            params.add(map.get("wfCode"));
        }
        //时间
        return super.getPaginationBySql(sql, params, map);
    }

    @Override
    public List<Map<String, Object>> getSubWorkflowInstanceList(Long nodeInstanceId) {
        return this.getJdbcTemplate().queryForList("SELECT WI.ID,\n" +
                "       WI.CJSJ,\n" +
                "       WI.FINISH_DATE,\n" +
                "       WI.STATUS,\n" +
                "       (SELECT U.USER_NAME FROM SYS_USER U WHERE U.ID = WI.STARTUP_USER_ID) AS STARTUP_USER\n" +
                "  FROM SYS_WORKFLOW_INSTANCE WI, SYS_NODE_INS_GLB_WF_INS GLB\n" +
                " WHERE WI.ID = GLB.WF_INS_ID\n" +
                "   AND GLB.NODE_INS_ID = ?", nodeInstanceId);
    }

    @Override
    public List<Map<String, Object>> getSubWorkflowInstanceList(SysNode node, Long wfInsId) {
        return this.getJdbcTemplate().queryForList("SELECT WI.ID,\n" +
                "       WI.CJSJ,\n" +
                "       WI.FINISH_DATE,\n" +
                "       WI.STATUS,\n" +
                "       (SELECT U.USER_NAME FROM SYS_USER U WHERE U.ID = WI.STARTUP_USER_ID) AS STARTUP_USER\n" +
                "  FROM SYS_WORKFLOW_INSTANCE WI \n" +
                " WHERE WI.ID IN (SELECT GLB.WF_INS_ID FROM SYS_NODE_INS_GLB_WF_INS GLB\n" +
                "   WHERE GLB.NODE_INS_ID IN (SELECT ID FROM SYS_NODE_INSTANCE WHERE NODE_ID=? AND WORKFLOW_INSTANCE_ID=?)) " +
                " ORDER BY CJSJ DESC,FINISH_DATE DESC", node.getId(), wfInsId);
    }
}
