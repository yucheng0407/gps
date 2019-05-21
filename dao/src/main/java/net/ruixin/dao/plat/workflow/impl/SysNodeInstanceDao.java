package net.ruixin.dao.plat.workflow.impl;

import net.ruixin.dao.plat.workflow.ISysNodeInstanceDao;
import net.ruixin.domain.constant.Workflow;
import net.ruixin.domain.plat.workflow.instance.SysNodeInstance;
import net.ruixin.domain.plat.workflow.instance.SysWorkflowInstance;
import net.ruixin.enumerate.plat.NodeType;
import net.ruixin.util.hibernate.BaseDao;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * 环节实例Dao实现
 * Created by Jealous on 2016-10-25.
 */
@SuppressWarnings({"SqlDialectInspection", "SqlNoDataSourceInspection"})
@Repository
public class SysNodeInstanceDao extends BaseDao<SysNodeInstance> implements ISysNodeInstanceDao{
    @Override
    public List<SysNodeInstance> getSysNodeInstanceListByWorkflowInstanceId(Long id) {
        return super.findListByHql("from SysNodeInstance t where t.workflow_instance_id.id=? order by t.id desc",id);
    }

//    @Override
//    public List<SysNodeInstance> findNodeInstancesByWorkflowInstance(SysWorkflowInstance workflowInstance) {
//        return super.findListByHql("from SysNodeInstance t where t.workflow_instance_id=? order by t.id desc",workflowInstance);
//    }

    @Override
    public List<SysNodeInstance> findActivityNodeInstanceByWorkflowInstance(SysWorkflowInstance workflowInstance){
        return super.findListByHql("from SysNodeInstance n where n.workflow_instance_id=? and n.node_id.type=?",
                workflowInstance,NodeType.ACTIVITY_NODE);
    }

    @Override
    public SysNodeInstance findRunningNode(SysWorkflowInstance workflowInstance) {
        return super.getByHql("from SysNodeInstance t where t.status='1' and t.workflow_instance_id=?",workflowInstance);
    }

    @Override
    public String getRunningNodeIds(Long wiId) {
        return super.getJdbcTemplate().queryForObject("select wm_concat(t.node_id) from sys_node_instance t where t.workflow_instance_id = ? and t.status='1' and t.sfyx_st = '1'",String.class,wiId);
    }

    @Override
    public List<SysNodeInstance> getTransactList(Long workflowInstanceId, Long transactNodeid) {
        return super.findListByHql("from SysNodeInstance t where t.workflow_instance_id.id=? and t.node_id.id=? order by t.cjsj desc",workflowInstanceId,transactNodeid);
    }

    @Override
    public List<Map<String,Object>> getNestedNodeInstanceList(Long workflowInstanceId){
        return super.getJdbcTemplate().queryForList("SELECT G.*\n" +
                "  FROM (SELECT T.*,\n" +
                        "               ROW_NUMBER() OVER(PARTITION BY NODE_ID ORDER BY CJSJ DESC) AS ROW_ID\n" +
                        "          FROM (SELECT WI.STATUS,\n" +
                        "                       GLB.CJSJ,\n" +
                        "                       N.DOM_ID,\n" +
                        "                       NI.STATUS AS NI_STATUS,\n" +
                        "                       NI.NODE_ID AS NODE_ID\n" +
                        "                  FROM SYS_WORKFLOW_INSTANCE   WI,\n" +
                        "                       SYS_NODE_INS_GLB_WF_INS GLB,\n" +
                        "                       SYS_NODE_INSTANCE       NI,\n" +
                        "                       SYS_NODE                N\n" +
                        "                 WHERE WI.ID = GLB.WF_INS_ID\n" +
                        "                   AND GLB.NODE_INS_ID = NI.ID\n" +
                        "                   AND NI.WORKFLOW_INSTANCE_ID = ?\n" +
                        "                   AND NI.NODE_ID = N.ID\n" +
                        "                   AND N.TYPE = ?\n" +
                        "                   AND NI.SFYX_ST = '1'\n" +
                        "                   AND N.SFYX_ST = '1') T) G\n" +
                        " WHERE G.ROW_ID = 1",workflowInstanceId,NodeType.NESTED_NODE.getId());
    }
}
