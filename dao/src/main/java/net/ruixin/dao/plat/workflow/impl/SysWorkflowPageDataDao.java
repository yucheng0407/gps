package net.ruixin.dao.plat.workflow.impl;

import net.ruixin.dao.plat.workflow.ISysWorkflowPageDataDao;
import net.ruixin.domain.plat.workflow.instance.SysWorkflowPageData;
import net.ruixin.util.hibernate.BaseDao;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@SuppressWarnings({"SqlDialectInspection", "SqlNoDataSourceInspection"})
@Repository
public class SysWorkflowPageDataDao extends BaseDao<SysWorkflowPageData> implements ISysWorkflowPageDataDao {

    @Override
    public SysWorkflowPageData getWorkflowPageData(Long wiId, Long pageId) {
        return this.getByHql("from SysWorkflowPageData t where t.workflowInstanceId = ? " +
                "and t.pageId = ? and t.sfyxSt = '1')", wiId, pageId);
    }

    @Override
    public List<SysWorkflowPageData> getWorkflowPageData(Long wiId) {
        return this.findListByHql("from SysWorkflowPageData t where t.workflowInstanceId = ? " +
                "and t.sfyxSt = '1')", wiId);
    }

    @Override
    public void delDate(Long wiId) {
        String sql = "DELETE FROM SYS_WORKFLOW_PAGE_DATA_INS WHERE WORKFLOW_INSTANCE_ID = ?";
        this.getJdbcTemplate().update(sql, wiId);
    }

    @Override
    public Map<String, Map<String, Object>> getWorkflowPageDatas(Long wiId) {
        Map<String, Map<String, Object>> map = new HashMap<>();
        //查询tableName、dataId、form_id
        String sql = "SELECT INS.FORM_ID, INS.DATA_ID,DEF.TABLE_NAME\n" +
                "  FROM SYS_WORKFLOW_PAGE_DATA_INS INS,SYS_FORM_DEF DEF\n" +
                " WHERE INS.WORKFLOW_INSTANCE_ID = ? \n" +
                "   AND INS.SFYX_ST = '1'\n" +
                "   AND INS.FORM_ID IS NOT NULL\n" +
                "   AND INS.DATA_ID IS NOT NULL\n" +
                "   AND DEF.ID = INS.FORM_ID\n" +
                "   AND DEF.SFYX_ST = '1'\n" +
                "   AND DEF.TABLE_NAME IS NOT NULL";
        List<Map<String, Object>> list = super.getJdbcTemplate().queryForList(sql, wiId);
        Map<String, Object> obj;
        String dataSql;
        for (int i = 0; i < list.size(); i++) {
            obj = list.get(i);
            //获取tableName、dataId、form_id
            dataSql = "select * from " + obj.get("TABLE_NAME") + " where id = ?";
            Map<String, Object> res = super.getJdbcTemplate().queryForMap(dataSql, obj.get("DATA_ID"));
            map.put("form_" + obj.get("FORM_ID"), res);
        }
        return map;
    }
}
