package net.ruixin.dao.plat.workflow.impl;

import net.ruixin.dao.plat.workflow.ISysNodeProcessDao;
import net.ruixin.domain.plat.workflow.structure.node.SysNodeProcess;
import net.ruixin.util.hibernate.BaseDao;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @Author: mxding
 * @Date: 2019-03-26 14:33
 */
@Repository
public class SysNodeProcessDao extends BaseDao<SysNodeProcess> implements ISysNodeProcessDao {


    @Override
    public List<SysNodeProcess> listNodeProcess(Long nodeId) {
        return super.findListByHql("from SysNodeProcess p where p.nodeId = ? and p.sfyxSt = '1' order by p.sort, p.id", nodeId);
    }
}
