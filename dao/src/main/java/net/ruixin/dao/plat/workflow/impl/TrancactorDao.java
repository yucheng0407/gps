package net.ruixin.dao.plat.workflow.impl;

import net.ruixin.dao.plat.workflow.ITransactorDao;
import net.ruixin.domain.plat.workflow.transactor.SysWorkflowTransactor;
import net.ruixin.util.hibernate.BaseDao;
import net.ruixin.util.paginate.FastPagination;
import net.ruixin.util.tools.RxStringUtils;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;


@SuppressWarnings({"SqlDialectInspection", "SqlNoDataSourceInspection"})
@Repository
public class TrancactorDao extends BaseDao<SysWorkflowTransactor> implements ITransactorDao {
   @Override
    public SysWorkflowTransactor getTransactorById(Long id){
       return super.get(id);
   }

    @Override
    public FastPagination getTransactorList(Map map) {
        List<Object> params = new ArrayList<>();
        StringBuilder sql = new StringBuilder("SELECT T.ID,\n" +
                "       T.NAME,\n" +
                "       T.XGSJ,\n" +
                "       (SELECT WM_CONCAT(DISTINCT(GET_DICT_VALUE(SOURCE.TYPE,'BLRLYLX')))\n" +
                "          FROM SYS_WORKFLOW_TRANSACTOR_SOURCE SOURCE\n" +
                "         WHERE T.ID = SOURCE.TRANSACTOR_ID AND SOURCE.SFYX_ST = '1') TYPE\n" +
                "  FROM SYS_WORKFLOW_TRANSACTOR T\n" +
                " WHERE T.SFYX_ST = '1' ");
        if (RxStringUtils.isNotEmpty(map.get("NAME"))) {
            sql.append(" and t.name like ? ");
            params.add("%" + map.get("NAME") + "%");
        }
        sql.append(" ORDER BY T.XGSJ DESC");
        return super.getPaginationBySql(sql, params, map);
    }
}
