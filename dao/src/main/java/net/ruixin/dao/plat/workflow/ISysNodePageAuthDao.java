package net.ruixin.dao.plat.workflow;

import net.ruixin.domain.plat.workflow.structure.page.SysNodePageAuth;

import java.util.List;
import java.util.Map;

/**
 * 环节页面权限DAO接口
 */
public interface ISysNodePageAuthDao {

    /**
     * 根据page和domid获取权限
     *
     * @param pageId
     * @param domId
     * @return
     */
    List<Map<String, Object>> getAuths(Long pageId, String domId);

    /**
     * 保存
     *
     * @param nodePageAuths
     * @param pageId
     * @param domId
     */
    void saveNodePageAuth(List<SysNodePageAuth> nodePageAuths, Long pageId, String domId);

    /**
     *
     */
    /**
     *  删除
     * @param domId 节点id
     * @param unDelPageIds 排除的pageIds，以逗号隔开
     */
    void delNodePageAuth(String domId, String unDelPageIds);
}
