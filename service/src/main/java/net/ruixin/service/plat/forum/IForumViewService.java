package net.ruixin.service.plat.forum;

import net.ruixin.service.plat.common.IBaseService;

/**
 * @Author: mxding
 * @Date: 2019-02-15 08:58
 */
public interface IForumViewService extends IBaseService {

    /**
     * 保存论坛查看记录
     * @param objectId
     * @param viewType
     */
    void saveForumView(Long objectId, String viewType);
}
