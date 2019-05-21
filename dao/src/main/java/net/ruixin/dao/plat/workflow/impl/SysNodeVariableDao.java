package net.ruixin.dao.plat.workflow.impl;

import net.ruixin.dao.plat.workflow.ISysNodeVariableDao;
import net.ruixin.domain.plat.workflow.structure.node.SysNode;
import net.ruixin.domain.plat.workflow.structure.node.SysNodeVariable;
import net.ruixin.util.hibernate.BaseDao;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;


/**
 * 环节变量DAO接口实现
 */
@SuppressWarnings({"SqlDialectInspection", "SqlNoDataSourceInspection"})
@Repository
public class SysNodeVariableDao extends BaseDao<SysNodeVariable> implements ISysNodeVariableDao {
    @Override
    public SysNodeVariable get(Long nodeVariableId) {
        return super.get(nodeVariableId);
    }

    @Override
    public void saveSysNodeVariable(SysNodeVariable nodeVariableAssign) {
        super.saveOrUpdate(nodeVariableAssign);
    }

    @Override
    public List<SysNodeVariable> getNodeVariable(SysNode node) {
//        String sql = "SELECT ID \"id\", \n" +
//                "NAME \"name\", \n" +
//                "CODE \"code\", \n" +
//                "VALUE \"value\", \n" +
//                "ASSIGN_LOGIC \"assignLogic\", \n" +
//                "NODE_ID \"nodeId\", \n" +
//                "SFYX_ST \"sfyxSt\"  FROM SYS_NODE_VARIABLE  WHERE NODE_ID=?";
        String sql = "from SysNodeVariable where nodeId = ?";
        return super.findListByHql(sql,node.getId());
    }
}
