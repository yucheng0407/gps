package net.ruixin.dao.plat.workflow.impl;

import net.ruixin.dao.plat.workflow.ISysWorkflowVariableInstanceDao;
import net.ruixin.domain.plat.workflow.instance.SysWorkflowInstance;
import net.ruixin.domain.plat.workflow.instance.SysWorkflowVariableInstance;
import net.ruixin.domain.plat.workflow.structure.frame.SysWorkflowVariable;
import net.ruixin.util.hibernate.BaseDao;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * 流程变量实例DAO接口
 * <p>
 * Created by Jealous on 2016-11-7.
 */
@SuppressWarnings({"SqlDialectInspection", "SqlNoDataSourceInspection"})
@Repository
public class SysWorkflowVariableInstanceDao extends BaseDao<SysWorkflowVariableInstance> implements ISysWorkflowVariableInstanceDao {
    @Override
    public SysWorkflowVariableInstance getByVariableAndWfi(SysWorkflowVariable workflowVariable, SysWorkflowInstance workflowInstance) {
        return super.getByHql("from SysWorkflowVariableInstance t where t.workflow_instance_id = ? and t.variable_id = ? and t.sfyxSt = '1'", workflowInstance, workflowVariable);
    }

    @Override
    public void save(SysWorkflowVariableInstance swvi) {
        super.getSession().saveOrUpdate(swvi);
    }

    @Override
    public List<Map<String, Object>> getWfVars(Long wiId) {
        String sql = "SELECT  WFVAR.NAME,INS.VALUE\n" +
                "  FROM SYS_WORKFLOW_VARIABLE_INSTANCE INS, SYS_WORKFLOW_VARIABLE WFVAR\n" +
                " WHERE WFVAR.ID = INS.VARIABLE_ID\n" +
                "   AND INS.WORKFLOW_INSTANCE_ID = ? " +
                "   AND INS.SFYX_ST = '1' " +
                "   AND WFVAR.SFYX_ST = '1' ";
        return super.getJdbcTemplate().queryForList(sql, wiId);
    }
}
