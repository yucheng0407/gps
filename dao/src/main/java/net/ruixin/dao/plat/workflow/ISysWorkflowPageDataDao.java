package net.ruixin.dao.plat.workflow;

import net.ruixin.domain.plat.workflow.instance.SysWorkflowPageData;

import java.util.List;
import java.util.Map;


/*
*
* */
public interface ISysWorkflowPageDataDao {

    /**
     * 根据流程实例和页面id获取数据
     * @param wiId
     * @param pageId
     * @return
     */
    SysWorkflowPageData getWorkflowPageData(Long wiId,Long pageId);

    /**
     * 根据流程实例获取SysWorkflowPageData
     * @param wiId 流程实例id
     * @return
     */
    List<SysWorkflowPageData> getWorkflowPageData(Long wiId);

    /**
     * 根据流程实例id删除数据
     * @param wiId
     */
    void delDate(Long wiId);

    /**
     *  获取页面数据
     * @param wiId 流程实例id
     * @return
     */
    Map<String,Map<String,Object>> getWorkflowPageDatas(Long wiId);
}
