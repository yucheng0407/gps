package net.ruixin.dao.plat.forum;

import net.ruixin.domain.plat.forum.SysForumFollow;
import net.ruixin.util.hibernate.IBaseDao;

/**
 * 跟帖dao
 * @Author: mxding
 * @Date: 2019-02-22 14:26
 */
public interface IForumFollowDao extends IBaseDao<SysForumFollow> {

    /**
     * 获取跟帖楼层
     * @param topicId
     * @return
     */
    Long getFollowFloor(Long topicId);
}
