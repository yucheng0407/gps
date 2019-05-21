package net.ruixin.service.plat.forum;

import net.ruixin.domain.plat.forum.SysForumFollow;
import net.ruixin.service.plat.common.IBaseService;

/**
 * @Author: mxding
 * @Date: 2019-02-22 14:28
 */
public interface IForumFollowService extends IBaseService {

    /**
     * 保存跟帖
     * @param forumFollow
     */
    void saveFollow(SysForumFollow forumFollow);
}
