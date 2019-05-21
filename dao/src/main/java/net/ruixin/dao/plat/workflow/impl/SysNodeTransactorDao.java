package net.ruixin.dao.plat.workflow.impl;

import net.ruixin.dao.plat.workflow.ISysNodeTransactorDao;
import net.ruixin.domain.plat.workflow.structure.node.SysNodeTransactor;
import net.ruixin.enumerate.plat.SfyxSt;
import net.ruixin.util.hibernate.BaseDao;
import org.springframework.stereotype.Repository;

import java.util.List;

@SuppressWarnings({"SqlDialectInspection", "SqlNoDataSourceInspection"})
@Repository
public class SysNodeTransactorDao extends BaseDao<SysNodeTransactor> implements ISysNodeTransactorDao {

    @Override
    public SysNodeTransactor get(Long id) {
        return super.get(id);
    }

    @Override
    public List<SysNodeTransactor> queryTransactorByNode(Long nodeId) {
        return this.findListByHql("from SysNodeTransactor where node.id=? and node.sfyxSt=?", nodeId, SfyxSt.VALID);
    }

    @Override
    public void save(SysNodeTransactor nodeTransactor) {
        super.saveOrUpdate(nodeTransactor);
    }
}
