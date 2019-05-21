package net.ruixin.dao.plat.workflow;

import net.ruixin.domain.plat.workflow.structure.node.SysNodeTransactor;

import java.util.List;

/**
 * 环节办理人配置DAO
 */
public interface ISysNodeTransactorDao {
    SysNodeTransactor get(Long id);

    /**
     * 根据环节查询办理人配置
     * @param nodeId 环节Id
     * @return
     */
    List<SysNodeTransactor> queryTransactorByNode(Long nodeId);

    void save(SysNodeTransactor nodeTransactor);
}
