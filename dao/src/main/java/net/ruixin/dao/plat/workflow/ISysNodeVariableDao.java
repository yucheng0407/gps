package net.ruixin.dao.plat.workflow;

import net.ruixin.domain.plat.workflow.structure.node.SysNode;
import net.ruixin.domain.plat.workflow.structure.node.SysNodeVariable;

import java.util.List;
import java.util.Map;


/**
 * 环节变量DAO接口
 */
public interface ISysNodeVariableDao {
    /**
     * 获取环节变量
     * @param nodeVariableId 环节变量ID
     * @return 环节变量实体
     */
    SysNodeVariable get(Long nodeVariableId);

    /**
     * 保存
     * @param nodeVariableAssign
     */
    void saveSysNodeVariable(SysNodeVariable nodeVariableAssign);

    /**
     * 获取变量
     */
    List<SysNodeVariable> getNodeVariable(SysNode node);
}
