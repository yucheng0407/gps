package net.ruixin.dao.plat.workflow;

import net.ruixin.domain.plat.workflow.structure.node.SysNodeProcess;
import net.ruixin.util.hibernate.IBaseDao;

import java.util.List;

/**
 * 环节后置DAO
 * @Author: mxding
 * @Date: 2019-03-26 14:28
 */
public interface ISysNodeProcessDao extends IBaseDao<SysNodeProcess> {

    /**
     * 获取环节关联的环节后置
     * @param nodeId 环节ID
     * @return
     */
    List<SysNodeProcess> listNodeProcess(Long nodeId);
}
