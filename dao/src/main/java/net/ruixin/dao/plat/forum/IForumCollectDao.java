package net.ruixin.dao.plat.forum;

import net.ruixin.domain.plat.forum.SysForumCollect;
import net.ruixin.util.hibernate.IBaseDao;

/**
 * @Author: mxding
 * @Date: 2019-02-26 16:21
 */
public interface IForumCollectDao extends IBaseDao<SysForumCollect> {

    /**
     * 取消收藏帖子
     * @param topicId
     * @param userId
     */
    void cancelCollectTopic(Long topicId, Long userId);

    /**
     * 主题帖是否被用户收藏
     * @param topicId
     * @param userId
     * @return
     */
    boolean isTopicCollect(Long topicId, Long userId);

}
