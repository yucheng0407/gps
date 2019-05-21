package net.ruixin.dao.plat.workflow.impl;

import net.ruixin.dao.plat.workflow.ISysWorkflowProcessDao;
import net.ruixin.domain.plat.workflow.structure.frame.SysWorkflowProcess;
import net.ruixin.util.hibernate.BaseDao;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @Author: mxding
 * @Date: 2019-03-26 14:33
 */
@Repository
public class SysWorkflowProcessDao extends BaseDao<SysWorkflowProcess> implements ISysWorkflowProcessDao {


    @Override
    public List<SysWorkflowProcess> listWorkflowProcess(Long workflowId) {
        return super.findListByHql("from SysWorkflowProcess p where p.workflowId = ? and p.sfyxSt = '1' order by p.sort, p.id", workflowId);
    }
}
