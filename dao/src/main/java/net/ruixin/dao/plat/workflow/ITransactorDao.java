package net.ruixin.dao.plat.workflow;


import net.ruixin.domain.plat.workflow.transactor.SysWorkflowTransactor;
import net.ruixin.util.paginate.FastPagination;

import java.util.Map;

public interface ITransactorDao {

    /**
     * 根据主键获取办理人
     * @param id
     * @return
     */
    SysWorkflowTransactor getTransactorById(Long id);

    /**
     * 分页查询
     *
     * @param map
     * @return
     */
    FastPagination getTransactorList(Map map);
}
