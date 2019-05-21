package net.ruixin.service.plat.workflow;

import net.ruixin.domain.plat.workflow.transactor.SysNodeAssigneeCondition;
import net.ruixin.domain.plat.workflow.transactor.SysWorkflowTransactor;
import net.ruixin.util.paginate.FastPagination;

import java.util.Map;

public interface ITransactorService {

    /**
     * 保存
     *
     * @param transactor
     * @return
     */
    Long saveTransactor(SysWorkflowTransactor transactor);

    /**
     * 通过id获取
     *
     * @param id
     * @return
     */
    SysWorkflowTransactor getTransactorById(Long id);

    /**
     * 保存
     *
     * @param nodeAssigneeCondition
     * @return
     */
    Long saveCondition(SysNodeAssigneeCondition nodeAssigneeCondition);

    /**
     * 分页查询
     *
     * @param map
     * @return
     */
    FastPagination getTransactorList(Map map);

    /**
     * 删除
     * @param id
     * @return
     */
    void delTransactor(Long id);
}
