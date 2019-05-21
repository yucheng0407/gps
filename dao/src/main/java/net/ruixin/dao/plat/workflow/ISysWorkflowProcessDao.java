package net.ruixin.dao.plat.workflow;

import net.ruixin.domain.plat.workflow.structure.frame.SysWorkflowProcess;
import net.ruixin.util.hibernate.IBaseDao;

import java.util.List;

/**
 * 流程后置DAO
 * @Author: mxding
 * @Date: 2019-03-26 14:28
 */
public interface ISysWorkflowProcessDao extends IBaseDao<SysWorkflowProcess> {

    /**
     * 获取流程关联的环节后置
     * @param workflowId 环节ID
     * @return
     */
    List<SysWorkflowProcess> listWorkflowProcess(Long workflowId);
}
